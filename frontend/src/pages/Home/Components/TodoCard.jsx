import React, { useState } from "react";

const TodoCard = ({todo, onToggle, onDelete}) => {
  const [completed, setCompleted] = useState(todo.completed); // Local state for checkbox
  const [isHovered, setIsHovered] = useState(false); // State to track hover

  const handleToggle = () => {
    const newCompleted = !completed;
    setCompleted(newCompleted);
    onToggle(todo);
  };

   return (
    <div className="flex items-center gap-2 w-full bg-gray-700 p-2 rounded-md"
    onMouseEnter={() => setIsHovered(true)} // Show "X" on hover
    onMouseLeave={() => setIsHovered(false)} // Hide "X" when not hovering
    >
        <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={completed}
                      onChange={handleToggle}
                      onClick={(e) => e.stopPropagation()}
                    />
        <div className="flex-grow">
            <div className="flex items-center gap-2">
                <h4 className="text-white">{todo.description}</h4>
            </div>
        </div>
        {isHovered && (
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => onDelete(todo)}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default TodoCard;