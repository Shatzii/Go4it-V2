import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { coupons, couponUsage } from '@/shared/coupon-schema';
import { eq, and, lt, gt, or, isNull } from 'drizzle-orm';

const validateCouponSchema = z.object({
  code: z.string().min(1),
  planId: z.string().optional(),
  amount: z.number().min(0).optional(),
  userId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, planId, amount, userId } = validateCouponSchema.parse(body);

    // Find the coupon
    const coupon = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, code.toUpperCase()))
      .limit(1);

    if (!coupon.length) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Coupon code not found',
        },
        { status: 404 },
      );
    }

    const couponData = coupon[0];
    const now = new Date();

    // Check if coupon is active
    if (!couponData.isActive) {
      return NextResponse.json(
        {
          valid: false,
          error: 'This coupon is no longer active',
        },
        { status: 400 },
      );
    }

    // Check validity dates
    if (couponData.validFrom > now) {
      return NextResponse.json(
        {
          valid: false,
          error: 'This coupon is not yet valid',
        },
        { status: 400 },
      );
    }

    if (couponData.validUntil && couponData.validUntil < now) {
      return NextResponse.json(
        {
          valid: false,
          error: 'This coupon has expired',
        },
        { status: 400 },
      );
    }

    // Check usage limits
    if (couponData.maxUses && couponData.currentUses >= couponData.maxUses) {
      return NextResponse.json(
        {
          valid: false,
          error: 'This coupon has reached its usage limit',
        },
        { status: 400 },
      );
    }

    // Check plan eligibility
    if (
      planId &&
      couponData.applicablePlans?.length &&
      !couponData.applicablePlans.includes(planId)
    ) {
      return NextResponse.json(
        {
          valid: false,
          error: 'This coupon is not valid for the selected plan',
        },
        { status: 400 },
      );
    }

    // Check minimum amount
    if (amount && couponData.minimumAmount && amount < parseFloat(couponData.minimumAmount)) {
      return NextResponse.json(
        {
          valid: false,
          error: `Minimum order amount of $${couponData.minimumAmount} required`,
        },
        { status: 400 },
      );
    }

    // Check if user has already used this coupon (if user ID provided)
    if (userId) {
      const existingUsage = await db
        .select()
        .from(couponUsage)
        .where(and(eq(couponUsage.couponId, couponData.id), eq(couponUsage.userId, userId)))
        .limit(1);

      if (existingUsage.length > 0) {
        return NextResponse.json(
          {
            valid: false,
            error: 'You have already used this coupon',
          },
          { status: 400 },
        );
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    const orderAmount = amount || 0;

    if (couponData.discountType === 'percentage') {
      discountAmount = (orderAmount * parseFloat(couponData.discountValue)) / 100;
    } else if (couponData.discountType === 'fixed') {
      discountAmount = parseFloat(couponData.discountValue);
    } else if (couponData.discountType === 'free') {
      discountAmount = orderAmount; // Free = 100% off
    }

    // Ensure discount doesn't exceed order amount
    discountAmount = Math.min(discountAmount, orderAmount);

    return NextResponse.json({
      valid: true,
      coupon: {
        id: couponData.id,
        code: couponData.code,
        name: couponData.name,
        description: couponData.description,
        discountType: couponData.discountType,
        discountValue: couponData.discountValue,
        discountAmount: discountAmount.toFixed(2),
        finalAmount: (orderAmount - discountAmount).toFixed(2),
      },
    });
  } catch (error) {
    console.error('Coupon validation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        valid: false,
        error: 'Internal server error',
      },
      { status: 500 },
    );
  }
}
