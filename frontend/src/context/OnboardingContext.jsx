import { createContext, useState, useContext } from 'react';

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
    const [name, setName] = useState('');
    const [identity, setIdentity] = useState('');
    const [habit, addHabit] = useState('');
    const [stateValue, setStateValue] = useState('');

    const suggestedIdentities = [
        {
            id: 1,
            name: "Runner",
            color: "#0000FF",
            habits: [
                {
                    id: 101,
                    name: "Move legs rapidly", 
                    duration: 20, 
                    frequency: 1
                },
            ]
        },
        {
            id: 2,
            name: "Artist",
            color: "#FF0000",
            habits: [
                {
                    id: 201,
                    name: "Make something, no matter how small", 
                    duration: 15, 
                    frequency: 1
                },
            ]
        },
        {
            id: 3,
            name: "Attentive Partner",
            color: "#00FF00",
            habits: [
                {
                    id: 301,
                    name: "Walk together and listen", 
                    duration: 10, 
                    frequency: 1
                },
            ]
        },
        {
            id: 4,
            name: "Engineer",
            color: "#0000FF",
            habits: [
                {
                    id: 401,
                    name: "Build something, no matter how small", 
                    duration: 30, 
                    frequency: 1
                },
            ]
        },
    ]

    return (
        <OnboardingContext.Provider value={{ 
            name, 
            setName,
            identity,
            setIdentity,
            stateValue,
            setStateValue,
            habit,
            addHabit,
            suggestedIdentities,
            }}>
            {children}
        </OnboardingContext.Provider>   
    );
};

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
};
