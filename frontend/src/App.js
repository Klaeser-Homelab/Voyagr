import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import InputList from './components/InputList';
import InputEvents from './components/InputEvents';
import Pomodoro from './components/Pomodoro';
import ValueList from './components/ValueList';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import './App.css';

function AppContent() {
  const { user, loading, login, logout } = useAuth();
  const [activeInput, setActiveInput] = useState(null);
  const [activeValue, setActiveValue] = useState(null);
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
    setActiveValue(value);
    setFilterValue(value);
    setActiveInput(null);
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
      <header className="App-header">
        <h1>Welcome to ManageMe</h1>
        {user ? (
          <div>
            <p>Logged in as {user.displayName}</p>
            <img src={user.avatar} alt="Profile" style={{ width: 50, height: 50, borderRadius: '50%' }} />
            <button onClick={logout} style={{ marginTop: 20 }}>Logout</button>
          </div>
        ) : (
          <button onClick={login}>Login with GitHub</button>
        )}
      </header>
      <main className="main-content">
        <div className="column left-column">
        <TodoForm 
          values={values} 
          onTodoAdded={() => {
            fetchValues();
          }} 
        />
          <TodoList />
        </div>
        <div className="column center-column">
          <Pomodoro 
            activeInput={activeInput} 
            activeValue={activeValue}
          />
          <Routes>
            <Route path="/inputs/:inputId/events" element={<InputEvents />} />
          </Routes>
        </div>
        <div className="column right-column">
          <ValueList 
            onValueSelect={handleValueSelect} 
            activeValue={activeValue}
          />
        </div>
       
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App; 