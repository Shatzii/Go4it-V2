import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId, adminId } = await req.json();

    if (!userId || !adminId) {
      return NextResponse.json(
        { error: 'User ID and Admin ID are required' },
        { status: 400 }
      );
    }

    // Import database connection
    const { db } = await import('@/server/db');
    const { sql } = await import('drizzle-orm');

    // Check if admin has verification privileges
    const adminCheck = await db.execute(
      sql`SELECT role FROM users WHERE id = ${adminId} AND role = 'admin' LIMIT 1`
    );

    if (adminCheck.length === 0) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin privileges required' },
        { status: 403 }
      );
    }

    // Update user verification status
    const result = await db.execute(sql`
      UPDATE users 
      SET is_verified = true, verified_at = NOW(), verified_by = ${adminId}
      WHERE id = ${userId}
      RETURNING id, username, email, is_verified
    `);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User verified successfully',
      user: result[0]
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify user' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, adminId } = await req.json();

    if (!userId || !adminId) {
      return NextResponse.json(
        { error: 'User ID and Admin ID are required' },
        { status: 400 }
      );
    }

    // Import database connection
    const { db } = await import('@/server/db');
    const { sql } = await import('drizzle-orm');

    // Check if admin has verification privileges
    const adminCheck = await db.execute(
      sql`SELECT role FROM users WHERE id = ${adminId} AND role = 'admin' LIMIT 1`
    );

    if (adminCheck.length === 0) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin privileges required' },
        { status: 403 }
      );
    }

    // Remove user verification
    const result = await db.execute(sql`
      UPDATE users 
      SET is_verified = false, verified_at = NULL, verified_by = NULL
      WHERE id = ${userId}
      RETURNING id, username, email, is_verified
    `);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User verification removed successfully',
      user: result[0]
    });

  } catch (error) {
    console.error('Remove verification error:', error);
    return NextResponse.json(
      { error: 'Failed to remove verification' },
      { status: 500 }
    );
  }
}