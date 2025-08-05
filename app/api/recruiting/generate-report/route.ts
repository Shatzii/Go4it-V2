import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, videoAnalysis } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { athleteId } = await request.json();

    if (!athleteId) {
      return NextResponse.json({ error: 'Athlete ID required' }, { status: 400 });
    }

    // Get athlete information
    const [athlete] = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(athleteId)));

    if (!athlete) {
      return NextResponse.json({ error: 'Athlete not found' }, { status: 404 });
    }

    // Check if athlete is verified
    if (!athlete.isVerified) {
      return NextResponse.json({ error: 'Athlete must be verified to generate recruiting report' }, { status: 400 });
    }

    // Get recent GAR analyses
    const analyses = await db
      .select()
      .from(videoAnalysis)
      .where(eq(videoAnalysis.userId, parseInt(athleteId)))
      .orderBy(desc(videoAnalysis.createdAt))
      .limit(10);

    if (analyses.length === 0) {
      return NextResponse.json({ error: 'No GAR analyses found for this athlete' }, { status: 400 });
    }

    // Calculate comprehensive performance metrics
    const performanceMetrics = calculatePerformanceMetrics(analyses);
    
    // Generate recruiting report
    const recruitingReport = await generateComprehensiveReport(athlete, analyses, performanceMetrics);

    return NextResponse.json({
      success: true,
      report: recruitingReport,
      athlete: {
        name: `${athlete.firstName} ${athlete.lastName}`,
        garScore: athlete.garScore,
        verificationStatus: athlete.isVerified ? 'verified' : 'unverified',
        email: athlete.email
      },
      message: 'Recruiting report generated successfully!'
    });

  } catch (error) {
    console.error('Recruiting report generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recruiting report' },
      { status: 500 }
    );
  }
}

function calculatePerformanceMetrics(analyses: any[]) {
  const metrics = {
    technicalSkills: 0,
    athleticism: 0,
    gameAwareness: 0,
    consistency: 0,
    improvementPotential: 0,
    overallTrend: 'stable',
    strengthAreas: [] as string[],
    improvementAreas: [] as string[]
  };

  if (analyses.length === 0) return metrics;

  // Calculate averages
  const totals = analyses.reduce((acc, analysis) => {
    const data = analysis.analysisData as any;
    return {
      technical: acc.technical + (data.technicalSkills || 75),
      athletic: acc.athletic + (data.athleticism || 75),
      awareness: acc.awareness + (data.gameAwareness || 75),
      consistency: acc.consistency + (data.consistency || 75),
      improvement: acc.improvement + (data.improvementPotential || 75)
    };
  }, { technical: 0, athletic: 0, awareness: 0, consistency: 0, improvement: 0 });

  const count = analyses.length;
  metrics.technicalSkills = Math.round(totals.technical / count);
  metrics.athleticism = Math.round(totals.athletic / count);
  metrics.gameAwareness = Math.round(totals.awareness / count);
  metrics.consistency = Math.round(totals.consistency / count);
  metrics.improvementPotential = Math.round(totals.improvement / count);

  // Determine strengths and areas for improvement
  const scores = [
    { area: 'Technical Skills', score: metrics.technicalSkills },
    { area: 'Athleticism', score: metrics.athleticism },
    { area: 'Game Awareness', score: metrics.gameAwareness },
    { area: 'Consistency', score: metrics.consistency },
    { area: 'Improvement Potential', score: metrics.improvementPotential }
  ];

  scores.sort((a, b) => b.score - a.score);
  metrics.strengthAreas = scores.slice(0, 2).map(s => s.area);
  metrics.improvementAreas = scores.slice(-2).map(s => s.area);

  // Calculate trend (simplified)
  if (analyses.length >= 3) {
    const recent = analyses.slice(0, 3);
    const older = analyses.slice(-3);
    
    const recentAvg = recent.reduce((sum, a) => sum + (a.garScore || 75), 0) / recent.length;
    const olderAvg = older.reduce((sum, a) => sum + (a.garScore || 75), 0) / older.length;
    
    if (recentAvg > olderAvg + 2) metrics.overallTrend = 'improving';
    else if (recentAvg < olderAvg - 2) metrics.overallTrend = 'declining';
  }

  return metrics;
}

async function generateComprehensiveReport(athlete: any, analyses: any[], metrics: any) {
  const report = {
    athleteProfile: {
      name: `${athlete.firstName} ${athlete.lastName}`,
      email: athlete.email,
      garScore: athlete.garScore,
      verificationDate: athlete.verifiedAt,
      profileImage: athlete.profileImageUrl
    },
    performanceSummary: {
      overallRating: athlete.garScore,
      trend: metrics.overallTrend,
      totalAnalyses: analyses.length,
      strengths: metrics.strengthAreas,
      developmentAreas: metrics.improvementAreas
    },
    detailedMetrics: {
      technicalSkills: {
        score: metrics.technicalSkills,
        description: getPerformanceDescription('technical', metrics.technicalSkills),
        examples: getPerformanceExamples('technical', analyses)
      },
      athleticism: {
        score: metrics.athleticism,
        description: getPerformanceDescription('athleticism', metrics.athleticism),
        examples: getPerformanceExamples('athleticism', analyses)
      },
      gameAwareness: {
        score: metrics.gameAwareness,
        description: getPerformanceDescription('awareness', metrics.gameAwareness),
        examples: getPerformanceExamples('awareness', analyses)
      },
      consistency: {
        score: metrics.consistency,
        description: getPerformanceDescription('consistency', metrics.consistency),
        examples: getPerformanceExamples('consistency', analyses)
      }
    },
    recruitingHighlights: generateRecruitingHighlights(athlete, metrics),
    recommendedNextSteps: generateNextSteps(metrics),
    coachingNotes: generateCoachingNotes(analyses, metrics),
    generatedAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days
  };

  return report;
}

