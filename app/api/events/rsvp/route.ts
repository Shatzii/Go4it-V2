import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads, rsvps, parentNightEvents } from '@/lib/db/schema/funnel';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const Body = z.object({
  eventId: z.number(),
  region: z.enum(['eu', 'us']),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  athleteSport: z.string().optional(),
  grade: z.string().optional(),
  referrerCode: z.string().optional(),
  utm: z.record(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = Body.parse(json);

    // Find or create lead
    const existing = await db.select().from(leads).where(eq(leads.email, body.email)).limit(1);
    let leadId: number;
    const now = new Date();
    if (existing.length) {
      leadId = existing[0].id;
      // Update UTM + last activity on existing lead
      try {
        await db.update(leads).set({
          utmSource: body.utm?.utm_source,
          utmMedium: body.utm?.utm_medium,
          utmCampaign: body.utm?.utm_campaign,
          utmTerm: body.utm?.utm_term,
          utmContent: body.utm?.utm_content,
          lastActivity: now,
          updatedAt: now,
        }).where(eq(leads.id, leadId));
      } catch {}
    } else {
      const inserted = await db.insert(leads).values({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        sport: body.athleteSport,
        utmSource: body.utm?.utm_source,
        utmMedium: body.utm?.utm_medium,
        utmCampaign: body.utm?.utm_campaign,
        utmTerm: body.utm?.utm_term,
        utmContent: body.utm?.utm_content,
        stage: 'site_visit',
        lastActivity: now,
      }).returning({ id: leads.id });
      leadId = inserted[0].id;
    }

    // Verify event exists
    const ev = await db.select().from(parentNightEvents).where(eq(parentNightEvents.id, body.eventId)).limit(1);
    if (!ev.length) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    // Upsert RSVP (simple insert; duplicates allowed by design for now)
    await db.insert(rsvps).values({ leadId, eventId: body.eventId, status: 'registered' });

    // Progress stage heuristically based on event kind
    try {
      const kind = ev[0].kind;
      const stage = kind === 'parent_night_info' ? 'rsvp_tue' : (kind === 'parent_night_decision' ? 'rsvp_thu' : 'site_visit');
      await db.update(leads).set({ stage, lastActivity: now, updatedAt: now }).where(eq(leads.id, leadId));
    } catch {}

    const res = NextResponse.json({ leadId, event: ev[0] });
    // Persist lead id for downstream analytics enrichment and UX continuity
    try {
      const expires = new Date(Date.now() + 180 * 864e5); // ~180 days
      res.cookies.set('g4t_lead', String(leadId), {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires,
      });
      // Track last RSVP (event id + region) for decision-night prompts
      const rsvpVal = `${body.eventId}:${body.region}`;
      res.cookies.set('g4t_rsvp', rsvpVal, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + 14 * 864e5), // 14 days
      });
      // Initialize stage cookie if absent
      res.cookies.set('g4t_stage', 'rsvp', {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires,
      });
    } catch {}
    return res;
  } catch (e: any) {
    if (e?.name === 'ZodError') return NextResponse.json({ error: e.message }, { status: 400 });
    return NextResponse.json({ error: 'Failed to RSVP' }, { status: 500 });
  }
}
