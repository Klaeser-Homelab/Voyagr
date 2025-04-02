import React from 'react';
import Todo from './Todo';
import TodoForm from './TodoForm';

const ActiveInputCard = ({ input, onClose }) => {
  if (!input) return null;

  return (
    <div 
      className="card bg-base-100 shadow-lg"
      style={{ borderLeft: `4px solid ${input.Value?.Color || '#ddd'}` }}
    >
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h2 className="card-title">{input.Name}</h2>
          <button 
            onClick={onClose}
            className="btn btn-ghost btn-sm"
          >
            ×
          </button>
        </div>
        <p className="text-base-content/70">{input.Description}</p>
        
        <div className="p-2 space-y-2">
          <Todo value={input.Value} input={input} />
          <TodoForm value={input.Value} input={input} />
        </div>
      </div>
    </div>
  );
};

export default ActiveInputCard; 