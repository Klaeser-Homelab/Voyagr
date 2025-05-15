import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../config/api';

const TodayContext = createContext(null);

export const TodayProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await api.get('/api/events/today');
      setEvents(response.data);
      setError(null);
      //console.log('events', response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
    }
  }, []);

  const value = {
    events,
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