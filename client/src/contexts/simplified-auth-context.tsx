import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'athlete' | 'coach' | 'admin';
  profileImage: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, name: string, email: string, role: 'athlete' | 'coach' | 'admin') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const SimplifiedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('go4it_user');
    const storedToken = localStorage.getItem('go4it_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('go4it_user');
        localStorage.removeItem('go4it_token');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    
    try {
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
      localStorage.setItem('go4it_user', JSON.stringify(data.user));
      localStorage.setItem('go4it_token', data.token);
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${data.user.name}!`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, password: string, name: string, email: string, role: 'athlete' | 'coach' | 'admin') => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, name, email, role }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      setUser(data.user);
      localStorage.setItem('go4it_user', JSON.stringify(data.user));
      localStorage.setItem('go4it_token', data.token);
      
      toast({
        title: 'Registration successful',
        description: `Welcome to Go4It Sports, ${data.user.name}!`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('go4it_user');
    localStorage.removeItem('go4it_token');
    
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
      variant: 'default',
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};