function getPerformanceDescription(category: string, score: number): string {
  const level = score >= 90 ? 'exceptional' : score >= 80 ? 'strong' : score >= 70 ? 'developing' : 'needs focus';
  
  const descriptions = {
    technical: {
      exceptional: 'Demonstrates mastery of fundamental techniques with precision and consistency.',
      strong: 'Shows solid technical foundation with good execution in most situations.',
      developing: 'Basic technical skills present, with room for refinement and consistency.',
      'needs focus': 'Technical fundamentals require significant development and practice.'
    },
    athleticism: {
      exceptional: 'Outstanding physical capabilities including speed, strength, and agility.',
      strong: 'Good athletic foundation with above-average physical attributes.',
      developing: 'Adequate athletic ability with potential for improvement through training.',
      'needs focus': 'Physical development needed to compete at higher levels.'
    },
    awareness: {
      exceptional: 'Exceptional game intelligence and decision-making under pressure.',
      strong: 'Good understanding of game situations and tactical awareness.',
      developing: 'Basic game awareness with room to grow in decision-making.',
      'needs focus': 'Game intelligence and situational awareness need significant development.'
    },
    consistency: {
      exceptional: 'Maintains high performance level across all analyzed sessions.',
      strong: 'Generally consistent performance with minor variations.',
      developing: 'Some inconsistency in performance levels between sessions.',
      'needs focus': 'Significant performance variations require attention and practice.'
    }
  };

  return descriptions[category]?.[level] || 'Performance assessment available.';
}

function getPerformanceExamples(category: string, analyses: any[]): string[] {
  // Extract specific examples from analysis feedback
  const examples: string[] = [];
  
  analyses.slice(0, 3).forEach(analysis => {
    const feedback = analysis.feedback;
    if (feedback && typeof feedback === 'string') {
      // Extract relevant sentences based on category
      const sentences = feedback.split('. ');
      sentences.forEach(sentence => {
        if (category === 'technical' && (sentence.includes('form') || sentence.includes('technique'))) {
          examples.push(sentence.trim());
        } else if (category === 'athleticism' && (sentence.includes('speed') || sentence.includes('power'))) {
          examples.push(sentence.trim());
        } else if (category === 'awareness' && (sentence.includes('decision') || sentence.includes('positioning'))) {
          examples.push(sentence.trim());
        }
      });
    }
  });

  return examples.slice(0, 2);
}

function generateRecruitingHighlights(athlete: any, metrics: any): string[] {
  const highlights: string[] = [];
  
  if (athlete.garScore >= 85) {
    highlights.push(`Elite GAR Score of ${athlete.garScore} - Top 10% of verified athletes`);
  }
  
  if (metrics.overallTrend === 'improving') {
    highlights.push('Consistent improvement trajectory showing dedication and coachability');
  }
  
  if (metrics.technicalSkills >= 85) {
    highlights.push('Exceptional technical foundation ready for collegiate-level competition');
  }
  
  if (metrics.athleticism >= 85) {
    highlights.push('Outstanding athletic ability with high ceiling for development');
  }
  
  if (metrics.consistency >= 80) {
    highlights.push('Reliable performer who maintains high standards under pressure');
  }

  // Add verification highlight
  if (athlete.isVerified) {
    highlights.push('Officially verified athlete through Go4It Sports comprehensive analysis system');
  }

  return highlights;
}

function generateNextSteps(metrics: any): string[] {
  const steps: string[] = [];
  
  steps.push('Continue regular GAR analysis sessions to track development');
  steps.push('Maintain training consistency to build on current strengths');
  
  if (metrics.improvementAreas.includes('Technical Skills')) {
    steps.push('Focus on technical skill refinement through specialized drills');
  }
  
  if (metrics.improvementAreas.includes('Athleticism')) {
    steps.push('Implement strength and conditioning program to enhance athletic performance');
  }
  
  if (metrics.improvementAreas.includes('Game Awareness')) {
    steps.push('Study game film and tactical scenarios to improve decision-making');
  }
  
  if (metrics.overallTrend !== 'improving') {
    steps.push('Work with coaching staff to identify and address performance plateaus');
  }

  return steps;
}

function generateCoachingNotes(analyses: any[], metrics: any): string[] {
  const notes: string[] = [];
  
  notes.push(`Athlete has completed ${analyses.length} comprehensive GAR analyses`);
  notes.push(`Performance trend: ${metrics.overallTrend}`);
  notes.push(`Primary strengths: ${metrics.strengthAreas.join(', ')}`);
  notes.push(`Development focus areas: ${metrics.improvementAreas.join(', ')}`);
  
  if (analyses.length >= 5) {
    notes.push('Demonstrates commitment to improvement through consistent analysis participation');
  }
  
  return notes;
}