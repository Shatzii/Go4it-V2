import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Mock content data - in production this would come from database
    const content = [
      {
        id: '1',
        type: 'camp',
        title: 'English With Sports Camp',
        description: 'Learn English through sports & games with native English-speaking coaches',
        price: '$275USD',
        image: '/camps/merida-english.jpg',
        content: {
          location: 'Unidad Deportiva del Sur Henry Martín, Mérida',
          dates: 'August 4-8 & August 11-15, 2025',
          features: [
            'Learn English through sports & games',
            'Native English-speaking coaches',
            'Flag football, basketball, soccer, tennis',
            'Daily lunch and snacks included',
            'Ages 5-17 years welcome',
          ],
          maxParticipants: 60,
          category: 'BILINGUAL',
          schedule: '8:00 AM - 4:00 PM',
          additionalInfo:
            'Where language and movement connect. Learn English through games, sports and mentorship from international coaches and American athletes.',
        },
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'camp',
        title: 'Team Camps & Coaching Clinics',
        description:
          'Elite training with USA Football coaches and potential Dallas program qualification',
        price: '$725USD / $225USD',
        image: '/camps/merida-team.jpg',
        content: {
          location: 'Unidad Deportiva del Sur Henry Martín, Mérida',
          dates: 'August 6-16, 2025',
          features: [
            'Work with USA Football coaches',
            'Develop winning strategies',
            'Individual players welcome',
            'USA Football membership included',
            '3 days = 6 practices = 9 total sessions',
          ],
          maxParticipants: 16,
          category: 'ELITE',
          schedule: 'Day Camp: 8AM-4PM / Overnight Camp: 6PM-10PM',
          additionalInfo:
            'Only 4 teams per session. Elite participants may qualify for exclusive 10-week S.T.A.g.e. program in Dallas, Texas with 2x Super Bowl Champion Derrick Martin.',
          featuredStaff: [
            '2x Super Bowl Champion Derrick Martin',
            'NFL alumnus Talib Wise (Spanish National Team coach)',
            'USA Football certified coaches',
          ],
        },
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // In production, save to database
    console.log('Updating content:', body);

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
    });
  } catch (error) {
    console.error('Failed to update content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
