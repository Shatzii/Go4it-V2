import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { users } from '@/shared/schema';
import { eq } from 'drizzle-orm';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Query the existing users table
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .limit(1);

          if (!user) {
            return null;
          }

          // Check password against existing hashed password
          // Your existing system uses a custom hashing approach
          const [hashedPart, salt] = user.password.split('.');
          const crypto = require('crypto');
          const testHash = crypto
            .pbkdf2Sync(credentials.password, salt, 10000, 64, 'sha512')
            .toString('hex');

          if (testHash !== hashedPart) {
            return null;
          }

          // Update last login
          await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            role: user.role,
            image: user.profileImage,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
