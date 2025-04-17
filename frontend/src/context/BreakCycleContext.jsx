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
    if (newDuration > 7200){ // 2 hours in seconds
      console.log('resetting');
      setBreakDuration(newDuration - 7200);
    }
    else{
      console.log('not resetting');
      setBreakDuration(newDuration);
    }
  }

  const fetchBreaks = useCallback(async () => {
    try {
      const response = await axios.get(api.endpoints.habits + '/breaks', {
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
    if (breakDuration < 500){
        return breaks[1];
    }
    else{
      return breaks[0];
    }
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