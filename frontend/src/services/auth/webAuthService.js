// src/services/auth/webAuthService.js
import { AuthService } from './authService';

export class WebAuthService extends AuthService {
  // In-memory storage for web
  #token = null;
  
  async getToken() {
    return localStorage.getItem('auth_token');
  }
  
  async setToken(token) {
    localStorage.setItem('auth_token', token);
    return true;
  }
  
  async removeToken() {
    localStorage.removeItem('auth_token');
    return true;
  }
}