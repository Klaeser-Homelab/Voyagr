import React from 'react';
import axios from 'axios';
import { api } from '../config/api';
import AddBreak from './AddBreak';

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
          id: habit.id,
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
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">{habit.description}</h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <input
            type="text"
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter habit description"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Duration (minutes)</span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={localDuration / 60000}
            onChange={(e) => setLocalDuration(e.target.value * 60000)}
            required
          />
        </div>

        <div className="card-actions justify-end">
          <AddBreak habit={habit} />
          <button
            onClick={()=>document.getElementById('add_break_modal').showModal()}
            className="btn btn-warning"
          >
            Add as Break
          </button>
          <button
            onClick={() => updateHabit(localDescription, localDuration)}
            className="btn btn-primary"
          >
            Save
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-error"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditHabitCard;