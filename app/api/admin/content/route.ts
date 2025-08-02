import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Mock content data - in production this would come from database
    const content = [
      {
        id: '1',
        type: 'camp',
        title: 'Merida Summer Elite Camp',
        description: 'Elite football training in beautiful Merida with professional coaches and GAR analysis',
        price: '$899',
        image: '/camps/merida-summer.jpg',
        content: {
          location: 'Merida, Mexico',
          dates: 'July 15-20, 2025',
          features: [
            'Professional GAR video analysis',
            'Elite coaching from D1 staff',
            'USA Football membership included',
            'Action Network recruiting profile'
          ],
          maxParticipants: 32,
          category: 'ELITE'
        },
        isActive: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        type: 'camp',
        title: 'Merida Winter Skills Camp',
        description: 'Intensive skills development camp with personalized coaching',
        price: '$699',
        image: '/camps/merida-winter.jpg',
        content: {
          location: 'Merida, Mexico',
          dates: 'December 20-23, 2025',
          features: [
            'Intensive skills development',
            'Position-specific training',
            'Mental performance coaching',
            'Nutrition and wellness sessions'
          ],
          maxParticipants: 24,
          category: 'SKILLS'
        },
        isActive: true,
        updatedAt: new Date().toISOString()
      }
    ];

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    // In production, save to database
    console.log('Updating content:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Content updated successfully'
    });
  } catch (error) {
    console.error('Failed to update content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}