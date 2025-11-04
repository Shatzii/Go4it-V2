import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subscription, endpoint } = body;

    if (!subscription || !endpoint) {
      return NextResponse.json({ error: 'Missing subscription data' }, { status: 400 });
    }

    // Store the push subscription in your database
    // This would typically save to a pushSubscriptions table
    // await db.insert(pushSubscriptions).values({
    //   userId,
    //   endpoint: subscription.endpoint,
    //   p256dh: subscription.keys.p256dh,
    //   auth: subscription.keys.auth,
    //   createdAt: new Date()
    // });

    return NextResponse.json({ 
      success: true,
      message: 'Push subscription saved successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save push subscription' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
      return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
    }

    // Delete the push subscription from your database
    // await db.delete(pushSubscriptions).where(
    //   and(
    //     eq(pushSubscriptions.userId, userId),
    //     eq(pushSubscriptions.endpoint, endpoint)
    //   )
    // );

    return NextResponse.json({ 
      success: true,
      message: 'Push subscription deleted successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete push subscription' },
      { status: 500 }
    );
  }
}
