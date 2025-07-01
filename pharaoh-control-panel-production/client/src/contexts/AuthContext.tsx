import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';

// User type from schema
interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  plan?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ['/api/auth/user'],
    retry: false,
    refetchOnWindowFocus: true,
  });

  const login = () => {
    window.location.href = '/auth/login';
  };

  const logout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout');
      window.location.href = '/auth/login';
    } catch (error) {
      // Fallback to redirect even if logout fails
      window.location.href = '/auth/login';
    }
  };

  // Ensure we're correctly typing the user data
  const userData: User | null = user as User | null;
  
  return (
    <AuthContext.Provider
      value={{
        user: userData,
        isLoading,
        isAuthenticated: !!userData,
        error: error as Error | null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};