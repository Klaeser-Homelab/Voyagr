import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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
  const [activeInput, setActiveInput] = useState(null);
  const [activeValue, setActiveValue] = useState(null);
  const [isActiveEvent, setIsActiveEvent] = useState(false);
  const [filterValue, setFilterValue] = useState(null);
  const [values, setValues] = useState([]);

  // Debug activeInput changes
  useEffect(() => {
    console.debug('activeInput:', activeInput?.Name || 'none');
  }, [activeInput]);

  // Debug activeValue changes
  useEffect(() => {
    console.debug('activeValue:', activeValue?.Name || 'none');
  }, [activeValue]);

  // Update activeValue when activeInput changes
  useEffect(() => {
    if (activeInput) {
      setActiveValue(activeInput.Value);
    }
  }, [activeInput]);

  const handleValueSelect = (value) => {
    console.debug('handleValueSelect:', value);
    setActiveValue(value);
    setFilterValue(value);
    if (!value) {
        setActiveInput(null); // Clear input selection when deselecting value
    }
  };

  const handleInputSelect = (input) => {
    console.debug('handleInputSelect:', input);
    setActiveInput(input);
    // The existing useEffect will handle updating activeValue
  };

  const handleFilterChange = (value) => {
    setFilterValue(value);
  };

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
          <ValueList 
            onValueSelect={handleValueSelect} 
            onInputSelect={handleInputSelect}
            activeValue={activeValue}
            activeInput={activeInput}
          />
          
          <main className="flex-1 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-4">
                <Pomodoro 
                  activeInput={activeInput} 
                  activeValue={activeValue}
                  isActiveEvent={isActiveEvent}
                  setIsActiveEvent={setIsActiveEvent}
                />
                <EventQueue />
                {(activeValue || activeInput) && (
                  <TodoForm 
                    values={values} 
                    onTodoAdded={() => {
                      fetchValues();
                    }}
                    activeValue={activeValue}
                    activeInput={activeInput}
                  />
                )}
                <TodoList 
                  activeValue={activeValue}
                  activeInput={activeInput}
                />
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
      <Header />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/values" element={<ValuesPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App; 