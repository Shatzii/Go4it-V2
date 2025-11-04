import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { coupons, PREDEFINED_COUPONS } from '@/shared/coupon-schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const createCouponSchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed', 'free']),
  discountValue: z.string(),
  maxUses: z.number().optional(),
  validFrom: z.string().transform((str) => new Date(str)),
  validUntil: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
  applicablePlans: z.array(z.string()).optional(),
  minimumAmount: z.string().optional(),
});

// Initialize predefined coupons
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'init') {
      // Initialize predefined coupons
      const results = [];

      for (const couponData of PREDEFINED_COUPONS) {
        try {
          // Check if coupon already exists
          const existing = await db
            .select()
            .from(coupons)
            .where(eq(coupons.code, couponData.code))
            .limit(1);

          if (existing.length === 0) {
            const couponId = uuidv4();
            await db.insert(coupons).values({
              id: couponId,
              ...couponData,
            });
            results.push({ code: couponData.code, status: 'created' });
          } else {
            results.push({ code: couponData.code, status: 'exists' });
          }
        } catch (error) {
          console.error(`Error creating coupon ${couponData.code}:`, error);
          results.push({ code: couponData.code, status: 'error', error: error.message });
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Predefined coupons initialized',
        results,
      });
    }

    // Create new coupon
    const body = await request.json();
    const couponData = createCouponSchema.parse(body);

    // Check if code already exists
    const existingCoupon = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, couponData.code.toUpperCase()))
      .limit(1);

    if (existingCoupon.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Coupon code already exists',
        },
        { status: 400 },
      );
    }

    // Create new coupon
    const couponId = uuidv4();
    await db.insert(coupons).values({
      id: couponId,
      ...couponData,
      code: couponData.code.toUpperCase(),
    });

    return NextResponse.json({
      success: true,
      message: 'Coupon created successfully',
      couponId,
    });
  } catch (error) {
    console.error('Admin coupon error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid coupon data',
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 },
    );
  }
}

// Get all coupons with detailed info for admin
export async function GET() {
  try {
    const allCoupons = await db.select().from(coupons);

    const formattedCoupons = allCoupons.map((coupon) => ({
      ...coupon,
      usagePercentage: coupon.maxUses ? (coupon.currentUses / coupon.maxUses) * 100 : 0,
      isExpired: coupon.validUntil ? new Date() > coupon.validUntil : false,
      isActive: coupon.isActive && (!coupon.validUntil || new Date() <= coupon.validUntil),
    }));

    return NextResponse.json({
      success: true,
      coupons: formattedCoupons,
      total: formattedCoupons.length,
      stats: {
        active: formattedCoupons.filter((c) => c.isActive).length,
        expired: formattedCoupons.filter((c) => c.isExpired).length,
        totalUses: formattedCoupons.reduce((sum, c) => sum + c.currentUses, 0),
      },
    });
  } catch (error) {
    console.error('Get admin coupons error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 },
    );
  }
}
