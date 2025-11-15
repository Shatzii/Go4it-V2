import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { addAssessment } from '@/lib/assessments';
import { addEnrollment } from '@/lib/enrollments';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-08-16' });

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const buf = await req.arrayBuffer();
  let event;
  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return Response.json({ error: 'Webhook signature failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    // fetch full session including line items
    try {
      const full = await stripe.checkout.sessions.retrieve(session.id as string, { expand: ['line_items'] });
      const lineItems = (full as any).line_items?.data || [];
      // If any line item product/name indicates starpath, record assessment
      const isStarpath = lineItems.some((li: any) => {
        const name = li.description || li.price?.product || li.price?.nickname || li.price?.product;
        return String(name || '').toLowerCase().includes('starpath');
      });
      if (isStarpath) {
        // Prefer metadata mapping from the Checkout session
        const metadata = (full as any).metadata || session.metadata || {};
        const userIdFromMeta = metadata.userId || metadata.user_id || ''; // tolerant keys
        const enrollmentIdFromMeta = metadata.enrollmentId || metadata.enrollment_id || '';
        const userId = userIdFromMeta || session.customer_email || '';
        const assessmentId = session.id as string;
        await addAssessment({ id: assessmentId, userId, paidAt: new Date().toISOString(), zoomAddon: false });
        // Optionally record enrollment linkage if provided (append to audit or log)
        if (enrollmentIdFromMeta) {
          console.log('Checkout linked to enrollment:', enrollmentIdFromMeta, 'session:', assessmentId);
        }
      }

      // Create enrollment records for any purchased OER / products
      try {
        const metadata = (full as any).metadata || session.metadata || {};
        const userIdFromMeta = metadata.userId || metadata.user_id || '';
        const userId = userIdFromMeta || session.customer_email || '';
        const productIdFromMeta = metadata.productId || '';
        const amount = (full as any).amount_total || (full as any).display_items?.reduce?.((s: number, i: any) => s + (i.amount || 0), 0) || 0;
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
        // non-fatal
        console.error('Failed to create enrollment record:', err);
      }
    } catch (err) {
      console.error('Failed to process checkout.session.completed', err);
    }
  }

  return Response.json({ received: true });
}
