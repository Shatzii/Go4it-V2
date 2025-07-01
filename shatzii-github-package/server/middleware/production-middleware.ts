/**
 * Production Middleware
 * Request logging, rate limiting, and error handling for production deployment
 */

import { Request, Response, NextFunction } from 'express';

export interface ProductionRequest extends Request {
  requestId?: string;
  startTime?: number;
}

// Request logging middleware
export const requestLogger = (req: ProductionRequest, res: Response, next: NextFunction) => {
  req.requestId = Math.random().toString(36).substr(2, 9);
  req.startTime = Date.now();
  
  const { method, url, ip } = req;
  console.log(`[${new Date().toISOString()}] ${req.requestId} ${method} ${url} - ${ip}`);
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - (req.startTime || 0);
    const { statusCode } = res;
    console.log(`[${new Date().toISOString()}] ${req.requestId} ${method} ${url} - ${statusCode} (${duration}ms)`);
  });
  
  next();
};

// Rate limiting middleware
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    
    // Clean expired entries
    const entries = Array.from(rateLimitStore.entries());
    for (const [key, value] of entries) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    }
    
    const clientData = rateLimitStore.get(clientId);
    
    if (!clientData) {
      rateLimitStore.set(clientId, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }
    
    if (now > clientData.resetTime) {
      clientData.count = 1;
      clientData.resetTime = now + windowMs;
      next();
      return;
    }
    
    if (clientData.count >= maxRequests) {
      res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
      });
      return;
    }
    
    clientData.count++;
    next();
  };
};

// Error handling middleware
export const errorHandler = (error: any, req: ProductionRequest, res: Response, next: NextFunction) => {
  const requestId = req.requestId || 'unknown';
  const timestamp = new Date().toISOString();
  
  // Log error details
  console.error(`[${timestamp}] ERROR ${requestId}:`, {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params
  });
  
  // Determine error type and response
  let statusCode = 500;
  let message = 'Internal Server Error';
  
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (error.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (error.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Not Found';
  } else if (error.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Service Unavailable';
  }
  
  // Send error response
  res.status(statusCode).json({
    error: true,
    message,
    requestId,
    timestamp,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      details: error 
    })
  });
};

// Health check middleware
export const healthCheck = (req: Request, res: Response) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
    memory: {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB'
    },
    environment: process.env.NODE_ENV || 'development'
  });
};

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  if (req.secure || req.get('x-forwarded-proto') === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
};

// CORS middleware for production
export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    'https://shatzii.com',
    'https://www.shatzii.com',
    'https://app.shatzii.com'
  ];
  
  const origin = req.get('Origin');
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
};