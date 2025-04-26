import React, { useState, useEffect } from 'react';

const Tracker = () => {
    const [daysInMonth, setDaysInMonth] = useState(0);
    const [currentDate, setCurrentDate] = useState(new Date());
    
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

    return (
        <div className="bg-gray-900 text-white">
            <h1 className="text-3xl mb-5">Overview</h1>
            <div className="flex flex-col">
                {/* Generate 15 vertical rows with days as columns */}
                {Array(15).fill().map((_, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="flex">
                        {Array(daysInMonth).fill().map((_, colIndex) => {
                            const isCurrentDayColumn = isCurrentMonth && colIndex + 1 === currentDay;
                            const isFirstCell = isCurrentDayColumn && rowIndex === 0;
                            
                            // Apply special border classes for current day column
                            let borderClasses = "border border-gray-600";
                            if (isCurrentDayColumn) {
                                borderClasses = "border-t border-b border-gray-600 border-l border-r border-gray-400";
                            }
                            
                            return (
                                <div 
                                    key={`cell-${rowIndex}-${colIndex}`} 
                                    className={`w-8 h-8 ${borderClasses} ${
                                        isFirstCell ? 'bg-green-500' : 'bg-gray-700'
                                    }`}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tracker;