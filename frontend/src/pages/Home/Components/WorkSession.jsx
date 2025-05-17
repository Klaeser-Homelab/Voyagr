import React, { useEffect, useState, useCallback } from 'react';
import { useTimer } from '../../../context/TimerContext';
import { useBreaks } from '../../../context/BreaksContext';
import { useDeveloper } from '../../../context/DeveloperContext';
import { PauseIcon, ClockIcon } from '@heroicons/react/24/outline';

const WorkSession = () => {
  const { 
    duration,
    elapsedTime,
    formatTime,
    isActiveEvent
  } = useTimer();

  const { developerMode } = useDeveloper();

  // Add debug effect to log every render
  useEffect(() => {
    const progressPercentage = getProgressBarPercentage();
    const leftPercentage = ((breakDuration || 0) / totalDuration) * 100;
    //console.log('WorkSession render:', {
    //  elapsedTime,
    //  isActiveEvent,
    //  duration,
    //  totalDuration,
    //  breakDuration,
    //  progressPercentage,
    //  leftPercentage,
    //    style: {
    //      left: `${leftPercentage}%`,
    //      width: `${progressPercentage}%`
    //    }
    //});
  });
  
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

  // Calculate progress as a percentage of the total timeline
  const getProgressPercentage = useCallback(() => {
    if (!totalDuration) return 0;
    
    // Calculate the offset based on breakDuration (where this work session starts)
    const workSessionStartOffset = breakDuration || 0;
    
    // Use elapsedTime directly from timer context
    const currentWorkSessionProgress = Math.min(elapsedTime, duration);
    //console.log('getProgressPercentage - elapsedTime:', elapsedTime, 'currentWorkSessionProgress:', currentWorkSessionProgress, 'workSessionStartOffset:', workSessionStartOffset);
    
    // Total elapsed time including the offset
    const totalElapsedTime = workSessionStartOffset + currentWorkSessionProgress;
    
    // The progress percentage on the full timeline
    const result = Math.min((totalElapsedTime / totalDuration) * 100, 100);
    //console.log('getProgressPercentage result:', result);
    return result;
  }, [totalDuration, breakDuration, elapsedTime, duration]);

  // Calculate just the current work session progress for the bar
  const getProgressBarPercentage = useCallback(() => {
    if (!totalDuration || !duration) return 0;
    
    // Use elapsedTime directly from timer context
    const currentWorkSessionProgress = Math.min(elapsedTime, duration);
    //console.log('getProgressBarPercentage - elapsedTime:', elapsedTime, 'duration:', duration, 'currentWorkSessionProgress:', currentWorkSessionProgress);
    
    // Calculate what percentage of the total timeline the current work session duration represents
    const workSessionPercentageOfTotal = (duration / totalDuration) * 100;
    //console.log('workSessionPercentageOfTotal:', workSessionPercentageOfTotal);
    
    // Calculate the progress within the work session as a percentage
    const progressWithinWorkSession = currentWorkSessionProgress / duration;
    //console.log('progressWithinWorkSession:', progressWithinWorkSession);
    
    const result = workSessionPercentageOfTotal * progressWithinWorkSession;
    //console.log('getProgressBarPercentage result:', result);
    
    return result;
  }, [totalDuration, duration, elapsedTime]);

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg w-full">
      <div className="text-center text-white">
      <div className="text-center">
  <ClockIcon className="size-8 mx-auto mb-1" />
  <h1 className="text-lg font-semibold mb-2">
    Break Cycle
    <p className="text-sm text-gray-400">
      {formatMinutes(Math.floor(breakDuration / 60000))}
    </p>
  </h1>
</div>
        
        {/* Progress line */}
        <div className="mt-6 mb-6">
          <div className="relative w-full h-2 bg-gray-700 rounded-full">
            {/* Progress indicator - without transition during active timer */}
            <div 
              key={`progress-${elapsedTime}`}
              className={`absolute h-2 bg-blue-500 rounded-full ${!isActiveEvent ? 'transition-all duration-300' : ''}`}
              style={{ 
                left: `${((breakDuration || 0) / totalDuration) * 100}%`,
                width: `${getProgressBarPercentage()}%`,
                backgroundColor: 'rgb(59, 130, 246)' // Explicit blue color
              }}
            />
            
            {/* Current position marker "N" */}
            <div 
              className="absolute top-[-8px] transform -translate-x-1/2"
              style={{ 
                left: `${getProgressPercentage()}%` 
              }}
            >
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                
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
        
        {/* Debug info */}
        {developerMode && (
        <div className="text-xs text-gray-500 mt-2">
          Debug: Active: {isActiveEvent ? 'Yes' : 'No'}, 
          Elapsed: {formatTime(elapsedTime)}, 
          Progress: {getProgressBarPercentage().toFixed(2)}%,
          Left: {((breakDuration || 0) / totalDuration * 100).toFixed(2)}%,
          Width: {getProgressBarPercentage().toFixed(2)}%
        </div>
        )}
      </div>
    </div>
  );
};

export default WorkSession;