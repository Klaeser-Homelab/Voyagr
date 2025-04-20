import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { api } from "../config/api";
const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [values, setValues] = useState([]);
  const [habits, setHabits] = useState([]);
  const [breaks, setBreaks] = useState([]);

  // ----- VALUES -----
  const fetchValues = useCallback(async () => {
    const res = await axios.get(api.endpoints.values + '/no-default-breaks', {
      withCredentials: true
    });
    setValues(res.data);
  }, []);

  const addValue = async (data) => {
    await axios.post(api.endpoints.values, data, { withCredentials: true });
    fetchValues();
  };

  const deleteValue = async (id) => {
    await axios.delete(api.endpoints.values, {
      data: { id },
      withCredentials: true,
    });
    fetchValues();
  };

  // ----- HABITS -----
  const fetchHabits = useCallback(async () => {
    const res = await axios.get("/api/habits", { withCredentials: true });
    setHabits(res.data);
  }, []);

  const addHabit = async (data) => {
    await axios.post("/api/habits", data, { withCredentials: true });
    fetchHabits();
  };

  const deleteHabit = async (id) => {
    await axios.delete("/api/habits", {
      data: { id },
      withCredentials: true,
    });
    fetchHabits();
  };

  // ----- BREAKS -----
  const fetchBreaks = useCallback(async () => {
    const res = await axios.get("/api/breaks", { withCredentials: true });
    setBreaks(res.data);
    console.log("breaks from context:", res.data);
  }, []);

  const addBreak = async (data) => {
    await axios.post("/api/breaks", data, { withCredentials: true });
    fetchBreaks();
  };

  const deleteBreak = async (id) => {
    await axios.delete("/api/breaks", {
      data: { id },
      withCredentials: true,
    });
    fetchBreaks();
  };

  // Fetch all on mount
  useEffect(() => {
    fetchValues();
    fetchHabits();
    fetchBreaks();
  }, [fetchValues, fetchHabits, fetchBreaks]);

  return (
    <ProfileContext.Provider
      value={{
        values,
        addValue,
        deleteValue,
        refreshValues: fetchValues,

        habits,
        addHabit,
        deleteHabit,
        refreshHabits: fetchHabits,

        breaks,
        addBreak,
        deleteBreak,
        refreshBreaks: fetchBreaks,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);