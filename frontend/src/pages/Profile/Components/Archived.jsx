import { useValues } from '../../../context/ValuesContext';

const Archived = () => {
  const { archivedValues, archivedHabits, unarchiveValue, unarchiveHabit, hardDeleteValue, hardDeleteHabit } = useValues();
  return (
    <div className="collapse collapse-plus bg-base-100 border border-base-300">
      <input type="checkbox" id="accordion-1" />
      <label htmlFor="accordion-1" className="collapse-title font-semibold">
        Archived
      </label>
      <div className="collapse-content text-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <h3>Archived Values and their Habits</h3>
            {archivedValues.map((value) => (
              <div key={value.id} style={{ borderColor: value.color }} className="border-l-4 p-2">
                <div className="flex flex-row justify-between gap-4">
                  <h3>{value.description}</h3>
                  <div className="flex flex-row gap-4">
                    <button className="btn btn-sm btn-primary">Unarchive</button>
                    <button className="btn btn-sm btn-error">Permanently Delete</button>
                  </div>
                </div>
                <ul className="list-disc pl-5">
                  {value.habits && value.habits.map(habit => (
                    <li key={habit.id}>{habit.description}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4">   
            <h3>Archived Habits with Live Values</h3>
            {archivedHabits.map((habit) => (
              <div key={habit.id}>
                <div className="flex flex-row justify-between gap-4">
                  <h3>{habit.description}</h3>
                  <button className="btn btn-sm btn-primary">Unarchive</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};  

export default Archived;