import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import ValueForm from '../components/ValueForm';
import EditValueCard from '../components/EditValueCard';

const ValuesPage = () => {
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleValueEdit = async (value, newName, newColor) => {
    try {
      await axios.patch(`${api.endpoints.values}/${value.VID}`, {
        Name: newName,
        color: newColor
      });
      fetchValues();
    } catch (error) {
      console.error('Error updating value:', error);
    }
  };

  const handleInputEdit = async (input, newName) => {
    try {
      await axios.patch(`${api.endpoints.inputs}/${input.IID}`, {
        Name: newName
      });
      fetchValues();
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading values...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <main className="main-content">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Values</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <ValueForm onValueUpdated={fetchValues} />
        </div>

        <div className="column left-column">
          {values.map(value => (
            <EditValueCard
              key={value.VID}
              value={value}
              onValueEdit={handleValueEdit}
              onInputEdit={handleInputEdit}
              onInputDelete={handleInputDelete}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default ValuesPage; 