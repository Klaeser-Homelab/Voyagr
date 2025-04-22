import { useValues } from '../context/ValuesContext';

const Archived = () => {
  const { archivedValues, archivedHabits } = useValues();
  return (
    <div className="collapse collapse-plus bg-base-100 border border-base-300">
      <input type="checkbox" id="accordion-1" />
      <label htmlFor="accordion-1" className="collapse-title font-semibold">
        Archived
      </label>
      <div className="collapse-content text-sm">
          {archivedValues.map((value) => (
              <div key={value.id}>
                <h3>{value.description}</h3>
              </div>
            ))
          }
      </div>
    </div>
  );
};  

export default Archived;