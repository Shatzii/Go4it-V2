import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@/types/security";

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  user: User;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: authData, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include"
        });
        
        if (response.status === 401) {
          return { user: null };
        }
        
        if (!response.ok) {
          throw new Error("Failed to fetch authentication status");
        }
        
        return response.json();
      } catch (error) {
        console.error("Auth error:", error);
        return { user: null };
      }
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return await res.json() as AuthResponse;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/me"], data);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/logout");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.clear();
    },
  });

  return {
    user: authData?.user || null,
    isLoading,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginPending: loginMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
    loginError: loginMutation.error,
  };
}
