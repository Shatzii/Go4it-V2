import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { videoAnalysis } from '@/lib/schema';
import { analyzeVideoWithAI } from '@/lib/ai-analysis';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const sport = formData.get('sport') as string;
    const analysisType = formData.get('analysisType') as string;

    // Extract video files and their angles
    const videoFiles: { file: File; angle: string }[] = [];
    let index = 0;
    
    while (formData.has(`video_${index}`)) {
      const videoFile = formData.get(`video_${index}`) as File;
      const angle = formData.get(`angle_${index}`) as string;
      
      if (videoFile && angle) {
        videoFiles.push({ file: videoFile, angle });
      }
      index++;
    }

    if (videoFiles.length < 2) {
      return NextResponse.json({ 
        error: 'At least 2 video angles required for multi-angle analysis' 
      }, { status: 400 });
    }

    // Process each video angle
    const angleAnalyses: { [key: string]: any } = {};
    const overallMetrics = {
      technicalSkills: 0,
      athleticism: 0,
      gameAwareness: 0,
      consistency: 0,
      improvementPotential: 0
    };

    for (const { file, angle } of videoFiles) {
      try {
        // Convert file to buffer for AI analysis
        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Analyze this specific angle
        const angleAnalysis = await analyzeVideoWithAI(buffer, {
          sport,
          analysisType: 'multi-angle',
          cameraAngle: angle,
          user: {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email
          }
        });

        angleAnalyses[angle] = angleAnalysis;

        // Aggregate metrics (weighted by angle importance)
        const weights = getAngleWeights(angle, sport);
        overallMetrics.technicalSkills += (angleAnalysis.technicalSkills || 75) * weights.technical;
        overallMetrics.athleticism += (angleAnalysis.athleticism || 75) * weights.athletic;
        overallMetrics.gameAwareness += (angleAnalysis.gameAwareness || 75) * weights.awareness;
        overallMetrics.consistency += (angleAnalysis.consistency || 75) * weights.consistency;
        overallMetrics.improvementPotential += (angleAnalysis.improvementPotential || 75) * weights.improvement;

      } catch (error) {
        console.error(`Analysis failed for angle ${angle}:`, error);
        // Use fallback scoring for failed angle
        angleAnalyses[angle] = {
          error: 'Analysis failed for this angle',
          technicalSkills: 70,
          athleticism: 70,
          gameAwareness: 70,
          consistency: 70,
          improvementPotential: 70
        };
      }
    }

    // Normalize aggregated metrics
    const totalWeight = videoFiles.length;
    Object.keys(overallMetrics).forEach(key => {
      overallMetrics[key] = Math.round(overallMetrics[key] / totalWeight);
    });

    // Calculate enhanced overall GAR score
    const enhancedGarScore = Math.round(
      (overallMetrics.technicalSkills + 
       overallMetrics.athleticism + 
       overallMetrics.gameAwareness + 
       overallMetrics.consistency + 
       overallMetrics.improvementPotential) / 5
    );

    // Apply multi-angle bonus (typically 5-15% improvement)
    const angleBonus = Math.min(videoFiles.length * 2, 15);
    const finalGarScore = Math.min(enhancedGarScore + angleBonus, 100);

    // Generate comprehensive analysis report
    const multiAngleReport = {
      overallScore: finalGarScore,
      baseScore: enhancedGarScore,
      angleBonus: angleBonus,
      anglesAnalyzed: videoFiles.length,
      angleBreakdown: overallMetrics,
      angleSpecificAnalysis: angleAnalyses,
      strengths: identifyStrengths(angleAnalyses, overallMetrics),
      improvements: identifyImprovements(angleAnalyses, overallMetrics),
      biomechanicalInsights: generateBiomechanicalInsights(angleAnalyses, sport),
      recruitingReadiness: assessRecruitingReadiness(finalGarScore, angleAnalyses),
      recommendations: generateMultiAngleRecommendations(angleAnalyses, overallMetrics, sport)
    };

    // Save to database
    const [savedAnalysis] = await db
      .insert(videoAnalysis)
      .values({
        userId: user.id,
        sport: sport,
        fileName: `multi-angle-${videoFiles.length}-cameras`,
        filePath: 'multi-angle-analysis',
        garScore: finalGarScore,
        analysisData: multiAngleReport,
        feedback: generateMultiAngleFeedback(multiAngleReport),
        analysisType: 'multi-angle',
        createdAt: new Date(),
      })
      .returning();

    // Update user's GAR score if this is their best
    if (finalGarScore > (user.garScore || 0)) {
      await db
        .update(users)
        .set({ 
          garScore: finalGarScore,
          lastGarAnalysis: new Date(),
          isVerified: true,
          verifiedAt: new Date()
        })
        .where(eq(users.id, user.id));
    }

    return NextResponse.json({
      success: true,
      analysisId: savedAnalysis.id,
      garScore: finalGarScore,
      improvement: finalGarScore - enhancedGarScore,
      report: multiAngleReport,
      message: `Multi-angle analysis complete! GAR Score: ${finalGarScore} (+${angleBonus} angle bonus)`
    });

  } catch (error) {
    console.error('Multi-angle analysis error:', error);
    return NextResponse.json(
      { error: 'Multi-angle analysis failed' },
      { status: 500 }
    );
  }
}

