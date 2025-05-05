// src/services/auth/authService.js
export class AuthService {
    async getToken() { throw new Error('Not implemented'); }
    async setToken(token) { throw new Error('Not implemented'); }
    async removeToken() { throw new Error('Not implemented'); }
    
    // Helper to add token to requests
    async authorizeRequest(config) {
      const token = await this.getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`
        };
      }
      return config;
    }
  }