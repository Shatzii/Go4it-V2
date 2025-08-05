// Authentication utilities for the Go4It Sports platform
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  sport?: string;
  position?: string;
  garScore?: number;
  subscriptionTier?: string;
  subscriptionStatus?: 'active' | 'inactive' | 'trial';
}

export async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      // Check for token in cookies as fallback
      const cookieToken = request.cookies.get('auth-token')?.value;
      if (!cookieToken) {
        return null;
      }
      return verifyToken(cookieToken);
    }

    return verifyToken(token);
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      sport: decoded.sport,
      position: decoded.position,
      garScore: decoded.garScore,
      subscriptionTier: decoded.subscriptionTier,
      subscriptionStatus: decoded.subscriptionStatus
    };
  } catch (error) {
    return null;
  }
}

export function generateToken(user: User): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export function requireAuth(handler: (request: NextRequest, user: User) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await getUserFromRequest(request);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return handler(request, user);
  };
}