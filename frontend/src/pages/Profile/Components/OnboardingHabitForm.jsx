import React, { useState } from 'react';
import { useOnboarding } from '../../../context/OnboardingContext';


const OnboardingHabitForm = () => {
  const { addHabit } = useOnboarding();
  const [habit, setHabit] = useState({
    name: '',
    duration: 0,
    frequency: 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addHabit(habit);
    navigate('/quick-start/login');
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
            <p className="text-xs text-gray-500">How long you expect it to take. Just put something down for now.</p>
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
          </div>
        </form>
    </div>
  );
};

export default OnboardingHabitForm;