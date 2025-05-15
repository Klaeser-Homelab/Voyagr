import React, { useState } from 'react';
import api from '../../../config/api';
import { useValues } from '../../../context/ValuesContext';


const BreakModal = ({ habitId, modalId, onClose, onBreakAdded }) => {
  const [interval, setInterval] = useState('');
  const { fetchBreaks } = useValues(); // Add useValues hook


  const handleAddBreak = async () => {
    try {
      await api.post('/api/breaks', {
        habit_id: habitId,
        interval: parseInt(interval, 10) * 60000  // Convert string to number and then to milliseconds
      });
      
      // Reset form
      setInterval('');
      
      fetchBreaks();

      // Notify parent component that break was added
      if (onBreakAdded) {
        onBreakAdded();
      }
      
      // Close the modal but keep the swap ON
      document.getElementById(modalId).close();
    } catch (error) {
      console.error('Error adding break:', error);
    }
  };
  
  // Function to handle closing without adding a break
  const handleCloseModal = () => {
    document.getElementById(modalId).close();
    setInterval('');
    
    // Call the onClose callback
    if (onClose) {
      onClose();
    }
  };

  return (
    <dialog id={modalId} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Creating Break</h3>
        <p className="py-4">
          The break interval is how many minutes of cumulative work in a work cycle before this break is activated. 
          <br />
          <br />
          If multiple breaks share the same interval the first will be the default and the rest will appear as alternatives. Reorder the breaks in the profile page.
          If a working session activates multiple breaks, the longest intervalis used.
          <br />
          <br />
          After the longest break, the work session restarts.
        </p>
        <div className="modal-action">
          <form method="dialog" className="flex flex-col w-full gap-2">
            <input
              type="number"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="input input-bordered w-full mt-2"
              placeholder="Enter break interval in minutes"
            />
            <div className="flex flex-row gap-2">
              <button 
                onClick={handleCloseModal} 
                className="btn btn-primary mt-4"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-success mt-4"
                onClick={handleAddBreak}
                disabled={!interval}
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

export default BreakModal;