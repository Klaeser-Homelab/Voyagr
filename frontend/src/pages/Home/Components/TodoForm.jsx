import React, { useState } from 'react';
import axios from 'axios';
import api from '../../../config/api';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useEvent } from '../../../context/EventContext';
function TodoForm({ item, onTodoAdded }) {
  const { activeEvent } = useEvent();
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('submitting todo');
    
    try {
      const response = await api.post('/api/todos', {
        description,
        event_id: activeEvent.id,
      });
      
      setDescription('');
      
      // Add the new todo to local state using the response data
      if (onTodoAdded) {
        onTodoAdded(response.data);
      }
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  // Get the color to use for the border
  const borderColor = item.color || '#ddd';

  return (
    <div className="form-control">
      <div className="flex items-center gap-2 w-full">
        <button 
          onClick={handleSubmit} 
          className="btn btn-square btn-primary"
        >
          <PlusIcon className="h-6 w-6" />
        </button>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(e);
            }
          }}
          placeholder="Enter todo"
          className="input input-bordered flex-1 bg-gray-700 placeholder:text-white"
          required
        />
      </div>
    </div>
  );
}

export default TodoForm; 