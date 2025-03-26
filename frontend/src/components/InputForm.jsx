import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import './ValueForm.css'; // We can reuse the form styles

const InputForm = ({ inputToEdit, values, onInputUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    vid: ''
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (inputToEdit) {
      setFormData({
        name: inputToEdit.Name,
        vid: inputToEdit.VID
      });
    }
  }, [inputToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (inputToEdit) {
        // Update existing input
        await axios.put(`${api.endpoints.inputs}/${inputToEdit.IID}`, {
          Name: formData.name,
          VID: formData.vid
        }, {
          withCredentials: true
        });
        setMessage('Input updated successfully!');
      } else {
        // Create new input
        await axios.post(api.endpoints.inputs, {
          Name: formData.name,
          VID: formData.vid
        }, {
          withCredentials: true
        });
        setMessage('Input created successfully!');
      }
      
      setFormData({ name: '', vid: '' }); // Reset form
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

  return (
    <div className="value-form">
      <h2>{inputToEdit ? 'Edit Input' : 'Create New Input'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Input Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter input name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="vid">Associated Value:</label>
          <select
            id="vid"
            name="vid"
            value={formData.vid}
            onChange={handleChange}
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

        <button type="submit">
          {inputToEdit ? 'Update Input' : 'Create Input'}
        </button>
      </form>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default InputForm; 