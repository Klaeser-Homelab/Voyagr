import React from 'react';
import axios from 'axios';
import { api } from '../config/api';

const EditHabitCard = ({
  habit,
  onHabitDelete
}) => {
  const [localDuration, setLocalDuration] = React.useState(habit.duration);
  const [localDescription, setLocalDescription] = React.useState(habit.description);

  const handleDelete = () => {
    onHabitDelete(habit);
  };

  const updateHabit = (description, duration) => {
    try {
      axios.put(api.endpoints.habits, {
          item_id: habit.item_id,
          description: description,
          duration: duration
        },
        {
          withCredentials: true
        }
      );
    } catch (error) {
      console.error("error updating habit", error);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2 bg-white rounded shadow">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={localDescription}
          onChange={(e) => setLocalDescription(e.target.value)}
          className="flex-1 px-2 py-1 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        />
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700"
          title="Delete habit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="flex items-center gap-4 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-gray-600">Duration (minutes):</span>
          <input
            type="number"
            className="input input-primary input-sm"
            value={localDuration / 60000}
            onChange={(e) => setLocalDuration(e.target.value * 60000)}
          />
        </label>
      </div>

      <button
        onClick={() => updateHabit(localDescription, localDuration )}
        className="text-blue-500 hover:text-blue-700"
        title="Save changes"
      >
        Save
      </button>
    </div>
  );
};

export default EditHabitCard;