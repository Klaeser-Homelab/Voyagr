import React, { useState } from 'react';
import EditHabitCard from './EditHabitCard';
import HabitForm from './HabitForm';

const EditValueCard = ({ 
  value, 
  onValueEdit, 
  onHabitEdit, 
  onHabitDelete,
  onHabitCreated
}) => {
  const [editingValue, setEditingValue] = useState(false);
  const [valueName, setValueName] = useState(value.description);
  const [valueColor, setValueColor] = useState(value.color);
  const [showHabitForm, setShowHabitForm] = useState(false);

  const handleValueEdit = () => {
    onValueEdit(value, valueName, valueColor);
    setEditingValue(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div 
        className="p-4 transition-colors duration-200"
        style={{ backgroundColor: value.color }}
      >
        {editingValue ? (
          <div className="space-y-4">
            <input
              type="text"
              value={valueName}
              onChange={(e) => setValueName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Value name"
            />
            <input
              type="color"
              value={valueColor}
              onChange={(e) => setValueColor(e.target.value)}
              className="w-full h-10 rounded cursor-pointer bg-white"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingValue(false)}
                className="px-3 py-1 text-white hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleValueEdit}
                className="px-3 py-1 bg-white text-gray-800 rounded hover:bg-gray-100"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{value.description}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingValue(true)}
                className="text-white hover:text-gray-200"
              >
                Edit
              </button>
              <button
                onClick={() => setShowHabitForm(!showHabitForm)}
                className="text-white hover:text-gray-200"
              >
                {showHabitForm ? 'Hide Habit Form' : 'Add Habit'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {showHabitForm && (
        <div className="p-4 border-t border-gray-200">
          <HabitForm 
            value={value}
            onHabitUpdated={() => {
              setShowHabitForm(false);
              if (onHabitCreated) onHabitCreated();
            }}
          />
        </div>
      )}

      {value.habits && value.habits.length > 0 && (
        <div className="p-2 space-y-2">
          {value.habits.map(habit => (
            <EditHabitCard
              key={habit.IID}
              habit={{ ...habit, color: value.color }}
              onHabitEdit={onHabitEdit}
              onHabitDelete={onHabitDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EditValueCard; 