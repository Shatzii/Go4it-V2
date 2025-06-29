import express from 'express';
import { z } from 'zod';
import academicService from '../services/academic-service';
import { authSentinel } from '../middleware/auth-sentinel';
import {
  insertAcademicSubjectsSchema,
  insertAcademicCoursesSchema,
  insertCourseEnrollmentsSchema,
  insertAcademicAssignmentsSchema,
  insertAcademicTermsSchema,
  insertAdhdStudyStrategiesSchema,
  insertStudentStudyStrategiesSchema
} from '@shared/schema';

export const academicRouter = express.Router();

// Authentication middleware
academicRouter.use(authSentinel);

// Academic Subjects Routes
academicRouter.get('/subjects', async (req, res) => {
  try {
    const subjects = await academicService.getSubjects();
    return res.status(200).json(subjects);
  } catch (error) {
    console.error('Error fetching academic subjects:', error);
    return res.status(500).json({ message: 'Failed to fetch academic subjects' });
  }
});

academicRouter.get('/subjects/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid subject ID' });
    }
    
    const subject = await academicService.getSubjectById(id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    return res.status(200).json(subject);
  } catch (error) {
    console.error('Error fetching academic subject:', error);
    return res.status(500).json({ message: 'Failed to fetch academic subject' });
  }
});

academicRouter.post('/subjects', async (req, res) => {
  try {
    // Validate request body
    const validatedData = insertAcademicSubjectsSchema.parse(req.body);
    
    const subject = await academicService.createSubject(validatedData);
    return res.status(201).json(subject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid subject data', errors: error.errors });
    }
    console.error('Error creating academic subject:', error);
    return res.status(500).json({ message: 'Failed to create academic subject' });
  }
});

// Academic Courses Routes
academicRouter.get('/courses', async (req, res) => {
  try {
    const filters: {
      subjectId?: number;
      courseLevel?: string;
      gradeLevel?: number;
    } = {};
    
    if (req.query.subjectId) {
      filters.subjectId = parseInt(req.query.subjectId as string);
    }
    
    if (req.query.courseLevel) {
      filters.courseLevel = req.query.courseLevel as string;
    }
    
    if (req.query.gradeLevel) {
      filters.gradeLevel = parseInt(req.query.gradeLevel as string);
    }
    
    const courses = await academicService.getCourses(Object.keys(filters).length > 0 ? filters : undefined);
    return res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching academic courses:', error);
    return res.status(500).json({ message: 'Failed to fetch academic courses' });
  }
});

academicRouter.get('/courses/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }
    
    const course = await academicService.getCourseById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    return res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching academic course:', error);
    return res.status(500).json({ message: 'Failed to fetch academic course' });
  }
});

academicRouter.post('/courses', async (req, res) => {
  try {
    // Validate request body
    const validatedData = insertAcademicCoursesSchema.parse(req.body);
    
    const course = await academicService.createCourse(validatedData);
    return res.status(201).json(course);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid course data', errors: error.errors });
    }
    console.error('Error creating academic course:', error);
    return res.status(500).json({ message: 'Failed to create academic course' });
  }
});

// Course Enrollments Routes
academicRouter.get('/enrollments', async (req, res) => {
  try {
    // Get enrollments for the authenticated user
    const userId = req.user!.id;
    const enrollments = await academicService.getUserEnrollments(userId);
    return res.status(200).json(enrollments);
  } catch (error) {
    console.error('Error fetching course enrollments:', error);
    return res.status(500).json({ message: 'Failed to fetch course enrollments' });
  }
});

academicRouter.get('/enrollments/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid enrollment ID' });
    }
    
    const enrollment = await academicService.getEnrollmentById(id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    // Check if the enrollment belongs to the authenticated user
    if (enrollment.userId !== req.user!.id) {
      return res.status(403).json({ message: 'Unauthorized access to enrollment' });
    }
    
    return res.status(200).json(enrollment);
  } catch (error) {
    console.error('Error fetching course enrollment:', error);
    return res.status(500).json({ message: 'Failed to fetch course enrollment' });
  }
});

academicRouter.post('/enrollments', async (req, res) => {
  try {
    // Set userId to authenticated user
    const userId = req.user!.id;
    
    // Validate request body
    const validatedData = insertCourseEnrollmentsSchema.parse({
      ...req.body,
      userId
    });
    
    const enrollment = await academicService.createEnrollment(validatedData);
    return res.status(201).json(enrollment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid enrollment data', errors: error.errors });
    }
    console.error('Error creating course enrollment:', error);
    return res.status(500).json({ message: 'Failed to create course enrollment' });
  }
});

