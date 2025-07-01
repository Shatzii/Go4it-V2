import { Router } from 'express';
import { getAnalytics, uploadVideo, calculateEligibility } from '../controllers';

const router = Router();

// Route for getting analytics
router.get('/analytics', getAnalytics);

// Route for uploading video
router.post('/upload', uploadVideo);

// Route for calculating NCAA eligibility
router.post('/eligibility', calculateEligibility);

export default router;