import { createContext, useContext, useState, useEffect } from 'react';
import space from '../assets/ship.png';
import wagon from '../assets/wagon.png';
import cyberpunk from '../assets/car.png';
import boat from '../assets/boat.png';
import mountain from '../assets/mountain.png';

const themeData = {
  retro: {
    name: 'Travel West on the Oregon Trail',
    image: wagon,
    description: 'The default theme, voyage across the American west',
  },
  dark: {
    name: 'Space',
    image: space,
    description: 'Embark on an interstellar expedition through the cosmos',
  },
  cyberpunk: {
    name: 'Cyberpunk',
    image: cyberpunk,
    description: 'Navigate the neon-lit streets of tomorrow',
  },
  nord: {
    name: 'RSS Discovery voyage to Antarctica',
    image: boat,
    description: 'Brave the frozen wilderness of the southern pole',
  },
  autumn: {
    name: 'Summit Everest',
    image: mountain,
    description: 'Climb to the highest peaks of human achievement',
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('retro');

  useEffect(() => {
    document.querySelector('html').setAttribute('data-theme', theme);
  }, [theme]);

  const getCurrentTheme = () => themeData[theme];
  
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const value = {
    theme,
    themeData,
    getCurrentTheme,
    handleThemeChange
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 