academicRouter.patch('/enrollments/:id/grade', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid enrollment ID' });
    }
    
    // Validate request body
    const schema = z.object({
      grade: z.string(),
      percentage: z.number().min(0).max(100)
    });
    
    const validatedData = schema.parse(req.body);
    
    // Check if the enrollment belongs to the authenticated user
    const enrollment = await academicService.getEnrollmentById(id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    if (enrollment.userId !== req.user!.id) {
      return res.status(403).json({ message: 'Unauthorized access to enrollment' });
    }
    
    const updatedEnrollment = await academicService.updateEnrollmentGrade(
      id,
      validatedData.grade,
      validatedData.percentage
    );
    
    return res.status(200).json(updatedEnrollment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid grade data', errors: error.errors });
    }
    console.error('Error updating enrollment grade:', error);
    return res.status(500).json({ message: 'Failed to update enrollment grade' });
  }
});

// Academic Assignments Routes
academicRouter.get('/enrollments/:enrollmentId/assignments', async (req, res) => {
  try {
    const enrollmentId = parseInt(req.params.enrollmentId);
    if (isNaN(enrollmentId)) {
      return res.status(400).json({ message: 'Invalid enrollment ID' });
    }
    
    // Check if the enrollment belongs to the authenticated user
    const enrollment = await academicService.getEnrollmentById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    if (enrollment.userId !== req.user!.id) {
      return res.status(403).json({ message: 'Unauthorized access to enrollment' });
    }
    
    const assignments = await academicService.getAssignmentsForEnrollment(enrollmentId);
    return res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return res.status(500).json({ message: 'Failed to fetch assignments' });
  }
});

academicRouter.post('/enrollments/:enrollmentId/assignments', async (req, res) => {
  try {
    const enrollmentId = parseInt(req.params.enrollmentId);
    if (isNaN(enrollmentId)) {
      return res.status(400).json({ message: 'Invalid enrollment ID' });
    }
    
    // Check if the enrollment belongs to the authenticated user
    const enrollment = await academicService.getEnrollmentById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    if (enrollment.userId !== req.user!.id) {
      return res.status(403).json({ message: 'Unauthorized access to enrollment' });
    }
    
    // Validate request body
    const validatedData = insertAcademicAssignmentsSchema.parse({
      ...req.body,
      courseEnrollmentId: enrollmentId
    });
    
    const assignment = await academicService.createAssignment(validatedData);
    return res.status(201).json(assignment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid assignment data', errors: error.errors });
    }
    console.error('Error creating assignment:', error);
    return res.status(500).json({ message: 'Failed to create assignment' });
  }
});

academicRouter.patch('/assignments/:id/grade', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid assignment ID' });
    }
    
    // Validate request body
    const schema = z.object({
      grade: z.string(),
      percentage: z.number().min(0).max(100)
    });
    
    const validatedData = schema.parse(req.body);
    
    // Need to get the assignment, then check enrollment, then check user
    const assignments = await academicService.getAssignmentsForEnrollment(id);
    if (assignments.length === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    const assignment = assignments[0];
    const enrollment = await academicService.getEnrollmentById(assignment.courseEnrollmentId);
    
    if (!enrollment || enrollment.userId !== req.user!.id) {
      return res.status(403).json({ message: 'Unauthorized access to assignment' });
    }
    
    const updatedAssignment = await academicService.updateAssignmentGrade(
      id,
      validatedData.grade,
      validatedData.percentage
    );
    
    return res.status(200).json(updatedAssignment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid grade data', errors: error.errors });
    }
    console.error('Error updating assignment grade:', error);
    return res.status(500).json({ message: 'Failed to update assignment grade' });
  }
});

// Academic Terms Routes
academicRouter.get('/terms', async (req, res) => {
  try {
    // Get terms for the authenticated user
    const userId = req.user!.id;
    const terms = await academicService.getUserTerms(userId);
    return res.status(200).json(terms);
  } catch (error) {
    console.error('Error fetching academic terms:', error);
    return res.status(500).json({ message: 'Failed to fetch academic terms' });
  }
});

academicRouter.post('/terms', async (req, res) => {
  try {
    // Set userId to authenticated user
    const userId = req.user!.id;
    
    // Validate request body
    const validatedData = insertAcademicTermsSchema.parse({
      ...req.body,
      userId
    });
    
    const term = await academicService.createTerm(validatedData);
    return res.status(201).json(term);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid term data', errors: error.errors });
    }
    console.error('Error creating academic term:', error);
    return res.status(500).json({ message: 'Failed to create academic term' });
  }
});

