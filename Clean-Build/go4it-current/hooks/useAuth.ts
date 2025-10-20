import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin' | 'coach';
  subscription: string;
  profileImage?: string;
  preferences?: {
    sport: string;
    notifications: boolean;
    theme: string;
  };
  stats?: {
    garScore: number;
    rank: number;
    achievements: number;
    streak: number;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return a fallback implementation when context is not available
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    const login = async (email: string, password: string) => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
          // Store the token if provided
          if (data.token) {
            localStorage.setItem('auth-token', data.token);
          }
          setUser(data.user);
          return { success: true };
        } else {
          return { success: false, error: data.error || data.message };
        }
      } catch (error) {
        return { success: false, error: 'Login failed' };
      }
    };

    const logout = async () => {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        localStorage.removeItem('auth-token'); // Clear stored token
        setUser(null);
        window.location.href = '/';
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    const refreshUser = async () => {
      await checkAuthStatus();
    };

    return {
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      refreshUser,
    };
  }

  return context;
}