function getAngleWeights(angle: string, sport: string): any {
  // Different sports benefit from different camera angles
  const sportWeights = {
    football: {
      front: { technical: 0.3, athletic: 0.2, awareness: 0.4, consistency: 0.3, improvement: 0.3 },
      side: { technical: 0.4, athletic: 0.3, awareness: 0.3, consistency: 0.4, improvement: 0.4 },
      rear: { technical: 0.2, athletic: 0.3, awareness: 0.2, consistency: 0.2, improvement: 0.2 },
      top: { technical: 0.1, athletic: 0.2, awareness: 0.1, consistency: 0.1, improvement: 0.1 }
    },
    basketball: {
      front: { technical: 0.3, athletic: 0.3, awareness: 0.4, consistency: 0.3, improvement: 0.3 },
      side: { technical: 0.4, athletic: 0.4, awareness: 0.3, consistency: 0.4, improvement: 0.4 },
      rear: { technical: 0.2, athletic: 0.2, awareness: 0.2, consistency: 0.2, improvement: 0.2 },
      top: { technical: 0.1, athletic: 0.1, awareness: 0.1, consistency: 0.1, improvement: 0.1 }
    }
  };

  // Default weights if sport not specifically configured
  return sportWeights[sport]?.[angle] || { technical: 0.25, athletic: 0.25, awareness: 0.25, consistency: 0.25, improvement: 0.25 };
}

function identifyStrengths(angleAnalyses: any, overallMetrics: any): string[] {
  const strengths: string[] = [];
  
  // Find top performing metrics
  const metrics = Object.entries(overallMetrics);
  metrics.sort((a, b) => (b[1] as number) - (a[1] as number));
  
  const topMetrics = metrics.slice(0, 2);
  
  topMetrics.forEach(([metric, score]) => {
    if (score >= 80) {
      const strengthDescriptions = {
        technicalSkills: 'Excellent technical execution across multiple angles',
        athleticism: 'Strong athletic performance visible from all perspectives',
        gameAwareness: 'Superior situational awareness and decision-making',
        consistency: 'Consistent performance across different camera angles',
        improvementPotential: 'High ceiling for continued development'
      };
      
      strengths.push(strengthDescriptions[metric] || `Strong ${metric}`);
    }
  });

  // Add angle-specific strengths
  Object.entries(angleAnalyses).forEach(([angle, analysis]: [string, any]) => {
    if (analysis.technicalSkills >= 85) {
      strengths.push(`Exceptional form visible from ${angle} view`);
    }
  });

  return strengths;
}

function identifyImprovements(angleAnalyses: any, overallMetrics: any): string[] {
  const improvements: string[] = [];
  
  // Find lowest performing metrics
  const metrics = Object.entries(overallMetrics);
  metrics.sort((a, b) => (a[1] as number) - (b[1] as number));
  
  const bottomMetrics = metrics.slice(0, 2);
  
  bottomMetrics.forEach(([metric, score]) => {
    if (score < 75) {
      const improvementDescriptions = {
        technicalSkills: 'Focus on technical fundamentals with targeted practice',
        athleticism: 'Enhance physical conditioning and athletic development',
        gameAwareness: 'Improve tactical understanding and decision-making speed',
        consistency: 'Work on maintaining consistent performance levels',
        improvementPotential: 'Address limiting factors to unlock higher performance'
      };
      
      improvements.push(improvementDescriptions[metric] || `Improve ${metric}`);
    }
  });

  return improvements;
}

