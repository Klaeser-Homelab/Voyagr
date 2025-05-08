import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventBar from './EventBar';
import { useToday } from '../../../context/TodayContext';
import { PlayIcon } from '@heroicons/react/24/solid';
import api from '../../../config/api';
import { useEvent } from '../../../context/EventContext';
function Today() {
  const { events, error, fetchEvents } = useToday();
  const [scheduledHabits, setScheduledHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startingHabit, setStartingHabit] = useState(null);
  const { getHabitAndCreateEvent } = useEvent();
  
  // Fetch events and scheduled habits for today
  useEffect(() => {
    fetchEvents();
    fetchTodaySchedules();
  }, [fetchEvents]);

  // Fetch schedules that should occur today
  const fetchTodaySchedules = async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Get all scheduled habits
      const response = await api.get('/api/schedules/today');
      
      // Filter and format schedules for today
      const todaySchedules = response.data.map(schedule => {
        // Convert start_time string to a Date object for today
        const [hours, minutes] = schedule.start_time.split(':');
        const scheduleTime = new Date();
        scheduleTime.setHours(parseInt(hours, 10));
        scheduleTime.setMinutes(parseInt(minutes, 10));
        scheduleTime.setSeconds(0);
        
        return {
          ...schedule,
          scheduleTime
        };
      });
      
      // Sort by start time
      todaySchedules.sort((a, b) => a.scheduleTime - b.scheduleTime);
      
      setScheduledHabits(todaySchedules);
    } catch (error) {
      console.error('Error fetching today schedules:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const formatHour = (hour) => {
    if (hour === 12) return '12 PM';
    if (hour === 0) return '12 AM';
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // Get events and scheduled habits for a specific hour
  const getItemsForHour = (hour) => {
    // Get events for this hour
    const eventsInHour = events.filter(event => {
      const eventTime = new Date(event.createdAt);
      return eventTime.getHours() === hour;
    });
    
    // Get scheduled habits for this hour
    const schedulesInHour = scheduledHabits.filter(schedule => 
      schedule.scheduleTime.getHours() === hour
    );
    
    return { eventsInHour, schedulesInHour };
  };

  // Check if a scheduled habit has already been started (has a corresponding event)
  const isHabitStarted = (schedule) => {
    return events.some(event => 
      event.habit_id === schedule.habit_id && 
      new Date(event.createdAt).toDateString() === new Date().toDateString()
    );
  };

  if (error) return <div className="text-error text-center p-4">{error}</div>;

  // Get hours from 6 AM to 10 PM (more comprehensive day view)
  const displayHours = Array.from({ length: 17 }, (_, i) => i + 6);

  return (
    <div className="border-t-2 border-gray-700 bg-gray-800 shadow-lg p-5 h-full flex flex-col flex-grow overflow-y-auto">
      <EventBar completedEvents={events} />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Today's Activity</h2>
        <Link to="/history" className="link link-hover text-base-content/70">
          History
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-2">
          {displayHours.map(hour => {
            const { eventsInHour, schedulesInHour } = getItemsForHour(hour);
            const hasItems = eventsInHour.length > 0 || schedulesInHour.length > 0;
            
            return (
              <div 
                key={hour} 
                className={`flex flex-wrap gap-4 border-b border-base-200 ${
                  hasItems ? 'min-h-[80px]' : 'min-h-[40px]'
                }`}
              >
                <div className="w-20 font-medium text-base-content/70">
                  {formatHour(hour)}
                </div>
                <div className="flex-1 w-fit flex flex-col gap-2">
                  {/* Scheduled Habits */}
                  {schedulesInHour.map(schedule => {
                    const started = isHabitStarted(schedule);
                    
                    return (
                      <div 
                        key={`schedule-${schedule.id}`} 
                        className={`card ${started ? 'bg-base-300/60' : 'bg-base-200'} p-2`}
                        style={{ 
                          borderLeft: `4px solid ${schedule.color || '#ddd'}`
                        }}
                      >
                        <div className="flex flex-row gap-2 items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="badge badge-outline">Scheduled</div>
                            <span className="font-medium">
                              {schedule.habit_description} • {Math.round(schedule.habit_duration / (1000 * 60))} min
                            </span>
                          </div>
                          <PlayIcon className="size-6 text-white" onClick={() => getHabitAndCreateEvent(schedule.habit_id)} />
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Completed Events */}
                  {eventsInHour.map(event => (
                    <div 
                      key={`event-${event.id}`} 
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
      )}
    </div>
  );
}

export default Today;