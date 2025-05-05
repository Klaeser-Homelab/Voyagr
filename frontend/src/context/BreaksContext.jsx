import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useValues } from './ValuesContext';
const BreaksContext = createContext();

export const BreaksProvider = ({ children }) => {
  const { breaks, addBreak, updateBreak, deleteBreak } = useValues();
  const [breakDuration, setBreakDuration] = useState(0);  

  useEffect(() => {
    console.log('breaks', breaks);
  }, [breaks]);

  // After 2 hours of work, you get a long break
  const updateCycleDuration = (duration) => {
    const newDuration = breakDuration + duration;
    console.log('newDuration', newDuration);
    console.log('breaks', breaks);
    const lastBreakInterval = breaks[breaks.length - 1].interval; // Assuming breaks is sorted
    if (newDuration > lastBreakInterval) { // Compare with the last break's interval
      console.log('resetting');
      setBreakDuration(newDuration - lastBreakInterval);
    }
    else{
      console.log('not resetting');
      setBreakDuration(newDuration);
    }
  }

  const getBreak = (duration) => {
    console.log('getting break', duration);
    updateCycleDuration(duration);
    // Sort breaks by interval in ascending order
    const sortedBreaks = [...breaks].sort((a, b) => a.interval - b.interval);
    console.log('sortedBreaks', sortedBreaks);
    // Find the longest break whose interval is less than or equal to the duration
    for (let i = sortedBreaks.length - 1; i >= 0; i--) {
      if (duration >= sortedBreaks[i].interval) {
        return sortedBreaks[i];
      }
    }
    return null; // Return null if no break is found
  }

  const value = {
    getBreak
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