import { NextRequest, NextResponse } from 'next/server';
import { socialMediaPublisher } from '@/lib/social-media-publisher';

export async function POST(req: NextRequest) {
  try {
    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const result = await socialMediaPublisher.publishNow(postId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Post published successfully',
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to publish post',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
