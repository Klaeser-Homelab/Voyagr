import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import { useTimer } from './TimerContext';
const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
  const [activeEvent, setActiveEvent] = useState(null);
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
      const completedTodos = activeEvent.todos
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

  const fetchTodos = async () => {
    console.log('fetching todos for event', activeEvent);
    if (!activeEvent) {
      throw new Error('activeEvent is null');
    }
    try {
      const response = await axios.get(`${api.endpoints.todos}/${activeEvent.parent_id}`, {
        withCredentials: true
      });

      console.debug('Todos fetched:', response.data);
      activeEvent.todos = response.data;
      setActiveEvent(activeEvent);
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

    try {
      const eventResponse = await axios.post(api.endpoints.events, {
        parent_id: item.item_id,
        parent_type: item.type
      }, {
        withCredentials: true
      });

      console.debug('Event created:', eventResponse.data);
      const event =eventResponse.data;
      event.item = item;
      setActiveEvent(event);
      if (activeEvent) {
        fetchTodos();
      }
      startTimer();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <SelectionContext.Provider value={{
      activeEvent,
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