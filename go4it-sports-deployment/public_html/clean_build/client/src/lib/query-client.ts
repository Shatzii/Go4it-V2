import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000, // 30 seconds
    },
  },
});

interface ApiRequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Helper function to make API requests with proper error handling
 */
export async function apiRequest({ url, method = 'GET', body, headers = {} }: ApiRequestOptions) {
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Combine default headers with any custom headers
  const requestHeaders = { ...defaultHeaders, ...headers };

  // Prepare fetch options
  const options: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: 'include', // Include cookies for auth
  };

  // Add body for non-GET requests
  if (method !== 'GET' && body) {
    options.body = JSON.stringify(body);
  }

  // Make the request
  const response = await fetch(url, options);

  // Handle non-successful responses
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  // Parse and return JSON response
  return response.json();
}