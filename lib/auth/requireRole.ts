import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

/**
 * Role-based access control guard
 * Checks if user has required role from Clerk metadata
 */
export async function requireRole(allowedRoles: string[]) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get role from Clerk public metadata
  const userRole = (sessionClaims?.publicMetadata as { role?: string })?.role;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return {
      authorized: false,
      userId,
      role: userRole,
    };
  }

  return {
    authorized: true,
    userId,
    role: userRole,
  };
}

/**
 * Student-only access guard
 */
export async function requireStudent() {
  return requireRole(['student', 'admin']);
}

/**
 * Coach-only access guard
 */
export async function requireCoach() {
  return requireRole(['coach', 'admin']);
}

/**
 * Admin-only access guard
 */
export async function requireAdmin() {
  return requireRole(['admin']);
}
