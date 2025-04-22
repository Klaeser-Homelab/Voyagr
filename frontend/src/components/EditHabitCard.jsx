import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import AddBreak from './AddBreak';
import { useValues } from '../context/ValuesContext';
import { XCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

const EditHabitCard = ({
  habit
}) => {
  const { updateHabit } = useValues();
  const [localHabit, setLocalHabit] = useState(habit);
  const [isBreakActive, setIsBreakActive] = useState(false);
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
      document.getElementById('add_break_modal').close();
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

  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex flex-col pt-1">
          <p className="text-sm px-2">Habit</p>
          <input
            type="text"
            value={localHabit.description}
            onChange={(e) => setLocalHabit({ ...localHabit, description: e.target.value })}
            className="input w-full"
            placeholder="Enter habit description"
            required
          />
          </div>
          <div className="flex flex-col pt-1">
          <p className="text-sm px-2">Duration</p>
          <label className="input">
          <input
            type="number"
            className="input text-sm input-bordered w-15"
            value={localHabit.duration / 60000}
            onChange={(e) => setLocalHabit({ ...localHabit, duration: e.target.value * 60000 })}
            required
          />
            <span className="label">minutes</span>
          </label>

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
    <div className="flex flex-row gap-2 items-center">
      <div className="flex flex-col pt-1">
      <p className="text-sm px-1">Break</p>
    <div className="">
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
<label 
  htmlFor={`breakToggle-${habit.id}`} // Match the input's unique ID
  className={`cursor-pointer rounded-md text-2xl h-9.5 flex items-center justify-center ${
    isBreakActive 
      ? "bg-yellow-500 text-black" 
      : "bg-gray-500 opacity-25"
  }`}
>
🌴📵
</label>
</div>
</div>
          <button
            onClick={() => updateHabit(localHabit)}
            className="btn btn-primary"
          >
            Save
          </button>
          <button
            onClick={handleArchive}
            className="btn btn-square btn-error btn-sm"
          >
            <TrashIcon className="size-6 text-white" />
          </button>
        </div>
        </div>
  );
};

export default EditHabitCard;