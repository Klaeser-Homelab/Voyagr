import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';

const TrackerContext = createContext(null);

export const TrackerProvider = ({ children }) => {
  const [monthData, setMonthData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Fetch habit events for the entire month
  const fetchMonthEvents = useCallback(async () => {
    try {
      setLoading(true);
      
      // Format date for API request (YYYY-MM)
      const monthString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
      
      const response = await axios.get(`${api.endpoints.events}/month/${monthString}`, {
        withCredentials: true
      });
      
      // Organize data by day and habit
      const organizedData = {};
      
      // Initialize all days of the month with empty arrays
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        organizedData[day] = [];
      }
      
      // Fill in the data we received
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach(event => {
          const eventDate = new Date(event.date);
          const day = eventDate.getDate();
          
          if (organizedData[day]) {
            organizedData[day].push(event);
          }
        });
      }
      
      setMonthData(organizedData);
      setError(null);
    } catch (error) {
      console.error('Error fetching month events:', error);
      setError('Failed to load month data');
    } finally {
      setLoading(false);
    }
  }, [currentMonth, currentYear]);

  // Change month (positive or negative offset)
  const changeMonth = (offset) => {
    const newDate = new Date(currentYear, currentMonth + offset, 1);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };

  // Get days in current month
  const getDaysInMonth = useCallback(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentMonth, currentYear]);

  // Get events for a specific day
  const getEventsForDay = (day) => {
    return monthData[day] || [];
  };

  // Check if a specific habit has an event on a specific day
  const hasHabitEvent = (habitId, day) => {
    const dayEvents = monthData[day] || [];
    return dayEvents.some(event => event.habit_id === habitId);
  };

  // Reload when month changes
  useEffect(() => {
    fetchMonthEvents();
  }, [currentMonth, currentYear, fetchMonthEvents]);

  const value = {
    monthData,
    loading,
    error,
    fetchMonthEvents,
    changeMonth,
    currentMonth,
    currentYear,
    getDaysInMonth,
    getEventsForDay,
    hasHabitEvent
  };

  return (
    <TrackerContext.Provider value={value}>
      {children}
    </TrackerContext.Provider>
  );
};

export const useTracker = () => {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
};