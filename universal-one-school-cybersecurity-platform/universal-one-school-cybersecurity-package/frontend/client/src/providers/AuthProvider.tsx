import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Define types for our user and auth context
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  clientId: number | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: string;
  clientId?: number;
}

// Create auth context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/me');
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // User is not authenticated
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to check auth status:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      setUser(data.user);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries();
    } catch (err) {
      console.error('Login error:', err);
      setError((err as Error).message || 'Failed to login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Logout failed');
      }
      
      setUser(null);
      
      // Clear cached queries
      queryClient.clear();
    } catch (err) {
      console.error('Logout error:', err);
      setError((err as Error).message || 'Failed to logout');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Do not automatically log in after registration
    } catch (err) {
      console.error('Registration error:', err);
      setError((err as Error).message || 'Failed to register');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear any auth errors
  const clearError = () => {
    setError(null);
  };

  // Provide auth context to children
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        register,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};