import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// User types
export type UserRole = "athlete" | "coach" | "admin" | "parent" | "scout";

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  username: string;
  password: string;
  name: string;
  email: string;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Sample users for demonstration
const sampleUsers: User[] = [
  {
    id: 1,
    username: "alexjohnson",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "athlete",
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    username: "coach",
    name: "Coach Smith",
    email: "coach@example.com",
    role: "coach",
    profileImage: "https://randomuser.me/api/portraits/men/64.jpg"
  },
  {
    id: 3,
    username: "admin",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    profileImage: "https://randomuser.me/api/portraits/women/58.jpg"
  }
];

export const SimplifiedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem("go4it_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("go4it_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

      // Simple authentication logic
      const foundUser = sampleUsers.find(
        u => u.username.toLowerCase() === username.toLowerCase()
      );

      if (foundUser) {
        // In a real app, we would verify the password hash here
        if (password === "password123" || password === "coach123" || password === "admin123") {
          setUser(foundUser);
          localStorage.setItem("go4it_user", JSON.stringify(foundUser));
          
          toast({
            title: "Login successful",
            description: `Welcome back, ${foundUser.name}!`,
          });
          
          return true;
        }
      }
      
      setError("Invalid username or password");
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
      
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      // Check if username already exists
      const userExists = sampleUsers.some(
        u => u.username.toLowerCase() === userData.username.toLowerCase()
      );

      if (userExists) {
        setError("Username already exists");
        toast({
          title: "Registration failed",
          description: "Username already exists",
          variant: "destructive",
        });
        return false;
      }

      // Create new user
      const newUser: User = {
        id: sampleUsers.length + 1,
        username: userData.username,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      };

      // In a real app, we would save this to the database
      // For this demo, we'll just add it to our in-memory array
      sampleUsers.push(newUser);

      // Log the user in
      setUser(newUser);
      localStorage.setItem("go4it_user", JSON.stringify(newUser));

      toast({
        title: "Registration successful",
        description: `Welcome to Go4It Sports, ${newUser.name}!`,
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("go4it_user");
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};