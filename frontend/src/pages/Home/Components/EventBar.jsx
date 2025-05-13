import React, { useState, useEffect } from 'react';
import { useEvent } from '../../../context/EventContext';
import { useTimer } from '../../../context/TimerContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline';

const EventBar = () => {
  const { activeEvent, activeItem } = useEvent();
  const { 
    isActiveEvent, 
    mode, 
    getRemainingTime, 
    getElapsedMilliseconds,
    pauseTimer,
    resumeTimer 
  } = useTimer();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [displayTime, setDisplayTime] = useState(getRemainingTime());

  // Update display time when getRemainingTime changes (same as Event component)
  useEffect(() => {
    const { minutes, seconds } = getRemainingTime();
    setDisplayTime({ minutes, seconds });
  }, [getRemainingTime]);

  // Update display time every second (but rely on the above effect for accuracy)
  useEffect(() => {
    const interval = setInterval(() => {
      const { minutes, seconds } = getRemainingTime();
      setDisplayTime({ minutes, seconds });
    }, 100); // More frequent updates for smoother display

    return () => clearInterval(interval);
  }, [getRemainingTime]);

  // Don't show the bar if there's no active event or if we're on the home page
  const isOnHomePage = location.pathname === '/home' || location.pathname === '/';
  
  if (!activeEvent || !activeItem || isOnHomePage) {
    return null;
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleBarClick = () => {
    navigate('/home');
  };

  const handlePlayPauseClick = (e) => {
    e.stopPropagation();
    isActiveEvent ? pauseTimer() : resumeTimer();
  };

  const getDisplayTime = () => {
    if (mode === 'timer') {
      return `${String(displayTime.minutes).padStart(2, '0')}:${String(displayTime.seconds).padStart(2, '0')}`;
    } else {
      return formatTime(Math.floor(getElapsedMilliseconds() / 1000));
    }
  };

  return (
    <div 
      className="fixed bottom-16 left-0 right-0 lg:bottom-0 lg:left-16 bg-gray-800 border-t border-gray-600 p-4 cursor-pointer hover:bg-gray-700 transition-colors duration-200 z-50"
      onClick={handleBarClick}
    >
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Event info */}
        <div className="flex items-center flex-1">
          <div 
            className="w-4 h-4 rounded-full mr-3" 
            style={{ backgroundColor: activeItem.color || '#ccc' }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{activeItem.description}</h3>
            <p className="text-gray-400 text-sm">
              {mode === 'timer' ? 'Timer' : 'Stopwatch'} • Click to return
            </p>
          </div>
        </div>
        
        {/* Timer display and controls */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-mono text-white">
            {getDisplayTime()}
          </span>
          <button 
            className="btn btn-sm btn-circle bg-gray-700 hover:bg-gray-600 text-white"
            onClick={handlePlayPauseClick}
          >
            {isActiveEvent ? 
              <PauseIcon className="size-4 text-white" /> : 
              <PlayIcon className="size-4 text-white" />
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventBar;