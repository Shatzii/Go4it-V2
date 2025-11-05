import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createLiveKitToken, createHostToken, createRoom, canAccessRoom } from '@/lib/livekit/server';

/**
 * POST /api/video/token
 * Generate a LiveKit access token for a user to join a video room
 * 
 * Body:
 * {
 *   roomName: string;
 *   roomType?: 'team' | 'parent-night' | 'coaching';
 *   isHost?: boolean;
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { roomName, roomType = 'team', isHost = false } = body;

    if (!roomName) {
      return NextResponse.json(
        { error: 'roomName is required' },
        { status: 400 }
      );
    }

    // Get user info from Clerk
    const clerkUser = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then(res => res.json());

    const userName = clerkUser.firstName && clerkUser.lastName
      ? `${clerkUser.firstName} ${clerkUser.lastName}`
      : clerkUser.username || userId;

    const userRole = clerkUser.publicMetadata?.role || 'user';

    // Check room access
    if (!canAccessRoom(userId, userRole, roomType)) {
      return NextResponse.json(
        { error: 'Access denied to this room' },
        { status: 403 }
      );
    }

    // Create or get the room
    await createRoom(roomName, {
      maxParticipants: roomType === 'parent-night' ? 500 : 50,
      emptyTimeout: 600, // 10 minutes
      metadata: JSON.stringify({
        type: roomType,
        createdAt: new Date().toISOString(),
      }),
    });

    // Generate token
    const token = isHost
      ? await createHostToken(roomName, userName, JSON.stringify({ userId, role: userRole }))
      : await createLiveKitToken(roomName, userName, JSON.stringify({ userId, role: userRole }));

    return NextResponse.json({
      token,
      roomName,
      serverUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL,
      userName,
      isHost,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate token', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
