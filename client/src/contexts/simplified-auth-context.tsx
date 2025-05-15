import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserRole = 'athlete' | 'coach' | 'admin';

type User = {
  username: string;
  name: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SimplifiedAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user in localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('go4it_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('go4it_user');
      }
    }
    setLoading(false);
  }, []);

  // Simple login function that mimics the static HTML implementation
  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple validation against hardcoded credentials (for demo purposes)
    if ((username === 'alexjohnson' && password === 'password123') || 
        (username === 'admin' && password === 'admin123') ||
        (username === 'coach' && password === 'coach123')) {
      
      // Create user object
      const userData: User = {
        username,
        name: username === 'alexjohnson' ? 'Alex Johnson' : 
              username === 'admin' ? 'Admin User' : 'Coach Smith',
        role: username === 'alexjohnson' ? 'athlete' : 
              username === 'admin' ? 'admin' : 'coach'
      };
      
      // Store user in state and localStorage
      setUser(userData);
      localStorage.setItem('go4it_user', JSON.stringify(userData));
      
      return true;
    }
    
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('go4it_user');
  };

  // Function to switch between roles (for demo purposes)
  const switchRole = (role: UserRole) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      role
    };
    
    setUser(updatedUser);
    localStorage.setItem('go4it_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSimplifiedAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useSimplifiedAuth must be used within a SimplifiedAuthProvider');
  }
  
  return context;
}