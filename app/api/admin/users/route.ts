import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    
    return NextResponse.json({ users: allUsers });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}