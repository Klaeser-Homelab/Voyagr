import React, { useState, useEffect } from 'react';
import api from '../../../config/api'; // Adjust this import to match your API setup

// Modified to accept an id prop for the dialog element
const ScheduleHabitDialog = ({ habit, onSave, id = "schedule_habit_modal" }) => {
  // Form state
  const [startTime, setStartTime] = useState('08:00');
  const [frequencyType, setFrequencyType] = useState('daily');
  const [daysOfWeek, setDaysOfWeek] = useState([1, 2, 3, 4, 5]); // Mon-Fri by default
  const [weekOfMonth, setWeekOfMonth] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [schedules, setSchedules] = useState([]);
  
  // Days of week mapping for display
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Frequency types for display
  const frequencyTypes = {
    daily: 'Daily',
    weekly: 'Weekly',
    biweekly: 'Biweekly',
    monthly: 'Monthly',
    custom: 'Custom'
  };

  // Clear error when dialog opens
  useEffect(() => {
    // Add event listener to dialog to reset error when it opens
    const dialogElement = document.getElementById(id);
    if (dialogElement) {
      const handleDialogOpen = () => {
        setError(null);
      };
      
      // Listen for the dialog being opened
      dialogElement.addEventListener('show', handleDialogOpen);
      
      // Cleanup event listener
      return () => {
        dialogElement.removeEventListener('show', handleDialogOpen);
      };
    }
  }, [id]);

  // Initialize schedules from habit and reset whenever the habit changes
  useEffect(() => {
    // Reset the state when habit changes
    setStartTime('08:00');
    setFrequencyType('daily');
    setDaysOfWeek([1, 2, 3, 4, 5]);
    setWeekOfMonth(null);
    setError(null); // Reset error when habit changes
    
    // Update schedules based on the current habit
    if (habit && habit.Schedules && habit.Schedules.length > 0) {
      setSchedules(habit.Schedules);
      setShowForm(false); // Hide form initially if schedules exist
    } else {
      setSchedules([]);
      setShowForm(true); // Show form immediately if no schedules
    }
  }, [habit?.id]); // Important: depend on habit.id, not the entire habit object
  
  // Handle day selection toggle
  const toggleDay = (dayIndex) => {
    if (daysOfWeek.includes(dayIndex)) {
      setDaysOfWeek(daysOfWeek.filter(day => day !== dayIndex));
    } else {
      setDaysOfWeek([...daysOfWeek, dayIndex].sort());
    }
  };
  
  // Format time for display (converts "14:30:00" to "2:30 PM")
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    // Handle different time formats
    const timeParts = timeString.split(':');
    if (timeParts.length < 2) return timeString;
    
    let hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };
  
  // Format days of week for display
  const formatDaysOfWeek = (daysArray) => {
    if (!daysArray || !Array.isArray(daysArray) || daysArray.length === 0) {
      return 'None';
    }
    
    if (daysArray.length === 7) {
      return 'Every day';
    }
    
    return daysArray.map(day => dayNames[day]).join(', ');
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null); // Clear any previous errors
    
    const scheduleData = {
      habit_id: habit.id,
      start_time: startTime,
      frequency_type: frequencyType,
      days_of_week: frequencyType === 'daily' ? null : daysOfWeek,
      week_of_month: ['biweekly', 'monthly'].includes(frequencyType) ? weekOfMonth : null,
      is_active: true
    };
    
    try {
      // Send data to your API
      const response = await api.post('/api/schedules', scheduleData);
      
      // Add the new schedule to the list
      setSchedules([...schedules, response.data]);
      
      // Reset the form
      setShowForm(false);
      
      // If successful, call the onSave callback
      if (onSave) {
        onSave(response.data);
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      setError('Failed to create schedule. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle schedule deletion
  const handleDeleteSchedule = async (scheduleId) => {
    setError(null); // Clear any previous errors
    try {
      await api.put(`/api/schedules/${scheduleId}`, { is_active: false });
      // Remove the deleted schedule from the list
      setSchedules(schedules.filter(schedule => schedule.id !== scheduleId));
      
      // If all schedules are deleted, show the form
      if (schedules.length <= 1) {
        setShowForm(true);
      }
      
      // Notify parent component
      if (onSave) {
        onSave({ deleted: scheduleId });
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      setError('Failed to delete schedule. Please try again.');
    }
  };
  
  // Close the dialog
  const closeDialog = () => {
    setError(null); // Clear error when closing dialog
    const modal = document.getElementById(id);
    if (modal) modal.close();
  };

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);
  
  // Update form based on frequency type changes
  useEffect(() => {
    if (frequencyType === 'daily') {
      setDaysOfWeek([0, 1, 2, 3, 4, 5, 6]); // All days
    } else if (frequencyType === 'weekly' && daysOfWeek.length === 0) {
      setDaysOfWeek([1]); // Default to Monday if nothing selected
    }
    
    if (!['biweekly', 'monthly'].includes(frequencyType)) {
      setWeekOfMonth(null);
    } else if (weekOfMonth === null) {
      setWeekOfMonth(1); // Default to first week
    }
  }, [frequencyType]);

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Schedule Habit</h3>
        <p className="py-2">
          {habit?.description}
        </p>
        
        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
            <button className="btn btn-xs btn-ghost" onClick={() => setError(null)}>×</button>
          </div>
        )}
        
        {/* Existing Schedules */}
        {schedules.length > 0 && (
          <div className="my-4">
            <h4 className="font-semibold mb-2">Current Schedules</h4>
            <div className="space-y-3">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="bg-base-200 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-medium">
                      {formatTime(schedule.start_time)} • {frequencyTypes[schedule.frequency_type]}
                    </div>
                    <div className="text-sm text-base-content/70">
                      {schedule.frequency_type !== 'daily' && formatDaysOfWeek(schedule.days_of_week)}
                      {schedule.week_of_month && ` • Week ${schedule.week_of_month === -1 ? 'Last' : schedule.week_of_month}`}
                    </div>
                  </div>
                  <button 
                    className="btn btn-sm btn-ghost text-error" 
                    onClick={() => handleDeleteSchedule(schedule.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            
            {!showForm && (
              <button 
                className="btn btn-sm btn-outline mt-4 w-full" 
                onClick={() => {
                  setError(null); // Clear error when showing form
                  setShowForm(true);
                }}
              >
                Add Another Schedule
              </button>
            )}
          </div>
        )}
        
        {/* Schedule Form */}
        {showForm ? (
          <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
            <div className="flex flex-col gap-2">
              {/* Start Time */}
              <div className="flex flex-row gap-2 justify-between">
                <label className="label">
                  <span className="label-text">Start Time</span>
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="input input-bordered w-40 max-w-xs"
                  required
                />
              </div>
              
              {/* Frequency Type */}
              <div className="flex flex-row gap-2 justify-between">
                <label className="label">
                  <span className="label-text">Repeat</span>
                </label>
                <select
                  value={frequencyType}
                  onChange={(e) => setFrequencyType(e.target.value)}
                  className="select select-bordered w-40 max-w-xs"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
            
            {/* Days of Week - Show if not daily */}
            {frequencyType !== 'daily' && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Days of Week</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {dayNames.map((day, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`btn btn-sm ${daysOfWeek.includes(index) ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => toggleDay(index)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Week of Month - Show if biweekly or monthly */}
            {['biweekly', 'monthly'].includes(frequencyType) && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Week of Month</span>
                </label>
                <select
                  value={weekOfMonth || ''}
                  onChange={(e) => setWeekOfMonth(Number(e.target.value))}
                  className="select select-bordered w-full"
                >
                  <option value="1">First Week</option>
                  <option value="2">Second Week</option>
                  <option value="3">Third Week</option>
                  <option value="4">Fourth Week</option>
                  <option value="-1">Last Week</option>
                </select>
              </div>
            )}
            
            <div className="modal-action">
              <button 
                type="button" 
                className="btn" 
                onClick={() => {
                  setError(null); // Clear error when canceling
                  if (schedules.length > 0) {
                    setShowForm(false);
                  } else {
                    closeDialog();
                  }
                }}
              >
                {schedules.length > 0 ? 'Cancel' : 'Close'}
              </button>
              <button 
                type="submit" 
                className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Schedule'}
              </button>
            </div>
          </form>
        ) : (
          <div className="modal-action">
            <button 
              type="button" 
              className="btn" 
              onClick={closeDialog}
            >
              Close
            </button>
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setError(null)}>close</button>
      </form>
    </dialog>
  );
};

export default ScheduleHabitDialog;