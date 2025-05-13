import React, { useState, useEffect } from 'react';
import { useTracker } from '../../../context/TrackerContext';

const Tracker = () => {
    const [daysInMonth, setDaysInMonth] = useState(0);
    const [currentDate, setCurrentDate] = useState(new Date());
    const { monthData } = useTracker();
    
    useEffect(() => {
        // Get the number of days in the current month
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const lastDay = new Date(year, month + 1, 0).getDate();
        setDaysInMonth(lastDay);
    }, [currentDate]);
    
    // Get current day
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentDate.getMonth() && 
                          today.getFullYear() === currentDate.getFullYear();
    const currentDay = today.getDate();

    // Function to check if a habit was completed on a specific day
    const isHabitCompletedOnDay = (habit, day) => {
        return habit.days.includes(day);
    };

    // Generate an array of day numbers (1-31)
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className="bg-gray-900 text-white p-4 overflow-y-auto">
            <h1 className="text-3xl mb-5">Habit Tracker</h1>
            
            {/* Calendar header with day numbers */}
            <div className="hidden md:flex mb-2">
                <div className="w-48 md:w-64 flex-shrink-0"></div> {/* Empty cell for habit names */}
                {daysArray.map(day => (
                    <div 
                        key={`day-${day}`} 
                        className={`w-8 text-center ${isCurrentMonth && day === currentDay ? 'text-green-400 font-bold' : ''}`}
                    >
                        {day}
                    </div>
                ))}
            </div>
            
            {/* Values and their habits */}
            {monthData && monthData.length > 0 ? (
                monthData.map((value) => (
                    <div key={`value-${value.id}`} className="mb-4">
                        {/* Value header */}
                        <div 
                            className="flex items-center mb-2 py-1 font-bold border-b"
                            style={{ borderColor: value.color }}
                        >
                            <div 
                                className="w-48 md:w-64 flex-shrink-0 truncate pr-2 flex items-center"
                                title={value.description}
                            >
                                <div 
                                    className="w-4 h-4 mr-2 rounded-full" 
                                    style={{ backgroundColor: value.color }}
                                ></div>
                                {value.description}
                            </div>
                            {/* Empty cells for the value row */}
                            <div className="flex-grow"></div>
                        </div>
                        
                        {/* Habits belonging to this value */}
                        {value.habits && value.habits.length > 0 ? (
                            value.habits.map((habit) => (
                                <div key={`habit-${habit.id}`} className="flex items-center mb-1 pl-4">
                                    {/* Habit name */}
                                    <div className="w-44 md:w-60 flex-shrink-0 truncate pr-2" title={habit.description}>
                                        {habit.description}
                                    </div>
                                    
                                    {/* Day cells */}
                                    {daysArray.map(day => {
                                        const isCompleted = isHabitCompletedOnDay(habit, day);
                                        const isToday = isCurrentMonth && day === currentDay;
                                        
                                        // Base classes without color
                                        let cellClasses = "w-8 h-8 border ";
                                        
                                        // Current day highlighting
                                        if (isToday) {
                                            cellClasses += "border-gray-400 ";
                                        } else {
                                            cellClasses += "border-gray-600 ";
                                        }
                                        
                                        // Use the value's color for completed days
                                        const cellStyle = isCompleted 
                                            ? { backgroundColor: value.color } 
                                            : { backgroundColor: '#374151' }; // bg-gray-700 equivalent in hex
                                        
                                        return (
                                            <div 
                                                key={`habit-${habit.id}-day-${day}`} 
                                                className={cellClasses}
                                                style={cellStyle}
                                            />
                                        );
                                    })}
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-400 pl-4">No habits for this value</div>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-gray-400">No data found for this month</div>
            )}
        </div>
    );
};

export default Tracker;