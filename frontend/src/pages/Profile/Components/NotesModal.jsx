import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import { useValues } from '../../../context/ValuesContext';

const NotesModal = ({ habit, onSave, id }) => {
  const [details, setDetails] = useState('');
  const { updateHabit } = useValues();

  // Update details when habit changes
  useEffect(() => {
    setDetails(habit.details || '');
  }, [habit]);

  const handleSaveDetails = async () => {
    try {
      // Update the habit with new details
      const updatedHabit = { ...habit, details: details };
      
      // Update local state
      updateHabit(updatedHabit);
      console.log('updatedHabit', updatedHabit);
      
      // Close the modal
      document.getElementById(id).close();
    } catch (error) {
      console.error('Error saving habit details:', error);
    }
  };

  const handleCloseModal = () => {
    // Reset to original value when closing without saving
    setDetails(habit.details || '');
    document.getElementById(id).close();
  };

  const hasChanges = details !== (habit.details || '');

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit Notes</h3>
        <p className="py-4">These notes will appear when the habit is active.</p>
        
        <div className="modal-action">
          <form method="dialog" className="flex flex-col w-full gap-2">
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="textarea textarea-bordered w-full h-32"
              placeholder="Enter details about this habit..."
            />
            <div className="flex flex-row gap-2">
              <button 
                type="button"
                onClick={handleCloseModal} 
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveDetails}
                disabled={!hasChanges}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default NotesModal;