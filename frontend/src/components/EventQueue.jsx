



const EventQueue = () => {
  return (
    <div>
        <h1>Event Queue</h1>
        
        <div>
            <button onClick={() => {
                console.log('Set activeInput to Swim');
                console.log('Start Timer');
            }}>Start</button>
        </div>
    </div>
  );
};

export default EventQueue;