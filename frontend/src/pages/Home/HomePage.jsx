import React, { useEffect } from 'react';
import { useValues } from '../../context/ValuesContext';
import ValueList from './Components/ValueList';
import Today from './Components/Today';
import { useTracker } from '../../context/TrackerContext';

function HomePage() {
    const { fetchAll } = useValues();
    const { fetchMonthEvents } = useTracker();
    useEffect(() => {
        fetchAll();
        fetchMonthEvents();
    }, []);

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
      </div>
    );
}

export default HomePage;