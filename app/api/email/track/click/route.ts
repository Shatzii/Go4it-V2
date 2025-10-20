import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { prospects, campaigns } from '@/shared/schema';
import { eq, sql } from 'drizzle-orm';

// Track email link clicks and redirect
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('id');
    const targetUrl = searchParams.get('url');

    if (!trackingId || !targetUrl) {
      return NextResponse.redirect('https://go4itsports.com');
    }

    // Decode tracking ID
    const decoded = Buffer.from(trackingId, 'base64').toString();
    const [prospectId, campaignId] = decoded.split('-');

    if (prospectId && campaignId) {
      // Update prospect email status
      await db
        .update(prospects)
        .set({
          emailStatus: 'clicked',
          updatedAt: new Date(),
        })
        .where(eq(prospects.id, prospectId));

      // Update campaign statistics
      await db
        .update(campaigns)
        .set({
          totalClicked: sql`${campaigns.totalClicked} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(campaigns.id, campaignId));
    }

    // Redirect to target URL
    const decodedUrl = decodeURIComponent(targetUrl);
    return NextResponse.redirect(decodedUrl);
  } catch (error) {
    console.error('Error tracking email click:', error);
    return NextResponse.redirect('https://go4itsports.com');
  }
}
