/**
 * Go4It Sports - Error Handling Middleware
 * 
 * Provides consistent error handling across the application with:
 * - User-friendly error messages
 * - Detailed server-side logging
 * - Proper status codes
 * - Error categorization
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
// pg doesn't directly export PostgresError, but we can reference it through error codes

// Standard error response structure
export interface ErrorResponse {
  error: {
    message: string;
    code?: string;
    status: number;
    details?: any;
  };
}

// Error types for different scenarios
export enum ErrorTypes {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  DATABASE = 'DATABASE_ERROR',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE_ERROR',
  SERVER = 'SERVER_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  DUPLICATE = 'DUPLICATE_RECORD_ERROR',
  FILE_UPLOAD = 'FILE_UPLOAD_ERROR'
}

// Custom error class for application errors
export class AppError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: any;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string = ErrorTypes.SERVER,
    status: number = 500,
    details?: any,
    isOperational: boolean = true
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Helper function to determine if we're in development mode
const isDev = (): boolean => {
  return process.env.NODE_ENV !== 'production';
};

// Utility to safely stringify objects for logging
const safeStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj, (key, value) => {
      // Remove sensitive fields
      if (['password', 'token', 'secret', 'apiKey', 'api_key'].includes(key.toLowerCase())) {
        return '[REDACTED]';
      }
      return value;
    }, 2);
  } catch (error) {
    return '[Object cannot be stringified]';
  }
};

// Detailed error logging function
export const logError = (err: any, req?: Request): void => {
  const timestamp = new Date().toISOString();
  const errorType = err.code || 'UNKNOWN_ERROR';
  
  let requestInfo = '';
  if (req) {
    const userId = req.user?.id || 'anonymous';
    requestInfo = ` [${req.method} ${req.originalUrl}] [User: ${userId}]`;
  }
  
  console.error(`[${timestamp}] [ERROR:${errorType}]${requestInfo} ${err.message}`);
  
  // Log stack trace in development or for non-operational errors
  if (isDev() || (err.isOperational === false)) {
    console.error(err.stack);
  }
  
  // Log error details if available
  if (err.details) {
    console.error('Error details:', safeStringify(err.details));
  }
};

// Handle database-specific errors
const handleDatabaseError = (err: any): AppError => {
  // PostgreSQL error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html
  if (err.code === '23505') { // Unique violation
    return new AppError(
      'A record with this information already exists.',
      ErrorTypes.DUPLICATE,
      409,
      { constraint: err.constraint }
    );
  }
  
  if (err.code === '23503') { // Foreign key violation
    return new AppError(
      'This operation references data that does not exist or has been deleted.',
      ErrorTypes.DATABASE,
      400,
      { constraint: err.constraint }
    );
  }
  
  if (err.code === '23502') { // Not null violation
    return new AppError(
      'Required information is missing.',
      ErrorTypes.VALIDATION,
      400,
      { column: err.column }
    );
  }
  
  if (err.code?.startsWith('42')) { // Syntax error or access rule violation
    return new AppError(
      'The database query contains an error.',
      ErrorTypes.DATABASE,
      500,
      isDev() ? { sqlState: err.code, message: err.message } : undefined
    );
  }
  
  if (err.code?.startsWith('08')) { // Connection exception
    return new AppError(
      'Unable to connect to the database. Please try again later.',
      ErrorTypes.DATABASE,
      503,
      isDev() ? { sqlState: err.code, message: err.message } : undefined
    );
  }
  
  if (err.code?.startsWith('57')) { // Operator intervention (e.g., server shutdown)
    return new AppError(
      'Database service temporarily unavailable. Please try again later.',
      ErrorTypes.DATABASE,
      503,
      isDev() ? { sqlState: err.code, message: err.message } : undefined
    );
  }
  
  // Default database error
  return new AppError(
    'A database error occurred. Please try again later.',
    ErrorTypes.DATABASE,
    500,
    isDev() ? { originalError: err.message } : undefined
  );
};

// Handle validation errors from Zod
const handleZodError = (err: ZodError): AppError => {
  const formattedErrors = err.errors.map(error => ({
    path: error.path.join('.'),
    message: error.message
  }));
  
  return new AppError(
    'Validation failed. Please check your input.',
    ErrorTypes.VALIDATION,
    400,
    { validationErrors: formattedErrors }
  );
};

// Main error handling middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Always log the error
  logError(err, req);
  
  // Convert to AppError if it's not already
  let appError: AppError;
  
  // Handle known error types
  if (err instanceof AppError) {
    appError = err;
  } else if (err instanceof ZodError) {
    appError = handleZodError(err);
  } else if (err.code && typeof err.code === 'string') {
    // Likely a database error
    appError = handleDatabaseError(err);
  } else if (err.name === 'ValidationError') {
    // Handle other validation frameworks
    appError = new AppError(
      'Validation failed. Please check your input.',
      ErrorTypes.VALIDATION,
      400,
      isDev() ? { details: err.details || err.errors } : undefined
    );
  } else if (err.name === 'UnauthorizedError' || err.message?.includes('unauthorized')) {
    appError = new AppError(
      'You are not authorized to access this resource.',
      ErrorTypes.AUTHENTICATION,
      401
    );
  } else if (err.message?.includes('timeout') || err.message?.includes('timed out')) {
    appError = new AppError(
      'The operation timed out. Please try again later.',
      ErrorTypes.EXTERNAL_SERVICE,
      503
    );
  } else {
    // Unknown error
    appError = new AppError(
      isDev() ? err.message : 'An unexpected error occurred. Please try again later.',
      ErrorTypes.SERVER,
      500,
      isDev() ? { originalError: err.message } : undefined
    );
  }
  
  // Send the error response
  const errorResponse: ErrorResponse = {
    error: {
      message: appError.message,
      code: appError.code,
      status: appError.status,
    }
  };
  
  // Include error details in development mode
  if (isDev() && appError.details) {
    errorResponse.error.details = appError.details;
  }
  
  res.status(appError.status).json(errorResponse);
};

// Catch-all for unhandled routes (404)
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const appError = new AppError(
    `Cannot ${req.method} ${req.originalUrl}`,
    ErrorTypes.NOT_FOUND,
    404
  );
  
  next(appError);
};

// Async error wrapper to avoid try/catch blocks everywhere
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Middleware to track database connection errors
export const databaseErrorTracker = (req: Request, res: Response, next: NextFunction) => {
  const originalEnd = res.end;
  
  // Override end method to track successful responses
  res.end = function (...args) {
    // Reset connection error count on successful DB operations
    if (res.statusCode >= 200 && res.statusCode < 300 && 
        req.originalUrl.includes('/api/') && 
        global.dbConnectionErrorCount > 0) {
      console.log('[DB] Successful database operation, resetting error counter');
      global.dbConnectionErrorCount = 0;
    }
    
    return originalEnd.apply(this, args);
  };
  
  next();
};

// Initialize the global database connection error counter
if (typeof global.dbConnectionErrorCount === 'undefined') {
  global.dbConnectionErrorCount = 0;
}

export default {
  errorHandler,
  notFoundHandler,
  databaseErrorTracker,
  asyncHandler,
  AppError,
  ErrorTypes,
  logError
};