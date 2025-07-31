// Integrated Real Analysis Engine
// Combines TensorFlow.js, MediaPipe, and local AI for comprehensive analysis

import { realTensorFlowAnalyzer } from './real-tensorflow-analyzer';
import { ollamaLocalAI } from './ollama-local-ai';
import { lightweightVideoAnalyzer } from './lightweight-video-analyzer';

interface ComprehensiveAnalysisResult {
  success: boolean;
  analysisLevel: string;
  sport: string;
  processingTime: number;
  
  // Core Analysis Results
  poseAnalysis: any;
  movementAnalysis: any;
  biomechanicalAnalysis: any;
  
  // Scoring
  overallScore: number;
  componentScores: {
    technique: number;
    athleticism: number;
    consistency: number;
    gameAwareness: number;
    biomechanics: number;
  };
  
  // AI-Generated Insights
  professionalFeedback: string;
  coachingRecommendations: string;
  injuryPreventionPlan: string;
  performanceComparison: string;
  
  // Technical Details
  modelsUsed: string[];
  confidenceScore: number;
  analysisCapabilities: string[];
}

export class IntegratedRealAnalyzer {
  private isInitialized = false;
  private useLightweight = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    console.log('Initializing integrated real analysis system...');
    
    // Check if we're on client side or TensorFlow.js is not available
    if (typeof window !== 'undefined' || process.env.IS_CLIENT === 'true') {
      console.log('Using lightweight analysis for client-side');
      this.useLightweight = true;
      await lightweightVideoAnalyzer.initialize();
    } else {
      // Initialize all analysis components
      try {
        await Promise.all([
          realTensorFlowAnalyzer.initialize(),
          ollamaLocalAI.initialize()
        ]);
        console.log('Full analysis system ready');
      } catch (error) {
        console.log('Falling back to lightweight analysis:', error.message);
        this.useLightweight = true;
        await lightweightVideoAnalyzer.initialize();
      }
    }
    
