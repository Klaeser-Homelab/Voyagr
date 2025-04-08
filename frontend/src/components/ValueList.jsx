import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import ValueCard from './ValueCard';
import ActiveBreakCard from './ActiveBreakCard';
import { useSelection } from '../context/SelectionContext';
import { useToday } from '../context/TodayContext';
import ActiveCard from './ActiveCard';

function ValueList() {
  const { activeEvent, updateEvent, deleteEvent,
    isBreak, mode, activeItem } = useSelection();
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchValues = async () => {
    try {
      const response = await axios.get(api.endpoints.values, {
        withCredentials: true
      });
      setValues(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching values:', error);
      setError('Failed to load values');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValues();
  }, []);

  if (loading) {
    return <div className="text-gray-600">Loading values...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (isBreak) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2>Break Time</h2>
          <button 
  onClick={deleteEvent}
  className={`btn btn-dash btn-error`}
>
  Abandon Session
</button>
        </div>
        <div className="flex flex-wrap gap-4">
        <ActiveBreakCard value={activeItem} />

        </div>
      </div>
    );
  }

  if (!activeEvent) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold mb-4">Start an Activity</h2>
          <div className="flex items-center gap-4">
        
        </div>

        </div>

        <div className="flex flex-wrap gap-4">
          {values.map(value => (
            <div key={value.item_id} className="flex-1 basis-[40vw]">
              <ValueCard 
              key={value.item_id}
              value={value} 
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeEvent) {
    return (
      <div className="p-4">
      <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold mb-4">Current Activity</h2>
        <div className="flex items-center gap-4">
<button 
  onClick={deleteEvent}
  className={`btn btn-dash btn-error`}
>
  Abandon Session
</button>
          <button 
            onClick={updateEvent}
            className={`btn btn-success ${mode === 'timer' ? 'btn-dash' : ''}`}
            >
            Submit Session
          </button>
        </div>
      </div>

      <div className="min-w-[30vw] flex-1 basis-[40vw]">
        <ActiveCard 
          key={activeItem.item_id}
          item={activeItem} 
        />
      </div>
    </div>
    );
  }

  return (
    <h1>null</h1>
  );
}

export default ValueList;