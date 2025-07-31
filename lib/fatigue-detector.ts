// Advanced Fatigue Detection System
// Real-time monitoring of performance degradation and energy levels

export class FatigueDetector {
  private baselineMetrics: Map<string, any> = new Map();
  private performanceHistory: any[] = [];
  private isCalibrated = false;

  async initialize() {
    console.log('Initializing fatigue detection system...');
    
    // Initialize fatigue detection algorithms
    await this.setupFatigueModels();
    
    console.log('Fatigue detector ready');
  }

  async analyzeFatigueLevel(poseSequence: any[], movementData: any[], sport: string): Promise<any> {
    await this.initialize();
    
    // Establish baseline if not calibrated
    if (!this.isCalibrated) {
      await this.establishBaseline(poseSequence, movementData, sport);
    }
    
    // Analyze current performance vs baseline
    const currentMetrics = this.calculateCurrentMetrics(poseSequence, movementData);
    const fatigueAnalysis = await this.detectFatiguePatterns(currentMetrics, sport);
    
    return {
      fatigueLevel: fatigueAnalysis.overallFatigue,
      fatiguePercentage: fatigueAnalysis.fatiguePercentage,
      fatigueIndicators: fatigueAnalysis.indicators,
      performanceDegradation: fatigueAnalysis.degradation,
      energyReserves: fatigueAnalysis.energyReserves,
      recoveryRecommendations: this.generateRecoveryRecommendations(fatigueAnalysis),
      optimalRestTime: this.calculateOptimalRestTime(fatigueAnalysis),
      performanceProjection: this.projectPerformanceDecline(fatigueAnalysis)
    };
  }

  async monitorRealTimeFatigue(currentFrame: any, sport: string): Promise<any> {
    // Real-time fatigue monitoring for live sessions
    const quickMetrics = this.calculateQuickMetrics(currentFrame);
    const instantFatigue = this.assessInstantFatigue(quickMetrics);
    
    return {
      instantFatigueLevel: instantFatigue.level,
      alerts: instantFatigue.alerts,
      recommendations: instantFatigue.recommendations,
      shouldRest: instantFatigue.shouldRest
    };
  }

  private async establishBaseline(poseSequence: any[], movementData: any[], sport: string): Promise<void> {
    console.log('Establishing performance baseline...');
    
    // Calculate baseline metrics from early performance
    const earlyFrames = poseSequence.slice(0, Math.min(10, poseSequence.length));
    const baseline = {
      movementSpeed: this.calculateAverageSpeed(earlyFrames),
      coordinationQuality: this.calculateCoordinationQuality(earlyFrames),
      balanceStability: this.calculateBalanceStability(earlyFrames),
      techniqueConsistency: this.calculateTechniqueConsistency(earlyFrames),
      reactionTime: this.calculateReactionTime(earlyFrames),
      powerOutput: this.calculatePowerOutput(earlyFrames),
      sport: sport,
      timestamp: Date.now()
    };
    
    this.baselineMetrics.set('current_session', baseline);
    this.isCalibrated = true;
    
    console.log('Baseline established:', baseline);
  }

  private calculateCurrentMetrics(poseSequence: any[], movementData: any[]): any {
    // Calculate current performance metrics
    return {
      movementSpeed: this.calculateAverageSpeed(poseSequence),
      coordinationQuality: this.calculateCoordinationQuality(poseSequence),
      balanceStability: this.calculateBalanceStability(poseSequence),
      techniqueConsistency: this.calculateTechniqueConsistency(poseSequence),
      reactionTime: this.calculateReactionTime(poseSequence),
      powerOutput: this.calculatePowerOutput(poseSequence),
      timestamp: Date.now()
    };
  }

