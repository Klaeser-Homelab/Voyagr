import { PlayIcon } from "@heroicons/react/24/outline";
import { useTimer } from "../context/TimerContext";
import { useSelection } from "../context/SelectionContext";

const InputCard = ({ 
  input, 
  onInputClick,
}) => {
  const { startTimer } = useTimer();
  const { activeValue, activeInput, handleValueSelect, handleInputSelect } = useSelection();


  const getScheduleText = () => {
    if (!input.startTime || !input.endTime || !input.daysOfWeek) return null;
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const scheduledDays = input.daysOfWeek.map(day => days[day]).join(', ');
    return `${input.startTime.slice(0, 5)} - ${input.endTime.slice(0, 5)} on ${scheduledDays}`;
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    onInputClick(input, e);
    handleInputSelect(input);
    startTimer();
  }

  return (
    <div 
      key={input.IID} 
      className={`rounded-md transition-all duration-200 cursor-pointer
        ${activeInput?.IID === input.IID ? 'bg-base-100' : 'bg-base-100'}`}
      onClick={(e) => onInputClick(input, e)}
    >
      <div className="flex items-center justify-between p-2">
        <div className="flex-grow">
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: input.color }}
            />
            <h4 className="text-gray-700">{input.Name}</h4>
            <PlayIcon className="size-6 text-black" onClick={handlePlay} />
          </div>
          
          {/* Schedule information */}
          {getScheduleText() && (
            <div className="mt-1 text-sm text-gray-500">
              <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {getScheduleText()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputCard; 