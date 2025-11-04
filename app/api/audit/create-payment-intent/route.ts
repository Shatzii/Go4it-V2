import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { pickOffer } from '@/lib/offers/offerPicker';
import { db } from '@/lib/db';
import { creditAudits } from '@/lib/db/schema/go4it_os';
import { leads } from '@/lib/db/schema/funnel';
import { eq } from 'drizzle-orm';

const Body = z.object({
  leadId: z.number(),
  paymentPlan: z.enum(['full', 'deposit', 'split']).default('full'),
  offerVariant: z.enum(['credit_299', 'deposit_199', 'split_2x159']).optional(),
});

function calcAmountCents(plan: 'full'|'deposit'|'split') {
  switch (plan) {
    case 'full': return 29900;
    case 'deposit': return 19900;
    case 'split': return 15900;
  }
}

export async function POST(req: Request) {
  try {
    const body = Body.parse(await req.json());
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return NextResponse.json({ error: 'Stripe not configured' }, { status: 501 });
  const stripe = new Stripe(key);

    const offerVariant = body.offerVariant ?? pickOffer();
    const amount = calcAmountCents(body.paymentPlan);
    const pi = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        tuition_credit_cents: '29900',
        lead_id: String(body.leadId),
        offer_variant: offerVariant,
      },
      description: 'Go4it Credit Audit',
      automatic_payment_methods: { enabled: true },
    });
    // Best-effort DB record (safe if DB configured)
    try {
      await db.insert(creditAudits).values({
        leadId: body.leadId,
        amountCents: amount,
        status: 'created',
        stripePi: pi.id,
        offerVariant,
      });
      const now = new Date();
      await db.update(leads).set({ offerVariant, lastActivity: now, updatedAt: now }).where(eq(leads.id, body.leadId));
    } catch {}

    const res = NextResponse.json({ clientSecret: pi.client_secret, amount, auditId: pi.id, offerVariant });
    // Best-effort: set lead cookie if not already present to help analytics attribution
    try {
      const expires = new Date(Date.now() + 180 * 864e5);
      res.cookies.set('g4t_lead', String(body.leadId), {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires,
      });
      // Stick offer variant for consistent messaging pre-lead merge
      if (offerVariant) {
        res.cookies.set('g4t_offer', offerVariant, {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          expires,
        });
      }
    } catch {}
    return res;
  } catch (e: any) {
    if (e?.name === 'ZodError') return NextResponse.json({ error: e.message }, { status: 400 });
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
