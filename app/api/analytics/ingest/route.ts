import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema/funnel';
import { eq } from 'drizzle-orm';

// Proxy client analytics to PostHog server-side to avoid exposing secrets
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return NextResponse.json({ error: 'PostHog key missing' }, { status: 501 });

    // Respect DNT when possible
    const dnt = (req.headers.get('DNT') || '0') === '1';
    if (dnt) return NextResponse.json({ status: 'skipped_dnt' });

    // Read UTMs from cookie set by UTMProvider
  const utm: Record<string, string> = {};
    try {
      const jar = await cookies();
      const raw = jar.get('g4t_utm')?.value;
      if (raw) {
        const parsed = JSON.parse(raw);
        // whitelist expected UTM keys
        ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach((k) => {
          const v = parsed?.[k];
          if (typeof v === 'string' && v.length) utm[k] = v;
        });
      }
    } catch {}

    // Clerk user id if available
    let userId: string | undefined;
    try {
      const a = await auth();
      // some Clerk versions expose userId directly, others under sessionClaims
      // prefer direct, fallback to claims
      userId = (a as any)?.userId || (a as any)?.sessionClaims?.sub || undefined;
    } catch {}

    // Lead context and offer variant enrichment
    let leadId: number | undefined = body?.properties?.leadId ?? body?.leadId;
    if (typeof leadId !== 'number') {
      // attempt cookie fallback if you later set one like 'g4t_lead'
      try {
        const jar = await cookies();
        const rawLead = jar.get('g4t_lead')?.value;
        const n = rawLead ? parseInt(rawLead) : NaN;
        if (!Number.isNaN(n)) leadId = n;
      } catch {}
    }
    let offerVariant: string | undefined = body?.properties?.offerVariant ?? body?.offerVariant;
    if (!offerVariant && typeof leadId === 'number') {
      try {
        const rows = await db.select({ ov: leads.offerVariant }).from(leads).where(eq(leads.id, leadId)).limit(1);
        offerVariant = rows[0]?.ov || undefined;
      } catch {}
    }

    // Ensure distinct_id presence for PostHog, mint device id if needed
    const jarForRead = await cookies();
    let deviceId = jarForRead.get('g4t_did')?.value;
    if (!deviceId) {
      // generate a compact UUIDv4
      const u = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxxyxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      deviceId = `did:${u}`;
    }
    const distinctId = body?.distinct_id || userId || (typeof leadId === 'number' ? `lead:${leadId}` : deviceId);

    // Merge/enrich properties
    const baseProps = (body?.properties && typeof body.properties === 'object') ? body.properties : {};
    const properties = {
      ...baseProps,
      // normalized keys
      user_id: userId,
      lead_id: leadId,
      offer_variant: offerVariant,
      ...utm,
    };

    const payload = {
      event: body?.event || '$custom_event',
      properties,
      api_key: key,
      distinct_id: distinctId,
      timestamp: body?.timestamp || new Date().toISOString(),
    };

    const res = await fetch(`${apiHost}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return NextResponse.json({ error: 'Upstream error' }, { status: 502 });
    // Write device id if we minted one
    const out = NextResponse.json({ ok: true });
    try {
      if (!jarForRead.get('g4t_did')) {
        out.cookies.set('g4t_did', deviceId, {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          expires: new Date(Date.now() + 365 * 864e5),
        });
      }
    } catch {}
    return out;
  } catch (e) {
    return NextResponse.json({ error: 'Failed to proxy analytics' }, { status: 500 });
  }
}
