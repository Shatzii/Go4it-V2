/**
 * API helper functions for making requests
 */

export interface ApiRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  data?: any;
}

/**
 * Make a request to the API
 */
export async function apiRequest<T = any>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { method = "GET", headers = {}, data } = options;
  
  // Add JWT token to headers if available
  const accessToken = localStorage.getItem('accessToken');
  const authHeaders = accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
  
  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...headers,
    },
    credentials: "include",
  };
  
  if (data !== undefined) {
    fetchOptions.body = JSON.stringify(data);
  }
  
  const response = await fetch(path, fetchOptions);
  
  if (!response.ok) {
    // Try to extract error message
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new Error(`API error: ${response.status}`);
      }
      throw e;
    }
  }
  
  // Handle no content responses
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
}