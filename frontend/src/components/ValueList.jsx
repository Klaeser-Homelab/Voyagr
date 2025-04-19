import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import ValueCard from './ValueCard';
import { useEvent } from '../context/EventContext';
import ActiveCard from './ActiveCard';
import { useBreakCycle } from '../context/BreakCycleContext';

function ValueList() {
  const { mode, activeItem, activeEvent, updateEvent, deleteEvent } = useEvent();
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchBreaks } = useBreakCycle();

  useEffect(() => {
    fetchBreaks();
  }, [fetchBreaks]);

  const fetchValues = async () => {
    try {
      const response = await axios.get(api.endpoints.values + '/no-default-breaks', {
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

  if (!activeEvent) {
    return (
        <div className="container p-14 w-full max-w-md flex flex-col gap-4">
          <h1 className="text-2xl text-center font-bold">What's next?</h1>
          {values.map(value => (
            <div key={value.id}>
              <ValueCard 
              key={value.id}
              value={value} 
              />
            </div>
          ))}
        </div>
    );
  }

  if (activeEvent) {
    return (
      <div className="md:py-14 lg:py-20 xl:py-28">
        <div className="flex items-center justify-center gap-4 p-4">
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

      <div className="min-w-[30vw] flex-1 basis-[40vw]">
        <ActiveCard 
          key={activeItem.id}
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