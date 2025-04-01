const getEventSegments = ({ completedEvents }) => {
  // Calculate total minutes in workday (8AM to 7PM = 11 hours)
  const workdayMinutes = 11 * 60;
  const workdayStart = new Date();
  workdayStart.setHours(8, 0, 0, 0);
  
  if (!completedEvents.length) {
    const now = new Date();
    if (now < workdayStart) {
      return [{
        name: 'Upcoming',
        color: '#f5f5f5',
        percent: '100'
      }];
    }
    
    const minutesSinceStart = Math.max(0, (now - workdayStart) / 1000 / 60);
    const unusedPercent = ((Math.min(minutesSinceStart, workdayMinutes) / workdayMinutes) * 100).toFixed(1);
    const upcomingPercent = (100 - unusedPercent).toFixed(1);
    
    return [
      {
        name: 'Unused',
        color: '#e0e0e0',
        percent: unusedPercent
      },
      {
        name: 'Upcoming',
        color: '#f5f5f5',
        percent: upcomingPercent
      }
    ];
  }

  const now = new Date();
  const minutesSinceStart = Math.max(0, (now - workdayStart) / 1000 / 60);

  // Group events by value and sum their durations
  const valueSegments = completedEvents.reduce((acc, event) => {
    const valueId = event.VID;
    
    if (!acc[valueId]) {
      acc[valueId] = {
        name: event.valueName || 'Unknown Value',
        color: event.color || '#ddd',
        totalDuration: 0
      };
    }
    
    acc[valueId].totalDuration += event.duration;
    return acc;
  }, {});

  // Calculate total duration of all events (in minutes)
  const totalEventDuration = completedEvents.reduce((sum, event) => sum + event.duration, 0);
  
  // Calculate unused past time (excluding upcoming time)
  const unusedDuration = Math.max(0, Math.min(minutesSinceStart, workdayMinutes) - (totalEventDuration / 60));
  
  // Calculate upcoming time
  const upcomingDuration = Math.max(0, workdayMinutes - Math.min(minutesSinceStart, workdayMinutes));

  // Convert to percentage segments including unused time
  const segments = Object.values(valueSegments).map(segment => ({
    name: segment.name,
    color: segment.color,
    percent: ((segment.totalDuration / 60 / workdayMinutes) * 100).toFixed(1)
  }));

  // Add unused time segment if there is any
  if (unusedDuration > 0) {
    segments.push({
      name: 'Unused',
      color: '#e0e0e0',
      percent: ((unusedDuration / workdayMinutes) * 100).toFixed(1)
    });
  }

  // Add upcoming time segment if there is any
  if (upcomingDuration > 0) {
    segments.push({
      name: 'Upcoming',
      color: '#f5f5f5',
      percent: ((upcomingDuration / workdayMinutes) * 100).toFixed(1)
    });
  }

  return segments;
};

const EventBar = ({ completedEvents = [] }) => {
  const segments = getEventSegments({ completedEvents });

  return (
    <div>
      <h1>Event Distribution</h1>
      <div className="w-full h-6 flex rounded-xl overflow-hidden shadow-md mb-4">
        {segments.map((segment, index) => (
          <div
            key={index}
            className="h-full transition-all duration-300 hover:opacity-90"
            style={{
              width: `${segment.percent}%`,
              backgroundColor: segment.color,
            }}
            title={`${segment.name}: ${segment.percent}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-4 mb-8">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-sm" 
              style={{ backgroundColor: segment.color }} 
            />
            <span>{segment.name}: {segment.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventBar;    