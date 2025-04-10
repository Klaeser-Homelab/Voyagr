import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import { useTimer } from './TimerContext';
import { useToday } from './TodayContext';
const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [activeEvent, setActiveEvent] = useState(null);
  const [todos, setTodos] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const {startTimer, resetTimer, mode, setMinutes, getStopwatchTime } = useTimer();
  const [breaks, setBreaks] = useState([]);
  const { fetchEvents } = useToday();
  const [isBreak, setIsBreak] = useState(false);
  const fetchBreaks = async () => {
    const response = await axios.get(api.endpoints.breaks);
    setBreaks(response.data);
  }

  const transitionToBreak = async () => {
    setIsBreak(true);
    if (breaks.length > 0) {
      createEvent(breaks[0]);
    } else {
      setActiveItem(null);
    }
  }

  const updateEvent = async () => {
    try {
      // Update duration of event
      const eventResponse = await axios.put(
        `${api.endpoints.events}/${activeEvent.item_id}`,
        {
          duration: getStopwatchTime(),
        },
        {
          withCredentials: true
        }
      );

      console.log('updating todos', todos);
      
      // Process completed todos with the event ID
      const completedTodos = todos
        .filter(todo => todo.completed)
        .map(todo => ({
          ...todo,
          parent_id: activeEvent.item_id   // Add the event ID to each completed todo
        }));
      
      console.log('Completed todos:', completedTodos);
      if (completedTodos.length > 0) {
        await axios.post(`${api.endpoints.todos}/batchprocess`, completedTodos, {
          withCredentials: true,
        });
        console.log('Completed todos processed:', completedTodos);
      }

      // Reset timer and start break
      if (!isBreak) {
        transitionToBreak();
      }
      else{
        setActiveItem(null);
        setActiveEvent(null);
      }
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

  const createEvent = async ({input}) => {
    if (!input) {
      console.error('Input is null or undefined:', input);
      return;
    }
    console.log('created event for: ', input);
    setActiveItem(input);

    try {
      const eventResponse = await axios.post(api.endpoints.events, {
        parent_id: input.item_id,
        parent_type: input.type
      }, {
        withCredentials: true
      });

      console.debug('Event created');
      setActiveEvent(eventResponse.data);
      if (input.duration) {
        startTimer(input.duration); // habit
      } else {
        startTimer(1800000); // value
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <EventContext.Provider value={{
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
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within a EventProvider');
  }
  return context;
}; 