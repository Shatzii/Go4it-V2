import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { z } from 'zod';

const router = Router();

/**
 * Get student progress data
 */
router.get('/students/:studentId/progress', async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.params.studentId);
    
    if (isNaN(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }
    
    // Get progress data for this student
    const progressData = await storage.getStudentProgress(studentId);
    
    res.json(progressData);
  } catch (error) {
    console.error('Error fetching student progress:', error);
    res.status(500).json({ 
      error: 'Failed to fetch student progress',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Update student progress
 */
router.post('/students/:studentId/progress', async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.params.studentId);
    
    if (isNaN(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }
    
    const schema = z.object({
      objectiveId: z.number().optional(),
      standardId: z.number().optional(),
      activityId: z.number().optional(),
      assessmentId: z.number().optional(),
      curriculumPathId: z.number().optional(),
      masteryLevel: z.number().min(0).max(100).optional(),
      status: z.enum(['not_started', 'in_progress', 'completed', 'mastered']).optional(),
      timeSpent: z.number().optional(),
      attempts: z.number().optional(),
      latestScore: z.number().optional(),
      bestScore: z.number().optional(),
      notes: z.string().optional(),
      metadata: z.record(z.any()).optional(),
    });
    
    const validationResult = schema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data', 
        details: validationResult.error.errors 
      });
    }
    
    // Create or update progress
    const progress = await storage.updateStudentProgress(studentId, validationResult.data);
    
    res.json(progress);
  } catch (error) {
    console.error('Error updating student progress:', error);
    res.status(500).json({ 
      error: 'Failed to update student progress',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get detailed progress statistics for a student
 */
router.get('/students/:studentId/progress/stats', async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.params.studentId);
    
    if (isNaN(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }
    
    // Get student progress statistics
    const progressStats = await storage.getStudentProgressStats(studentId);
    
    res.json(progressStats);
  } catch (error) {
    console.error('Error fetching student progress stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch student progress stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Record a completed activity for a student
 */
router.post('/students/:studentId/activities/:activityId/complete', async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.params.studentId);
    const activityId = parseInt(req.params.activityId);
    
    if (isNaN(studentId) || isNaN(activityId)) {
      return res.status(400).json({ error: 'Invalid student ID or activity ID' });
    }
    
    const schema = z.object({
      timeSpent: z.number().min(0),
      pointsEarned: z.number().min(0).optional(),
      completionDate: z.string().optional(),
      metadata: z.record(z.any()).optional(),
    });
    
    const validationResult = schema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data', 
        details: validationResult.error.errors 
      });
    }
    
    // Record activity completion
    const result = await storage.recordActivityCompletion(
      studentId, 
      activityId, 
      validationResult.data
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error recording activity completion:', error);
    res.status(500).json({ 
      error: 'Failed to record activity completion',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Record assessment result for a student
 */
router.post('/students/:studentId/assessments/:assessmentId/results', async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.params.studentId);
    const assessmentId = parseInt(req.params.assessmentId);
    
    if (isNaN(studentId) || isNaN(assessmentId)) {
      return res.status(400).json({ error: 'Invalid student ID or assessment ID' });
    }
    
    const schema = z.object({
      score: z.number().min(0).max(100),
      timeTaken: z.number().min(0),
      answers: z.record(z.any()),
      feedback: z.record(z.any()).optional(),
      completionStatus: z.enum(['completed', 'abandoned', 'timed_out']).default('completed'),
      startedAt: z.string().datetime(),
      completedAt: z.string().datetime().optional(),
      metadata: z.record(z.any()).optional(),
    });
    
    const validationResult = schema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data', 
        details: validationResult.error.errors 
      });
    }
    
    // Record assessment result
    const result = await storage.recordAssessmentResult(
      studentId, 
      assessmentId, 
      validationResult.data
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error recording assessment result:', error);
    res.status(500).json({ 
      error: 'Failed to record assessment result',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get student achievements
 */
router.get('/students/:studentId/achievements', async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.params.studentId);
    
    if (isNaN(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }
    
    // Get student achievements
    const achievements = await storage.getStudentAchievements(studentId);
    
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching student achievements:', error);
    res.status(500).json({ 
      error: 'Failed to fetch student achievements',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Award an achievement to a student
 */
router.post('/students/:studentId/achievements/:achievementId', async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.params.studentId);
    const achievementId = parseInt(req.params.achievementId);
    
    if (isNaN(studentId) || isNaN(achievementId)) {
      return res.status(400).json({ error: 'Invalid student ID or achievement ID' });
    }
    
    const schema = z.object({
      metadata: z.record(z.any()).optional(),
    });
    
    const validationResult = schema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data', 
        details: validationResult.error.errors 
      });
    }
    
    // Award achievement
    const result = await storage.awardAchievement(
      studentId, 
      achievementId, 
      validationResult.data?.metadata
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error awarding achievement:', error);
    res.status(500).json({ 
      error: 'Failed to award achievement',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Log student activity
 */
router.post('/students/:studentId/activity-logs', async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.params.studentId);
    
    if (isNaN(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }
    
    const schema = z.object({
      activityType: z.string(),
      activityId: z.number().optional(),
      duration: z.number().optional(),
      achievementPoints: z.number().optional(),
      details: z.record(z.any()).optional(),
      metadata: z.record(z.any()).optional(),
    });
    
    const validationResult = schema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data', 
        details: validationResult.error.errors 
      });
    }
    
    // Log student activity
    const result = await storage.logStudentActivity(
      studentId, 
      validationResult.data
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error logging student activity:', error);
    res.status(500).json({ 
      error: 'Failed to log student activity',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;