import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

// Contexts
import { TimerProvider } from './context/TimerContext';
import { EventProvider } from './context/EventContext';
import { BreaksProvider } from './context/BreaksContext';
import {ValuesProvider } from './context/ValuesContext';
import { TodayProvider } from './context/TodayContext';
import { ThemeProvider } from './context/ThemeContext';
import { OnboardingProvider } from './context/OnboardingContext';
import { SessionProvider } from './context/SessionContext';
// Pages
import HomePage from './pages/Home/HomePage';
import Today from './pages/Home/Components/Today';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/Profile/ProfilePage';
import VoyagePage from './pages/VoyagePage';
import WelcomePage from './pages/Welcome/WelcomePage';
import Callback from './components/Callback';
import HowItsMade from './pages/Welcome/HowItsMade';
import Menu from './components/Menu';
import Settings from './components/Settings';
import ChapterOne from './pages/Onboarding/ChapterOne';
import QuickStart from './pages/Profile/QuickStart';
import Page1 from './pages/Onboarding/Components/Page1';
import Page2 from './pages/Onboarding/Components/Page2';
import Page3 from './pages/Onboarding/Components/Page3';
import Page4 from './pages/Onboarding/Components/Page4';
import Page5 from './pages/Onboarding/Components/Page5';
import Page6 from './pages/Onboarding/Components/Page6';
import QuickStartHabits from './pages/Profile/Components/QuickStartHabits';
import QuickStartLogin from './pages/Profile/Components/QuickStartLogin';
import Tracker from './pages/Home/Components/Tracker';

function AuthenticatedLayout() {
  return (
    <div className="flex flex-col h-screen lg:m-20 max-w-screen-2xl">
      <Menu />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/today" element={<Today />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/voyage" element={<VoyagePage />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/*" element={<Navigate to="/home" />} />
      </Routes>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [tokenReady, setTokenReady] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    // Only attempt to get the token if we're authenticated
    if (isAuthenticated && !isLoading) {
      setIsCheckingToken(true);
      
      // Pre-fetch token to ensure it's available before rendering protected content
      getAccessTokenSilently()
        .then(() => {
          console.log("Token successfully retrieved");
          setTokenReady(true);
        })
        .catch(error => {
          console.error("Failed to retrieve token:", error);
          // You could add retry logic here
        })
        .finally(() => {
          setIsCheckingToken(false);
        });
    } else if (!isLoading) {
      // If we're not authenticated and not loading, no need to check for token
      setIsCheckingToken(false);
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  // Show loading state while auth is loading or while we're verifying token
  if (isLoading || (isAuthenticated && isCheckingToken)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4">Preparing your experience...</p>
        </div>
      </div>
    );
  }

  // Not authenticated, show welcome page
  if (!isAuthenticated) {
    console.log("Not authenticated");
    return <WelcomePage />;
  }
  
  // Not ready with token yet, show loading
  if (!tokenReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4">Setting up your account...</p>
        </div>
      </div>
    );
  }
  
  // We're authenticated and have a token, render children
  return children;
}

function TestCallback() {
  console.log('TestCallback mounted');
  return <div>Test Callback Page</div>;
}

function App() {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/callback`,
        audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`,
        scope: "openid profile email"
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <ThemeProvider>
        <Router>
          <OnboardingProvider>
            <SessionProvider>
          <ValuesProvider>
          <TimerProvider>
          <TodayProvider>
            <BreaksProvider>
              <EventProvider>
              <Routes>
                    {/* Public pages (no menu) */}
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/callback" element={<Callback />} />
                    <Route path="/how-its-made" element={<HowItsMade />} />
                    <Route path="/chapter-one" element={<ChapterOne />} />
                    <Route path="/quick-start" element={<QuickStart />} />
                    <Route path="/quick-start/habits" element={<QuickStartHabits />} />
                    <Route path="/quick-start/login" element={<QuickStartLogin />} />
                    <Route path="/chapter-one/page-1" element={<Page1 />} />
                    <Route path="/chapter-one/page-2" element={<Page2 />} />
                    <Route path="/chapter-one/page-3" element={<Page3 />} />
                    <Route path="/chapter-one/page-4" element={<Page4 />} />
                    <Route path="/chapter-one/page-5" element={<Page5 />} />
                    <Route path="/chapter-one/page-6" element={<Page6 />} />
                    {/* Authenticated layout (with menu) */}
                    <Route path="/*" element={
                      <ProtectedRoute>
                        <AuthenticatedLayout />
                      </ProtectedRoute>
                    } />
                  </Routes>
              </EventProvider>
              </BreaksProvider>
            </TodayProvider>
          </TimerProvider>
          </ValuesProvider>
          </SessionProvider>
          </OnboardingProvider>
        </Router>
      </ThemeProvider>
    </Auth0Provider>
  );
}

export default App; 