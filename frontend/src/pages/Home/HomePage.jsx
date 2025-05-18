import React, { useEffect, useState } from 'react';
import { useValues } from '../../context/ValuesContext';
import ValueList from './Components/ValueList';
import Today from './Components/Today';
import { useTracker } from '../../context/TrackerContext';
import { useUser } from '../../context/UserContext';
import Onboarding from '../Onboarding/ChapterOne';
import HomeOnboard from './Components/HomeOnboard';
import { useNavigate } from 'react-router-dom';
import VoyagrAvatar from '../../assets/voyagr_avatar.png';


function HomePage() {
    const { fetchAll, values } = useValues();
    const { fetchMonthEvents } = useTracker();
    const { user, fetchUser, isOnboardingPageCompleted } = useUser();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [showOnboardingModal, setShowOnboardingModal] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                await fetchAll();
                await fetchMonthEvents();
                await fetchUser();
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadData();
    }, []);

    // Show loading state while fetching data
    if (isLoading) {
        return (
            <div className="flex flex-col flex-grow overflow-hidden h-screen lg:flex-row justify-center items-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col flex-grow overflow-hidden h-screen lg:flex-row justify-between">
            <div className="radial-glow"></div>
            <div className="flex-grow flex justify-center w-full overflow-hidden">
                <div className="w-full overflow-y-auto">
                    <ValueList />
                </div>
            </div>
            <div className="hidden lg:block w-full h-screen max-w-2xl">
                <Today />
            </div>
            
            {/* Onboarding Modal */}
            {user && !isOnboardingPageCompleted(1) && (
                <HomeOnboard />
            )}    
        </div>
    );
}

export default HomePage;