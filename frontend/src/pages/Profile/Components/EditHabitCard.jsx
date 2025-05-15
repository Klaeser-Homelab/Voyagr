import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import AddBreak from './AddBreak';
import BreakModal from './BreakModal';
import NotesModal from './NotesModal';
import { useValues } from '../../../context/ValuesContext';
import { TrashIcon, CheckIcon, PlusIcon, CalendarIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import ScheduleHabitDialog from './ScheduleHabitDialog';

const EditHabitCard = ({
  habit
}) => {
  const { updateHabit } = useValues();
  const [localHabit, setLocalHabit] = useState(habit);
  const [isBreakActive, setIsBreakActive] = useState(habit.is_break);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  // Function to handle adding a break (now just opens the modal)
  const handleAddBreak = () => {
    document.getElementById(`add_break_modal-${habit.id}`).showModal();
  };
  
  // Function to handle closing the break modal
  const handleCloseBreakModal = () => {
    // Force state update with a slight delay to ensure it happens after modal closes
    setTimeout(() => {
      setIsBreakActive(false);
      console.log("isBreakActive set to:", false); // Debug log
    }, 10);
  };

  // Handle when a break is successfully added
  const handleBreakAdded = async () => {
    try {
      // Refresh the habit data after adding break
      const response = await api.get(`/api/habits/${habit.id}`);
      setLocalHabit(response.data);
      
      // Update the parent component
      updateHabit(response.data);
    } catch (error) {
      console.error('Error refreshing habit data:', error);
    }
  };

  // Function to open schedule dialog
  const openScheduleModal = () => {
    const modal = document.getElementById(`schedule_habit_modal_${habit.id}`);
    if (modal) {
      modal.showModal();
    }
  };

  const openNotesModal = () => {
    const modal = document.getElementById(`notes_modal_${habit.id}`);
    if (modal) {
      modal.showModal();
    }
  };

  // Handle schedule saved
  const handleSaved = async (scheduleData) => {
    try {
      // Refresh the habit data after scheduling
      const response = await api.get(`/api/habits/${habit.id}`);
      setLocalHabit(response.data);
      
      // Update the parent component
      updateHabit(response.data);
    } catch (error) {
      console.error('Error refreshing habit data:', error);
    }
  };

  useEffect(() => {
    setLocalHabit(habit);
  }, [habit]);

  const handleArchive = () => {
    localHabit.is_active = false;
    updateHabit(localHabit);
  };

  const isHabitModified = () => {
    return JSON.stringify(localHabit) !== JSON.stringify(habit);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row pt-1 gap-2 justify-between">
        <div className="flex flex-wrap gap-1 items-center">
          <input
            type="text"
            value={localHabit.description}
            onChange={(e) => setLocalHabit({ ...localHabit, description: e.target.value })}
            className="input w-45"
            placeholder="Enter habit description"
            required
          />
          <label className="input w-45">
          <input
            type="number"
            className="input text-sm input-bordered w-15"
            value={localHabit.duration / 60000}
            onChange={(e) => setLocalHabit({ ...localHabit, duration: e.target.value * 60000 })}
            required
          />
            <span className="label">minutes</span>
          </label>
          <input 
              type="checkbox"
              id={`breakToggle-${habit.id}`}
              className="sr-only"
              checked={isBreakActive}
              onChange={(e) => {
                const newValue = e.target.checked;
                console.log("Checkbox changed to:", newValue); // Debug log
                setIsBreakActive(newValue);
                if (newValue) {
                  document.getElementById(`add_break_modal-${habit.id}`).showModal();
                }
              }}
            />
            {/* Schedule button - Uses unique ID for this habit */}
            <button 
              onClick={openScheduleModal} 
              className={`btn btn-square btn-ghost btn-sm ${
                localHabit.Schedules && localHabit.Schedules.length > 0 ? ' text-blue-500' : 'text-white'
              }`}
            >
              <CalendarIcon className="size-6" />
            </button>
            <button 
              onClick={openNotesModal} 
              className={`btn btn-square btn-ghost btn-sm ${
                localHabit.details ? ' text-blue-500' : 'text-white'
              }`}
            >
              <PencilSquareIcon className="size-6" />
            </button>
            
            <button onClick={handleAddBreak} className="btn btn-xs bg-green-700 text-white">
              <PlusIcon className="size-4" />
              Add as Break
            </button>
            
      </div>
      <div className="flex flex-row gap-2 items-center">
          <button
            onClick={() => updateHabit(localHabit)}
            className="btn text-xs btn-sm btn-primary"
            disabled={!isHabitModified()}
          >
            Save
          </button>
          <button
            onClick={handleArchive}
            className="btn btn-square btn-sm btn-ghost"
          >
            <TrashIcon className="size-6 " />
          </button>
      </div>
      </div>
      
      {/* Break Modal - Now using the separate component */}
      <BreakModal 
        habitId={habit.id}
        modalId={`add_break_modal-${habit.id}`}
        onClose={handleCloseBreakModal}
        onBreakAdded={handleBreakAdded}
      />
      
      {/* Schedule Modal with unique ID for this habit */}
      <ScheduleHabitDialog 
        habit={localHabit} 
        onSave={handleSaved}
        id={`schedule_habit_modal_${habit.id}`}
      />
      <NotesModal
        habit={localHabit}
        onSave={handleSaved}
        id={`notes_modal_${habit.id}`}
      />
    </div>
  );
};

export default EditHabitCard;