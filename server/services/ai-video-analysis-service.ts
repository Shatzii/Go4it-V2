import OpenAI from 'openai';
import { db } from '../db';
import { videoAnalyses, videos, users } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Initialize OpenAI client
// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Define interfaces for analysis results
interface GARAttribute {
  name: string;
  score: number;
  comments: string;
}

interface GARCategory {
  category: string;
  attributes: GARAttribute[];
  overallScore: number;
}

interface MotionData {
  key: string;
  value: number;
  [key: string]: any;
}

interface AnalysisPoint {
  timestamp: number;
  label: string;
  description?: string;
}

export interface GARAnalysisResult {
  categories: GARCategory[];
  overallScore: number;
  improvementAreas: string[];
  strengths: string[];
  motionData?: MotionData[];
  keyFrameTimestamps?: number[];
  analysisPoints?: AnalysisPoint[];
  adhd?: {
    focusScore: number;
    focusStrategies: string[];
    attentionInsights: string;
    learningPatterns: string;
  };
}

export interface TeamAnalysisResult {
  overallScore: number;
  offensiveScore: number;
  defensiveScore: number;
  teamworkScore: number;
  strengths: string[];
  weaknesses: string[];
  playerInsights: {
    playerId: number;
    playerName: string;
    performance: string;
    keyMoments: number[];
  }[];
  recommendations: string[];
}

export interface MatchAnalysisResult {
  overallScore: number;
  tempo: number;
  intensityScore: number;
  decisionMakingScore: number;
  keyPlays: {
    timestamp: number;
    description: string;
    significance: string;
  }[];
  breakdownByPeriod: {
    period: number;
    score: number;
    dominanceMetric: number;
    notes: string;
  }[];
  tacticalInsights: string[];
}

export interface GamePlanResult {
  summary: {
    opponentName: string;
    gameDate?: string;
    overallStrategy: string;
    strengthsToExploit: string[];
    weaknessesToAddress: string[];
  };
  offensiveGamePlan: {
    formation: {
      recommended: string[];
      situational: { situation: string; formation: string }[];
    };
    playTypes: {
      recommended: string[];
      situational: { situation: string; play: string }[];
    };
    keyMatchups: { 
      position: string;
      player: string;
      advantage: string;
      exploitationStrategy: string;
    }[];
    redZoneStrategy: string;
    thirdDownStrategy: string;
  };
  defensiveGamePlan: {
    formation: {
      recommended: string[];
      situational: { situation: string; formation: string }[];
    };
    coverageSchemes: {
      recommended: string[];
      situational: { situation: string; coverage: string }[];
    };
    blitzPackages: {
      recommended: string[];
      situational: { situation: string; blitz: string }[];
    };
    keyMatchups: { 
      position: string;
      player: string;
      advantage: string;
      containmentStrategy: string;
    }[];
    redZoneStrategy: string;
    thirdDownStrategy: string;
  };
  specialTeams: {
    kickoffStrategy: string;
    puntStrategy: string;
    returnStrategy: string;
    fieldGoalSituations: string;
  };
  keyPlays: {
    timestamp: number;
    description: string;
    type: 'offensive' | 'defensive' | 'special teams';
    significance: string;
    learningPoints: string[];
  }[];
  practiceEmphasis: string[];
  situationalPreparation: {
    scenario: string;
    recommendation: string;
  }[];
}

