import React, { useEffect, useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useEvent } from '../context/EventContext';
import { useBreakCycle } from '../context/BreakCycleContext';
import ValueCard from './ValueCard';
import ActiveCard from './ActiveCard';

function ValueList() {
  const { mode, activeItem, activeEvent, updateEvent, deleteEvent } = useEvent();
  const { values, refreshValues } = useProfile();
  const { fetchBreaks } = useBreakCycle();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        await Promise.all([
          refreshValues(),
          fetchBreaks()
        ]);
        setLoading(false);
      } catch (err) {
        console.error('Error loading profile data:', err);
        setError('Failed to load values');
        setLoading(false);
      }
    };

    fetchAll();
  }, [refreshValues, fetchBreaks]);

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
        {values.map((value) => (
          <div key={value.id}>
            <ValueCard value={value} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="md:py-14 lg:py-20 xl:py-28">
      <div className="flex items-center justify-center gap-4 p-4">
        <button onClick={deleteEvent} className="btn btn-dash btn-error">
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
        <ActiveCard key={activeItem.id} item={activeItem} />
      </div>
    </div>
  );
}

export default ValueList;