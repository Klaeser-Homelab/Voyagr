import React, { useEffect, useState } from 'react';
import { useValues } from '../../context/ValuesContext';
import ValueList from './Components/ValueList';
import Today from './Components/Today';
import { useTracker } from '../../context/TrackerContext';
import { useUser } from '../../context/UserContext';
import Onboarding from '../Onboarding/ChapterOne';
import HomeOnboard from './Components/HomeOnboard';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const { fetchAll, values } = useValues();
    const { fetchMonthEvents } = useTracker();
    const { user, fetchUser } = useUser();
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

    useEffect(() => {
        console.log('values', values);
        console.log('user', user);
        
        // Only navigate after data has loaded
        if (!isLoading) {
            if (values.length === 0) {
                // No values - go to onboarding
                navigate('/chapter-one');
            } else if (user && !user.onboarding_completed) {
                // Has values but onboarding not completed - show modal
                console.log('showOnboardingModal', showOnboardingModal);
                setShowOnboardingModal(true);
            }
        }
    }, [values, user, isLoading, navigate]);

    // Show loading state while fetching data
    if (isLoading) {
        return (
            <div className="flex flex-col flex-grow overflow-hidden h-screen lg:flex-row justify-center items-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-grow overflow-hidden h-screen lg:flex-row justify-between">
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
            {showOnboardingModal && (
                <HomeOnboard isOpen={showOnboardingModal} onClose={() => setShowOnboardingModal(false)} />
            )}
        </div>
    );
}

export default HomePage;