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
// Pages
import HomePage from './pages/HomePage';
import Today from './components/Today';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import VoyagePage from './pages/VoyagePage';
import WelcomePage from './pages/WelcomePage';
import Callback from './components/Callback';
import HowItsMade from './pages/HowItsMade';
import Menu from './components/Menu';
import Settings from './components/Settings';

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
        redirect_uri: `${window.location.origin}/callback`,
        audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`,
        scope: "openid profile email"
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <ThemeProvider>
        <Router>
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
        </Router>
      </ThemeProvider>
    </Auth0Provider>
  );
}

export default App; 