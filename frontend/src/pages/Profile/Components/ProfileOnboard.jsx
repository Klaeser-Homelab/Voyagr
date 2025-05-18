import React, { useState } from 'react';
import { useUser } from '../../../context/UserContext';
import VoyagrAvatar from '../../../assets/voyagr_avatar.png';
import Headshot1 from '../../../assets/headshot_1.png';
import Headshot2 from '../../../assets/headshot_2.png';
import Headshot3 from '../../../assets/headshot_3.png';
import { useNavigate } from 'react-router-dom';

import { 
  ClockIcon, MagnifyingGlassIcon, ChartBarIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

function ProfileOnboard() {
  const { user, markOnboardingPageCompleted } = useUser();
  const navigate = useNavigate();
  const [profileStep, setProfileStep] = useState(1);

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
      title: "Welcome to Your Profile",
      message: 'Here you can define your Identities and Habits.',
      icon: <img 
        src={headshotOptions.find(h => h.key === selectedHeadshot)?.src} 
        alt="Your avatar"
        className="w-16 h-16 rounded-full border-2 border-blue-500"
      />,
      animation: "",
      iconBg: "bg-primary",
      iconColor: "text-black"
    },
    {
      title: "Define your Break Cycle",
      message: 'Short and long Pomodoro breaks are already defined for you.',
      icon: <ClockIcon className="size-6" />,
      animation: "animate-bounce",
      iconBg: "bg-base-300",
      iconColor: "text-white"
    },
    {
      title: "Discover",
      message: "Browse popular Identities and Habits.",
      icon: <MagnifyingGlassIcon className="size-6" />,
      animation: "animate-bounce",
      iconBg: "bg-gray-500",
      iconColor: "text-white"
    },
    {
      title: "Track Your Achievements",
      message: "View your Level progress here or track your Habits in the Habit Tracker.",
      icon: <CheckCircleIcon className="size-6" />,
      animation: "animate-bounce",
      iconBg: "bg-success",
      iconColor: "text-black"
    }
  ];

  const handleNext = () => {
    if (profileStep < steps.length) {
      setProfileStep(profileStep + 1);  
    } else {
      // Complete onboarding
      markOnboardingPageCompleted(3);
      navigate('/tracker');
    }
  };

  const handlePrevious = () => {
    if (profileStep > 1) {
      setProfileStep(profileStep - 1);
    }
  };

  // Safety check for profileStep
  if (profileStep < 1 || profileStep > steps.length) {
    setProfileStep(1);
    return null;
  }

  const currentStepData = steps[profileStep - 1];

  return (
    <div className="flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-8 shadow-xl">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            {steps.map((_, index) => (
              <React.Fragment key={index}>
                <div 
                  className={`w-3 h-3 rounded-full transition-colors ${
                    profileStep >= index + 1 ? 'bg-blue-500' : 'bg-gray-300'
                  }`} 
                />
                {index < steps.length - 1 && (
                  <div 
                    className={`w-8 h-0.5 transition-colors ${
                      profileStep >= index + 2 ? 'bg-blue-500' : 'bg-gray-300'
                    }`} 
                  />
                )}
              </React.Fragment>
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
                {profileStep === 1 ? (
                  currentStepData.icon
                ) : (
                  <div className={`${currentStepData.iconBg} ${currentStepData.iconColor} rounded-full p-3 ${currentStepData.animation}`}>
                    {currentStepData.icon}
                  </div>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {currentStepData.title}
              </h2>
              
              <p className="text-gray-600 text-lg">
                {currentStepData.message}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrevious}
            disabled={profileStep === 1}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-500">
            {profileStep} of {steps.length}
          </span>
          
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
          >
            {profileStep === steps.length ? (
              <>
                <ChartBarIcon className="size-5" />
                Track Habits
              </>
            ) : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileOnboard;