const InputCard = ({ 
  input, 
  isEditMode, 
  editingInput,
  setEditingInput,
  onInputClick,
  onInputEdit,
  activeInput
}) => {
  const handleEditClick = (e) => {
    e.stopPropagation();
    setEditingInput(input);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onInputDelete(input);
  };

  const getScheduleText = () => {
    if (!input.startTime || !input.endTime || !input.daysOfWeek) return null;
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const scheduledDays = input.daysOfWeek.map(day => days[day]).join(', ');
    return `${input.startTime.slice(0, 5)} - ${input.endTime.slice(0, 5)} on ${scheduledDays}`;
  };

  return (
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
            onClick={(e) => onInputClick(input, e)}
          >
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: input.color }}
              />
              <h4 className="text-gray-700">{input.Name}</h4>
            </div>
            
            {/* Schedule information */}
            {getScheduleText() && (
              <div className="mt-1 text-sm text-gray-500">
                <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {getScheduleText()}
              </div>
            )}
          </div>
          
          {isEditMode && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button 
                onClick={handleEditClick}
                className="p-1 rounded hover:bg-gray-200 transition-colors duration-200"
                title="Edit input"
              >
                ✏️
              </button>
              <button 
                onClick={handleDeleteClick}
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
  );
};

export default InputCard; 