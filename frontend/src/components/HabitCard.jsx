import { PlayIcon } from "@heroicons/react/24/outline";
import { useTimer } from "../context/TimerContext";
import { useEvent } from "../context/EventContext";

const HabitCard = ({ habit}) => {
  const { startTimer } = useTimer();
  const { handleInputSelect } = useEvent();

  const getScheduleText = () => {
    if (!habit.startTime || !habit.endTime || !habit.daysOfWeek) return null;
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const scheduledDays = habit.daysOfWeek.map(day => days[day]).join(', ');
    return `${habit.startTime.slice(0, 5)} - ${habit.endTime.slice(0, 5)} on ${scheduledDays}`;
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
    // TODO: Add habit to activeEvent
    console.error('Not implemented');
  }

  return (
    <div 
      key={habit.item_id} 
      className={`rounded-md transition-all duration-200 cursor-pointer`}
    >
      <div className="flex items-center justify-between p-2">
        <div className="flex-grow">
          <div className="flex items-center justify-between space-x-2">
            <>
            <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: habit.color }}
            />
            <h4 className="text-white">{habit.description}</h4>
            </div>
            </>
            <PlayIcon className="size-6 text-white" onClick={handleInputClick} />
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

export default HabitCard; 