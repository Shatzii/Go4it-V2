import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import websocketService from "@/services/websocket-service";

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
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  switchRole: (role: 'athlete' | 'coach' | 'admin') => void;
  actualRole: string | null; // Stores the actual user role
}

interface AuthProviderProps {
  children: ReactNode;
}

interface RegisterData {
  username: string;
  password: string;
  email: string;
  name: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [actualRole, setActualRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setActualRole(data.user.role); // Store the actual role
          
          // Initialize WebSocket connection if user is logged in
          if (data.user && data.user.id) {
            console.log('Initializing WebSocket connection for user:', data.user.id);
            websocketService.connect(data.user.id);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
    
    // Cleanup WebSocket connection when component unmounts
    return () => {
      websocketService.disconnect();
    };
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      
      // Special case handling for test accounts
      if ((username === "alexjohnson" && password === "password123") ||
          (username === "coachwilliams" && password === "coachpass123") ||
          (username === "coachmartinez" && password === "coachpass456") ||
          (username === "admin" && password === "adminpass123")) {
        
        console.log("Attempting to register test account:", username);
        
        // Try to register the test account first
        try {
          let userData: RegisterData;
          
          if (username === "alexjohnson") {
            userData = {
              username: "alexjohnson",
              password: "password123",
              email: "alex@example.com",
              name: "Alex Johnson",
              role: "athlete"
            };
          } else if (username === "coachwilliams") {
            userData = {
              username: "coachwilliams",
              password: "coachpass123",
              email: "williams@stateuniversity.edu",
              name: "Coach Williams",
              role: "coach"
            };
          } else if (username === "coachmartinez") {
            userData = {
              username: "coachmartinez",
              password: "coachpass456",
              email: "martinez@centralcollege.edu",
              name: "Coach Martinez",
              role: "coach"
            };
          } else {
            userData = {
              username: "admin",
              password: "adminpass123",
              email: "admin@goforit.com",
              name: "Admin User",
              role: "admin"
            };
          }
          
          await register(userData);
          return; // Return early as register will handle navigation
        } catch (regError: any) {
          // If registration fails because user already exists, continue with login
          if (!regError.message.includes("already exists")) {
            throw regError;
          }
          console.log("User already exists, continuing with login");
        }
      }
      
      // Normal login flow
      await apiRequest("POST", "/api/auth/login", { username, password });
      
      // After successful login, fetch the user data
      const userResponse = await apiRequest("GET", "/api/auth/me");
      
      if (userResponse?.data?.user) {
        setUser(userResponse.data.user);
        setActualRole(userResponse.data.user.role); // Store the actual role
        
        // Connect to WebSocket after login
        websocketService.connect(userResponse.data.user.id);
        
        // Delay navigation slightly to ensure all state updates are complete
        setTimeout(() => {
          toast({
            title: "Login successful", 
            description: `Welcome back, ${userResponse.data.user.name}!`,
          });
          navigate("/");
        }, 300);
      } else {
        throw new Error("Failed to get user data");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Invalid username or password";
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      const response = await apiRequest("POST", "/api/auth/register", userData);
      const data = response.data;
      setUser(data.user);
      setActualRole(data.user.role); // Store the actual role
      
      // Connect to WebSocket after registration
      if (data.user && data.user.id) {
        websocketService.connect(data.user.id);
      }
      
      // Delay navigation slightly to ensure all state updates are complete
      setTimeout(() => {
        toast({
          title: "Registration successful",
          description: `Welcome, ${data.user.name}!`,
        });
        navigate("/");
      }, 300);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      
      // Disconnect WebSocket when logging out
      websocketService.disconnect();
      
      setUser(null);
      setActualRole(null); // Clear the actual role
      
      // Delay navigation slightly to ensure all state updates are complete
      setTimeout(() => {
        toast({
          title: "Logout successful",
          description: "You have been logged out successfully",
        });
        navigate("/");
      }, 300);
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: "There was an issue logging out",
        variant: "destructive",
      });
    }
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      if (!user) throw new Error("User not authenticated");
      
      // In a real implementation, we'd call an API to update the user
      // For now, we'll just update the local state
      setUser({
        ...user,
        ...data,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Function to switch between roles (for admin users only)
  const switchRole = (role: 'athlete' | 'coach' | 'admin') => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to switch roles",
        variant: "destructive",
      });
      return;
    }

    // Only admins can switch roles
    if (actualRole !== 'admin') {
      toast({
        title: "Permission denied",
        description: "Only administrators can switch roles",
        variant: "destructive",
      });
      return;
    }

    // Update the user object with the new role
    setUser({
      ...user,
      role
    });

    toast({
      title: "Role switched",
      description: `You are now viewing the platform as ${role}`,
    });
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    switchRole,
    actualRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
