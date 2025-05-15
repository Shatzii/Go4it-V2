import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: 'athlete' | 'coach' | 'admin') => void;
  actualRole: string | null; // Stores the actual user role
}

interface AuthProviderProps {
  children: ReactNode;
}

export const SimplifiedAuthContext = createContext<AuthContextType | undefined>(undefined);

export function SimplifiedAuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [actualRole, setActualRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    // Try localStorage for our simplified auth
    const userDataString = localStorage.getItem('go4it_user');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        // Convert to User type format
        const convertedUser: User = {
          id: 1, // Default ID
          username: userData.username,
          name: userData.name,
          email: `${userData.username}@example.com`, // Mock email
          role: userData.role,
        };
        setUser(convertedUser);
        setActualRole(userData.role);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('go4it_user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    
    try {
      // Check hardcoded credentials
      if ((username === "alexjohnson" && password === "password123") ||
          (username === "admin" && password === "admin123") ||
          (username === "coach" && password === "coach123")) {
          
        console.log("Logging in with simplified authentication");
        
        // Create the user data
        const userData = {
          username,
          name: username === "alexjohnson" ? "Alex Johnson" : 
                username === "admin" ? "Admin User" : "Coach Smith",
          role: username === "alexjohnson" ? "athlete" : 
                username === "admin" ? "admin" : "coach",
        };
        
        // Save to localStorage
        localStorage.setItem('go4it_user', JSON.stringify(userData));
        
        // Set user data
        const user: User = {
          id: 1,
          username: userData.username,
          name: userData.name,
          email: `${userData.username}@example.com`,
          role: userData.role,
        };
        
        setUser(user);
        setActualRole(userData.role);
        
        // Show success toast
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        });
        
        // Navigate to home after login
        navigate("/");
      } else {
        // Invalid credentials
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Clear user data
    localStorage.removeItem('go4it_user');
    setUser(null);
    setActualRole(null);
    
    // Show success toast
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    
    // Navigate to login
    navigate("/auth");
  };

  const switchRole = (role: 'athlete' | 'coach' | 'admin') => {
    if (!user) return;
    
    // Only change display role, not actual role
    const updatedUser: User = {
      ...user,
      role,
    };
    
    setUser(updatedUser);
    
    toast({
      title: "Role switched",
      description: `You are now viewing the platform as ${role}`,
    });
  };

  const value = {
    user,
    loading,
    login,
    logout,
    switchRole,
    actualRole,
  };

  return <SimplifiedAuthContext.Provider value={value}>{children}</SimplifiedAuthContext.Provider>;
}

export function useSimplifiedAuth() {
  const context = useContext(SimplifiedAuthContext);
  if (context === undefined) {
    throw new Error("useSimplifiedAuth must be used within a SimplifiedAuthProvider");
  }
  return context;
}