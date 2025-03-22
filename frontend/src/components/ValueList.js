import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ValueForm from './ValueForm';
import './List.css';

const ValueList = ({ onValueSelect }) => {
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingValue, setEditingValue] = useState(null);
  const [showValueForm, setShowValueForm] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const fetchData = async () => {
    try {
      const [inputsResponse, valuesResponse] = await Promise.all([
        axios.get('http://localhost:3001/api/inputs', { withCredentials: true }),
        axios.get('http://localhost:3001/api/values', { withCredentials: true })
      ]);
      setValues(valuesResponse.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleValueClick = (value) => {
    const newSelected = selectedValue?.VID === value.VID ? null : value;
    setSelectedValue(newSelected);
    onValueSelect(newSelected); // Pass null or the value to parent for filtering
  };

  const handleEditValue = (e, value) => {
    e.stopPropagation(); // Prevent card click when clicking edit
    setEditingValue(value);
    setShowValueForm(true);
  };

  const handleValueUpdated = () => {
    setShowValueForm(false);
    setEditingValue(null);
    fetchData();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="list">
      <h2>Values</h2>
      <button 
        className="add-button"
        onClick={() => {
          setEditingValue(null);
          setShowValueForm(true);
        }}
      >
        Add New Value
      </button>

      {showValueForm && (
        <ValueForm 
          valueToEdit={editingValue}
          onValueUpdated={handleValueUpdated}
        />
      )}

      <div className="grid">
        {values.map(value => (
          <div 
            key={value.VID} 
            className={`card ${selectedValue?.VID === value.VID ? 'active' : ''}`}
            onClick={() => handleValueClick(value)}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <button 
              className="edit-icon"
              onClick={(e) => handleEditValue(e, value)}
            >
              ✎
            </button>
            <div 
              className="color"
              style={{ backgroundColor: value.Color }}
            />
            <div className="info">
              <h3>{value.Name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValueList; 