import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import './ValueForm.css'; // We can reuse the form styles

const InputForm = ({ inputToEdit, values, onInputUpdated }) => {
  const [formData, setFormData] = useState({
    Name: inputToEdit?.Name || '',
    VID: inputToEdit?.VID || '',
    isScheduled: false,
    startTime: inputToEdit?.startTime || '',
    endTime: inputToEdit?.endTime || '',
    daysOfWeek: inputToEdit?.daysOfWeek || []
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
    if (inputToEdit) {
      setFormData({
        Name: inputToEdit.Name,
        VID: inputToEdit.VID,
        isScheduled: inputToEdit.isScheduled,
        startTime: inputToEdit.startTime,
        endTime: inputToEdit.endTime,
        daysOfWeek: inputToEdit.daysOfWeek
      });
    }
  }, [inputToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        Name: formData.Name,
        VID: formData.VID,
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

      if (inputToEdit) {
        // Update existing input
        await axios.put(`${api.endpoints.inputs}/${inputToEdit.IID}`, submitData, {
          withCredentials: true
        });
        setMessage('Input updated successfully!');
      } else {
        // Create new input
        await axios.post(api.endpoints.inputs, submitData, {
          withCredentials: true
        });
        setMessage('Input created successfully!');
      }
      
      setFormData({
        Name: '',
        VID: '',
        isScheduled: false,
        startTime: '',
        endTime: '',
        daysOfWeek: []
      }); // Reset form
      setError(null);
      if (onInputUpdated) onInputUpdated();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save input');
      setMessage(null);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
      <h2>{inputToEdit ? 'Edit Input' : 'Create New Input'}</h2>
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Value
          </label>
          <select
            value={formData.VID}
            onChange={(e) => setFormData(prev => ({ ...prev, VID: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select a value</option>
            {values.map(value => (
              <option key={value.VID} value={value.VID}>
                {value.Name}
              </option>
            ))}
          </select>
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
            Schedule this input
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
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {inputToEdit ? 'Update Input' : 'Create Input'}
          </button>
        </div>
      </form>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default InputForm; 