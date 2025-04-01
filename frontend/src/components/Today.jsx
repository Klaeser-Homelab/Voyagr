import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ToDoBar from './ToDoBar';
import EventBar from './EventBar';
import { useToday } from '../context/TodayContext';

function Today() {
  const { events, completedTodos, loading, error, fetchAll } = useToday();

  // Calculate time percentages
  const startHour = 8;  // 8 AM
  const endHour = 19;   // 7 PM
  const totalHours = endHour - startHour;
  const currentHour = new Date().getHours();
  
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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

  if (loading) return <div className="flex justify-center items-center h-32">Loading...</div>;
  if (error) return <div className="text-error text-center p-4">{error}</div>;

  return (
    <div className="bg-base-100 shadow-lg p-4 w-full">
      <EventBar completedEvents={events} />
      <ToDoBar completedTodos={completedTodos} events={events} />
      <Link to="/history" className="link link-hover text-base-content/70">
        History
      </Link>
      <h2 className="text-2xl font-bold mb-4">Today's Activity</h2>
      <div className="flex flex-col gap-4">
        {Array.from(
          { length: Math.max(0, currentHour - 7) }, 
          (_, i) => currentHour - i
        ).filter(hour => hour >= 8).map(hour => {
          const itemsInHour = getItemsForHour(hour);
          return (
            <div key={hour} className="flex gap-4 py-2 border-b border-base-200">
              <div className="w-20 font-medium text-base-content/70">
                {formatHour(hour)}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                {itemsInHour.reverse().map(item => (
                  <div 
                    key={item.DOID || item.EID} 
                    className="card bg-base-200 p-2 flex justify-between items-center"
                    style={{ 
                      borderLeft: `4px solid ${
                        item.DOID  // if it's a todo
                          ? (item.type === 'value' ? item.Value?.Color : item.Input?.Value?.Color)
                          : (item.color || '#ddd')  // if it's an event
                      }`
                    }}
                  >
                    <span className="font-medium">
                      {item.DOID 
                        ? item.description 
                        : `Event (${Math.round(item.duration / 60)} min)`
                      }
                    </span>
                    <span className="text-sm text-base-content/70">
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

