import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import api  from "../config/api";
import { useAuth0 } from "@auth0/auth0-react";
import { getAuthService } from "../services/auth";
const ValuesContext = createContext();

export const ValuesProvider = ({ children }) => {
  const [values, setValues] = useState([]);
  const [breaks, setBreaks] = useState([]);
  const [archivedValues, setArchivedValues] = useState([]);
  const [archivedHabits, setArchivedHabits] = useState([]);
  const { isAuthenticated, isLoading } = useAuth0();

  // ----- VALUES -----
  const fetchValues = useCallback(async () => {
    try {
      const res = await api.get('/api/values');
      setValues(res.data);
    } catch (error) {
      console.error('Failed to fetch values:', error);
    }
  }, []);

  const fetchArchivedValues = useCallback(async () => {
    try {
      const res = await api.get('/api/values/archived');
      setArchivedValues(res.data);
    } catch (error) {
      console.error('Failed to fetch archived values:', error);
    }
  }, []);


  const addValue = async (data) => {
    try {
      const value = await api.post('/api/values', data);
      fetchValues();
      return value;
    } catch (error) {
      console.error('Failed to add value:', error);
    }
  };

  const updateValue = async (value) => {
    try {
      await api.put('/api/values', {
        id: value.id,
        is_active: value.is_active,
        description: value.description,
        color: value.color
      });
    } catch (error) {
      console.error('Failed to unarchive value:', error);
    }
  };

  const archiveValue = async (value) => { 

    for (const habit of value.Habits) {
      await archiveHabit(habit.id);
    }

    await updateValue(value);

    fetchValues();
    // Delete all breaks
    // not implemented yet
  };

  // ----- HABITS -----
  const fetchArchivedHabits = useCallback(async () => {
    try {
      const res = await api.get('/api/habits/archived');
      setArchivedHabits(res.data);
    } catch (error) {
      console.error('Failed to fetch archived habits:', error);
    }
  }, []);

  const addHabit = async (habit) => {
    try{
      await api.post('/api/habits', habit);
      fetchValues();
    } catch (error) {
      console.error('Failed to add habit:', error);
    }
  };

  const updateHabit = async (habit) => {
    try {
      await api.put('/api/habits', habit);
      fetchValues();
    } catch (error) {
      console.error('Failed to update habit:', error);
    }
  };

  const archiveHabit = async (habit) => {
    try {
      await api.put('/api/habits', { id: habit.id, is_active: false });
      fetchValues();
    } catch (error) {
      console.error('Failed to archive habit:', error); 
    }
  };

  // ----- BREAKS -----
  const fetchBreaks = useCallback(async () => {
    try {
      const response = await api.get('/api/breaks');
      setBreaks(response.data);
    } catch (error) {
      console.error('Failed to fetch breaks:', error);
    }
  }, []);

  const addBreak = async (data) => {
    try{
      await api.post('/api/breaks', data);
      fetchBreaks();
    } catch (error) {
      console.error('Failed to add break:', error);
    }
  };

  const updateBreak = async (breakItem) => {
    try {
      await api.put('/api/breaks', breakItem);
      fetchBreaks();
    } catch (error) {
      console.error('Failed to update break:', error);
    }
  };

  const deleteBreak = async (id) => {
    try{
      await api.delete('/api/breaks', {
        data: { id },
      });
      fetchBreaks();
    } catch (error) {
      console.error('Failed to delete break:', error);
    }
  };

  const fetchAll = useCallback(async () => {
    await fetchValues();
    await fetchBreaks();
    await fetchArchivedValues();
  }, []);

  // Fetch all once auth token is set
  useEffect(() => {
    const checkTokenForFetch = async () => {
      const authService = getAuthService();
      const token = await authService.getToken();
      if (isAuthenticated && !isLoading && token) {
        fetchAll();
      }
    };
    checkTokenForFetch();
  }, [isAuthenticated, isLoading]);

  return (
    <ValuesContext.Provider
      value={{
        values,
        addValue,
        updateValue,
        archiveValue,
        refreshValues: fetchValues,
        fetchAll,
        addHabit,
        updateHabit,

        breaks,
        addBreak,
      updateBreak,
      deleteBreak,

        archivedValues,
        archivedHabits,
        refreshArchivedValues: fetchArchivedValues,
        refreshArchivedHabits: fetchArchivedHabits,
      }}
    >
      {children}
    </ValuesContext.Provider>
  );
};

export const useValues = () => useContext(ValuesContext);