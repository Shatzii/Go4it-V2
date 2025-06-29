import { Request, Response, NextFunction } from 'express';

// Middleware to check if user is authenticated
export function isAuthenticatedMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  
  // Check for Bearer token authentication
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      // Verify token using the service
      const { verifyAccessToken } = require('../services/auth-token-service');
      const payload = verifyAccessToken(token);
      
      if (payload) {
        // Set user info from token payload
        req.user = {
          id: payload.userId,
          role: payload.role
        };
        return next();
      }
    } catch (error) {
      console.error('Token verification error:', error);
    }
  }
  
  return res.status(401).json({ message: 'Unauthorized' });
}

// Middleware to check if user is admin
export function isAdminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated && req.isAuthenticated() && req.user && (req.user as any).role === 'admin') {
    return next();
  }
  
  // Check for Bearer token authentication
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      // Verify token using the service
      const { verifyAccessToken } = require('../services/auth-token-service');
      const payload = verifyAccessToken(token);
      
      if (payload && payload.role === 'admin') {
        // Set user info from token payload
        req.user = {
          id: payload.userId,
          role: payload.role
        };
        return next();
      }
    } catch (error) {
      console.error('Token verification error:', error);
    }
  }
  
  return res.status(403).json({ message: 'Forbidden - Admin access required' });
}

// Middleware to check if user is coach
export function isCoachMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated && req.isAuthenticated() && req.user && 
      ((req.user as any).role === 'coach' || (req.user as any).role === 'admin')) {
    return next();
  }
  
  // Check for Bearer token authentication
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      // Verify token using the service
      const { verifyAccessToken } = require('../services/auth-token-service');
      const payload = verifyAccessToken(token);
      
      if (payload && (payload.role === 'coach' || payload.role === 'admin')) {
        // Set user info from token payload
        req.user = {
          id: payload.userId,
          role: payload.role
        };
        return next();
      }
    } catch (error) {
      console.error('Token verification error:', error);
    }
  }
  
  return res.status(403).json({ message: 'Forbidden - Coach access required' });
}