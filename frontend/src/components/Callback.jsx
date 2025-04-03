// src/components/Callback.jsx
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../config/api';

function Callback() {
  const { isAuthenticated, user, isLoading: auth0Loading } = useAuth0();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Authenticating...');

  useEffect(() => {
    const setupUser = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setStatus('Creating user account...');
        // Create/update user in your backend
        await axios.post(`${api.endpoints.users}/auth0`, user, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        });
        
        setStatus('Redirecting to home...');
        navigate('/');
      } catch (error) {
        console.error('Error setting up user:', error);
        setStatus('Error setting up account. Please try again.');
      }
    };

    setupUser();
  }, [isAuthenticated, user, navigate]);

  if (auth0Loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4">Authenticating with Auth0...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="mt-4">{status}</p>
      </div>
    </div>
  );
}

export default Callback;