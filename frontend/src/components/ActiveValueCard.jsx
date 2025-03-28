import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import InputCard from './InputCard';
import { useTimer } from '../context/TimerContext';
import { useSelection } from '../context/SelectionContext';
import { PlayIcon, PauseIcon, ClockIcon, StopIcon } from '@heroicons/react/24/outline';
import ToDo from './ToDo';
import ToDoForm from './TodoForm';

function ActiveValueCard({ value, addToQueue }) {
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

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`${api.endpoints.todos}/incomplete/value/${value.VID}`);
        setTodos(response.data);
        setLoading(false);
        console.log('Value todos:', response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
        setError('Failed to load todos');
        setLoading(false);
      }
    };

    fetchTodos();
  }, [value.VID]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg w-full"
    >
      <div 
        className="flex items-center justify-between p-4 cursor-pointer transition-colors duration-200"    
        style={{ backgroundColor: value.Color }}
      >
        <h3 className="text-lg font-semibold text-white">{value.Name}</h3>
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
      
      {value.Inputs && value.Inputs.length > 0 && (
        <div className="p-2 space-y-2">
          {todos.map(todo => (
            <ToDo key={todo.DOID} todo={todo} addToQueue={addToQueue} />
          ))}
          <ToDoForm activeValue={value}  />
        </div>
      )}
    </div>
  );
}

export default ActiveValueCard;