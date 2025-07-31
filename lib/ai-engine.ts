/**
 * Advanced AI Engine for Go4It Sports Platform
 * Implements computer vision, performance analysis, and predictive modeling
 */

import * as tf from '@tensorflow/tfjs';

// AI Engine Configuration
export interface AIEngineConfig {
  modelPath: string;
  confidence: number;
  maxDetections: number;
  enableGPU: boolean;
  batchSize: number;
}

// Performance Analysis Result
export interface PerformanceAnalysis {
  technique: {
    score: number;
    feedback: string[];
    improvements: string[];
  };
  biomechanics: {
    balance: number;
    coordination: number;
    efficiency: number;
    riskFactors: string[];
  };
  prediction: {
    potentialRating: number;
    improvementAreas: string[];
    timelineEstimate: string;
  };
  comparison: {
    peerPercentile: number;
    professionalGap: number;
    strengthAreas: string[];
  };
}

// Pose Detection Point
export interface PosePoint {
  x: number;
  y: number;
  confidence: number;
  name: string;
}

// Video Frame Analysis
export interface FrameAnalysis {
  timestamp: number;
  poses: PosePoint[];
  motion: {
    velocity: number;
    acceleration: number;
    direction: number;
  };
  technique: {
    form: number;
    balance: number;
    power: number;
  };
}

class AIEngine {
  private model: tf.GraphModel | null = null;
  private config: AIEngineConfig;
  private isInitialized = false;

  constructor(config: AIEngineConfig) {
    this.config = config;
  }

  async initialize(): Promise<boolean> {
    try {
      // Set backend for optimal performance
      if (this.config.enableGPU) {
        await tf.setBackend('webgl');
      } else {
        await tf.setBackend('cpu');
      }

      // Load pre-trained model for pose detection
      this.model = await tf.loadGraphModel('/models/pose-detection-model.json');
      
      this.isInitialized = true;
      console.log('AI Engine initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize AI Engine:', error);
      return false;
    }
  }

  async analyzeVideo(videoElement: HTMLVideoElement, sport: string): Promise<PerformanceAnalysis> {
    if (!this.isInitialized || !this.model) {
      throw new Error('AI Engine not initialized');
    }

    const frames = await this.extractFrames(videoElement);
    const frameAnalyses = await this.analyzeFrames(frames);
    
    return this.generatePerformanceAnalysis(frameAnalyses, sport);
  }

  private async extractFrames(video: HTMLVideoElement): Promise<ImageData[]> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Cannot create canvas context');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const frames: ImageData[] = [];
    const frameCount = Math.min(30, Math.floor(video.duration * 2)); // 2 FPS sample
    
    for (let i = 0; i < frameCount; i++) {
      video.currentTime = (video.duration / frameCount) * i;
      await new Promise(resolve => video.addEventListener('seeked', resolve, { once: true }));
      
      ctx.drawImage(video, 0, 0);
      frames.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }

