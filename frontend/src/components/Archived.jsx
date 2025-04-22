import { useValues } from '../context/ValuesContext';

const Archived = () => {
  const { archivedValues, archivedHabits } = useValues();
  return (
    <div>
    <div className="collapse collapse-plus bg-base-100 border border-base-300">
      <input type="checkbox" id="accordion-1" />
      <label htmlFor="accordion-1" className="collapse-title font-semibold">
        Archived Identities
      </label>
      <div className="collapse-content text-sm">
        Click the "Sign Up" button in the top right corner and follow the registration process.
      </div>
    </div>
    <div className="collapse collapse-plus bg-base-100 border border-base-300">
      <input type="checkbox" id="accordion-2" />
      <label htmlFor="accordion-2" className="collapse-title font-semibold">
        Archived Habits
      </label>
      <div className="collapse-content text-sm">
        Click on "Forgot Password" on the login page and follow the instructions sent to your email.
      </div>
    </div>
  </div>
  );
};  

export default Archived;