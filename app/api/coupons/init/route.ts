import { NextResponse } from 'next/server';

// Simple coupon initialization that doesn't require database
export async function POST() {
  try {
    // For now, just return success - the real coupons will be handled by Stripe
    const coupons = [
      {
        code: 'FREEMONTH',
        name: 'Free Month Access',
        description: 'Get one month completely free on any plan',
        discountType: 'free',
        discountValue: '100',
        status: 'active',
      },
      {
        code: 'SAVE20',
        name: '20% Off Discount',
        description: 'Save 20% on your subscription',
        discountType: 'percentage',
        discountValue: '20',
        status: 'active',
      },
      {
        code: 'HALFOFF',
        name: '50% Off Special',
        description: 'Limited time 50% discount',
        discountType: 'percentage',
        discountValue: '50',
        status: 'active',
      },
      {
        code: 'SUPERSTAR75',
        name: '75% Off Elite Deal',
        description: 'Massive 75% savings for serious athletes',
        discountType: 'percentage',
        discountValue: '75',
        status: 'active',
      },
    ];

    return NextResponse.json({
      success: true,
      message: 'Coupon codes initialized successfully',
      coupons,
      count: coupons.length,
    });
  } catch (error) {
    console.error('Coupon initialization error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initialize coupons',
      },
      { status: 500 },
    );
  }
}