export class AIVideoAnalysisService {
  /**
   * Analyzes a video for GAR scoring
   * @param videoId The ID of the video to analyze
   * @param sportType The type of sport in the video
   * @param customPrompt Optional custom prompt for the AI
   * @returns GAR Analysis Results
   */
  async generateGarScores(videoId: number, sportType: string, customPrompt?: string): Promise<GARAnalysisResult> {
    try {
      // Get video data
      const [videoData] = await db.select().from(videos).where(eq(videos.id, videoId));
      if (!videoData) {
        throw new Error(`Video with ID ${videoId} not found`);
      }

      // Get user data (for neurodivergent-specific insights)
      const [userData] = await db.select().from(users).where(eq(users.id, videoData.userId));
      const isNeurodivergent = userData?.neurodivergent || false;

      // Configure prompt
      const basePrompt = `
      Please analyze this ${sportType} video and provide a comprehensive GAR (Growth and Ability Rating) score analysis.
      
      Video Details:
      - Sport: ${sportType}
      - Title: ${videoData.title}
      - Duration: ${videoData.duration || 'Unknown'} seconds
      - Athlete age range: 12-18 years old
      ${isNeurodivergent ? '- The athlete has ADHD/neurodivergent traits that should be considered in analysis' : ''}
      
      Please provide a detailed GAR score breakdown including:

      1. Overall score (1-10)
      2. Category breakdown with scores and detailed comments for each:
         - Physical (speed, strength, endurance)
         - Technical (skill execution, technique, game IQ)
         - Psychological (focus, confidence, decision-making)
      3. Key strengths (4-5 points)
      4. Areas for improvement (4-5 points)
      5. Suggested timestamps for key moments in the video (in seconds)
      6. Analysis points at specific timestamps with labels and descriptions
      ${isNeurodivergent ? `
      7. ADHD-specific insights:
         - Focus score (1-10)
         - Focus strategies tailored for this athlete
         - Attention insights
         - Learning patterns observed` : ''}
      
      Format your response as a JSON object.
      `;

      const prompt = customPrompt || basePrompt;

      // Call OpenAI API for analysis
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert sports analyst specializing in youth development and performance analysis. You have extensive experience working with neurodivergent athletes and understand how ADHD affects athletic performance."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      // Process the response
      const result = JSON.parse(response.choices[0].message.content);
      
      // Save analysis to database
      await this.saveGarAnalysis(videoId, result);
      
      return result;
    } catch (error) {
      console.error('Error generating GAR scores:', error);
      throw new Error(`Failed to generate GAR scores: ${error.message}`);
    }
  }

  /**
   * Save GAR analysis to database
   */
  private async saveGarAnalysis(videoId: number, analysisData: GARAnalysisResult) {
    try {
      // Check if analysis already exists
      const [existingAnalysis] = await db
        .select()
        .from(videoAnalyses)
        .where(eq(videoAnalyses.videoId, videoId));

      if (existingAnalysis) {
        // Update existing analysis
        await db
          .update(videoAnalyses)
          .set({
            analysisData,
            updatedAt: new Date(),
            overallScore: analysisData.overallScore,
            strengths: analysisData.strengths,
            improvementAreas: analysisData.improvementAreas
          })
          .where(eq(videoAnalyses.id, existingAnalysis.id));
      } else {
        // Create new analysis
        await db.insert(videoAnalyses).values({
          videoId,
          analysisData,
          overallScore: analysisData.overallScore,
          analysisDate: new Date(),
          strengths: analysisData.strengths,
          improvementAreas: analysisData.improvementAreas
        });
      }
    } catch (error) {
      console.error('Error saving GAR analysis:', error);
      throw new Error(`Failed to save GAR analysis: ${error.message}`);
    }
  }

