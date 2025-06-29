/**
 * Error Handler Utility
 * 
 * Provides functions to handle errors consistently throughout the application.
 */

import { toast } from "@/hooks/use-toast";

// Error types we want to handle
type ErrorCode = 400 | 401 | 403 | 404 | 500;

// Error handling options
interface ErrorHandlingOptions {
  // Whether to show a toast notification
  showToast?: boolean;
  // Whether to redirect to the error page
  redirect?: boolean;
  // Custom message to display
  message?: string;
  // Custom action after handling error
  onError?: (error: any) => void;
}

/**
 * Handle API error responses
 */
export function handleApiError(error: any, options: ErrorHandlingOptions = {}) {
  // Default options
  const defaultOptions: ErrorHandlingOptions = {
    showToast: true,
    redirect: true,
  };

  const opts = { ...defaultOptions, ...options };
  
  // Extract error details
  const status = error?.response?.status || (error?.message?.includes('Network Error') ? 'network' : 'unknown');
  const errorMessage = error?.response?.data?.message || error?.message || 'An unexpected error occurred';
  
  console.error('API Error:', status, errorMessage, error);
  
  // Show toast notification if enabled
  if (opts.showToast) {
    toast({
      title: getErrorTitle(status),
      description: opts.message || errorMessage,
      variant: "destructive",
    });
  }
  
  // Redirect to appropriate error page if enabled
  if (opts.redirect) {
    redirectToErrorPage(status);
  }
  
  // Call custom error handler if provided
  if (opts.onError) {
    opts.onError(error);
  }
  
  return error;
}

/**
 * Get an appropriate error title based on status code
 */
function getErrorTitle(status: ErrorCode | string): string {
  switch (status) {
    case 400:
      return 'Bad Request';
    case 401:
      return 'Authentication Required';
    case 403:
      return 'Access Denied';
    case 404:
      return 'Not Found';
    case 500:
      return 'Server Error';
    case 'network':
      return 'Network Error';
    default:
      return 'Error';
  }
}

/**
 * Redirect to the appropriate error page based on status code
 */
export function redirectToErrorPage(status: ErrorCode | string): void {
  switch (status) {
    case 401:
      window.location.href = '/unauthorized';
      break;
    case 403:
      window.location.href = '/forbidden';
      break;
    case 404:
      window.location.href = '/not-found';
      break;
    case 500:
      window.location.href = '/server-error';
      break;
    case 'network':
      window.location.href = '/server-error';
      break;
    default:
      // Don't redirect for other status codes
      break;
  }
}

/**
 * Create a generic error handler for API requests
 * Use this to wrap async functions that make API calls
 */
export function withErrorHandling<T>(
  asyncFunction: () => Promise<T>,
  options: ErrorHandlingOptions = {}
): Promise<T> {
  return asyncFunction().catch(error => {
    handleApiError(error, options);
    throw error; // Re-throw so the calling code can handle it if needed
  });
}