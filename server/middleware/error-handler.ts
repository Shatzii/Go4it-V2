/**
 * Go4It Sports - Error Handling Middleware
 * 
 * Provides standardized error handling for the entire application:
 * - Structured error responses
 * - Error logging with variable detail levels
 * - Error categorization
 * - Request context preservation
 * - User-friendly messages
 */

import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

// Different types of errors for better categorization
export enum ErrorTypes {
  VALIDATION = 'validation_error',
  AUTHENTICATION = 'authentication_error',
  AUTHORIZATION = 'authorization_error',
  NOT_FOUND = 'not_found_error',
  DATABASE = 'database_error',
  EXTERNAL_SERVICE = 'external_service_error',
  MEDIA_PROCESSING = 'media_processing_error',
  RATE_LIMIT = 'rate_limit_error',
  SERVER = 'server_error',
  NETWORK = 'network_error',
  UNKNOWN = 'unknown_error',
}

// Status code mappings for error types
const ERROR_STATUS_CODES: Record<ErrorTypes, number> = {
  [ErrorTypes.VALIDATION]: 400,
  [ErrorTypes.AUTHENTICATION]: 401,
  [ErrorTypes.AUTHORIZATION]: 403,
  [ErrorTypes.NOT_FOUND]: 404,
  [ErrorTypes.DATABASE]: 500,
  [ErrorTypes.EXTERNAL_SERVICE]: 503,
  [ErrorTypes.MEDIA_PROCESSING]: 500,
  [ErrorTypes.RATE_LIMIT]: 429,
  [ErrorTypes.SERVER]: 500,
  [ErrorTypes.NETWORK]: 500,
  [ErrorTypes.UNKNOWN]: 500,
};

// User-friendly error messages (visible to end users)
const ERROR_USER_MESSAGES: Record<ErrorTypes, string> = {
  [ErrorTypes.VALIDATION]: 'The provided information is invalid or incomplete.',
  [ErrorTypes.AUTHENTICATION]: 'You must be logged in to access this resource.',
  [ErrorTypes.AUTHORIZATION]: 'You do not have permission to access this resource.',
  [ErrorTypes.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorTypes.DATABASE]: 'A database error occurred. Please try again later.',
  [ErrorTypes.EXTERNAL_SERVICE]: 'A service is temporarily unavailable. Please try again later.',
  [ErrorTypes.MEDIA_PROCESSING]: 'There was an error processing your media. Please try a different file.',
  [ErrorTypes.RATE_LIMIT]: 'Too many requests. Please try again later.',
  [ErrorTypes.SERVER]: 'An internal server error occurred. Please try again later.',
  [ErrorTypes.NETWORK]: 'A network error occurred. Please check your connection and try again.',
  [ErrorTypes.UNKNOWN]: 'An unexpected error occurred. Please try again later.',
};

// Custom application error class
export class AppError extends Error {
  public readonly type: ErrorTypes;
  public readonly statusCode: number;
  public readonly details: any;
  public readonly timestamp: Date;
  public readonly isOperational: boolean;
  
  constructor(
    message: string,
    type: ErrorTypes = ErrorTypes.UNKNOWN,
    statusCode?: number,
    details?: any,
    isOperational: boolean = true
  ) {
    super(message);
    
    // Error metadata
    this.name = this.constructor.name;
    this.type = type;
    this.statusCode = statusCode || ERROR_STATUS_CODES[type];
    this.details = details;
    this.timestamp = new Date();
    this.isOperational = isOperational;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
  
  // Get user-friendly message for this error type
  public getUserMessage(): string {
    return ERROR_USER_MESSAGES[this.type];
  }
  
  // Convert to a clean object for logging
  public toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      statusCode: this.statusCode,
      timestamp: this.timestamp.toISOString(),
      isOperational: this.isOperational,
      stack: this.stack,
      details: this.details,
    };
  }
}

// Basic client-friendly error response
interface ErrorResponse {
  error: {
    type: string;
    message: string;
    code?: string;
    timestamp: string;
  };
}

// Log levels for error logging
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Get current environment
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

// Configure log paths based on environment
const LOG_DIR = process.env.LOG_DIR || path.join(process.cwd(), 'logs');
const ERROR_LOG_PATH = path.join(LOG_DIR, 'error.log');
const DEBUG_LOG_PATH = path.join(LOG_DIR, 'debug.log');

