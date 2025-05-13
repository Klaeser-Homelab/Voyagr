import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [elapsedTime, setElapsedTime] = useState(0); // Time in milliseconds
  const [isActiveEvent, setIsActiveEvent] = useState(false);
  const [mode, setMode] = useState('timer'); // 'timer' or 'stopwatch'
  const [duration, setDuration] = useState(0);
  const [timerComplete, setTimerComplete] = useState(false);
  const startTimeRef = useRef(null);
  const rafIdRef = useRef(null);
  const pausedAtRef = useRef(0);
  const durationRef = useRef(duration);
  const navigate = useNavigate();
  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);


  const tick = () => {
    if (!isActiveEvent || !startTimeRef.current) return;
    
    const now = Date.now();
    const newElapsedTime = now - startTimeRef.current + pausedAtRef.current;
    setElapsedTime(newElapsedTime);
    
    // Use durationRef.current instead of duration
    if (durationRef.current !== 0 && newElapsedTime >= durationRef.current) {
      setTimerComplete(true);
      setIsActiveEvent(false);
      cancelAnimationFrame(rafIdRef.current);
      console.log("complete", true, newElapsedTime, durationRef.current);
      navigate('/');
    } else {
      rafIdRef.current = requestAnimationFrame(tick);
    }
  };

  const initTimer = (activeItem) => {
    setIsActiveEvent(true);
    setTimerComplete(false);
    setElapsedTime(0);
    pausedAtRef.current = 0;
    startTimeRef.current = Date.now();
    
    if (activeItem.duration) {
      setDuration(activeItem.duration);
    } else {
      setDuration(1800000);
    }
  };

  const stopTimer = () => {
    console.log("stopping timer: ", elapsedTime);
    setElapsedTime(0);
    setDuration(0);
    setIsActiveEvent(false);
    setTimerComplete(false);
    pausedAtRef.current = 0;
    
    
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };
  
  const pauseTimer = () => {
    console.log("pausing timer: ", formatTime(elapsedTime));
    setIsActiveEvent(false);
    pausedAtRef.current = elapsedTime;
    
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
  };

  const resumeTimer = () => {
    console.log("resuming timer: ", formatTime(elapsedTime));
    setIsActiveEvent(true);
    startTimeRef.current = Date.now();
  };

  const resetTimer = () => {
    console.log('resetting timer: ', formatTime(elapsedTime));
    setIsActiveEvent(false);
    setElapsedTime(0);
    pausedAtRef.current = 0;
    
    // I believe these are redundant but I would have to look at
    // the actual event loop to be sure. These could be preventing
    // unneccesary re-renders even if those re-renders don't show changes
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
  };

  const toggleMode = () => {
    setMode(mode === 'timer' ? 'stopwatch' : 'timer');
  };

  // Start/stop animation frame based on isActiveEvent
  useEffect(() => {
    if (isActiveEvent) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }
      rafIdRef.current = requestAnimationFrame(tick);
    } else if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isActiveEvent]);

  const getRemainingTime = () => {
    const totalMiliSeconds = Math.max(0, duration - elapsedTime);
    const minutes = Math.floor(totalMiliSeconds / 60000);
    const seconds = Math.floor((totalMiliSeconds % 60000) / 1000);
    return { minutes, seconds };
  };

  const getElapsedMilliseconds = () => {
    return elapsedTime;
  };

  const adjustTime = (time) => {
    setDuration(prev => {
      const newDuration = prev + (time * 60000);
      durationRef.current = newDuration; // Also update the ref
      return newDuration;
    });
  };

  const adjustElapsedTime = async (time) => {
    await setElapsedTime(prev => {
      const newElapsedTime = prev + (time * 60000);
      return newElapsedTime;
    });
  };

  return (
    <TimerContext.Provider value={{
      isActiveEvent,
      initTimer,
      stopTimer,
      pauseTimer,
      resetTimer,
      duration,
      mode,
      timerComplete,
      toggleMode,
      resumeTimer,
      elapsedTime,
      formatTime,
      adjustElapsedTime,
      adjustTime,
      getRemainingTime,
      getElapsedMilliseconds,
    }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};