// ADHD Study Strategies Routes
academicRouter.get('/study-strategies', async (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const strategies = await academicService.getStudyStrategies(category);
    return res.status(200).json(strategies);
  } catch (error) {
    console.error('Error fetching study strategies:', error);
    return res.status(500).json({ message: 'Failed to fetch study strategies' });
  }
});

academicRouter.post('/study-strategies', async (req, res) => {
  try {
    // Only admins can create study strategies
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create study strategies' });
    }
    
    // Validate request body
    const validatedData = insertAdhdStudyStrategiesSchema.parse(req.body);
    
    const strategy = await academicService.createStudyStrategy(validatedData);
    return res.status(201).json(strategy);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid strategy data', errors: error.errors });
    }
    console.error('Error creating study strategy:', error);
    return res.status(500).json({ message: 'Failed to create study strategy' });
  }
});

// Student Study Strategy Implementation Routes
academicRouter.get('/my-strategies', async (req, res) => {
  try {
    // Get strategies for the authenticated user
    const userId = req.user!.id;
    const strategies = await academicService.getUserStudyStrategies(userId);
    return res.status(200).json(strategies);
  } catch (error) {
    console.error('Error fetching user study strategies:', error);
    return res.status(500).json({ message: 'Failed to fetch user study strategies' });
  }
});

academicRouter.post('/my-strategies', async (req, res) => {
  try {
    // Set userId to authenticated user
    const userId = req.user!.id;
    
    // Validate request body
    const validatedData = insertStudentStudyStrategiesSchema.parse({
      ...req.body,
      userId
    });
    
    const strategy = await academicService.implementStudyStrategy(validatedData);
    return res.status(201).json(strategy);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid strategy implementation data', errors: error.errors });
    }
    console.error('Error implementing study strategy:', error);
    return res.status(500).json({ message: 'Failed to implement study strategy' });
  }
});

academicRouter.patch('/my-strategies/:id/effectiveness', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid strategy ID' });
    }
    
    // Validate request body
    const schema = z.object({
      effectiveness: z.number().min(0).max(10)
    });
    
    const validatedData = schema.parse(req.body);
    
    // Check if strategy belongs to user
    const userStrategies = await academicService.getUserStudyStrategies(req.user!.id);
    const strategy = userStrategies.find(s => s.id === id);
    
    if (!strategy) {
      return res.status(404).json({ message: 'Strategy not found or not owned by user' });
    }
    
    const updatedStrategy = await academicService.updateStudyStrategyEffectiveness(
      id,
      validatedData.effectiveness
    );
    
    return res.status(200).json(updatedStrategy);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid effectiveness data', errors: error.errors });
    }
    console.error('Error updating strategy effectiveness:', error);
    return res.status(500).json({ message: 'Failed to update strategy effectiveness' });
  }
});

// Academic Analytics Routes
academicRouter.get('/analytics', async (req, res) => {
  try {
    // Get analytics for the authenticated user
    const userId = req.user!.id;
    const analytics = await academicService.getUserAcademicAnalytics(userId);
    
    if (!analytics) {
      // If no analytics exist yet, generate initial analytics
      const newAnalytics = await academicService.updateAcademicAnalytics(userId);
      return res.status(200).json(newAnalytics);
    }
    
    return res.status(200).json(analytics);
  } catch (error) {
    console.error('Error fetching academic analytics:', error);
    return res.status(500).json({ message: 'Failed to fetch academic analytics' });
  }
});

academicRouter.post('/analytics/update', async (req, res) => {
  try {
    // Calculate and update analytics for the authenticated user
    const userId = req.user!.id;
    const analytics = await academicService.updateAcademicAnalytics(userId);
    return res.status(200).json(analytics);
  } catch (error) {
    console.error('Error updating academic analytics:', error);
    return res.status(500).json({ message: 'Failed to update academic analytics' });
  }
});

// Utility Routes
academicRouter.get('/gpa', async (req, res) => {
  try {
    // Calculate GPA for the authenticated user
    const userId = req.user!.id;
    const termName = req.query.term as string | undefined;
    
    const gpa = await academicService.calculateGPA(userId, termName);
    return res.status(200).json({ gpa });
  } catch (error) {
    console.error('Error calculating GPA:', error);
    return res.status(500).json({ message: 'Failed to calculate GPA' });
  }
});

export default academicRouter;