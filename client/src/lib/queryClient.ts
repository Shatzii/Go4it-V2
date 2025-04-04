import { QueryClient, QueryFunction } from "@tanstack/react-query";
import axios from "axios";

const baseURL = window.location.hostname === "localhost" ? "http://localhost:5000" : "";

export const apiRequest = async (
  method: string,
  url: string,
  data?: any,
  options?: any
) => {
  try {
    const response = await axios({
      method,
      url: `${baseURL}${url}`,
      data,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      },
      ...options,
    });
    return response;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Network error occurred");
  }
};

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      const res = await apiRequest("GET", queryKey[0] as string);

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      if (!res.data) {
        throw new Error(`API request failed with status ${res.status}`)
      }

      return res.data;
    };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});