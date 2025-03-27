const EditInputCard = ({ 
  input, 
  onInputEdit,
  onInputDelete
}) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onInputDelete(input);
  };

  return (
    <div className="rounded-md transition-all duration-200 bg-gray-50">
      <div className="flex items-center justify-between p-2">
        <div className="flex-grow">
          <input
            type="text"
            defaultValue={input.Name}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onInputEdit(input, e.target.value);
              }
            }}
            autoFocus
          />
        </div>
        <button 
          onClick={handleDeleteClick}
          className="p-1 rounded hover:bg-gray-200 transition-colors duration-200 text-red-500 ml-2"
          title="Delete input"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default EditInputCard;