import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { videoAnalysis } from '@/lib/schema';
import { eq, desc, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30'; // days
    const sport = searchParams.get('sport');

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeframe));

    // Build query
    let query = db
      .select()
      .from(videoAnalysis)
      .where(eq(videoAnalysis.userId, user.id));

    if (sport) {
      query = query.where(eq(videoAnalysis.sport, sport));
    }

    const analyses = await query
      .where(gte(videoAnalysis.createdAt, startDate))
      .orderBy(desc(videoAnalysis.createdAt));

    // Process analytics
    const analytics = processPerformanceAnalytics(analyses);

    return NextResponse.json({
      success: true,
      timeframe: `${timeframe} days`,
      sport: sport || 'all',
      analytics,
      total_analyses: analyses.length
    });

  } catch (error) {
    console.error('Error fetching performance analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

function processPerformanceAnalytics(analyses: any[]) {
  if (analyses.length === 0) {
    return {
      overall_progress: 0,
      average_gar_score: 0,
      improvement_trend: 'no_data',
      performance_breakdown: {},
      recent_scores: [],
      strengths: [],
      areas_for_improvement: []
    };
  }

  const scores = analyses.map(a => parseFloat(a.garScore));
  const recentScores = scores.slice(0, 10);
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

  // Calculate improvement trend
  const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
  const secondHalf = scores.slice(Math.floor(scores.length / 2));
  const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
  
  let improvementTrend = 'stable';
  if (secondAvg > firstAvg + 2) improvementTrend = 'improving';
  else if (secondAvg < firstAvg - 2) improvementTrend = 'declining';

  // Extract performance breakdown from analysis data
  const performanceBreakdown = {};
  const allStrengths = [];
  const allWeaknesses = [];

  analyses.forEach(analysis => {
    if (analysis.analysisData) {
      const data = typeof analysis.analysisData === 'string' 
        ? JSON.parse(analysis.analysisData) 
        : analysis.analysisData;
      
      if (data.technicalSkills) performanceBreakdown.technical = data.technicalSkills;
      if (data.athleticism) performanceBreakdown.athleticism = data.athleticism;
      if (data.gameAwareness) performanceBreakdown.gameAwareness = data.gameAwareness;
      
      if (data.breakdown?.strengths) {
        allStrengths.push(...data.breakdown.strengths);
      }
      if (data.breakdown?.weaknesses) {
        allWeaknesses.push(...data.breakdown.weaknesses);
      }
    }
  });

  // Find most common strengths and weaknesses
  const strengthCounts = {};
  const weaknessCounts = {};
  
  allStrengths.forEach(strength => {
    strengthCounts[strength] = (strengthCounts[strength] || 0) + 1;
  });
  
  allWeaknesses.forEach(weakness => {
    weaknessCounts[weakness] = (weaknessCounts[weakness] || 0) + 1;
  });

  const topStrengths = Object.entries(strengthCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([strength]) => strength);

  const topWeaknesses = Object.entries(weaknessCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([weakness]) => weakness);

  return {
    overall_progress: Math.round(((averageScore - 60) / 40) * 100), // Convert to percentage
    average_gar_score: Math.round(averageScore),
    improvement_trend: improvementTrend,
    performance_breakdown: performanceBreakdown,
    recent_scores: recentScores.reverse(), // Chronological order
    strengths: topStrengths,
    areas_for_improvement: topWeaknesses,
    total_sessions: analyses.length,
    score_distribution: {
      excellent: scores.filter(s => s >= 90).length,
      good: scores.filter(s => s >= 75 && s < 90).length,
      average: scores.filter(s => s >= 60 && s < 75).length,
      needs_improvement: scores.filter(s => s < 60).length
    }
  };
}