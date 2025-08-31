import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Import database connection
    const { db } = await import('@/server/db');
    const { sql } = await import('drizzle-orm');

    // Get all users with their verification status using Drizzle ORM
    const { users } = await import('@/shared/schema');
    const users_result = await db.select().from(users).orderBy(users.createdAt);

    return NextResponse.json({
      success: true,
      users: users_result.map((user) => ({
        id: user.id,
        username: user.username || user.email?.split('@')[0] || 'User',
        email: user.email,
        name:
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.username || user.email?.split('@')[0] || 'User',
        sport: user.sport || 'Multi-Sport',
        position: user.position || 'Athlete',
        role: user.role || 'athlete',
        isVerified: user.isVerified || false,
        garScore: user.garScore || null,
        createdAt: user.createdAt,
        lastLogin: user.lastLoginAt,
        verifiedAt: user.verifiedAt,
        verifiedBy: user.verifiedBy,
      })),
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
