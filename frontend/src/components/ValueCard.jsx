import React from 'react';
import InputCard from './InputCard';
import { PlayIcon } from '@heroicons/react/24/outline';
import { useTimer } from '../context/TimerContext';
import { useSelection } from '../context/SelectionContext';

function ValueCard({ value }) {
  const { startTimer } = useTimer();
  const { activeValue, activeInput, handleValueSelect, handleInputSelect } = useSelection();

  const handleValueClick = (e) => {
    handleValueSelect(value);
    startTimer();
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg
        ${activeValue?.VID === value.VID ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div 
        className="flex items-center justify-between p-4 cursor-pointer transition-colors duration-200"    
        style={{ backgroundColor: value.Color }}
      >
        <h3 className="text-lg font-semibold text-white">{value.Name}</h3>
        <PlayIcon className="size-6 text-white" onClick={handleValueClick} />
      </div>
      
      {value.Inputs && value.Inputs.length > 0 && (
        <div className="p-2 space-y-2">
          {value.Inputs.map(input => (
            <InputCard
              key={input.IID}
              input={{ ...input, color: value.Color }}
              onInputClick={(input) => handleInputSelect(input)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ValueCard; 