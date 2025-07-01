import { Router, Request, Response } from 'express';
import { curriculumLibraryService } from '../services/curriculum-library';
import { complianceAgentService } from '../services/compliance-agent';
import { storage } from '../storage';

const router = Router();

/**
 * Initialize the curriculum library with core content
 */
router.post('/library/initialize', async (req: Request, res: Response) => {
  try {
    await curriculumLibraryService.initializeLibrary();
    res.json({ success: true, message: 'Curriculum library initialized successfully' });
  } catch (error) {
    console.error('Error initializing curriculum library:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to initialize curriculum library' 
    });
  }
});

/**
 * Get education laws for a state
 */
router.get('/compliance/laws/:stateCode', async (req: Request, res: Response) => {
  try {
    const stateCode = req.params.stateCode.toUpperCase();
    const laws = await complianceAgentService.getStateEducationLaws(stateCode);
    res.json(laws);
  } catch (error) {
    console.error('Error fetching education laws:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to fetch education laws' 
    });
  }
});

/**
 * Get compliance notifications for a family
 */
router.get('/compliance/notifications/:familyId', async (req: Request, res: Response) => {
  try {
    const familyId = parseInt(req.params.familyId);
    
    if (isNaN(familyId)) {
      return res.status(400).json({ message: 'Valid family ID is required' });
    }
    
    const notifications = await complianceAgentService.getAllNotifications(familyId);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching compliance notifications:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to fetch compliance notifications' 
    });
  }
});

/**
 * Mark notification as read
 */
router.post('/compliance/notifications/:notificationId/read', async (req: Request, res: Response) => {
  try {
    const notificationId = parseInt(req.params.notificationId);
    
    if (isNaN(notificationId)) {
      return res.status(400).json({ message: 'Valid notification ID is required' });
    }
    
    const notification = await complianceAgentService.markNotificationAsRead(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to mark notification as read' 
    });
  }
});

/**
 * Check compliance for a student's curriculum
 */
router.get('/compliance/check/:studentId/:stateCode', async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.params.studentId);
    const stateCode = req.params.stateCode.toUpperCase();
    
    if (isNaN(studentId)) {
      return res.status(400).json({ message: 'Valid student ID is required' });
    }
    
    const complianceResult = await complianceAgentService.checkStudentCompliance(studentId, stateCode);
    res.json(complianceResult);
  } catch (error) {
    console.error('Error checking curriculum compliance:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to check curriculum compliance' 
    });
  }
});

/**
 * Generate a compliance notification for a family
 */
router.post('/compliance/notify', async (req: Request, res: Response) => {
  try {
    const { familyId, studentId, stateCode } = req.body;
    
    if (!familyId || !studentId || !stateCode) {
      return res.status(400).json({ 
        message: 'Family ID, student ID, and state code are required' 
      });
    }
    
    const notification = await complianceAgentService.generateComplianceNotification(
      parseInt(familyId),
      parseInt(studentId),
      stateCode.toUpperCase()
    );
    
    res.json(notification);
  } catch (error) {
    console.error('Error generating compliance notification:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to generate compliance notification' 
    });
  }
});

/**
 * Run compliance checks for all students
 */
router.post('/compliance/check-all', async (req: Request, res: Response) => {
  try {
    const notificationCount = await complianceAgentService.runComplianceChecks();
    res.json({ 
      success: true, 
      message: `Generated ${notificationCount} compliance notifications` 
    });
  } catch (error) {
    console.error('Error running compliance checks:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to run compliance checks' 
    });
  }
});

/**
 * Build a curriculum path for a student
 */
router.post('/paths/build', async (req: Request, res: Response) => {
  try {
    const { studentId, profileId, gradeLevel } = req.body;
    
    if (!studentId || !profileId || !gradeLevel) {
      return res.status(400).json({ 
        message: 'Student ID, profile ID, and grade level are required' 
      });
    }
    
    const curriculumPath = await curriculumLibraryService.buildCurriculumPath(
      parseInt(studentId),
      parseInt(profileId),
      gradeLevel
    );
    
    res.json(curriculumPath);
  } catch (error) {
    console.error('Error building curriculum path:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to build curriculum path' 
    });
  }
});

/**
 * Get neurodivergent profile templates
 */
router.get('/profiles/templates', async (req: Request, res: Response) => {
  try {
    const profiles = await storage.getNeurodivergentProfiles();
    const templates = profiles.filter(profile => profile.studentId === 0);
    res.json(templates);
  } catch (error) {
    console.error('Error fetching profile templates:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to fetch profile templates' 
    });
  }
});

/**
 * Create neurodivergent profile based on template
 */
router.post('/profiles/create-from-template', async (req: Request, res: Response) => {
  try {
    const { studentId, templateId, customizations } = req.body;
    
    if (!studentId || !templateId) {
      return res.status(400).json({ 
        message: 'Student ID and template ID are required' 
      });
    }
    
    // Get the template profile
    const profiles = await storage.getNeurodivergentProfiles();
    const template = profiles.find(p => p.id === parseInt(templateId));
    
    if (!template) {
      return res.status(404).json({ message: 'Template profile not found' });
    }
    
    // Create a new profile based on the template
    const newProfile = await storage.saveNeurodivergentProfile({
      ...template,
      id: undefined, // Remove ID so a new one is assigned
      studentId: parseInt(studentId),
      name: `${template.type} Profile for Student ${studentId}`,
      isTemplate: false,
      ...customizations
    });
    
    res.json(newProfile);
  } catch (error) {
    console.error('Error creating profile from template:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to create profile from template' 
    });
  }
});

export default router;