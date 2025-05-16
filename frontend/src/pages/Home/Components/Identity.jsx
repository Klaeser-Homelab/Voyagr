import React from 'react';
import { useEvent } from '../../../context/EventContext';
import HabitCard from './HabitCard';
import { CalendarIcon, PauseIcon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';

function Identity({ value, showScheduled = false, showBreaks = false }) {
  const { createEvent, activeEvent } = useEvent();

  

  // Determine which habits to show based on filters
  const habitsToDisplay = value.Habits?.filter(habit => {
    const isScheduledHabit = habit.Schedules && 
                           habit.Schedules.length > 0 && 
                           habit.Schedules.some(schedule => schedule.is_active);
    
    const isBreakHabit = habit.Break !== null;
    
    // Apply filters
    if (!showScheduled && isScheduledHabit) {
      return false; // Hide scheduled habits when filter is off
    }
    
    if (!showBreaks && isBreakHabit) {
      return false; // Hide break habits when filter is off
    }
    
    return true; // Show all other habits
  });

  // Check if the value has any scheduled habits
  const hasScheduledHabits = value.Habits?.some(habit => 
    habit.Schedules && 
    habit.Schedules.length > 0 && 
    habit.Schedules.some(schedule => schedule.is_active)
  );

  // Check if the value has any break habits
  const hasBreakHabits = value.Habits?.some(habit => 
    habit.Break !== null
  );

  // If no habits to display after filtering, don't render this value
  if (!habitsToDisplay || habitsToDisplay.length === 0) {
    return null;
  }

  // Handle clicking on the play button
  const handlePlayClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (activeEvent) return;
    createEvent({ input: { ...value, type: 'value' } });
  };

  return (
    <div className="mb-4 w-90">
      {/* Value card */}
      <div className="card shadow-xl bg-base-200 group relative">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title">
              {value.description}
            </h2>
            <div className="flex flex-col items-end gap-1">
              {/* Level text above the circle */}
              <span className="text-xs text-base-content/70 font-medium">
                Lvl {value.level}
              </span>
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: value.color }}
              ></div>
            </div>
          </div>
          
          {/* Play button overlay - appears on hover, only this button is clickable */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePlayClick}
              className="bg-primary hover:bg-primary/80 text-primary-content rounded-full p-3 transition-colors"
              disabled={activeEvent}
            >
              <PlayIcon className="size-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Always show habits list (no collapsibility) */}
      <div className="ml-4 mt-2 space-y-2">
        {habitsToDisplay.map(habit => (
          <HabitCard 
            key={habit.id} 
            habit={habit} 
            valueColor={value.color}
            isScheduled={habit.Schedules && habit.Schedules.length > 0}
            showScheduled={showScheduled}
            showBreaks={showBreaks}
          />
        ))}
      </div>
    </div>
  );
}

export default Identity;