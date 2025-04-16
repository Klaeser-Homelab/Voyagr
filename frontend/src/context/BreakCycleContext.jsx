import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';

const BreakCycleContext = createContext();

export const useBreakCycle = () => {
  const context = useContext(BreakCycleContext);
  if (!context) {
    throw new Error('useBreakCycle must be used within a BreakCycleProvider');
  }
  return context;
};

export const BreakCycleProvider = ({ children }) => {
  //const [breakCycle, setBreakCycle] = useState(0);
  const [breaks, setBreaks] = useState([]);

  useEffect(() => {
    fetchBreaks();
  }, []);

  const fetchBreaks = async () => {
    try {
      const response = await axios.get(api.endpoints.habits + '/breaks', {
        withCredentials: true
      });
      setBreaks(response.data);
      console.log('breaks', response.data);
    } catch (error) {
      console.error('Failed to fetch breaks:', error);
    }
  };

  const getBreak = () => {
    return breaks[0];
  }

  const value = {
    getBreak
  }

  return <BreakCycleContext.Provider value={value}>{children}</BreakCycleContext.Provider>;
};
