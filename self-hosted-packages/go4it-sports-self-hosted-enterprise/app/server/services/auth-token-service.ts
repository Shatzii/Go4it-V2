import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { userTokens } from '../../shared/schema';
import { eq, and, sql } from 'drizzle-orm';

// Secret key for JWT signing - should ideally be in environment variables
// For Go4It CyberShield production, this would be a very secure key stored in a vault
const JWT_SECRET = process.env.JWT_SECRET || 'go4it-cybershield-secure-jwt-key';
const ACCESS_TOKEN_EXPIRY = '15m';  // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d';  // 7 days

/**
 * Generate both access and refresh tokens for a user
 */
export async function generateTokens(userId: number, role: string, deviceFingerprint?: string) {
  try {
    // Create a unique session ID for this login session
    const sessionId = uuidv4();
    
    // Generate access token
    const accessToken = jwt.sign(
      { userId, role, sessionId, type: 'access' },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    
    // Generate refresh token with longer expiry
    const refreshToken = jwt.sign(
      { userId, role, sessionId, type: 'refresh' },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
    
    // Get expiry date for database storage
    const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;
    const expiresAt = new Date(decoded.exp! * 1000);
    
    // Store refresh token in database
    // Note: We're storing the token directly in the token_hash field
    // This matches the actual database structure
    await db.insert(userTokens).values({
      userId,
      tokenHash: refreshToken, // For production, consider hashing this token instead
      sessionId: decoded.sessionId || 'web-session',
      expiresAt,
      lastUsed: new Date(),
      deviceFingerprint: deviceFingerprint || 'web-app' // Use provided fingerprint or default
    });
    
    return {
      accessToken,
      refreshToken,
      expiresAt: expiresAt.toISOString()
    };
  } catch (error) {
    console.error('Token generation error:', error);
    throw error;
  }
}

/**
 * Verify an access token and return its payload if valid
 */
export function verifyAccessToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    
    // Ensure this is an access token
    if (decoded.type !== 'access') {
      return null;
    }
    
    return {
      userId: decoded.userId,
      role: decoded.role,
      sessionId: decoded.sessionId
    };
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Use a refresh token to generate a new access token
 */
export async function refreshAccessToken(refreshToken: string) {
  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as jwt.JwtPayload;
    
    // Ensure this is a refresh token
    if (decoded.type !== 'refresh') {
      return null;
    }
    
    // Check if token exists in database
    const [tokenRecord] = await db
      .select()
      .from(userTokens)
      .where(
        and(
          eq(userTokens.tokenHash, refreshToken),
          eq(userTokens.userId, decoded.userId),
          eq(userTokens.sessionId, decoded.sessionId || 'web-session')
        )
      );
    
    if (!tokenRecord) {
      // Token not found in database
      return null;
    }
    
    // Token is valid, update last used time (using lastUsed field to match DB schema)
    await db
      .update(userTokens)
      .set({ lastUsed: new Date() })
      .where(eq(userTokens.id, tokenRecord.id));
    
    // Generate new access token
    const accessToken = jwt.sign(
      { 
        userId: decoded.userId, 
        role: decoded.role, 
        sessionId: decoded.sessionId,
        type: 'access'
      },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    
    return {
      accessToken,
      refreshToken,  // Return same refresh token, it's still valid
      expiresAt: tokenRecord.expiresAt ? tokenRecord.expiresAt.toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

/**
 * Invalidate all tokens for a specific user
 */
export async function invalidateUserTokens(userId: number) {
  try {
    await db
      .delete(userTokens)
      .where(eq(userTokens.userId, userId));
    
    return true;
  } catch (error) {
    console.error('Error invalidating user tokens:', error);
    return false;
  }
}

/**
 * Invalidate a specific session
 */
export async function invalidateSession(sessionId: string) {
  try {
    // We have an actual sessionId column in the database
    await db
      .delete(userTokens)
      .where(eq(userTokens.sessionId, sessionId));
    
    return true;
  } catch (error) {
    console.error('Error invalidating session:', error);
    return false;
  }
}

/**
 * Clean up expired tokens from the database
 * This should be run periodically by a scheduled task
 */
export async function cleanupExpiredTokens() {
  try {
    const now = new Date();
    
    const result = await db
      .delete(userTokens)
      .where(sql`${userTokens.expiresAt} < ${now}`);
    
    return true;
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
    return false;
  }
}