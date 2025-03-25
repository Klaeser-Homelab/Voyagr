import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import './Today.css';

function Today() {
  const [completedTodos, setCompletedTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current hour
  const currentHour = new Date().getHours();
  
  // Create array of hours from current hour down to 8am
  const hours = Array.from(
    { length: Math.max(0, currentHour - 7) }, 
    (_, i) => currentHour - i
  ).filter(hour => hour >= 8); // Only show hours from 8am onwards

  useEffect(() => {
    const fetchCompletedTodos = async () => {
      try {
        const response = await axios.get(`${api.endpoints.todos}?completed=true`);
        setCompletedTodos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching completed todos:', error);
        setError('Failed to fetch completed todos');
        setLoading(false);
      }
    };

    fetchCompletedTodos();
  }, []);

  const formatHour = (hour) => {
    if (hour === 12) return '12 PM';
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  // Get todos for a specific hour
  const getTodosForHour = (hour) => {
    return completedTodos.filter(todo => {
      const completedTime = new Date(todo.updatedAt);
      return completedTime.getHours() === hour;
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="today-container">
      <h2>Today's Completed Tasks</h2>
      <div className="timeline">
        {hours.map(hour => {
          const todosInHour = getTodosForHour(hour);
          return (
            <div key={hour} className="hour-slot">
              <div className="time-label">{formatHour(hour)}</div>
              <div className="todos-for-hour">
                {todosInHour.map(todo => (
                  <div 
                    key={todo.DOID} 
                    className="completed-todo"
                    style={{ 
                      borderLeft: `4px solid ${todo.type === 'value' ? todo.Value?.Color : todo.Input?.Value?.Color || '#ddd'}`
                    }}
                  >
                    <span className="todo-description">{todo.description}</span>
                    <span className="todo-reference">
                      {todo.type === 'value' ? todo.Value?.Name : todo.Input?.Name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Today;

