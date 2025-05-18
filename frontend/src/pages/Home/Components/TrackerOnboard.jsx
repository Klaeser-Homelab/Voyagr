import React from 'react';
import { useUser } from '../../../context/UserContext';
import VoyagrAvatar from '../../../assets/voyagr_avatar.png';
import Headshot1 from '../../../assets/headshot_1.png';
import Headshot2 from '../../../assets/headshot_2.png';
import Headshot3 from '../../../assets/headshot_3.png';
import { useNavigate } from 'react-router-dom';
import api from '../../../config/api';

function TrackerOnboard() {
  const { user, markOnboardingPageCompleted } = useUser();
  const navigate = useNavigate();

  // Define headshot options
  const headshotOptions = [
    { key: 'headshot1', src: Headshot1 },
    { key: 'headshot2', src: Headshot2 },
    { key: 'headshot3', src: Headshot3 }
  ];

  // Get the selected headshot from user data or default to first option
  const selectedHeadshot = user?.selectedHeadshot || 'headshot1';

  const handleComplete = async () => {
    // Complete onboarding
    markOnboardingPageCompleted(1);
    markOnboardingPageCompleted(2);
    markOnboardingPageCompleted(3);  
    markOnboardingPageCompleted(4);

    // Clean up onboarding
    await api.post('/api/values/init/onboardingcomplete');

    // Navigate to home - removed dependency on useNavigate
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-8 shadow-xl">
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
                <img 
                  src={headshotOptions.find(h => h.key === selectedHeadshot)?.src} 
                  alt="Your avatar"
                  className="w-16 h-16 rounded-full border-2 border-blue-500"
                />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                See your hard work pay off
              </h2>
              
              <p className="text-gray-600 text-lg">
                You're ready to get started tracking!
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleComplete}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            I'm ready!
          </button>
        </div>
      </div>
    </div>
  );
}

export default TrackerOnboard;