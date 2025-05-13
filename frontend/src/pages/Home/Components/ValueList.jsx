import React, { useState } from 'react';
import { useValues } from '../../../context/ValuesContext';
import { useEvent } from '../../../context/EventContext';
import { useBreaks } from '../../../context/BreaksContext';
import Identity from './Identity';
import Event from './Event';
import Onboarding from '../../Onboarding/ChapterOne';
import BreakProgress from './BreakProgress';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { CalendarIcon, PauseIcon } from '@heroicons/react/24/outline';

function ValueList() {
  const { activeItem, activeEvent } = useEvent();
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
    <div className="min-h-screen flex flex-col w-full items-center">
      <div className="flex-1">
        <div className="container p-14 w-full max-w-md flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl text-center font-bold">What's next?</h1>
            
            {/* Dropdown for filters */}
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className={`flex items-center justify-center ${hasActiveFilters ? 'text-primary' : 'text-white'}`}
              >
                <AdjustmentsHorizontalIcon className="size-6" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-base-200 rounded-md shadow-lg z-10">
                  <div className="p-2 space-y-2">
                    <div 
                      className="flex items-center gap-2 p-2 hover:bg-base-300 rounded cursor-pointer"
                      onClick={toggleShowScheduled}
                    >
                      <input 
                        type="checkbox" 
                        className="checkbox checkbox-sm" 
                        checked={showScheduled} 
                        onChange={() => {}}
                      />
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="size-4" />
                        Show scheduled
                      </span>
                    </div>
                    
                    <div 
                      className="flex items-center gap-2 p-2 hover:bg-base-300 rounded cursor-pointer"
                      onClick={toggleShowBreaks}
                    >
                      <input 
                        type="checkbox" 
                        className="checkbox checkbox-sm" 
                        checked={showBreaks} 
                        onChange={() => {}}
                      />
                      <span className="flex items-center gap-1">
                        <PauseIcon className="size-4" />
                        Show breaks
                      </span>
                    </div>
                    
                    <div className="border-t border-base-300 my-1"></div>
                    
                    <button 
                      className="btn btn-sm w-full justify-center" 
                      onClick={handleCloseDropdown}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {values.length === 0 ? (
            <div className="text-center py-4 text-base-content/70">
              No values found. Add some values to get started!
            </div>
          ) : (
            <div>
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

      {/* Show BreakProgress at the bottom if there's an active break session */}
      {breakDuration > 0 && (
        <div className="w-full">
          <BreakProgress />
        </div>
      )}
    </div>
  );
}

export default ValueList;