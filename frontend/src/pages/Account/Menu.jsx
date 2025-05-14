import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Settings from './Settings'; // Use named import
import { ChartBarIcon, Cog6ToothIcon, UserCircleIcon, HomeIcon, CalendarIcon } from '@heroicons/react/24/outline';


const useIsLarge = () => {
    const [isLarge, setIsLarge] = useState(false);
  
    useEffect(() => {
      const mediaQuery = window.matchMedia('(min-width: 1024px)'); // Tailwind's 'lg' breakpoint is 1024px
  
      const handleMediaQueryChange = (event) => {
        setIsLarge(event.matches);
      };
  
      // Set initial value
      setIsLarge(mediaQuery.matches);
  
      // Add event listener
      mediaQuery.addEventListener('change', handleMediaQueryChange);
  
      // Cleanup event listener on component unmount
      return () => {
        mediaQuery.removeEventListener('change', handleMediaQueryChange);
      };
    }, []);
  
    return isLarge;
  };


  export const Home = () => (
    <Link to="/home">
      <HomeIcon className="size-8" />
    </Link>
  );

  export const Today = () => (
    <Link to="/today">
      <CalendarIcon className="size-8" />
    </Link>
  );

  export const Profile = () => (
    <Link to="/profile">
      <UserCircleIcon className="size-8" />
    </Link>
  );

  export const Tracker = () => (
    <Link to="/tracker">
      <ChartBarIcon className="size-8" />
    </Link>
  );

  export const SettingsButton = () => (
        <Link to="/settings">
            <Cog6ToothIcon className="size-8" />
      </Link>
  );

const Menu = ({className}) => {
    const [settings, setSettings] = useState(false);

    const toggleSettings= () => {
        setSettings(!settings);
      };

    const isLarge = useIsLarge();

    if (settings) {
        return (
        <div className="order-first flex flex-col border-2 border-gray-600 rounded-lg justify-between items-center">
         <Settings />
        </div>
    )
}
  
    if (isLarge) {
  return (
    <div className="fixed z-50 left-0 top-0 bottom-0 flex flex-col border-r-2 border-gray-600 justify-between items-center p-10 py-20 h-screen">
    <div className="flex flex-col gap-10">
            <Home />
            <Tracker />
            <Profile />
        </div>
        <div className="">    
            <SettingsButton />
        </div>
    </div>
  )
}
if(!isLarge) {
    return (
      <div className="fixed z-50 bottom-0 left-0 right-0 flex flex-row gap-5 justify-between items-center p-5 border-t-2 border-gray-600 bg-base-100">
            <Home />
            <Today />
            <Tracker />
            <Profile />
            <SettingsButton />
        </div>
    )
}
};

export default Menu;