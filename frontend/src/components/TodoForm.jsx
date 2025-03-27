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
    <div 
      className="card bg-base-100 shadow-xl"
      style={{
        borderLeft: `16px solid ${borderColor}`,
        paddingLeft: '1rem',
        borderRadius: '4px'
      }}
    >
      <div className="card-body">
        <div className="form-control">
          <div className="input-group">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter todo description"
              className="input input-bordered w-full"
              required
            />
            <button 
              onClick={handleSubmit} 
              className="btn btn-square btn-primary"
              aria-label="Add todo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoForm; 