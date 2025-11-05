import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';

/**
 * LiveKit Server Utilities
 * Handles token generation and room management for video calls
 * Optimized for Replit deployment with proper environment variable handling
 */

const apiKey = process.env.LIVEKIT_API_KEY || '';
const apiSecret = process.env.LIVEKIT_API_SECRET || '';
const livekitUrl = process.env.LIVEKIT_URL || 'ws://localhost:7880';

/**
 * Check if LiveKit is properly configured
 */
export function isLiveKitConfigured(): boolean {
  return !!(apiKey && apiSecret);
}

/**
 * Get configuration status for debugging
 */
export function getLiveKitStatus() {
  return {
    configured: isLiveKitConfigured(),
    hasApiKey: !!apiKey,
    hasApiSecret: !!apiSecret,
    serverUrl: livekitUrl,
  };
}

/**
 * Create an access token for a participant to join a room
 */
export async function createLiveKitToken(
  roomName: string,
  participantName: string,
  participantMetadata?: string
): Promise<string> {
  if (!isLiveKitConfigured()) {
    throw new Error(
      'LiveKit is not configured. Please set LIVEKIT_API_KEY and LIVEKIT_API_SECRET in your environment variables (Replit Secrets).'
    );
  }

  const token = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    ...(participantMetadata && { metadata: participantMetadata }),
  });

  // Grant permissions
  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return await token.toJwt();
}

/**
 * Create a host token with additional permissions (recording, moderation)
 */
export async function createHostToken(
  roomName: string,
  hostName: string,
  hostMetadata?: string
): Promise<string> {
  if (!isLiveKitConfigured()) {
    throw new Error(
      'LiveKit is not configured. Please set LIVEKIT_API_KEY and LIVEKIT_API_SECRET in your environment variables (Replit Secrets).'
    );
  }

  const token = new AccessToken(apiKey, apiSecret, {
    identity: hostName,
    ...(hostMetadata && { metadata: hostMetadata }),
  });

  // Grant full permissions for host
  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    roomAdmin: true, // Can kick participants, update room settings
    roomRecord: true, // Can start/stop recording
  });

  return await token.toJwt();
}

/**
 * Get room service client for server-side room management
 */
export function getRoomServiceClient(): RoomServiceClient {
  if (!isLiveKitConfigured()) {
    throw new Error(
      'LiveKit is not configured. Please set LIVEKIT_API_KEY and LIVEKIT_API_SECRET in your environment variables (Replit Secrets).'
    );
  }

  return new RoomServiceClient(livekitUrl, apiKey, apiSecret);
}

/**
 * Create or get a room
 * Optimized for Replit: auto-cleanup and resource limits
 */
export async function createRoom(
  roomName: string,
  options?: {
    maxParticipants?: number;
    emptyTimeout?: number; // seconds until empty room is deleted
    metadata?: string;
  }
) {
  const roomService = getRoomServiceClient();
  
  try {
    const room = await roomService.createRoom({
      name: roomName,
      emptyTimeout: options?.emptyTimeout || 600, // 10 minutes default (save resources on Replit)
      maxParticipants: options?.maxParticipants || 50, // Limit for Replit memory constraints
      metadata: options?.metadata || '',
    });
    
    return room;
  } catch (error) {
    // Room might already exist, try to get it
    const rooms = await roomService.listRooms([roomName]);
    if (rooms.length > 0) {
      return rooms[0];
    }
    throw error;
  }
}

/**
 * List all active rooms
 */
export async function listActiveRooms() {
  const roomService = getRoomServiceClient();
  return await roomService.listRooms();
}

/**
 * Get participants in a room
 */
export async function listParticipants(roomName: string) {
  const roomService = getRoomServiceClient();
  return await roomService.listParticipants(roomName);
}

/**
 * Remove a participant from a room
 */
export async function removeParticipant(roomName: string, participantIdentity: string) {
  const roomService = getRoomServiceClient();
  return await roomService.removeParticipant(roomName, participantIdentity);
}

/**
 * Delete a room
 */
export async function deleteRoom(roomName: string) {
  const roomService = getRoomServiceClient();
  return await roomService.deleteRoom(roomName);
}

/**
 * Helper to generate room name from context
 */
export function generateRoomName(type: 'team' | 'parent-night' | 'coaching', id: string): string {
  return `${type}-${id}-${Date.now()}`;
}

/**
 * Helper to validate room access
 */
export function canAccessRoom(
  userId: string,
  userRole: string,
  roomType: 'team' | 'parent-night' | 'coaching',
  roomOwnerId?: string
): boolean {
  // Admin can access everything
  if (userRole === 'admin') return true;

  // Parent nights are open to registered users
  if (roomType === 'parent-night') return true;

  // Team rooms require team membership (check in calling code)
  if (roomType === 'team') return true; // Caller should verify team membership

  // Coaching sessions require being the athlete or coach
  if (roomType === 'coaching') {
    return userId === roomOwnerId || userRole === 'coach';
  }

  return false;
}
