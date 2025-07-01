import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

// Simple auth middleware without complex session typing
export function requireAuth(req: any, res: Response, next: NextFunction) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

export async function getCurrentUser(req: any) {
  if (!req.session || !req.session.userId) {
    return null;
  }
  
  try {
    const user = await storage.getUser(req.session.userId);
    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}