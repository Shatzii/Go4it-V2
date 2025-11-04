import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { coupons } from '@/shared/coupon-schema';
import { eq, and, gt, or, isNull, lt } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    const planId = searchParams.get('planId');

    let query = db.select().from(coupons);

    // Build where conditions
    const conditions = [];

    if (activeOnly) {
      const now = new Date();
      conditions.push(eq(coupons.isActive, true));
      conditions.push(lt(coupons.validFrom, now));
      conditions.push(or(isNull(coupons.validUntil), gt(coupons.validUntil, now)));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const allCoupons = await query;

    // Filter by plan if specified
    let filteredCoupons = allCoupons;
    if (planId) {
      filteredCoupons = allCoupons.filter(
        (coupon) =>
          !coupon.applicablePlans ||
          coupon.applicablePlans.length === 0 ||
          coupon.applicablePlans.includes(planId),
      );
    }

    // Format response
    const formattedCoupons = filteredCoupons.map((coupon) => ({
      id: coupon.id,
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      isActive: coupon.isActive,
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      maxUses: coupon.maxUses,
      currentUses: coupon.currentUses,
      usagePercentage: coupon.maxUses ? (coupon.currentUses / coupon.maxUses) * 100 : 0,
      applicablePlans: coupon.applicablePlans,
      minimumAmount: coupon.minimumAmount,
    }));

    return NextResponse.json({
      success: true,
      coupons: formattedCoupons,
      total: formattedCoupons.length,
    });
  } catch (error) {
    console.error('List coupons error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 },
    );
  }
}
