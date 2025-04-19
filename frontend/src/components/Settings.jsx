import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import {api } from '../config/api';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, logout } = useAuth0();
  const [showModal, setShowModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

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

  const deleteAccount = async () => {
    
    try {
      await axios.delete(`${api.endpoints.users}/delete`, { withCredentials: true });
    } catch (error) {
      console.error('Delete account error:', error);
    }
  };



  function handleConfirmDelete() { 
    const navigate = useNavigate();
    navigate('/');
    deleteAccount();
  };

  return (
    <>
    <div className="m-10">
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
    </div>
    <div className="flex flex-col m-10 justify-between h-full">
    <ul tabIndex={0} className="menu menu-sm bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow"> 
      <li> <Link to="/history"> History </Link> </li> 
      <li> <button onClick={handleLogout} > Logout </button> </li> 
    </ul> 
      <div className="flex flex-col gap-2 border-2 border-red-500 border-dashed rounded-lg p-4"> 
        <h1 className="text-2xl font-bold">Danger Zone</h1> 
        <p>This action is irreversible. All your data will be lost. You will be asked to confirm this action.</p>
        <button className="btn btn-warning" onClick={()=>document.getElementById('my_modal_5').showModal()}>Delete Account</button>
      </div>
    </div>

    {showModal && (
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Deleting Account</h3>
            <p className="py-4">This action is irreversible.</p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
                <button className="btn btn-error" onClick={handleConfirmDelete}>Yes I'm sure</button>
              </form>
            </div>
          </div>
        </dialog>
    )}
    </>
  );
};

export default Settings;