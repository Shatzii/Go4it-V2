/**
 * Combine Public Routes
 * 
 * Handles all API endpoints for the public-facing combine engine
 */

import express, { Request, Response } from 'express';
import { storage } from '../storage';
import { isAuthenticatedMiddleware as isAuthenticated, isAdminMiddleware as isAdmin } from '../middleware/auth-middleware';
import { User, CombineTourEvent, CombineAthleteRating, CombineAnalysisResult } from '../../shared/schema';
import { CombineService } from '../services/combine-service';

const router = express.Router();
const combineService = new CombineService();

/**
 * @route GET /api/combine-public/events
 * @desc Get all public combine events
 * @access Public
 */
router.get('/events', async (req: Request, res: Response) => {
  try {
    const events = await storage.getCombineTourEvents();
    return res.json(events);
  } catch (error) {
    console.error('Error fetching combine events:', error);
    return res.status(500).json({ message: 'Error fetching combine events' });
  }
});

/**
 * @route GET /api/combine-public/events/:id
 * @desc Get a specific combine event
 * @access Public
 */
router.get('/events/:id', async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = await storage.getCombineTourEvent(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    return res.json(event);
  } catch (error) {
    console.error('Error fetching combine event:', error);
    return res.status(500).json({ message: 'Error fetching combine event' });
  }
});

/**
 * @route GET /api/combine-public/registrations
 * @desc Get all registrations for the current user
 * @access Authenticated
 */
router.get('/registrations', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const registrations = await storage.getUserCombineRegistrations(user.id);
    return res.json(registrations);
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    return res.status(500).json({ message: 'Error fetching user registrations' });
  }
});

/**
 * @route POST /api/combine-public/register/:eventId
 * @desc Register a user for a combine event
 * @access Authenticated
 */
router.post('/register/:eventId', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const eventId = parseInt(req.params.eventId);
    const { sportType, position } = req.body;
    
    // Check if the event exists
    const event = await storage.getCombineTourEvent(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if registration is already completed
    const existingRegistration = await storage.getCombineRegistration(user.id, eventId);
    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    
    // Validate maximum attendees not exceeded
    if (event.maximumAttendees && event.currentAttendees && event.currentAttendees >= event.maximumAttendees) {
      return res.status(400).json({ message: 'This event is already at maximum capacity' });
    }
    
    // Create registration
    const registration = await storage.createCombineRegistration({
      userId: user.id,
      eventId,
      registrationDate: new Date(),
      sportType: sportType || '',
      position: position || '',
      status: 'pending',
      paymentStatus: 'pending',
      paymentAmount: event.price || 0,
      checkedIn: false
    });
    
    // Update event attendee count
    await storage.updateCombineTourEvent(eventId, {
      currentAttendees: (event.currentAttendees || 0) + 1
    });
    
    return res.status(201).json(registration);
  } catch (error) {
    console.error('Error registering for combine event:', error);
    return res.status(500).json({ message: 'Error registering for combine event' });
  }
});

/**
 * @route GET /api/combine-public/athlete-ratings
 * @desc Get combine ratings for the current athlete
 * @access Authenticated
 */
router.get('/athlete-ratings', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const ratings = await combineService.getAthleteRatings(user.id);
    return res.json(ratings);
  } catch (error) {
    console.error('Error fetching athlete ratings:', error);
    return res.status(500).json({ message: 'Error fetching athlete ratings' });
  }
});

/**
 * @route GET /api/combine-public/analysis
 * @desc Get combine analysis results for the current athlete
 * @access Authenticated
 */
router.get('/analysis', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const analysis = await combineService.getAthleteAnalysisResults(user.id);
    return res.json(analysis);
  } catch (error) {
    console.error('Error fetching athlete analysis:', error);
    return res.status(500).json({ message: 'Error fetching athlete analysis' });
  }
});

/**
 * @route POST /api/combine-public/check-in/:eventId
 * @desc Check in a user at a combine event
 * @access Authenticated
 */
router.post('/check-in/:eventId', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const eventId = parseInt(req.params.eventId);
    
    // Check if registration exists
    const registration = await storage.getCombineRegistration(user.id, eventId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    // Update registration check-in status
    const updatedRegistration = await storage.updateCombineRegistration(registration.id, {
      checkedIn: true,
      checkInTime: new Date()
    });
    
    return res.json(updatedRegistration);
  } catch (error) {
    console.error('Error checking in to combine event:', error);
    return res.status(500).json({ message: 'Error checking in to combine event' });
  }
});

/**
 * @route GET /api/combine-public/leaderboard/:eventId
 * @desc Get the leaderboard for a combine event
 * @access Public
 */
router.get('/leaderboard/:eventId', async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.eventId);
    
    // Get the event details
    const event = await storage.getCombineTourEvent(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Get all ratings for this event
    const ratings = await combineService.getEventRatings(eventId);
    
    // Calculate leaderboard data
    const leaderboard = ratings.map(rating => {
      // Calculate an average score if metrics exist
      let averageScore = 0;
      let totalMetrics = 0;
      
      if (rating.metrics) {
        const metrics = rating.metrics as Record<string, number>;
        Object.values(metrics).forEach(value => {
          if (typeof value === 'number') {
            averageScore += value;
            totalMetrics++;
          }
        });
        
        if (totalMetrics > 0) {
          averageScore = averageScore / totalMetrics;
        }
      }
      
      return {
        id: rating.id,
        userId: rating.user_id,
        userName: rating.user_name || 'Athlete',
        sport: rating.sport,
        position: rating.position,
        starLevel: rating.star_level,
        averageScore: averageScore.toFixed(2),
        topMetrics: rating.metrics ? getTopMetrics(rating.metrics as Record<string, number>) : [],
        created: rating.created_at
      };
    });
    
    // Sort by star level and then average score
    leaderboard.sort((a, b) => {
      if (a.starLevel !== b.starLevel) {
        return b.starLevel - a.starLevel;
      }
      return parseFloat(b.averageScore) - parseFloat(a.averageScore);
    });
    
    return res.json({
      event,
      leaderboard
    });
  } catch (error) {
    console.error('Error fetching combine leaderboard:', error);
    return res.status(500).json({ message: 'Error fetching combine leaderboard' });
  }
});

/**
 * Helper to get top metrics for a player
 */
function getTopMetrics(metrics: Record<string, number>): Array<{name: string, value: number}> {
  return Object.entries(metrics)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
}

export default router;