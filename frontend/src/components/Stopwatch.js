function Stopwatch({ activeInput }) {
  // ... existing state ...

  return (
    <div className="timer-container">
      <h2>Stopwatch</h2>
      {!activeInput && (
        <div className="warning-message">
          Please select an input before starting a stopwatch
        </div>
      )}
      <div className="timer-display">
        {formatTime(time)}
      </div>
      <div className="timer-controls">
        <button 
          onClick={handleStart}
          disabled={!activeInput || isRunning}
        >
          Start
        </button>
        <button 
          onClick={handleStop}
          disabled={!isRunning}
        >
          Stop
        </button>
        <button 
          onClick={handleReset}
          disabled={!time}
        >
          Reset
        </button>
      </div>
    </div>
  );
} 