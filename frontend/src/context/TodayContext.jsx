import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { api } from '../config/api';

const TodayContext = createContext(null);

export const TodayProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api.endpoints.events}/today`, {
        withCredentials: true
      });
      console.log('Events', response.data);
      setEvents(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    events,
    loading,
    error,
    fetchEvents
  };

  return (
    <TodayContext.Provider value={value}>
      {children}
    </TodayContext.Provider>
  );
};

export const useToday = () => {
  const context = useContext(TodayContext);
  if (!context) {
    throw new Error('useToday must be used within a TodayProvider');
  }
  return context;
}; 