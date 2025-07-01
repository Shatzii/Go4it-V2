/**
 * JWT Authentication System
 * Secure token-based authentication with bcrypt password hashing
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import type { User } from '@shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'shatzii-super-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';
const SALT_ROUNDS = 12;

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export class JWTAuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(userId: number): string {
    return jwt.sign(
      { userId, iat: Date.now() },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  static verifyToken(token: string): { userId: number } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  static async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    const user = await storage.getUserByEmail(email);
    if (!user || !user.password) {
      return null;
    }

    const isValidPassword = await this.comparePassword(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    const token = this.generateToken(user.id);
    
    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword as User,
      token
    };
  }

  static async register(userData: {
    name: string;
    email: string;
    password: string;
    company?: string;
  }): Promise<{ user: User; token: string }> {
    const hashedPassword = await this.hashPassword(userData.password);
    
    const user = await storage.createUser({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      company: userData.company || null,
      role: 'user'
    });

    const token = this.generateToken(user.id);
    
    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword as User,
      token
    };
  }
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  const decoded = JWTAuthService.verifyToken(token);
  if (!decoded) {
    res.status(403).json({ error: 'Invalid or expired token' });
    return;
  }

  try {
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      res.status(403).json({ error: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
};