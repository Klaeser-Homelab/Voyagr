import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ValueForm from './ValueForm';
import './List.css';

function ValueList({ onValueSelect, activeValue }) {
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingValue, setEditingValue] = useState(null);
  const [showValueForm, setShowValueForm] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [editingInput, setEditingInput] = useState(null);

  const fetchValues = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/values');
      setValues(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching values:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValues();
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
    // fetchData();
  };

  const handleInputEdit = async (input, newName) => {
    try {
      await axios.patch(`http://localhost:3001/api/inputs/${input.IID}`, {
        Name: newName
      });
      fetchValues();
      setEditingInput(null);
    } catch (error) {
      console.error('Error updating input:', error);
    }
  };

  const handleInputDelete = async (input) => {
    if (window.confirm('Are you sure you want to delete this input?')) {
      try {
        await axios.delete(`http://localhost:3001/api/inputs/${input.IID}`);
        fetchValues();
      } catch (error) {
        console.error('Error deleting input:', error);
      }
    }
  };

  const handleValueChange = async (input, newVID) => {
    try {
      await axios.patch(`http://localhost:3001/api/inputs/${input.IID}`, {
        VID: newVID
      });
      fetchValues();
    } catch (error) {
      console.error('Error updating input value:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="list-container">
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

      {values.map(value => (
        <div 
          key={value.VID}
          className={`value-card ${activeValue?.VID === value.VID ? 'active' : ''}`}
        >
          <div 
            className="value-header"
            onClick={() => handleValueClick(value)}
            style={{ backgroundColor: value.Color }}
          >
            <h3>{value.Name}</h3>
          </div>
          
          {value.Inputs && value.Inputs.length > 0 && (
            <div className="nested-inputs">
              {value.Inputs.map(input => (
                <div key={input.IID} className="nested-input-card">
                  {editingInput === input.IID ? (
                    <div className="edit-input-form">
                      <input
                        type="text"
                        defaultValue={input.Name}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleInputEdit(input, e.target.value);
                          } else if (e.key === 'Escape') {
                            setEditingInput(null);
                          }
                        }}
                        autoFocus
                      />
                      <select
                        value={value.VID}
                        onChange={(e) => handleValueChange(input, e.target.value)}
                      >
                        {values.map(v => (
                          <option key={v.VID} value={v.VID}>
                            {v.Name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="input-display">
                      <h4>{input.Name}</h4>
                      <div className="input-actions">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingInput(input.IID);
                          }}
                          className="edit-button"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInputDelete(input);
                          }}
                          className="delete-button"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ValueList; 