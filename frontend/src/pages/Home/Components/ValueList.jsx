import React, { useState } from 'react';
import { useValues } from '../../../context/ValuesContext';
import { useEvent } from '../../../context/EventContext';
import { useBreaks } from '../../../context/BreaksContext';
import { useUser } from '../../../context/UserContext';
import { useTimer } from '../../../context/TimerContext';
import Identity from './Identity';
import Event from './Event';
import BreakProgress from './BreakProgress';
import ValueListOnboard from './ValueListOnboard';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { CalendarIcon, PauseIcon, XMarkIcon } from '@heroicons/react/24/outline';
import HabitCard from './HabitCard';
import VoyagrAvatar from '../../../assets/voyagr_avatar.png';


function ValueList() {
  const { activeItem, activeEvent, levelingUp, setLevelingUp } = useEvent();
  const { values } = useValues();
  const { breakDuration } = useBreaks();
  const { formatTime } = useTimer();
  const [error, setError] = useState(null);
  const [showScheduled, setShowScheduled] = useState(false);
  const [showBreaks, setShowBreaks] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, updateUser, isOnboardingPageCompleted } = useUser();

  // Toggle the dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Toggle show scheduled option
  const toggleShowScheduled = () => {
    setShowScheduled(!showScheduled);
  };

  // Toggle show breaks option
  const toggleShowBreaks = () => {
    setShowBreaks(!showBreaks);
  };

  // Close dropdown
  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Handle modal close
  const handleModalClose = () => {
    console.log('handleModalClose');
    console.log(levelingUp);
    setLevelingUp(null);
  };

  const handleOnboardingClose = () => {
    // Onboarding will be handled by the ValueListOnboard component
  };

  const spoofedHabit = {
    id: values[0]?.Habits[0]?.id, // Use an ID that doesn't exist in your data
    break: null, // or add break data if you want to test break functionality
    createdAt: "2025-05-15T10:30:00.000Z",
    schedules: [],
    is_active: true,
    details: "This is a spoofed habit for testing",
    duration: 1800, // 30 minutes in seconds
    type: "habit",
    updatedAt: "2025-05-15T10:30:00.000Z",
    value_id: values[0]?.id,
    // Add any other properties your habit object might have
    description: "1. Start your first habit"
  };

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (activeEvent) {
    return (
      <Event key={activeItem.id} item={activeItem} />
    );
  }

  // Check if any filters are active
  const hasActiveFilters = showScheduled || showBreaks;

  return (
    <div className="h-screen flex flex-col">
      {/* Main content area - scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="mt-20 flex flex-col items-center">
          <div className="p-14 w-full flex flex-col gap-4">
            <div className="flex items-center justify-center w-full max-w-7xl gap-10">
              <h1 className="text-4xl font-bold">
                What's next?
              </h1>
              
              {/* DaisyUI Dropdown */}
              <div className="dropdown dropdown-right dropdown-end">
                <div 
                  tabIndex={0} 
                  role="button" 
                  className={`flex items-center justify-center ${hasActiveFilters ? 'text-primary' : 'text-white'}`}
                >
                  <AdjustmentsHorizontalIcon className="size-6" />
                </div>
                
                <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box z-10 w-56 p-2 shadow-lg">
                  <li>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="checkbox checkbox-sm" 
                        checked={showScheduled} 
                        onChange={toggleShowScheduled}
                      />
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="size-4" />
                        Show scheduled
                      </span>
                    </label>
                  </li>
                  
                  <li>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="checkbox checkbox-sm" 
                        checked={showBreaks} 
                        onChange={toggleShowBreaks}
                      />
                      <span className="flex items-center gap-1">
                        <PauseIcon className="size-4" />
                        Show breaks
                      </span>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
            
            {values.length === 0 ? (
              <div className="text-center py-4 text-base-content/70">
                No values found. Add some values to get started!
              </div>
            ) : (
              <div className="flex flex-wrap gap-4 w-full justify-center">
                {values.map((value) => (
                  <div key={value.id}>
                    <Identity 
                      value={value} 
                      showScheduled={showScheduled}
                      showBreaks={showBreaks}
                    />
                  </div>
                ))}
                {/* ValueList Onboarding Modal */}
                  {user && !isOnboardingPageCompleted(2) && (
                    <ValueListOnboard 
                      isOpen={true} 
                      onClose={handleOnboardingClose}
                    />
                  )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BreakProgress pinned to bottom - always visible */}
      {breakDuration > 0 && (
        <div className="w-full pb-16 lg:pb-0 lg:pl-13">
          <BreakProgress />
        </div>
      )}

      

      {/* Level Up Modal */}
      {levelingUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-base-100 rounded-lg shadow-xl p-8 max-w-md w-full mx-4 relative border-8 border-primary">
            {/* Close button */}
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 btn btn-ghost btn-sm btn-circle"
            >
              <XMarkIcon className="size-5" />
            </button>

            {/* Celebration content */}
            <div className="text-center">
              {/* Celebration emoji/icon */}
              <div className="flex flex-row items-center justify-center gap-4">
              <div className="text-6xl mb-4">🎉</div>
                <img src={VoyagrAvatar} alt="Voyagr" className="w-20 h-20 rounded-full mb-4" />
                <div className="text-6xl mb-4">🎉</div>
              </div>

              {/* Motivational message */}
              <p className="text-base-content/80 text-lg">
                Nice work, {user.display_name}! You've leveled up!
              </p>
              
              {/* Level up message */}
              <h2 className="text-3xl font-bold text-primary mb-2">
                Level
              </h2>
              
              <p className="text-8xl text-secondary font-bold mb-4" style={{ color: levelingUp.value.color }}>
                 {levelingUp.value.level}
              </p>

              <h2 className="text-3xl font-bold text-primary mb-2">
                {levelingUp.value.description}
              </h2>
              
              {/* Progress details */}
              <div className="bg-base-200 rounded-lg p-4 mb-6">
                <div className="text-lg text-base-content/70 mb-2">
                  Previous Level: {levelingUp.value.old_level}
                </div>
                <div className="text-lg text-base-content/70">
                  Total Time: {formatTime(levelingUp.value.total_time)}
                </div>
              </div>
              
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ValueList;