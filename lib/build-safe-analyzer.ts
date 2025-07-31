// Build-safe video analyzer that doesn't import TensorFlow.js during build
// This prevents webpack bundling issues while maintaining functionality

interface AnalysisResult {
  success: boolean;
  garScore: number;
  technicalScore: number;
  athleticismScore: number;
  gameAwarenessScore: number;
  mentalScore: number;
  biomechanicsScore: number;
  feedback: string[];
  strengths: string[];
  areasForImprovement: string[];
  injuryRiskAssessment: {
    overallRisk: 'low' | 'medium' | 'high';
    specificRisks: string[];
    preventionTips: string[];
  };
  performancePrediction: {
    collegePotential: 'high' | 'medium' | 'low';
    strengths: string[];
    developmentAreas: string[];
  };
}

export class BuildSafeAnalyzer {
  
  async analyzeVideo(
    videoPath: string, 
    sport: string = 'basketball'
  ): Promise<AnalysisResult> {
    // During build, return a safe placeholder result
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined' && !process.env.RUNTIME_INIT) {
      return this.getPlaceholderResult();
    }
    
    try {
      // Skip TensorFlow.js imports during build - only use at runtime
      if (process.env.NODE_ENV === 'production' && typeof window === 'undefined' && !process.env.RUNTIME_INIT) {
        return this.getPlaceholderResult();
      }
      
      // Use production analyzer instead of TensorFlow.js for build compatibility
      const { productionAnalyzer } = await import('./production-analyzer');
      return await productionAnalyzer.analyzeVideo(videoPath, sport);
    } catch (error) {
      console.error('Analysis error:', error);
      return this.getErrorResult();
    }
  }
  
  private getPlaceholderResult(): AnalysisResult {
    return {
      success: true,
      garScore: 0,
      technicalScore: 0,
      athleticismScore: 0,
      gameAwarenessScore: 0,
      mentalScore: 0,
      biomechanicsScore: 0,
      feedback: ['Analysis will be available at runtime'],
      strengths: [],
      areasForImprovement: [],
      injuryRiskAssessment: {
        overallRisk: 'low',
        specificRisks: [],
        preventionTips: []
      },
      performancePrediction: {
        collegePotential: 'medium',
        strengths: [],
        developmentAreas: []
      }
    };
  }
  
  private getErrorResult(): AnalysisResult {
    return {
      success: false,
      garScore: 0,
      technicalScore: 0,
      athleticismScore: 0,
      gameAwarenessScore: 0,
      mentalScore: 0,
      biomechanicsScore: 0,
      feedback: ['Analysis temporarily unavailable'],
      strengths: [],
      areasForImprovement: [],
      injuryRiskAssessment: {
        overallRisk: 'low',
        specificRisks: [],
        preventionTips: []
      },
      performancePrediction: {
        collegePotential: 'medium',
        strengths: [],
        developmentAreas: []
      }
    };
  }
}

export const buildSafeAnalyzer = new BuildSafeAnalyzer();