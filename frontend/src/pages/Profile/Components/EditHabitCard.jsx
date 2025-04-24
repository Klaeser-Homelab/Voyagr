import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../../../config/api';
import AddBreak from './AddBreak';
import { useValues } from '../../../context/ValuesContext';
import { TrashIcon, CheckIcon, PlusIcon } from '@heroicons/react/24/outline';

const EditHabitCard = ({
  habit
}) => {
  const { updateHabit } = useValues();
  const [localHabit, setLocalHabit] = useState(habit);
  const [isBreakActive, setIsBreakActive] = useState(habit.is_break);
  const [interval, setInterval] = useState('');

  const handleAddBreak = async (e) => {
    // Your existing add break logic
    e.preventDefault();  // Prevent form submission
    
    try {
      await axios.post(api.endpoints.breaks, {
        habit_id: habit.id,
        interval: parseInt(interval, 10) * 60000  // Convert string to number and then to milliseconds
      }, { withCredentials: true });
      
      // Optional: Close dialog or reset form
      setInterval('');
    } catch (error) {
      console.error('Error adding break:', error);
    }

    // Close the modal but keep the swap ON
    document.getElementById(`add_break_modal-${habit.id}`).close();
    // No need to update isBreakActive since we want it to stay ON
  };
  
  // Function to handle closing without adding a break
  const handleCloseModal = () => {
    document.getElementById(`add_break_modal-${habit.id}`).close();
    
    // Force state update with a slight delay to ensure it happens after modal closes
    setTimeout(() => {
      setIsBreakActive(false);
      console.log("isBreakActive set to:", false); // Debug log
    }, 10);
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
              id={`breakToggle-${habit.id}`} // Use the habit's unique ID to create a unique input ID
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
            <button onClick={() => handleAddBreak()} className="btn btn-xs bg-green-700 text-white">
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
          
    
        <dialog id={`add_break_modal-${habit.id}`}className="modal modal-bottom sm:modal-middle">
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
              type="number"  // Changed to number type for better UX
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="input input-bordered w-full mt-2"
              placeholder="Enter break interval in minutes"
            />
            <div className="flex flex-row gap-2">
              <button onClick={handleCloseModal} className="btn btn-primary mt-4">Close</button>
              <button
                type="button"  // Specify button type
                className="btn btn-success mt-4"
                onClick={handleAddBreak}
                disabled={!interval}  // Check for empty string
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

export default EditHabitCard;