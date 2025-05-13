import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../config/api';
import { useTimer } from './TimerContext';
import { useToday } from './TodayContext';
import { useBreaks } from './BreaksContext';
const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [activeEvent, setActiveEvent] = useState(null);
  const [todos, setTodos] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const {initTimer, resetTimer, stopTimer, mode, setMinutes, getElapsedMilliseconds, timerComplete, formatTime } = useTimer();
  const { fetchEvents } = useToday();
  const { getBreak } = useBreaks();

  useEffect(() => {
    if (timerComplete) {
      console.log('timerComplete on event context', timerComplete);
      updateEvent();
    }
  }, [timerComplete]);

  const transitionToBreak = async (duration) => {
    console.log('transitioning to break', formatTime(duration));
    let breakItem = await getBreak(duration);
    console.log('break', breakItem);
    if (breakItem) {
      console.log('creating break event');
      createEvent({
        input: {
          ...breakItem.Habit,
          color: breakItem.Habit.Value.color, // Add the color property
          is_break: true
        }
      });
    } else {
      setActiveItem(null);
      setActiveEvent(null);
    }
  }

  // For skipping the pomodoro timer and directly submitting the event
  const submitHabitEvent = async (habit_id) => {
    console.log('submitting event');
    console.log('habit_id', habit_id);
    try{
      api.post('/api/events/submit', {
        habit_id: habit_id
      });
    } catch (error) {
      console.error('Error submitting event:', error);
    }
    await fetchEvents();
  }

  const updateEvent = async () => {  
    const duration = getElapsedMilliseconds();
    stopTimer();
    try {
      // Update duration of event
      const eventResponse = await api.put(
        `/api/events/${activeEvent.id}`,
        {
          duration: duration,
        }
      );

      console.log('updating todos', todos);
      
      // Process completed todos with the event ID
      const completedTodos = todos
        .filter(todo => todo.completed)
        .map(todo => ({
          ...todo,
          event_id: activeEvent.id   // Add the event ID to each completed todo
        }));
      
      console.log('Completed todos:', completedTodos);
      if (completedTodos.length > 0) {
        await api.post(`/api/todos/batchprocess`, completedTodos);
        console.log('Completed todos processed:', completedTodos);
      }

      console.log('activeItem', activeItem);

      // Reset timer and start break
      if (!activeItem.is_break) {
        console.log('calling transitioning to break', formatTime(duration));
        transitionToBreak(duration);
      }
      else{
        console.log('back home');
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
    resetTimer();
    setActiveEvent(null);
    await api.delete(`/api/events/${activeEvent.id}`);
  };

  const getHabitAndCreateEvent = async (habit_id, color) => {
    if (!habit_id) {
      console.error('Habit ID is null or undefined');
      return;
    }
    
    try {
      // Get the habit details
      const habitResponse = await api.get(`/api/habits/${habit_id}`);
      const habit = habitResponse.data;
      
      // Add the type property to match the expected input format for createEvent
      habit.type = 'habit';
      
      // Pass the complete habit object to createEvent
      await createEvent({ input: { ...habit, type: 'habit', color: color } });

      
    } catch (error) {
      console.error('Error fetching habit or creating event:', error);
    }
  };

  const createEvent = async ({input}) => {
    if (!input) {
      console.error('Input is null or undefined:', input);
      return;
    }

    console.log('input', input);
    setActiveItem(input);
    initTimer(input);

    let habit_id = null;
    let value_id = null;
    if(input.type === 'habit'){
      habit_id = input.id;
      value_id = input.value_id;
    } else if(input.type === 'value'){
      value_id = input.id;
    }

    console.log('habit_id', habit_id);
    console.log('value_id', value_id);

    try {
      const eventResponse = await api.post('/api/events', {
        value_id: value_id,
        habit_id: habit_id
      });

      
      console.log('input', input);
      console.log('eventResponse', eventResponse.data);

      setActiveEvent(eventResponse.data);

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
      submitHabitEvent,
      createEvent,
      getHabitAndCreateEvent,
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