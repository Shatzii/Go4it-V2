import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId, garScore } = await req.json();

    if (!userId || garScore === undefined) {
      return NextResponse.json(
        { error: 'User ID and GAR Score are required' },
        { status: 400 }
      );
    }

    // Import database connection
    const { db } = await import('@/server/db');
    const { sql } = await import('drizzle-orm');

    // Auto-verify user after GAR analysis completion
    const result = await db.execute(sql`
      UPDATE users 
      SET 
        is_verified = true, 
        verified_at = NOW(), 
        verified_by = 'system',
        gar_score = ${garScore},
        last_gar_analysis = NOW()
      WHERE id = ${userId}
      RETURNING id, username, email, is_verified, gar_score
    `);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Log the verification event
    await db.execute(sql`
      INSERT INTO verification_logs (
        user_id, 
        verification_type, 
        gar_score, 
        created_at
      ) VALUES (
        ${userId},
        'auto_gar_completion',
        ${garScore},
        NOW()
      )
    `);

    return NextResponse.json({
      success: true,
      message: 'User automatically verified after GAR analysis',
      user: result[0],
      verificationBadge: {
        type: 'gar_verified',
        score: garScore,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Auto-verification error:', error);
    return NextResponse.json(
      { error: 'Failed to auto-verify user' },
      { status: 500 }
    );
  }
}