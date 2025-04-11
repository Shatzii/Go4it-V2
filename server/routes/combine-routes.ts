import express, { Request, Response } from 'express';
import { z } from 'zod';
import { combineService } from '../services/combine-service';
import { storage } from '../storage';
import { User } from '../../shared/schema';
import { isAuthenticatedMiddleware as isAuthenticated, isCoachMiddleware as isCoach } from '../middleware/auth-middleware';

const router = express.Router();

// Helper for validating coach or admin
const isCoachOrAdmin = async (req: Request): Promise<boolean> => {
  const user = req.user as User | undefined;
  if (!user) return false;
  return user.role === 'admin' || user.role === 'coach';
};

/**
 * @route GET /api/combines/templates
 * @desc Get all combine rating templates
 * @access Public
 */
router.get('/templates', async (req: Request, res: Response) => {
  try {
    const sport = req.query.sport as string | undefined;
    const position = req.query.position as string | undefined;
    const starLevel = req.query.starLevel ? parseInt(req.query.starLevel as string) : undefined;
    
    const templates = await combineService.getAllTemplates({
      sport,
      position,
      starLevel,
    });
    
    return res.json(templates);
  } catch (error) {
    console.error('Error fetching combine templates:', error);
    return res.status(500).json({ message: 'Error fetching combine templates' });
  }
});

/**
 * @route GET /api/combines/templates/:templateId
 * @desc Get a specific combine rating template
 * @access Public
 */
router.get('/templates/:templateId', async (req: Request, res: Response) => {
  try {
    const templateId = req.params.templateId;
    
    const template = await combineService.getTemplateById(templateId);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    return res.json(template);
  } catch (error) {
    console.error('Error fetching combine template:', error);
    return res.status(500).json({ message: 'Error fetching combine template' });
  }
});

/**
 * @route POST /api/combines/templates
 * @desc Create a new combine rating template
 * @access Admin/Coach only
 */
router.post('/templates', isAuthenticated, async (req: Request, res: Response) => {
  if (!await isCoachOrAdmin(req)) {
    return res.status(403).json({ message: 'Not authorized to create templates' });
  }
  
  try {
    const templateData = req.body;
    
    const template = await combineService.createTemplate(templateData);
    
    return res.status(201).json(template);
  } catch (error) {
    console.error('Error creating combine template:', error);
    return res.status(500).json({ message: 'Error creating combine template' });
  }
});

/**
 * @route PUT /api/combines/templates/:templateId
 * @desc Update a combine rating template
 * @access Admin/Coach only
 */
router.put('/templates/:templateId', isAuthenticated, async (req: Request, res: Response) => {
  if (!await isCoachOrAdmin(req)) {
    return res.status(403).json({ message: 'Not authorized to update templates' });
  }
  
  try {
    const templateId = req.params.templateId;
    const templateData = req.body;
    
    const template = await combineService.updateTemplate(templateId, templateData);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    return res.json(template);
  } catch (error) {
    console.error('Error updating combine template:', error);
    return res.status(500).json({ message: 'Error updating combine template' });
  }
});

/**
 * @route DELETE /api/combines/templates/:templateId
 * @desc Delete a combine rating template
 * @access Admin only
 */
router.delete('/templates/:templateId', isAuthenticated, async (req: Request, res: Response) => {
  // Check if user is admin
  const user = req.user as User;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to delete templates' });
  }
  try {
    const templateId = req.params.templateId;
    
    const success = await combineService.deleteTemplate(templateId);
    
    if (!success) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting combine template:', error);
    return res.status(500).json({ message: 'Error deleting combine template' });
  }
});

/**
 * @route GET /api/combines/ratings/athlete/:userId
 * @desc Get athlete ratings for a specific user
 * @access Authenticated (user or coach/admin)
 */
router.get('/ratings/athlete/:userId', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = req.user as User;
    
    // Users can only view their own ratings unless they're admin/coach
    if (userId !== user.id && user.role !== 'admin' && user.role !== 'coach') {
      return res.status(403).json({ message: 'Not authorized to view these ratings' });
    }
    
    const ratings = await combineService.getAthleteRatings(userId);
    
    return res.json(ratings);
  } catch (error) {
    console.error('Error fetching athlete ratings:', error);
    return res.status(500).json({ message: 'Error fetching athlete ratings' });
  }
});

/**
 * @route POST /api/combines/ratings/athlete/:userId
 * @desc Create a new athlete rating
 * @access Coach/Admin only
 */
router.post('/ratings/athlete/:userId', isAuthenticated, async (req: Request, res: Response) => {
  if (!await isCoachOrAdmin(req)) {
    return res.status(403).json({ message: 'Not authorized to create athlete ratings' });
  }
  
  try {
    const userId = parseInt(req.params.userId);
    const ratingData = {
      ...req.body,
      user_id: userId,
      rated_by: (req.user as User).id
    };
    
    const rating = await combineService.createAthleteRating(ratingData);
    
    return res.status(201).json(rating);
  } catch (error) {
    console.error('Error creating athlete rating:', error);
    return res.status(500).json({ message: 'Error creating athlete rating' });
  }
});

