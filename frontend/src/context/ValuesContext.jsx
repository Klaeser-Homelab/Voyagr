import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { api } from "../config/api";
const ValuesContext = createContext();

export const ValuesProvider = ({ children }) => {
  const [values, setValues] = useState([]);
  const [breaks, setBreaks] = useState([]);
  const [archivedValues, setArchivedValues] = useState([]);
  const [archivedHabits, setArchivedHabits] = useState([]);

  // ----- VALUES -----
  const fetchValues = useCallback(async () => {
    try {
      const res = await axios.get(api.endpoints.values, {
        withCredentials: true
      });
      setValues(res.data);
    } catch (error) {
      console.error('Failed to fetch values:', error);
    }
  }, []);

  const fetchArchivedValues = useCallback(async () => {
    try {
      const res = await axios.get(api.endpoints.values + '/archived', {
        withCredentials: true   
      });
      setArchivedValues(res.data);
    } catch (error) {
      console.error('Failed to fetch archived values:', error);
    }
  }, []);

  const fetchArchivedHabits = useCallback(async () => {
    try {
      const res = await axios.get(api.endpoints.habits + '/archived', {
        withCredentials: true
      }); 
      setArchivedHabits(res.data);
    } catch (error) {
      console.error('Failed to fetch archived habits:', error);
    }
  }, []);

  const addValue = async (data) => {
    try {
      await axios.post(api.endpoints.values, data, { withCredentials: true });
      fetchValues();
    } catch (error) {
      console.error('Failed to add value:', error);
    }
  };

  const updateValue = async (value) => {
    try {
      await axios.put(api.endpoints.values, {
        id: value.id,
        is_active: value.is_active,
        description: value.description,
        color: value.color
      }, {
        withCredentials: true
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
  const addHabit = async (habit) => {
    console.log("habit in addHabit:", habit);
    try{
      await axios.post(api.endpoints.habits, habit, { withCredentials: true });
      fetchValues();
    } catch (error) {
      console.error('Failed to add habit:', error);
    }
  };

  const updateHabit = async (habit) => {
    try {
      await axios.put(api.endpoints.habits, habit, { withCredentials: true });
      fetchValues();
    } catch (error) {
      console.error('Failed to update habit:', error);
    }
  };

  // ----- BREAKS -----
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

  const addBreak = async (data) => {
    try{
      await axios.post(api.endpoints.breaks, data, { withCredentials: true });
      fetchBreaks();
    } catch (error) {
      console.error('Failed to add break:', error);
    }
  };

  const updateBreak = async (breakItem) => {
    try {
      await axios.put(api.endpoints.breaks, breakItem, { withCredentials: true });
      fetchBreaks();
    } catch (error) {
      console.error('Failed to update break:', error);
    }
  };

  const deleteBreak = async (id) => {
    try{
      await axios.delete(api.endpoints.breaks, {
        data: { id },
        withCredentials: true,
      });
      fetchBreaks();
    } catch (error) {
      console.error('Failed to delete break:', error);
    }
  };

  // Fetch all on mount
  useEffect(() => {
    fetchValues();
    fetchBreaks();
    //fetchArchivedValues();
    //fetchArchivedHabits();
  }, [fetchValues, fetchBreaks]);

  return (
    <ValuesContext.Provider
      value={{
        values,
        addValue,
        updateValue,
        archiveValue,
        refreshValues: fetchValues,

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