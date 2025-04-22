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
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <input
              type="text"
              value={habit.description}
              onChange={(e) => setHabit({ ...habit, description: e.target.value })}
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
              value={habit.duration / 60000}
              onChange={(e) => setHabit({ ...habit, duration: e.target.value * 60000 })}
              required
            />
          </div>

          <div className="card-actions justify-end">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
    </div>
  );
};

export default HabitForm;