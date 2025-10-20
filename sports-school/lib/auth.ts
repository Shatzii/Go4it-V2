import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  schoolId?: string;
  profile?: any;
}

export interface AuthToken {
  userId: string;
  email: string;
  role: string;
  schoolId?: string;
  iat: number;
  exp: number;
}

// Generate JWT token
export function generateToken(user: User): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
}

// Verify JWT token
export function verifyToken(token: string): AuthToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthToken;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Extract user from request
export function getUserFromRequest(request: NextRequest): AuthToken | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyToken(token);
}

// Middleware for protected routes
export function requireAuth(allowedRoles?: string[]) {
  return (request: NextRequest) => {
    const user = getUserFromRequest(request);

    if (!user) {
      return { error: 'Authentication required', status: 401 };
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return { error: 'Insufficient permissions', status: 403 };
    }

    return { user };
  };
}

// Session management
export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  lastActivity: Date;
}

const activeSessions = new Map<string, Session>();

export function createSession(userId: string): Session {
  const sessionId = crypto.randomUUID();
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    createdAt: new Date(),
    lastActivity: new Date(),
  };

  activeSessions.set(sessionId, session);
  return session;
}

export function getSession(sessionId: string): Session | null {
  const session = activeSessions.get(sessionId);
  if (!session || session.expiresAt < new Date()) {
    activeSessions.delete(sessionId);
    return null;
  }

  // Update last activity
  session.lastActivity = new Date();
  activeSessions.set(sessionId, session);

  return session;
}

export function destroySession(sessionId: string): void {
  activeSessions.delete(sessionId);
}
