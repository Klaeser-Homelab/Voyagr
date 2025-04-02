import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';

const ValueForm = ({ valueToEdit, onValueUpdated }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Color: '#4A90E2'
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (valueToEdit) {
      setFormData({
        Name: valueToEdit.Name,
        Description: valueToEdit.Description,
        Color: valueToEdit.Color
      });
    }
  }, [valueToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (valueToEdit) {
        // Update existing value
        await axios.put(`${api.endpoints.values}/${valueToEdit.VID}`, {
          Name: formData.Name,
          Description: formData.Description,
          Color: formData.Color
        }, {
          withCredentials: true
        });
        setMessage('Value updated successfully!');
      } else {
        // Create new value
        await axios.post(api.endpoints.values, {
          Name: formData.Name,
          Description: formData.Description,
          Color: formData.Color
        }, {
          withCredentials: true
        });
        setMessage('Value created successfully!');
      }
      
      setFormData({
        Name: '',
        Description: '',
        Color: '#4A90E2'
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
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">{valueToEdit ? 'Edit Value' : 'Create New Value'}</h2>
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
              placeholder="Enter value name"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              className="textarea textarea-bordered h-24"
              placeholder="Enter value description"
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
                name="Color"
                value={formData.Color}
                onChange={handleChange}
                className="w-12 h-12 rounded cursor-pointer"
              />
              <input
                type="text"
                name="Color"
                value={formData.Color}
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
              style={{ 
                backgroundColor: formData.Color,
                borderColor: formData.Color 
              }}
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