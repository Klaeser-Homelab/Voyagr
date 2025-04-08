import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import { useTimer } from './TimerContext';
const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
  const [activeEvent, setActiveEvent] = useState(null);
  const [todos, setTodos] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const { isBreak, startTimer, resetTimer, mode, setIsBreak, setMinutes, getElapsedTime } = useTimer();

  const updateEvent = async () => {
    if (!activeEvent.item) {
      console.warn('No item selected, cannot submit session');
      return;
    }

    try {
      // Update duration of event
      const eventResponse = await axios.put(
        `${api.endpoints.events}/${activeEvent.item_id}`,
        {
          duration: getElapsedTime(),
        },
        {
          withCredentials: true
        }
      );
      
      // Process completed todos with the event ID
      const completedTodos = todos
        .filter(todo => todo.completed)
        .map(todo => ({
          ...todo,
          EID: eventResponse.data.EID // Add the event ID to each completed todo
        }));
      
      console.log('Completed todos:', completedTodos);
      if (completedTodos.length > 0) {
        await axios.post(`${api.endpoints.todos}/batchprocess`, {
          withCredentials: true,
        }, completedTodos);
        console.log('Completed todos processed:', completedTodos);
      }

      // Reset timer and start break
      resetTimer();
      setIsBreak(true);
      setMinutes(5); // Set break time

      // After successful submission, refetch Today's events
      await fetchEvents();
    } catch (error) {
      console.error('Error submitting session:', error);
    }
  };

  const deleteEvent = async() => {
    setActiveEvent(null);
    resetTimer();
    await axios.delete(`${api.endpoints.events}/${activeEvent.item_id}`, {
      withCredentials: true,
    });
  };

  const fetchTodos = async (parent_id) => {
    if (!parent_id) {
      throw new Error('parent_id is null');
    }
    try {
      const response = await axios.get(`${api.endpoints.todos}/${parent_id}`, {
        withCredentials: true
      });

      console.debug('Todos fetched:', response.data);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const createEvent = async ({item}) => {
    if (!item) {
      console.error('Item is null or undefined:', item);
      return;
    }
    console.log('creating event for item', item);
    setActiveItem(item);

    try {
      const eventResponse = await axios.post(api.endpoints.events, {
        parent_id: item.item_id,
        parent_type: item.type
      }, {
        withCredentials: true
      });

      console.debug('Event created');
      setActiveEvent(eventResponse.data);
      fetchTodos(eventResponse.data.item_id);
      
      startTimer();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <SelectionContext.Provider value={{
      activeEvent,
      todos,
      setTodos,
      activeItem,
      deleteEvent,
      updateEvent,
      createEvent,
      isBreak,
      resetTimer,
      mode,
      setIsBreak,
      setMinutes
    }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
}; 