  /**
   * Analyzes a workout video for verification
   * @param videoId The ID of the video to analyze
   * @param exerciseType The type of exercise being performed
   * @param targetReps The target number of repetitions
   * @returns Workout verification results
   */
  async verifyWorkout(videoId: number, exerciseType: string, targetReps: number): Promise<any> {
    try {
      // Get video data
      const [videoData] = await db.select().from(videos).where(eq(videos.id, videoId));
      if (!videoData) {
        throw new Error(`Video with ID ${videoId} not found`);
      }

      // Configure prompt for workout verification
      const prompt = `
      Please analyze this workout video and verify the exercise performance.
      
      Exercise Details:
      - Exercise Type: ${exerciseType}
      - Target Repetitions: ${targetReps}
      - Video Duration: ${videoData.duration || 'Unknown'} seconds
      
      Please provide:
      1. Whether the exercise was completed (true/false)
      2. How many repetitions were performed
      3. Form quality assessment (1-10 scale)
      4. Form feedback with specific improvements
      5. Whether the exercise meets standard requirements
      6. Motion analysis with key points on form
      7. Specific timestamps for each rep completed
      
      Format your response as a JSON object.
      `;

      // Call OpenAI API for workout verification
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert strength and conditioning coach with experience in analyzing workout form and providing feedback for young athletes."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      // Process and return the result
      const result = JSON.parse(response.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('Error verifying workout:', error);
      throw new Error(`Failed to verify workout: ${error.message}`);
    }
  }

  /**
   * Analyzes a team's performance from a match video
   * @param videoId The ID of the video to analyze
   * @param teamName The name of the team to analyze
   * @param sportType The type of sport
   * @returns Team analysis results
   */
  async analyzeTeamPerformance(videoId: number, teamName: string, sportType: string): Promise<TeamAnalysisResult> {
    try {
      // Get video data
      const [videoData] = await db.select().from(videos).where(eq(videos.id, videoId));
      if (!videoData) {
        throw new Error(`Video with ID ${videoId} not found`);
      }

      // Configure prompt for team analysis
      const prompt = `
      Please analyze this ${sportType} match video for team "${teamName}" performance.
      
      Match Details:
      - Sport: ${sportType}
      - Team: ${teamName}
      - Video Duration: ${videoData.duration || 'Unknown'} seconds
      
      Please provide a detailed team analysis including:
      1. Overall team performance score (1-10)
      2. Offensive score (1-10)
      3. Defensive score (1-10)
      4. Teamwork score (1-10)
      5. Team strengths (3-5 points)
      6. Team weaknesses (3-5 points)
      7. Individual player insights (for prominent players)
      8. Key moments in the match (timestamps)
      9. Tactical recommendations for improvement
      
      Format your response as a JSON object.
      `;

      // Call OpenAI API for team analysis
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert sports coach with extensive experience in team dynamics and performance analysis."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      // Process and return the result
      const result = JSON.parse(response.choices[0].message.content);
      return result as TeamAnalysisResult;
    } catch (error) {
      console.error('Error analyzing team performance:', error);
      throw new Error(`Failed to analyze team performance: ${error.message}`);
    }
  }

  /**
   * Analyzes a match for tactical and strategic insights
   * @param videoId The ID of the video to analyze
   * @param sportType The type of sport
   * @param analysisTarget What to focus on in the analysis
   * @returns Match analysis results
   */
  async analyzeMatch(videoId: number, sportType: string, analysisTarget: string): Promise<MatchAnalysisResult> {
    try {
      // Get video data
      const [videoData] = await db.select().from(videos).where(eq(videos.id, videoId));
      if (!videoData) {
        throw new Error(`Video with ID ${videoId} not found`);
      }

      // Configure prompt for match analysis
      const prompt = `
      Please analyze this ${sportType} match video with a focus on ${analysisTarget}.
      
      Match Details:
      - Sport: ${sportType}
      - Analysis Focus: ${analysisTarget}
      - Video Duration: ${videoData.duration || 'Unknown'} seconds
      
      Please provide a detailed match analysis including:
      1. Overall match quality score (1-10)
      2. Tempo and pace assessment (1-10)
      3. Intensity score (1-10)
      4. Key tactical decisions and their impacts
      5. Breakdown by periods/quarters
      6. Key plays with timestamps and significance
      7. Tactical insights for coaches
      
      Format your response as a JSON object.
      `;

      // Call OpenAI API for match analysis
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert sports tactician with extensive experience analyzing game film and providing strategic insights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      // Process and return the result
      const result = JSON.parse(response.choices[0].message.content);
      return result as MatchAnalysisResult;
    } catch (error) {
      console.error('Error analyzing match:', error);
      throw new Error(`Failed to analyze match: ${error.message}`);
    }
  }

  /**
   * Generate automated highlight clips from a video
   * @param videoId The ID of the video to analyze
   * @param sportType The type of sport
   * @param highlightCount Number of highlights to generate
   * @returns Highlight clip information
   */
  async generateHighlights(videoId: number, sportType: string, highlightCount: number = 5): Promise<any> {
    try {
      // Get video data
      const [videoData] = await db.select().from(videos).where(eq(videos.id, videoId));
      if (!videoData) {
        throw new Error(`Video with ID ${videoId} not found`);
      }

      // Configure prompt for highlight generation
      const prompt = `
      Please analyze this ${sportType} video and identify the top ${highlightCount} highlight moments.
      
      Video Details:
      - Sport: ${sportType}
      - Video Duration: ${videoData.duration || 'Unknown'} seconds
      
      For each highlight, please provide:
      1. Start timestamp (in seconds)
      2. End timestamp (in seconds)
      3. Title for the highlight
      4. Description of what happens
      5. Highlight type (e.g., scoring play, defensive stop, skill showcase)
      6. Excitement rating (1-10)
      
      Format your response as a JSON object with an array of highlights.
      `;

      // Call OpenAI API for highlight generation
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert sports video editor with extensive experience creating highlight reels that showcase the best moments from athletic performances."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      // Process and return the result
      const result = JSON.parse(response.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('Error generating highlights:', error);
      throw new Error(`Failed to generate highlights: ${error.message}`);
    }
  }

  /**
   * Analyzes an athlete's form in a video
   * @param videoId The ID of the video to analyze
   * @param athleteName The name of the athlete
   * @param sportType The type of sport
   * @param techniqueType The specific technique to analyze
   * @returns Form analysis results
   */
  async analyzeForm(videoId: number, athleteName: string, sportType: string, techniqueType: string): Promise<any> {
    try {
      // Get video data
      const [videoData] = await db.select().from(videos).where(eq(videos.id, videoId));
      if (!videoData) {
        throw new Error(`Video with ID ${videoId} not found`);
      }

      // Configure prompt for form analysis
      const prompt = `
      Please analyze the form and technique of athlete "${athleteName}" performing ${techniqueType} in this ${sportType} video.
      
      Details:
      - Sport: ${sportType}
      - Technique: ${techniqueType}
      - Athlete: ${athleteName}
      - Video Duration: ${videoData.duration || 'Unknown'} seconds
      
      Please provide a detailed form analysis including:
      1. Overall technique score (1-10)
      2. Breakdown of technical elements with scores for each component
      3. Key strengths in the athlete's technique
      4. Technical flaws or areas for improvement
      5. Specific timestamps showing best form examples
      6. Specific timestamps showing form issues
      7. Step-by-step correction plan for improving technique
      8. Comparison to ideal form standards for this age group
      
      Format your response as a JSON object.
      `;

      // Call OpenAI API for form analysis
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert biomechanics specialist with extensive experience analyzing athletic technique and providing corrective feedback."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      // Process and return the result
      const result = JSON.parse(response.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('Error analyzing form:', error);
      throw new Error(`Failed to analyze form: ${error.message}`);
    }
  }

  /**
   * Generates a comprehensive football game plan based on opponent film analysis
   * @param videoId The ID of the opponent film to analyze
   * @param teamName Your team's name
   * @param opponentName Opponent team's name
   * @param gameDate Optional date of the upcoming game
   * @returns Complete game plan with offensive, defensive and special teams strategies
   */
  async generateFootballGamePlan(videoId: number, teamName: string, opponentName: string, gameDate?: string): Promise<GamePlanResult> {
    try {
      // Get video data
      const [videoData] = await db.select().from(videos).where(eq(videos.id, videoId));
      if (!videoData) {
        throw new Error(`Video with ID ${videoId} not found`);
      }

      // Configure prompt for football game plan generation
      const prompt = `
      Please analyze this football game film of "${opponentName}" and create a comprehensive game plan for "${teamName}" to use against them${gameDate ? ` on ${gameDate}` : ''}.
      
      Video Details:
      - Sport: Football
      - Opponent Team: ${opponentName}
      - Your Team: ${teamName}
      - Video Duration: ${videoData.duration || 'Unknown'} seconds
      ${gameDate ? `- Game Date: ${gameDate}` : ''}
      
      Please provide a complete game plan including:
      
      1. Summary:
         - Overview of opponent's style and tendencies
         - Overall strategic approach recommendation
         - Key strengths to exploit
         - Key weaknesses to address

      2. Offensive Game Plan:
         - Recommended formations and why they'll be effective
         - Situational formations (e.g., 3rd and long, red zone)
         - Recommended play types based on opponent's defensive tendencies
         - Key matchups to exploit with specific strategies
         - Red zone strategy
         - 3rd down strategy
      
      3. Defensive Game Plan:
         - Recommended defensive formations
         - Situational defensive adjustments
         - Coverage schemes to counter their passing game
         - Blitz packages and when to use them
         - Key matchups to address with specific containment strategies
         - Red zone defensive strategy
         - 3rd down defensive strategy
      
      4. Special Teams Considerations:
         - Kickoff strategy
         - Punt strategy
         - Return strategy
         - Field goal situations
      
      5. Key Plays from Film:
         - Timestamp (in seconds)
         - Description of what happens
         - Classification (offensive/defensive/special teams)
         - Significance to game planning
         - Learning points for team preparation
      
      6. Practice Emphasis:
         - List of specific areas to focus on in practice
      
      7. Situational Preparation:
         - Specific scenarios to prepare for
         - Recommended approach for each scenario
      
      Format your response as a JSON object with the complete game plan structure.
      `;

      // Call OpenAI API for football game plan generation
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert football coach with decades of experience analyzing game film and creating detailed game plans. You have won multiple championships and are known for your strategic brilliance in breaking down opponents and creating winning game plans."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      // Process and return the result
      const result = JSON.parse(response.choices[0].message.content);
      return result as GamePlanResult;
    } catch (error) {
      console.error('Error generating football game plan:', error);
      throw new Error(`Failed to generate football game plan: ${error.message}`);
    }
  }

  /**
   * Generate personalized coaching feedback for an athlete
   * @param videoId The ID of the video to analyze
   * @param athleteName The name of the athlete
   * @param sportType The type of sport
   * @param focusArea The specific area to focus feedback on
   * @returns Coaching feedback
   */
  async generateCoachingFeedback(videoId: number, athleteName: string, sportType: string, focusArea: string): Promise<any> {
    try {
      // Get video data
      const [videoData] = await db.select().from(videos).where(eq(videos.id, videoId));
      if (!videoData) {
        throw new Error(`Video with ID ${videoId} not found`);
      }

      // Get user data (for neurodivergent-specific insights)
      const [userData] = await db.select().from(users).where(eq(users.id, videoData.userId));
      const isNeurodivergent = userData?.neurodivergent || false;

      // Configure prompt for coaching feedback
      const prompt = `
      Please generate personalized coaching feedback for athlete "${athleteName}" based on this ${sportType} video, focusing on ${focusArea}.
      
      Details:
      - Sport: ${sportType}
      - Focus Area: ${focusArea}
      - Athlete: ${athleteName}
      - Athlete Age Range: 12-18
      ${isNeurodivergent ? '- The athlete has ADHD/neurodivergent traits that should be considered' : ''}
      - Video Duration: ${videoData.duration || 'Unknown'} seconds
      
      Please provide detailed coaching feedback including:
      1. Overall assessment of the athlete's performance (1-10)
      2. Strengths demonstrated in the video (3-5 points)
      3. Areas for improvement (3-5 points)
      4. Specific drills or exercises to address each improvement area
      5. 3-5 specific, actionable cues the athlete should focus on
      6. Training plan recommendations for the next 2 weeks
      ${isNeurodivergent ? '7. ADHD-specific coaching strategies tailored to this athlete' : ''}
      
      Format your response as a JSON object.
      `;

      // Call OpenAI API for coaching feedback
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an experienced youth sports coach specializing in personalized development plans and fostering growth mindset in young athletes. You have expertise working with neurodivergent athletes."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      // Process and return the result
      const result = JSON.parse(response.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('Error generating coaching feedback:', error);
      throw new Error(`Failed to generate coaching feedback: ${error.message}`);
    }
  }
}

export const aiVideoAnalysisService = new AIVideoAnalysisService();