import React, { useState } from 'react';
import axios from 'axios';
import { api } from '../config/api';

const AddBreak = ({ habit }) => {  // Destructure the habit prop
  const [interval, setInterval] = useState('');  // Initialize with empty string instead of null

  const handleAddBreak = async (e) => {
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
  };

  return (
    <dialog id="add_break_modal" className="modal modal-bottom sm:modal-middle">
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
              <button className="btn btn-primary mt-4">Close</button>
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
  );
};

export default AddBreak;