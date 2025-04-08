// src/components/Callback.jsx
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { api } from '../config/api';

function Callback() {
  const { 
    isAuthenticated, 
    user, 
    isLoading: auth0Loading,
    getAccessTokenSilently 
  } = useAuth0();  
  const navigate = useNavigate();
  const [status, setStatus] = useState('Authenticating...');
  
  useEffect(() => {
    let mounted = true;

    const setupUser = async () => {
      try {
        if (!mounted) return;
        setStatus('Getting access token...');
        
        // Get the access token from Auth0
        const accessToken = await getAccessTokenSilently();

        setStatus('Creating user account...');
        
        // Send the access token to backend
        const response = await axios.post(`${api.endpoints.users}/auth0`, 
          {}, // No need to send code anymore
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            withCredentials: true
          }
        );

        if (!mounted) return;
        
        setStatus('Redirecting to home...');
        navigate('/');
      } catch (error) {
        if (!mounted) return;
        console.error('Error setting up user:', error);
        setStatus('Error setting up account. Please try again.');
      }
    };

    // Only run setup if we're authenticated
    if (isAuthenticated && !auth0Loading) {
      setupUser();
    }

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, auth0Loading, getAccessTokenSilently, navigate]);

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