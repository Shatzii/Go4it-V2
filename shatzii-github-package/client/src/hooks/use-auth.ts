import { useState, useEffect } from "react";

interface User {
  id: number;
  email: string;
  name: string;
  company?: string;
  role?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("authUser", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  return {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };
}
