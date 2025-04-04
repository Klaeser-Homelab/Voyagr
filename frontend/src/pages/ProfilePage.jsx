import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import ValueForm from '../components/ValueForm';
import EditValueCard from '../components/EditValueCard';

const ProfilePage = () => {
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

  const handleValueEdit = async (value, newName, newColor) => {
    try {
      await axios.patch(`${api.endpoints.values}/${value.VID}`, {
        description: newName,
        color: newColor
      });
      fetchValues();
    } catch (error) {
      console.error('Error updating value:', error);
    }
  };

  const handleHabitEdit = async (habit, newName) => {
    try {
      await axios.patch(`${api.endpoints.habits}/${habit.IID}`, {
        Name: newName
      }, {
        withCredentials: true
      });
      fetchValues();
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  const handleHabitDelete = async (habit) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await axios.delete(`${api.endpoints.habits}/${habit.IID}`);
        fetchValues();
      } catch (error) {
        console.error('Error deleting habit:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100 dark:bg-base-900">
        <div className="text-xl text-base-content dark:text-base-200">Loading values...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100 dark:bg-base-900">
        <div className="text-xl text-error">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-base-content dark:text-base-200">Values</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-base-200 dark:bg-base-800 rounded-lg shadow p-6">
          <ValueForm onValueUpdated={fetchValues} />
        </div>

        <div className="column left-column">
          {values.map(value => (
            <EditValueCard
              key={value.VID}
              value={value}
              onValueEdit={handleValueEdit}
              onHabitEdit={handleHabitEdit}
              onHabitDelete={handleHabitDelete}
              onHabitCreated={fetchValues}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProfilePage; 