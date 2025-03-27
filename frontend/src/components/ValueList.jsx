import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import ValueForm from './ValueForm';
import ValueCard from './ValueCard';
import { Link } from 'react-router-dom';

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
      setError('Failed to load values');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValues();
  }, []);

  const handleValueUpdated = () => {
    setEditingValue(null);
    fetchValues();
  };

  const handleValueClick = (value) => {
    onValueSelect(value);
  };

  const handleInputClick = (input) => {
    onInputSelect(input);
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

  if (loading) {
    return <div className="text-gray-600">Loading values...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2>Values</h2>
        <Link to="/values" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit
        </Link>
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