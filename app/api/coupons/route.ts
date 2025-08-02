import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Mock coupon data - includes the FULLACCESS2025 pass
    const coupons = [
      {
        id: '1',
        code: 'FULLACCESS2025',
        name: 'Full Access Pass',
        description: 'Complete access to all Go4It features - unlimited everything!',
        discountType: 'free',
        discountValue: '100',
        maxUses: 100,
        currentUses: 0,
        isActive: true,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        applicablePlans: ['starter', 'pro', 'elite'],
        minimumAmount: '0'
      },
      {
        id: '2',
        code: 'FREEMONTH',
        name: 'Free Month Access',
        description: 'Get one month completely free on any plan',
        discountType: 'free',
        discountValue: '100',
        maxUses: 1000,
        currentUses: 147,
        isActive: true,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        applicablePlans: ['starter', 'pro', 'elite'],
        minimumAmount: '0'
      },
      {
        id: '3',
        code: 'SUPERSTAR75',
        name: '75% Off Elite Deal',
        description: 'Massive 75% savings for serious athletes',
        discountType: 'percentage',
        discountValue: '75',
        maxUses: 50,
        currentUses: 23,
        isActive: true,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        applicablePlans: ['pro', 'elite'],
        minimumAmount: '25'
      }
    ];

    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error('Failed to fetch coupons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate coupon code
    if (body.code === 'FULLACCESS2025') {
      return NextResponse.json({
        success: true,
        coupon: {
          code: 'FULLACCESS2025',
          name: 'Full Access Pass',
          discountType: 'free',
          discountValue: '100',
          description: 'Complete access to all Go4It features'
        },
        discount: 100,
        message: 'Full access pass applied! Everything is free.'
      });
    }
    
    if (body.code === 'FREEMONTH') {
      return NextResponse.json({
        success: true,
        coupon: {
          code: 'FREEMONTH',
          name: 'Free Month Access',
          discountType: 'free',
          discountValue: '100'
        },
        discount: 100,
        message: 'Free month applied!'
      });
    }
    
    if (body.code === 'SUPERSTAR75') {
      return NextResponse.json({
        success: true,
        coupon: {
          code: 'SUPERSTAR75',
          name: '75% Off Elite Deal',
          discountType: 'percentage',
          discountValue: '75'
        },
        discount: 75,
        message: '75% discount applied!'
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid coupon code' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Failed to validate coupon:', error);
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}