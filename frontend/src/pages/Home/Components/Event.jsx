import React, { useState, useEffect } from 'react';
import { useTimer } from '../../../context/TimerContext';
import { useEvent } from '../../../context/EventContext';
import Todo from './TodoCard';
import TodoForm from './TodoForm';
import TimerControls from './TimerControls';
import { PlayIcon, PauseIcon} from '@heroicons/react/24/outline';

function Event({ item }) {
  const { todos, setTodos } = useEvent();
  const { activeItem, activeEvent, updateEvent, deleteEvent } = useEvent();


  useEffect(() => {
    console.log('item', item);
  }, [item]);

  const { 
    startTimer, 
    stopTimer, 
    isActiveEvent, 
    mode,
    resumeTimer,
    getElapsedMilliseconds,
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
  }, [item.id]);

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
    const newTodos = todos.filter(t => t.id !== todo.id);
    setTodos(newTodos);
  };

  const addTodo = (todo) => {
    setTodos([...todos, todo]);
  };

  return (
    <div className="md:py-14 lg:py-20 xl:py-28">
      <div className="flex items-center justify-center gap-4 p-4">
        <button onClick={deleteEvent} className="btn btn-dash btn-error">
          Abandon Session
        </button>
        <button
          onClick={updateEvent}
          className={`btn btn-success ${mode === 'timer' ? 'btn-dash' : ''}`}
        >
          Submit Session
        </button>
      </div>
    <div className="min-w-[30vw] flex-1 basis-[40vw]">
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
              formatTime(Math.floor(getElapsedMilliseconds() / 1000 )) // convert to seconds
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
      <div className="flex flex-row justify-end items-center bg-gray-800 gap-2">
        <TimerControls mode={mode} />
      </div>

      <div className="p-2 space-y-2 bg-gray-800">
      {todos.length > 0 &&
    todos.map(todo => (
      <Todo 
        key={todo.id} 
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
    </div>
    </div>
  );
}

export default Event; 