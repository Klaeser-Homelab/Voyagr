import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TodoList({ activeValue, isActiveEvent }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editDescription, setEditDescription] = useState('');

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/todos?completed=false');
      console.debug('Fetched todos:', response.data);
      setTodos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to load todos');
      setLoading(false);    
    }
  };

  const handleDelete = async (todo) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await axios.delete(`http://localhost:3001/api/todos/${todo.DOID}`);
        console.debug('Todo deleted:', todo.DOID);
        fetchTodos(); // Refresh the list
      } catch (error) {
        console.error('Error deleting todo:', error);
        setError('Failed to delete todo');
      }
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleEdit = (todo) => {
    setEditingTodo(todo.DOID);
    setEditDescription(todo.description);
  };

  const handleSaveEdit = async (todo) => {
    try {
      await axios.patch(`http://localhost:3001/api/todos/${todo.DOID}`, {
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
        await axios.patch(`http://localhost:3001/api/todos/${todo.DOID}/toggle`);
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
      {todos
        .filter(todo => {
          if (!activeValue) return true; // Show all todos if no value selected
          
          // Check if todo is directly linked to this value
          if (todo.type === 'value' && todo.Value?.VID === activeValue.VID) {
            return true;
          }
          
          // Check if todo is linked to an input that belongs to this value
          if (todo.type === 'input' && todo.Input?.Value?.VID === activeValue.VID) {
            return true;
          }
          
          return false;
        })
        .map(todo => {
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
                        onClick={() => handleDelete(todo)}
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