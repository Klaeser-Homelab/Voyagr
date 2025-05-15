import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TimeByIdentity from './TimeByIdentity';
import { useToday } from '../../../context/TodayContext';
import { PlayIcon, CalendarIcon } from '@heroicons/react/24/solid';
import { CheckCircleIcon as CheckCircleIconOutline } from '@heroicons/react/24/outline';
import api from '../../../config/api';
import { useEvent } from '../../../context/EventContext';
import EventCard from './EventCard';

function Today() {
  const { events, error, fetchEvents } = useToday();
  const [scheduledHabits, setScheduledHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startingHabit, setStartingHabit] = useState(null);
  const { getHabitAndCreateEvent, submitHabitEvent } = useEvent();
  
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
      const dayOfWeek = today.getDay();
      
      const response = await api.get('/api/schedules/today');
      
      const todaySchedules = response.data.map(schedule => {
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

  // Get events and scheduled habits for a specific hour
  const getItemsForHour = (hour) => {
    const eventsInHour = events.filter(event => {
      const eventTime = new Date(event.occurred_at);
      return eventTime.getHours() === hour;
    });
    
    const schedulesInHour = scheduledHabits.filter(schedule => 
      schedule.scheduleTime.getHours() === hour
    );
    
    return { eventsInHour, schedulesInHour };
  };

  const isHabitStarted = (schedule) => {
    return events.some(event => 
      event.habit_id === schedule.habit_id && 
      new Date(event.occurred_at).toDateString() === new Date().toDateString()
    );
  };

  const handleStartHabit = (schedule) => {
    getHabitAndCreateEvent(schedule.habit_id, schedule.color);
  };

  const handleMarkAsDone = (e, schedule) => {
    e.stopPropagation();
    console.log('done', schedule.habit_id);
    submitHabitEvent(schedule.habit_id);
  };

  // Handle event updates - refresh the events list
  const handleEventUpdated = () => {
    fetchEvents();
  };

  if (error) return <div className="text-error text-center p-4">{error}</div>;

  const displayHours = Array.from({ length: 17 }, (_, i) => i + 6);

  return (
    <div className="border-t-2 border-gray-700 bg-gray-800 shadow-lg p-5 pt-15 h-full w-full flex flex-col">
      <TimeByIdentity completedEvents={events} />
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
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="flex flex-col gap-2">
            {displayHours.map(hour => {
              const { eventsInHour, schedulesInHour } = getItemsForHour(hour);
              const hasItems = eventsInHour.length > 0 || schedulesInHour.length > 0;
              
              return (
                <div 
                  key={hour} 
                  className={`flex flex-row gap-4 border-b border-base-200 ${
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
                        <div key={`schedule-${schedule.id}`} className="relative group">
                          {!started && (
                            <div 
                              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                              onClick={(e) => handleMarkAsDone(e, schedule)}
                            >
                              <button className="btn btn-circle btn-sm btn-success">
                                <CheckCircleIconOutline className="size-5" />
                              </button>
                            </div>
                          )}
                          
                          <div 
                            className={`card ${started ? 'bg-base-300/60' : 'bg-base-200'} p-2 cursor-pointer hover:bg-base-300 group relative`}
                            style={{ 
                              borderLeft: `20px solid ${schedule.color || '#ddd'}`
                            }}
                            onClick={() => !started && handleStartHabit(schedule)}
                          >
                            <div className="flex flex-row gap-2 items-center justify-between ">
                                <span className="font-medium">
                                  {schedule.habit_description} • {Math.round(schedule.habit_duration / (1000 * 60))} min
                                </span>
                                <CalendarIcon className="size-6 text-primary" />
                            </div>
                            
                            {!started && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-base-300/40 rounded-lg">
                                <div className="bg-primary text-primary-content rounded-full p-2">
                                  <PlayIcon className="size-5" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Completed Events */}
                    {eventsInHour.map(event => (
                      <EventCard 
                        key={`event-${event.id}`}
                        event={event}
                        onEventUpdated={handleEventUpdated}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Today;