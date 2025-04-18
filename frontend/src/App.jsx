import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

import { TimerProvider } from './context/TimerContext';
import { EventProvider } from './context/EventContext';
import HomePage from './pages/HomePage';
import Today from './components/Today';
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

function AuthenticatedLayout() {
  return (
    <div className="flex flex-col h-screen lg:flex-row justify-between">
      <Menu />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/today" element={<Today />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/voyage" element={<VoyagePage />} />
        <Route path="/*" element={<Navigate to="/home" />} />
      </Routes>
    </div>
  );
}

// Route guard component
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (!isAuthenticated) {
    console.log("Not authenticated");
    return <WelcomePage />;
  }
  
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
        redirect_uri: `${window.location.origin}/test-callback`,
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
              <Routes>
                    {/* Public pages (no menu) */}
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/auth/*" element={
                      <div>
                        <h1>Auth route caught</h1>
                        <p>Path: {window.location.pathname}</p>
                        <p>Query: {window.location.search}</p>
                      </div>
                    } />
                    <Route path="/auth/callback" element={<TestCallback />} />
                    <Route path="/how-its-made" element={<HowItsMade />} />

                    {/* Authenticated layout (with menu) */}
                    <Route path="/*" element={
                      <ProtectedRoute>
                        <AuthenticatedLayout />
                      </ProtectedRoute>
                    } />
                  </Routes>
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