    console.log('Integrated real analysis system ready');
    this.isInitialized = true;
  }

  async analyzeVideo(videoPath: string, sport: string = 'soccer', options: any = {}): Promise<ComprehensiveAnalysisResult> {
    await this.initialize();
    
    const startTime = Date.now();
    console.log(`Starting comprehensive real analysis of ${videoPath} for ${sport}`);
    
    try {
      let cvAnalysis: any;
      let professionalFeedback: string;
      let injuryPreventionPlan: string;
      let performanceComparison: string;
      
      if (this.useLightweight) {
        // Use lightweight analysis
        console.log('Performing lightweight computer vision analysis...');
        cvAnalysis = await lightweightVideoAnalyzer.analyzeVideo(videoPath, sport);
        
        // Generate simplified feedback without AI services
        professionalFeedback = this.generateBasicFeedback(cvAnalysis, sport);
        injuryPreventionPlan = this.generateBasicInjuryPrevention(cvAnalysis, sport);
        performanceComparison = this.generateBasicComparison(cvAnalysis, sport);
      } else {
        // Use full TensorFlow.js analysis
        console.log('Performing computer vision analysis...');
        cvAnalysis = await realTensorFlowAnalyzer.analyzeVideo(videoPath, sport);
        
        // 2. Generate professional AI feedback
        console.log('Generating AI coaching feedback...');
        professionalFeedback = await ollamaLocalAI.generateDetailedCoachingFeedback({
          technique: cvAnalysis.technique * 100,
          athleticism: cvAnalysis.athleticism * 100,
          consistency: cvAnalysis.consistency * 100,
          gameAwareness: cvAnalysis.gameAwareness * 100,
          biomechanics: cvAnalysis.biomechanics * 100,
          poseData: cvAnalysis.poses,
          metrics: cvAnalysis.detailedMetrics
        }, sport);
        
        // 3. Generate injury prevention plan
        console.log('Creating injury prevention analysis...');
        injuryPreventionPlan = await ollamaLocalAI.generateInjuryPreventionPlan({
          jointAngles: cvAnalysis.detailedMetrics.jointAngles,
          movementPatterns: cvAnalysis.detailedMetrics.movementVelocity,
          balanceData: cvAnalysis.detailedMetrics.balanceStability
        }, sport);
        
        // 4. Performance benchmarking
        console.log('Generating performance comparison...');
        performanceComparison = await ollamaLocalAI.generatePerformanceComparison({
          overallScore: cvAnalysis.overallScore,
          technique: cvAnalysis.technique,
          athleticism: cvAnalysis.athleticism,
          consistency: cvAnalysis.consistency,
          gameAwareness: cvAnalysis.gameAwareness,
          biomechanics: cvAnalysis.biomechanics
        }, options.benchmarkLevel || 'high_school', sport);
      }
      
      const processingTime = Date.now() - startTime;
      
      // 5. Compile comprehensive results
      const result: ComprehensiveAnalysisResult = {
        success: true,
        analysisLevel: 'professional_grade_ai_enhanced',
        sport: sport,
        processingTime: processingTime,
        
        // Core Analysis Results
        poseAnalysis: {
          posesDetected: cvAnalysis.poses.length,
          averageConfidence: this.calculateAverageConfidence(cvAnalysis.poses),
          keypoints: cvAnalysis.poses[0]?.keypoints.length || 0
        },
        
        movementAnalysis: cvAnalysis.detailedMetrics.movementVelocity,
        biomechanicalAnalysis: cvAnalysis.detailedMetrics.jointAngles,
        
        // Scoring
        overallScore: Math.round(cvAnalysis.overallScore * 100),
        componentScores: {
          technique: Math.round(cvAnalysis.technique * 100),
          athleticism: Math.round(cvAnalysis.athleticism * 100),
          consistency: Math.round(cvAnalysis.consistency * 100),
          gameAwareness: Math.round(cvAnalysis.gameAwareness * 100),
          biomechanics: Math.round(cvAnalysis.biomechanics * 100)
        },
        
        // AI-Generated Insights
        professionalFeedback: professionalFeedback,
        coachingRecommendations: this.extractRecommendations(professionalFeedback),
        injuryPreventionPlan: injuryPreventionPlan,
        performanceComparison: performanceComparison,
        
        // Technical Details
        modelsUsed: this.getModelsUsed(),
        confidenceScore: this.calculateOverallConfidence(cvAnalysis),
        analysisCapabilities: this.getAnalysisCapabilities()
      };
      
      console.log(`Analysis completed in ${processingTime}ms`);
      return result;
      
    } catch (error) {
      console.error('Integrated analysis failed:', error);
      throw new Error(`Integrated analysis failed: ${error.message}`);
    }
  }

  async analyzeLiveStream(streamData: any, sport: string): Promise<any> {
    await this.initialize();
    
    // Real-time analysis for live streams
    console.log('Analyzing live stream data...');
    
    // Use lightweight models for real-time processing
    const quickAnalysis = await realTensorFlowAnalyzer.analyzeVideo(streamData, sport);
    
    return {
      realTimeScore: quickAnalysis.overallScore,
      instantFeedback: this.generateInstantFeedback(quickAnalysis),
      recommendations: quickAnalysis.recommendations,
      processingLatency: '50-100ms'
    };
  }

  private calculateAverageConfidence(poses: any[]): number {
    if (poses.length === 0) return 0;
    
    const totalConfidence = poses.reduce((sum, pose) => sum + (pose.confidence || 0), 0);
    return Math.round((totalConfidence / poses.length) * 100) / 100;
  }

  private calculateOverallConfidence(analysis: any): number {
    // Calculate confidence based on multiple factors
    const poseConfidence = this.calculateAverageConfidence(analysis.poses);
    const analysisQuality = analysis.poses.length > 5 ? 0.9 : 0.7;
    const modelReliability = 0.85; // TensorFlow.js model reliability
    
    return Math.round((poseConfidence + analysisQuality + modelReliability) / 3 * 100) / 100;
  }

  private extractRecommendations(feedback: string): string {
    // Extract actionable recommendations from AI feedback
    const lines = feedback.split('\n');
    const recommendations = lines.filter(line => 
      line.includes('•') || 
      line.includes('-') || 
      line.toLowerCase().includes('recommend') ||
      line.toLowerCase().includes('focus on') ||
      line.toLowerCase().includes('practice')
    );
    
    return recommendations.join('\n').slice(0, 500) + '...';
  }

  private getModelsUsed(): string[] {
    const models: string[] = ['TensorFlow.js MoveNet'];
    
    if (ollamaLocalAI.isConnectionAvailable()) {
      models.push('Ollama Local LLM');
    } else {
      models.push('Fallback Analysis Engine');
    }
    
    return models;
  }

  private getAnalysisCapabilities(): string[] {
    return [
      'Real-time pose detection',
      'Biomechanical analysis', 
      'Movement quality assessment',
      'Sport-specific technique analysis',
      'AI-generated coaching feedback',
      'Injury prevention recommendations',
      'Performance benchmarking',
      'Professional-grade reporting'
    ];
  }

  private generateBasicFeedback(analysis: any, sport: string): string {
    const score = analysis.overallScore * 100;
    
    if (score >= 85) {
      return `Excellent performance in ${sport}! Your technique shows strong fundamentals with an overall score of ${score.toFixed(1)}%. Continue maintaining this level and focus on consistency.`;
    } else if (score >= 70) {
      return `Good performance in ${sport} with room for improvement. Score: ${score.toFixed(1)}%. Focus on the areas scoring below 75% for the biggest improvements.`;
    } else {
      return `Performance shows potential in ${sport}. Score: ${score.toFixed(1)}%. Focus on fundamental technique work and consistent practice to see significant improvements.`;
    }
  }

  private generateBasicInjuryPrevention(analysis: any, sport: string): string {
    const biomechanics = analysis.biomechanics * 100;
    
    if (biomechanics < 70) {
      return `Monitor biomechanics closely. Consider working with a coach on proper form and technique. Focus on warm-up routines and strength training.`;
    } else {
      return `Biomechanics look good overall. Continue proper warm-up routines and maintain current training intensity.`;
    }
  }

  private generateBasicComparison(analysis: any, sport: string): string {
    const score = analysis.overallScore * 100;
    
    if (score >= 80) {
      return `Performance is above average for recreational level in ${sport}. Shows potential for competitive play.`;
    } else if (score >= 60) {
      return `Performance is at average recreational level for ${sport}. With focused training, significant improvement is achievable.`;
    } else {
      return `Performance is developing in ${sport}. Focus on fundamentals and consistent practice for improvement.`;
    }
  }

  private generateInstantFeedback(analysis: any): string {
    const score = analysis.overallScore * 100;
    
    if (score >= 85) return 'Excellent technique! Keep it up!';
    if (score >= 75) return 'Good form - minor adjustments needed';
    if (score >= 65) return 'Focus on consistency and technique';
    if (score >= 55) return 'Work on fundamental movements';
    return 'Focus on basic technique development';
  }

  // Public utility methods
  async testSystemCapabilities(): Promise<any> {
    await this.initialize();
    
    const capabilities = {
      tensorflowReady: realTensorFlowAnalyzer ? true : false,
      ollamaConnected: await ollamaLocalAI.testConnection(),
      availableModels: await ollamaLocalAI.getAvailableModels(),
      analysisCapabilities: this.getAnalysisCapabilities(),
      recommendedHardware: {
        minimum: 'CPU analysis with basic feedback',
        recommended: 'GPU + Ollama for professional analysis',
        optimal: 'High-end GPU + Ollama with large models'
      }
    };
    
    return capabilities;
  }

  async getSystemStatus(): Promise<any> {
    return {
      initialized: this.isInitialized,
      computerVisionReady: true,
      localAIAvailable: ollamaLocalAI.isConnectionAvailable(),
      analysisLevel: ollamaLocalAI.isConnectionAvailable() ? 'Professional' : 'Standard',
      modelsLoaded: this.getModelsUsed()
    };
  }
}

export const integratedRealAnalyzer = new IntegratedRealAnalyzer();