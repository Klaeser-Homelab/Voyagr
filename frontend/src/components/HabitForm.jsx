import React, { useState } from 'react';
import { useValues } from '../context/ValuesContext';

const HabitForm = ({ value, setShowHabitForm }) => {
  const { addHabit } = useValues();
  const [habit, setHabit] = useState({
    description: '',
    duration: 0,
    is_active: true,
    value_id: value.id
  });



  const handleSubmit = (e) => {
    e.preventDefault();
    addHabit(habit);
    setShowHabitForm(false);
  };

  return (
    <div className="card">
        <form onSubmit={handleSubmit}>
        <h3 className="">Name</h3>
          <div className="form-control">
            <input
              type="text"
              value={habit.description}
              onChange={(e) => setHabit({ ...habit, description: e.target.value })}
              className="input input-bordered w-full"
              placeholder="Enter habit name"
              required
            />
          </div>

            <h3 className="">Default Duration</h3>
            <p className="text-xs text-gray-500">The starting duration for the habit timer.</p>
            <label className="input w-full">
            <input
              type="number"
              className="input input-sm input-bordered w-60"
              value={habit.duration / 60000}
              onChange={(e) => setHabit({ ...habit, duration: e.target.value * 60000 })}
              required
            />
            <span className="label">minutes</span>
            </label>

          <div className="card-actions mt-2 justify-end">
            <button type="submit" className="btn btn-sm btn-primary">
              Save
            </button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => setShowHabitForm(false)}>
              Cancel
            </button>
          </div>
        </form>
    </div>
  );
};

export default HabitForm;