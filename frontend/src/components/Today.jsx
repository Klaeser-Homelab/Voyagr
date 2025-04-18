import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventBar from './EventBar';
import { useToday } from '../context/TodayContext';

function Today() {
  const { events, loading, error, fetchEvents } = useToday();
  
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const formatHour = (hour) => {
    if (hour === 12) return '12 PM';
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  // Get events for a specific hour
  const getEventsForHour = (hour) => {
    return events.filter(event => {
      const eventTime = new Date(event.createdAt);
      return eventTime.getHours() === hour;
    });
  };

  if (loading) return <div className="flex justify-center items-center h-32">Loading...</div>;
  if (error) return <div className="text-error text-center p-4">{error}</div>;

  return (
    <div className="border-t-2 border-gray-700 bg-gray-800 shadow-lg p-5 h-full flex flex-col flex-grow overflow-y-auto">
      <EventBar completedEvents={events} />
      <Link to="/history" className="link link-hover text-base-content/70">
        History
      </Link>
      <h2 className="text-2xl font-bold mb-4">Today's Activity</h2>
      <div className="flex-1 flex flex-col gap-4">
        {Array.from({ length: 13 }, (_, i) => i + 8).map(hour => {
          const eventsInHour = getEventsForHour(hour);
          return (
            <div key={hour} className="flex flex-wrap gap-4 py-2 border-b border-base-200 flex-grow">
              <div className="w-20 font-medium text-base-content/70">
                {formatHour(hour)}
              </div>
              <div className="flex-1 w-fit flex flex-col gap-2">
                {eventsInHour.map(event => (
                  <div 
                    key={event.id} 
                    className="card bg-base-200 p-2 flex flex-col gap-2"
                    style={{ 
                      borderLeft: `4px solid ${event.color || '#ddd'}`
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium whitespace-nowrap">
                        {event.description} ({Math.round(event.duration / (1000 * 60))} min)
                      </span>
                    </div>
                    {event.todos && event.todos.length > 0 && (
                      <div className="pl-4 text-sm space-y-1">
                        {event.todos.map(todo => (
                          <div key={todo.id} className="flex items-center gap-2">
                            <span className="text-base-content/70">✓</span>
                            <span>{todo.description}</span>
                          </div>
                        ))}
                      </div>
                    )}
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

