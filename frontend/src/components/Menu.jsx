import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Settings from './Settings'; // Use named import




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
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    </Link>
  );

  export const Today = () => (
    <Link to="/today">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 block lg:hidden">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    </Link>
  );

  export const Profile = () => (
    <Link to="/profile">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    </Link>
  );

  export const SettingsButton = () => (
        <Link to="/settings">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
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
    <div className="order-first flex flex-col border-r-2 border-gray-600 justify-between items-center p-5 py-10">
        <div className="flex flex-col gap-5">
            <Home />
            <Today />
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
        <div className="flex flex-row gap-5 justify-between order-last items-center p-5 border-t-2 border-gray-600 rounded-lg">
            <Home />
            <Today />
            <Profile />
            <SettingsButton />
        </div>
    )
}
};

export default Menu;