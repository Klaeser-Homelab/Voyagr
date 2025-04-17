import React, { createContext, useContext, useState, useEffect } from 'react';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [elapsedTime, setElapsedTime] = useState(0); // Time in milliseconds
  const [isActiveEvent, setIsActiveEvent] = useState(false);
  const [mode, setMode] = useState('timer'); // 'timer' or 'stopwatch'
  const [duration, setDuration] = useState(0);

  const startTimer = (duration) => {
    console.log("starting timer in TimerProvider", duration);
    setIsActiveEvent(true);
    setDuration(duration);
  };

  const stopTimer = () => {
    console.log("stopping timer: ", elapsedTime);
    setElapsedTime(0);
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
    //console.log("duration", duration);
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
      startTimer,
      stopTimer,
      resetTimer,
      mode,
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