// src/components/Callback.jsx
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { api } from '../config/api';
import { useOnboarding } from '../context/OnboardingContext';
import { Base64 } from 'js-base64';
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


  useEffect(() => {
    async function getOnboardingState() {
      try {
        // This will return your original state object
        const result = await handleRedirectCallback();
        console.log('Original state:', result.appState);

          setAppState(result.appState);
          setStatus('Onboarding state received.');
          setOnboardingStateChecked(true);

        
        
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
        
        // Get the access token from Auth0
        const accessToken = await getAccessTokenSilently();

        setStatus('Configuring user...');
        
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

        // Check if the user is new
        const isNewUser = response.data.isNewUser; // Assuming response contains this info

        if (isNewUser) {
          setStatus('Setting up defaults...');

          await axios.post(api.endpoints.breaks + '/init', { id: response.data.user.id});
          
          setStatus('Defaults set up successfully.');

          console.log('appState', appState);

          if(appState) {
            await axios.post(api.endpoints.values + '/init', 
              { 
                user_id: response.data.user.id,
                name: appState.identity.name,
                color: appState.identity.color,
                habit_name: appState.habit.name,
                habit_duration: appState.habit.duration
          });
          }
        }

        

        if (!mounted) return;
        
        setStatus('Redirecting to home...');
        navigate('/home');
      } catch (error) {
        if (!mounted) return;
        console.error('Error setting up user:', error);
        setStatus('Error setting up account. Please try again.');
      }
    };

    // Only run setup if we're authenticated
    if (isAuthenticated && !auth0Loading && onboardingStateChecked) {
      setupUser();
    }

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, auth0Loading, appState]);

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