import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { requireAuth, getUserId } from '@/lib/auth';
import { findLatestAssessmentForUser } from '@/lib/assessments';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-08-16' });

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  const body = await req.json();
  const { plan, billing, priceId } = body; // priceId should map to Stripe price for monthly/annual

  if (!priceId) return Response.json({ error: 'priceId required' }, { status: 400 });

  // create or retrieve customer by email (for demo we use user's email || id)
  const customerEmail = user.emailAddresses?.[0]?.emailAddress || (user.id as string);
  let customerId: string | null = null;

  // find or create customer
  const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
  if (customers.data.length > 0) customerId = customers.data[0].id;
  else {
    const c = await stripe.customers.create({ email: customerEmail, metadata: { userId: user.id } });
    customerId = c.id;
  }

  // Check assessment credit eligibility
  const assessment = await findLatestAssessmentForUser(customerEmail as string) || await findLatestAssessmentForUser(user.id);
  let applyCredit = false;
  if (assessment) {
    const paidAt = new Date(assessment.paidAt);
    const now = new Date();
    const diffDays = Math.floor((+now - +paidAt) / (1000 * 60 * 60 * 24));
    if (diffDays <= 30) applyCredit = true;
  }

  try {
    if (applyCredit) {
      await stripe.invoiceItems.create({
        customer: customerId!,
        amount: -24900,
        currency: 'usd',
        description: 'Assessment Credit',
      });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId!,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    return Response.json({ ok: true, subscription });
  } catch (err: any) {
    console.error('subscription create failed', err);
    return Response.json({ error: err.message || 'failed' }, { status: 500 });
  }
}
