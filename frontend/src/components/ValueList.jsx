import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import ValueForm from './ValueForm';
import ValueCard from './ValueCard';

function ValueList({ onValueSelect, onInputSelect, activeValue, activeInput }) {
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingValue, setEditingValue] = useState(null);
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

  const handleValueUpdated = () => {
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

  if (loading) return <div className="flex items-center justify-center h-32">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Values</h2>
        <button 
          className={`p-2 rounded-full transition-colors duration-200 ${
            isEditMode 
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
              : 'hover:bg-gray-100'
          }`}
          onClick={() => {
            setIsEditMode(!isEditMode);
            if (!isEditMode) {
              setEditingValue(null);
            }
          }}
          title={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        >
          ✏️
        </button>
      </div>

      <div className="relative">
        <div className="overflow-x-auto pb-4">
          <div className="flex flex-row space-x-4 min-w-max">
            {isEditMode && (
              <div className="w-80 shrink-0">
                <ValueForm 
                  valueToEdit={editingValue}
                  onValueUpdated={handleValueUpdated}
                />
              </div>
            )}

            {values.map(value => (
              <div key={value.VID} className="w-80 shrink-0">
                <ValueCard
                  value={value}
                  activeValue={activeValue}
                  activeInput={activeInput}
                  isEditMode={isEditMode}
                  editingInput={editingInput}
                  setEditingInput={setEditingInput}
                  onValueClick={handleValueClick}
                  onInputClick={handleInputClick}
                  onInputEdit={handleInputEdit}
                  onInputDelete={handleInputDelete}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ValueList; 