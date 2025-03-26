import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import './Pomodoro.css';

const Pomodoro = ({ activeInput, activeValue, isActiveEvent, setIsActiveEvent }) => {
  // Define time constants (in milliseconds)
  const workTime = 30 * 60 * 1000;  // 30 minutes

  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [mode, setMode] = useState('timer'); // 'timer' or 'stopwatch'
  const [stopwatchTime, setStopwatchTime] = useState(0); // seconds elapsed

  const submitEvent = useCallback(async () => {
    console.debug('submitEvent called, checking activeValue:', activeValue);
    if (!activeValue) {
      console.warn('No value selected, cannot submit event');
      return;
    }

    try {
      console.debug('Passing activeValue check, making API call...');
      await axios.post(api.endpoints.events, {
        VID: activeValue.VID,
        IID: activeInput?.IID,
        duration: workTime / 1000,
        type: 'session'
      });
      console.debug('API call successful');
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  }, [activeValue, activeInput, workTime]);

  useEffect(() => {
    let interval = null;

    if (isActiveEvent) {
      interval = setInterval(() => {
        if (mode === 'timer') {
          // Timer mode (counting down)
          if (seconds === 0) {
            if (minutes === 0) {
              // Timer is done
              if (isBreak) {
                // Break is over, reset to work time
                setMinutes(30);
                setIsBreak(false);
              } else {
                // Work is over, submit event and start break
                submitEvent();
                setMinutes(5);
                setIsBreak(true);
              }
            } else {
              // Decrement minutes, reset seconds
              setMinutes(minutes - 1);
              setSeconds(59);
            }
          } else {
            // Decrement seconds
            setSeconds(seconds - 1);
          }
        } else {
          // Stopwatch mode (counting up)
          setStopwatchTime(prev => prev + 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActiveEvent, minutes, seconds, isBreak, mode, activeInput, submitEvent]);

  const toggleTimer = () => {
    setIsActiveEvent(!isActiveEvent);
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

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours > 0 ? `${String(hours).padStart(2, '0')}:` : ''}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const adjustTime = (minutesToAdd) => {
    const newMinutes = minutes + minutesToAdd;
    if (newMinutes >= 0) {  // Prevent negative time
      setMinutes(newMinutes);
      setSeconds(0);  // Reset seconds when adjusting time
    }
  };

  const handleSubmit = async () => {
    console.debug('handleSubmit called, activeValue:', activeValue);
    await submitEvent();
    resetTimer();
  };

  // Get the color to use for the border
  const borderColor = activeInput?.Value?.Color || activeValue?.Color || '#ddd';

  return (
    <div 
      className="pomodoro"
      style={{
        borderLeft: `4px solid ${borderColor}`,
        paddingLeft: '1rem',
        borderRadius: '4px'
      }}
    >
      <div className="mode-switch">
        <button 
          className={`mode-button ${mode === 'timer' ? 'active' : ''}`}
          onClick={() => mode !== 'timer' && toggleMode()}
        >
          Timer
        </button>
        <button 
          className={`mode-button ${mode === 'stopwatch' ? 'active' : ''}`}
          onClick={() => mode !== 'stopwatch' && toggleMode()}
        >
          Stopwatch
        </button>
      </div>

      <h2>{mode === 'timer' ? (isBreak ? 'Break Time!' : 'Session') : 'Stopwatch'}</h2>
      
      <div className="timer">
        {mode === 'timer' ? (
          `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        ) : (
          formatTime(stopwatchTime)
        )}
      </div>

      <div className="controls">
        <button 
          onClick={toggleTimer}
          disabled={isActiveEvent || (!activeValue && !activeInput)}
        >
          {isActiveEvent ? 'Pause' : 'Start'}
        </button>
        <button 
          onClick={resetTimer}
          disabled={isActiveEvent && mode === 'timer' && minutes === 30 && seconds === 0}
        >
          Reset
        </button>
        {mode === 'stopwatch' && (
          <button 
            className="submit-button"
            onClick={handleSubmit}
            disabled={isActiveEvent || stopwatchTime === 0}
          >
            Submit Event
          </button>
        )}
      </div>

      {mode === 'timer' && (
        <>
          <div className="adjust-controls">
            <button onClick={() => adjustTime(-5)}>-5 min</button>
            <button onClick={() => adjustTime(5)}>+5 min</button>
          </div>
          <p className="status">
            {isBreak ? 'Take a break!' : 'Stay focused!'}
          </p>
        </>
      )}
      {!activeInput && !activeValue && (
        <div className="warning-message">
          Please select an input or value before starting a timer
        </div>
      )}
    </div>
  );
};

export default Pomodoro; 