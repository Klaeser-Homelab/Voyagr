import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';

const TodoList = ({ activeValue, activeInput }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchTodos();
  }, [activeInput, activeValue]);

  const fetchTodos = async () => {
    let response;
    try {
     if (activeInput) {
        response = await axios.get(`${api.endpoints.todos}/incomplete/input/${activeInput.IID}`);
      } else if (activeValue) {
        response = await axios.get(`${api.endpoints.todos}/incomplete/value/${activeValue.VID}`);
      }
      else {
        response = await axios.get(`${api.endpoints.todos}/incomplete`);
      }
      console.debug('Fetched todos:', response.data);
      setTodos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to load todos');
      setLoading(false);    
    }
  };

  const handleDelete = async (todoId) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await axios.delete(`${api.endpoints.todos}/${todoId}`);
        console.debug('Todo deleted:', todoId);
        fetchTodos();
      } catch (error) {
        console.error('Error deleting todo:', error);
        setError('Failed to delete todo');
      }
    }
  };

  const handleComplete = async (todo) => {
    try {
      await axios.patch(`${api.endpoints.todos}/${todo.DOID}`, {
        completed: !todo.completed
      });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo.DOID);
    setEditDescription(todo.description);
  };

  const handleSaveEdit = async (todo) => {
    try {
      await axios.patch(`${api.endpoints.todos}/${todo.DOID}`, {
        description: editDescription
      });
      setEditingTodo(null);
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo');
    }
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setEditDescription('');
  };

  const handleToggle = async (todo) => {
    try {
      await axios.patch(`${api.endpoints.todos}/${todo.DOID}/toggle`);
      fetchTodos();
    } catch (error) {
      console.error('Error toggling todo:', error);
      setError('Failed to toggle todo');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="todo-list-container">
      {todos.map(todo => {
          const valueColor = todo.type === 'value' 
            ? todo.Value?.Color 
            : todo.Input?.Value?.Color;

          return (
            <div 
              key={todo.DOID} 
              className="todo-card"
              style={{ 
                borderLeft: `4px solid ${valueColor || '#ddd'}`,
                borderRadius: '4px',
                borderTop: `1px solid #eee`,
                borderRight: `1px solid #eee`,
                borderBottom: `1px solid #eee`
              }}
            >
              <div className="todo-header">
                {editingTodo === todo.DOID ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(todo);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      autoFocus
                    />
                    <div className="edit-buttons">
                      <button 
                        onClick={() => handleSaveEdit(todo)}
                        className="save-button"
                      >
                        ✓
                      </button>
                      <button 
                        onClick={handleCancelEdit}
                        className="cancel-button"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className={`todo-content ${todo.completed ? 'completed' : ''}`}>
                      {todo.description}
                    </span>
                    <div className="todo-actions">
                      <button 
                        onClick={() => handleEdit(todo)}
                        className="edit-button"
                        title="Edit todo"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(todo.DOID)}
                        className="delete-button"
                        title="Delete todo"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="todo-footer">
                <span className="todo-reference">
                  {todo.type === 'value' ? 'Value: ' : 'Input: '}
                  {todo.type === 'value' ? todo.Value?.Name : todo.Input?.Name}
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default TodoList; 