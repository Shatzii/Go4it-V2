import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { prospects, campaigns } from '@/shared/schema';
import { eq, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
// Track email opens via invisible pixel
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('id');

    if (!trackingId) {
      return new NextResponse('Missing tracking ID', { status: 400 });
    }

    // Decode tracking ID
    const decoded = Buffer.from(trackingId, 'base64').toString();
    const [prospectId, campaignId] = decoded.split('-');

    if (prospectId && campaignId) {
      // Update prospect email status
      await db
        .update(prospects)
        .set({
          emailStatus: 'opened',
          updatedAt: new Date(),
        })
        .where(eq(prospects.id, prospectId));

      // Update campaign statistics
      await db
        .update(campaigns)
        .set({
          totalOpened: sql`${campaigns.totalOpened} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(campaigns.id, campaignId));
    }

    // Return 1x1 transparent pixel
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

    return new NextResponse(pixel, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Content-Length': pixel.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('Error tracking email open:', error);

    // Still return pixel to avoid broken images
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

    return new NextResponse(pixel, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Content-Length': pixel.length.toString(),
      },
    });
  }
}
