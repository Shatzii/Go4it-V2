import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { db } from '@/server/db';
import { users } from '@/shared/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    const [user] = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      dateOfBirth: users.dateOfBirth,
      position: users.position,
      sport: users.sport,
      role: users.role
    }).from(users)
    .where(eq(users.id, decoded.userId))
    .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}