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