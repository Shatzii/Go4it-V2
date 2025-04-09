import express, { Request, Response } from 'express';
import { db } from '../db';
import { aiCoaches, aiCoachSessions, aiCoachMessages, coachFeedback, coachRecommendations } from '@shared/schema';
import { aiCoachService } from '../services/ai-coach-service';
import { isAuthenticatedMiddleware, isAdminMiddleware } from '../middleware/auth-middleware';
import { and, eq, desc } from 'drizzle-orm';

// Function to register AI Coach routes
export function registerAiCoachRoutes(app: express.Express) {
  // Get all available AI coaches
  app.get('/api/ai-coaches', async (req: Request, res: Response) => {
    try {
      const coaches = await db
        .select({
          id: aiCoaches.id,
          name: aiCoaches.name,
          sport: aiCoaches.sport,
          specialty: aiCoaches.specialty,
          personality: aiCoaches.personality,
          avatarImage: aiCoaches.avatarImage,
          active: aiCoaches.active,
        })
        .from(aiCoaches)
        .where(eq(aiCoaches.active, true));

      return res.status(200).json(coaches);
    } catch (error) {
      console.error('Error fetching AI coaches:', error);
      return res.status(500).json({ message: 'Error fetching AI coaches' });
    }
  });

  // Get a specific AI coach
  app.get('/api/ai-coaches/:id', async (req: Request, res: Response) => {
    try {
      const coachId = parseInt(req.params.id);
      if (isNaN(coachId)) {
        return res.status(400).json({ message: 'Invalid coach ID' });
      }

      const [coach] = await db
        .select({
          id: aiCoaches.id,
          name: aiCoaches.name,
          sport: aiCoaches.sport,
          specialty: aiCoaches.specialty,
          personality: aiCoaches.personality,
          avatarImage: aiCoaches.avatarImage,
          active: aiCoaches.active,
        })
        .from(aiCoaches)
        .where(eq(aiCoaches.id, coachId));

      if (!coach) {
        return res.status(404).json({ message: 'Coach not found' });
      }

      return res.status(200).json(coach);
    } catch (error) {
      console.error(`Error fetching AI coach ${req.params.id}:`, error);
      return res.status(500).json({ message: 'Error fetching AI coach' });
    }
  });

  // Create a new AI coach (admin only)
  app.post('/api/ai-coaches', isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const { name, sport, specialty, personality, systemPrompt, knowledgeBase, active, avatarImage } = req.body;

      if (!name || !sport || !systemPrompt || !knowledgeBase) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const [newCoach] = await db.insert(aiCoaches).values({
        name,
        sport,
        specialty: specialty || 'General',
        personality: personality || 'Supportive and encouraging',
        systemPrompt,
        knowledgeBase,
        active: active !== undefined ? active : true,
        avatarImage: avatarImage || null,
      }).returning();

      return res.status(201).json(newCoach);
    } catch (error) {
      console.error('Error creating AI coach:', error);
      return res.status(500).json({ message: 'Error creating AI coach' });
    }
  });

  // Update an AI coach (admin only)
  app.put('/api/ai-coaches/:id', isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const coachId = parseInt(req.params.id);
      if (isNaN(coachId)) {
        return res.status(400).json({ message: 'Invalid coach ID' });
      }

      const { name, sport, specialty, personality, systemPrompt, knowledgeBase, active, avatarImage } = req.body;

      const [updatedCoach] = await db
        .update(aiCoaches)
        .set({
          name: name,
          sport: sport,
          specialty: specialty,
          personality: personality,
          systemPrompt: systemPrompt,
          knowledgeBase: knowledgeBase,
          active: active,
          avatarImage: avatarImage,
          updatedAt: new Date(),
        })
        .where(eq(aiCoaches.id, coachId))
        .returning();

      if (!updatedCoach) {
        return res.status(404).json({ message: 'Coach not found' });
      }

      return res.status(200).json(updatedCoach);
    } catch (error) {
      console.error(`Error updating AI coach ${req.params.id}:`, error);
      return res.status(500).json({ message: 'Error updating AI coach' });
    }
  });

  // Delete an AI coach (admin only)
  app.delete('/api/ai-coaches/:id', isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const coachId = parseInt(req.params.id);
      if (isNaN(coachId)) {
        return res.status(400).json({ message: 'Invalid coach ID' });
      }

      // Instead of deleting, just deactivate the coach
      const [deactivatedCoach] = await db
        .update(aiCoaches)
        .set({
          active: false,
          updatedAt: new Date(),
        })
        .where(eq(aiCoaches.id, coachId))
        .returning();

      if (!deactivatedCoach) {
        return res.status(404).json({ message: 'Coach not found' });
      }

      return res.status(200).json({ message: 'Coach deactivated successfully' });
    } catch (error) {
      console.error(`Error deactivating AI coach ${req.params.id}:`, error);
      return res.status(500).json({ message: 'Error deactivating AI coach' });
    }
  });

  // Get user's active sessions
  app.get('/api/ai-coach/sessions', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;

      const activeSessions = await db
        .select({
          id: aiCoachSessions.id,
          userId: aiCoachSessions.userId,
          coachId: aiCoachSessions.coachId,
          topic: aiCoachSessions.topic,
          userGoals: aiCoachSessions.userGoals,
          startedAt: aiCoachSessions.startedAt,
          lastMessageAt: aiCoachSessions.lastMessageAt,
          coachName: aiCoaches.name,
          coachSport: aiCoaches.sport,
          coachAvatar: aiCoaches.avatarImage,
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

      return res.status(200).json(activeSessions);
    } catch (error) {
      console.error('Error fetching AI coach sessions:', error);
      return res.status(500).json({ message: 'Error fetching AI coach sessions' });
    }
  });

  // Create a new coaching session
  app.post('/api/ai-coach/sessions', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const { coachId, topic, userGoals } = req.body;

      if (!coachId) {
        return res.status(400).json({ message: 'Coach ID is required' });
      }

      // Get coach information
      const [coach] = await db
        .select()
        .from(aiCoaches)
        .where(
          and(
            eq(aiCoaches.id, coachId),
            eq(aiCoaches.active, true)
          )
        );

      if (!coach) {
        return res.status(404).json({ message: 'Coach not found or inactive' });
      }

      // Create session
      const [session] = await db
        .insert(aiCoachSessions)
        .values({
          userId,
          coachId,
          topic: topic || null,
          userGoals: userGoals || null,
          active: true,
        })
        .returning();

      // Generate welcome message
      const welcomeMessage = await aiCoachService.generateWelcomeMessage(coach, userGoals || null);

      // Save the AI coach message
      const [message] = await db
        .insert(aiCoachMessages)
        .values({
          sessionId: session.id,
          coachId: coach.id,
          content: welcomeMessage,
          messageType: 'text',
        })
        .returning();

      // Return the session with the welcome message
      return res.status(201).json({
        session,
        welcomeMessage: message,
      });
    } catch (error) {
      console.error('Error creating coaching session:', error);
      return res.status(500).json({ message: 'Error creating coaching session' });
    }
  });

  // Get messages for a specific session
  app.get('/api/ai-coach/sessions/:sessionId/messages', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const sessionId = parseInt(req.params.sessionId);

      if (isNaN(sessionId)) {
        return res.status(400).json({ message: 'Invalid session ID' });
      }

      // Verify session belongs to user
      const [session] = await db
        .select()
        .from(aiCoachSessions)
        .where(
          and(
            eq(aiCoachSessions.id, sessionId),
            eq(aiCoachSessions.userId, userId)
          )
        );

      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      // Get all messages for this session
      const messages = await db
        .select()
        .from(aiCoachMessages)
        .where(eq(aiCoachMessages.sessionId, sessionId))
        .orderBy(aiCoachMessages.sentAt);

      return res.status(200).json(messages);
    } catch (error) {
      console.error(`Error fetching messages for session ${req.params.sessionId}:`, error);
      return res.status(500).json({ message: 'Error fetching session messages' });
    }
  });

  // Send a message in a coaching session
  app.post('/api/ai-coach/sessions/:sessionId/messages', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const sessionId = parseInt(req.params.sessionId);
      const { content, attachmentUrl } = req.body;

      if (isNaN(sessionId)) {
        return res.status(400).json({ message: 'Invalid session ID' });
      }

      if (!content) {
        return res.status(400).json({ message: 'Message content is required' });
      }

      // Verify session belongs to user and is active
      const [session] = await db
        .select()
        .from(aiCoachSessions)
        .innerJoin(aiCoaches, eq(aiCoachSessions.coachId, aiCoaches.id))
        .where(
          and(
            eq(aiCoachSessions.id, sessionId),
            eq(aiCoachSessions.userId, userId),
            eq(aiCoachSessions.active, true)
          )
        );

      if (!session) {
        return res.status(404).json({ message: 'Active session not found' });
      }

      // Save user message
      const [userMessage] = await db
        .insert(aiCoachMessages)
        .values({
          sessionId,
          senderId: userId,
          content,
          messageType: attachmentUrl ? 'attachment' : 'text',
          attachmentUrl: attachmentUrl || null,
        })
        .returning();

      // Update session last activity time
      await db
        .update(aiCoachSessions)
        .set({ lastMessageAt: new Date() })
        .where(eq(aiCoachSessions.id, sessionId));

      // Get message history for context
      const messageHistory = await db
        .select()
        .from(aiCoachMessages)
        .where(eq(aiCoachMessages.sessionId, sessionId))
        .orderBy(aiCoachMessages.sentAt);

      // Format messages for AI service
      const formattedMessages = messageHistory.map(msg => ({
        role: msg.senderId ? 'user' : 'assistant',
        content: msg.content,
      }));

      // Generate AI coach response
      const aiResponse = await aiCoachService.generateResponse(
        session.aiCoaches,
        formattedMessages,
        session.aiCoachSessions
      );

      // Save AI response
      const [coachMessage] = await db
        .insert(aiCoachMessages)
        .values({
          sessionId,
          coachId: session.aiCoachSessions.coachId,
          content: aiResponse,
          messageType: 'text',
        })
        .returning();

      // Return both messages
      return res.status(201).json({
        userMessage,
        coachMessage,
      });
    } catch (error) {
      console.error(`Error sending message in session ${req.params.sessionId}:`, error);
      return res.status(500).json({ message: 'Error sending message' });
    }
  });

  // End (deactivate) a coaching session
  app.put('/api/ai-coach/sessions/:sessionId/end', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const sessionId = parseInt(req.params.sessionId);

      if (isNaN(sessionId)) {
        return res.status(400).json({ message: 'Invalid session ID' });
      }

      // Verify session belongs to user
      const [session] = await db
        .select()
        .from(aiCoachSessions)
        .where(
          and(
            eq(aiCoachSessions.id, sessionId),
            eq(aiCoachSessions.userId, userId),
            eq(aiCoachSessions.active, true)
          )
        );

      if (!session) {
        return res.status(404).json({ message: 'Active session not found' });
      }

      // End the session
      const [endedSession] = await db
        .update(aiCoachSessions)
        .set({
          active: false,
        })
        .where(eq(aiCoachSessions.id, sessionId))
        .returning();

      return res.status(200).json({
        message: 'Session ended successfully',
        session: endedSession,
      });
    } catch (error) {
      console.error(`Error ending session ${req.params.sessionId}:`, error);
      return res.status(500).json({ message: 'Error ending session' });
    }
  });

  // Submit feedback for a coaching session
  app.post('/api/ai-coach/sessions/:sessionId/feedback', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const sessionId = parseInt(req.params.sessionId);
      const { rating, feedback } = req.body;

      if (isNaN(sessionId)) {
        return res.status(400).json({ message: 'Invalid session ID' });
      }

      if (rating === undefined || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }

      // Verify session belongs to user
      const [session] = await db
        .select()
        .from(aiCoachSessions)
        .where(
          and(
            eq(aiCoachSessions.id, sessionId),
            eq(aiCoachSessions.userId, userId)
          )
        );

      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      // Check if feedback already exists
      const existingFeedback = await db
        .select()
        .from(coachFeedback)
        .where(
          and(
            eq(coachFeedback.sessionId, sessionId),
            eq(coachFeedback.userId, userId)
          )
        );

      if (existingFeedback.length > 0) {
        // Update existing feedback
        const [updatedFeedback] = await db
          .update(coachFeedback)
          .set({
            rating,
            feedback: feedback || null,
          })
          .where(
            and(
              eq(coachFeedback.sessionId, sessionId),
              eq(coachFeedback.userId, userId)
            )
          )
          .returning();

        return res.status(200).json(updatedFeedback);
      } else {
        // Create new feedback
        const [newFeedback] = await db
          .insert(coachFeedback)
          .values({
            userId,
            coachId: session.coachId,
            sessionId,
            rating,
            feedback: feedback || null,
          })
          .returning();

        return res.status(201).json(newFeedback);
      }
    } catch (error) {
      console.error(`Error submitting feedback for session ${req.params.sessionId}:`, error);
      return res.status(500).json({ message: 'Error submitting feedback' });
    }
  });

  // Get personalized training plan
  app.post('/api/ai-coach/training-plan', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const { goals, timeframe, focusAreas } = req.body;

      if (!goals || !timeframe || !focusAreas || !Array.isArray(focusAreas)) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const trainingPlan = await aiCoachService.generateTrainingPlan(
        userId,
        goals,
        timeframe,
        focusAreas
      );

      // Create a recommendation entry
      const [recommendation] = await db
        .insert(coachRecommendations)
        .values({
          userId,
          coachId: 1, // Default AI coach ID
          recommendationType: 'training_plan',
          title: `Training Plan: ${timeframe}`,
          description: goals,
          content: { plan: trainingPlan, focusAreas, timeframe },
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        })
        .returning();

      return res.status(201).json({
        plan: trainingPlan,
        recommendation,
      });
    } catch (error) {
      console.error(`Error generating training plan for user ${(req.user as any).id}:`, error);
      return res.status(500).json({ message: 'Error generating training plan' });
    }
  });

  // Get athletic assessment
  app.get('/api/ai-coach/athletic-assessment', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;

      const assessment = await aiCoachService.generateAthleticAssessment(userId);

      return res.status(200).json({
        assessment,
      });
    } catch (error) {
      console.error(`Error generating athletic assessment for user ${(req.user as any).id}:`, error);
      return res.status(500).json({ message: 'Error generating athletic assessment' });
    }
  });

  // Get user's recommendations
  app.get('/api/ai-coach/recommendations', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;

      const recommendations = await db
        .select()
        .from(coachRecommendations)
        .where(eq(coachRecommendations.userId, userId))
        .orderBy(desc(coachRecommendations.createdAt));

      return res.status(200).json(recommendations);
    } catch (error) {
      console.error(`Error fetching recommendations for user ${(req.user as any).id}:`, error);
      return res.status(500).json({ message: 'Error fetching recommendations' });
    }
  });

  // Mark recommendation as completed
  app.put('/api/ai-coach/recommendations/:id/complete', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const recommId = parseInt(req.params.id);
      const { feedback } = req.body;

      if (isNaN(recommId)) {
        return res.status(400).json({ message: 'Invalid recommendation ID' });
      }

      // Verify recommendation belongs to user
      const [recommendation] = await db
        .select()
        .from(coachRecommendations)
        .where(
          and(
            eq(coachRecommendations.id, recommId),
            eq(coachRecommendations.userId, userId)
          )
        );

      if (!recommendation) {
        return res.status(404).json({ message: 'Recommendation not found' });
      }

      // Mark as completed
      const [updatedRecommendation] = await db
        .update(coachRecommendations)
        .set({
          completed: true,
          completedAt: new Date(),
          feedback: feedback || null,
        })
        .where(eq(coachRecommendations.id, recommId))
        .returning();

      return res.status(200).json(updatedRecommendation);
    } catch (error) {
      console.error(`Error marking recommendation ${req.params.id} as completed:`, error);
      return res.status(500).json({ message: 'Error updating recommendation' });
    }
  });
}