import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { z } from 'zod';

const router = Router();

/**
 * Get academic standards for a specific state
 */
router.get('/standards', async (req: Request, res: Response) => {
  try {
    const stateCode = req.query.stateCode as string;
    const subject = req.query.subject as string | undefined;
    const gradeLevel = req.query.gradeLevel as string | undefined;
    
    if (!stateCode) {
      return res.status(400).json({ message: 'State code is required' });
    }
    
    const standards = await storage.getStateStandards(stateCode, subject, gradeLevel);
    
    res.json(standards);
  } catch (error) {
    console.error('Error fetching standards:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to get standards' 
    });
  }
});

/**
 * Create a new academic standard
 */
router.post('/standards', async (req: Request, res: Response) => {
  try {
    const standard = req.body;
    
    // Validate required fields
    if (!standard.stateCode || !standard.code || !standard.subject || !standard.description) {
      return res.status(400).json({ 
        message: 'Required fields: stateCode, code, subject, description' 
      });
    }
    
    const newStandard = await storage.createStateStandard(standard);
    
    // Log activity
    await storage.logActivity({
      userId: req.body.userId || 1, // Default to admin user if not specified
      action: 'created_standard',
      details: `Created new standard: ${standard.code}`
    });
    
    res.status(201).json(newStandard);
  } catch (error) {
    console.error('Error creating standard:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to create standard' 
    });
  }
});

/**
 * Get learning objectives for a standard
 */
router.get('/standards/:standardId/objectives', async (req: Request, res: Response) => {
  try {
    const standardId = parseInt(req.params.standardId);
    
    if (isNaN(standardId)) {
      return res.status(400).json({ message: 'Valid standard ID is required' });
    }
    
    const objectives = await storage.getLearningObjectives(standardId);
    
    res.json(objectives);
  } catch (error) {
    console.error('Error fetching learning objectives:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to get learning objectives' 
    });
  }
});

/**
 * Create a new learning objective
 */
router.post('/objectives', async (req: Request, res: Response) => {
  try {
    const objective = req.body;
    
    // Validate required fields
    if (!objective.standardId || !objective.description) {
      return res.status(400).json({ 
        message: 'Required fields: standardId, description' 
      });
    }
    
    const newObjective = await storage.createLearningObjective(objective);
    
    // Log activity
    await storage.logActivity({
      userId: req.body.userId || 1,
      action: 'created_objective',
      details: `Created new learning objective for standard ID: ${objective.standardId}`
    });
    
    res.status(201).json(newObjective);
  } catch (error) {
    console.error('Error creating learning objective:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to create learning objective' 
    });
  }
});

/**
 * Get lesson plans
 */
router.get('/lesson-plans', async (req: Request, res: Response) => {
  try {
    const filters = {
      subject: req.query.subject as string | undefined,
      gradeLevel: req.query.gradeLevel as string | undefined,
      authorId: req.query.authorId ? parseInt(req.query.authorId as string) : undefined,
      visibility: req.query.visibility as string | undefined
    };
    
    const lessonPlans = await storage.getLessonPlans(filters);
    
    res.json(lessonPlans);
  } catch (error) {
    console.error('Error fetching lesson plans:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to get lesson plans' 
    });
  }
});

/**
 * Create a new lesson plan
 */
router.post('/lesson-plans', async (req: Request, res: Response) => {
  try {
    const lessonPlan = req.body;
    
    // Validate required fields
    if (!lessonPlan.title || !lessonPlan.subject || !lessonPlan.gradeLevel) {
      return res.status(400).json({ 
        message: 'Required fields: title, subject, gradeLevel' 
      });
    }
    
    const newLessonPlan = await storage.createLessonPlan(lessonPlan);
    
    // Log activity
    await storage.logActivity({
      userId: req.body.userId || 1,
      action: 'created_lesson_plan',
      details: `Created new lesson plan: ${lessonPlan.title}`
    });
    
    res.status(201).json(newLessonPlan);
  } catch (error) {
    console.error('Error creating lesson plan:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to create lesson plan' 
    });
  }
});

/**
 * Get academic units
 */
router.get('/units', async (req: Request, res: Response) => {
  try {
    const filters = {
      subject: req.query.subject as string | undefined,
      gradeLevel: req.query.gradeLevel as string | undefined,
      authorId: req.query.authorId ? parseInt(req.query.authorId as string) : undefined
    };
    
    const units = await storage.getAcademicUnits(filters);
    
    res.json(units);
  } catch (error) {
    console.error('Error fetching academic units:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to get academic units' 
    });
  }
});

/**
 * Create a new academic unit
 */
