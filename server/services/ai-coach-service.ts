import Anthropic from '@anthropic-ai/sdk';
import { db } from '../db';
import {
  aiCoaches,
  aiCoachSessions,
  aiCoachMessages,
  sportKnowledgeBases,
  userCoachInteractions,
  users,
  athleteProfiles,
  videos,
  videoAnalyses,
  trainingDrills,
  InsertAiCoachMessage,
} from '@shared/schema';
import { eq, and, desc, gt, sql } from 'drizzle-orm';

// Helper type for tracking message roles in Claude conversations
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export class AiCoachService {
  private anthropic: Anthropic;
  private model = 'claude-3-opus-20240229'; // Using the latest Claude model

  constructor() {
    // Create Anthropic client with API key
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    console.log('AI Coach Service initialized with Claude');
  }

  /**
   * Create a new AI coach in the database
   */
  async createCoach({
    name,
    sport,
    specialty,
    personality,
    avatarImage,
    systemPrompt,
    knowledgeBase,
  }: {
    name: string;
    sport: string;
    specialty: string;
    personality: string;
    avatarImage?: string;
    systemPrompt: string;
    knowledgeBase: string;
  }) {
    try {
      const [newCoach] = await db
        .insert(aiCoaches)
        .values({
          name,
          sport,
          specialty,
          personality,
          avatarImage,
          systemPrompt,
          knowledgeBase,
        })
        .returning();

      return newCoach;
    } catch (error) {
      console.error('Error creating AI coach:', error);
      throw error;
    }
  }

  /**
   * Get a list of all active AI coaches
   */
  async getCoaches() {
    try {
      return await db.select().from(aiCoaches).where(eq(aiCoaches.active, true));
    } catch (error) {
      console.error('Error getting AI coaches:', error);
      throw error;
    }
  }

  /**
   * Get coaches for a specific sport
   */
  async getCoachesBySport(sport: string) {
    try {
      return await db
        .select()
        .from(aiCoaches)
        .where(and(eq(aiCoaches.active, true), eq(aiCoaches.sport, sport)));
    } catch (error) {
      console.error(`Error getting AI coaches for sport ${sport}:`, error);
      throw error;
    }
  }

  /**
   * Create a new coaching session
   */
  async createSession({
    userId,
    coachId,
    topic,
    userGoals,
    sessionContext,
  }: {
    userId: number;
    coachId: number;
    topic?: string;
    userGoals?: string;
    sessionContext?: Record<string, any>;
  }) {
    try {
      const [newSession] = await db
        .insert(aiCoachSessions)
        .values({
          userId,
          coachId,
          topic,
          userGoals,
          sessionContext: sessionContext ? sessionContext : {},
        })
        .returning();

      // Get the coach to send an initial message
      const coach = await db.select().from(aiCoaches).where(eq(aiCoaches.id, coachId)).limit(1);
      
      if (coach.length === 0) {
        throw new Error('Coach not found');
      }
      
      // Get user data for personalization
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      const athleteProfile = await db.select().from(athleteProfiles).where(eq(athleteProfiles.userId, userId)).limit(1);
      
      // Create context from user data
      let userContext = "";
      if (user.length > 0) {
        userContext += `User name: ${user[0].name}\n`;
        if (athleteProfile.length > 0) {
          const profile = athleteProfile[0];
          userContext += `Age: ${profile.age || 'Unknown'}\n`;
          userContext += `Sports interest: ${profile.sportsInterest?.join(', ') || 'Unknown'}\n`;
          userContext += `School: ${profile.school || 'Unknown'}\n`;
          userContext += `Graduation year: ${profile.graduationYear || 'Unknown'}\n`;
        }
      }

      // Create initial welcome message from coach
      const initialMessage = await this.generateWelcomeMessage(
        coach[0],
        userContext,
        topic,
        userGoals
      );

      // Save the initial coach message
      await db.insert(aiCoachMessages).values({
        sessionId: newSession.id,
        coachId: coachId,
        content: initialMessage,
        messageType: 'text',
      });

      return {
        ...newSession,
        initialMessage,
      };
    } catch (error) {
      console.error('Error creating coaching session:', error);
      throw error;
    }
  }

  /**
   * Get all messages for a session
   */
  async getSessionMessages(sessionId: number) {
    try {
      // Verify session exists and is active
      const session = await db
        .select()
        .from(aiCoachSessions)
        .where(eq(aiCoachSessions.id, sessionId))
        .limit(1);
      
      if (session.length === 0) {
        throw new Error('Session not found');
      }
      
      if (!session[0].active) {
        throw new Error('Session is no longer active');
      }
      
      // Get messages in chronological order
      return await db
        .select()
        .from(aiCoachMessages)
        .where(eq(aiCoachMessages.sessionId, sessionId))
        .orderBy(aiCoachMessages.sentAt);
    } catch (error) {
      console.error(`Error getting messages for session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Get active sessions for a user
   */
  async getUserSessions(userId: number) {
    try {
      return await db
        .select({
          id: aiCoachSessions.id,
          coachId: aiCoachSessions.coachId,
          coachName: aiCoaches.name,
          startedAt: aiCoachSessions.startedAt,
          lastMessageAt: aiCoachSessions.lastMessageAt,
          topic: aiCoachSessions.topic,
        })
        .from(aiCoachSessions)
        .innerJoin(aiCoaches, eq(aiCoachSessions.coachId, aiCoaches.id))
        .where(
          and(
            eq(aiCoachSessions.userId, userId),
            eq(aiCoachSessions.active, true)
          )
        )
        .orderBy(desc(aiCoachSessions.lastMessageAt));
    } catch (error) {
      console.error(`Error getting sessions for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Send a message in a coaching session and get a response
   */
  async sendMessage({
    sessionId,
    userId,
    content,
    messageType = 'text',
    attachmentUrl,
  }: {
    sessionId: number;
    userId: number;
    content: string;
    messageType?: string;
    attachmentUrl?: string;
  }) {
    try {
      // Verify session exists and is active
      const session = await db
        .select()
        .from(aiCoachSessions)
        .where(eq(aiCoachSessions.id, sessionId))
        .limit(1);
      
      if (session.length === 0) {
        throw new Error('Session not found');
      }
      
      if (!session[0].active) {
        throw new Error('Session is no longer active');
      }
      
      // Verify this user owns the session
      if (session[0].userId !== userId) {
        throw new Error('User does not have access to this session');
      }
      
      // Get the coach
      const coach = await db
        .select()
        .from(aiCoaches)
        .where(eq(aiCoaches.id, session[0].coachId))
        .limit(1);
      
      if (coach.length === 0) {
        throw new Error('Coach not found');
      }
      
      // Save the user message
      const [userMessage] = await db
        .insert(aiCoachMessages)
        .values({
          sessionId,
          senderId: userId,
          content,
          messageType,
          attachmentUrl,
        })
        .returning();
      
      // Update the session lastMessageAt timestamp
      await db
        .update(aiCoachSessions)
        .set({ lastMessageAt: new Date() })
        .where(eq(aiCoachSessions.id, sessionId));
      
      // Get conversation history
      const messages = await this.getSessionMessages(sessionId);
      
      // Format messages for Claude
      const messageHistory: Message[] = messages.map((msg) => ({
        role: msg.senderId ? 'user' : 'assistant',
        content: msg.content,
      }));
      
      // Generate a response with Claude
      const coachResponse = await this.generateCoachResponse(
        coach[0],
        messageHistory,
        session[0]
      );
      
      // Save the coach's response
      const [responseMessage] = await db
        .insert(aiCoachMessages)
        .values({
          sessionId,
          coachId: coach[0].id,
          content: coachResponse,
          messageType: 'text',
        })
        .returning();
      
      // Update session lastMessageAt timestamp again
      await db
        .update(aiCoachSessions)
        .set({ lastMessageAt: new Date() })
        .where(eq(aiCoachSessions.id, sessionId));
      
      // Record the interaction for analytics
      await db.insert(userCoachInteractions).values({
        userId,
        coachId: coach[0].id,
        interactionType: 'message',
      });
      
      return {
        userMessage,
        coachResponse: responseMessage,
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * End a coaching session
   */
  async endSession(sessionId: number, userId: number) {
    try {
      // Verify session exists and belongs to user
      const session = await db
        .select()
        .from(aiCoachSessions)
        .where(
          and(
            eq(aiCoachSessions.id, sessionId),
            eq(aiCoachSessions.userId, userId)
          )
        )
        .limit(1);
      
      if (session.length === 0) {
        throw new Error('Session not found or user does not have access');
      }
      
      // Mark the session as inactive
      await db
        .update(aiCoachSessions)
        .set({ active: false })
        .where(eq(aiCoachSessions.id, sessionId));
      
      return true;
    } catch (error) {
      console.error(`Error ending session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Get recommendations for training drills based on user profile and videos
   */
  async getPersonalizedDrillRecommendations(userId: number) {
    try {
      // Get user data and related information
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      
      if (user.length === 0) {
        throw new Error('User not found');
      }
      
      const athleteProfile = await db
        .select()
        .from(athleteProfiles)
        .where(eq(athleteProfiles.userId, userId))
        .limit(1);
      
      // Get recent video analyses
      const recentVideos = await db
        .select({
          id: videos.id,
          title: videos.title,
          sportType: videos.sportType,
          analysisId: videoAnalyses.id,
          overallScore: videoAnalyses.overallScore,
          feedback: videoAnalyses.feedback,
          improvementTips: videoAnalyses.improvementTips,
        })
        .from(videos)
        .leftJoin(videoAnalyses, eq(videos.id, videoAnalyses.videoId))
        .where(
          and(
            eq(videos.userId, userId),
            eq(videos.analyzed, true)
          )
        )
        .orderBy(desc(videos.uploadDate))
        .limit(3);
      
      // Get sports of interest
      const sportsInterest = athleteProfile.length > 0 
        ? athleteProfile[0].sportsInterest || [] 
        : [];
      
      // If no sports interest, use sport types from videos
      const sports = sportsInterest.length > 0 
        ? sportsInterest 
        : [...new Set(recentVideos.map(v => v.sportType).filter(Boolean))];
      
      if (sports.length === 0) {
        throw new Error('No sports information available for user');
      }
      
      // Collect improvement areas from video analyses
      const improvementAreas = recentVideos
        .flatMap(v => v.improvementTips || [])
        .filter(Boolean);
      
      // Find relevant drills based on sports and improvement areas
      let drillQuery = db
        .select()
        .from(trainingDrills)
        .where(sql`${trainingDrills.sport} = ANY(${sports})`);
      
      // If we have specific improvement areas, prioritize drills that match
      if (improvementAreas.length > 0) {
        drillQuery = drillQuery.orderBy(desc(sql`
          (
            SELECT COUNT(*) 
            FROM unnest(${trainingDrills.tags}) tag 
            WHERE EXISTS (
              SELECT 1 
              FROM unnest(${improvementAreas}::text[]) area 
              WHERE tag ILIKE '%' || area || '%'
            )
          )
        `));
      }
      
      const drills = await drillQuery.limit(5);
      
      // Return recommendations
      return {
        sports,
        improvementAreas,
        recommendedDrills: drills,
      };
    } catch (error) {
      console.error(`Error getting drill recommendations for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Generate welcome message using Claude
   */
  private async generateWelcomeMessage(
    coach: any,
    userContext: string,
    topic?: string,
    userGoals?: string
  ): Promise<string> {
    try {
      const systemPrompt = `${coach.systemPrompt}
You are ${coach.name}, a specialized ${coach.sport} coach with expertise in ${coach.specialty}.
Your personality is ${coach.personality}.
You're having your first conversation with a student athlete.

${userContext}

Keep your response conversational, supportive and focused on the topic of ${topic || coach.sport}.
${userGoals ? `The athlete's goals are: ${userGoals}` : ''}
Ask focused questions to understand their skill level and what they want to improve.
Keep your first message warm, brief (under 150 words), and encouraging.`;

      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 300,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: "Hi! I'd like to start training with you as my coach.",
          },
        ],
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Error generating welcome message:', error);
      return `Hi there! I'm ${coach.name}, your ${coach.sport} coach. Let's work together to improve your skills. What would you like to focus on today?`;
    }
  }

  /**
   * Generate coach response using Claude
   */
  private async generateCoachResponse(
    coach: any,
    messageHistory: Message[],
    session: any
  ): Promise<string> {
    try {
      // Create system prompt enriched with coach personality and expertise
      const systemPrompt = `${coach.systemPrompt}
You are ${coach.name}, a specialized ${coach.sport} coach with expertise in ${coach.specialty}.
Your personality is ${coach.personality}.
${session.topic ? `The current topic is: ${session.topic}` : ''}
${session.userGoals ? `The athlete's goals are: ${session.userGoals}` : ''}

Guidelines:
- Keep responses conversational, supportive and focused on helping the athlete improve.
- Use specific examples and actionable advice whenever possible.
- When discussing drills or techniques, be precise and detailed.
- Adjust your advice to the athlete's apparent skill level.
- Keep most responses under 200 words unless detailed technique explanation is required.
- Focus on positive reinforcement but provide honest constructive feedback.
- Ask focused questions to better understand their situation when needed.
- Your advice should be accurate and based on current sports science.`;

      // Build message history for context
      const messages = messageHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Limit to last 10 messages to stay within context window
      const recentMessages = messages.slice(-10);

      // Add Claude system prompt
      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 1000,
        temperature: 0.7,
        system: systemPrompt,
        messages: recentMessages,
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Error generating coach response:', error);
      return "I'm having trouble connecting right now. Could you please repeat your question, or we can try again in a moment?";
    }
  }

  /**
   * Generate athletic assessment based on user profile and video analyses
   */
  async generateAthleticAssessment(userId: number): Promise<string> {
    try {
      // Get user data
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      
      if (user.length === 0) {
        throw new Error('User not found');
      }
      
      const athleteProfile = await db
        .select()
        .from(athleteProfiles)
        .where(eq(athleteProfiles.userId, userId))
        .limit(1);
      
      // Get recent video analyses
      const videoAnalysesData = await db
        .select({
          id: videoAnalyses.id,
          videoId: videoAnalyses.videoId,
          title: videos.title,
          sportType: videos.sportType,
          analysisDate: videoAnalyses.analysisDate,
          overallScore: videoAnalyses.overallScore,
          garScores: videoAnalyses.garScores,
          feedback: videoAnalyses.feedback,
          improvementTips: videoAnalyses.improvementTips,
        })
        .from(videoAnalyses)
        .innerJoin(videos, eq(videoAnalyses.videoId, videos.id))
        .where(eq(videos.userId, userId))
        .orderBy(desc(videoAnalyses.analysisDate))
        .limit(5);
      
      // If no video analyses, we can't generate an assessment
      if (videoAnalysesData.length === 0) {
        return "We don't have enough performance data to create an assessment yet. Upload videos for analysis to get a comprehensive athletic assessment.";
      }
      
      // Create user profile context
      let userContext = `Athlete name: ${user[0].name}\n`;
      
      if (athleteProfile.length > 0) {
        const profile = athleteProfile[0];
        userContext += `Age: ${profile.age || 'Unknown'}\n`;
        userContext += `Height: ${profile.height ? `${profile.height} cm` : 'Unknown'}\n`;
        userContext += `Weight: ${profile.weight ? `${profile.weight} kg` : 'Unknown'}\n`;
        userContext += `Sports interest: ${profile.sportsInterest?.join(', ') || 'Unknown'}\n`;
        userContext += `School: ${profile.school || 'Unknown'}\n`;
        userContext += `Graduation year: ${profile.graduationYear || 'Unknown'}\n`;
        userContext += `Motion score: ${profile.motionScore || 'Not assessed'}/100\n`;
      }
      
      // Create analyses context
      let analysesContext = "Recent performance analyses:\n\n";
      
      videoAnalysesData.forEach((analysis, index) => {
        analysesContext += `Analysis ${index + 1} (${analysis.sportType || 'Unknown sport'}):\n`;
        analysesContext += `Title: ${analysis.title}\n`;
        analysesContext += `Date: ${analysis.analysisDate?.toISOString().split('T')[0] || 'Unknown'}\n`;
        analysesContext += `Overall score: ${analysis.overallScore}/100\n`;
        
        if (analysis.garScores) {
          analysesContext += "GAR scores:\n";
          for (const [category, score] of Object.entries(analysis.garScores as any)) {
            analysesContext += `- ${category}: ${score}/100\n`;
          }
        }
        
        analysesContext += `Feedback: ${analysis.feedback}\n`;
        
        if (analysis.improvementTips && analysis.improvementTips.length > 0) {
          analysesContext += "Improvement tips:\n";
          analysis.improvementTips.forEach((tip: string) => {
            analysesContext += `- ${tip}\n`;
          });
        }
        
        analysesContext += "\n";
      });
      
      // Generate assessment with Claude
      const systemPrompt = `You are an expert sports performance analyst and coach. 
You need to create a comprehensive athletic assessment for a student athlete based on their profile and video analyses.
Focus on identifying patterns across multiple performances, highlighting strengths, weaknesses, and specific areas for improvement.
Provide a holistic view of the athlete's abilities, along with actionable recommendations for development.
The assessment should be structured, objective, and focused on helping the athlete improve.

Structure your assessment as follows:
1. Overall athletic profile (2-3 sentences about the athlete)
2. Performance strengths (3-5 bullet points)
3. Areas for improvement (3-5 bullet points)
4. Development recommendations (3-5 actionable items)
5. Next steps for continued improvement (1-2 paragraphs)

Keep your assessment encouraging but honest, focusing on constructive feedback.
Base your assessment solely on the data provided - don't invent additional details.`;

      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 1000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Please create an athletic assessment based on the following data:\n\n${userContext}\n\n${analysesContext}`,
          },
        ],
      });

      return response.content[0].text;
    } catch (error) {
      console.error(`Error generating athletic assessment for user ${userId}:`, error);
      return "We're unable to generate your athletic assessment at this time. Please try again later.";
    }
  }

  /**
   * Generate a training plan based on user profile, goals, and analyses
   */
  async generateTrainingPlan(
    userId: number,
    goals: string,
    timeframe: string,
    focusAreas: string[]
  ): Promise<string> {
    try {
      // Get user data
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      
      if (user.length === 0) {
        throw new Error('User not found');
      }
      
      const athleteProfile = await db
        .select()
        .from(athleteProfiles)
        .where(eq(athleteProfiles.userId, userId))
        .limit(1);
      
      // Get sports of interest
      const sportsInterest = athleteProfile.length > 0 
        ? athleteProfile[0].sportsInterest || [] 
        : [];
      
      // Get recent video analyses
      const recentAnalyses = await db
        .select({
          sportType: videos.sportType,
          overallScore: videoAnalyses.overallScore,
          improvementTips: videoAnalyses.improvementTips,
        })
        .from(videos)
        .leftJoin(videoAnalyses, eq(videos.id, videoAnalyses.videoId))
        .where(
          and(
            eq(videos.userId, userId),
            eq(videos.analyzed, true)
          )
        )
        .orderBy(desc(videos.uploadDate))
        .limit(3);
      
      // Find relevant drills based on focus areas
      const relevantDrills = await db
        .select()
        .from(trainingDrills)
        .where(sql`
          ${trainingDrills.sport} = ANY(${sportsInterest}) AND
          EXISTS (
            SELECT 1 
            FROM unnest(${trainingDrills.tags}) tag 
            WHERE EXISTS (
              SELECT 1 
              FROM unnest(${focusAreas}::text[]) area 
              WHERE tag ILIKE '%' || area || '%'
            )
          )
        `)
        .limit(10);
      
      // Create context for prompt
      let userContext = `Athlete name: ${user[0].name}\n`;
      
      if (athleteProfile.length > 0) {
        const profile = athleteProfile[0];
        userContext += `Age: ${profile.age || 'Unknown'}\n`;
        userContext += `Height: ${profile.height ? `${profile.height} cm` : 'Unknown'}\n`;
        userContext += `Weight: ${profile.weight ? `${profile.weight} kg` : 'Unknown'}\n`;
        userContext += `Sports interest: ${sportsInterest.join(', ') || 'Unknown'}\n`;
      }
      
      let analysesContext = "";
      if (recentAnalyses.length > 0) {
        analysesContext = "Recent performance insights:\n";
        recentAnalyses.forEach((analysis, index) => {
          analysesContext += `Analysis ${index + 1} (${analysis.sportType || 'Unknown sport'}):\n`;
          analysesContext += `Overall score: ${analysis.overallScore}/100\n`;
          
          if (analysis.improvementTips && analysis.improvementTips.length > 0) {
            analysesContext += "Improvement areas:\n";
            analysis.improvementTips.forEach((tip: string) => {
              analysesContext += `- ${tip}\n`;
            });
          }
          
          analysesContext += "\n";
        });
      }
      
      let drillsContext = "";
      if (relevantDrills.length > 0) {
        drillsContext = "Available training drills:\n";
        relevantDrills.forEach((drill, index) => {
          drillsContext += `Drill ${index + 1}: ${drill.name}\n`;
          drillsContext += `Description: ${drill.description}\n`;
          drillsContext += `Difficulty: ${drill.difficulty}/5\n`;
          drillsContext += `Focus: ${drill.tags?.join(', ') || 'General'}\n\n`;
        });
      }
      
      // Generate training plan with Claude
      const systemPrompt = `You are an expert sports coach and training specialist. 
You need to create a comprehensive training plan for a student athlete based on their profile, goals, and performance history.
The plan should be realistic, progressive, and tailored to the athlete's specific needs and focus areas.
Include specific drills from the list provided when relevant.

Structure your training plan as follows:
1. Overview (brief summary of the plan's focus and goals)
2. Weekly schedule (breakdown of training activities by day)
3. Key exercises and drills (with specific focus areas and progression)
4. Recovery and nutrition recommendations
5. Progress tracking metrics

Your plan should span the requested timeframe, be age-appropriate, and consider any limitations or specific improvement areas noted.
Keep the plan challenging but achievable, focusing on progressive development.
Base your plan solely on the data provided - don't invent additional details.`;

      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 1500,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Please create a training plan based on the following:\n\n${userContext}\n\nGoals: ${goals}\nTimeframe: ${timeframe}\nFocus areas: ${focusAreas.join(', ')}\n\n${analysesContext}\n\n${drillsContext}`,
          },
        ],
      });

      return response.content[0].text;
    } catch (error) {
      console.error(`Error generating training plan for user ${userId}:`, error);
      return "We're unable to generate your training plan at this time. Please try again later.";
    }
  }
}

// Export singleton instance
export const aiCoachService = new AiCoachService();