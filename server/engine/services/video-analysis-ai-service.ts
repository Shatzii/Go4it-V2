/**
 * Video Analysis AI Service
 * 
 * This service provides AI-powered analysis of athlete videos,
 * identifying key moments, techniques, and performance metrics.
 */

import { withRetry, logAIEngineActivity, aiEngineClient } from '../utils';
import { AI_ENGINE_CONFIG } from '../config';

export interface VideoMetadata {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  sportType: string;
  userId?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit?: string;
  percentile?: number;
  interpretation: string;
}

export interface KeyMoment {
  timestamp: number;
  label: string;
  description: string;
  significance: string;
  garImpact?: string;
}

export interface TechniqueAnalysis {
  name: string;
  rating: number;
  strengths: string[];
  improvements: string[];
  adhd?: {
    impacts: string[];
    strategies: string[];
  };
}

export interface VideoAnalysisResult {
  videoId: string;
  sportType: string;
  performanceMetrics: PerformanceMetric[];
  keyMoments: KeyMoment[];
  techniques: TechniqueAnalysis[];
  summary: string;
  adhd: {
    focusPatterns: string;
    strengths: string[];
    challenges: string[];
    recommendations: string[];
  };
}

export class VideoAnalysisAIService {
  /**
   * Analyze a video for performance metrics, key moments, and techniques
   * 
   * @param videoId The video ID
   * @param videoPath The path to the video file
   * @param metadata Video metadata including sport type
   */
  async analyzeVideo(
    videoId: string,
    videoPath: string,
    metadata: VideoMetadata
  ): Promise<VideoAnalysisResult | null> {
    try {
      logAIEngineActivity('analyzeVideo', { videoId });
      
      if (AI_ENGINE_CONFIG.useMockData) {
        // For development, return mock data
        return this.getMockVideoAnalysis(videoId, metadata);
      }
      
      // This is the actual implementation that will be used when the AI Engine is available
      return await withRetry(async () => {
        const response = await aiEngineClient.post(
          `${AI_ENGINE_CONFIG.endpoints.videoAnalysis}/analyze`,
          {
            videoId,
            videoPath,
            metadata,
            modelVersion: AI_ENGINE_CONFIG.models.videoAnalysis
          }
        );
        
        return response.data as VideoAnalysisResult;
      });
    } catch (error) {
      logAIEngineActivity('analyzeVideo', { videoId }, null, error as Error);
      console.error('Error analyzing video:', error);
      return null;
    }
  }
  
  /**
   * Get the analysis for a specific video
   * 
   * @param videoId The video ID to retrieve analysis for
   */
  async getVideoAnalysis(videoId: string): Promise<VideoAnalysisResult | null> {
    try {
      logAIEngineActivity('getVideoAnalysis', { videoId });
      
      if (AI_ENGINE_CONFIG.useMockData) {
        // In development, we would typically retrieve this from a database
        // For this mock, we'll generate it on the fly
        return this.getMockVideoAnalysis(videoId, { 
          id: videoId, 
          sportType: 'basketball' 
        });
      }
      
      // This is the actual implementation that will be used when the AI Engine is available
      return await withRetry(async () => {
        const response = await aiEngineClient.get(
          `${AI_ENGINE_CONFIG.endpoints.videoAnalysis}/results/${videoId}`
        );
        
        return response.data as VideoAnalysisResult;
      });
    } catch (error) {
      logAIEngineActivity('getVideoAnalysis', { videoId }, null, error as Error);
      console.error('Error getting video analysis:', error);
      return null;
    }
  }
  
