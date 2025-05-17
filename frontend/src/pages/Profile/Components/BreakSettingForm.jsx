import React, { useEffect, useState } from 'react';
import { useValues } from '../../../context/ValuesContext';
import { TrashIcon, Bars3Icon, ClockIcon } from '@heroicons/react/24/outline';
import api from '../../../config/api';
// This form relies on a local state that is synced on save.
const BreakSettingsForm = () => {
  const { breaks, deleteBreak, updateBreak, fetchBreaks } = useValues();
  const [error, setError] = useState(null);
  const [localBreaks, setLocalBreaks] = useState(breaks);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  useEffect(() => {
    // Fetch breaks when component mounts
    fetchBreaks();
  }, [fetchBreaks]);

  useEffect(() => {
    //console.log('breaks updated in context:', breaks);
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
      console.log('breakToUpdate', breakToUpdate);
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

  // New function to handle reordering on the backend
  const sendReorderRequest = async (interval, reorderedBreaks) => {
    try {
      const breakIds = reorderedBreaks.map(breakItem => breakItem.id);
      
      // Import api object at the top if it's not already available in context
      // Assuming api is available through the useValues context or imported directly
      await api.post('/api/breaks/reorder', {
        interval: interval,
        break_ids: breakIds
      });

      console.log('Reorder successful');
      
      // Optionally refresh breaks data after reordering
      await fetchBreaks();
      
    } catch (error) {
      console.error('Error reordering breaks:', error);
      setError('Failed to reorder breaks');
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, item) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Only allow drag over items with the same interval
    if (draggedItem && draggedItem.interval === item.interval) {
      setDragOverItem(item);
    }
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = async (e, targetItem) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetItem.id) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    // Only allow dropping on items with the same interval
    if (draggedItem.interval !== targetItem.interval) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    // Reorder the local breaks
    const newBreaks = [...localBreaks];
    const draggedIndex = newBreaks.findIndex(b => b.id === draggedItem.id);
    const targetIndex = newBreaks.findIndex(b => b.id === targetItem.id);
    
    // Remove dragged item and insert at new position
    const [draggedBreak] = newBreaks.splice(draggedIndex, 1);
    newBreaks.splice(targetIndex, 0, draggedBreak);
    
    // Update local state immediately for responsive UI
    setLocalBreaks(newBreaks);
    
    // Send reorder request to backend
    const breaksWithSameInterval = newBreaks.filter(b => b.interval === draggedItem.interval);
    await sendReorderRequest(draggedItem.interval, breaksWithSameInterval);
    
    setDraggedItem(null);
    setDragOverItem(null);
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

        <h2 className="text-xl font-bold flex items-center gap-2"><ClockIcon className="size-6 text-gray-400" /> Break Cycle</h2>
        <div className="flex flex-row gap-2 mt-2 mb-2">
          <div className="w-6"></div> {/* Space for drag handle */}
          <p className="hidden md:block text-sm px-2 w-45">Habits</p>
          <p className="hidden md:block text-sm px-2 w-42">Interval</p>
        </div>
        <div className="flex flex-col gap-2">
          {localBreaks.map(breakItem => (
            <div 
              key={breakItem.id}
              draggable
              onDragStart={(e) => handleDragStart(e, breakItem)}
              onDragOver={(e) => handleDragOver(e, breakItem)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, breakItem)}
              className={`transition-all duration-200 rounded-lg p-2 ${
                dragOverItem?.id === breakItem.id 
                  ? 'bg-blue-600/20 border-2 border-blue-500' 
                  : ''
              } ${
                draggedItem?.id === breakItem.id 
                  ? 'opacity-50 bg-gray-600/30 border-2 border-dashed border-gray-400' 
                  : ''
              }`}
            >
              <div className="flex flex-wrap justify-between items-center">
                {/* Drag handle */}
                <div className="flex flex-row items-center gap-2">
                <div className="cursor-grab active:cursor-grabbing">
                  <Bars3Icon className="w-6 h-6 text-gray-400" />
                </div>
                <div className="border-l-4 border-red-500" style={{ borderColor: breakItem.Habit?.Value?.color || '#ccc' }}>
                <p className="px-2 w-43">{breakItem.Habit?.description || 'Unknown Habit'}</p>
                </div>
                </div>
                <div className="flex flex-row items-center gap-2">
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