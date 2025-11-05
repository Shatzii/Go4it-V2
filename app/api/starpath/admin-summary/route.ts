import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/starpath/admin-summary
 * 
 * Returns complete overview of all athletes for admin dashboard:
 * - Total athletes count
 * - Total audits completed
 * - NCAA on-track percentage
 * - Average GAR score
 * - ARI trend data
 * - Full athlete table data
 * 
 * Admin-only endpoint
 */
export async function GET(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Add admin role check
    // const user = await clerkClient.users.getUser(userId);
    // if (user.publicMetadata.role !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    // }

    // TODO: Replace with actual database queries when DB is connected
    // For now, return mock data structure
    const mockData = {
      stats: {
        totalAthletes: 156,
        totalAudits: 142,
        ncaaOnTrackPercentage: 87.5,
        averageGAR: 11.8,
        averageARI: 78.3,
        newAthletesThisMonth: 23,
      },
      ariTrend: [
        { month: 'Jul', average: 72.5 },
        { month: 'Aug', average: 74.8 },
        { month: 'Sep', average: 76.2 },
        { month: 'Oct', average: 77.1 },
        { month: 'Nov', average: 78.3 },
      ],
      athletes: [
        {
          id: '1',
          name: 'Michael Johnson',
          sport: 'Basketball',
          gradYear: 2026,
          ari: 85,
          garScore: 12.5,
          starRating: 4,
          ncaaStatus: 'on-track',
          progressPercent: 68,
          lastAuditDate: '2025-10-15',
        },
        {
          id: '2',
          name: 'Sarah Williams',
          sport: 'Soccer',
          gradYear: 2027,
          ari: 92,
          garScore: 14.2,
          starRating: 5,
          ncaaStatus: 'on-track',
          progressPercent: 82,
          lastAuditDate: '2025-10-20',
        },
        {
          id: '3',
          name: 'James Rodriguez',
          sport: 'Football',
          gradYear: 2026,
          ari: 68,
          garScore: 9.8,
          starRating: 3,
          ncaaStatus: 'at-risk',
          progressPercent: 45,
          lastAuditDate: '2025-09-12',
        },
        {
          id: '4',
          name: 'Emily Chen',
          sport: 'Volleyball',
          gradYear: 2028,
          ari: 88,
          garScore: 11.5,
          starRating: 4,
          ncaaStatus: 'on-track',
          progressPercent: 73,
          lastAuditDate: '2025-10-28',
        },
        {
          id: '5',
          name: 'Marcus Thompson',
          sport: 'Basketball',
          gradYear: 2026,
          ari: 71,
          garScore: 10.2,
          starRating: 3,
          ncaaStatus: 'needs-review',
          progressPercent: 52,
          lastAuditDate: '2025-08-30',
        },
      ],
      recentAudits: [
        {
          id: 'audit-1',
          athleteName: 'Emily Chen',
          sport: 'Volleyball',
          ari: 88,
          ncaaRiskLevel: 'low',
          createdAt: '2025-10-28',
        },
        {
          id: 'audit-2',
          athleteName: 'Sarah Williams',
          sport: 'Soccer',
          ari: 92,
          ncaaRiskLevel: 'low',
          createdAt: '2025-10-20',
        },
        {
          id: 'audit-3',
          athleteName: 'Michael Johnson',
          sport: 'Basketball',
          ari: 85,
          ncaaRiskLevel: 'low',
          createdAt: '2025-10-15',
        },
      ],
    };

    return NextResponse.json({
      success: true,
      data: mockData,
      message: 'Database not connected - returning mock data',
    });

    /* PRODUCTION CODE - Uncomment when database is ready:
    
    const { db } = await import('@/lib/db');
    const { athletes, transcriptAudits, ncaaTrackerStatus } = await import('@/drizzle/schema/starpath');
    const { count, avg, sql } = await import('drizzle-orm');

    // Get total counts
    const [totalAthletes] = await db.select({ count: count() }).from(athletes);
    const [totalAudits] = await db.select({ count: count() }).from(transcriptAudits);

    // Calculate NCAA on-track percentage
    const [ncaaStats] = await db
      .select({
        onTrack: sql<number>`COUNT(CASE WHEN ${athletes.ncaaStatus} = 'on-track' THEN 1 END)`,
        total: count(),
      })
      .from(athletes);

    const ncaaOnTrackPercentage = (ncaaStats.onTrack / ncaaStats.total) * 100;

    // Get average scores
    const [averages] = await db
      .select({
        avgGAR: avg(athletes.garScore),
        avgARI: avg(athletes.ari),
      })
      .from(athletes);

    // Get all athletes with latest audit info
    const allAthletes = await db
      .select({
        athlete: athletes,
        latestAudit: transcriptAudits,
      })
      .from(athletes)
      .leftJoin(
        transcriptAudits,
        eq(athletes.id, transcriptAudits.athleteId)
      )
      .orderBy(desc(athletes.updatedAt));

    // Get recent audits
    const recentAudits = await db
      .select()
      .from(transcriptAudits)
      .orderBy(desc(transcriptAudits.createdAt))
      .limit(10);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalAthletes: totalAthletes.count,
          totalAudits: totalAudits.count,
          ncaaOnTrackPercentage,
          averageGAR: averages.avgGAR,
          averageARI: averages.avgARI,
        },
        athletes: allAthletes,
        recentAudits,
      },
    });
    */

  } catch (error) {
    console.error('Admin StarPath summary error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch admin summary',
      },
      { status: 500 }
    );
  }
}
