import React, { useState } from 'react';
import VoyagrAvatar from '../../../assets/voyagr_avatar.png';
import Headshot1 from '../../../assets/headshot_1.png';
import Headshot2 from '../../../assets/headshot_2.png';
import Headshot3 from '../../../assets/headshot_3.png';
import { useUser } from '../../../context/UserContext';

function HomeOnboard() {
    const { user, updateUser, markOnboardingPageCompleted } = useUser();
    const [currentStep, setCurrentStep] = useState(1); // 1: name, 2: avatar, 3: complete
    const [name, setName] = useState('');
    const [selectedHeadshot, setSelectedHeadshot] = useState('');
    const [currentInput, setCurrentInput] = useState('');


    const headshotOptions = [
        { key: 'headshot_1', src: Headshot1, alt: 'Option 1' },
        { key: 'headshot_2', src: Headshot2, alt: 'Option 2' },
        { key: 'headshot_3', src: Headshot3, alt: 'Option 3' }
    ];

    const handleNameSubmit = () => {
        if (currentInput.trim()) {
            setName(currentInput.trim());
            setCurrentStep(2);
            setCurrentInput('');
        }
    };

    const handleHeadshotSelect = async (headshotKey) => {
        setSelectedHeadshot(headshotKey);
        setCurrentStep(3);
        
        // Complete onboarding after a short delay
        setTimeout(async () => {
            try {
                // Update user profile with name and avatar
                await updateUser({
                    display_name: name,
                    avatar: headshotKey
                });
                
                // Mark page 1 (HomeOnboard) as completed
                await markOnboardingPageCompleted(1);
                
            } catch (error) {
                console.error('Error completing onboarding:', error);
                // Still close the modal even if there's an error
            }
        }, 2000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && currentStep === 1) {
            handleNameSubmit();
        }
    };

    const renderNameStep = () => (
        <div className="text-center">
            <div className="mb-6">
                <img src={VoyagrAvatar} alt="Voyagr" className="w-32 h-32 rounded-full mx-auto mb-4 object-center" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Hey! It's Voyagr!</h2>
                <p className="text-gray-600">What was your name again?</p>
            </div>
            
            <div className="max-w-xs mx-auto text-black">
                <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                    autoFocus
                />
                <button 
                    onClick={handleNameSubmit}
                    disabled={!currentInput.trim()}
                    className="w-full mt-4 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    Continue
                </button>
            </div>
        </div>
    );

    const renderAvatarStep = () => (
        <div className="text-center">
            <div className="mb-6">
                <img src={VoyagrAvatar} alt="Voyagr" className="w-20 h-20 rounded-full mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Right right, {name}!</h2>

                <p className="text-gray-600">Choose your avatar:</p>
            </div>
            
            <div className="flex justify-center gap-6">
                {headshotOptions.map((headshot) => (
                    <div
                        key={headshot.key}
                        className="flex flex-col items-center gap-3 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105"
                        onClick={() => handleHeadshotSelect(headshot.key)}
                    >
                        <img 
                            src={headshot.src} 
                            alt={headshot.alt} 
                            className="w-20 h-20 rounded-full border-3 border-gray-200 hover:border-blue-500 transition-colors shadow-sm"
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    const renderCompleteStep = () => (
        <div className="text-center">
            <div className="mb-6">
                <div className="flex justify-center items-center gap-4 mb-4">
                    <img src={VoyagrAvatar} alt="Voyagr" className="w-16 h-16 rounded-full" />
                    {selectedHeadshot && (
                        <img 
                            src={headshotOptions.find(h => h.key === selectedHeadshot)?.src} 
                            alt="Your avatar"
                            className="w-16 h-16 rounded-full border-2 border-blue-500"
                        />
                    )}
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Perfect! You're all set.</h2>
                <p className="text-gray-600">Welcome aboard, {name}! 🚀</p>
            </div>
            
            <div className="flex justify-center">
                <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-8 shadow-xl">
                {/* Progress Indicator */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`} />
                        <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`} />
                        <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`} />
                        <div className={`w-8 h-0.5 ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`} />
                        <div className={`w-3 h-3 rounded-full ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    </div>
                </div>

                {/* Content */}
                <div className="min-h-[300px] flex items-center justify-center">
                    {currentStep === 1 && renderNameStep()}
                    {currentStep === 2 && renderAvatarStep()}
                    {currentStep === 3 && renderCompleteStep()}
                </div>
                
            </div>
        </div>
    );
}

export default HomeOnboard;