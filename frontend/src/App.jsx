import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

import { TimerProvider } from './context/TimerContext';
import { SelectionProvider, useSelection } from './context/SelectionContext';
import Today from './components/Today';
import ValueList from './components/ValueList';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import JourneyPage from './pages/JourneyPage';
import Header from './components/Header';
import { TodayProvider } from './context/TodayContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Callback from './components/Callback';
function AppContent() {
  const [values, setValues] = useState([]);
  const { activeInput, activeValue, handleValueSelect, handleInputSelect } = useSelection();

  const fetchValues = async () => {
    try {
      const response = await fetch('/api/values');
      const data = await response.json();
      setValues(data);
    } catch (error) {
      console.error('Error fetching values:', error);
    }
  };

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

function App() {
  return (
    <Auth0Provider
    domain="dev-m0q23jbgtbwidn00.us.auth0.com"
    clientId="jJhP7FGnwad8ibaRpnhOjdHqJ69eilVn"
    authorizationParams={{
      redirect_uri: "http://localhost:3000/auth/callback"
    }}
  >
    <ThemeProvider>
      <Router>
          <TimerProvider>
            <SelectionProvider>
              <TodayProvider>
                <Header />
                <Routes>
                  <Route path="/" element={<AppContent />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/auth/callback" element={<Callback />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/journey" element={<JourneyPage />} />
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