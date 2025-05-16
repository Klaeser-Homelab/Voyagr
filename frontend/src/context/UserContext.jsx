import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../config/api';
import { useAuth0 } from "@auth0/auth0-react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const { isAuthenticated, isLoading, user: auth0User } = useAuth0();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data from API
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching user data');
      
      const response = await api.get('/api/users/me');
      
      setUser(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user data
  const updateUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      console.log('Updating user data');
      
      const response = await api.put('/api/user/profile', userData);
      
      setUser(response.data);
      setError(null);
      return response.data;
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('Failed to update user data');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user preferences
  const getUserPreference = (key) => {
    return user?.preferences?.[key] || null;
  };

  // Update specific user preference
  const updateUserPreference = useCallback(async (key, value) => {
    try {
      const updatedPreferences = {
        ...user?.preferences,
        [key]: value
      };
      
      const updatedUser = await updateUser({
        ...user,
        preferences: updatedPreferences
      });
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user preference:', error);
      throw error;
    }
  }, [user, updateUser]);

  const value = {
    user,
    loading,
    error,
    fetchUser,
    updateUser,
    getUserPreference,
    updateUserPreference,
    auth0User, // Also include Auth0 user data for reference
    isAuthenticated
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};