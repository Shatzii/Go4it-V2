import { QueryClient } from "@tanstack/react-query";

// Options for handling different HTTP error codes
type ErrorHandlingOptions = {
  on401?: "throw" | "returnNull";
};

// Default fetcher function for React Query
export const getQueryFn =
  (options: ErrorHandlingOptions = {}) =>
  async ({ queryKey }: { queryKey: string[] }) => {
    const [url] = queryKey;
    
    try {
      // Add auth token if it exists
      const token = localStorage.getItem("go4it_token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(url, { headers });
      
      // Handle unauthorized based on options
      if (response.status === 401) {
        if (options.on401 === "returnNull") {
          return null;
        }
        throw new Error("Unauthorized");
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  };

// Function for API requests (used in mutations)
export const apiRequest = async (
  method: string,
  url: string,
  data?: any
): Promise<Response> => {
  const token = localStorage.getItem("go4it_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const options: RequestInit = {
    method,
    headers,
    credentials: "include",
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || `Request failed with status ${response.status}`);
    } catch (e) {
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }
  }
  
  return response;
};

// Create and export the query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn(),
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});