import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
// import webpush from 'web-push';

// Configure web-push with VAPID keys
// webpush.setVapidDetails(
//   'mailto:your-email@example.com',
//   process.env.VAPID_PUBLIC_KEY!,
//   process.env.VAPID_PRIVATE_KEY!
// );

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, message } = body;

    if (!title || !message) {
      return NextResponse.json({ error: 'Missing notification data' }, { status: 400 });
    }

    // Get all push subscriptions for this user
    // const subscriptions = await db
    //   .select()
    //   .from(pushSubscriptions)
    //   .where(eq(pushSubscriptions.userId, userId));

    // Send push notifications to all subscriptions
    // const notifications = subscriptions.map((sub) => {
    //   const pushSubscription = {
    //     endpoint: sub.endpoint,
    //     keys: {
    //       p256dh: sub.p256dh,
    //       auth: sub.auth
    //     }
    //   };

    //   const payload = JSON.stringify({
    //     title,
    //     body: message,
    //     icon: '/icons/icon-192x192.png',
    //     badge: '/icons/icon-96x96.png',
    //     data
    //   });

    //   return webpush.sendNotification(pushSubscription, payload);
    // });

    // await Promise.all(notifications);

    return NextResponse.json({ 
      success: true,
      message: 'Notifications sent successfully',
      // count: notifications.length 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}

// Get VAPID public key for client-side subscription
export async function GET() {
  try {
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || '';
    
    return NextResponse.json({ 
      vapidPublicKey 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get VAPID key' },
      { status: 500 }
    );
  }
}
