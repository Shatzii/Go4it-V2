import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = (req.session as any)?.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Verify user exists
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add userId to request for use in controllers
    req.userId = userId;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};