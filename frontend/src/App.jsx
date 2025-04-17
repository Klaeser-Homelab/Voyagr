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

function Layout() {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <WelcomePage />;
  }

  return (
    <div className="flex flex-col h-screen lg:flex-row justify-between gap-20">
      <Menu />
      <Routes>
        <Route path="/" element={<HomePage />} />
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
  );
}

// Route guard component
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

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
                <Layout />
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