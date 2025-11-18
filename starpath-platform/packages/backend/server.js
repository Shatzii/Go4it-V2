const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const PROGRAMS = require('../shared/programs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'StarPath Platform API',
    timestamp: new Date().toISOString()
  });
});

// Get all programs
app.get('/api/programs', (req, res) => {
  res.json({
    success: true,
    programs: Object.values(PROGRAMS.PROGRAMS)
  });
});

// Get specific program
app.get('/api/programs/:programId', (req, res) => {
  const { programId } = req.params;
  const program = PROGRAMS.PROGRAMS[programId];
  
  if (!program) {
    return res.status(404).json({
      success: false,
      error: 'Program not found'
    });
  }
  
  res.json({
    success: true,
    program
  });
});

// Start assessment
app.post('/api/assessment/start', (req, res) => {
  const { firstName, lastName, email, sport, academicYear } = req.body;
  
  if (!firstName || !lastName || !email) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: firstName, lastName, email'
    });
  }
  
  // Generate assessment ID (in production, save to database)
  const assessmentId = `ASMT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  res.json({
    success: true,
    assessmentId,
    message: 'Assessment started successfully',
    data: {
      assessmentId,
      firstName,
      lastName,
      email,
      sport,
      academicYear,
      status: 'in_progress',
      createdAt: new Date().toISOString()
    }
  });
});

// Complete assessment
app.post('/api/assessment/complete', (req, res) => {
  const { assessmentId, responses } = req.body;
  
  if (!assessmentId || !responses) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: assessmentId, responses'
    });
  }
  
  // Calculate recommended program (simplified logic)
  let recommendedProgram = 'online_accelerator';
  
  if (responses.internationalInterest === 'high') {
    recommendedProgram = 'vienna_residency';
  }
  
  res.json({
    success: true,
    message: 'Assessment completed successfully',
    data: {
      assessmentId,
      status: 'completed',
      recommendedProgram,
      completedAt: new Date().toISOString(),
      nextSteps: [
        'Review your personalized pathway',
        'Schedule a call with our admissions team',
        'Apply for your recommended program'
      ]
    }
  });
});

// Submit application
app.post('/api/applications', (req, res) => {
  const { 
    firstName, 
    lastName, 
    email, 
    dateOfBirth,
    nationality,
    sport,
    position,
    programInterest,
    academicYear,
    parentEmail,
    goals,
    healthNeeds,
    neurodivergentSupport,
    housingNeed,
    timeline
  } = req.body;
  
  if (!firstName || !lastName || !email || !programInterest) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }
  
  const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  res.json({
    success: true,
    message: 'Application submitted successfully',
    data: {
      applicationId,
      status: 'pending_review',
      submittedAt: new Date().toISOString(),
      programInterest,
      nextSteps: [
        'Our admissions team will review your application within 48 hours',
        'You will receive an email confirmation at ' + email,
        'Schedule an interview call if needed'
      ]
    }
  });
});

// Get student profile (mock endpoint)
app.get('/api/students/:id/profile', (req, res) => {
  const { id } = req.params;
  
  // Mock student data
  res.json({
    success: true,
    student: {
      id,
      firstName: 'Sample',
      lastName: 'Student',
      email: 'student@example.com',
      sport: 'soccer',
      position: 'midfielder',
      academicYear: 'junior',
      program: 'online_accelerator',
      garScore: 75,
      hdrPillars: {
        mental: 80,
        physical: 75,
        nutrition: 70,
        technical: 78,
        cultural: null,
        capstone: 'in_progress'
      },
      enrollmentDate: '2025-01-15',
      creditsEarned: 20,
      targetGraduation: '2026-05-30'
    }
  });
});

// Get GAR ranges
app.get('/api/gar/ranges', (req, res) => {
  res.json({
    success: true,
    ranges: PROGRAMS.GAR_RANGES
  });
});

// Get HDR pillars
app.get('/api/hdr/pillars', (req, res) => {
  res.json({
    success: true,
    pillars: PROGRAMS.HDR_PILLARS
  });
});

// Get NCAA requirements
app.get('/api/ncaa/requirements', (req, res) => {
  res.json({
    success: true,
    requirements: PROGRAMS.NCAA_REQUIREMENTS
  });
});

// Get contact info
app.get('/api/contact', (req, res) => {
  res.json({
    success: true,
    contact: PROGRAMS.CONTACT_INFO,
    locations: PROGRAMS.LOCATIONS
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 StarPath Platform API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 Programs: http://localhost:${PORT}/api/programs\n`);
});
