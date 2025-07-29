import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { coupons, couponUsage } from '@/shared/coupon-schema';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const applyCouponSchema = z.object({
  couponId: z.string(),
  userId: z.string(),
  orderAmount: z.number(),
  planId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { couponId, userId, orderAmount, planId } = applyCouponSchema.parse(body);

    // Get coupon details
    const coupon = await db
      .select()
      .from(coupons)
      .where(eq(coupons.id, couponId))
      .limit(1);

    if (!coupon.length) {
      return NextResponse.json({
        success: false,
        error: 'Coupon not found',
      }, { status: 404 });
    }

    const couponData = coupon[0];

    // Calculate discount amount
    let discountAmount = 0;
    if (couponData.discountType === 'percentage') {
      discountAmount = (orderAmount * parseFloat(couponData.discountValue)) / 100;
    } else if (couponData.discountType === 'fixed') {
      discountAmount = parseFloat(couponData.discountValue);
    } else if (couponData.discountType === 'free') {
      discountAmount = orderAmount;
    }

    discountAmount = Math.min(discountAmount, orderAmount);

    // Create or get Stripe coupon
    let stripeCouponId = null;
    try {
      if (couponData.discountType === 'percentage') {
        const stripeCoupon = await stripe.coupons.create({
          percent_off: parseFloat(couponData.discountValue),
          duration: 'once',
          name: couponData.name,
          metadata: {
            go4it_coupon_id: couponData.id,
            go4it_code: couponData.code,
          },
        });
        stripeCouponId = stripeCoupon.id;
      } else if (couponData.discountType === 'fixed') {
        const stripeCoupon = await stripe.coupons.create({
          amount_off: Math.round(parseFloat(couponData.discountValue) * 100), // Convert to cents
          currency: 'usd',
          duration: 'once',
          name: couponData.name,
          metadata: {
            go4it_coupon_id: couponData.id,
            go4it_code: couponData.code,
          },
        });
        stripeCouponId = stripeCoupon.id;
      }
    } catch (stripeError) {
      console.error('Stripe coupon creation error:', stripeError);
      // Continue without Stripe coupon - we'll handle discount manually
    }

    // Record coupon usage
    const usageId = uuidv4();
    await db.insert(couponUsage).values({
      id: usageId,
      couponId: couponData.id,
      userId,
      orderAmount: orderAmount.toString(),
      discountAmount: discountAmount.toString(),
      stripeCouponId,
    });

    // Update coupon usage count
    await db
      .update(coupons)
      .set({
        currentUses: couponData.currentUses + 1,
        updatedAt: new Date(),
      })
      .where(eq(coupons.id, couponData.id));

    return NextResponse.json({
      success: true,
      usage: {
        id: usageId,
        discountAmount: discountAmount.toFixed(2),
        finalAmount: (orderAmount - discountAmount).toFixed(2),
        stripeCouponId,
      },
    });

  } catch (error) {
    console.error('Apply coupon error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}