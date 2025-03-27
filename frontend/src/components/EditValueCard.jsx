import React, { useState } from 'react';
import InputCard from './InputCard';

const EditValueCard = ({ 
  value, 
  onValueEdit, 
  onInputEdit, 
  onInputDelete 
}) => {
  const [editingValue, setEditingValue] = useState(false);
  const [valueName, setValueName] = useState(value.Name);
  const [valueColor, setValueColor] = useState(value.Color);

  console.log(value);

  const handleValueEdit = () => {
    onValueEdit(value, valueName, valueColor);
    setEditingValue(false);
  };

  return (
    <div className="card"
        style={{ 
          borderLeft: `4px solid ${value.Color || '#ddd'}`,
          borderRadius: '4px',
          borderTop: `1px solid #eee`,
          borderRight: `1px solid #eee`,
          borderBottom: `1px solid #eee`
        }}
    >
      {editingValue ? (
        <div className="space-y-4">
          <input
            type="text"
            value={valueName}
            onChange={(e) => setValueName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Value name"
          />
          <input
            type="color"
            value={valueColor}
            onChange={(e) => setValueColor(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setEditingValue(false)}
              className="px-3 py-1 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleValueEdit}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: value.Color }}
            />
            <h3 className="text-lg font-medium">{value.Name}</h3>
          </div>
          <button
            onClick={() => setEditingValue(true)}
            className="p-1 text-gray-500 hover:text-gray-700 rounded"
            aria-label="Edit value"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {value.Inputs?.map(input => (
          <InputCard
            key={input.IID}
            input={{ ...input, color: value.Color }}
            isEditMode={true}
            editingInput={null}
            setEditingInput={() => {}}
            onInputEdit={onInputEdit}
            onInputDelete={onInputDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default EditValueCard; 