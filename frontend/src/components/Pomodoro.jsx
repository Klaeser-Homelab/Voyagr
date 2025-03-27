import React, { useEffect, useCallback } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import { useTimer } from '../context/TimerContext';
import { useSelection } from '../context/SelectionContext';
import './Pomodoro.css';

const Pomodoro = () => {
  const { activeInput, activeValue } = useSelection();
  const {
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
  } = useTimer();

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
        duration: 30 * 60, // 30 minutes in seconds
        type: 'session'
      });
      console.debug('API call successful');
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  }, [activeValue, activeInput]);

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
  }, [isActiveEvent, minutes, seconds, isBreak, mode, submitEvent]);

  const handleSubmit = async () => {
    await submitEvent();
    resetTimer();
  };

  // Get the color to use for the border
  const borderColor = activeInput?.Value?.Color || activeValue?.Color || '#ddd';

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTitle = () => {
    if (!activeInput && !activeValue) return 'Select a Value or Input';
    if (isBreak) return 'Break Time';
    return activeInput ? activeInput.Name : activeValue.Name;
  };

  const getSubtitle = () => {
    if (!activeInput && !activeValue) return 'Choose what to focus on';
    if (isBreak) return 'Take a short break';
    return activeInput ? activeInput.Value.Name : '';
  };

  return (
    <div 
      className="card bg-base-100 shadow-xl"
      style={{
        borderLeft: `4px solid ${borderColor}`,
        paddingLeft: '1rem',
        borderRadius: '4px'
      }}
    >
      <div className="card-body">
        <div className="join mb-4">
          <button 
            className={`join-item btn ${mode === 'timer' ? 'btn-active' : ''}`}
            onClick={() => mode !== 'timer' && toggleMode()}
          >
            Timer
          </button>
          <button 
            className={`join-item btn btn-success ${mode === 'stopwatch' ? 'btn-active' : ''}`}
            onClick={() => mode !== 'stopwatch' && toggleMode()}
          >
            Stopwatch
          </button>
        </div>

        <h2 className="card-title text-2xl font-bold mb-4">
          {getTitle()}
        </h2>
        
        <div className="text-4xl font-mono mb-6">
          {mode === 'timer' ? (
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
          ) : (
            formatTime(stopwatchTime)
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <button 
            className="btn btn-primary"
            onClick={isActiveEvent ? stopTimer : startTimer}
            disabled={(!activeValue && !activeInput)}
          >
            {isActiveEvent ? 'Pause' : 'Start'}
          </button>
          <button 
            className="btn btn-ghost"
            onClick={resetTimer}
            disabled={isActiveEvent && mode === 'timer' && minutes === 30 && seconds === 0}
          >
            Reset
          </button>
          {mode === 'stopwatch' && (
            <button 
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={isActiveEvent || stopwatchTime === 0}
            >
              Submit Event
            </button>
          )}
        </div>

        {mode === 'timer' && (
          <>
            <div className="flex gap-2 mb-4">
              <button 
                className="btn btn-sm btn-ghost"
                onClick={() => adjustTime(-5)}
              >
                -5 min
              </button>
              <button 
                className="btn btn-sm btn-ghost"
                onClick={() => adjustTime(5)}
              >
                +5 min
              </button>
            </div>
            <p className="text-center text-lg">
              {isBreak ? 'Take a break!' : 'Stay focused!'}
            </p>
          </>
        )}
        {!activeInput && !activeValue && (
          <div className="alert alert-warning mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Please select an input or value before starting a timer</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pomodoro; 