import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import ValueForm from '../components/ValueForm';
import EditValueCard from '../components/EditValueCard';
import BreakSettingForm from '../components/BreakSettingForm';
import axios from 'axios';
import { api } from '../config/api';

const ProfilePage = () => {
  const { values, refreshValues } = useProfile();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await refreshValues();
        setLoading(false);
      } catch (err) {
        console.error('Error loading values:', err);
        setError('Failed to load values');
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshValues]);

  const handleValueEdit = async (value, newName, newColor) => {
    try {
      await axios.patch(`${api.endpoints.values}/${value.VID}`, {
        description: newName,
        color: newColor
      }, { withCredentials: true });

      await refreshValues();
    } catch (error) {
      console.error('Error updating value:', error);
    }
  };

  const handleHabitDelete = async (habit) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await axios.delete(`${api.endpoints.habits}/${habit.IID}`, {
          withCredentials: true
        });
        await refreshValues();
      } catch (error) {
        console.error('Error deleting habit:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-gray-600">Loading values...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-4 flex-grow overflow-y-auto">
      <div className="space-y-6">
        <div className="bg-base-100 rounded-lg m-10">
          <ValueForm onValueUpdated={refreshValues} />
        </div>

        <div className="flex flex-col gap-4 p-10">
          {values.map((value) => (
            <EditValueCard
              key={value.id}
              value={value}
              onValueEdit={handleValueEdit}
              onHabitDelete={handleHabitDelete}
              onHabitCreated={refreshValues}
            />
          ))}
        </div>
      </div>
      <BreakSettingForm />
    </div>
  );
};

export default ProfilePage;