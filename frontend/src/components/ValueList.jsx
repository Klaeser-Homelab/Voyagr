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

function ValueList() {
  const { activeValue, activeInput, handleValueSelect, handleInputSelect } = useSelection();
  const { isBreak, resetTimer, mode, setIsBreak, setMinutes } = useTimer();
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [todoQueue, setTodoQueue] = useState([]); // Queue for unsaved todos
  
  const addToQueue = (updatedTodo) => {
      setTodoQueue((prevQueue) => {
        const index = prevQueue.findIndex((todo) => todo.DOID === updatedTodo.DOID);
        if (index !== -1) {
          // Replace the existing todo in the queue
          const newQueue = [...prevQueue];
          newQueue[index] = updatedTodo;
          return newQueue;
        }
        // Add new todo to the queue
        return [...prevQueue, updatedTodo];
      });
    };

  const submitSession = async () => {
    if (!activeValue) {
      console.warn('No value selected, cannot submit session');
      return;
    }

    try {
      await axios.post(api.endpoints.events, {
        VID: activeValue.VID,
        IID: activeInput?.IID,
        duration: 30 * 60, // 30 minutes in seconds
        type: 'session'
      });
      
      // Reset timer and start break
      resetTimer();
      setIsBreak(true);
      setMinutes(5); // Set break time
    } catch (error) {
      console.error('Error submitting session:', error);
    }
    try {
      await axios.post(`${api.endpoints.todos}/batchprocess`, todoQueue);
      console.log('Todos submitted:', todoQueue);
      setTodoQueue([]); // Clear the queue after submission
    } catch (error) {
      console.error('Error submitting todos:', error);
    }
  };

  const handleAbandonSession = () => {
    handleValueSelect(null);
    handleInputSelect(null);
    resetTimer();
  };

  const fetchValues = async () => {
    try {
      const response = await axios.get(api.endpoints.values);
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

  if (!activeValue) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2>Values</h2>
          <div className="flex items-center gap-4">
        
          <Link to="/values" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </Link>
        </div>

        </div>

        <div className="flex flex-wrap gap-4">
          {values.map(value => (
            <div key={value.VID} className="flex-1 basis-[40vw]">
              <ValueCard value={value} addToQueue={addToQueue} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2>Active Value</h2>
        <div className="flex items-center gap-4">
<button 
  onClick={handleAbandonSession}
  className={`btn btn-dash btn-error`}
>
  Abandon Session
</button>
          <button 
            onClick={submitSession}
            className={`btn btn-success ${mode === 'timer' ? 'btn-dash' : ''}`}
            >
            Submit Session
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
          <ActiveValueCard value={activeValue} />
      </div>
    </div>
  );
}

export default ValueList;