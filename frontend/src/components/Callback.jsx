// src/components/Callback.jsx
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { api } from '../config/api';
import { useOnboarding } from '../context/OnboardingContext';
import { Base64 } from 'js-base64';
import { useSession } from '../context/SessionContext';



function Callback() {
  console.log('Callback');
  const { 
    isAuthenticated, 
    user, 
    isLoading: auth0Loading,
    getAccessTokenSilently, handleRedirectCallback 
  } = useAuth0();  
  const navigate = useNavigate();
  const [status, setStatus] = useState('Authenticating...');
  const [appState, setAppState] = useState(null);
  const [onboardingStateChecked, setOnboardingStateChecked] = useState(false);
  const { setSessionEstablished } = useSession();

  // Helper function to check session
function isElectron() {
  return typeof window !== 'undefined' && !!window.electronAPI;
}

  useEffect(() => {
    async function getOnboardingState() {
      try {
          const urlParams = new URLSearchParams(window.location.search);
          const codeParam = urlParams.get('code');

          // Check if this is a callback with code but potentially no state
          if (codeParam && !urlParams.get('state')) {
            console.log('Auth code present but no state, skipping handleRedirectCallback');
            console.log('isAuthenticated', isAuthenticated);
            console.log('auth0Loading', auth0Loading);
            // Skip handleRedirectCallback and proceed with empty state
            setStatus('Authentication code received, continuing...');
            setOnboardingStateChecked(true);
            return;
          }
          else if (codeParam && urlParams.get('state')) {
            // This will return your original state object
            console.log('code and state found in callback');
            const result = await handleRedirectCallback();
            console.log('Original state:', result.appState);
            setAppState(result.appState);
            setStatus('Onboarding state received.');
            setOnboardingStateChecked(true);
            return; 
          }
          else {
            console.log('no code or state found in callback');
            setStatus('No code or state found in callback');
            setOnboardingStateChecked(true);
            return;
          }
        // Your state key should be in result.appState
      } catch (error) {
        console.error('Error handling callback:', error);
      }
    }
    
    getOnboardingState();
  }, []);

  
  useEffect(() => {

    let mounted = true;

    const setupUser = async () => {
      try {
        if (!mounted) return;
        setStatus('Verifying access token...'); // getting access token

        // Add a small delay to ensure Auth0 is fully initialized
        await new Promise(resolve => setTimeout(resolve, 300));

        if (!mounted) return;
        
        // Get the access token from Auth0
        const accessToken = await getAccessTokenSilently();

        setStatus('Configuring user...');
        
        // Step 1: Send the access token to backend to establish session
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

        // Get the Set-Cookie header
        console.log('about to store session cookie');
        if (isElectron() && window.electronAPI) {
          console.log('Response', response);
            const setCookieHeader = response.headers['set-cookie'];
            console.log('setCookieHeader', setCookieHeader);
            if (setCookieHeader && setCookieHeader.length > 0) {
              // Find the connect.sid cookie
              const sessionCookie = setCookieHeader.find(cookie => cookie.startsWith('connect.sid='));
              console.log('sessionCookie', sessionCookie);
              if (sessionCookie) {
                // Store the full cookie string
                await window.electronAPI.storeSessionCookie(sessionCookie);
              }
            }
        }

        if (!mounted) return;

        setStatus('Redirecting to home...');
        if(appState && appState.isNewUser) {
          const params = new URLSearchParams({
            value_name: appState.identity.name,
            value_color: appState.identity.color,
          habit_name: appState.habit.name,
          habit_duration: appState.habit.duration.toString(),
          user_id: response.data.user.id.toString(),
          });
          navigate(`/init?${params.toString()}`);
        } else {
          navigate('/home');
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Error setting up user:', error);
        setStatus('Error setting up account. Please try again.');
        // Clear session flag in case of error
        localStorage.removeItem('sessionEstablished');
      }
    };

    // Only run setup if we're authenticated
    if (isAuthenticated && !auth0Loading && onboardingStateChecked) {
      console.log('Setting up user...');
      setupUser();
    }

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, auth0Loading, onboardingStateChecked]);

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