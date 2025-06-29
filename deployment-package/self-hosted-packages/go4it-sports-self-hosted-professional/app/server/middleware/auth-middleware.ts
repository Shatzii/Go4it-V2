import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/auth-token-service";
import { storage } from "../storage";

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to verify if user is authenticated
 */
export const isAuthenticatedMiddleware = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // Check for authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // Extract and verify the token
  const token = authHeader.substring(7);
  const payload = verifyAccessToken(token);
  
  if (!payload) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    // Get user from database
    const user = await storage.getUser(payload.userId);
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role || 'user'
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "Authentication error" });
  }
};

/**
 * Middleware to check if user has required role
 */
export const hasRoleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // First check if authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Check role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Permission denied" });
    }

    next();
  };
};

/**
 * Admin-only middleware
 */
export const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // First check if authenticated
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // Check role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};