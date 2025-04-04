import { Link } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import ChooseTheme from './ChooseTheme';
import { useTheme } from '../context/ThemeContext';
import { useAuth0 } from '@auth0/auth0-react';
import { api } from '../config/api';
import axios from 'axios';

const Header = () => {
  const { getCurrentTheme } = useTheme();
  const currentTheme = getCurrentTheme();
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

  const handleLogout = async () => {
    try {
      // First, log out from our backend to destroy the session
      await axios.post(`${api.endpoints.users}/logout`, {}, { withCredentials: true });
      console.log('Backend logout successful');
      
      // Then, log out from Auth0
      logout({ 
        logoutParams: {
          returnTo: window.location.origin 
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Still try to logout from Auth0 even if backend logout fails
      logout({ 
        logoutParams: {
          returnTo: window.location.origin 
        }
      });
    }
  };
  
  return (
    <header className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          <img 
            src={`${currentTheme.image}`}
            alt="Logo" 
            className="w-10 h-10 object-cover rounded-full" 
          />
          Journey
        </Link>
      </div>
      <div className="flex gap-2">
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                {user?.picture ? (
                  <img
                    alt="User avatar"
                    src={user.picture}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="w-10 h-10" />
                )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li>
                <Link to="/profile">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/journey">
                  Change Journey
                </Link>
              </li>
              <li>
                <Link to="/history">
                  History
                </Link>
              </li>
              <li>
                <Link to="/avatar">
                  Avatar
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-base-300"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
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
        )}
      </div>
    </header>
  );
};

export default Header;