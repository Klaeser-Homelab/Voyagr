import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';

const HabitForm = ({ habitToEdit, value, onHabitUpdated }) => {
  const [formData, setFormData] = useState({
    Name: habitToEdit?.description || '',
    isScheduled: false,
    startTime: habitToEdit?.startTime || '',
    endTime: habitToEdit?.endTime || '',
    daysOfWeek: habitToEdit?.daysOfWeek || []
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const daysOfWeek = [
    { id: 0, name: 'Sun' },
    { id: 1, name: 'Mon' },
    { id: 2, name: 'Tue' },
    { id: 3, name: 'Wed' },
    { id: 4, name: 'Thu' },
    { id: 5, name: 'Fri' },
    { id: 6, name: 'Sat' }
  ];

  useEffect(() => {
    if (habitToEdit) {
      setFormData({
        Name: habitToEdit.description,
        isScheduled: habitToEdit.isScheduled,
        startTime: habitToEdit.startTime,
        endTime: habitToEdit.endTime,
        daysOfWeek: habitToEdit.daysOfWeek
      });
    }
  }, [habitToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that we have a value.VID (parent_id) before proceeding
    if (!value || !value.VID) {
      setError('Cannot create habit: Missing parent value ID');
      console.error('Missing value.VID:', value);
      return;
    }
    
    try {
      const submitData = {
        description: formData.Name,
        parent_id: value.VID,
        ...(formData.isScheduled ? {
          startTime: formData.startTime,
          endTime: formData.endTime,
          daysOfWeek: formData.daysOfWeek
        } : {
          startTime: null,
          endTime: null,
          daysOfWeek: null
        })
      };

      console.log('Submitting habit data:', submitData);
      console.log('Value being used:', value);

      if (habitToEdit) {
        // Update existing habit
        console.log('Updating habit with ID:', habitToEdit.IID);
        await axios.put(`${api.endpoints.habits}/${habitToEdit.IID}`, submitData, {
          withCredentials: true
        });
        setMessage('Habit updated successfully!');
      } else {
        // Create new habit
        console.log('Creating new habit with parent_id:', submitData.parent_id);
        const response = await axios.post(api.endpoints.habits, submitData, {
          withCredentials: true
        });
        console.log('Habit created successfully:', response.data);
        setMessage('Habit created successfully!');
      }
      
      setFormData({
        Name: '',
        isScheduled: false,
        startTime: '',
        endTime: '',
        daysOfWeek: []
      }); // Reset form
      setError(null);
      if (onHabitUpdated) onHabitUpdated();
    } catch (err) {
      console.error("Habit submission error:", err);
      console.error("Error details:", err.response?.data);
      setError(err.response?.data?.error || 'Failed to save habit');
      setMessage(null);
    }
  };

  const handleDayToggle = (dayId) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(dayId)
        ? prev.daysOfWeek.filter(id => id !== dayId)
        : [...prev.daysOfWeek, dayId].sort()
    }));
  };

  return (
    <div className="value-form">
      <h2>{habitToEdit ? 'Edit Habit' : 'Create New Habit'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={formData.Name}
            onChange={(e) => setFormData(prev => ({ ...prev, Name: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isScheduled"
            checked={formData.isScheduled}
            onChange={(e) => setFormData(prev => ({ ...prev, isScheduled: e.target.checked }))}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isScheduled" className="ml-2 block text-sm text-gray-900">
            Schedule this habit
          </label>
        </div>

        {formData.isScheduled && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required={formData.isScheduled}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required={formData.isScheduled}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days of Week
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map(day => (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => handleDayToggle(day.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium
                      ${formData.daysOfWeek.includes(day.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {day.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {habitToEdit ? 'Update Habit' : 'Create Habit'}
          </button>
        </div>

        {message && <div className="mt-2 text-green-600">{message}</div>}
        {error && <div className="mt-2 text-red-600">{error}</div>}
      </form>
    </div>
  );
};

export default HabitForm; 