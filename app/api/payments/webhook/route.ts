import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { addAssessment } from '@/lib/assessments';
import { addEnrollment } from '@/lib/enrollments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2023-08-16' }) : null;

export async function POST(req: NextRequest) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook not configured' }, { status: 500 });
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const buf = await req.arrayBuffer();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      const full = await stripe.checkout.sessions.retrieve(session.id as string, { expand: ['line_items'] });
      const lineItems = (full as any).line_items?.data || [];
      const isStarpath = lineItems.some((li: any) => {
        const name = li.description || li.price?.product || li.price?.nickname || li.price?.product;
        return String(name || '').toLowerCase().includes('starpath');
      });

      if (isStarpath) {
        const metadata = (full as any).metadata || session.metadata || {};
        const userIdFromMeta = metadata.userId || metadata.user_id || '';
        const enrollmentIdFromMeta = metadata.enrollmentId || metadata.enrollment_id || '';
        const userId = userIdFromMeta || session.customer_email || '';
        const assessmentId = session.id as string;
        await addAssessment({ id: assessmentId, userId, paidAt: new Date().toISOString(), zoomAddon: false });
        if (enrollmentIdFromMeta) {
          console.log('Checkout linked to enrollment:', enrollmentIdFromMeta, 'session:', assessmentId);
        }
      }

      try {
        const metadata = (full as any).metadata || session.metadata || {};
        const userIdFromMeta = metadata.userId || metadata.user_id || '';
        const userId = userIdFromMeta || session.customer_email || '';
        const productIdFromMeta = metadata.productId || '';
        const amount =
          (full as any).amount_total ||
          (full as any).display_items?.reduce?.((s: number, i: any) => s + (i.amount || 0), 0) ||
          0;

        const enrollment: any = {
          id: session.id as string,
          userId: userId || '',
          productId: productIdFromMeta || (lineItems[0]?.description || lineItems[0]?.price?.product || ''),
          createdAt: new Date().toISOString(),
          amount,
          metadata,
        };
        await addEnrollment(enrollment);
      } catch (err) {
        console.error('Failed to create enrollment record:', err);
      }
    } catch (err) {
      console.error('Failed to process checkout.session.completed', err);
    }
  }

  return NextResponse.json({ received: true });
}
