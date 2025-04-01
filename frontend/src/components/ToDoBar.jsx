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
      <div className="w-full h-6 flex rounded-xl overflow-hidden shadow-md mb-4">
        {timeSegments.map((segment, index) => (
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
        {timeSegments.map((segment, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-sm" 
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