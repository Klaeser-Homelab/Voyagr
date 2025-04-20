import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';

const ValueForm = ({ valueToEdit, onValueUpdated }) => {
  const [formData, setFormData] = useState({
    Name: '',
    color: '#4A90E2'
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (valueToEdit) {
      setFormData({
        Name: valueToEdit.Name,
        color: valueToEdit.color
      });
    }
  }, [valueToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (valueToEdit) {
        // Update existing value
        await axios.put(`${api.endpoints.values}/${valueToEdit.VID}`, {
          description: formData.Name,
          color: formData.color
        }, {
          withCredentials: true
        });
        setMessage('Value updated successfully!');
      } else {
        // Create new value
        await axios.post(api.endpoints.values, {
          description: formData.Name,
          color: formData.color
        }, {
          withCredentials: true
        });
        setMessage('Value created successfully!');
      }
      
      setFormData({
        Name: '',
        color: '#4A90E2'
      }); // Reset form
      setError(null);
      if (onValueUpdated) onValueUpdated();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save value');
      setMessage(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="card bg-gray-800 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">{valueToEdit ? 'Edit Value' : 'Create New Identity'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Identity name e.g. 'Athlete', 'Writer', 'Entrepreneur'"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Color</span>
            </label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-12 h-12 rounded cursor-pointer"
              />
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="input input-bordered flex-1"
                pattern="^#[0-9A-Fa-f]{6}$"
                required
              />
            </div>
          </div>

          <div className="card-actions justify-end">
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              {valueToEdit ? 'Update Value' : 'Create Value'}
            </button>
          </div>
        </form>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default ValueForm; 