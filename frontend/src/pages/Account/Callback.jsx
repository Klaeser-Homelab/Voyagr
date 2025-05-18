// src/components/Callback.jsx
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import { getAuthService } from '../../services/auth';
import { useUser } from '../../context/UserContext';

function Callback() {
  const { 
    isAuthenticated, 
    isLoading: auth0Loading,
    getAccessTokenSilently, handleRedirectCallback 
  } = useAuth0();  
  const navigate = useNavigate();
  const [status, setStatus] = useState('Authenticating...');
  const [appState, setAppState] = useState(null);
  const [onboardingStateChecked, setOnboardingStateChecked] = useState(false);
  const { fetchUser,  } = useUser();


  useEffect(() => {
    async function getOnboardingState() {
      try {
          const urlParams = new URLSearchParams(window.location.search);
          const codeParam = urlParams.get('code');

          console.log(urlParams);

          // Auth code present but no state, skipping handleRedirectCallback
          if (codeParam && !urlParams.get('state')) {
            console.log('code present but no state');
            // Skip handleRedirectCallback and proceed with empty state
            setStatus('Authentication code received, continuing...');
            setOnboardingStateChecked(true);
            return;
          }
          // code and state found in callback
          else if (codeParam && urlParams.get('state')) {
            console.log('code and state found in callback');
            // This will return your original state object
            const result = await handleRedirectCallback();
            console.log('result', result);
            setAppState(result.appState);
            setStatus('Onboarding state received.');
            setOnboardingStateChecked(true);
            return; 
          }
          // no code or state found in callback'
          else {
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

        console.log('1');

        // Add a small delay to ensure Auth0 is fully initialized
        await new Promise(resolve => setTimeout(resolve, 300));

        console.log('2');

        if (!mounted) return;

        console.log('3');
        
        // Get and set auth token from Auth0
        setStatus('Verifying access...'); // getting access token
        const accessToken = await getAccessTokenSilently();
        const authService = getAuthService();
        await authService.setToken(accessToken);

        console.log('4');

        // Set user in backend
        setStatus('Configuring user...');
        await api.post('/api/users/auth0');

        console.log('5');

        if (!mounted) return;

        console.log('6');

        console.log('appState', appState);

        // Initialize user from onboarding state
        setStatus('Initializing...');
        if(appState && appState.identity) {
          console.log('initing user');
            await api.post('/api/values/init', {
             value_name: appState.identity.name,
              value_color: appState.identity.color,
              habit_name: appState.habit.name,
              habit_duration: appState.habit.duration,
            });
          }

        console.log('7');

        //await fetchUser();
       
        navigate('/home');
        
      } catch (error) {
        if (!mounted) return;
        console.error('Error setting up user:', error);
        setStatus('Error setting up account. Please try again.');
      }
    };

    // Only run setup if we're authenticated
    if (isAuthenticated && !auth0Loading && onboardingStateChecked) {
      console.log('setting up user');
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