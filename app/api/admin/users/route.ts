import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Import database connection
    const { db } = await import('@/server/db');
    const { sql } = await import('drizzle-orm');

    // Get all users with their verification status
    const users = await db.execute(sql`
      SELECT 
        id,
        username,
        email,
        COALESCE(first_name || ' ' || last_name, username) as name,
        sport,
        position,
        role,
        is_verified,
        gar_score,
        created_at,
        last_login_at,
        verified_at,
        verified_by
      FROM users 
      ORDER BY created_at DESC
    `);

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        sport: user.sport,
        position: user.position,
        role: user.role,
        isVerified: user.is_verified,
        garScore: user.gar_score,
        createdAt: user.created_at,
        lastLogin: user.last_login_at,
        verifiedAt: user.verified_at,
        verifiedBy: user.verified_by
      }))
    });

  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}