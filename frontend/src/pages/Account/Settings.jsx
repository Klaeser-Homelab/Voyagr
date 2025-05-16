import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import api from '../../config/api';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthService } from '../../services/auth';
import { useDeveloper } from '../../context/DeveloperContext';

const Settings = () => {
  const { user, logout } = useAuth0();
  const [confirmationText, setConfirmationText] = useState('');
  const [accountDeleted, setAccountDeleted] = useState(false); // State for confirmation message
  const { developerMode, setDeveloperMode } = useDeveloper();
  const navigate = useNavigate();

  const handleLogout = async () => {

    try {
      // First, log out from our backend to destroy the session
      await api.post('/api/users/logout');

      const authService = getAuthService();
      await authService.removeToken();
      
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

  const deleteAccount = async () => {
    
    try {
      await api.delete('/api/users/delete');
    } catch (error) {
      console.error('Delete account error:', error);
    }
  };


  async function handleConfirmDelete() {    
    await deleteAccount();  
    setAccountDeleted(true);    
    const authService = getAuthService();
    await authService.removeToken();  
    setTimeout(() => {
        navigate('/'); // Redirect after showing the message
      }, 2000); // Adjust the delay as needed
  };

  return (
    <div className="flex flex-col justify-center p-10 lg:ml-20">
    {/* Centered and larger avatar */}
    <div className="flex justify-center items-center mb-6">
          <div tabIndex={0} className="">
              {user?.picture ? (
                <img
                  alt="User avatar"
                  src={user.picture}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-32 h-32" />
              )}
          </div>
    </div>
    <div className="flex flex-col h-full gap-4">
    
<div className="flex flex-col gap-2 z-1 mt-3 w-full p-2 text-2xl justify-left items-start"> 
  <button 
    onClick={handleLogout}
    className="hover:text-primary transition-colors duration-200 cursor-pointer text-left"
  > 
    Logout 
  </button>
  <button 
    onClick={() => setDeveloperMode(!developerMode)}
    className="hover:text-primary transition-colors duration-200 cursor-pointer text-left"
  > 
    {developerMode ? 'Disable Developer Mode' : 'Enable Developer Mode'} 
  </button>
</div>
      <div className="flex flex-col gap-2 border-2 border-red-500 border-dashed rounded-lg p-4"> 
        <h1 className="text-2xl font-bold">Danger Zone</h1> 
        <p>This action is irreversible. All your data will be lost. You will be asked to confirm this action.</p>
        <button className="btn btn-warning" onClick={()=>document.getElementById('my_modal_5').showModal()}>Delete Account</button>
      </div>
    </div>

      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Deleting Account</h3>
            <p className="py-4">You are permanently deleting your account. This action is irreversible.</p>
            <div className="modal-action">
              <form method="dialog" className="flex flex-col w-full gap-2">
              <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="input input-bordered w-full mt-2"
              placeholder="Type 'delete' to confirm"
            />
            <div className="flex flex-row gap-2">
            <button className="btn btn-primary mt-4">Close</button>
            <button
              className="btn btn-danger mt-4"
              onClick={handleConfirmDelete}
              disabled={confirmationText.toLowerCase() !== 'delete'}
            >
               Confirm Delete
               </button>
                </div>
              </form>
            </div>
          </div>
        </dialog>

        {accountDeleted && (
        <div className="alert alert-success mt-4">
          <p>Your account has been successfully deleted.</p>
        </div>
      )}

    </div>
  );
};

export default Settings;