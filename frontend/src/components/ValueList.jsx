import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import ValueForm from './ValueForm';
import ValueCard from './ValueCard';
import ActiveValueCard from './ActiveValueCard';
import { Link } from 'react-router-dom';
import { useSelection } from '../context/SelectionContext';
import { useTimer } from '../context/TimerContext';

function ValueList() {
  const { activeValue, activeInput, handleValueSelect } = useSelection();
  const { resetTimer } = useTimer();
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleAbandonSession = () => {
    handleValueSelect(null);
    resetTimer();
  };

  if (loading) {
    return <div className="text-gray-600">Loading values...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!activeValue) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2>Values</h2>
          <Link to="/values" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </Link>
        </div>

        <div className="flex flex-wrap gap-4">
          {values.map(value => (
            <div key={value.VID} className="w-80">
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
        <h2>Active Value</h2>
        <div className="flex items-center gap-4">
        <button className="btn btn-dash btn-success">Submit Session</button>

          <button 
            onClick={handleAbandonSession}
            className="btn btn-dash btn-error"
          >
            Abandon Session
          </button>
          <Link to="/values" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <ActiveValueCard value={activeValue} />
      </div>
    </div>
  );
}

export default ValueList;