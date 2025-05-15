import React, { useEffect, useState, useCallback } from 'react';
import { useTimer } from '../../../context/TimerContext';
import { useBreaks } from '../../../context/BreaksContext';
import { useDeveloper } from '../../../context/DeveloperContext';
import { PauseIcon } from '@heroicons/react/24/outline';
const BreakSession = () => {
  const { 
    duration,
    elapsedTime,
    formatTime,
    isActiveEvent
  } = useTimer();

  const { developerMode } = useDeveloper();
  
  const { getUpcomingBreaks, getBreaks, breakDuration } = useBreaks();
  
  // Store upcomingBreaks in state instead of calling function on every render
  const [upcomingBreaks, setUpcomingBreaks] = useState([]);
  
  useEffect(() => {
    const breaks = getUpcomingBreaks();
    setUpcomingBreaks(breaks);
    //console.log('upcomingBreaks fetched:', breaks);
  }, []);

  const formatMinutes = (minutes) => {
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  };

  // Calculate the total duration including all breaks
  const getTotalDuration = useCallback(() => {
    if (!upcomingBreaks || upcomingBreaks.length === 0) {
      return duration;
    }
    
    // Find the maximum interval from all breaks to determine total timeline
    const maxBreakInterval = Math.max(...upcomingBreaks.map(b => b.interval));
    
    // The total duration is the maximum between current duration and the farthest break
    return Math.max(duration, maxBreakInterval);
  }, [duration, upcomingBreaks]);

  const totalDuration = getTotalDuration();

  // Calculate the fixed position for break marker - doesn't move during break
  const getBreakMarkerPosition = useCallback(() => {
    if (!totalDuration) return 0;
    
    // The break marker should be fixed at the breakDuration position
    // This represents where the session paused when the break started
    const result = ((breakDuration || 0) / totalDuration) * 100;
    return result;
  }, [totalDuration, breakDuration]);

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg w-full">
      <div className="text-center text-white">
        <h1 className="text-lg font-semibold mb-2">
          Work Session
          <p className="text-sm text-gray-400">
            {formatMinutes(Math.floor(breakDuration / 60000))}
          </p>
        </h1>
        
        {/* Progress line - Only showing the timeline without progress bar */}
        <div className="mt-6 mb-6">
          <div className="relative w-full h-2 bg-gray-700 rounded-full">
            
            {/* Current position marker "N" - fixed at break duration position */}
            <div 
              className="absolute top-[-8px] transform -translate-x-1/2"
              style={{ 
                left: `${getBreakMarkerPosition()}%` 
              }}
            >
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                
              </div>
            </div>
            
            
            {/* Break markers "B" - Show all breaks on the timeline, raised higher */}
            {upcomingBreaks && upcomingBreaks.map((breakItem, index) => {
              const position = (breakItem.interval / totalDuration) * 100;
              
              // Check if this break has already passed (is less than or equal to breakDuration)
              const isPastBreak = breakItem.interval <= breakDuration;
              
              return (
                <div 
                  key={index}
                  className="absolute top-[-30px] transform -translate-x-1/2"
                  style={{ left: `${position}%` }}
                >
                  <div className="flex-shrink-0">
  <PauseIcon className={`size-5 ${isPastBreak ? 'text-gray-500' : 'text-secondary'}`} />
</div>
                </div>
              );
            })}
          </div>
          
          {/* Time labels */}
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>Start</span>
            <span>{formatMinutes(Math.ceil(totalDuration / (60 * 1000)))}</span>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default BreakSession;