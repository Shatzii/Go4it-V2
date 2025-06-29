import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/auth-token-service';

/**
 * CyberShield Security - Sentinel Middleware
 * 
 * This middleware intercepts all API requests to protected routes and validates the JWT token.
 * It extracts the token from:
 * 1. The Authorization header (Bearer token)
 * 2. Query parameters (for WebSocket connections)
 * 3. Request body
 * 
 * If a valid token is found, the user information is attached to the request object.
 */
export function authSentinel(req: Request, res: Response, next: NextFunction) {
  try {
    // Extract token from various sources
    let token: string | undefined;
    
    // Check Authorization header first (preferred method)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove "Bearer " prefix
    }
    
    // If no token in header, check query parameter (useful for WebSocket)
    if (!token && req.query.token) {
      token = req.query.token as string;
    }
    
    // If still no token, check request body (for form submissions)
    if (!token && req.body && req.body.token) {
      token = req.body.token;
    }
    
    // If no token found, proceed without authentication
    if (!token) {
      return next();
    }
    
    // Verify the token and extract user info
    const payload = verifyAccessToken(token);
    
    if (payload) {
      // Attach token data to request for use in route handlers
      req.token = {
        userId: payload.userId,
        role: payload.role,
        sessionId: payload.sessionId
      };
    }
    
    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    console.error('Auth sentinel error:', error);
    next(); // Continue without authentication on error
  }
}

/**
 * CyberShield Security - Require Authentication
 * 
 * This middleware ensures that a route is only accessible to authenticated users.
 * It should be used after the authSentinel middleware.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  next();
}

/**
 * CyberShield Security - Require Role
 * 
 * This middleware ensures that a route is only accessible to users with specific roles.
 * It should be used after the authSentinel middleware.
 */
export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (!roles.includes(req.token.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: insufficient permissions'
      });
    }
    
    next();
  };
}

/**
 * CyberShield Security - Require Owner or Admin
 * 
 * This middleware ensures that a user can only access their own resources
 * or is an admin who can access any resource.
 * 
 * The userId parameter name in the route can be customized.
 */
export function requireOwnerOrAdmin(userIdParam: string = 'userId') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Admin can access any resource
    if (req.token.role === 'admin') {
      return next();
    }
    
    // For non-admins, check if they're the owner of the resource
    const resourceUserId = parseInt(req.params[userIdParam]);
    
    if (isNaN(resourceUserId) || resourceUserId !== req.token.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: you can only access your own resources'
      });
    }
    
    next();
  };
}