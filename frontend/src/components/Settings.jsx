import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import {api } from '../config/api';


const Settings = () => {
  const { user, logout } = useAuth0();
  const handleLogout = async () => {

    try {
      // First, log out from our backend to destroy the session
      await axios.post(`${api.endpoints.users}/logout`, {}, { withCredentials: true });
      
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
    <div className="flex flex-col gap-2 p-20">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              {user?.picture ? (
                <img
                  alt="User avatar"
                  src={user.picture}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-10 h-10" />
              )}
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li>
                <Link to="/history">
                  History
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
        </div>
  );
};

export default Settings;