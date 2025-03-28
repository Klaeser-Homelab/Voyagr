import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TimerProvider } from './context/TimerContext';
import { SelectionProvider, useSelection } from './context/SelectionContext';
import InputList from './components/InputList';
import InputEvents from './components/InputEvents';
import Pomodoro from './components/Pomodoro';
import Today from './components/Today';
import ValueList from './components/ValueList';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import HistoryPage from './pages/HistoryPage';
import ValuesPage from './pages/ValuesPage';
import EventQueue from './components/EventQueue';
import Header from './components/Header';

import './App.css';

function AppContent() {
  const { user, loading, login, logout } = useAuth();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="drawer lg:drawer-open">
        <input id="main-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <ValueList />
          <main className="flex-1 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-4">
              </div>
              <div>
                <Today />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <TimerProvider>
          <SelectionProvider>
            <Header />
            <Routes>
              <Route path="/" element={<AppContent />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/values" element={<ValuesPage />} />
            </Routes>
          </SelectionProvider>
        </TimerProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 