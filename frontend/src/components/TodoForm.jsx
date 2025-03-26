import React, { useState } from 'react';
import axios from 'axios';
import { api } from '../config/api';

function TodoForm({ onTodoAdded, activeValue, activeInput }) {
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Determine the type and referenceId based on what's active
    const type = activeInput ? 'input' : 'value';
    const referenceId = activeInput ? activeInput.IID : activeValue?.VID;

    if (!referenceId) {
      console.warn('No active value or input selected');
      return;
    }

    try {
      await axios.post(api.endpoints.todos, {
        description,
        type,
        referenceId
      });
      
      setDescription('');
      
      if (onTodoAdded) onTodoAdded();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  // Get the color to use for the border
  const borderColor = activeInput?.Value?.Color || activeValue?.Color || '#ddd';

  return (
    <form 
      onSubmit={handleSubmit} 
      className="todo-form"
      style={{
        borderLeft: `4px solid ${borderColor}`,
        paddingLeft: '1rem',
        borderRadius: '4px'
      }}
    >
      <div className="form-row">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter todo description"
          required
        />
        <button type="submit" className="add-todo-button">+</button>
      </div>
    </form>
  );
}

export default TodoForm; 