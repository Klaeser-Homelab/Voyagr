import React from 'react';
import HabitCard from './HabitCard';
import { PlayIcon } from '@heroicons/react/24/outline';
import { useEvent } from '../../../context/EventContext';

function Identity({ value }) {
  const { createEvent } = useEvent();

  return (
    <div 
      className={`bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg`}
    >
      <div 
        className="flex items-center justify-between p-4 cursor-pointer transition-colors duration-200"
        style={{ backgroundColor: value.color }}
      >
        <h3 className="text-lg font-semibold text-white">{value.description}</h3>
        <PlayIcon className="size-6 text-white" onClick={() => createEvent({input: value})} />
      </div>
      
      {value.Habits && value.Habits.length > 0 && (
        <div className="p-2 space-y-2">
          {value.Habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={{ ...habit, color: value.color }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Identity; 