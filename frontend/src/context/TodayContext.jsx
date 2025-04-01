import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { api } from '../config/api';

const TodayContext = createContext(null);

export const TodayProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api.endpoints.events}/today`);
      setEvents(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCompletedTodos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api.endpoints.todos}/completed/today/noevent`);
      setCompletedTodos(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching completed todos:', error);
      setError('Failed to load completed todos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchEvents(),
        fetchCompletedTodos()
      ]);
      setError(null);
    } catch (error) {
      console.error('Error fetching today data:', error);
      setError('Failed to load today data');
    } finally {
      setLoading(false);
    }
  }, [fetchEvents, fetchCompletedTodos]);

  const value = {
    events,
    completedTodos,
    loading,
    error,
    fetchEvents,
    fetchCompletedTodos,
    fetchAll
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