import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

function LevelUpModal({ levelUpData, onClose }) {
  console.log('LevelUpModal received:', levelUpData);
  
  if (!levelUpData || !levelUpData.value) {
    console.log('Modal not showing - missing data:', { levelUpData, hasValue: levelUpData?.value });
    return null;
  }

  console.log('Modal should be visible');
  const value = levelUpData.value;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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
  );
}

export default LevelUpModal;