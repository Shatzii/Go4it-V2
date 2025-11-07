import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Admin verification endpoint
export async function GET(request: NextRequest) {
  // Skip during build phase
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ error: 'Not available during build' }, { status: 503 });
  }

  try {
    // In a production system, you would verify the actual logged-in user
    // For now, we'll check for admin credentials or context

    const adminHeader = request.headers.get('x-admin-access');
    const adminParam = request.nextUrl.searchParams.get('admin');

    // Check if this is an admin access request
    const isAdminAccess = adminHeader === 'true' || adminParam === 'true';

    if (!isAdminAccess) {
      return NextResponse.json(
        { isAdmin: false, message: 'Access denied - Admin credentials required' },
        { status: 403 },
      );
    }

    // Admin access verified
    return NextResponse.json({
      isAdmin: true,
      message: 'Admin access verified for admin@go4itsports.org',
      permissions: ['read', 'write', 'delete', 'manage_users', 'manage_courses', 'system_admin'],
      user: {
        email: 'admin@go4itsports.org',
        role: 'Administrator',
        permissions: 'full_access',
      },
    });
  } catch (error) {
    console.error('Error verifying admin access:', error);
    return NextResponse.json({ isAdmin: false, message: 'Internal server error' }, { status: 500 });
  }
}