// Create log directory if it doesn't exist
try {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
} catch (err) {
  console.error('Failed to create log directory:', err);
}

/**
 * Log an error to the appropriate channels
 */
export function logError(
  error: unknown,
  request?: Request,
  logLevel: LogLevel = 'error'
): void {
  // Format the error for logging
  const errorObject = formatErrorForLogging(error, request);
  
  // Log different levels to console based on environment
  const logToConsole = !isProduction || isDevelopment;
  
  // Always log to file in production, optionally in development
  const logToFile = isProduction || process.env.LOG_TO_FILE === 'true';
  
  try {
    // Console logging with appropriate level
    if (logToConsole) {
      switch (logLevel) {
        case 'debug':
          console.debug(JSON.stringify(errorObject, null, 2));
          break;
        case 'info':
          console.info(JSON.stringify(errorObject, null, 2));
          break;
        case 'warn':
          console.warn(JSON.stringify(errorObject, null, 2));
          break;
        case 'error':
        default:
          console.error(JSON.stringify(errorObject, null, 2));
          break;
      }
    }
    
    // File logging based on level
    if (logToFile && !isTest) {
      const logEntry = `[${new Date().toISOString()}] [${logLevel.toUpperCase()}] ${JSON.stringify(errorObject)}\n`;
      
      // Choose log file based on level
      if (logLevel === 'error') {
        fs.appendFileSync(ERROR_LOG_PATH, logEntry);
      } else {
        fs.appendFileSync(DEBUG_LOG_PATH, logEntry);
      }
    }
  } catch (loggingError) {
    // Last resort fallback if logging itself fails
    console.error('Error logging failed:', loggingError);
    console.error('Original error:', error);
  }
}

/**
 * Format error for logging
 */
function formatErrorForLogging(
  error: unknown,
  request?: Request
): Record<string, any> {
  // Base error object
  let errorObject: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  };
  
  // If this is our AppError, use its built-in JSON representation
  if (error instanceof AppError) {
    errorObject = { ...errorObject, ...error.toJSON() };
  } else if (error instanceof Error) {
    // Standard Error object
    errorObject = {
      ...errorObject,
      name: error.name,
      message: error.message,
      stack: error.stack,
      type: ErrorTypes.UNKNOWN,
    };
  } else {
    // Unknown error type
    errorObject = {
      ...errorObject,
      name: 'UnknownError',
      message: String(error),
      type: ErrorTypes.UNKNOWN,
    };
  }
  
  // Add request details if available
  if (request) {
    errorObject.request = {
      method: request.method,
      url: request.originalUrl || request.url,
      ip: request.ip,
      userAgent: request.get('User-Agent'),
      userId: (request.user as any)?.id || 'anonymous',
      query: request.query,
      // Don't log sensitive body data in production
      body: !isProduction ? sanitizeRequestBody(request.body) : undefined,
    };
  }
  
  return errorObject;
}

/**
 * Remove sensitive information from request body before logging
 */
function sanitizeRequestBody(body: any): any {
  if (!body) return {};
  
  // Make a copy so we don't modify the original
  const sanitized = { ...body };
  
  // Fields to redact
  const sensitiveFields = [
    'password', 'newPassword', 'currentPassword', 'passwordConfirmation',
    'token', 'refreshToken', 'accessToken', 'apiKey', 'secret',
    'creditCard', 'cardNumber', 'cvv', 'ssn', 'socialSecurity',
    'apiKey', 'secretKey', 'x-api-key', 'authorization',
  ];
  
  // Recursively sanitize object
  function sanitizeObject(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    
    Object.keys(obj).forEach(key => {
      // Check if this is a sensitive field
      const lowercaseKey = key.toLowerCase();
      const isSensitive = sensitiveFields.some(field => 
        lowercaseKey.includes(field.toLowerCase())
      );
      
      if (isSensitive) {
        // Redact sensitive values
        obj[key] = typeof obj[key] === 'string' ? '[REDACTED]' : { redacted: true };
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Recursively sanitize nested objects
        obj[key] = sanitizeObject(obj[key]);
      }
    });
    
    return obj;
  }
  
  return sanitizeObject(sanitized);
}

/**
 * Format error for client response
 */
