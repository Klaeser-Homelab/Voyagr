import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ValueForm.css';

const ValueForm = ({ valueToEdit, onValueUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#000000'
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (valueToEdit) {
      setFormData({
        name: valueToEdit.Name,
        color: valueToEdit.Color
      });
    }
  }, [valueToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (valueToEdit) {
        // Update existing value
        await axios.put(`http://localhost:3001/api/values/${valueToEdit.VID}`, {
          Name: formData.name,
          Color: formData.color
        }, {
          withCredentials: true
        });
        setMessage('Value updated successfully!');
      } else {
        // Create new value
        await axios.post('http://localhost:3001/api/values', {
          Name: formData.name,
          Color: formData.color
        }, {
          withCredentials: true
        });
        setMessage('Value created successfully!');
      }
      
      setFormData({ name: '', color: '#000000' }); // Reset form
      setError(null);
      if (onValueUpdated) onValueUpdated();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save value');
      setMessage(null);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="value-form">
      <h2>{valueToEdit ? 'Edit Value' : 'Create New Value'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Value Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter value name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="color">Color:</label>
          <div className="color-input-container">
            <input
              type="color"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
            <input
              type="text"
              value={formData.color}
              onChange={handleChange}
              name="color"
              placeholder="#000000"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
        </div>

        <button type="submit">
          {valueToEdit ? 'Update Value' : 'Create Value'}
        </button>
      </form>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ValueForm; 