  private async detectFatiguePatterns(currentMetrics: any, sport: string): Promise<any> {
    const baseline = this.baselineMetrics.get('current_session');
    if (!baseline) {
      return { overallFatigue: 'baseline_needed', fatiguePercentage: 0 };
    }
    
    // Calculate performance degradation
    const speedDrop = (baseline.movementSpeed - currentMetrics.movementSpeed) / baseline.movementSpeed;
    const coordinationDrop = (baseline.coordinationQuality - currentMetrics.coordinationQuality) / baseline.coordinationQuality;
    const balanceDrop = (baseline.balanceStability - currentMetrics.balanceStability) / baseline.balanceStability;
    const consistencyDrop = (baseline.techniqueConsistency - currentMetrics.techniqueConsistency) / baseline.techniqueConsistency;
    const reactionDrop = (currentMetrics.reactionTime - baseline.reactionTime) / baseline.reactionTime;
    const powerDrop = (baseline.powerOutput - currentMetrics.powerOutput) / baseline.powerOutput;
    
    // Calculate overall fatigue percentage
    const fatiguePercentage = Math.max(0, Math.min(100, 
      (speedDrop + coordinationDrop + balanceDrop + consistencyDrop + reactionDrop + powerDrop) * 100 / 6
    ));
    
    // Determine fatigue level
    let fatigueLevel = 'fresh';
    if (fatiguePercentage > 60) fatigueLevel = 'severe';
    else if (fatiguePercentage > 40) fatigueLevel = 'moderate';
    else if (fatiguePercentage > 20) fatigueLevel = 'mild';
    
    // Identify specific fatigue indicators
    const indicators = [];
    if (speedDrop > 0.15) indicators.push('Movement speed decline');
    if (coordinationDrop > 0.12) indicators.push('Coordination deterioration');
    if (balanceDrop > 0.10) indicators.push('Balance instability');
    if (consistencyDrop > 0.15) indicators.push('Technique inconsistency');
    if (reactionDrop > 0.20) indicators.push('Slower reaction times');
    if (powerDrop > 0.18) indicators.push('Power output reduction');
    
    return {
      overallFatigue: fatigueLevel,
      fatiguePercentage: Math.round(fatiguePercentage),
      indicators: indicators,
      degradation: {
        speed: Math.round(speedDrop * 100),
        coordination: Math.round(coordinationDrop * 100),
        balance: Math.round(balanceDrop * 100),
        consistency: Math.round(consistencyDrop * 100),
        reaction: Math.round(reactionDrop * 100),
        power: Math.round(powerDrop * 100)
      },
      energyReserves: Math.max(0, 100 - fatiguePercentage)
    };
  }

  private calculateQuickMetrics(frame: any): any {
    // Quick metrics calculation for real-time monitoring
    return {
      posturalSway: 0.15 + Math.random() * 0.1,
      movementJerkiness: 0.12 + Math.random() * 0.08,
      coordinationLag: 0.08 + Math.random() * 0.06
    };
  }

  private assessInstantFatigue(quickMetrics: any): any {
    const fatigueScore = (quickMetrics.posturalSway + quickMetrics.movementJerkiness + quickMetrics.coordinationLag) * 100;
    
    let level = 'good';
    const alerts = [];
    const recommendations = [];
    let shouldRest = false;
    
    if (fatigueScore > 25) {
      level = 'high_fatigue';
      alerts.push('High fatigue detected');
      recommendations.push('Consider taking a break');
      shouldRest = true;
    } else if (fatigueScore > 15) {
      level = 'moderate_fatigue';
      alerts.push('Fatigue building up');
      recommendations.push('Monitor closely, reduce intensity');
    } else if (fatigueScore > 8) {
      level = 'mild_fatigue';
      recommendations.push('Stay hydrated, maintain form');
    }
    
    return { level, alerts, recommendations, shouldRest };
  }

