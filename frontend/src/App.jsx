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
import History from './components/History';
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
    return <div className="App">Loading...</div>;
  }

  return (
    <div className="App">
      <ValueList 
        onValueSelect={handleValueSelect} 
        onInputSelect={handleInputSelect}
        activeValue={activeValue}
        activeInput={activeInput}
      />
      
      <main className="main-content">
        <div className="column left-column">
          <Pomodoro 
            activeInput={activeInput} 
            activeValue={activeValue}
            isActiveEvent={isActiveEvent}
            setIsActiveEvent={setIsActiveEvent}
          />
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
        <div className="column right-column">
          <Today />
        </div>
      </main>
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
          <Route path="/history" element={<History />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App; 