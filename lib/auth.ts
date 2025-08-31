import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import { db } from './db';
import { users } from '@/shared/schema';
import { eq } from 'drizzle-orm';

const authOptions = {
  session: { strategy: 'jwt' as const },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getUserFromRequest(request?: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return null;
    }

    // Use email for user lookup since NextAuth provides it reliably
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    return user || null;
  } catch (error) {
    console.error('Error getting user from request:', error);
    return null;
  }
}

export async function getCurrentUser(request?: NextRequest) {
  return getUserFromRequest(request);
}
