import express from 'express';
import { combineService } from '../services/combine-service';
import { z } from 'zod';
import { insertCombineAthleteRatingSchema, insertCombineAnalysisResultSchema } from '@shared/schema';

const router = express.Router();

// Get all combine rating templates with optional filters
router.get('/templates', async (req, res) => {
  try {
    const filters = {
      sport: req.query.sport as string,
      position: req.query.position as string,
      starLevel: req.query.starLevel ? parseInt(req.query.starLevel as string) : undefined
    };
    
    const templates = await combineService.getAllTemplates(filters);
    res.json(templates);
  } catch (error) {
    console.error('Error fetching combine templates:', error);
    res.status(500).json({ error: 'Failed to fetch combine templates' });
  }
});

// Get a specific template by ID
router.get('/templates/:id', async (req, res) => {
  try {
    const templateId = req.params.id;
    const template = await combineService.getTemplateById(templateId);
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json(template);
  } catch (error) {
    console.error(`Error fetching template ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// Create a new athlete rating
router.post('/ratings', async (req, res) => {
  try {
    // Validate request body
    const validationSchema = insertCombineAthleteRatingSchema.extend({
      userId: z.number(),
      eventId: z.number().optional(),
      templateId: z.string().optional(),
      sport: z.string(),
      position: z.string(),
      starLevel: z.number().min(1).max(5),
      metrics: z.record(z.any()),
      traits: z.record(z.array(z.string())).optional(),
      notes: z.string().optional(),
      ratedBy: z.number().optional()
    });
    
    const data = validationSchema.parse(req.body);
    
    const rating = await combineService.createAthleteRating({
      userId: data.userId,
      templateId: data.templateId,
      eventId: data.eventId,
      sport: data.sport,
      position: data.position,
      starLevel: data.starLevel,
      metrics: data.metrics,
      traits: data.traits || {},
      notes: data.notes,
      ratedBy: data.ratedBy
    });
    
    res.status(201).json(rating);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating athlete rating:', error);
    res.status(500).json({ error: 'Failed to create athlete rating' });
  }
});

// Get all ratings for an athlete
router.get('/athlete/:userId/ratings', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const ratings = await combineService.getAthleteRatings(userId);
    res.json(ratings);
  } catch (error) {
    console.error(`Error fetching ratings for athlete ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to fetch athlete ratings' });
  }
});

// Create analysis results
router.post('/analysis', async (req, res) => {
  try {
    // Validate request body
    const validationSchema = insertCombineAnalysisResultSchema.extend({
      userId: z.number(),
      eventId: z.number().optional(),
      videoId: z.number().optional(),
      positionFit: z.array(z.string()),
      skillAnalysis: z.record(z.any()),
      nextSteps: z.record(z.any()),
      challenges: z.array(z.string()).optional(),
      recoveryStatus: z.string().optional(),
      recoveryScore: z.number().optional(),
      aiCoachNotes: z.string().optional()
    });
    
    const data = validationSchema.parse(req.body);
    
    const result = await combineService.saveAnalysisResults({
      userId: data.userId,
      eventId: data.eventId,
      videoId: data.videoId,
      positionFit: data.positionFit,
      skillAnalysis: data.skillAnalysis,
      nextSteps: data.nextSteps,
      challenges: data.challenges,
      recoveryStatus: data.recoveryStatus,
      recoveryScore: data.recoveryScore,
      aiCoachNotes: data.aiCoachNotes
    });
    
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating analysis results:', error);
    res.status(500).json({ error: 'Failed to create analysis results' });
  }
});

// Get all analysis results for an athlete
router.get('/athlete/:userId/analysis', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const results = await combineService.getAthleteAnalysisResults(userId);
    res.json(results);
  } catch (error) {
    console.error(`Error fetching analysis results for athlete ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to fetch analysis results' });
  }
});

// Get the latest analysis result for an athlete
router.get('/athlete/:userId/analysis/latest', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const result = await combineService.getLatestAnalysisResult(userId);
    
    if (!result) {
      return res.status(404).json({ error: 'No analysis results found for this athlete' });
    }
    
    res.json(result);
  } catch (error) {
    console.error(`Error fetching latest analysis for athlete ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to fetch latest analysis' });
  }
});

export default router;