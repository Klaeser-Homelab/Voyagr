import React, { useState, useEffect } from 'react';
import { useTimer } from '../../../context/TimerContext';
import { useEvent } from '../../../context/EventContext';
import Todo from './TodoCard';
import TodoForm from './TodoForm';
import TimerControls from './TimerControls';
import { PlayIcon, PauseIcon, PlusIcon, MinusIcon} from '@heroicons/react/24/outline';

function Event({ item }) {
  const { todos, setTodos } = useEvent();
  const { activeItem, activeEvent, updateEvent, deleteEvent } = useEvent();

  useEffect(() => {
    console.log('item', item);
  }, [item]);

  const RadialGlow = ({ color }) => {
    // Default to a purple color if none provided
    const glowColor = color || 'rgb(95, 90, 249)';
    
    // Create the radial gradient with the item's color
    const style = {
      position: 'absolute',
      top: '-100px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '800px',
      height: '400px',
      background: `radial-gradient(circle at 50% 0%, ${glowColor}33, transparent 70%)`,
      pointerEvents: 'none',
      zIndex: 50,
    };
  
    return <div style={style} />;
  };

  const { 
    startTimer, 
    pauseTimer,
    isActiveEvent, 
    mode,
    toggleMode,
    adjustTime,
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

  // Function to generate time increment squares
  const generateTimeIncrements = () => {
    // Get total minutes (for timer mode) or elapsed minutes (for stopwatch mode)
    let totalMinutes = 0;
    let elapsedMinutes = 0;
    
    if (mode === 'timer') {
      totalMinutes = displayTime.minutes + (displayTime.seconds > 0 ? 1 : 0);
      elapsedMinutes = Math.max(0, item.duration - totalMinutes);
    } else {
      elapsedMinutes = Math.floor(getElapsedMilliseconds() / (1000 * 60));
      totalMinutes = Math.max(elapsedMinutes, 1); // Ensure at least 1 for stopwatch
    }
    
    // Calculate number of 5-minute increments (with a reasonable limit)
    const duration = item.duration || 30; // Default to 30 if duration is missing
    const incrementCount = Math.min(20, Math.max(1, Math.ceil(duration / 5))); // Limit to reasonable range
    
    // Create array of increment squares
    return Array(incrementCount).fill().map((_, index) => {
      const isElapsed = (index + 1) * 5 <= elapsedMinutes;
      const style = isElapsed 
        ? { backgroundColor: item.color || '#4caf50' } 
        : { backgroundColor: 'rgba(255, 255, 255, 0.2)' };
      
      return (
        <div 
          key={`time-increment-${index}`}
          className="w-8 h-8 rounded-sm border border-white/10"
          style={style}
          title={`${(index + 1) * 5} minutes`}
        />
      );
    });
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
    <div className="container p-14 w-full flex flex-col gap-4 justify-center items-center">
      <RadialGlow color={item.color} />
      {/* Time increment squares */}
      <div className="flex flex-wrap justify-center gap-1 mb-4 max-w-2xl">
        {generateTimeIncrements()}
      </div>
      
      <h1 className="text-6xl text-center font-bold">{item.description}</h1>

      <div className="flex flex-row d items-center justify-center gap-4 p-4">
        {mode === 'timer' && (
        <button 
        className="btn btn-sm btn-ghost text-lg hover:bg-white/20"
        onClick={(e) => {
          e.stopPropagation();
          adjustTime(-5);
        }}
      >
                <MinusIcon className="size-6 text-white" />

      </button>
        )}
        <div className="relative group">
            {/* Timer display */}
            <div className="text-8xl font-mono text-white">
              {mode === 'timer' ? (
                `${String(displayTime.minutes).padStart(2, '0')}:${String(displayTime.seconds).padStart(2, '0')}`
              ) : (
                formatTime(Math.floor(getElapsedMilliseconds() / 1000)) // convert to seconds
              )}
            </div>
            
            {/* Play/Pause button that appears on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-80 transition-opacity duration-200">
                
                <button 
                  className="btn btn-circle bg-black/50 hover:bg-black/70 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    isActiveEvent ? pauseTimer() : resumeTimer();
                  }}
                >
                  {isActiveEvent ? <PauseIcon className="size-6 text-white" /> : <PlayIcon className="size-6 text-white" />}
                </button>
            </div>
        </div>
        {mode === 'timer' && (
          <button 
            className="btn btn-sm text-lg btn-ghost hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              adjustTime(5);
            }}
          >
            <PlusIcon className="size-6 text-white" />
          </button>
        )}
      </div>
      <div className="flex flex-row justify-center items-center gap-2">
    <label className="flex cursor-pointer items-center gap-2">
        <span className="text-lg"
        >Timer</span>
        <input
          type="checkbox"
          onChange={toggleMode}
          className="toggle col-span-2 col-start-1 row-start-1" />
                <span className="text-lg">Stopwatch</span>
    </label>
  </div>
      
      <div className="flex flex-row justify-center items-center gap-10">
            <button onClick={deleteEvent} className="btn btn-dash btn-error">
                Abandon 
              </button>
              <button
                onClick={updateEvent}
                className={`btn btn-success ${mode === 'timer' ? 'btn-dash' : ''}`}
              >
                Submit
            </button>
      </div>
      <div className="w-full p-2 space-y-2 bg-gray-800">
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
  );
}

export default Event;