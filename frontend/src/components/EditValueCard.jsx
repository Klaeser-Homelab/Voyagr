import React, { useState } from 'react';
import EditInputCard from './EditInputCard';

const EditValueCard = ({ 
  value, 
  onValueEdit, 
  onInputEdit, 
  onInputDelete 
}) => {
  const [editingValue, setEditingValue] = useState(false);
  const [valueName, setValueName] = useState(value.Name);
  const [valueColor, setValueColor] = useState(value.Color);

  const handleValueEdit = () => {
    onValueEdit(value, valueName, valueColor);
    setEditingValue(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div 
        className="p-4 transition-colors duration-200"
        style={{ backgroundColor: value.Color }}
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
            <h3 className="text-lg font-semibold text-white">{value.Name}</h3>
            <button
              onClick={() => setEditingValue(true)}
              className="p-1 text-white hover:text-gray-200 rounded"
              aria-label="Edit value"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {value.Inputs && value.Inputs.length > 0 && (
        <div className="p-2 space-y-2">
          {value.Inputs.map(input => (
            <EditInputCard
              key={input.IID}
              input={{ ...input, color: value.Color }}
              onInputEdit={onInputEdit}
              onInputDelete={onInputDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EditValueCard; 