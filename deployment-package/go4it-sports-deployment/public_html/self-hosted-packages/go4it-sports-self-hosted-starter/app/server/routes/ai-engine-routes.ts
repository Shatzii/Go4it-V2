/**
 * AI Engine Routes
 * 
 * This file contains all the API routes for the AI Engine integration.
 * These endpoints connect to the AI services that handle video analysis,
 * GAR scoring, highlight generation, and the StarPath progression system.
 */

import express from 'express';
import { VideoAnalysisService, GARScoreService, HighlightService, RankingService, StarPathService } from '../engine';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Initialize services
const videoAnalysisService = new VideoAnalysisService();
const garScoreService = new GARScoreService();
const highlightService = new HighlightService();
const rankingService = new RankingService();
const starPathService = new StarPathService();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/videos');
    
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Only accept video files
    const validMimeTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'];
    if (!validMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Only video files are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});

export function registerAIEngineRoutes(router: express.Router) {
  /**
   * Video Analysis Endpoints
   */
  
  // Upload and analyze a video
  router.post('/analyze-video', upload.single('video'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No video file uploaded' });
      }
      
      // Validate the uploaded file
      const validation = videoAnalysisService.validateVideo(req.file);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
      }
      
      // Generate a video ID
      const videoId = uuidv4();
      
      // Extract sport type from request
      const sportType = req.body.sportType || 'basketball';
      
      // Start the analysis process
      const analysisResult = await videoAnalysisService.analyzeVideo(
        videoId,
        req.file.path,
        sportType
      );
      
      if (!analysisResult) {
        return res.status(500).json({ error: 'Video analysis failed' });
      }
      
      res.status(200).json({ 
        success: true, 
        videoId,
        message: 'Video analysis started',
        result: analysisResult 
      });
    } catch (error) {
      console.error('Error in video analysis:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get video analysis results
  router.get('/video-analysis/:videoId', async (req, res) => {
    try {
      const { videoId } = req.params;
      
      const analysisResult = await videoAnalysisService.getVideoAnalysis(videoId);
      
      if (!analysisResult) {
        return res.status(404).json({ error: 'Video analysis not found' });
      }
      
      res.status(200).json(analysisResult);
    } catch (error) {
      console.error('Error getting video analysis:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  /**
   * GAR Score Endpoints
   */
  
  // Generate GAR scores for a video
  router.post('/gar-score', async (req, res) => {
    try {
      const { videoId, videoPath, sportType } = req.body;
      
      if (!videoId || !videoPath) {
        return res.status(400).json({ error: 'Video ID and path are required' });
      }
      
      const garScore = await garScoreService.generateGARScore(
        videoId,
        videoPath,
        sportType || 'basketball'
      );
      
      if (!garScore) {
        return res.status(500).json({ error: 'GAR score generation failed' });
      }
      
      res.status(200).json(garScore);
    } catch (error) {
      console.error('Error generating GAR scores:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get GAR scores for a video
  router.get('/gar-score/:videoId', async (req, res) => {
    try {
      const { videoId } = req.params;
      
      const garScore = await garScoreService.getGARScore(videoId);
      
      if (!garScore) {
        return res.status(404).json({ error: 'GAR scores not found' });
      }
      
      res.status(200).json(garScore);
    } catch (error) {
      console.error('Error getting GAR scores:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  /**
   * Highlight Endpoints
   */
  
  // Generate highlight reel
  router.post('/highlights', async (req, res) => {
    try {
      const { videoId, maxDuration, includeActions, title, description } = req.body;
      
      if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required' });
      }
      
      const highlightReel = await highlightService.generateHighlights(
        videoId,
        { maxDuration, includeActions, title, description }
      );
      
      if (!highlightReel) {
        return res.status(500).json({ error: 'Highlight generation failed' });
      }
      
      res.status(200).json(highlightReel);
    } catch (error) {
      console.error('Error generating highlights:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get highlight reel
  router.get('/highlights/:highlightId', async (req, res) => {
    try {
      const { highlightId } = req.params;
      
      const highlightReel = await highlightService.getHighlightReel(highlightId);
      
      if (!highlightReel) {
        return res.status(404).json({ error: 'Highlight reel not found' });
      }
      
      res.status(200).json(highlightReel);
    } catch (error) {
      console.error('Error getting highlight reel:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get user's highlight reels
  router.get('/highlights/user/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      
      const highlightReels = await highlightService.getUserHighlightReels(userId);
      
      res.status(200).json(highlightReels);
    } catch (error) {
      console.error('Error getting user highlight reels:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  /**
   * Ranking Endpoints
   */
  
  // Get Hot 100 rankings
  router.get('/rankings/hot100', async (req, res) => {
    try {
      const { sport, ageGroup, region, limit } = req.query;
      
      const rankings = await rankingService.getHot100Rankings(
        sport as string || 'basketball',
        ageGroup as string,
        region as string,
        parseInt(limit as string) || 100
      );
      
      if (!rankings) {
        return res.status(404).json({ error: 'Rankings not found' });
      }
      
      res.status(200).json(rankings);
    } catch (error) {
      console.error('Error getting Hot 100 rankings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get athlete rankings
  router.get('/rankings/athlete/:athleteId', async (req, res) => {
    try {
      const { athleteId } = req.params;
      
      const athleteRanking = await rankingService.getAthleteRankings(athleteId);
      
      if (!athleteRanking) {
        return res.status(404).json({ error: 'Athlete ranking not found' });
      }
      
      res.status(200).json(athleteRanking);
    } catch (error) {
      console.error('Error getting athlete ranking:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Update rankings
  router.post('/rankings/update', async (req, res) => {
    try {
      const { sport } = req.body;
      
      if (!sport) {
        return res.status(400).json({ error: 'Sport is required' });
      }
      
      const success = await rankingService.updateRankings(sport);
      
      if (!success) {
        return res.status(500).json({ error: 'Ranking update failed' });
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error updating rankings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  /**
   * StarPath Endpoints
   */
  
  // Get StarPath profile
  router.get('/starpath/profile/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      
      const profile = await starPathService.getStarPathProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ error: 'StarPath profile not found' });
      }
      
      res.status(200).json(profile);
    } catch (error) {
      console.error('Error getting StarPath profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Update StarPath profile
  router.post('/starpath/update/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const activityData = req.body;
      
      if (!activityData || !activityData.activityType) {
        return res.status(400).json({ error: 'Activity data is required' });
      }
      
      const activity = await starPathService.updateStarPathProfile(userId, activityData);
      
      if (!activity) {
        return res.status(500).json({ error: 'StarPath update failed' });
      }
      
      res.status(200).json(activity);
    } catch (error) {
      console.error('Error updating StarPath profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get available missions
  router.get('/starpath/missions/:userId/available', async (req, res) => {
    try {
      const { userId } = req.params;
      
      const missions = await starPathService.getAvailableMissions(userId);
      
      res.status(200).json(missions);
    } catch (error) {
      console.error('Error getting available missions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get activity history
  router.get('/starpath/activity/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const { limit } = req.query;
      
      const activities = await starPathService.getActivityHistory(
        userId,
        parseInt(limit as string) || 20
      );
      
      res.status(200).json(activities);
    } catch (error) {
      console.error('Error getting activity history:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}