import { NextResponse } from 'next/server';
import { getLiveKitStatus } from '@/lib/livekit/server';

/**
 * GET /api/video/status
 * Check LiveKit configuration status
 * Useful for debugging on Replit
 */
export async function GET() {
  try {
    const status = getLiveKitStatus();
    
    return NextResponse.json({
      ...status,
      message: status.configured 
        ? 'LiveKit is properly configured' 
        : 'LiveKit is not configured. Add LIVEKIT_API_KEY and LIVEKIT_API_SECRET to Replit Secrets.',
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to check status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
