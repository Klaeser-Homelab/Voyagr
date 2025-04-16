import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import { useTimer } from './TimerContext';
import { useToday } from './TodayContext';
import { useBreakCycle } from './BreakCycleContext';
const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [activeEvent, setActiveEvent] = useState(null);
  const [todos, setTodos] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const {startTimer, resetTimer, mode, setMinutes, getStopwatchTime } = useTimer();
  const { fetchEvents } = useToday();
  const { getBreak } = useBreakCycle();

  const transitionToBreak = async () => {
    let breakItem = getBreak();
    console.log('breakItem', breakItem);
    if (breakItem) {
      createEvent({input: breakItem});
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
      if (!activeItem.is_break) {
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
    setActiveItem(input);

    let parent_value_id = null;
    let parent_habit_id = null;
    if(input.type === 'habit') {
      parent_habit_id = input.item_id;
      parent_value_id = input.parent_id;
    } else if(input.type === 'value') {
      parent_value_id = input.item_id;
    }

    try {
      const eventResponse = await axios.post(api.endpoints.events, {
        parent_value_id: parent_value_id,
        parent_habit_id: parent_habit_id
      }, {
        withCredentials: true
      });

      console.log('input', input);
      console.log('eventResponse', eventResponse.data);

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
      resetTimer,
      mode,
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