import React from 'react';
import InputCard from './InputCard';

function ValueCard({ 
  value, 
  activeValue, 
  activeInput, 
  isEditMode,
  editingInput,
  setEditingInput,
  onValueClick,
  onInputClick,
  onInputEdit,
  onInputDelete
}) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg
        ${activeValue?.VID === value.VID ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div 
        className="p-4 cursor-pointer transition-colors duration-200"
        onClick={(e) => onValueClick(value, e)}
        style={{ backgroundColor: value.Color }}
      >
        <h3 className="text-lg font-semibold text-white">{value.Name}</h3>
      </div>
      
      {value.Inputs && value.Inputs.length > 0 && (
        <div className="p-2 space-y-2">
          {value.Inputs.map(input => (
            <InputCard
              key={input.IID}
              input={{ ...input, color: value.Color }}
              isEditMode={isEditMode}
              editingInput={editingInput}
              setEditingInput={setEditingInput}
              onInputClick={(input) => onInputClick(input, value)}
              onInputEdit={onInputEdit}
              onInputDelete={onInputDelete}
              activeInput={activeInput}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ValueCard; 