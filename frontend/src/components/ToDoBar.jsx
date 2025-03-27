const getTimeSegments = ({ completedTodos }) => {
  // Add console.log to debug the input
  console.debug('Completed todos:', completedTodos);

  // If no todos, return empty array
  if (!completedTodos.length) return [];

  // Group todos by value with more lenient checks
  const todosByValue = completedTodos.reduce((acc, todo) => {
    
    let valueId, valueName, valueColor;
    
    if (todo.type === 'value' && todo.Value) {
      valueId = todo.Value.VID;
      valueName = todo.Value.Name;
      valueColor = todo.Value.Color;
    } else if (todo.type === 'input' && todo.Input?.Value) {
      valueId = todo.Input.Value.VID;
      valueName = todo.Input.Value.Name;
      valueColor = todo.Input.Value.Color;
    }
    
    if (valueId) {
      if (!acc[valueId]) {
        acc[valueId] = {
          name: valueName || 'Unknown',
          color: valueColor || '#cccccc',
          count: 0
        };
      }
      acc[valueId].count++;
    }
    
    return acc;
  }, {});


  // Calculate percentages for each value
  const segments = Object.values(todosByValue).map(value => ({
    name: value.name,
    color: value.color,
    percent: ((value.count / completedTodos.length) * 100).toFixed(1)
  }));

  return segments;
};

const ToDoBar = ({ completedTodos = [] }) => {
  const timeSegments = getTimeSegments({ completedTodos });

  return (
    <>
    <h3>Todos</h3>
      <div className="time-bar">
        {timeSegments.map((segment, index) => (
          <div
            key={index}
            className="time-segment"
            style={{
              width: `${segment.percent}%`,
              backgroundColor: segment.color,
            }}
            title={`${segment.name}: ${segment.percent}%`}
          />
        ))}
      </div>
      <div className="time-legend">
        {timeSegments.map((segment, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: segment.color }} 
            />
            <span>{segment.name}: {segment.percent}%</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default ToDoBar;