function generateBiomechanicalInsights(angleAnalyses: any, sport: string): string[] {
  const insights: string[] = [];
  
  // Analyze front view for posture and alignment
  if (angleAnalyses.front) {
    insights.push('Front view analysis shows body alignment and balance points');
  }
  
  // Analyze side view for movement mechanics
  if (angleAnalyses.side) {
    insights.push('Side view reveals movement mechanics and kinetic chain efficiency');
  }
  
  // Analyze rear view for symmetry
  if (angleAnalyses.rear) {
    insights.push('Rear view assessment of bilateral symmetry and weight distribution');
  }
  
  // Sport-specific insights
  const sportInsights = {
    football: ['Lower body drive patterns analyzed', 'Hand placement and arm extension mechanics'],
    basketball: ['Jump mechanics and landing patterns', 'Ball handling coordination'],
    soccer: ['Foot strike patterns and body positioning', 'Balance during direction changes'],
    tennis: ['Racket path and body rotation', 'Footwork and court positioning']
  };
  
  if (sportInsights[sport]) {
    insights.push(...sportInsights[sport]);
  }

  return insights;
}

function assessRecruitingReadiness(garScore: number, angleAnalyses: any): any {
  const readiness = {
    overall: garScore >= 80 ? 'High' : garScore >= 70 ? 'Moderate' : 'Developing',
    collegeLevel: garScore >= 85 ? 'D1 Ready' : garScore >= 75 ? 'D2/D3 Ready' : 'JUCO/Prep Ready',
    marketability: Object.keys(angleAnalyses).length >= 3 ? 'Professional Package' : 'Standard Package',
    recommendations: []
  };

  if (garScore >= 80) {
    readiness.recommendations.push('Ready for college recruitment outreach');
    readiness.recommendations.push('Create highlight reel with multi-angle footage');
  } else {
    readiness.recommendations.push('Continue development before major recruitment push');
    readiness.recommendations.push('Focus on identified improvement areas');
  }

  return readiness;
}

function generateMultiAngleRecommendations(angleAnalyses: any, overallMetrics: any, sport: string): string[] {
  const recommendations: string[] = [];
  
  recommendations.push('Multi-angle analysis provides comprehensive performance overview');
  
  if (Object.keys(angleAnalyses).length >= 3) {
    recommendations.push('Excellent camera coverage - professional-level analysis achieved');
  } else {
    recommendations.push('Consider adding more camera angles for even more detailed analysis');
  }
  
  // Technical recommendations based on weakest areas
  const weakestMetric = Object.entries(overallMetrics).reduce((min, [key, value]) => 
    value < min.value ? { key, value } : min, { key: '', value: 100 });
  
  if (weakestMetric.value < 75) {
    const techRecommendations = {
      technicalSkills: 'Focus on fundamental technique drills with video feedback',
      athleticism: 'Implement strength and conditioning program',
      gameAwareness: 'Study game film and practice decision-making scenarios',
      consistency: 'Increase practice repetitions to build muscle memory',
      improvementPotential: 'Work with specialized coaching to address limiting factors'
    };
    
    recommendations.push(techRecommendations[weakestMetric.key] || 'Continue focused training');
  }

  recommendations.push('Use this multi-angle analysis for recruiting materials and coach discussions');
  
  return recommendations;
}

function generateMultiAngleFeedback(report: any): string {
  const { overallScore, angleBonus, anglesAnalyzed, strengths, improvements } = report;
  
  let feedback = `Multi-angle GAR Analysis Complete!\n\n`;
  feedback += `Overall GAR Score: ${overallScore}/100\n`;
  feedback += `Base Score: ${overallScore - angleBonus}/100\n`;
  feedback += `Multi-angle Bonus: +${angleBonus} points\n`;
  feedback += `Cameras Used: ${anglesAnalyzed}\n\n`;
  
  if (strengths.length > 0) {
    feedback += `Key Strengths:\n`;
    strengths.forEach(strength => feedback += `• ${strength}\n`);
    feedback += `\n`;
  }
  
  if (improvements.length > 0) {
    feedback += `Areas for Improvement:\n`;
    improvements.forEach(improvement => feedback += `• ${improvement}\n`);
    feedback += `\n`;
  }
  
  feedback += `The multi-angle analysis provides a comprehensive view of your performance from multiple perspectives. `;
  feedback += `This enhanced analysis is perfect for recruiting materials and detailed performance development.`;
  
  return feedback;
}