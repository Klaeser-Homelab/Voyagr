import React from 'react';
import { useEvent } from '../../../context/EventContext';
import { CalendarIcon, PauseIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';

function HabitCard({ 
  habit, 
  valueColor, 
  isScheduled = false, 
  isBreak = false,
  showScheduled = false,
  showBreaks = false 
}) {
  const { createEvent, activeEvent, submitHabitEvent } = useEvent();

  // Handle clicking on the habit
  const handleClick = () => {
    if (activeEvent) return;
    createEvent({ input: { ...habit, type: 'habit', color: valueColor } });
  };

  // Handle clicking the done button
  const handleDoneClick = (e) => {
    e.stopPropagation(); // Prevent the card click from triggering
    console.log('done');
    submitHabitEvent(habit.id);
  };

  // Get schedule details for display
  const scheduleInfo = isScheduled && habit.Schedules && habit.Schedules.length > 0
    ? habit.Schedules[0] // Just use the first schedule for simplicity
    : null;

  // Get break details for display
  const breakInfo = isBreak && habit.Break 
    ? habit.Break
    : null;

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Format schedule type for display
  const formatScheduleType = (type) => {
    switch (type) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'biweekly': return 'Biweekly';
      case 'monthly': return 'Monthly';
      case 'custom': return 'Custom';
      default: return type;
    }
  };

  // Format interval for display
  const formatInterval = (milliseconds) => {
    if (!milliseconds) return '';
    
    const minutes = Math.floor(milliseconds / 60000);
    
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  };

  return (
    <div className="relative group">
      {/* Done button - appears on hover to the left of the card */}
      <div 
        className="absolute right-[-20] top-1/2 -translate-y-1/2 -translate-x-10 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
        onClick={handleDoneClick}
      >
        <button className="btn btn-circle btn-sm btn-success">
          <CheckCircleIcon className="size-5" />
        </button>
      </div>
      
      <div 
        className="card bg-base-200 shadow-md cursor-pointer hover:bg-base-300 group relative"
        onClick={handleClick}
      >
        <div className="card-body p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: valueColor }}
              ></div>
              <h3 className="card-title text-base">
                {habit.description}
              </h3>
            </div>
            
            {/* Show indicator icons */}
            <div className="flex gap-1">
              {isScheduled && (
                <div className="flex-shrink-0 text-primary">
                  <CalendarIcon className="size-5" />
                </div>
              )}
              {isBreak && (
                <div className="flex-shrink-0 text-secondary">
                  <PauseIcon className="size-5" />
                </div>
              )}
            </div>
          </div>
          
          <div className="text-xs text-base-content/70 flex justify-between items-center">
            <span>{Math.round(habit.duration / 60000)} minutes</span>
            
            <div className="flex flex-col items-end">
              {/* Show schedule time if the habit is scheduled */}
              {isScheduled && scheduleInfo && (
                <span className="text-primary">
                  {formatTime(scheduleInfo.start_time)} • {formatScheduleType(scheduleInfo.frequency_type)}
                </span>
              )}
              
              {/* Show break interval if the habit is a break */}
              {isBreak && breakInfo && (
                <span className="text-secondary">
                  After {formatInterval(breakInfo.interval)}
                </span>
              )}
            </div>
          </div>
          
          {/* Play button overlay - appears on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-base-300/40 rounded-lg">
            <div className="bg-primary text-primary-content rounded-full p-2">
              <PlayIcon className="size-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HabitCard;