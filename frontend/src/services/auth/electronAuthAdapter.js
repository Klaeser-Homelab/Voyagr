// src/services/auth/electronAuthAdapter.js
import { AuthService } from './authService';

export class ElectronAuthAdapter extends AuthService {
  async getToken() {
    if (window.electronAPI) {
      return await window.electronAPI.getAuthToken();
    }
    return null;
  }
  
  async setToken(token) {
    if (window.electronAPI) {
      return await window.electronAPI.setAuthToken(token);
    }
    return false;
  }
  
  async removeToken() {
    if (window.electronAPI) {
      return await window.electronAPI.removeAuthToken();
    }
    return false;
  }
}