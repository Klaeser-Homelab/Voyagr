import React from 'react';

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
            <div 
              key={input.IID} 
              className={`rounded-md transition-all duration-200
                ${activeInput?.IID === input.IID ? 'bg-gray-100' : 'bg-gray-50'}`}
            >
              {editingInput === input.IID ? (
                <div className="p-2">
                  <input
                    type="text"
                    defaultValue={input.Name}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onInputEdit(input, e.target.value);
                      } else if (e.key === 'Escape') {
                        setEditingInput(null);
                      }
                    }}
                    autoFocus
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between p-2 group">
                  <div 
                    className="flex-grow cursor-pointer"
                    onClick={(e) => onInputClick(input, value, e)}
                  >
                    <h4 className="text-gray-700">{input.Name}</h4>
                  </div>
                  {isEditMode && (
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingInput(input.IID);
                        }}
                        className="p-1 rounded hover:bg-gray-200 transition-colors duration-200"
                        title="Edit input"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onInputDelete(input);
                        }}
                        className="p-1 rounded hover:bg-gray-200 transition-colors duration-200 text-red-500"
                        title="Delete input"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ValueCard; 