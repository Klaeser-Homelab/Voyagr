// src/context/SessionContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import api  from '../config/api';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  // Initialize sessionReady from localStorage if available
  const [sessionReady, setSessionReady] = useState(() => {
    const savedSession = localStorage.getItem('sessionEstablished');
    return savedSession === 'true';
  });
  
  const [checkingSession, setCheckingSession] = useState(false);
  const [autoCheck, setAutoCheck] = useState(false);
  const { isAuthenticated, isLoading } = useAuth0();

  const checkInitialSession = async () => {
    try {
      setCheckingSession(true);
      /*
      console.log('Performing initial session check');
      const response = await axios.get(`${api.endpoints.users}/session-check`, {
        withCredentials: true
      });
      console.log('alive');
      const isValid = response.data.valid === true || response.data.authenticated === true;
      
      if (isValid) {
        console.log('Initial session check: session is valid');
        setSessionReady(true);
        setAutoCheck(true);
        // Update localStorage for consistency
        localStorage.setItem('sessionEstablished', 'true');
      } else if (!isValid && sessionReady) {
        console.log('Initial session check: session is invalid');
        setSessionReady(false);
        localStorage.removeItem('sessionEstablished');
      }
        */
    } catch (error) {
      console.error('Initial session check failed:', error);
      if (sessionReady) {
        setSessionReady(false);
        localStorage.removeItem('sessionEstablished');
      }
    } finally {
      setCheckingSession(false);
    }
      
  };
  
  // Check session status immediately on mount if authenticated
  useEffect(() => {
    /*
    if (isAuthenticated && !isLoading && !checkingSession) {
      console.log('isAuthenticated', isAuthenticated);
      console.log('isLoading', isLoading);
      console.log('checkingSession', checkingSession);
      checkInitialSession();
    }
    */
  }, [isAuthenticated, isLoading]);
  
  // Check session status periodically when authenticated AND autoCheck is true
 // Inside SessionProvider
useEffect(() => {
     /*
    let intervalId = null;
    
    const verifySession = async () => {
      if (!isAuthenticated || checkingSession || !autoCheck) return;
      
      try {
        setCheckingSession(true);
        const response = await axios.get(`${api.endpoints.users}/session-check`, {
          withCredentials: true
        });
        
        const isValid = response.data.valid === true || response.data.authenticated === true;
        
        if (isValid && !sessionReady) {
          console.log('Session is valid, setting sessionReady to true');
          setSessionReady(true);
          localStorage.setItem('sessionEstablished', 'true');
          
          // Clear the interval when session is valid
          if (intervalId) {
            console.log('Stopping session polling - session is valid');
            clearInterval(intervalId);
            intervalId = null;
          }
        } else if (!isValid && sessionReady) {
          console.log('Session is no longer valid, setting sessionReady to false');
          setSessionReady(false);
          localStorage.removeItem('sessionEstablished');
        }
      } catch (error) {
        console.error('Session verification error:', error);
        if (sessionReady) {
          setSessionReady(false);
          localStorage.removeItem('sessionEstablished');
        }
      } finally {
        setCheckingSession(false);
      }
        
};
    
    // Only set up polling if needed
    if (isAuthenticated && !isLoading && autoCheck && !sessionReady) {
      console.log('Starting session polling');
      // Check immediately first
      verifySession();
      
      // Then set up interval
      intervalId = setInterval(() => {
        console.log('Polling session status...');
        verifySession();
      }, 5000);
    }
    
    return () => {
      if (intervalId) {
        console.log('Cleaning up interval');
        clearInterval(intervalId);
      }
    };
    */
  }, [isAuthenticated, isLoading, autoCheck, sessionReady, checkingSession]);
  
  // Public method to force session verification
  const verifySessionNow = async () => {
    /*
    if (checkingSession) return false;
    
    try {
      
      setCheckingSession(true);
      const response = await axios.get(`${api.endpoints.users}/session-check`, {
        withCredentials: true
      });
      
      const isValid = response.data.valid === true || response.data.authenticated === true;
      setSessionReady(isValid);
      
      if (isValid) {
        localStorage.setItem('sessionEstablished', 'true');
      } else {
        localStorage.removeItem('sessionEstablished');
      }
      
      return isValid;
    } catch (error) {
      console.error('Forced session check failed:', error);
      setSessionReady(false);
      localStorage.removeItem('sessionEstablished');
      return false;
    } finally {
      setCheckingSession(false);
    }
      */
  };
  
  // Inform the context when session is established in Callback
  const setSessionEstablished = (value) => {
    /*
    console.log('Setting session established:', value);
    setSessionReady(value);
    
    if (value === true) {
      localStorage.setItem('sessionEstablished', 'true');
      setAutoCheck(true);
    } else {
      localStorage.removeItem('sessionEstablished');
    }
      */
  };
  
  const value = {
    sessionReady,
    checkingSession,
    verifySessionNow,
    setSessionEstablished,
    setAutoCheck,
    checkInitialSession
  };
  
  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);