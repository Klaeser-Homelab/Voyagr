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
        description: newName
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

  return (
    <div className="flex flex-col gap-4 flex-grow overflow-y-auto">
      <div className="space-y-6">
        <div className="bg-base-200 dark:bg-base-800 rounded-lg shadow p-6">
          <ValueForm onValueUpdated={fetchValues} />
        </div>

        <div className="flex flex-col gap-4 p-10">
          {values.map(value => (
            <EditValueCard
              key={value.id}
              value={value}
              onValueEdit={handleValueEdit}
              onHabitDelete={handleHabitDelete}
              onHabitCreated={fetchValues}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 