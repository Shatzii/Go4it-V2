import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Mock gamification stats - in production, this would come from database
    const stats = {
      level: 15,
      xp: 12450,
      totalXp: 15000,
      xpToNextLevel: 2550,
      currentStreak: 7,
      longestStreak: 14,
      totalPoints: 8750,
      rank: 23,
      badges: ['consistent_performer', 'video_analyst', 'team_player'],
      achievements: [
        {
          id: '1',
          title: 'First Steps',
          description: 'Complete your first video analysis',
          icon: '🎯',
          category: 'milestone',
          points: 100,
          rarity: 'common',
          progress: 1,
          maxProgress: 1,
          isUnlocked: true,
          unlockedAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          title: 'Consistent Performer',
          description: 'Train for 7 consecutive days',
          icon: '🔥',
          category: 'training',
          points: 500,
          rarity: 'rare',
          progress: 7,
          maxProgress: 7,
          isUnlocked: true,
          unlockedAt: new Date('2024-07-10'),
        },
        {
          id: '3',
          title: 'Video Analyst',
          description: 'Analyze 10 performance videos',
          icon: '📹',
          category: 'performance',
          points: 300,
          rarity: 'common',
          progress: 8,
          maxProgress: 10,
          isUnlocked: false,
        },
        {
          id: '4',
          title: 'Academic Excellence',
          description: 'Maintain GPA above 3.5 for a semester',
          icon: '📚',
          category: 'academic',
          points: 1000,
          rarity: 'epic',
          progress: 3,
          maxProgress: 6,
          isUnlocked: false,
        },
        {
          id: '5',
          title: 'Team Captain',
          description: 'Lead your team to victory',
          icon: '⭐',
          category: 'social',
          points: 2000,
          rarity: 'legendary',
          progress: 0,
          maxProgress: 1,
          isUnlocked: false,
        },
      ],
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Failed to fetch gamification stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
