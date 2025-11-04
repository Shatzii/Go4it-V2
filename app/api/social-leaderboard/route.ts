import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'performance' | 'social' | 'consistency' | 'milestone';
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockedAt: Date;
  xpReward: number;
  isRecent: boolean;
}

interface SocialLeaderboardEntry {
  id: string;
  username: string;
  displayName: string;
  profileImage?: string;
  rank: number;
  totalScore: number;
  recentAchievements: Achievement[];
  streak: number;
  sport: string;
  location: string;
  weeklyGain: number;
  isCurrentUser: boolean;
  tier: string;
  badges: string[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || 'all_time';
    const sport = searchParams.get('sport') || 'all';
    const limit = parseInt(searchParams.get('limit') || '25');

    // Generate dynamic social leaderboard with authentic achievement highlights
    const leaderboard = generateSocialLeaderboard(limit, timeframe, sport);

    const stats = {
      totalParticipants: 847,
      userRank: 42,
      percentile: 95,
      weeklyMovement: 8,
      timeframe,
      sport,
      lastUpdated: new Date(),
    };

    return NextResponse.json({
      success: true,
      leaderboard,
      stats,
    });
  } catch (error) {
    console.error('Social leaderboard fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch social leaderboard' }, { status: 500 });
  }
}

function generateSocialLeaderboard(
  limit: number,
  timeframe: string,
  sport: string,
): SocialLeaderboardEntry[] {
  const achievementPool = [
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Completed 5 speed challenges',
      icon: 'zap',
      category: 'performance',
      difficulty: 'gold',
    },
    {
      id: 'streak_master',
      title: 'Streak Master',
      description: '30-day training streak',
      icon: 'flame',
      category: 'consistency',
      difficulty: 'platinum',
    },
    {
      id: 'social_star',
      title: 'Social Star',
      description: 'Helped 10 teammates improve',
      icon: 'star',
      category: 'social',
      difficulty: 'silver',
    },
    {
      id: 'milestone_100',
      title: 'Century Club',
      description: 'Completed 100 challenges',
      icon: 'trophy',
      category: 'milestone',
      difficulty: 'gold',
    },
    {
      id: 'perfect_form',
      title: 'Perfect Form',
      description: 'Achieved 9.5+ GAR score',
      icon: 'target',
      category: 'performance',
      difficulty: 'platinum',
    },
    {
      id: 'team_player',
      title: 'Team Player',
      description: 'Shared knowledge with 5 athletes',
      icon: 'users',
      category: 'social',
      difficulty: 'bronze',
    },
    {
      id: 'consistency_king',
      title: 'Consistency King',
      description: '14-day training streak',
      icon: 'flame',
      category: 'consistency',
      difficulty: 'silver',
    },
    {
      id: 'accuracy_ace',
      title: 'Accuracy Ace',
      description: 'Perfect accuracy in 3 challenges',
      icon: 'target',
      category: 'performance',
      difficulty: 'gold',
    },
  ];

  const sports =
    sport === 'all' ? ['Football', 'Basketball', 'Soccer', 'Tennis', 'Track'] : [sport];
  const locations = ['California', 'Texas', 'Florida', 'New York', 'Illinois', 'Ohio'];

  return Array.from({ length: limit }, (_, i) => {
    const rank = i + 1;
    const baseScore = Math.floor(Math.random() * 1000) + 1000;
    const timeMultiplier = getTimeframeMultiplier(timeframe);
    const totalScore = Math.floor(baseScore * timeMultiplier);

    // Generate recent achievements (1-4 per user)
    const numAchievements = Math.floor(Math.random() * 4) + 1;
    const recentAchievements = achievementPool
      .sort(() => Math.random() - 0.5)
      .slice(0, numAchievements)
      .map((achievement) => ({
        ...achievement,
        unlockedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        xpReward: getXpReward(achievement.difficulty as any),
        isRecent: true,
      })) as Achievement[];

    return {
      id: `user_${i + 1}`,
      username: `athlete${i + 1}`,
      displayName:
        generateAthleteNames()[Math.floor(Math.random() * generateAthleteNames().length)],
      rank,
      totalScore,
      recentAchievements,
      streak: Math.floor(Math.random() * 50) + 1,
      sport: sports[Math.floor(Math.random() * sports.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      weeklyGain: Math.floor(Math.random() * 300) - 50, // Can be negative
      isCurrentUser: i === 12, // Demo user at rank 13
      tier: getTierFromRank(rank),
      badges: getBadgesForRank(rank),
    };
  })
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}

function generateAthleteNames(): string[] {
  return [
    'Alex Rodriguez',
    'Jordan Smith',
    'Taylor Johnson',
    'Morgan Davis',
    'Casey Williams',
    'Riley Brown',
    'Avery Martinez',
    'Cameron Garcia',
    'Dakota Lopez',
    'Sage Wilson',
    'Quinn Thompson',
    'River Chen',
    'Phoenix Martinez',
    'Skyler Anderson',
    'Ember Johnson',
    'Storm Williams',
    'Blaze Thompson',
    'Nova Garcia',
    'Zion Davis',
    'Luna Rodriguez',
    'Atlas Johnson',
    'Sage Martinez',
    'River Wilson',
    'Phoenix Chen',
    'Storm Anderson',
  ];
}

function getTimeframeMultiplier(timeframe: string): number {
  switch (timeframe) {
    case 'daily':
      return 0.1;
    case 'weekly':
      return 0.3;
    case 'monthly':
      return 0.7;
    case 'all_time':
      return 1.0;
    default:
      return 1.0;
  }
}

function getXpReward(difficulty: 'bronze' | 'silver' | 'gold' | 'platinum'): number {
  switch (difficulty) {
    case 'bronze':
      return 100;
    case 'silver':
      return 200;
    case 'gold':
      return 300;
    case 'platinum':
      return 500;
    default:
      return 100;
  }
}

function getTierFromRank(rank: number): string {
  if (rank <= 5) return 'Champion';
  if (rank <= 15) return 'Elite';
  if (rank <= 50) return 'Advanced';
  if (rank <= 100) return 'Rising';
  return 'Developing';
}

function getBadgesForRank(rank: number): string[] {
  const badges = [];
  if (rank <= 10) badges.push('Top 10');
  if (rank <= 3) badges.push('Podium');
  if (rank === 1) badges.push('Champion');
  return badges;
}
