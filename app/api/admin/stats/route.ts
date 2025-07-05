import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/shared/schema';
import { count, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get total users
    const totalUsersResult = await db.select({ count: count() }).from(users);
    const totalUsers = totalUsersResult[0]?.count || 0;

    // Get active users
    const activeUsersResult = await db.select({ count: count() }).from(users).where(eq(users.isActive, true));
    const activeUsers = activeUsersResult[0]?.count || 0;

    // For now, use placeholder values for videos and analyses
    // These can be updated when the tables are properly defined
    const totalVideos = 0;
    const totalAnalyses = 0;

    const stats = {
      totalUsers,
      activeUsers,
      totalVideos,
      totalAnalyses,
      systemHealth: 'healthy',
      databaseConnections: 1
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}