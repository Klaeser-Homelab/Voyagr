import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import ValueForm from './ValueForm';
import ValueCard from './ValueCard';
import ActiveValueCard from './ActiveValueCard';
import ActiveBreakCard from './ActiveBreakCard';
import { Link } from 'react-router-dom';
import { useSelection } from '../context/SelectionContext';
import { useTimer } from '../context/TimerContext';
import { useToday } from '../context/TodayContext';
import ActiveCard from './ActiveCard';

function ValueList() {
  const { activeValue, activeInput, handleValueSelect, handleInputSelect } = useSelection();
  const { isBreak, resetTimer, mode, setIsBreak, setMinutes } = useTimer();
  const { fetchEvents } = useToday();
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTodos, setCurrentTodos] = useState([]);

  const handleSubmitSession = async () => {
    if (!activeValue) {
      console.warn('No value selected, cannot submit session');
      return;
    }

    try {
      // Submit the session
      const eventResponse = await axios.post(api.endpoints.events, {
        VID: activeValue.VID,
        IID: activeInput?.IID,
        duration: 30 * 60, // 30 minutes in seconds
        type: 'session'
      });
      
      // Process completed todos with the event ID
      const completedTodos = currentTodos
        .filter(todo => todo.completed)
        .map(todo => ({
          ...todo,
          EID: eventResponse.data.EID // Add the event ID to each completed todo
        }));
      
      console.log('Completed todos:', completedTodos);
      if (completedTodos.length > 0) {
        await axios.post(`${api.endpoints.todos}/batchprocess`, completedTodos);
        console.log('Completed todos processed:', completedTodos);
      }

      // Reset timer and start break
      resetTimer();
      setIsBreak(true);
      setMinutes(5); // Set break time

      // After successful submission, refetch Today's events
      await fetchEvents();
    } catch (error) {
      console.error('Error submitting session:', error);
    }
  };

  const handleAbandonSession = () => {
    handleValueSelect(null);
    handleInputSelect(null);
    resetTimer();
  };

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

  const handleInputClick = (input) => {
    setActiveInput(input);
    setActiveValue(null); // Close active value card when showing input card
  };

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
  onClick={handleAbandonSession}
  className={`btn btn-dash btn-error`}
>
  Abandon Session
</button>
        </div>
        <div className="flex flex-wrap gap-4">
        <ActiveBreakCard value={activeValue} />

        </div>
      </div>
    );
  }

  if (!activeValue && !activeInput) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold mb-4">Start an Activity</h2>
          <div className="flex items-center gap-4">
        
        </div>

        </div>

        <div className="flex flex-wrap gap-4">
          {values.map(value => (
            <div key={value.VID} className="flex-1 basis-[40vw]">
              <ValueCard value={value} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold mb-4">Current Activity</h2>
        <div className="flex items-center gap-4">
<button 
  onClick={handleAbandonSession}
  className={`btn btn-dash btn-error`}
>
  Abandon Session
</button>
          <button 
            onClick={handleSubmitSession}
            className={`btn btn-success ${mode === 'timer' ? 'btn-dash' : ''}`}
            >
            Submit Session
          </button>
        </div>
      </div>

      {activeValue && (
        <div className="min-w-[30vw] flex-1 basis-[40vw]">
          <ActiveCard 
            item={activeValue} 
          />
        </div>
      )}
      {activeInput && (
        <div className="min-w-[30vw] flex-1 basis-[40vw]">
          <ActiveCard 
            item={activeInput} 
          />
        </div>
      )}
    </div>
  );
}

export default ValueList;