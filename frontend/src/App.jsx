import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

import { TimerProvider } from './context/TimerContext';
import { EventProvider } from './context/EventContext';
import Today from './components/Today';
import ValueList from './components/ValueList';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import VoyagePage from './pages/VoyagePage';
import { TodayProvider } from './context/TodayContext';
import { ThemeProvider } from './context/ThemeContext';
import WelcomePage from './pages/WelcomePage';
import Callback from './components/Callback';
import HowItsMade from './pages/HowItsMade';
import { BreakCycleProvider } from './context/BreakCycleContext';
import Menu from './components/Menu';
import Settings from './components/Settings';

const useIsLarge = () => {
  const [isLarge, setIsLarge] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)'); // Tailwind's 'lg' breakpoint is 1024px

    const handleMediaQueryChange = (event) => {
      setIsLarge(event.matches);
    };

    // Set initial value
    setIsLarge(mediaQuery.matches);

    // Add event listener
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    // Cleanup event listener on component unmount
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  return isLarge;
};


function AppContent() {
  const isLarge = useIsLarge();
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <WelcomePage />;
  }

  return (
        <div className="flex flex-col flex-grow overflow-y-auto h-full lg:flex-row justify-between gap-20">
          <div className="radial-glow"></div>
          <div className="flex-grow flex justify-center w-full">
            <ValueList />
          </div>
          <div className="hidden lg:block w-full max-w-2xl">
            <Today />
          </div>
        </div>
  );
}

// Route guard component
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <WelcomePage />;
  }
  
  return children;
}

function App() {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/auth/callback`,
        audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`,
        scope: "openid profile email"
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <ThemeProvider>
        <Router>
          <TimerProvider>
          <TodayProvider>
            <BreakCycleProvider>
              <EventProvider>
              <div className="flex flex-col h-screen lg:flex-row justify-between gap-20">
              <Menu />
                <Routes>
                  <Route path="/" element={<AppContent />} />
                  <Route path="/welcome" element={<WelcomePage />} />
                  <Route path="/today" element={<Today />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/how-its-made" element={<HowItsMade />} />
                  <Route path="/auth/callback" element={<Callback />} />
                  <Route path="/history" element={
                    <ProtectedRoute>
                      <HistoryPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/voyage" element={
                    <ProtectedRoute>
                      <VoyagePage />
                    </ProtectedRoute>
                  } />
                </Routes>
              </div>
              </EventProvider>
              </BreakCycleProvider>
            </TodayProvider>
          </TimerProvider>
        </Router>
      </ThemeProvider>
    </Auth0Provider>
  );
}

export default App; 