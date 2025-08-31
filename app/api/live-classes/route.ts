import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    // Mock live class data - in production, this would come from database
    const liveClasses = [
      {
        id: 'class_001',
        title: 'High-Intensity Conditioning Circuit',
        description:
          'Full-body conditioning workout focusing on explosive movements and cardiovascular endurance.',
        coach: 'Coach Sarah Williams',
        coachId: 'coach_002',
        coachRating: 4.8,
        startTime: new Date().toISOString(),
        duration: 60,
        price: 25,
        maxAttendees: 50,
        currentAttendees: 34,
        category: 'Conditioning',
        status: 'live',
        equipment: ['Resistance bands', 'Dumbbells', 'Mat'],
        level: 'intermediate',
        streamUrl: 'stream_001',
        revenue: 850, // 34 attendees * $25
        platformFee: 127.5, // 15% platform fee
      },
      {
        id: 'class_002',
        title: 'Olympic Lifting Technique',
        description:
          'Master the fundamentals of clean & jerk and snatch with proper form guidance.',
        coach: 'Coach Marcus Johnson',
        coachId: 'coach_001',
        coachRating: 4.9,
        startTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
        duration: 90,
        price: 35,
        maxAttendees: 25,
        currentAttendees: 18,
        category: 'Strength',
        status: 'scheduled',
        equipment: ['Barbell', 'Weight plates', 'Lifting shoes'],
        level: 'advanced',
        streamUrl: null,
        revenue: 0,
        platformFee: 0,
      },
      {
        id: 'class_003',
        title: 'Speed & Agility Fundamentals',
        description: 'Develop explosive speed and change of direction.',
        coach: 'Coach David Rodriguez',
        coachId: 'coach_003',
        coachRating: 5.0,
        startTime: new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString(), // 5.5 hours from now
        duration: 75,
        price: 30,
        maxAttendees: 40,
        currentAttendees: 12,
        category: 'Speed',
        status: 'scheduled',
        equipment: ['Agility ladder', 'Cones', 'Resistance bands'],
        level: 'beginner',
        streamUrl: null,
        revenue: 0,
        platformFee: 0,
      },
    ];

    // Filter classes based on query parameters
    let filteredClasses = liveClasses;

    if (status) {
      filteredClasses = filteredClasses.filter((cls) => cls.status === status);
    }

    if (category && category !== 'all') {
      filteredClasses = filteredClasses.filter((cls) =>
        cls.category.toLowerCase().includes(category.toLowerCase()),
      );
    }

    return NextResponse.json({
      success: true,
      classes: filteredClasses,
      total: filteredClasses.length,
      analytics: {
        totalRevenue: liveClasses.reduce((sum, cls) => sum + cls.revenue, 0),
        totalPlatformFees: liveClasses.reduce((sum, cls) => sum + cls.platformFee, 0),
        activeClasses: liveClasses.filter((cls) => cls.status === 'live').length,
        scheduledClasses: liveClasses.filter((cls) => cls.status === 'scheduled').length,
      },
    });
  } catch (error) {
    console.error('Error fetching live classes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch live classes' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      title,
      description,
      coachId,
      startTime,
      duration,
      price,
      maxAttendees,
      category,
      equipment,
      level,
    } = data;

    // In production, this would save to database and set up streaming infrastructure
    const newClass = {
      id: `class_${Date.now()}`,
      title,
      description,
      coachId,
      startTime,
      duration,
      price,
      maxAttendees,
      currentAttendees: 0,
      category,
      equipment,
      level,
      status: 'scheduled',
      streamUrl: null,
      revenue: 0,
      platformFee: 0,
      createdAt: new Date().toISOString(),
    };

    // Calculate potential revenue for coach
    const potentialRevenue = price * maxAttendees;
    const coachShare = potentialRevenue * 0.85; // 85% to coach
    const platformShare = potentialRevenue * 0.15; // 15% platform fee

    return NextResponse.json({
      success: true,
      class: newClass,
      revenueProjection: {
        potentialRevenue,
        coachShare,
        platformShare,
      },
      message: 'Live class scheduled successfully',
    });
  } catch (error) {
    console.error('Error creating live class:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create live class' },
      { status: 500 },
    );
  }
}