  /**
   * Validate a video file
   * 
   * @param file The video file to validate
   */
  validateVideo(file: Express.Multer.File): { valid: boolean; message?: string } {
    // Check file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return {
        valid: false,
        message: 'Video file is too large. Maximum size is 100MB.'
      };
    }
    
    // Check file type
    const validMimeTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'];
    if (!validMimeTypes.includes(file.mimetype)) {
      return {
        valid: false,
        message: 'Invalid file type. Supported formats: MP4, MOV, AVI, WMV.'
      };
    }
    
    return { valid: true };
  }
  
  /**
   * For development only - get mock video analysis
   * This will be replaced by the actual AI Engine integration
   */
  private getMockVideoAnalysis(videoId: string, metadata: VideoMetadata): VideoAnalysisResult {
    // Use videoId as seed for deterministic mock data
    const seed = parseInt(videoId) || 1;
    const sportType = metadata.sportType.toLowerCase();
    
    // Sport-specific mock data
    const sportMetrics: Record<string, string[]> = {
      basketball: ['Shot accuracy', 'Defensive positioning', 'Ball handling', 'Court vision', 'Vertical leap'],
      football: ['Sprint speed', 'Route precision', 'Tackle form', 'Pass accuracy', 'Field awareness'],
      soccer: ['Ball control', 'Passing accuracy', 'Shooting power', 'Defensive positioning', 'Field vision']
    };
    
    const sportTechniques: Record<string, string[]> = {
      basketball: ['Jump shot form', 'Dribbling technique', 'Defensive stance', 'Rebounding position', 'Free throw routine'],
      football: ['Throwing mechanics', 'Route running', 'Tackling technique', 'Blocking form', 'Coverage skills'],
      soccer: ['Ball striking', 'First touch', 'Heading technique', 'Defensive marking', 'Goalkeeper positioning']
    };
    
    // Get metrics and techniques for this sport, or use defaults
    const metrics = sportMetrics[sportType] || sportMetrics.basketball;
    const techniques = sportTechniques[sportType] || sportTechniques.basketball;
    
    // Generate performance metrics
    const performanceMetrics: PerformanceMetric[] = metrics.map((name, index) => {
      // Create a deterministic but varying value based on seed and metric name
      const value = Math.round((60 + ((seed + index + name.length) % 40)) * 10) / 10;
      const percentile = Math.min(99, Math.max(40, Math.round((value / 100) * 100)));
      
      return {
        name,
        value,
        unit: name.includes('speed') ? 'mph' : 
              name.includes('accuracy') || name.includes('rate') ? '%' : 
              'rating',
        percentile,
        interpretation: percentile > 80 ? 'Exceptional performance' :
                       percentile > 60 ? 'Above average for age group' :
                       percentile > 40 ? 'Average performance' :
                       'Needs improvement'
      };
    });
    
    // Generate key moments
    const keyMoments: KeyMoment[] = [];
    // Create 3-5 key moments
    const numMoments = 3 + (seed % 3);
    for (let i = 0; i < numMoments; i++) {
      // Timestamp between 0 and 5 minutes (300 seconds)
      const timestamp = Math.round(((seed + i * 37) % 300) * 10) / 10;
      
      let label, description, significance;
      
      // Sport-specific moments
      if (sportType === 'basketball') {
        const momentTypes = [
          { label: 'Jump shot', desc: 'Executed a jump shot from mid-range', sig: 'Demonstrates shooting mechanics' },
          { label: 'Defensive stop', desc: 'Successfully contained opponent drive', sig: 'Shows lateral quickness and anticipation' },
          { label: 'Crossover dribble', desc: 'Used crossover to create space', sig: 'Indicates ball handling skill and creativity' },
          { label: 'Rebounding position', desc: 'Established excellent rebounding position', sig: 'Shows understanding of positioning and timing' },
          { label: 'Court vision', desc: 'Made a cross-court assist to open teammate', sig: 'Demonstrates awareness and passing ability' }
        ];
        const moment = momentTypes[(seed + i) % momentTypes.length];
        label = moment.label;
        description = moment.desc;
        significance = moment.sig;
      } else if (sportType === 'football') {
        const momentTypes = [
          { label: 'Route break', desc: 'Sharp cut on route creating separation', sig: 'Shows agility and route running precision' },
          { label: 'Open field tackle', desc: 'Successful form tackle in open field', sig: 'Demonstrates tackling technique and timing' },
          { label: 'Pass completion', desc: 'Accurate pass to covered receiver', sig: 'Shows throwing accuracy and decision making' },
          { label: 'Zone coverage read', desc: 'Correctly identified coverage responsibility', sig: 'Indicates defensive awareness and scheme understanding' },
          { label: 'Blocking technique', desc: 'Maintained block with proper leverage', sig: 'Shows strength and technical understanding' }
        ];
        const moment = momentTypes[(seed + i) % momentTypes.length];
        label = moment.label;
        description = moment.desc;
        significance = moment.sig;
      } else {
        // Default/soccer moments
        const momentTypes = [
          { label: 'Ball control', desc: 'Controlled difficult pass under pressure', sig: 'Shows technical skill and composure' },
          { label: 'Defensive positioning', desc: 'Cut off passing lane effectively', sig: 'Demonstrates tactical awareness' },
          { label: 'Shot on goal', desc: 'Created space for clear shot attempt', sig: 'Shows offensive creativity and execution' },
          { label: 'First touch', desc: 'Used first touch to move into space', sig: 'Indicates technical ability and field awareness' },
          { label: 'Team movement', desc: 'Coordinated movement with teammates', sig: 'Shows tactical understanding and communication' }
        ];
        const moment = momentTypes[(seed + i) % momentTypes.length];
        label = moment.label;
        description = moment.desc;
        significance = moment.sig;
      }
      
      keyMoments.push({
        timestamp,
        label,
        description,
        significance,
        garImpact: i === 0 ? 'High impact on Technical GAR score' : undefined
      });
    }
    
    // Sort key moments by timestamp
    keyMoments.sort((a, b) => a.timestamp - b.timestamp);
    
    // Generate technique analysis
    const techniqueAnalysis: TechniqueAnalysis[] = techniques.map((name, index) => {
      // Rating between 5-9
      const rating = 5 + ((seed + index) % 5);
      
      // Strengths and improvements
      const strengthOptions = [
        'Consistent execution',
        'Good mechanical form',
        'Effective timing',
        'Strong fundamentals',
        'Adapts well to different situations',
        'Confident execution under pressure'
      ];
      
      const improvementOptions = [
        'Could improve consistency',
        'Needs refinement in mechanics',
        'Should work on timing',
        'Fundamentals need attention',
        'Limited adaptability to changing situations',
        'Performance drops under pressure'
      ];
      
      // Select 2 strengths and 2 improvements
      const strengths = [
        strengthOptions[(seed + index) % strengthOptions.length],
        strengthOptions[(seed + index + 3) % strengthOptions.length]
      ];
      
      const improvements = [
        improvementOptions[(seed + index + 1) % improvementOptions.length],
        improvementOptions[(seed + index + 4) % improvementOptions.length]
      ];
      
      // ADHD-specific analysis for key techniques
      let adhd;
      if (index < 3) {
        adhd = {
          impacts: [
            'Hyperfocus may enhance execution during critical moments',
            'Attention fluctuations affect consistency in extended sequences',
            'Processing speed creates advantages in rapid decision scenarios'
          ][(seed + index) % 3],
          strategies: [
            'Use visual cues to maintain technique awareness',
            'Implement pre-execution routine to establish focus',
            'Break down complex movements into practiced segments'
          ][(seed + index + 1) % 3]
        };
      }
      
      return {
        name,
        rating,
        strengths,
        improvements,
        adhd
      };
    });
    
    // Generate ADHD analysis
    const adhd = {
      focusPatterns: "Shows typical ADHD focus pattern with periods of hyperfocus during high-intensity action and attention fluctuations during lower-intensity sequences. Visual tracking remains strong throughout.",
      strengths: [
        "Demonstrates exceptional processing speed in dynamic situations",
        "Shows creative problem-solving in unexpected scenarios",
        "Maintains heightened awareness during moments requiring quick reactions",
        "Exhibits strong pattern recognition in movement sequences"
      ],
      challenges: [
        "Consistency fluctuates during extended repetitive sequences",
        "Attention to positional details varies throughout performance",
        "May miss subtle cues during transitional phases"
      ],
      recommendations: [
        "Implement visual reminder system for positioning fundamentals",
        "Structure training with varied intensity to leverage hyperfocus periods",
        "Use immediate feedback mechanisms to reinforce technical execution",
        "Break down complex sequences into manageable components"
      ]
    };
    
    // Generate summary based on overall performance
    const overallRating = performanceMetrics.reduce((sum, metric) => sum + metric.percentile, 0) / performanceMetrics.length;
    let summary;
    
    if (overallRating > 80) {
      summary = `Exceptional overall performance showing elite-level execution across multiple aspects of ${sportType}. Particularly strong in ${performanceMetrics[0].name} and ${techniques[0].name}. ADHD traits appear well-channeled into performance advantages, especially during high-intensity sequences. Shows potential well above age group expectations.`;
    } else if (overallRating > 65) {
      summary = `Strong performance with above-average execution for age group. Notable strengths in ${performanceMetrics[0].name} with room for improvement in ${techniques[techniques.length-1].name}. ADHD characteristics show both advantages in processing speed and challenges in sustained attention that could be better leveraged with targeted strategies.`;
    } else {
      summary = `Developing performance with foundational skills present but requiring refinement. Shows potential in ${performanceMetrics[0].name} but needs focused work on ${techniques[techniques.length-1].name}. ADHD-related focus patterns significantly impact consistency, suggesting specific interventions could yield substantial improvements.`;
    }
    
    return {
      videoId,
      sportType,
      performanceMetrics,
      keyMoments,
      techniques: techniqueAnalysis,
      summary,
      adhd
    };
  }
}

export const videoAnalysisAIService = new VideoAnalysisAIService();