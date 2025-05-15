import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, type ApiRequestOptions } from "@/lib/api";
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
  agreedToTerms?: boolean;
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
    // First try localStorage for our simplified auth
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
        return; // Skip API call if we have local storage data
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('go4it_user');
      }
    }
    
    // Fall back to API call if no localStorage data
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setActualRole(data.user.role); // Store the actual role
          
          // Temporarily disable WebSocket connection initialization
          if (data.user && data.user.id) {
            console.log('WebSocket initialization temporarily disabled for debugging');
            // websocketService.connect(data.user.id);
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
    // Track state to prevent showing conflicting toasts
    let loginSuccess = false;
    let errorToastShown = false;
    let loginCompleted = false;
    
    try {
      // Set loading state when starting login
      setLoading(true);
      
      // Special case handling for test accounts
      if ((username === "alexjohnson" && password === "password123") ||
          (username === "coachwilliams" && password === "coachpass123") ||
          (username === "coachmartinez" && password === "coachpass456") ||
          (username === "admin" && password === "MyTime$$")) {
        
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
          console.log("User already exists, continuing with login without showing error toast");
          // Skip showing the "Registration failed" toast for test users that already exist
        }
      }
      
      // Set up timeout to prevent hanging login requests
      const loginTimeout = setTimeout(() => {
        if (!loginCompleted) {
          console.warn("Login request timed out after 15 seconds");
          
          // Only show error toast if we haven't shown success yet
          if (!loginSuccess && !errorToastShown) {
            errorToastShown = true;
            toast({
              title: "Login took too long",
              description: "The server is taking too long to respond. Please try again.",
              variant: "destructive",
            });
          }
          setLoading(false);
        }
      }, 15000); // 15 second timeout
      
      try {
        // IMPORTANT: Don't clear user state before attempting login
        // This prevents the "red flash" of logged-out state during login
        
        // Perform login request
        const loginResponse = await apiRequest("/api/auth/login", { 
          method: "POST", 
          data: { username, password } 
        });
        
        // After successful login, fetch the user data
        const userResponse = await apiRequest("/api/auth/me");
        
        // Mark login as complete for the timeout handler
        loginCompleted = true;
        clearTimeout(loginTimeout);
        
        if (userResponse?.user) {
          // Mark login as successful to prevent error toasts
          loginSuccess = true;
          
          // Store access token in localStorage if it exists
          if (loginResponse?.data?.accessToken) {
            localStorage.setItem('accessToken', loginResponse.data.accessToken);
            console.log('Access token saved to localStorage');
          }
          
          // Set user data in state - this will update UI immediately
          setUser(userResponse.user);
          setActualRole(userResponse.user.role);
          
          // Connect to WebSocket after login - in a try/catch so it doesn't break the login process
          try {
            websocketService.connect(userResponse.user.id);
          } catch (wsError) {
            console.error("WebSocket connection error:", wsError);
            // Don't block login if websocket connection fails
          }
          
          // Show success toast
          if (!errorToastShown) {
            toast({
              title: "Login successful", 
              description: `Welcome back, ${userResponse.user.name}!`,
            });
          }
          
          // Navigate home
          navigate("/");
        } else {
          throw new Error("Failed to get user data");
        }
      } catch (apiError: any) {
        // Mark login as complete for the timeout handler
        loginCompleted = true;
        clearTimeout(loginTimeout);
        
        console.error("API request error during login:", apiError);
        throw new Error(apiError.message || "Login failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Only show error toast if we haven't shown success
      if (!loginSuccess && !errorToastShown) {
        errorToastShown = true;
        
        const errorMessage = error.message || "Invalid username or password";
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      // Rethrow for the component to handle
      throw error;
    } finally {
      // Always reset loading state
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/auth/register", {
        method: "POST",
        data: userData
      });
      
      if (!response || !response.data?.user) {
        throw new Error("Registration failed. No user data received.");
      }
      
      // Store access token in localStorage if it exists
      if (response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        console.log('Access token saved to localStorage during registration');
      }
      
      // Set user data before trying to initialize WebSocket to avoid race conditions
      setUser(response.data.user);
      setActualRole(response.data.user.role); // Store the actual role
      
      // Connect to WebSocket after registration - use try/catch to prevent WebSocket issues from breaking registration
      if (response.data.user && response.data.user.id) {
        try {
          websocketService.connect(response.data.user.id);
        } catch (wsError) {
          console.error("WebSocket connection error during registration:", wsError);
          // Don't block registration process if websocket fails
        }
      }
      
      // Show success toast immediately
      toast({
        title: "Registration successful",
        description: `Welcome, ${response.data.user.name}!`,
      });
      
      // Navigate after state has been updated
      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Check if this is a test account login attempting registration
      const isTestAccountLogin = error.message?.includes("already exists") && 
                                (userData.username === "admin" || 
                                 userData.username === "alexjohnson" || 
                                 userData.username === "coachwilliams" || 
                                 userData.username === "coachmartinez");
      
      // Only show the error toast if it's not a test account login
      if (!isTestAccountLogin) {
        toast({
          title: "Registration failed",
          description: error.message || "Failed to create account. Please try again.",
          variant: "destructive",
        });
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Set up a timeout to ensure logout completes even if requests hang
    let logoutCompleted = false;
    const logoutTimeout = setTimeout(() => {
      if (!logoutCompleted) {
        console.warn("Logout operation timed out after 5 seconds, forcing client-side logout");
        completeClientSideLogout();
      }
    }, 5000); // 5 second timeout for the entire logout process
    
    // Helper function to ensure consistent client-side state cleanup
    const completeClientSideLogout = () => {
      if (logoutCompleted) return; // Prevent duplicate execution
      
      logoutCompleted = true;
      clearTimeout(logoutTimeout);
      
      // Clear authentication token from localStorage
      localStorage.removeItem('accessToken');
      
      // Always clear user state
      setUser(null);
      setActualRole(null);
      
      // Navigate to home page
      navigate("/");
    };
    
    try {
      // First disconnect WebSocket
      try {
        websocketService.disconnect();
      } catch (wsError) {
        console.error("WebSocket disconnect error:", wsError);
        // Continue with logout process regardless of WebSocket errors
      }
      
      // Then send logout request to server
      try {
        await apiRequest("/api/auth/logout", {
          method: "POST"
        });
        
        // Show success message only after successful server-side logout
        toast({
          title: "Logout successful",
          description: "You have been logged out successfully",
        });
      } catch (logoutError) {
        console.error("Logout API error:", logoutError);
        
        // Show a different message if server logout fails
        toast({
          title: "Logout notice",
          description: "You have been logged out on this device, but there may have been an issue with the server",
          variant: "destructive",
        });
      }
      
      // Complete the logout process
      completeClientSideLogout();
    } catch (error: any) {
      console.error("Unexpected logout error:", error);
      
      // Show generic error message
      toast({
        title: "Logout notice",
        description: "You have been logged out, but there was an unexpected error",
        variant: "destructive",
      });
      
      // Still ensure client-side logout completes
      completeClientSideLogout();
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
