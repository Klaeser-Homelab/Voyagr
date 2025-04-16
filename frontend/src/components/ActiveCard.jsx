import React, { useState, useEffect } from 'react';
import { useTimer } from '../context/TimerContext';
import { useEvent } from '../context/EventContext';
import Todo from './TodoCard';
import TodoForm from './TodoForm';
import TimerControls from '../components/TimerControls';
import { PlayIcon, PauseIcon} from '@heroicons/react/24/outline';


function ActiveCard({ item }) {
  const { todos, setTodos } = useEvent();

  const { 
    startTimer, 
    stopTimer, 
    isActiveEvent, 
    mode,
    resumeTimer,
    getStopwatchTime,
    getRemainingTime
  } = useTimer();

  const [displayTime, setDisplayTime] = useState(getRemainingTime());

  useEffect(() => {
  }, [todos]);

  useEffect(() => {
    const { minutes, seconds } = getRemainingTime();
    setDisplayTime({ minutes, seconds });
  }, [getRemainingTime]);

  useEffect(() => {
  }, [item.item_id]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleTodo = (todo) => {
    console.log('toggling todo', todo);
    todo.completed = !todo.completed;
  };

  const deleteTodo = (todo) => {
    const newTodos = todos.filter(t => t.item_id !== todo.item_id);
    setTodos(newTodos);
  };

  const addTodo = (todo) => {
    setTodos([...todos, todo]);
  };

  return (
    <div 
      className="container mx-auto max-w-2xl bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg w-full"
    >
      <div 
        className="flex items-center justify-between p-4 cursor-pointer transition-colors duration-200"    
        style={{ backgroundColor: item.color }}
      >
        <div className="">
          <h3 className="text-2xl font-semibold text-white">{item.description}</h3>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
        <div className="text-2xl font-mono text-white">
            {mode === 'timer' ? (
              `${String(displayTime.minutes).padStart(2, '0')}:${String(displayTime.seconds).padStart(2, '0')}`
            ) : (
              formatTime(getStopwatchTime())
            )}
          </div>
          <button 
            className="btn btn-circle btn-ghost text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              isActiveEvent ? stopTimer() : resumeTimer();
            }}
          >
            {isActiveEvent ? <PauseIcon className="size-6 text-white" /> : <PlayIcon className="size-6 text-white" />}
          </button>
        </div>
      </div>
      <div className="flex flex-row justify-end items-center bg-base-100 gap-2">
        <TimerControls mode={mode} />
      </div>

      <div className="p-2 space-y-2">
      {todos.length > 0 &&
    todos.map(todo => (
      <Todo 
        key={todo.item_id} 
        todo={todo} 
        onToggle={toggleTodo}
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