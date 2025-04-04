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
      timeout: 10000, // Added timeout
      ...options,
    });
    return response;
  } catch (error: any) {
    if (!error.response) {
      throw new Error('Network error - Please check your connection');
    } else if (error.response?.status === 401) {
      //Handle 401 specifically if needed.  Could redirect or show a login prompt.
      throw new Error('Unauthorized. Please login.')
    }
    else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(`API request failed with status ${error.response?.status} and data: ${error.response?.data}`);
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