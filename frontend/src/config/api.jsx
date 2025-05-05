import axios from 'axios';
import { getAuthService } from '../services/auth';

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

export default api;