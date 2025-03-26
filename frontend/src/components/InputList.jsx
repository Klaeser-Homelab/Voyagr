import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../config/api';
import InputForm from './InputForm';
import './List.css';

const InputList = ({ activeInput, onInputSelect, filterValue, onFilterChange }) => {
  const [inputs, setInputs] = useState([]);
  const [values, setValues] = useState([]); // We need values for the dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingInput, setEditingInput] = useState(null);
  const [showInputForm, setShowInputForm] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [inputsResponse, valuesResponse] = await Promise.all([
        axios.get(api.endpoints.inputs, { withCredentials: true }),
        axios.get(api.endpoints.values, { withCredentials: true })
      ]);
      setInputs(inputsResponse.data);
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

  const handleEditInput = (input) => {
    setEditingInput(input);
    setShowInputForm(true);
  };

  const handleInputUpdated = () => {
    setShowInputForm(false);
    setEditingInput(null);
    fetchData();
  };

  const handleCardClick = (input) => {
    onInputSelect(input);  // Set as active input
    navigate(`/inputs/${input.IID}/events`);  // Navigate to events view
  };

  const handleTodoToggle = async (todoId, completed) => {
    try {
      await axios.patch(`${api.endpoints.todos}/${todoId}`, {
        completed
      });
      // Refresh the inputs list to get updated todo status
      fetchData();
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const filteredInputs = filterValue 
    ? inputs.filter(input => input.VID === filterValue.VID)
    : inputs;

  const clearFilter = () => {
    onFilterChange(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="list">
      <h2>
        Inputs
        {filterValue && (
          <span className="filter-tag" style={{ backgroundColor: filterValue.Color }}>
            Filtered by: {filterValue.Name}
            <button 
              className="clear-filter"
              onClick={clearFilter}
            >
              ×
            </button>
          </span>
        )}
      </h2>
      <button 
        className="add-button"
        onClick={() => {
          setEditingInput(null);
          setShowInputForm(true);
        }}
      >
        Add New Input
      </button>

      {showInputForm && (
        <InputForm 
          inputToEdit={editingInput}
          values={values}
          onInputUpdated={handleInputUpdated}
        />
      )}

      <div className="grid">
        {filteredInputs.map(input => (
          <div 
            key={input.IID} 
            className={`card ${activeInput?.IID === input.IID ? 'active' : ''}`}
            onClick={() => handleCardClick(input)}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <button 
              className="edit-icon"
              onClick={(e) => {
                e.stopPropagation();
                handleEditInput(input);
              }}
            >
              ✎
            </button>
            <div 
              className="color"
              style={{ backgroundColor: input.Value?.Color || '#ccc' }}
            />
            <div className="info">
              <h3>{input.Name}</h3>
              <p>{input.Value?.Name || 'No value assigned'}</p>
            </div>

            {/* Add Todos section */}
            {input.Todos && input.Todos.length > 0 && (
              <div className="todos-section">
                <ul className="todo-list">
                  {input.Todos.map(todo => (
                    <li 
                      key={todo.DOID}
                      className={`todo-item ${todo.completed ? 'completed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={(e) => handleTodoToggle(todo.DOID, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span>{todo.content}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputList; 