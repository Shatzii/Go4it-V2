import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { videoAnalysis, starPathProgress } from '@/lib/schema';
import { eq, desc, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get recent video analyses
    const recentAnalyses = await db
      .select()
      .from(videoAnalysis)
      .where(eq(videoAnalysis.userId, user.id))
      .orderBy(desc(videoAnalysis.createdAt))
      .limit(5);

    // Get StarPath progress
    const starpathData = await db
      .select()
      .from(starPathProgress)
      .where(eq(starPathProgress.userId, user.id))
      .catch(() => []);

    // Calculate overview statistics
    const totalAnalyses = recentAnalyses.length;
    const avgScore =
      totalAnalyses > 0
        ? Math.round(
            recentAnalyses.reduce((sum, analysis) => sum + parseFloat(analysis.garScore), 0) /
              totalAnalyses,
          )
        : 0;

    const totalXp = starpathData.reduce((sum, progress) => sum + progress.totalXp, 0);
    const completedSkills = starpathData.filter((progress) => progress.isUnlocked).length;

    // Get recent achievements
    const recentAchievements = getRecentAchievements(recentAnalyses, starpathData);

    // Get upcoming goals
    const upcomingGoals = getUpcomingGoals(user.sport, avgScore);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        sport: user.sport,
        role: user.role,
      },
      statistics: {
        total_analyses: totalAnalyses,
        average_gar_score: avgScore,
        total_xp: totalXp,
        completed_skills: completedSkills,
        current_tier: Math.floor(totalXp / 1000) + 1,
      },
      recent_analyses: recentAnalyses.map((analysis) => ({
        id: analysis.id,
        sport: analysis.sport,
        gar_score: analysis.garScore,
        created_at: analysis.createdAt,
        feedback: analysis.feedback,
      })),
      recent_achievements: recentAchievements,
      upcoming_goals: upcomingGoals,
      quick_actions: [
        { title: 'Upload Video', url: '/upload', icon: 'upload' },
        { title: 'View Progress', url: '/starpath', icon: 'trending-up' },
        { title: 'Academy', url: '/academy', icon: 'book' },
        { title: 'AI Coach', url: '/ai-coach', icon: 'brain' },
      ],
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}

function getRecentAchievements(analyses: any[], starpathData: any[]): any[] {
  const achievements = [];

  // Check for GAR score achievements
  const latestAnalysis = analyses[0];
  if (latestAnalysis) {
    const score = parseFloat(latestAnalysis.garScore);
    if (score >= 90) {
      achievements.push({
        title: 'Excellent Performance',
        description: `Achieved ${score}/100 GAR score`,
        type: 'performance',
        earned_at: latestAnalysis.createdAt,
        icon: '🌟',
      });
    } else if (score >= 80) {
      achievements.push({
        title: 'Strong Performance',
        description: `Achieved ${score}/100 GAR score`,
        type: 'performance',
        earned_at: latestAnalysis.createdAt,
        icon: '⭐',
      });
    }
  }

  // Check for improvement achievements
  if (analyses.length >= 2) {
    const currentScore = parseFloat(analyses[0].garScore);
    const previousScore = parseFloat(analyses[1].garScore);
    if (currentScore > previousScore + 5) {
      achievements.push({
        title: 'Improvement Streak',
        description: `Improved by ${Math.round(currentScore - previousScore)} points`,
        type: 'improvement',
        earned_at: analyses[0].createdAt,
        icon: '📈',
      });
    }
  }

  // Check for consistency achievements
  if (analyses.length >= 3) {
    const recentScores = analyses.slice(0, 3).map((a) => parseFloat(a.garScore));
    const isConsistent = recentScores.every((score) => Math.abs(score - recentScores[0]) < 5);
    if (isConsistent && recentScores[0] >= 75) {
      achievements.push({
        title: 'Consistent Performance',
        description: 'Maintained consistent high performance',
        type: 'consistency',
        earned_at: analyses[0].createdAt,
        icon: '🎯',
      });
    }
  }

  return achievements.slice(0, 3); // Return top 3 achievements
}

function getUpcomingGoals(sport: string, currentScore: number): any[] {
  const goals = [];

  // Score-based goals
  if (currentScore < 80) {
    goals.push({
      title: 'Reach 80 GAR Score',
      description: 'Improve overall performance to achieve 80+ GAR score',
      target: 80,
      current: currentScore,
      type: 'performance',
      estimated_time: '2-3 weeks',
      icon: '🎯',
    });
  } else if (currentScore < 90) {
    goals.push({
      title: 'Reach 90 GAR Score',
      description: 'Achieve excellent performance level',
      target: 90,
      current: currentScore,
      type: 'performance',
      estimated_time: '3-4 weeks',
      icon: '🌟',
    });
  }

  // Sport-specific goals
  const sportGoals = {
    basketball: [
      {
        title: 'Master Ball Handling',
        description: 'Complete advanced dribbling skill tree',
        type: 'skill',
        estimated_time: '1-2 weeks',
        icon: '🏀',
      },
      {
        title: 'Improve Shooting Consistency',
        description: 'Achieve 80%+ shooting accuracy in drills',
        type: 'skill',
        estimated_time: '2-3 weeks',
        icon: '🎯',
      },
    ],
    soccer: [
      {
        title: 'Perfect First Touch',
        description: 'Master ball control and reception',
        type: 'skill',
        estimated_time: '1-2 weeks',
        icon: '⚽',
      },
      {
        title: 'Passing Accuracy',
        description: 'Achieve 90%+ passing accuracy',
        type: 'skill',
        estimated_time: '2-3 weeks',
        icon: '🎯',
      },
    ],
    tennis: [
      {
        title: 'Consistent Groundstrokes',
        description: 'Master forehand and backhand technique',
        type: 'skill',
        estimated_time: '2-3 weeks',
        icon: '🎾',
      },
    ],
  };

  if (sport && sportGoals[sport]) {
    goals.push(...sportGoals[sport]);
  }

  return goals.slice(0, 4); // Return top 4 goals
}
