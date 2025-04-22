import { QueryClient, QueryFunction } from "@tanstack/react-query";
import axios from "axios";

/**
 * API Base URL handling:
 * - In development (localhost): use http://localhost:5000
 * - In production at 5.161.99.81: use port 81
 * - In any other environment: use the same origin
 */
const getBaseURL = () => {
  const hostname = window.location.hostname;
  
  if (hostname === "localhost") {
    return "http://localhost:5000";
  } else if (hostname === "5.161.99.81") {
    // Production server configuration
    const protocol = window.location.protocol;
    return `${protocol}//${hostname}:81`;
  } else {
    // For any other hosting environment, use the same origin
    return "";
  }
};

const baseURL = getBaseURL();

import { handleApiError } from "@/utils/error-handler";

export const apiRequest = async (
  method: string,
  url: string,
  data?: any,
  options?: any
) => {
  try {
    console.log(`Making ${method} request to ${url}`, 
      data instanceof FormData ? 'FormData' : data);
    
    // Default headers
    const headers: Record<string, string> = {};
    
    // Only set Content-Type to application/json if data is not FormData
    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    
    // For FormData, make sure we don't set any Content-Type ourselves
    // The browser needs to set it with the correct multipart boundary
    
    // Get the authentication token from localStorage if it exists
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    const response = await axios({
      method,
      url: `${baseURL}${url}`,
      data,
      withCredentials: true,
      headers,
      timeout: 30000, // Increased timeout for video uploads
      ...options,
    });
    
    console.log(`Request to ${url} successful`, response.status);
    return response;
  } catch (error: any) {
    console.error("API request error details:", {
      url,
      method,
      errorName: error.name,
      errorMessage: error.message,
      responseStatus: error.response?.status,
      responseData: error.response?.data
    });
    
    // Use our error handler to display appropriate messages and redirect when needed
    // For Query Client errors, we don't want to immediately redirect on most errors
    // so we set redirect to false and let the component handle it
    handleApiError(error, { 
      showToast: true, 
      redirect: false, // Don't automatically redirect for most errors in query client
      message: error?.response?.data?.message || error?.message
    });
    
    // Now handle the error for the caller
    if (!error.response) {
      throw new Error('Network error - Please check your connection');
    } else if (error.response?.status === 401) {
      // For 401 errors, we do want to redirect to the unauthorized page
      window.location.href = '/unauthorized';
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