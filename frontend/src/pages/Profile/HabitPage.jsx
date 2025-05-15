import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/api';
import AddBreak from './Components/AddBreak';
import ScheduleHabitDialog from './Components/ScheduleHabitDialog'; // Import the dialog
import { useValues } from '../../context/ValuesContext';
import { 
  TrashIcon, 
  CheckIcon, 
  PlusIcon, 
  CalendarIcon, 
  PencilSquareIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const HabitPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateHabit, fetchBreaks } = useValues();
  
  const [habit, setHabit] = useState(null);
  const [localHabit, setLocalHabit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Break modal state
  const [breakInterval, setBreakInterval] = useState('');

  // Fetch habit data on component mount
  useEffect(() => {
    const fetchHabit = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/habits/${id}`);
        const habitData = response.data;

        console.log('habitData', habitData);
        
        setHabit(habitData);
        setLocalHabit(habitData);
      } catch (error) {
        console.error('Error fetching habit:', error);
        setError('Failed to load habit');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHabit();
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleArchive = () => {
    const updatedHabit = { ...localHabit, is_active: false };
    updateHabit(updatedHabit);
    navigate(-1);
  };

  const isHabitModified = () => {
    if (!habit || !localHabit) return false;
    return JSON.stringify(localHabit) !== JSON.stringify(habit);
  };

  const handleSave = () => {
    updateHabit(localHabit);
    setHabit(localHabit);
  };

  const handleBreakAdded = async () => {
    try {
      const response = await api.get(`/api/habits/${id}`);
      const updatedHabit = response.data;
      setHabit(updatedHabit);
      setLocalHabit(updatedHabit);
      updateHabit(updatedHabit);
    } catch (error) {
      console.error('Error refreshing habit data:', error);
    }
  };

  // Handle schedule changes from the dialog
  const handleScheduleChange = async () => {
    try {
      // Refresh habit data after schedule changes
      const response = await api.get(`/api/habits/${id}`);
      const updatedHabit = response.data;
      setHabit(updatedHabit);
      setLocalHabit(updatedHabit);
      updateHabit(updatedHabit);
    } catch (error) {
      console.error('Error refreshing habit data:', error);
    }
  };

  const handleNotesUpdate = (notes) => {
    setLocalHabit({ ...localHabit, details: notes });
  };

  // Break modal handlers
  const handleAddBreak = async () => {
    try {
      await api.post('/api/breaks', {
        habit_id: habit.id,
        interval: parseInt(breakInterval, 10) * 60000  // Convert string to number and then to milliseconds
      });
      
      // Reset form
      setBreakInterval('');
      
      fetchBreaks();

      // Notify that break was added
      await handleBreakAdded();
      
      // Close the modal
      document.getElementById('break_modal').close();
    } catch (error) {
      console.error('Error adding break:', error);
    }
  };

  const handleCloseBreakModal = () => {
    document.getElementById('break_modal').close();
    setBreakInterval('');
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const timeParts = timeString.split(':');
    if (timeParts.length < 2) return timeString;
    
    let hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  // Format days of week for display
  const formatDaysOfWeek = (daysArray) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (!daysArray || !Array.isArray(daysArray) || daysArray.length === 0) {
      return 'None';
    }
    if (daysArray.length === 7) {
      return 'Every day';
    }
    return daysArray.map(day => dayNames[day]).join(', ');
  };

  const frequencyTypes = {
    daily: 'Daily',
    weekly: 'Weekly',
    biweekly: 'Biweekly',
    monthly: 'Monthly',
    custom: 'Custom'
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-base-100 rounded-lg shadow-lg p-6">
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-base-100 rounded-lg shadow-lg p-6">
          <div className="text-center text-error">
            <p>{error}</p>
            <button onClick={handleBack} className="btn btn-primary mt-4">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if data not loaded
  if (!habit || !localHabit) {
    return null;
  }

  return (
    <div className="w-full mx-auto px-20 py-8">
      <div className="bg-base-100 rounded-lg shadow-lg p-6">
        {/* Header with editable habit description */}
        <div className="flex justify-between items-center mb-8">
          <input
            type="text"
            value={localHabit.description || ''}
            onChange={(e) => setLocalHabit({ ...localHabit, description: e.target.value })}
            className="text-3xl font-bold bg-transparent border-none outline-none focus:border-b-2 focus:border-primary transition-all duration-200 flex-1 mr-4"
            placeholder="Enter habit description"
            required
          />
          <button onClick={handleBack} className="btn btn-ghost">
            ← Back
          </button>
        </div>

        <div className="flex justify-between items-center pt-6 border-t-8" style={{ borderTopColor: localHabit.Value?.color }}>
        </div>

        {/* Basic Information Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <ClockIcon className="w-6 h-6 mr-2" />
            Duration
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <input
                type="number"
                className="input input-bordered w-full"
                value={(localHabit.duration || 0) / 60000}
                onChange={(e) => setLocalHabit({ ...localHabit, duration: e.target.value * 60000 })}
                required
              />
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CalendarIcon className="w-6 h-6 mr-2" />
            Schedule
          </h2>
          
          {/* Display existing schedules */}
          {habit.Schedules && habit.Schedules.length > 0 ? (
            <div className="bg-base-200 rounded-lg p-4 mb-4">
              <div className="space-y-3">
                {habit.Schedules.map((schedule) => (
                  <div key={schedule.id} className="bg-base-100 p-3 rounded-lg">
                    <div className="font-medium">
                      {formatTime(schedule.start_time)} • {frequencyTypes[schedule.frequency_type]}
                    </div>
                    <div className="text-sm text-base-content/70">
                      {schedule.frequency_type !== 'daily' && formatDaysOfWeek(schedule.days_of_week)}
                      {schedule.week_of_month && ` • Week ${schedule.week_of_month === -1 ? 'Last' : schedule.week_of_month}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-base-200 rounded-lg p-4 mb-4">
              <p className="text-base-content/70">No schedules configured</p>
            </div>
          )}
          
          <button
            className="btn btn-primary"
            onClick={() => document.getElementById('schedule_habit_modal').showModal()}
          >
            {habit.Schedules && habit.Schedules.length > 0 ? 'Manage Schedules' : 'Add Schedule'}
          </button>
        </div>

        {/* Notes Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <PencilSquareIcon className="w-6 h-6 mr-2" />
            Notes
          </h2>
          <textarea
            value={localHabit.details || ''}
            onChange={(e) => handleNotesUpdate(e.target.value)}
            className="textarea textarea-bordered w-full h-32"
            placeholder="Add notes about this habit..."
          />
        </div>

        {/* Break Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <ClockIcon className="w-6 h-6 mr-2" />
            Add as Break
          </h2>
          <div className="bg-base-200 rounded-lg p-4">
            <AddBreak
              habitId={habit.id}
              onBreakAdded={handleBreakAdded}
              isInModal={false}
            />
            
            {/* Button to open break modal */}
            <button
              className="btn btn-primary mt-4"
              onClick={() => document.getElementById('break_modal').showModal()}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Break
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-6 border-t">
          <button
            onClick={handleArchive}
            className="btn btn-error btn-outline"
          >
            <TrashIcon className="w-5 h-5 mr-2" />
            Archive Habit
          </button>
          
          <div className="flex gap-2">
            <button onClick={handleBack} className="btn btn-ghost">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn btn-primary"
              disabled={!isHabitModified()}
            >
              <CheckIcon className="w-5 h-5 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Dialog */}
      <ScheduleHabitDialog
        habit={habit}
        onSave={handleScheduleChange}
        id="schedule_habit_modal"
      />

      {/* Break Modal */}
      <dialog id="break_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Creating Break</h3>
          <p className="py-4">
            The break interval is how many minutes of cumulative work in a work cycle before this break is activated. 
            <br />
            <br />
            Set multiple breaks with the same interval if you want a random break selected and the other breaks to be suggested as alternatives.
            If a working session activates multiple breaks, the longest is used.
            <br />
            <br />
            After the longest break is taken, the work cycle restarts.
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex flex-col w-full gap-2">
              <input
                type="number"
                value={breakInterval}
                onChange={(e) => setBreakInterval(e.target.value)}
                className="input input-bordered w-full mt-2"
                placeholder="Enter break interval in minutes"
              />
              <div className="flex flex-row gap-2">
                <button 
                  type="button"
                  onClick={handleCloseBreakModal} 
                  className="btn btn-primary mt-4"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-success mt-4"
                  onClick={handleAddBreak}
                  disabled={!breakInterval}
                >
                  Add Break
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default HabitPage;