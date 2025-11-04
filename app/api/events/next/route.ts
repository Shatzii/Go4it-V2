import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parentNightEvents } from '@/lib/db/schema/funnel';
import { and, eq, gt } from 'drizzle-orm';

// GET /api/events/next?region=eu|us&limit=2
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get('region') || undefined;
  const limit = Number(searchParams.get('limit') || '2');

  const nowIso = new Date().toISOString();
  try {
    const where = region ? and(eq(parentNightEvents.region, region), gt(parentNightEvents.startIso, nowIso)) : gt(parentNightEvents.startIso, nowIso);
    const rows = await db.select().from(parentNightEvents).where(where).orderBy(parentNightEvents.startIso).limit(limit);
    return NextResponse.json({ events: rows });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
