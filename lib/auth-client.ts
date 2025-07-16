/**
 * Client-side authentication utilities
 */

export const AuthClient = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token);
      // Also set a flag that token was just set
      sessionStorage.setItem('auth-token-set', 'true');
    }
  },

  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token');
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      sessionStorage.removeItem('auth-token-set');
    }
  },

  isTokenFresh: () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('auth-token-set') === 'true';
    }
    return false;
  },

  clearTokenFresh: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('auth-token-set');
    }
  },

  authenticatedFetch: async (url: string, options: RequestInit = {}) => {
    const token = AuthClient.getToken();
    
    if (!token) {
      throw new Error('No authentication token available');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 401) {
      // Token is invalid, remove it
      AuthClient.removeToken();
      throw new Error('Authentication token is invalid');
    }

    return response;
  },

  checkAuthStatus: async () => {
    try {
      const response = await AuthClient.authenticatedFetch('/api/auth/me');
      
      if (response.ok) {
        const userData = await response.json();
        return userData;
      }
      
      return null;
    } catch (error) {
      console.error('Auth status check failed:', error);
      return null;
    }
  }
};