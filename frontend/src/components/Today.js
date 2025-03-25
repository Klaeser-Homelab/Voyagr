import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import './Today.css';

function Today() {
  const [completedTodos, setCompletedTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate time percentages
  const startHour = 8;  // 8 AM
  const endHour = 19;   // 7 PM
  const totalHours = endHour - startHour;
  const currentHour = new Date().getHours();
  
  // Calculate time segments
  const getTimeSegments = () => {
    const segments = [];
    let remainingPercent = 100;

    // Group completed todos by value
    const todosByValue = completedTodos.reduce((acc, todo) => {
      const valueId = todo.type === 'value' ? todo.Value?.VID : todo.Input?.Value?.VID;
      const valueName = todo.type === 'value' ? todo.Value?.Name : todo.Input?.Value?.Name;
      const valueColor = todo.type === 'value' ? todo.Value?.Color : todo.Input?.Value?.Color;
      
      if (!valueId) return acc;
      
      if (!acc[valueId]) {
        acc[valueId] = {
          name: valueName,
          color: valueColor,
          count: 0,
          todos: []
        };
      }
      
      acc[valueId].count++;
      acc[valueId].todos.push(todo);
      return acc;
    }, {});

    // Calculate percentages for completed work
    const completedHours = Math.min(currentHour - startHour, totalHours);
    const completedPercent = (completedHours / totalHours) * 100;
    
    // Add segments for completed work
    Object.values(todosByValue).forEach(value => {
      const percent = (value.count / completedTodos.length) * completedPercent;
      segments.push({
        name: value.name,
        color: value.color,
        percent: percent.toFixed(1)
      });
      remainingPercent -= percent;
    });

    // Add remaining time segment if within working hours
    if (currentHour >= startHour && currentHour < endHour) {
      segments.push({
        name: 'Remaining',
        color: '#e0e0e0',
        percent: remainingPercent.toFixed(1)
      });
    }

    return segments;
  };

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

  const timeSegments = getTimeSegments();

  return (
    <div className="today-container">
      <div className="time-bar">
        {timeSegments.map((segment, index) => (
          <div
            key={index}
            className="time-segment"
            style={{
              width: `${segment.percent}%`,
              backgroundColor: segment.color,
            }}
            title={`${segment.name}: ${segment.percent}%`}
          />
        ))}
      </div>
      <div className="time-legend">
        {timeSegments.map((segment, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: segment.color }} 
            />
            <span>{segment.name}: {segment.percent}%</span>
          </div>
        ))}
      </div>
      <h2>Today's Completed Tasks</h2>
      <div className="timeline">
        {Array.from(
          { length: Math.max(0, currentHour - 7) }, 
          (_, i) => currentHour - i
        ).filter(hour => hour >= 8).map(hour => {
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

