import React, { useState } from "react";
import { api } from "../config/api";
import axios from "axios";

const ToDo = ({todo, addToQueue}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [completed, setCompleted] = useState(todo.completed); // Local state for checkbox
  const [isHovered, setIsHovered] = useState(false); // State to track hover


  const handleToggle = () => {
    const updatedTodo = { ...todo, completed: !completed };
    setCompleted(!completed);
    addToQueue(updatedTodo); // Add updated todo to the queue
  };

  const handleDelete = async (todoId) => {
      try {
        await axios.delete(`${api.endpoints.todos}/${todoId}`);
        console.debug("Todo deleted:", todoId);
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    }
   return (
    <div className="flex items-center gap-2 w-full bg-gray-100 p-2 rounded-md"
    onMouseEnter={() => setIsHovered(true)} // Show "X" on hover
    onMouseLeave={() => setIsHovered(false)} // Hide "X" when not hovering
    >
        <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={todo.completed || false}
                      onChange={() => handleToggle(todo)}
                      onClick={(e) => e.stopPropagation()}
                    />
        <div className="flex-grow">
            <div className="flex items-center gap-2">
                <h4 className="text-gray-700">{todo.description}</h4>
            </div>
        </div>
        {isHovered && (
        <button
          className="text-red-500 hover:text-red-700"
          onClick={handleDelete(todo.DOID)}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ToDo;