router.post('/units', async (req: Request, res: Response) => {
  try {
    const unit = req.body;
    
    // Validate required fields
    if (!unit.title || !unit.subject || !unit.gradeLevel) {
      return res.status(400).json({ 
        message: 'Required fields: title, subject, gradeLevel' 
      });
    }
    
    const newUnit = await storage.createAcademicUnit(unit);
    
    // Log activity
    await storage.logActivity({
      userId: req.body.userId || 1,
      action: 'created_academic_unit',
      details: `Created new academic unit: ${unit.title}`
    });
    
    res.status(201).json(newUnit);
  } catch (error) {
    console.error('Error creating academic unit:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to create academic unit' 
    });
  }
});

/**
 * Get neurodivergent profiles
 */
router.get('/profiles', async (req: Request, res: Response) => {
  try {
    const type = req.query.type as string | undefined;
    
    const profiles = await storage.getNeurodivergentProfiles(type);
    
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching neurodivergent profiles:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to get neurodivergent profiles' 
    });
  }
});

/**
 * Create or update a neurodivergent profile
 */
router.post('/profiles', async (req: Request, res: Response) => {
  try {
    const profile = req.body;
    
    // Validate required fields
    if (!profile.studentId || !profile.type) {
      return res.status(400).json({ 
        message: 'Required fields: studentId, type' 
      });
    }
    
    const savedProfile = await storage.saveNeurodivergentProfile(profile);
    
    // Log activity
    await storage.logActivity({
      userId: req.body.userId || 1,
      action: profile.id ? 'updated_profile' : 'created_profile',
      details: `${profile.id ? 'Updated' : 'Created'} neurodivergent profile for student ID: ${profile.studentId}`
    });
    
    res.status(profile.id ? 200 : 201).json(savedProfile);
  } catch (error) {
    console.error('Error saving neurodivergent profile:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to save neurodivergent profile' 
    });
  }
});

/**
 * Get profiles for a specific student
 */
router.get('/students/:studentId/profiles', async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.params.studentId);
    
    if (isNaN(studentId)) {
      return res.status(400).json({ message: 'Valid student ID is required' });
    }
    
    const profiles = await storage.getNeurodivergentProfiles();
    const studentProfiles = profiles.filter(profile => profile.studentId === studentId);
    
    res.json(studentProfiles);
  } catch (error) {
    console.error('Error fetching student profiles:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to get student profiles' 
    });
  }
});

/**
 * Get curriculum paths for a student
 */
router.get('/students/:studentId/curriculum-paths', async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.params.studentId);
    
    if (isNaN(studentId)) {
      return res.status(400).json({ message: 'Valid student ID is required' });
    }
    
    const paths = await storage.getCurriculumPaths(studentId);
    
    res.json(paths);
  } catch (error) {
    console.error('Error fetching curriculum paths:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to get curriculum paths' 
    });
  }
});

/**
 * Create a new curriculum path
 */
router.post('/curriculum-paths', async (req: Request, res: Response) => {
  try {
    const path = req.body;
    
    // Validate required fields
    if (!path.studentId || !path.name || !path.description) {
      return res.status(400).json({ 
        message: 'Required fields: studentId, name, description' 
      });
    }
    
    const newPath = await storage.createCurriculumPath(path);
    
    // Log activity
    await storage.logActivity({
      userId: req.body.userId || 1,
      action: 'created_curriculum_path',
      details: `Created new curriculum path: ${path.name} for student ID: ${path.studentId}`
    });
    
    res.status(201).json(newPath);
  } catch (error) {
    console.error('Error creating curriculum path:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to create curriculum path' 
    });
  }
});

/**
 * Search across standards, lesson plans, and units
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    // Get all data that we need to search through
    const [standards, lessonPlans, units] = await Promise.all([
      storage.getStateStandards(''), // Empty string to get all standards
      storage.getLessonPlans(),
      storage.getAcademicUnits()
    ]);
    
    // Simple search implementation - could be improved with more sophisticated search algorithms
    const results = {
      standards: standards.filter(s => 
        s.description.toLowerCase().includes(query.toLowerCase()) || 
        s.code.toLowerCase().includes(query.toLowerCase())
      ),
      lessonPlans: lessonPlans.filter(lp => 
        lp.title.toLowerCase().includes(query.toLowerCase()) || 
        (lp.description && lp.description.toLowerCase().includes(query.toLowerCase()))
      ),
      units: units.filter(u => 
        u.title.toLowerCase().includes(query.toLowerCase()) || 
        (u.description && u.description.toLowerCase().includes(query.toLowerCase()))
      )
    };
    
    res.json(results);
  } catch (error) {
    console.error('Error searching curriculum:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to search curriculum' 
    });
  }
});

export default router;