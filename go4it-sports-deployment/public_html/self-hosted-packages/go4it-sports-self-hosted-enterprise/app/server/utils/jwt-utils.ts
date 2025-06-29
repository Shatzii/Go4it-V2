import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

// Load environment variables for JWT
const JWT_SECRET = process.env.JWT_SECRET || randomBytes(32).toString('hex');
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || randomBytes(32).toString('hex');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Token payload interface
interface TokenPayload {
  userId: number;
  role: string;
  sessionId?: string;
}

// Generate JWT access token
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Generate JWT refresh token
export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
}

// Generate both tokens for authentication
export function generateTokens(userId: number, role: string, fingerprint: string): { accessToken: string, refreshToken: string } {
  // Create a unique session ID
  const sessionId = `${userId}-${fingerprint}-${Date.now()}-${randomBytes(8).toString('hex')}`;
  
  const accessToken = generateAccessToken({ userId, role, sessionId });
  const refreshToken = generateRefreshToken({ userId, role, sessionId });
  
  return { accessToken, refreshToken };
}

// Verify JWT access token
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Verify JWT refresh token
export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}