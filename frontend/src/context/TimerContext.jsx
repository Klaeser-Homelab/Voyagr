import React, { createContext, useContext, useState } from 'react';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [isActiveEvent, setIsActiveEvent] = useState(false);
  const [mode, setMode] = useState('timer'); // 'timer' or 'stopwatch'
  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);

  const startTimer = () => {
    setIsActiveEvent(true);
  };

  const stopTimer = () => {
    setIsActiveEvent(false);
  };

  const resetTimer = () => {
    setIsActiveEvent(false);
    if (mode === 'timer') {
      setIsBreak(false);
      setMinutes(30);
      setSeconds(0);
    } else {
      setStopwatchTime(0);
    }
  };

  const toggleMode = () => {
    setIsActiveEvent(false);
    setMode(mode === 'timer' ? 'stopwatch' : 'timer');
    resetTimer();
  };

  const adjustTime = (minutesToAdd) => {
    const newMinutes = minutes + minutesToAdd;
    if (newMinutes >= 0) {
      setMinutes(newMinutes);
      setSeconds(0);
    }
  };

  return (
    <TimerContext.Provider value={{
      isActiveEvent,
      startTimer,
      stopTimer,
      resetTimer,
      mode,
      toggleMode,
      minutes,
      seconds,
      isBreak,
      stopwatchTime,
      adjustTime,
      setMinutes,
      setSeconds,
      setIsBreak,
      setStopwatchTime
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