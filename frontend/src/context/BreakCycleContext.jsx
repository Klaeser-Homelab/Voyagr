import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { api } from '../config/api';

const BreakCycleContext = createContext();

export const BreakCycleProvider = ({ children }) => {
  //const [breakCycle, setBreakCycle] = useState(0);
  const [breaks, setBreaks] = useState([]);
  const [breakDuration, setBreakDuration] = useState(0);  
  
  // After 2 hours of work, you get a long break
  const updateCycleDuration = (duration) => {
    const newDuration = breakDuration + duration;
    console.log('newDuration', newDuration);
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

  const fetchBreaks = useCallback(async () => {
    try {
      const response = await axios.get(api.endpoints.breaks, {
        withCredentials: true
      });
      setBreaks(response.data);
    } catch (error) {
      console.error('Failed to fetch breaks:', error);
    }
  }, []);

  const getBreak = (duration) => {
    console.log('getting break', duration);
    updateCycleDuration(duration);
    // Sort breaks by interval in ascending order
    const sortedBreaks = [...breaks].sort((a, b) => a.interval - b.interval);
    // Find the longest break whose interval is less than or equal to the duration
    for (let i = sortedBreaks.length - 1; i >= 0; i--) {
      if (duration >= sortedBreaks[i].interval) {
        return sortedBreaks[i];
      }
    }
    return null; // Return null if no break is found
  }

  const value = {
    getBreak,
    fetchBreaks
  }

  return <BreakCycleContext.Provider value={value}>{children}</BreakCycleContext.Provider>;
};

export const useBreakCycle = () => {
  const context = useContext(BreakCycleContext);
  if (!context) {
    throw new Error('useBreakCycle must be used within a BreakCycleProvider');
  }
  return context;
};