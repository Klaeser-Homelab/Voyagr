import { useOnboarding } from "../../../context/OnboardingContext";
import OnboardingHabitForm from './OnboardingHabitForm';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../../../config/api';

const QuickStartHabits = () => {
    const { identity, addHabit } = useOnboarding();
    const navigate = useNavigate();
    const name = identity.name || '<identity>';

    const AddHabit = async (habit) => {

        console.log("Add Habit");
        addHabit(habit)
        navigate('/quick-start/login')
    }


    // Store onboarding data in Redis
    


    return (
        <div className="bg-black p-10 h-full flex flex-col gap-40 items-center justify-center ">
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
}   

export default QuickStartHabits;