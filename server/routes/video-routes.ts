import { Request, Response, Router } from 'express';
import { storage } from '../storage';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { insertVideoSchema, videos } from '@shared/schema';
import { z } from 'zod';

export const videoRoutes = Router();

// Configure multer for file uploads
const upload = multer({
  dest: path.join(process.cwd(), 'uploads/videos'),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
});

// Video upload endpoint
videoRoutes.post('/upload', upload.single('video'), async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No video file provided' });
    }
    
    // Generate a more user-friendly path for the video
    const videoDir = path.join(process.cwd(), 'uploads/videos');
    const uniqueId = uuidv4();
    const videoExt = path.extname(file.originalname) || '.mp4';
    const videoFilename = `${Date.now()}_${uniqueId}${videoExt}`;
    const videoPath = path.join(videoDir, videoFilename);
    
    // Move the uploaded file to our desired location with better naming
    fs.renameSync(file.path, videoPath);
    
    // Create a validation schema that extends the insert schema to include the file
    const videoUploadSchema = z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().optional(),
      sportType: z.string().optional(),
      recordedAt: z.string().optional(),
      isPrivate: z.boolean().optional().default(false),
      tags: z.array(z.string()).optional().default([]),
    });
    
    const validatedData = videoUploadSchema.parse(req.body);
    
    // Create the video record in the database
    const newVideo = await storage.createVideo({
      userId,
      title: validatedData.title,
      description: validatedData.description || '',
      filePath: `/uploads/videos/${videoFilename}`,
      fileSize: file.size,
      duration: 0, // To be updated later if video processing is implemented
      mimeType: file.mimetype,
      sportType: validatedData.sportType || 'general',
      recordedAt: validatedData.recordedAt ? new Date(validatedData.recordedAt) : new Date(),
      isPrivate: validatedData.isPrivate,
      status: 'ready',
      tags: validatedData.tags,
      createdAt: new Date(),
      thumbnailPath: null, // To be generated later if thumbnail processing is implemented
    });
    
    return res.status(201).json({
      success: true,
      video: newVideo,
      message: 'Video uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    
    // Clean up the file if it was uploaded but the database insert failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({ 
      message: 'Error uploading video',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get all videos for the current user
videoRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const videos = await storage.getVideosByUserId(userId);
    return res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return res.status(500).json({ message: 'Error fetching videos' });
  }
});

// Get a specific video
videoRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const videoId = parseInt(req.params.id);
    if (isNaN(videoId)) {
      return res.status(400).json({ message: 'Invalid video ID' });
    }
    
    const video = await storage.getVideo(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Check if user has permission to view this video
    if (video.userId !== userId && video.isPrivate) {
      return res.status(403).json({ message: 'You do not have permission to view this video' });
    }
    
    return res.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    return res.status(500).json({ message: 'Error fetching video' });
  }
});

// Delete a video
videoRoutes.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const videoId = parseInt(req.params.id);
    if (isNaN(videoId)) {
      return res.status(400).json({ message: 'Invalid video ID' });
    }
    
    const video = await storage.getVideo(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Check if user has permission to delete this video
    if (video.userId !== userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this video' });
    }
    
    // Delete the file from the file system
    const filePath = path.join(process.cwd(), video.filePath.replace(/^\//, ''));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete thumbnail if it exists
    if (video.thumbnailPath) {
      const thumbnailPath = path.join(process.cwd(), video.thumbnailPath.replace(/^\//, ''));
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }
    
    // Delete from database
    await storage.deleteVideo(videoId);
    
    return res.json({ 
      success: true,
      message: 'Video deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    return res.status(500).json({ message: 'Error deleting video' });
  }
});

export default videoRoutes;