import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  // Build-time safety: skip during static generation
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
  }

  try {
    const userId = parseInt(params.id);
    const { isActive } = await request.json();

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    await db.update(users).set({ isActive: isActive }).where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin toggle user error:', error);
    return NextResponse.json({ error: 'Failed to toggle user status' }, { status: 500 });
  }
}