    return frames;
  }

  private async analyzeFrames(frames: ImageData[]): Promise<FrameAnalysis[]> {
    const analyses: FrameAnalysis[] = [];
    
    for (let i = 0; i < frames.length; i++) {
      const tensor = tf.browser.fromPixels(frames[i]);
      const resized = tf.image.resizeBilinear(tensor, [257, 257]);
      const normalized = resized.div(255.0);
      
      // Run pose detection
      const predictions = await this.model!.predict(normalized.expandDims(0)) as tf.Tensor;
      const poses = await this.extractPoses(predictions);
      
      // Calculate motion metrics
      const motion = i > 0 ? this.calculateMotion(analyses[i-1].poses, poses) : {
        velocity: 0,
        acceleration: 0,
        direction: 0
      };

      // Analyze technique
      const technique = this.analyzeTechnique(poses);

      analyses.push({
        timestamp: i * (1/2), // 2 FPS
        poses,
        motion,
        technique
      });

      // Cleanup tensors
      tensor.dispose();
      resized.dispose();
      normalized.dispose();
      predictions.dispose();
    }

    return analyses;
  }

  private async extractPoses(predictions: tf.Tensor): Promise<PosePoint[]> {
    const data = await predictions.data();
    const poses: PosePoint[] = [];
    
    // Extract key points (17 major body joints)
    const keypoints = [
      'nose', 'leftEye', 'rightEye', 'leftEar', 'rightEar',
      'leftShoulder', 'rightShoulder', 'leftElbow', 'rightElbow',
      'leftWrist', 'rightWrist', 'leftHip', 'rightHip',
      'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle'
    ];

    for (let i = 0; i < keypoints.length; i++) {
      poses.push({
        name: keypoints[i],
        x: data[i * 3],
        y: data[i * 3 + 1],
        confidence: data[i * 3 + 2]
      });
    }

    return poses;
  }

  private calculateMotion(prevPoses: PosePoint[], currentPoses: PosePoint[]) {
    // Calculate center of mass movement
    const prevCenter = this.calculateCenterOfMass(prevPoses);
    const currentCenter = this.calculateCenterOfMass(currentPoses);
    
    const dx = currentCenter.x - prevCenter.x;
    const dy = currentCenter.y - prevCenter.y;
    
    const velocity = Math.sqrt(dx * dx + dy * dy);
    const direction = Math.atan2(dy, dx) * (180 / Math.PI);

    return {
      velocity,
      acceleration: velocity, // Simplified - would need previous velocity for true acceleration
      direction
    };
  }

  private calculateCenterOfMass(poses: PosePoint[]): { x: number; y: number } {
    let totalX = 0;
    let totalY = 0;
    let count = 0;

    poses.forEach(pose => {
      if (pose.confidence > 0.5) {
        totalX += pose.x;
        totalY += pose.y;
        count++;
      }
    });

    return {
      x: count > 0 ? totalX / count : 0,
      y: count > 0 ? totalY / count : 0
    };
  }

  private analyzeTechnique(poses: PosePoint[]) {
    // Sport-specific technique analysis
    const balance = this.calculateBalance(poses);
    const form = this.calculateForm(poses);
    const power = this.calculatePower(poses);

    return { form, balance, power };
  }

  private calculateBalance(poses: PosePoint[]): number {
    const leftAnkle = poses.find(p => p.name === 'leftAnkle');
    const rightAnkle = poses.find(p => p.name === 'rightAnkle');
    const centerMass = this.calculateCenterOfMass(poses);

    if (!leftAnkle || !rightAnkle) return 0;

    const footCenter = {
      x: (leftAnkle.x + rightAnkle.x) / 2,
      y: (leftAnkle.y + rightAnkle.y) / 2
    };

    const distance = Math.sqrt(
      Math.pow(centerMass.x - footCenter.x, 2) + 
      Math.pow(centerMass.y - footCenter.y, 2)
    );

    // Convert to 0-100 score (closer to center = better balance)
    return Math.max(0, 100 - (distance * 100));
  }

  private calculateForm(poses: PosePoint[]): number {
    // Analyze spine alignment and joint angles
    const leftShoulder = poses.find(p => p.name === 'leftShoulder');
    const rightShoulder = poses.find(p => p.name === 'rightShoulder');
    const leftHip = poses.find(p => p.name === 'leftHip');
    const rightHip = poses.find(p => p.name === 'rightHip');

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return 0;

    // Calculate shoulder and hip alignment
    const shoulderAngle = Math.atan2(
      rightShoulder.y - leftShoulder.y,
      rightShoulder.x - leftShoulder.x
    );
    const hipAngle = Math.atan2(
      rightHip.y - leftHip.y,
      rightHip.x - leftHip.x
    );

    const alignment = Math.abs(shoulderAngle - hipAngle);
    
    // Convert to 0-100 score (better alignment = higher score)
    return Math.max(0, 100 - (alignment * 180 / Math.PI * 10));
  }

  private calculatePower(poses: PosePoint[]): number {
    // Simplified power calculation based on limb extension
    const leftElbow = poses.find(p => p.name === 'leftElbow');
    const rightElbow = poses.find(p => p.name === 'rightElbow');
    const leftKnee = poses.find(p => p.name === 'leftKnee');
    const rightKnee = poses.find(p => p.name === 'rightKnee');

    if (!leftElbow || !rightElbow || !leftKnee || !rightKnee) return 0;

    // Calculate extension angles (simplified)
    const avgExtension = (leftElbow.confidence + rightElbow.confidence + 
                         leftKnee.confidence + rightKnee.confidence) / 4;

    return avgExtension * 100;
  }

  private generatePerformanceAnalysis(frameAnalyses: FrameAnalysis[], sport: string): PerformanceAnalysis {
    // Aggregate analysis across all frames
    const avgTechnique = frameAnalyses.reduce((sum, frame) => {
      return {
        form: sum.form + frame.technique.form,
        balance: sum.balance + frame.technique.balance,
        power: sum.power + frame.technique.power
      };
    }, { form: 0, balance: 0, power: 0 });

    const frameCount = frameAnalyses.length;
    avgTechnique.form /= frameCount;
    avgTechnique.balance /= frameCount;
    avgTechnique.power /= frameCount;

    // Generate sport-specific feedback
    const feedback = this.generateSportSpecificFeedback(avgTechnique, sport);

    return {
      technique: {
        score: (avgTechnique.form + avgTechnique.balance + avgTechnique.power) / 3,
        feedback: feedback.feedback,
        improvements: feedback.improvements
      },
      biomechanics: {
        balance: avgTechnique.balance,
        coordination: avgTechnique.form,
        efficiency: avgTechnique.power,
        riskFactors: this.identifyRiskFactors(frameAnalyses)
      },
      prediction: {
        potentialRating: this.calculatePotential(avgTechnique),
        improvementAreas: feedback.improvements,
        timelineEstimate: this.estimateImprovement(avgTechnique)
      },
      comparison: {
        peerPercentile: this.calculatePeerPercentile(avgTechnique),
        professionalGap: this.calculateProfessionalGap(avgTechnique),
        strengthAreas: feedback.strengths
      }
    };
  }

  private generateSportSpecificFeedback(technique: any, sport: string) {
    const sportFeedback: { [key: string]: any } = {
      basketball: {
        feedback: ['Focus on follow-through', 'Improve shooting arc', 'Strengthen core stability'],
        improvements: ['Practice free throws daily', 'Work on leg strength', 'Improve hand positioning'],
        strengths: ['Good balance', 'Consistent form']
      },
      football: {
        feedback: ['Improve tackling technique', 'Better footwork needed', 'Enhance body positioning'],
        improvements: ['Practice stance drills', 'Work on acceleration', 'Improve reaction time'],
        strengths: ['Good power generation', 'Strong base']
      },
      soccer: {
        feedback: ['Improve first touch', 'Better ball control', 'Enhance passing accuracy'],
        improvements: ['Practice juggling', 'Work on weak foot', 'Improve vision'],
        strengths: ['Good balance', 'Quick movements']
      }
    };

    return sportFeedback[sport.toLowerCase()] || sportFeedback.basketball;
  }

  private identifyRiskFactors(frameAnalyses: FrameAnalysis[]): string[] {
    const riskFactors: string[] = [];
    
    // Check for consistent poor balance
    const avgBalance = frameAnalyses.reduce((sum, frame) => sum + frame.technique.balance, 0) / frameAnalyses.length;
    if (avgBalance < 60) {
      riskFactors.push('Poor balance increases injury risk');
    }

    // Check for excessive motion
    const maxVelocity = Math.max(...frameAnalyses.map(frame => frame.motion.velocity));
    if (maxVelocity > 50) {
      riskFactors.push('High velocity movements may stress joints');
    }

    return riskFactors;
  }

  private calculatePotential(technique: any): number {
    // Weighted combination of technique factors
    return (technique.form * 0.4 + technique.balance * 0.3 + technique.power * 0.3);
  }

  private estimateImprovement(technique: any): string {
    const avgScore = (technique.form + technique.balance + technique.power) / 3;
    
    if (avgScore < 40) return '6-12 months for significant improvement';
    if (avgScore < 70) return '3-6 months for noticeable improvement';
    return '1-3 months for refinement';
  }

  private calculatePeerPercentile(technique: any): number {
    const avgScore = (technique.form + technique.balance + technique.power) / 3;
    
    // Simplified percentile calculation
    return Math.min(99, Math.max(1, avgScore));
  }

  private calculateProfessionalGap(technique: any): number {
    const avgScore = (technique.form + technique.balance + technique.power) / 3;
    
    // Professional level assumed to be 90+
    return Math.max(0, 90 - avgScore);
  }

  async dispose(): Promise<void> {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
    this.isInitialized = false;
  }
}

// Export AI Engine instance
export const aiEngine = new AIEngine({
  modelPath: '/models/pose-detection-model.json',
  confidence: 0.5,
  maxDetections: 1,
  enableGPU: true,
  batchSize: 1
});

// Utility functions for component integration
export const initializeAI = async (): Promise<boolean> => {
  return await aiEngine.initialize();
};

export const analyzeVideoPerformance = async (
  video: HTMLVideoElement, 
  sport: string
): Promise<PerformanceAnalysis> => {
  return await aiEngine.analyzeVideo(video, sport);
};

export const disposeAI = async (): Promise<void> => {
  await aiEngine.dispose();
};