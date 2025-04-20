import React, { useEffect, useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import axios from 'axios';
import { api } from '../config/api';

const BreakSettingsForm = () => {
  const { breaks, refreshBreaks } = useProfile([]);
  const [error, setError] = useState(null);
  const [intervals, setIntervals] = useState({});

  // Sync local intervals state with profile context breaks
  useEffect(() => {
    const initialIntervals = breaks.reduce((acc, breakItem) => {
      acc[breakItem.id] = breakItem.interval / 60000; // ms → minutes
      return acc;
    }, {});
    setIntervals(initialIntervals);
  }, [breaks]);

  const deleteBreak = async (id) => {
    try {
      await axios.delete(api.endpoints.breaks, {
        data: { id },
        withCredentials: true
      });
      refreshBreaks(); // Keep context in sync
    } catch (error) {
      console.error('Error deleting break:', error);
      setError('Failed to delete break');
    }
  };

  const updateBreak = async (id, interval) => {
    try {
      await axios.put(api.endpoints.break, {
        id,
        interval
      }, { withCredentials: true });
      refreshBreaks(); // Keep context in sync
    } catch (error) {
      console.error('Error updating break:', error);
      setError('Failed to update break');
    }
  };

  const handleIntervalChange = (id, value) => {
    setIntervals({
      ...intervals,
      [id]: value
    });
  };

  const handleIntervalSubmit = (id) => {
    const newInterval = intervals[id] * 60000; // Convert to ms
    updateBreak(id, newInterval);
  };

  if (error) return <p className="text-red-500">{error}</p>;

  console.log("breaks in BreakSettingForm:", breaks);

  return (
    <div className="flex flex-col bg-gray-800 shadow-md gap-4 p-4 rounded-lg m-10">
      <h2 className="text-xl font-bold">Breaks</h2>
      <div className="flex flex-col gap-2">
        {breaks.map(breakItem => (
          <div key={breakItem.id}>
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: breakItem.Habit?.Value?.color || '#ccc' }}
                />
                <p>{breakItem.Habit?.description || 'Unknown Habit'}</p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <form onSubmit={(e) => { e.preventDefault(); handleIntervalSubmit(breakItem.id); }}>
                  <input
                    type="number"
                    value={intervals[breakItem.id] || ''}
                    onChange={(e) => handleIntervalChange(breakItem.id, e.target.value)}
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