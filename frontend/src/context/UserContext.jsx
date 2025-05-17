import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../config/api';
import { useAuth0 } from "@auth0/auth0-react";

const UserContext = createContext(null);

// Onboarding binary helper constants and functions
const ONBOARDING_PAGES = {
  PAGE_1: 1,  // 0001 - ValueList onboarding
  PAGE_2: 2,  // 0010 - Second onboarding
  PAGE_3: 4,  // 0100 - Third onboarding
  PAGE_4: 8   // 1000 - Fourth onboarding
};

const onboardingHelpers = {
  // Check if a specific page is completed
  isPageCompleted: (onboardingBits, pageNumber) => {
    const pageBit = ONBOARDING_PAGES[`PAGE_${pageNumber}`];
    return (onboardingBits & pageBit) !== 0;
  },

  // Mark a page as completed
  markPageCompleted: (onboardingBits, pageNumber) => {
    const pageBit = ONBOARDING_PAGES[`PAGE_${pageNumber}`];
    return onboardingBits | pageBit;
  },

  // Mark a page as incomplete
  markPageIncomplete: (onboardingBits, pageNumber) => {
    const pageBit = ONBOARDING_PAGES[`PAGE_${pageNumber}`];
    return onboardingBits & ~pageBit;
  },

  // Check if all pages are completed
  allPagesCompleted: (onboardingBits) => {
    const ALL_PAGES = 15; // 1111 in binary
    return (onboardingBits & ALL_PAGES) === ALL_PAGES;
  },

  // Get array of completed page numbers
  getCompletedPages: (onboardingBits) => {
    const completed = [];
    for (let i = 1; i <= 4; i++) {
      if (onboardingHelpers.isPageCompleted(onboardingBits, i)) {
        completed.push(i);
      }
    }
    return completed;
  },

  // Get count of completed pages
  getCompletedCount: (onboardingBits) => {
    let count = 0;
    for (let i = 1; i <= 4; i++) {
      if (onboardingHelpers.isPageCompleted(onboardingBits, i)) {
        count++;
      }
    }
    return count;
  },

  // Convert binary to readable string (for debugging)
  toBinaryString: (onboardingBits) => {
    return onboardingBits.toString(2).padStart(4, '0');
  }
};

export const UserProvider = ({ children }) => {
  const { isAuthenticated, isLoading, user: auth0User } = useAuth0();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [valueListStep, setValueListStep] = useState(1);

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
      
      const response = await api.put('/api/users/me', userData);
      
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

  // Onboarding helper methods
  const isOnboardingPageCompleted = useCallback((pageNumber) => {
    if (!user || user.onboarding_completed === undefined) return false;
    return onboardingHelpers.isPageCompleted(user.onboarding_completed, pageNumber);
  }, [user]);

  const markOnboardingPageCompleted = useCallback(async (pageNumber) => {
    if (!user) throw new Error('User not loaded');
    
    const currentOnboarding = user.onboarding_completed || 0;
    const newOnboarding = onboardingHelpers.markPageCompleted(currentOnboarding, pageNumber);
    
    // Only update if the page wasn't already completed
    if (newOnboarding !== currentOnboarding) {
      return await updateUser({
        onboarding_completed: newOnboarding
      });
    }
    
    return user;
  }, [user, updateUser]);

  const markOnboardingPageIncomplete = useCallback(async (pageNumber) => {
    if (!user) throw new Error('User not loaded');
    
    const currentOnboarding = user.onboarding_completed || 0;
    const newOnboarding = onboardingHelpers.markPageIncomplete(currentOnboarding, pageNumber);
    
    return await updateUser({
      onboarding_completed: newOnboarding
    });
  }, [user, updateUser]);

  const isAllOnboardingCompleted = useCallback(() => {
    if (!user || user.onboarding_completed === undefined) return false;
    return onboardingHelpers.allPagesCompleted(user.onboarding_completed);
  }, [user]);

  const getCompletedOnboardingPages = useCallback(() => {
    if (!user || user.onboarding_completed === undefined) return [];
    return onboardingHelpers.getCompletedPages(user.onboarding_completed);
  }, [user]);

  const getOnboardingCompletedCount = useCallback(() => {
    if (!user || user.onboarding_completed === undefined) return 0;
    return onboardingHelpers.getCompletedCount(user.onboarding_completed);
  }, [user]);

  const getOnboardingBinaryString = useCallback(() => {
    if (!user || user.onboarding_completed === undefined) return '0000';
    return onboardingHelpers.toBinaryString(user.onboarding_completed);
  }, [user]);

  const value = {
    user,
    loading,
    error,
    fetchUser,
    updateUser,
    getUserPreference,
    updateUserPreference,
    auth0User, // Also include Auth0 user data for reference
    isAuthenticated,
    valueListStep,
    setValueListStep,
    // Onboarding methods
    isOnboardingPageCompleted,
    markOnboardingPageCompleted,
    markOnboardingPageIncomplete,
    isAllOnboardingCompleted,
    getCompletedOnboardingPages,
    getOnboardingCompletedCount,
    getOnboardingBinaryString,
    // Constants for reference
    ONBOARDING_PAGES
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