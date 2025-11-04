import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

/**
 * Get the currently authenticated Clerk user
 * @returns Clerk User object or null if not authenticated
 */
export async function getUserFromRequest(request?: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return null;
    }

    // Return Clerk user with standardized format
    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      imageUrl: user.imageUrl,
      role: user.publicMetadata?.role as string || 'student',
      createdAt: user.createdAt,
    };
  } catch (error) {
    // Error getting user - silently fail
    return null;
  }
}

/**
 * Get current user - alias for getUserFromRequest
 */
export async function getCurrentUser(request?: NextRequest) {
  return getUserFromRequest(request);
}

/**
 * Get the Clerk user ID from the current session
 * @returns User ID string or null
 */
export async function getUserId() {
  const { userId } = await auth();
  return userId;
}

/**
 * Require authentication - throws if user is not authenticated
 */
export async function requireAuth() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Authentication required');
  }
  
  return userId;
}

/**
 * Require specific role - throws if user doesn't have required role
 */
export async function requireRole(role: string) {
  const user = await currentUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  const userRole = user.publicMetadata?.role as string;
  
  if (userRole !== role && userRole !== 'admin') {
    throw new Error(`Required role: ${role}`);
  }
  
  return user;
}
