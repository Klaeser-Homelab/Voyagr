import React, { useState, useEffect } from 'react';
import EditHabitCard from './EditHabitCard';
import HabitForm from './HabitForm';
import { useValues } from '../../../context/ValuesContext';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';


const EditValueCard = ({ 
  value, 
}) => {
  const { updateValue, archiveValue } = useValues();
  const [editingValue, setEditingValue] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleArchive = () => {
    localValue.is_active = false;
    archiveValue(localValue);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div 
        className="px-2 cursor-pointer transition-colors duration-200 border-l-5"
        style={{ borderColor: localValue.color }}
      >
        {editingValue ? (
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex gap-2 items-center">
              <div className="flex flex-row gap-2">
            <input
              type="text"
              value={localValue.description}
              onChange={(e) => setLocalValue({ ...localValue, description: e.target.value })}
              className="w-1/2 px-3 py-2 text-xl font-bold"
              placeholder="Value name"
            />
            <input
              type="color"
              value={localValue.color}
              onChange={(e) => setLocalValue({ ...localValue, color: e.target.value })}
              className="w-10 h-10 rounded cursor-pointer"
            />
            </div>
            <button
                onClick={() => {
                  updateValue(localValue);
                  setEditingValue(false);
                }}
                className="btn btn-primary btn-sm"
              >
                Save
              </button>
            <button
                onClick={() => setEditingValue(false)}
                className="btn btn-ghost btn-sm"
              >
                Cancel
              </button>
              
            </div>
              <button
                onClick={handleArchive}
                className="btn btn-square btn-sm btn-ghost"
              >
                <TrashIcon className="size-6" />
              </button>       
            {message && (
              <p className="text-sm text-white">{message}</p>
              )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
              <div className="flex py-1 gap-3 items-center">

              <h3 className="text-lg font-semibold text-white">{value.description}</h3>
              <button
                  onClick={() => setShowHabitForm(!showHabitForm)}
                  className="btn bg-green-700 btn-xs text-white"
                >
                  <PlusIcon className="size-4 text-white" />
                  Create Habit
                </button>
            </div>
                <button
                  onClick={() => setEditingValue(true)}
                  className=""
                >
                  <PencilIcon className="size-5" />
                </button>
                
            </div>
        )}
      </div>
      
      {showHabitForm && (
        <div className="p-4 border-l-5" style={{ borderColor: value.color }}>
          <HabitForm 
            value={value}
            setShowHabitForm={setShowHabitForm}
          />
        </div>
      )}

      {value.Habits && value.Habits.length > 0 && (
        <div className="p-2 border-l-5" style={{ borderColor: value.color }}>
          <div className="flex flex-col gap-1">
          <div className="flex flex-row gap-2">
            <p className="hidden md:block text-sm px-2 w-45">Habits</p>
            <p className="hidden md:block text-sm px-2 w-42">Duration</p>
          </div>
            {value.Habits.map(habit => (
              <EditHabitCard
                key={habit.id}
                habit={{ ...habit, color: value.color }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditValueCard; 