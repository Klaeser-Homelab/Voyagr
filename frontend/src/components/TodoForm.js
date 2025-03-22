import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TodoForm({ onTodoAdded }) {
  const [description, setDescription] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedInput, setSelectedInput] = useState('');
  const [type, setType] = useState('value');
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchValues = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/values');
        console.debug('Fetched values for todo form:', response.data);
        setValues(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching values:', error);
        setLoading(false);
      }
    };
    fetchValues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/todos', {
        description,
        type,
        referenceId: parseInt(type === 'value' ? selectedValue : selectedInput, 10)
      });
      
      setDescription('');
      setSelectedValue('');
      setSelectedInput('');
      
      if (onTodoAdded) onTodoAdded();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  // Get all inputs across all values
  const allInputs = values.reduce((acc, value) => {
    return acc.concat(value.Inputs.map(input => ({
      ...input,
      valueName: value.Name // Add value name for context
    })));
  }, []);

  if (loading) return <div>Loading values...</div>;

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-row">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter todo description"
          required
        />
      </div>

      <div className="form-row">
        <label>
          <input
            type="radio"
            name="type"
            value="value"
            checked={type === 'value'}
            onChange={(e) => {
              setType(e.target.value);
              setSelectedInput('');
            }}
          /> Assign to Value
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="input"
            checked={type === 'input'}
            onChange={(e) => {
              setType(e.target.value);
              setSelectedValue('');
            }}
          /> Assign to Input
        </label>
      </div>

      <div className="form-row">
        {type === 'value' ? (
          <select
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
            required
          >
            <option value="">Select a Value</option>
            {values.map(value => (
              <option key={value.VID} value={value.VID}>
                {value.Name}
              </option>
            ))}
          </select>
        ) : (
          <select
            value={selectedInput}
            onChange={(e) => setSelectedInput(e.target.value)}
            required
          >
            <option value="">Select an Input</option>
            {allInputs.map(input => (
              <option key={input.IID} value={input.IID}>
                {input.Name} ({input.valueName})
              </option>
            ))}
          </select>
        )}
      </div>

      <button type="submit">Add Todo</button>
    </form>
  );
}

export default TodoForm; 