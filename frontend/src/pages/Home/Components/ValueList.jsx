import React, { useState } from 'react';
import { useValues } from '../../../context/ValuesContext';
import { useEvent } from '../../../context/EventContext';
import { useBreaks } from '../../../context/BreaksContext';
import Identity from './Identity';
import Event from './Event';
import Onboarding from '../../Onboarding/ChapterOne';
import BreakProgress from './BreakProgress';
import LevelUpModal from './LevelUpModal';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { CalendarIcon, PauseIcon, XMarkIcon } from '@heroicons/react/24/outline';

function ValueList() {
  const { activeItem, activeEvent, levelingUp, setLevelingUp } = useEvent();
  const { values } = useValues();
  const { breakDuration } = useBreaks();
  const [error, setError] = useState(null);
  const [showScheduled, setShowScheduled] = useState(false);
  const [showBreaks, setShowBreaks] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    setLevelingUp(null);
  };

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (activeEvent) {
    return (
      <Event key={activeItem.id} item={activeItem} />
    );
  }

  if (values.length === 1 && values[0].id === 1) {
    return (
      <div className="p-14 w-full flex flex-col gap-4 bg-black">
        <Onboarding />
      </div>
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
      {levelingUp && console.log('levelingUp:', levelingUp)}

      {/* Level Up Modal */}
      {levelingUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="bg-base-100 rounded-lg shadow-xl p-8 max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 btn btn-ghost btn-sm btn-circle"
        >
          <XMarkIcon className="size-5" />
        </button>

        {/* Celebration content */}
        <div className="text-center">
          {/* Celebration emoji/icon */}
          <div className="text-6xl mb-4">🎉</div>
          
          {/* Level up message */}
          <h2 className="text-3xl font-bold text-primary mb-2">
            Level Up!
          </h2>
          
          <p className="text-lg mb-4">
            Congratulations! You've reached level {value.level}
          </p>
          
          {/* Progress details */}
          <div className="bg-base-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-base-content/70 mb-2">
              Previous Level: {value.old_level}
            </div>
            <div className="text-sm text-base-content/70 mb-2">
              Current Level: {value.level}
            </div>
            <div className="text-sm text-base-content/70">
              Total Time: {Math.round(value.total_time / 60)} minutes
            </div>
          </div>
          
          {/* Motivational message */}
          <p className="text-base-content/80">
            Keep up the great work! Every step forward is progress.
          </p>
        </div>
      </div>
      </div>
      )}
    </div>
  );
}

export default ValueList;