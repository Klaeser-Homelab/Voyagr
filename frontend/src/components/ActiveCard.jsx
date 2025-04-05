import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import { useTimer } from '../context/TimerContext';
import { useSelection } from '../context/SelectionContext';
import { PlayIcon, PauseIcon, ClockIcon, StopIcon } from '@heroicons/react/24/outline';
import Todo from './Todo.jsx';
import TodoForm from './TodoForm.jsx';

function ActiveCard({ item, onTodosUpdate }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { 
    startTimer, 
    stopTimer, 
    isActiveEvent, 
    minutes, 
    seconds,
    mode,
    stopwatchTime,
    adjustTime,
    toggleMode
  } = useTimer();
  const { activeValue, activeInput, handleValueSelect, handleInputSelect } = useSelection();

  const isValue = 'VID' in item;
  const color = item.color;
  const name = item.description;

  const fetchTodos = async () => {
    try {
      const endpoint = isValue 
        ? `${api.endpoints.todos}/incomplete/value/${item.VID}`
        : `${api.endpoints.todos}/incomplete/input/${item.IID}`;
      
      const response = await axios.get(endpoint);
      setTodos(response.data);
      setLoading(false);
      if (onTodosUpdate) {
        onTodosUpdate(response.data);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to load todos');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [isValue ? item.VID : item.IID]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const updateTodoState = (todoId, completed) => {
    setTodos(currentTodos => {
      const newTodos = currentTodos.map(todo => 
        todo.DOID === todoId ? { ...todo, completed } : todo
      );
      if (onTodosUpdate) {
        onTodosUpdate(newTodos);
      }
      return newTodos;
    });
  };

  const deleteTodo = (todoId) => {
    setTodos(currentTodos => {
      const newTodos = currentTodos.filter(todo => todo.DOID !== todoId);
      if (onTodosUpdate) {
        onTodosUpdate(newTodos);
      }
      return newTodos;
    });
  };

  const addTodo = (newTodo) => {
    setTodos(currentTodos => {
      const newTodos = [...currentTodos, newTodo];
      if (onTodosUpdate) {
        onTodosUpdate(newTodos);
      }
      return newTodos;
    });
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg w-full"
    >
      <div 
        className="flex items-center justify-between p-4 cursor-pointer transition-colors duration-200"    
        style={{ backgroundColor: color }}
      >
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        <div className="flex items-center gap-4">
          {mode === 'timer' && (
            <div className="flex items-center gap-2">
              <button 
                className="btn btn-sm btn-ghost text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  adjustTime(-5);
                }}
              >
                -5
              </button>
              <button 
                className="btn btn-sm btn-ghost text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  adjustTime(5);
                }}
              >
                +5
              </button>
            </div>
          )}
          <div className="join">
            <button 
              className={`join-item btn btn-sm btn-ghost text-white hover:bg-white/20 ${mode === 'timer' ? 'bg-white/20' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (mode !== 'timer') toggleMode();
              }}
            >
              <ClockIcon className="size-4" />
            </button>
            <button 
              className={`join-item btn btn-sm btn-ghost text-white hover:bg-white/20 font-extrabold font-lg ${mode === 'stopwatch' ? 'bg-white/20' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (mode !== 'stopwatch') toggleMode();
              }}
            >
              {'\u23F1'}
            </button>
          </div>
         
          <div className="text-2xl font-mono text-white">
            {mode === 'timer' ? (
              `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            ) : (
              formatTime(stopwatchTime)
            )}
          </div>
          <button 
            className="btn btn-circle btn-ghost text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              isActiveEvent ? stopTimer() : startTimer();
            }}
          >
            {isActiveEvent ? <PauseIcon className="size-6 text-white" /> : <PlayIcon className="size-6 text-white" />}
          </button>
        </div>
      </div>
      
      <div className="p-2 space-y-2">
        {todos.map(todo => (
          <Todo 
            key={todo.DOID} 
            todo={todo} 
            onToggle={updateTodoState}
            onDelete={deleteTodo}
          />
        ))}
        <TodoForm 
          item={item}
          onTodoAdded={addTodo}
        />
      </div>
    </div>
  );
}

export default ActiveCard; 