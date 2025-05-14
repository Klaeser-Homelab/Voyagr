import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useValues } from './ValuesContext';
import { useTimer } from './TimerContext';

const BreaksContext = createContext();

export const BreaksProvider = ({ children }) => {
  const { breaks, addBreak, updateBreak, deleteBreak } = useValues();
  const [breakDuration, setBreakDuration] = useState(0);  
  const { formatTime } = useTimer();
  // After 2 hours of work, you get a long break

  const updateCycleDuration = async(duration) => {
    const newDuration = breakDuration + duration;
    console.log('new duration', formatTime(newDuration));
    console.log('breaks', breaks);
    
    if (breaks.length === 0) {
      setBreakDuration(newDuration);
      return newDuration;
    }
    
    const lastBreakInterval = breaks[breaks.length - 1].interval; // Assuming breaks is sorted
    let finalDuration;
    
    if (newDuration > lastBreakInterval) { // Compare with the last break's interval
      console.log('resetting');
      finalDuration = newDuration - lastBreakInterval;
      setBreakDuration(finalDuration);
    } else {
      console.log('not resetting');
      finalDuration = newDuration;
      setBreakDuration(finalDuration);
    }
    
    // Return the calculated duration so getBreak can use it immediately
    return finalDuration;
  }

  const getBreak = async (duration) => {
    console.log('incrementing duration by', formatTime(duration));
    
    // Get the updated duration directly from updateCycleDuration
    const updatedBreakDuration = await updateCycleDuration(duration);
    
    // Sort breaks by interval in ascending order
    const sortedBreaks = [...breaks].sort((a, b) => a.interval - b.interval);
    console.log('sortedBreaks', sortedBreaks);
    console.log('updatedBreakDuration', updatedBreakDuration);
    
    // Find the interval that should be used
    let selectedInterval = null;
    for (let i = sortedBreaks.length - 1; i >= 0; i--) {
      console.log('sortedBreaks[i].interval', sortedBreaks[i].interval);
      if (updatedBreakDuration >= sortedBreaks[i].interval) {
        selectedInterval = sortedBreaks[i].interval;
        break;
      }
    }
    
    // Return the break that matches the selected interval
    if (selectedInterval !== null) {
      return sortedBreaks.filter(breakItem => breakItem.interval === selectedInterval)[0];
    }
    
    return null;
  }

  const getAlternativeBreaks = () => {
    const sortedBreaks = [...breaks].sort((a, b) => a.interval - b.interval);
    // Find the longest break whose interval is less than or equal to the duration
    // Find the interval that should be used (same logic as before)
    let selectedInterval = null;
    for (let i = sortedBreaks.length - 1; i >= 0; i--) {
      if (breakDuration >= sortedBreaks[i].interval) {
        selectedInterval = sortedBreaks[i].interval;
        break;
      }
    }
    
    
    if (selectedInterval !== null) {
      const matchingBreaks = sortedBreaks.filter(breakItem => breakItem.interval === selectedInterval);
      return matchingBreaks.slice(1); // Return all breaks except the first one
    }
    
    return []; // Return empty array if no break is found
  }

  const getUpcomingBreaks = () => {
    const sortedBreaks = [...breaks].sort((a, b) => a.interval - b.interval);
    // Find the longest break whose interval is less than or equal to the duration
    return sortedBreaks;
  }

  const value = {
    getBreak,
    getAlternativeBreaks,
    getUpcomingBreaks,
    breakDuration
  }

  return <BreaksContext.Provider value={value}>{children}</BreaksContext.Provider>;
};

export const useBreaks = () => {
  const context = useContext(BreaksContext);
  if (!context) {
    throw new Error('useBreaks must be used within a BreaksProvider');
  }
  return context;
};