import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
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
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
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
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
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
        toast({
          title: "Login successful", 
          description: `Welcome back, ${userResponse.data.user.name}!`,
        });
        navigate("/");
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
      toast({
        title: "Registration successful",
        description: `Welcome, ${data.user.name}!`,
      });
      navigate("/");
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
      setUser(null);
      toast({
        title: "Logout successful",
        description: "You have been logged out successfully",
      });
      navigate("/");
    } catch (error) {
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
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
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
