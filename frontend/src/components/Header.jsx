import { Link } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import { useAuth0 } from '@auth0/auth0-react';
import { api } from '../config/api';
import axios from 'axios';
import logo from '../assets/star.png';
const Header = () => {
  const { getCurrentTheme } = useTheme();
  const currentTheme = getCurrentTheme();
  const { loginWithRedirect, user } = useAuth0();

  
  return (
    <header className="navbar shadow-md">
      <div className="flex-1">
        <Link to="/" className="flex items-center text-xl">
          <img 
            src={logo}
            alt="Logo" 
            className="w-10 h-10 object-cover rounded-full" 
          />
          Voyagr
        </Link>
      </div>
      <div className="flex gap-2">
            <button
              onClick={() => loginWithRedirect()}
              className="btn btn-primary"
            >
              Login
            </button>
            <button
              onClick={() => loginWithRedirect({
                authorizationParams: {
                  screen_hint: "signup"
                }
              })}
              className="btn btn-outline btn-primary"
            >
              Sign Up
            </button>
      </div>
    </header>
  );
};

export default Header;