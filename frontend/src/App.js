import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function AppContent() {
  const { user, loading, login, logout } = useAuth();

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
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App; 