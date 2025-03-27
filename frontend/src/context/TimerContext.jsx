import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    let interval = null;

    if (isBreak || isActiveEvent) {
      interval = setInterval(() => {
        if (isBreak) {
          if (seconds === 0) {
            if (minutes === 0) {
              setIsBreak(false);
              setMinutes(30);
              setSeconds(0);
              stopTimer();
            } else {
              setMinutes(minutes - 1);
              setSeconds(59);
            }
          } else {
            setSeconds(seconds - 1);
          }
        } else if (mode === 'timer') {
          if (seconds === 0) {
            if (minutes === 0) {
              if (isBreak) {
                setMinutes(30);
                setIsBreak(false);
              } else {
                setMinutes(5);
                setIsBreak(true);
              }
            } else {
              setMinutes(minutes - 1);
              setSeconds(59);
            }
          } else {
            setSeconds(seconds - 1);
          }
        } else {
          setStopwatchTime(prev => prev + 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isBreak, isActiveEvent, minutes, seconds, mode]);

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