/**
 * @route PUT /api/combines/ratings/:ratingId
 * @desc Update an athlete rating
 * @access Coach/Admin only
 */
router.put('/ratings/:ratingId', isAuthenticated, async (req: Request, res: Response) => {
  if (!await isCoachOrAdmin(req)) {
    return res.status(403).json({ message: 'Not authorized to update athlete ratings' });
  }
  
  try {
    const ratingId = parseInt(req.params.ratingId);
    const ratingData = req.body;
    
    // CombineService doesn't have an updateAthleteRating method yet
    // For now, we'll need to implement this in the service
    const rating = await combineService.createAthleteRating({
      ...ratingData,
      id: ratingId
    });
    
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    
    return res.json(rating);
  } catch (error) {
    console.error('Error updating athlete rating:', error);
    return res.status(500).json({ message: 'Error updating athlete rating' });
  }
});

/**
 * @route GET /api/combines/analysis/athlete/:userId
 * @desc Get combine analysis results for a specific athlete
 * @access Authenticated (user or coach/admin)
 */
router.get('/analysis/athlete/:userId', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = req.user as User;
    
    // Users can only view their own analysis unless they're admin/coach
    if (userId !== user.id && user.role !== 'admin' && user.role !== 'coach') {
      return res.status(403).json({ message: 'Not authorized to view this analysis' });
    }
    
    const analysis = await combineService.getAthleteAnalysisResults(userId);
    
    return res.json(analysis);
  } catch (error) {
    console.error('Error fetching athlete analysis:', error);
    return res.status(500).json({ message: 'Error fetching athlete analysis' });
  }
});

/**
 * @route POST /api/combines/analysis/athlete/:userId
 * @desc Create a new analysis result for an athlete
 * @access Coach/Admin only
 */
router.post('/analysis/athlete/:userId', isAuthenticated, async (req: Request, res: Response) => {
  if (!await isCoachOrAdmin(req)) {
    return res.status(403).json({ message: 'Not authorized to create analysis results' });
  }
  
  try {
    const userId = parseInt(req.params.userId);
    const analysisData = {
      ...req.body,
      user_id: userId
    };
    
    const analysis = await combineService.saveAnalysisResults(analysisData);
    
    return res.status(201).json(analysis);
  } catch (error) {
    console.error('Error creating analysis result:', error);
    return res.status(500).json({ message: 'Error creating analysis result' });
  }
});

/**
 * @route PUT /api/combines/analysis/:analysisId
 * @desc Update an analysis result
 * @access Coach/Admin only
 */
router.put('/analysis/:analysisId', isAuthenticated, async (req: Request, res: Response) => {
  if (!await isCoachOrAdmin(req)) {
    return res.status(403).json({ message: 'Not authorized to update analysis results' });
  }
  
  try {
    const analysisId = parseInt(req.params.analysisId);
    const analysisData = req.body;
    
    // Update the analysis by using saveAnalysisResults with the ID
    const analysis = await combineService.saveAnalysisResults({
      ...analysisData,
      id: analysisId
    });
    
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis result not found' });
    }
    
    return res.json(analysis);
  } catch (error) {
    console.error('Error updating analysis result:', error);
    return res.status(500).json({ message: 'Error updating analysis result' });
  }
});

/**
 * @route GET /api/combines/events/:eventId/ratings
 * @desc Get all athlete ratings for a specific combine event
 * @access Coach/Admin only
 */
router.get('/events/:eventId/ratings', isAuthenticated, async (req: Request, res: Response) => {
  if (!await isCoachOrAdmin(req)) {
    return res.status(403).json({ message: 'Not authorized to view event ratings' });
  }
  
  try {
    const eventId = parseInt(req.params.eventId);
    
    const ratings = await combineService.getEventRatings(eventId);
    
    return res.json(ratings);
  } catch (error) {
    console.error('Error fetching event ratings:', error);
    return res.status(500).json({ message: 'Error fetching event ratings' });
  }
});

/**
 * @route GET /api/combines/stats
 * @desc Get combine statistics
 * @access Coach/Admin only
 */
router.get('/stats', isAuthenticated, async (req: Request, res: Response) => {
  if (!await isCoachOrAdmin(req)) {
    return res.status(403).json({ message: 'Not authorized to view combine stats' });
  }
  
  try {
    const stats = await combineService.getCombineStats();
    
    return res.json(stats);
  } catch (error) {
    console.error('Error fetching combine stats:', error);
    return res.status(500).json({ message: 'Error fetching combine stats' });
  }
});

/**
 * @route POST /api/combines/compare-template
 * @desc Compare athlete metrics to template
 * @access Authenticated
 */
router.post('/compare-template', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { templateId, metrics } = req.body;
    
    if (!templateId || !metrics) {
      return res.status(400).json({ message: 'Template ID and metrics are required' });
    }
    
    const comparison = await combineService.compareToTemplate(templateId, metrics);
    
    return res.json(comparison);
  } catch (error) {
    console.error('Error comparing to template:', error);
    return res.status(500).json({ message: 'Error comparing to template' });
  }
});

export default router;