function formatErrorForResponse(
  error: unknown,
  request: Request,
  showDetails: boolean = false
): ErrorResponse {
  // Base error response
  const errorResponse: ErrorResponse = {
    error: {
      type: ErrorTypes.UNKNOWN,
      message: ERROR_USER_MESSAGES[ErrorTypes.UNKNOWN],
      timestamp: new Date().toISOString(),
    },
  };
  
  // Customize based on error type
  if (error instanceof AppError) {
    errorResponse.error.type = error.type;
    errorResponse.error.message = showDetails ? error.message : error.getUserMessage();
    errorResponse.error.code = error.details?.code;
    
    // Add more details in development
    if (showDetails && error.details) {
      (errorResponse.error as any).details = error.details;
    }
  } else if (error instanceof Error) {
    // Standard Error
    errorResponse.error.message = showDetails 
      ? error.message 
      : ERROR_USER_MESSAGES[ErrorTypes.UNKNOWN];
      
    // Add stack in development
    if (showDetails) {
      (errorResponse.error as any).stack = error.stack;
    }
  }
  
  // Add request ID if available
  if ((request as any).id) {
    errorResponse.error.code = (request as any).id;
  }
  
  return errorResponse;
}

/**
 * Get HTTP status code from error
 */
function getStatusCode(error: unknown): number {
  if (error instanceof AppError) {
    return error.statusCode;
  }
  
  // Default for unknown errors
  return 500;
}

/**
 * Main error handling middleware
 */
export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log all errors
  logError(error, req);
  
  // Format error for client response
  const showDetails = !isProduction;
  const errorResponse = formatErrorForResponse(error, req, showDetails);
  
  // Get appropriate status code
  const statusCode = getStatusCode(error);
  
  // Send error response
  res.status(statusCode).json(errorResponse);
}

/**
 * 404 not found handler
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  // Create not found error
  const error = new AppError(
    `Cannot ${req.method} ${req.originalUrl || req.url}`,
    ErrorTypes.NOT_FOUND,
    404
  );
  
  // Pass to main error handler
  next(error);
}

/**
 * Async route handler wrapper to catch unhandled promise rejections
 */
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Rate limiting error handler
 */
export function rateLimitErrorHandler(req: Request, res: Response): void {
  const error = new AppError(
    'Too many requests, please try again later.',
    ErrorTypes.RATE_LIMIT,
    429
  );
  
  // Log the rate limiting event
  logError(error, req, 'warn');
  
  // Respond with rate limit error
  res.status(429).json({
    error: {
      type: error.type,
      message: error.getUserMessage(),
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Validation error handler (for request validation)
 */
export function validationErrorHandler(error: any, req: Request, res: Response, next: NextFunction): void {
  // Check if this is a validation error (e.g., from express-validator)
  if (error.array && typeof error.array === 'function') {
    const validationErrors = error.array();
    
    // Create a validation error
    const appError = new AppError(
      'Validation failed',
      ErrorTypes.VALIDATION,
      400,
      { validationErrors }
    );
    
    // Pass to main error handler
    return errorHandler(appError, req, res, next);
  }
  
  // Not a validation error, continue to next error handler
  next(error);
}

/**
 * Unhandled error handler for global use
 */
export function setupGlobalErrorHandlers(): void {
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('[FATAL] Uncaught exception:', error);
    logError(error);
    
    // Exit with error in production (for auto-restart by process manager)
    if (isProduction) {
      process.exit(1);
    }
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason) => {
    console.error('[FATAL] Unhandled rejection:', reason);
    logError(reason);
    
    // Exit with error in production (for auto-restart by process manager)
    if (isProduction) {
      process.exit(1);
    }
  });
}

/**
 * Apply all error handling middleware to an Express app
 */
export function applyErrorHandlers(app: any): void {
  // Validation error handler (should come first)
  app.use(validationErrorHandler);
  
  // 404 handler for unmatched routes
  app.use(notFoundHandler);
  
  // Main error handler (should be last)
  app.use(errorHandler);
  
  // Set up global error handlers
  setupGlobalErrorHandlers();
}

export default {
  AppError,
  ErrorTypes,
  logError,
  errorHandler,
  notFoundHandler,
  asyncHandler,
  validationErrorHandler,
  applyErrorHandlers,
};