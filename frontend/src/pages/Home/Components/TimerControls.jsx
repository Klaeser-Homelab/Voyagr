import { useTimer } from '../../../context/TimerContext';




const TimerControls = ({ mode }) => {

  return (
    <div className="flex flex-wrap items-center gap-2 p-4">
    {mode === 'timer' && (
        <div className="flex items-center gap-2">
        <button 
        className="btn btn-sm btn-ghost text-lg hover:bg-white/20"
        onClick={(e) => {
          e.stopPropagation();
          adjustTime(-5);
        }}
      >
        -5
      </button>
      <button 
        className="btn btn-sm text-lg btn-ghost hover:bg-white/20"
        onClick={(e) => {
          e.stopPropagation();
          adjustTime(5);
        }}
      >
        +5
      </button>
    </div>
  )}
  
  </div>
  );
};

export default TimerControls;
