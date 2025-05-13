import React, { useState, useEffect } from 'react';
import { useTimer } from '../../../context/TimerContext';
import { useEvent } from '../../../context/EventContext';
import { useBreaks } from '../../../context/BreaksContext';
import Todo from './TodoCard';
import TodoForm from './TodoForm';
import WorkSession from './WorkSession';
import { PlayIcon, PauseIcon, PlusIcon, MinusIcon} from '@heroicons/react/24/outline';
import { useDeveloper } from '../../../context/DeveloperContext';
import BreakProgress from './BreakProgress';

function Event({ item }) {
  const { todos, setTodos } = useEvent();
  const { activeItem, activeEvent, updateEvent, deleteEvent } = useEvent();
  const { developerMode } = useDeveloper();
  const { getAlternativeBreaks } = useBreaks();

  // Alternative breaks state
  const [alternativeBreaks, setAlternativeBreaks] = useState([]);

  useEffect(() => {
    // Fetch alternative breaks when component mounts or when it's a break
    if (item?.is_break) {
      const alternativeBreaks = getAlternativeBreaks();
      setAlternativeBreaks(alternativeBreaks);
      //console.log('alternativeBreaks:', alternativeBreaks);
    }
  }, []);

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
    duration, 
    pauseTimer,
    isActiveEvent, 
    mode,
    toggleMode,
    adjustTime,
    adjustElapsedTime,
    resumeTimer,
    formatTime,
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

  const formatTimerDisplay = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Function to generate time increment squares
  const [timeIncrements, setTimeIncrements] = useState([]);

  // Effect to regenerate squares when duration or elapsed time changes
  useEffect(() => {
    // Convert duration from milliseconds to minutes
    const durationMinutes = duration ? Math.ceil(duration / (60 * 1000)) : 30;
    
    // Calculate elapsed minutes
    let elapsedMinutes = 0;
    if (mode === 'timer') {
      elapsedMinutes = Math.floor(getElapsedMilliseconds() / (60 * 1000));
    } else { // stopwatch
      elapsedMinutes = Math.floor(getElapsedMilliseconds() / (60 * 1000));
    }
    
    // Create exactly durationMinutes squares (one per minute)
    const newIncrements = Array(durationMinutes).fill().map((_, index) => {
      const currentMinute = index + 1;
      // Square is colored if we've elapsed that many minutes
      const isElapsed = elapsedMinutes >= currentMinute;
      
      return {
        id: `time-increment-${index}`,
        minute: currentMinute,
        isElapsed: isElapsed
      };
    });
    
    setTimeIncrements(newIncrements);
  }, [duration, getElapsedMilliseconds(), mode]);
  
  // Render function
  const renderTimeIncrements = () => {
    return timeIncrements.map(increment => (
      <div 
        key={increment.id}
        className="w-2 h-8 rounded-sm border border-white/10"
        style={{ 
          backgroundColor: increment.isElapsed 
            ? (item.color || '#4caf50') 
            : 'rgba(255, 255, 255, 0.2)'
        }}
        title={`${increment.minute} minute${increment.minute !== 1 ? 's' : ''}`}
      />
    ));
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

  const handleSwitchBreak = (breakItem) => {
    console.log('switching to break', breakItem);
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center">
        <RadialGlow color={item.color} />
        
        <div className="container p-14 flex flex-col gap-4 justify-center items-center">
          {/* Time increment squares */}
          <div className="flex flex-wrap justify-center gap-1 mb-4 max-w-2xl">
            {renderTimeIncrements()}
          </div>
          
          <h1 className="text-6xl text-center font-bold">{item.description}</h1>

          <div className="flex flex-row d items-center justify-center gap-4 p-4">
            {mode === 'timer' && (
            <button 
            className="btn btn-sm btn-ghost text-lg hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              adjustTime(-1);
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
                    formatTimerDisplay(Math.floor(getElapsedMilliseconds() / 1000)) // convert to seconds
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
                  adjustTime(1);
                }}
              >
                <PlusIcon className="size-6 text-white" />
              </button>
            )}
          </div>
          
          {/* Developer Mode Controls - Outside the timer group */}
          {developerMode && (
            <div className="flex flex-col items-center gap-2 mt-4 p-4 bg-gray-800/50 rounded-lg">
              <p className="text-white text-sm font-semibold">Developer Mode: Change elapsed time</p>
              <div className="flex items-center gap-2">
                <button 
                  className="btn btn-circle bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    adjustElapsedTime(-1);
                  }}
                >
                  <MinusIcon className="size-6 text-white" />
                </button>
                <span className="text-white text-sm min-w-16 text-center">
                  {formatTime(getElapsedMilliseconds())}
                </span>
                <button 
                  className="btn btn-circle bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    adjustElapsedTime(1);
                  }}
                >
                  <PlusIcon className="size-6 text-white" />
                </button>
              </div>
            </div>
          )}
          
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

          {/* Alternative breaks section - only show if we're in a break */}
          {item?.is_break && alternativeBreaks.length > 0 && (
            <div className="w-full mb-4 p-3 bg-gray-700/50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Switch Breaks</h4>
              <div className="space-y-2">
                {alternativeBreaks.map((breakItem, index) => (
                  <div key={breakItem.id} className="flex items-center justify-between bg-gray-600/30 p-2 rounded">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: breakItem.Habit?.Value?.color || '#ccc' }}
                      ></div>
                      <span className="text-sm">{breakItem.Habit?.description || 'Unknown Habit'}</span>
                    </div>
                    <button
                      onClick={() => handleSwitchBreak(breakItem)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                    >
                      Switch
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Work Session Component - positioned at the bottom */}
      <div className="w-full">
        {item?.is_break && <BreakProgress />}
        {!item?.is_break && <WorkSession />}
      </div>
    </div>
  );
}

export default Event;