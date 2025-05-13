import axios from 'axios';
import { getAuthService } from '../services/auth';
import { useAuth0 } from '@auth0/auth0-react';


const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://voyagr.me' : 'http://localhost:3001';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
  // Remove withCredentials: true as it's for cookie-based auth
});

// Add a request interceptor to automatically add the token to every request
api.interceptors.request.use(
  async (config) => {
    // Get the token from wherever you're storing it
    const authService = getAuthService();

    const token = await authService.getToken();
    
    if (token) {
      // Add the token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to automatically refresh the token if it's expired
// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is an auth error (expired token)
    const isAuthError = 
      error.response?.status === 401 || 
      error.response?.data?.error?.includes('exp claim timestamp check failed') ||
      error.response?.data?.message?.includes('exp claim timestamp check failed');
    
    if (isAuthError) {
      console.log('Token expired, logging out user');
      
      // Clear auth data
      const authService = getAuthService();
      authService.removeToken();
      
      logout({ 
        logoutParams: {
          returnTo: window.location.origin 
        }
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;