import React, { createContext, useContext, useState, useEffect } from 'react';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [elapsedTime, setElapsedTime] = useState(0); // Time in milliseconds
  const [isActiveEvent, setIsActiveEvent] = useState(false);
  const [mode, setMode] = useState('timer'); // 'timer' or 'stopwatch'
  const [duration, setDuration] = useState(0);
  const [timerComplete, setTimerComplete] = useState(false);

  const initTimer = (activeItem) => {
      setIsActiveEvent(true);
      setTimerComplete(false);
      if (activeItem.duration) {
        setDuration(activeItem.duration);
      }
      else {
        setDuration(1800000);
      }
  };

  const stopTimer = () => {
    console.log("stopping timer: ", elapsedTime);
    setElapsedTime(0);
    setDuration(0);
    setIsActiveEvent(false);
    setTimerComplete(false);
  };

  const pauseTimer = () => {
    console.log("pausing timer: ", elapsedTime);
    setIsActiveEvent(false);
  };

  const resumeTimer = () => {
    console.log("resuming timer: ", elapsedTime);
    setIsActiveEvent(true);
  };

  const resetTimer = () => {
    console.log('resetting timer');
    setIsActiveEvent(false);
    setElapsedTime(0);
  };

  const toggleMode = () => {
    setMode(mode === 'timer' ? 'stopwatch' : 'timer');
  };

  useEffect(() => {
    console.log("timer", timerComplete, elapsedTime, duration);
    if (duration !== 0 && elapsedTime >= duration) {
      setTimerComplete(true);
      console.log("complete", timerComplete, elapsedTime, duration);

    }
  }, [elapsedTime]);

  useEffect(() => {
    let interval = null;
    if (isActiveEvent) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1000); 
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActiveEvent]);

  const getRemainingTime = () => {
    const totalMiliSeconds = Math.max(0, duration - elapsedTime); // 30 minutes countdown
    const minutes = Math.floor(totalMiliSeconds / 60000);
    const seconds = Math.floor((totalMiliSeconds % 60000) / 1000);
    return { minutes, seconds };
  };

  const getElapsedMilliseconds = () => {
    return elapsedTime; // Time in seconds
  };

  const adjustTime = (time) => {
    setDuration(prev => prev + (time * 60000));
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