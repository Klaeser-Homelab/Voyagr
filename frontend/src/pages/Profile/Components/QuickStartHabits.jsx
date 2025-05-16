import { useOnboarding } from "../../../context/OnboardingContext";
import OnboardingHabitForm from './OnboardingHabitForm';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { getAuthService } from '../../../services/auth';
import { useEffect, useState } from 'react';
import api from '../../../config/api';

const QuickStartHabits = () => {
    const { identity, addHabit } = useOnboarding();
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const name = identity.name || '<identity>';

    // Check for token on component mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const authService = getAuthService();
                const userToken = await authService.getToken();
                setToken(userToken);
            } catch (error) {
                console.error('Error checking auth:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const AddHabit = async (habit) => {
        if (!token) {  
            console.log("Add Habit");
            addHabit(habit);
            navigate('/quick-start/login');
        } else {
            try {
                // You'll need to import api and appState or get them from context
                await api.post('/api/values/init', {
                    value_name: identity.name,
                    value_color: identity.color,
                    habit_name: habit.name,
                    habit_duration: habit.duration,
                });
                navigate('/home');
            } catch (error) {
                console.error('Error creating habit:', error);
                // Handle error appropriately
            }
        }
    };

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="bg-black p-10 h-full flex items-center justify-center">
                <div className="text-white text-lg">Loading...</div>
            </div>
        );
    }

    // Render the component regardless of auth status
    return (
        <div className="bg-black p-10 h-full flex flex-col gap-40 items-center justify-center">
            <div className="flex flex-col gap-20 items-center text-center text-white text-2xl font-bold max-w-screen-md w-full">
                <h1>Wow, so cool! <br /> What does a {name} do?</h1> 
                <div className="flex flex-col gap-4 w-full">
                    {identity.habits.map((habit) => (
                        <div 
                            key={habit.id}
                            className="px-2 cursor-pointer transition-colors duration-200 border-l-5"
                            style={{ borderColor: identity.color }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex py-1 gap-3 items-center">
                                    <h3 className="text-lg font-semibold text-white">{habit.name}</h3>
                                    <p className="text-sm text-gray-400">{habit.duration} minutes</p>
                                    <p className="text-sm text-gray-400">{habit.frequency} times a day</p>
                                </div>
                                <button
                                    onClick={() => AddHabit(habit)}
                                    className="btn bg-green-700 btn-xs text-white"
                                >
                                    <PlusIcon className="size-5" />
                                    Add Habit
                                </button>  
                            </div>
                        </div>
                    ))}
                    <h2 className="text-lg font-semibold mt-30 text-white">You can also write your own habit</h2>
                    <div className="p-4 border-l-5" style={{ borderColor: identity.color }}>
                        <OnboardingHabitForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickStartHabits;