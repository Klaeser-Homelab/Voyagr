import React, { useEffect, useState } from 'react';
import { useValues } from '../context/ValuesContext';
import axios from 'axios';
import { api } from '../config/api';
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

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col bg-gray-800 shadow-md gap-4 p-4 rounded-lg m-10">
      <h2 className="text-xl font-bold">Breaks</h2>
      <div className="flex flex-col gap-2">
        {localBreaks.map(breakItem => (
          <div key={breakItem.id}>
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex flex-row items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: breakItem.Habit?.Value?.color || '#ccc' }}
                />
                <p>{breakItem.Habit?.description || 'Unknown Habit'}</p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <form onSubmit={(e) => { e.preventDefault(); handleLocalBreakSave(breakItem.id); }}>
                  <input
                    type="number"
                    value={breakItem.interval / 60000 || ''}
                    onChange={(e) => handleLocalBreakChange(breakItem.id, e.target.value)}
                    className="input input-bordered w-20"
                  />
                  <span> min</span>
                  <button type="submit" className="btn btn-primary ml-2">Save</button>
                </form>
                <button className="btn btn-warning" onClick={() => deleteBreak(breakItem.id)}>Remove Break</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreakSettingsForm;