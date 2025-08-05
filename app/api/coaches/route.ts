import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get('specialty');
    const availability = searchParams.get('availability');

    // Mock coach data - in production, this would come from database
    const coaches = [
      {
        id: 'coach_001',
        name: 'Coach Marcus Johnson',
        specialty: ['Strength Training', 'Speed Development', 'Olympic Lifting'],
        experience: '15 years',
        rating: 4.9,
        reviews: 127,
        hourlyRate: 75,
        availability: 'Available',
        bio: 'Former D1 strength coach with expertise in developing elite athletes.',
        credentials: ['CSCS Certified', 'USA Weightlifting Level 2', 'NASM-PES'],
        successStories: 45,
        liveClasses: true,
        revenueShare: 0.85,
        totalEarnings: 15420
      },
      {
        id: 'coach_002',
        name: 'Coach Sarah Williams',
        specialty: ['Conditioning', 'Agility Training', 'Sport Psychology'],
        experience: '12 years',
        rating: 4.8,
        reviews: 98,
        hourlyRate: 65,
        availability: 'Busy',
        bio: 'Sports psychologist and conditioning specialist.',
        credentials: ['ACSM Certified', 'Mental Performance Consultant', 'FMS Level 2'],
        successStories: 67,
        liveClasses: true,
        revenueShare: 0.85,
        totalEarnings: 12800
      },
      {
        id: 'coach_003',
        name: 'Coach David Rodriguez',
        specialty: ['Football Specific', 'Position Training', 'Recruiting'],
        experience: '20 years',
        rating: 5.0,
        reviews: 156,
        hourlyRate: 85,
        availability: 'Available',
        bio: 'Former NFL coach with extensive recruiting connections.',
        credentials: ['NFL Coaching Experience', 'AFCA Member', 'Recruiting Specialist'],
        successStories: 89,
        liveClasses: false,
        revenueShare: 0.85,
        totalEarnings: 18950
      }
    ];

    // Filter coaches based on query parameters
    let filteredCoaches = coaches;
    
    if (specialty && specialty !== 'all') {
      filteredCoaches = filteredCoaches.filter(coach => 
        coach.specialty.some(spec => spec.toLowerCase().includes(specialty.toLowerCase()))
      );
    }

    if (availability) {
      filteredCoaches = filteredCoaches.filter(coach => 
        coach.availability.toLowerCase() === availability.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      coaches: filteredCoaches,
      total: filteredCoaches.length
    });

  } catch (error) {
    console.error('Error fetching coaches:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coaches' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { 
      name, 
      email, 
      specialty, 
      experience, 
      credentials,
      hourlyRate,
      bio,
      availableForLiveClasses 
    } = data;

    // In production, this would save to database
    const newCoach = {
      id: `coach_${Date.now()}`,
      name,
      email,
      specialty,
      experience,
      credentials,
      hourlyRate,
      bio,
      liveClasses: availableForLiveClasses,
      rating: 0,
      reviews: 0,
      availability: 'Available',
      successStories: 0,
      revenueShare: 0.85,
      totalEarnings: 0,
      status: 'pending_approval'
    };

    return NextResponse.json({
      success: true,
      coach: newCoach,
      message: 'Coach application submitted successfully'
    });

  } catch (error) {
    console.error('Error creating coach profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create coach profile' },
      { status: 500 }
    );
  }
}