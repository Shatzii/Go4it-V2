import { Router, Request, Response } from 'express';
import { isAuthenticatedMiddleware } from '../middleware/auth-middleware';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Animation job storage (would be replaced with database in production)
interface AnimationJob {
  id: string;
  userId: number;
  title: string;
  type: 'story' | 'commercial';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  completedAt?: Date;
  outputUrl?: string;
  previewUrl?: string;
  error?: string;
  parameters: any;
}

// In-memory job storage (temporary, would use database in production)
const animationJobs: AnimationJob[] = [];

// Generate story animation endpoint
router.post('/generate/story', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
  try {
    const { text, style, sportType, duration, quality } = req.body;
    
    // Validate inputs
    if (!text || !style || !sportType || !duration || !quality) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    
    // Create job entry
    const jobId = uuidv4();
    const newJob: AnimationJob = {
      id: jobId,
      userId: req.user?.id || 0,
      title: text.split('.')[0] || 'New Story',
      type: 'story',
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      parameters: { text, style, sportType, duration, quality },
      previewUrl: `/images/previews/${style.toLowerCase()}_${sportType.toLowerCase()}.jpg`
    };
    
    // Save job
    animationJobs.push(newJob);
    
    // Start processing (simulated for now)
    setTimeout(() => processAnimationJob(jobId), 500);
    
    return res.status(201).json({ 
      message: 'Animation job created successfully', 
      jobId: jobId
    });
    
  } catch (error) {
    console.error('Error generating story animation:', error);
    return res.status(500).json({ message: 'Error generating animation' });
  }
});

// Generate commercial animation endpoint
router.post('/generate/commercial', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
  try {
    const { productName, tagline, description, sportType, duration, quality, callToAction } = req.body;
    
    // Validate inputs
    if (!productName || !description || !sportType || !duration || !quality) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    
    // Create job entry
    const jobId = uuidv4();
    const newJob: AnimationJob = {
      id: jobId,
      userId: req.user?.id || 0,
      title: `${productName} Commercial`,
      type: 'commercial',
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      parameters: { productName, tagline, description, sportType, duration, quality, callToAction },
      previewUrl: `/images/previews/commercial_${sportType.toLowerCase()}.jpg`
    };
    
    // Save job
    animationJobs.push(newJob);
    
    // Start processing (simulated for now)
    setTimeout(() => processAnimationJob(jobId), 500);
    
    return res.status(201).json({ 
      message: 'Commercial animation job created successfully', 
      jobId: jobId
    });
    
  } catch (error) {
    console.error('Error generating commercial animation:', error);
    return res.status(500).json({ message: 'Error generating animation' });
  }
});

// Get all animation jobs for the current user
router.get('/jobs', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
  try {
    const userJobs = animationJobs.filter(job => job.userId === req.user?.id || 0);
    return res.status(200).json(userJobs);
  } catch (error) {
    console.error('Error fetching animation jobs:', error);
    return res.status(500).json({ message: 'Error fetching animation jobs' });
  }
});

// Debug endpoint to get all animation jobs (admin only)
router.get('/debug/jobs', async (req: Request, res: Response) => {
  // In production, this would have proper admin authentication
  try {
    console.log('Current animation jobs:', animationJobs);
    return res.status(200).json({
      count: animationJobs.length,
      jobs: animationJobs
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    return res.status(500).json({ message: 'Error in debug endpoint' });
  }
});

// Debug endpoint to clear all animation jobs
router.delete('/debug/jobs', async (req: Request, res: Response) => {
  try {
    const count = animationJobs.length;
    animationJobs.length = 0;
    console.log('Cleared all animation jobs');
    return res.status(200).json({ 
      message: 'Successfully cleared all animation jobs',
      count
    });
  } catch (error) {
    console.error('Error clearing animation jobs:', error);
    return res.status(500).json({ message: 'Error clearing animation jobs' });
  }
});

// Get a specific animation job
router.get('/jobs/:jobId', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
  try {
    const job = animationJobs.find(j => j.id === req.params.jobId && j.userId === req.user?.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Animation job not found' });
    }
    
    return res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching animation job:', error);
    return res.status(500).json({ message: 'Error fetching animation job' });
  }
});

// Create a test job (for debugging without authentication)
router.post('/debug/create-test-job', async (req: Request, res: Response) => {
  try {
    // Create job entry
    const jobId = uuidv4();
    const newJob: AnimationJob = {
      id: jobId,
      userId: 1, // Default test user ID
      title: "Test Animation Job",
      type: 'story',
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      parameters: { 
        text: "Test story for basketball skills training", 
        style: "realistic", 
        sportType: "basketball", 
        duration: 30, 
        quality: "standard" 
      },
      previewUrl: `/images/previews/realistic_basketball.jpg`
    };
    
    // Save job
    animationJobs.push(newJob);
    
    // Start processing
    setTimeout(() => processAnimationJob(jobId), 500);
    
    return res.status(201).json({ 
      message: 'Test animation job created successfully', 
      jobId: jobId
    });
    
  } catch (error) {
    console.error('Error creating test job:', error);
    return res.status(500).json({ message: 'Error creating test job' });
  }
});

// Process an animation job (simulated for demonstration)
async function processAnimationJob(jobId: string) {
  const job = animationJobs.find(j => j.id === jobId);
  if (!job) return;
  
  // Update status to processing
  job.status = 'processing';
  
  // Simulate progress updates
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 10;
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      
      // Complete the job
      job.status = 'completed';
      job.progress = 100;
      job.completedAt = new Date();
      
      // Set output URL based on job type
      if (job.type === 'story') {
        job.outputUrl = `/videos/samples/story_sample_${job.parameters.sportType.toLowerCase()}.mp4`;
      } else {
        job.outputUrl = `/videos/samples/commercial_sample.mp4`;
      }
      
      console.log(`Job ${jobId} completed successfully`);
    } else {
      job.progress = Math.round(progress);
    }
  }, 1500);
}

export default router;