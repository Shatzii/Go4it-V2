import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import fs from 'fs/promises';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-08-16' });

async function loadPriceMap(): Promise<Record<string, string | number>> {
  try {
    const raw = await fs.readFile('content/oer/price-map.json', 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    // fallback default mappings (amounts in cents)
    return {
      starpath: 24900,
      homeschool: 39900,
      academy: 59900,
    };
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { productId, email, userId, enrollmentId } = body;
  if (!productId) return Response.json({ error: 'Missing productId' }, { status: 400 });

  const priceMap = await loadPriceMap();
  const mapped = priceMap[productId];
  if (!mapped) return Response.json({ error: 'Invalid product' }, { status: 400 });

  // Build line item depending on whether mapped is a Stripe Price ID (string starting with price_)
  let line_items: any[] = [];
  if (typeof mapped === 'string' && mapped.startsWith('price_')) {
    line_items = [{ price: mapped, quantity: 1 }];
  } else if (typeof mapped === 'number') {
    line_items = [{
      price_data: {
        currency: 'usd',
        product_data: { name: productId },
        unit_amount: mapped,
      },
      quantity: 1,
    }];
  } else {
    return Response.json({ error: 'Unsupported price mapping' }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    customer_email: email,
    metadata: {
      userId: String(userId || ''),
      enrollmentId: String(enrollmentId || ''),
      productId: String(productId || ''),
    },
    success_url: process.env.NEXT_PUBLIC_APP_URL + '/academy/enroll?success=1',
    cancel_url: process.env.NEXT_PUBLIC_APP_URL + '/academy/enroll?cancel=1',
  });

  return Response.json({ url: session.url, id: session.id });
}