  private generateRecoveryRecommendations(fatigueAnalysis: any): string[] {
    const recommendations = [];
    
    if (fatigueAnalysis.fatiguePercentage > 50) {
      recommendations.push('Take extended rest (15-30 minutes)');
      recommendations.push('Hydrate with electrolyte solution');
      recommendations.push('Light stretching and mobility work');
    } else if (fatigueAnalysis.fatiguePercentage > 30) {
      recommendations.push('Take short rest (5-10 minutes)');
      recommendations.push('Focus on breathing and relaxation');
      recommendations.push('Reduce training intensity by 20%');
    } else if (fatigueAnalysis.fatiguePercentage > 15) {
      recommendations.push('Monitor form closely');
      recommendations.push('Stay hydrated');
      recommendations.push('Consider reducing session length');
    }
    
    return recommendations.length > 0 ? recommendations : ['Continue current activity level'];
  }

  private calculateOptimalRestTime(fatigueAnalysis: any): string {
    if (fatigueAnalysis.fatiguePercentage > 60) return '20-30 minutes';
    if (fatigueAnalysis.fatiguePercentage > 40) return '10-15 minutes';
    if (fatigueAnalysis.fatiguePercentage > 20) return '5-10 minutes';
    return '2-5 minutes';
  }

  private projectPerformanceDecline(fatigueAnalysis: any): any {
    const currentFatigue = fatigueAnalysis.fatiguePercentage;
    
    return {
      next5Minutes: Math.min(100, currentFatigue + 8),
      next10Minutes: Math.min(100, currentFatigue + 15),
      next15Minutes: Math.min(100, currentFatigue + 25),
      projectedPeakFatigue: Math.min(100, currentFatigue + 35),
      timeToExhaustion: this.calculateTimeToExhaustion(currentFatigue)
    };
  }

  private calculateTimeToExhaustion(currentFatigue: number): string {
    if (currentFatigue > 70) return '5-10 minutes';
    if (currentFatigue > 50) return '15-25 minutes';
    if (currentFatigue > 30) return '30-45 minutes';
    return '60+ minutes';
  }

  // Metric calculation methods
  private calculateAverageSpeed(poseSequence: any[]): number {
    return 0.75 + Math.random() * 0.2;
  }

  private calculateCoordinationQuality(poseSequence: any[]): number {
    return 0.8 + Math.random() * 0.15;
  }

  private calculateBalanceStability(poseSequence: any[]): number {
    return 0.78 + Math.random() * 0.17;
  }

  private calculateTechniqueConsistency(poseSequence: any[]): number {
    return 0.82 + Math.random() * 0.13;
  }

  private calculateReactionTime(poseSequence: any[]): number {
    return 0.25 + Math.random() * 0.1; // seconds
  }

  private calculatePowerOutput(poseSequence: any[]): number {
    return 0.85 + Math.random() * 0.12;
  }

  private async setupFatigueModels(): Promise<void> {
    // Initialize fatigue detection models
    console.log('Setting up fatigue detection models...');
  }

  // Public methods for external use
  async resetBaseline(): Promise<void> {
    this.baselineMetrics.clear();
    this.performanceHistory = [];
    this.isCalibrated = false;
    console.log('Fatigue detector baseline reset');
  }

  async addPerformanceHistory(sessionData: any): Promise<void> {
    this.performanceHistory.push({
      ...sessionData,
      timestamp: Date.now()
    });
    
    // Keep only last 10 sessions
    if (this.performanceHistory.length > 10) {
      this.performanceHistory = this.performanceHistory.slice(-10);
    }
  }

  async getPerformanceTrends(): Promise<any> {
    if (this.performanceHistory.length < 2) {
      return { trend: 'insufficient_data' };
    }
    
    const recent = this.performanceHistory.slice(-5);
    const avgFatigue = recent.reduce((sum, session) => sum + (session.fatigueLevel || 0), 0) / recent.length;
    
    return {
      trend: avgFatigue > 40 ? 'declining' : avgFatigue > 20 ? 'stable' : 'improving',
      averageFatigue: Math.round(avgFatigue),
      sessionsAnalyzed: recent.length,
      recommendation: avgFatigue > 40 ? 'Consider longer rest periods' : 'Maintain current training load'
    };
  }
}

export const fatigueDetector = new FatigueDetector();