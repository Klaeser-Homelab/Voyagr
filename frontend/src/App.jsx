import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

import { TimerProvider } from './context/TimerContext';
import { SelectionProvider, useSelection } from './context/SelectionContext';
import Today from './components/Today';
import ValueList from './components/ValueList';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import VoyagePage from './pages/VoyagePage';
import Header from './components/Header';
import { TodayProvider } from './context/TodayContext';
import { ThemeProvider } from './context/ThemeContext';
import WelcomePage from './pages/WelcomePage';
import Callback from './components/Callback';

function AppContent() {
  const [values, setValues] = useState([]);
  const { activeInput, activeValue, handleValueSelect, handleInputSelect } = useSelection();
  const { isAuthenticated, isLoading } = useAuth0();

  const fetchValues = async () => {
    try {
      const response = await fetch('/api/values');
      const data = await response.json();
      setValues(data);
    } catch (error) {
      console.error('Error fetching values:', error);
    }
  };

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
    <div className="min-h-screen bg-base-200">
      <div className="drawer lg:drawer-open">
        <input id="main-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <ValueList />
          <div className="flex-1 p-4 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"></div>
            <Today />
          </div>
        </div>
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
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Auth0Provider
    domain="dev-m0q23jbgtbwidn00.us.auth0.com"
    clientId="jJhP7FGnwad8ibaRpnhOjdHqJ69eilVn"
    authorizationParams={{
      redirect_uri: "http://localhost:3000/auth/callback",
      audience: "https://dev-m0q23jbgtbwidn00.us.auth0.com/api/v2/",
      scope: "openid profile email"
    }}
    cacheLocation="localstorage"
    useRefreshTokens={true}
    >
    <ThemeProvider>
      <Router>
          <TimerProvider>
            <SelectionProvider>
              <TodayProvider>
                <Header />
                <Routes>
                  <Route path="/" element={<AppContent />} />
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
              </TodayProvider>
            </SelectionProvider>
          </TimerProvider>
      </Router>
    </ThemeProvider>
    </Auth0Provider>
  );
}

export default App; 