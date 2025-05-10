import React, { useEffect, useState } from 'react';
import { useValues } from '../../../context/ValuesContext';
import { TrashIcon } from '@heroicons/react/24/outline';

// This form relies on a local state that is synced on save.
const BreakSettingsForm = () => {
  const { breaks, deleteBreak, updateBreak, fetchBreaks } = useValues();
  const [error, setError] = useState(null);
  const [localBreaks, setLocalBreaks] = useState(breaks);

  useEffect(() => {
    // Fetch breaks when component mounts
    fetchBreaks();
  }, [fetchBreaks]);

  useEffect(() => {
    console.log('breaks updated in context:', breaks);
    setLocalBreaks(breaks);
  }, [breaks]);

  const handleLocalBreakChange = (id, value) => {
    setLocalBreaks(prevBreaks => 
      prevBreaks.map(breakItem => 
        breakItem.id === id 
          ? { ...breakItem, interval: value * 60000 } 
          : breakItem
      )
    );
  };
  
  const handleLocalBreakSave = async (id) => {
    const breakToUpdate = localBreaks.find(b => b.id === id);
    if (breakToUpdate) {
      try {
        await updateBreak(id, { interval: breakToUpdate.interval });
        // Refresh breaks data after updating
        await fetchBreaks();
      } catch (err) {
        setError('Failed to update break');
        console.error(err);
      }
    }
  };

  const handleDeleteBreak = async (id) => {
    try {
      await deleteBreak(id);
      // Refresh breaks data after deletion
      await fetchBreaks();
    } catch (err) {
      setError('Failed to delete break');
      console.error(err);
    }
  };

  // Check if a specific break is modified
  const isBreakModified = (breakItem) => {
    const originalBreak = breaks.find(b => b.id === breakItem.id);
    return originalBreak && originalBreak.interval !== breakItem.interval;
  };

  if (error) return <p className="text-red-500">{error}</p>;
  
  if (!localBreaks || localBreaks.length === 0) {
    return (
      <div className="bg-gray-800 shadow-lg rounded-lg">
        <div className="flex flex-col p-4">
          <h2 className="text-xl font-bold">Breaks</h2>
          <p className="text-gray-400 mt-4">No breaks available. Add breaks to your habits.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg">
      <div className="flex flex-col p-4">
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
                    type="button" 
                    className="btn btn-primary btn-sm ml-2"
                    onClick={() => handleLocalBreakSave(breakItem.id)}
                    disabled={!isBreakModified(breakItem)}
                  >
                    Save
                  </button>

                  <button
                    onClick={() => handleDeleteBreak(breakItem.id)}
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
    </div>
  );
};

export default BreakSettingsForm;