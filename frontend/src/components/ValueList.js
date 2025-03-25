import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import ValueForm from './ValueForm';
import './List.css';

function ValueList({ onValueSelect, onInputSelect, activeValue, activeInput }) {
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingValue, setEditingValue] = useState(null);
  const [showValueForm, setShowValueForm] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [editingInput, setEditingInput] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchValues = async () => {
    try {
      const response = await axios.get(api.endpoints.values);
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

  const handleValueClick = (value, e) => {
    e.stopPropagation();
    console.debug('Value clicked:', value.Name);
    if (activeValue?.VID === value.VID) {
        onValueSelect(null);
    } else {
        onValueSelect(value);
    }
  };

  const handleInputClick = (input, value, e) => {
    e.stopPropagation();
    console.debug('Input clicked:', input.Name, 'from value:', value.Name);
    if (activeInput?.IID === input.IID) {
        onInputSelect(null);
    } else {
        onInputSelect({ ...input, Value: value });
    }
  };

  const handleEditValue = (e, value) => {
    e.stopPropagation(); // Prevent card click when clicking edit
    setEditingValue(value);
    setShowValueForm(true);
  };

  const handleValueUpdated = () => {
    setShowValueForm(false);
    setEditingValue(null);
    fetchValues();
  };

  const handleInputEdit = async (input, newName) => {
    try {
      await axios.patch(`${api.endpoints.inputs}/${input.IID}`, {
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
        await axios.delete(`${api.endpoints.inputs}/${input.IID}`);
        fetchValues();
      } catch (error) {
        console.error('Error deleting input:', error);
      }
    }
  };

  const handleValueChange = async (input, newVID) => {
    try {
      await axios.patch(`${api.endpoints.inputs}/${input.IID}`, {
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
    <>
    <div className="header-container">
    <h2>Values</h2>
    <button 
      className={`create-button ${isEditMode ? 'active' : ''}`}
      onClick={() => {
        setIsEditMode(!isEditMode);
        if (!isEditMode) {
          setEditingValue(null);
          setShowValueForm(false);
        }
      }}
      title={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
    >
      ✏️
    </button>
    </div>
    <div className={`list-container ${isEditMode ? 'edit-mode' : ''}`}>

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
            onClick={(e) => handleValueClick(value, e)}
            style={{ backgroundColor: value.Color }}
          >
            <h3>{value.Name}</h3>
          </div>
          
          {value.Inputs && value.Inputs.length > 0 && (
            <div className="nested-inputs">
              {value.Inputs.map(input => (
                <div 
                  key={input.IID} 
                  className={`nested-input-card ${activeInput?.IID === input.IID ? 'active' : ''}`}
                >
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
                    </div>
                  ) : (
                    <div className="input-display">
                      <div 
                        className="input-name"
                        onClick={(e) => handleInputClick(input, value, e)}
                      >
                        <h4>{input.Name}</h4>
                      </div>
                      {isEditMode && (
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
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
    </>
  );
}

export default ValueList; 