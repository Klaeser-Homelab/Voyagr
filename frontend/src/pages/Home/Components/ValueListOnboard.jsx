import React, { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import VoyagrAvatar from '../../../assets/voyagr_avatar.png';
import Headshot1 from '../../../assets/headshot_1.png';
import Headshot2 from '../../../assets/headshot_2.png';
import Headshot3 from '../../../assets/headshot_3.png';
import { useNavigate } from 'react-router-dom';

import { 
  CalendarIcon, 
  AdjustmentsHorizontalIcon,
  PauseIcon,
  CheckCircleIcon as CheckCircleIconOutline,
  ClockIcon,
  UserCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, PlayIcon } from '@heroicons/react/24/solid';


function ValueListOnboard({ isOpen, onClose }) {
  const { user, valueListStep, setValueListStep, markOnboardingPageCompleted } = useUser();
  const [localStep, setLocalStep] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
      setLocalStep(valueListStep);
  }, [valueListStep]);

  if (!isOpen) return null;

  // Define headshot options
  const headshotOptions = [
    { key: 'headshot1', src: Headshot1 },
    { key: 'headshot2', src: Headshot2 },
    { key: 'headshot3', src: Headshot3 }
  ];

  // Get the selected headshot from user data or default to first option
  const selectedHeadshot = user?.selectedHeadshot || 'headshot1';

  const steps = [
    {
        title: "Level Up your Identities with Voyagr",
        message: 'You, for instance, are a Diligent Learner at Level 1. Work on Habits to Level Up.',
        icon: <img 
          src={headshotOptions.find(h => h.key === selectedHeadshot)?.src} 
          alt="Your avatar"
          className="w-16 h-16 rounded-full border-2 border-blue-500"
        />,
        animation: "",
        iconBg: "bg-primary",
        iconColor: "text-black",
        arrow: {
          direction: "up",
          path: "M5 12l7-7 7 7"
        }
      },
    {
      title: "Start Your First Habit",
      message: 'Hover over "1. Start here (Habit)" and press play!',
      icon: <PlayIcon className="size-6" />,
      animation: "animate-bounce",
      iconBg: "bg-primary",
      iconColor: "text-black",
      arrow: {
        direction: "up",
        path: "M5 12l7-7 7 7"
      }
    },
    {
      title: "Track Your Progress",
      message: "When a habit completes it appears over here.",
      icon: <CheckCircleIcon className="size-6" />,
      animation: "animate-bounce",
      iconBg: "bg-gray-500",
      iconColor: "text-white",
      arrow: {
        direction: "right",
        path: "M12 5l7 7-7 7"
      }
    },
    {
        title: "Scheduled Habits",
        message: "You can also schedule and play habits over here.",
        icon: <CalendarIcon className="size-6" />,
        animation: "animate-bounce",
        iconBg: "bg-base-200",
        iconColor: "text-primary",
        arrow: {
          direction: "right",
          path: "M12 5l7 7-7 7"
        }
    },
    {
        title: "Mark Habits Complete",
        message: "If you already did something, just mark it complete.",
        icon: <CheckCircleIconOutline className="size-6" />,
        animation: "animate-bounce",
        iconBg: "bg-success",
        iconColor: "text-black",
        arrow: {
          direction: "up",
          path: "M5 12l7-7 7 7"
        }
      },
    {
        title: "Filter for More",
        message: "Habits that are scheduled or set as breaks are filtered by default.",
        icon: <AdjustmentsHorizontalIcon className="size-6" />,
        animation: "animate-bounce",
        iconBg: "bg-base-100",
        iconColor: "text-white",
        arrow: {
          direction: "up",
          path: "M5 12l7-7 7 7"
        }
      },
    {
      title: "Discover Breaks",
      message: "Press Play on \"2. Now try this one (Habit)\".",
      icon: <PauseIcon className="size-6" />,
      animation: "animate-bounce",
      iconBg: "bg-base-200",
      iconColor: "text-secondary",
      arrow: {
        direction: "up",
        path: "M5 12l7-7 7 7"
      }
    },
    {
      title: "Customize Breaks",
      message: <>Follow the <a href="https://en.wikipedia.org/wiki/Pomodoro_Technique" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Pomodoro Technique</a> or your heart.</>,
      icon: <ClockIcon className="size-6" />,
      animation: "animate-bounce",
      iconBg: "bg-base-300",
      iconColor: "text-white",
      arrow: {}
    },
  ];

  const handleNext = () => {
    console.log("localStep", localStep);
    if (localStep < steps.length) {
      console.log("incrementing step");
      setLocalStep(localStep + 1);
      setValueListStep(localStep + 1);  
    } else {
      console.log("completing onboarding");
      // Complete onboarding
      markOnboardingPageCompleted(2);
      navigate('/profile');
    }
  };

  const handlePrevious = () => {
    console.log("prev");
    if (localStep > 1) {
      setLocalStep(localStep - 1);
      setValueListStep(localStep - 1);
    }
  };

  const localStepData = steps[localStep - 1];

  return (
    <div className="flex items-center justify-center z-50 w-full">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-8 shadow-xl">
        {/* Progress Indicator */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex gap-3 mb-3">
            {steps.slice(0, 4).map((_, index) => (
              <div 
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  localStep >= index + 1 ? 'bg-blue-500' : 'bg-gray-300'
                }`} 
              />
            ))}
          </div>
          <div className="flex gap-3">
            {steps.slice(4, 8).map((_, index) => (
              <div 
                key={index + 4}
                className={`w-3 h-3 rounded-full transition-colors ${
                  localStep >= index + 5 ? 'bg-blue-500' : 'bg-gray-300'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="mb-6">
              <div className="flex justify-center items-center gap-4 mb-4">
                <img 
                  src={VoyagrAvatar} 
                  alt="Voyagr" 
                  className="w-16 h-16 rounded-full" 
                />
                {/* Check if current step is 1 to show headshot instead of icon */}
                {localStep === 1 ? (
                  localStepData.icon
                ) : (
                  <div className={`${localStepData.iconBg} ${localStepData.iconColor} rounded-full p-3 ${localStepData.animation}`}>
                    {localStepData.icon}
                  </div>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {localStepData.title}
              </h2>
              
              <p className="text-gray-600 text-lg">
                {localStepData.message}
              </p>
            </div>
            
            {/* Arrow with direction from step config - only show if path exists */}
            {localStepData.arrow && localStepData.arrow.path && (
              <div className="flex justify-center mb-6">
                <svg 
                  className="w-6 h-6 text-gray-600 animate-bounce" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={4} 
                    d={localStepData.arrow.path}
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrevious}
            disabled={localStep === 1}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-500">
            {localStep} of {steps.length}
          </span>
          
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
          >
            {localStep === steps.length ? (
              <>
                <UserCircleIcon className="size-8" />
                Learn More
              </>
            ) : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ValueListOnboard;