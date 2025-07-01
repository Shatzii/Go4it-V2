import { Request, Response, NextFunction } from 'express';

export function clerkBridge(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers['x-user-id'] as string;
  
  if (userId) {
    req.user = { id: parseInt(userId) };
  }
  
  next();
}