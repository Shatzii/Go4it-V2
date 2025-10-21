import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find the user in our DB based on their Clerk ID
    const user = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        location: users.location,
      })
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1);

    if (user.length === 0) {
      return new NextResponse('User not found in database', { status: 404 });
    }

    return NextResponse.json(user[0]);
  } catch (error) {
    console.error('[USER_ME_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
