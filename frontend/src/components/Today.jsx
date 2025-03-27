import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import { Link } from 'react-router-dom';
import ToDoBar from './ToDoBar';
import './Today.css';
import EventBar from './EventBar';
function Today() {
  const [completedTodos, setCompletedTodos] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate time percentages
  const startHour = 8;  // 8 AM
  const endHour = 19;   // 7 PM
  const totalHours = endHour - startHour;
  const currentHour = new Date().getHours();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both todos and events in parallel
        const [todosResponse, eventsResponse] = await Promise.all([
          axios.get(`${api.endpoints.todos}/completed/today`),
          axios.get(`${api.endpoints.events}/today`)
        ]);
        
        setCompletedTodos(todosResponse.data);
        setCompletedEvents(eventsResponse.data);
        setEvents(eventsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatHour = (hour) => {
    if (hour === 12) return '12 PM';
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  const formatDuration = (seconds) => {
    const minutes = Math.round(seconds / 60);
    return `${minutes} min`;
  };

  // Get items for a specific hour (combining todos and events)
  const getItemsForHour = (hour) => {
    const todosInHour = completedTodos.filter(todo => {
      const completedTime = new Date(todo.updatedAt);
      return completedTime.getHours() === hour;
    });

    const eventsInHour = events.filter(event => {
      const eventTime = new Date(event.createdAt);
      return eventTime.getHours() === hour;
    });

    // Combine and sort by timestamp in ascending order (oldest first)
    return [...todosInHour, ...eventsInHour];
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="today-container">
      <EventBar completedEvents={completedEvents} />
      <ToDoBar completedTodos={completedTodos} events={events} />
      <Link to="/history" className="text-gray-600 hover:text-gray-900">
        History
      </Link>
      <h2>Today's Activity</h2>
      <div className="timeline">
        {Array.from(
          { length: Math.max(0, currentHour - 7) }, 
          (_, i) => currentHour - i
        ).filter(hour => hour >= 8).map(hour => {
          const itemsInHour = getItemsForHour(hour);
          return (
            <div key={hour} className="hour-slot">
              <div className="time-label">{formatHour(hour)}</div>
              <div className="items-for-hour">
                {itemsInHour.reverse().map(item => (
                  <div 
                    key={item.DOID || item.EID} 
                    className="completed-item"
                    style={{ 
                      borderLeft: `4px solid ${
                        item.DOID  // if it's a todo
                          ? (item.type === 'value' ? item.Value?.Color : item.Input?.Value?.Color)
                          : (item.color || '#ddd')  // if it's an event
                      }`
                    }}
                  >
                    <span className="item-description">
                      {item.DOID 
                        ? item.description 
                        : `Event (${Math.round(item.duration / 60)} min)`
                      }
                    </span>
                    <span className="item-reference">
                      {item.DOID
                        ? (item.type === 'value' ? item.Value?.Name : item.Input?.Name)
                        : (item.inputName || item.valueName)
                      }
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

