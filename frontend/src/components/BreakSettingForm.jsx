import React, { useEffect, useState } from 'react';
import { useValues } from '../context/ValuesContext';
import axios from 'axios';
import { api } from '../config/api';
import { TrashIcon } from '@heroicons/react/24/outline';
// This form relies on a local state that is synced on save.
const BreakSettingsForm = () => {
  const { breaks, deleteBreak, updateBreak } = useValues();
  const [error, setError] = useState(null);
  const [localBreaks, setLocalBreaks] = useState(breaks);

  useEffect(() => {
    if (breaks.length) setLocalBreaks(breaks);
  }, [breaks]);

  const handleLocalBreakChange = (id, value) => {
    setLocalBreaks(prevBreaks => ({
      ...prevBreaks,
      [id]: value
    }));
  };
  
  const handleLocalBreakSave = (id) => {
    updateBreak(id, { interval: localBreaks[id] });
  };

  const isBreakModified = () => {
    return JSON.stringify(localBreaks) !== JSON.stringify(breaks);
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col bg-gray-800 shadow-md p-4 rounded-lg md:m-10">
      <h2 className="text-xl font-bold">Breaks</h2>
      <div className="flex flex-row gap-2 mt-2 mb-2">
            <p className="hidden md:block text-sm px-2 w-45">Habits</p>
            <p className="hidden md:block text-sm px-2 w-42">Interval</p>
          </div>
      <div className="flex flex-col gap-2">
        {localBreaks.map(breakItem => (
          <div key={breakItem.id}>
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex flex-row items-center gap-2 border-l-2 border-red-500" style={{ borderColor: breakItem.Habit?.Value?.color || '#ccc' }}>
                <p className="px-2 w-43">{breakItem.Habit?.description || 'Unknown Habit'}</p>
                <form onSubmit={(e) => { e.preventDefault(); handleLocalBreakSave(breakItem.id); }}>
                <label className="input w-45">
                  <input
                    type="number"
                    value={breakItem.interval / 60000 || ''}
                    onChange={(e) => handleLocalBreakChange(breakItem.id, e.target.value)}
                    className="input input-bordered w-15"
                  />
                  <span className="label">minutes</span>
                  </label>
                </form>
              </div>
              <div className="flex flex-row items-center gap-2">
              <button 
                type="submit" 
                className="btn btn-primary btn-sm ml-2"
                disabled={!isBreakModified()}
              >
                Save
              </button>

                <button
            onClick={() => deleteBreak(breakItem.id)}
            className="btn btn-square btn-ghost btn-sm"
          >
            <TrashIcon className="size-6" />
          </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreakSettingsForm;