import React, { useState, useRef, useEffect } from 'react';

function Stopwatch({ activeValue, activeInput }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1000);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleStart = () => {
    console.debug('Starting stopwatch');
    setIsRunning(true);
  };

  const handleStop = () => {
    console.debug('Stopping stopwatch');
    setIsRunning(false);
  };

  const handleReset = () => {
    console.debug('Resetting stopwatch');
    setIsRunning(false);
    setTime(0);
  };

  const formatTime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor(ms / 1000 / 60 / 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-container">
      <h2>Stopwatch</h2>
      {!activeInput && (
        <div className="warning-message">
          Please select an input before starting a stopwatch
        </div>
      )}
      <div className="timer-display">
        {formatTime(time)}
      </div>
      <div className="timer-controls">
        <button 
          onClick={handleStart}
          disabled={!activeInput || isRunning}
        >
          Start
        </button>
        <button 
          onClick={handleStop}
          disabled={!isRunning}
        >
          Stop
        </button>
        <button 
          onClick={handleReset}
          disabled={isRunning || time === 0}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Stopwatch; 