// src/services/auth/index.js
import { AuthService } from './authService';
import { WebAuthService } from './webAuthService';
import { ElectronAuthAdapter } from './electronAuthAdapter';

// Detect if we're in Electron
export function isElectron() {
  return typeof window !== 'undefined' && !!window.electronAPI;
}

// Factory function to get the appropriate implementation
export function getAuthService() {
  if (isElectron()) {
    return new ElectronAuthAdapter();
  } else {
    return new WebAuthService();
  }
}