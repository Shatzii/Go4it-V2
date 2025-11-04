import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  try {
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, profile_image_url } = evt.data;

      const email = email_addresses[0]?.email_address;

      if (!email) {
        return new NextResponse('No email found', { status: 400 });
      }

      // Upsert the user into our database
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.clerkUserId, id))
        .limit(1);

      if (existingUser.length > 0) {
        // Update existing user
        await db
          .update(users)
          .set({
            email,
            firstName: first_name,
            lastName: last_name,
            profileImageUrl: profile_image_url,
            updatedAt: new Date(),
          })
          .where(eq(users.clerkUserId, id));
      } else {
        // Create new user
        await db.insert(users).values({
          clerkUserId: id,
          email,
          firstName: first_name,
          lastName: last_name,
          profileImageUrl: profile_image_url,
        });
      }
    } else if (eventType === 'user.deleted') {
      const { id } = evt.data;
      // Delete user from our database
      await db.delete(users).where(eq(users.clerkUserId, id));
    }

    return new NextResponse('Webhook processed', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
