import React from 'react';
import { useTimer } from '../../../context/TimerContext';

function ActiveBreakCard() {
  const { 
    minutes, 
    seconds,
  } = useTimer();

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg w-full"
    >
      <div 
        className="flex items-center justify-between p-4 cursor-pointer transition-colors duration-200"    
        style={{ backgroundColor: '#6B7280' }} // Tailwind gray-500
      >
        <h3 className="text-lg font-semibold text-white">Break Time</h3>
        <div className="flex items-center gap-4">
          <div className="text-2xl font-mono text-white">
            {`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
          </div>
        </div>
      </div>
      
      <div className="p-8 text-center text-gray-600 text-lg">
        Take a break! You've earned it.
      </div>
    </div>
  );
}

export default ActiveBreakCard; 