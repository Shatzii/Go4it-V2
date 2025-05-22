// Go4It Sports Production Server
// This server is designed for deployment to go4itsports.org
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Start timing for metrics
const startTime = Date.now();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files from the client/dist directory (for production builds)
app.use(express.static(path.join(__dirname, 'client/dist')));

// ==== API ROUTES ====

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: Math.floor((Date.now() - startTime) / 1000) + ' seconds',
    version: '1.0.0'
  });
});

// Mock user authentication API
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Sample users for testing
  const users = [
    { 
      id: 1, 
      username: 'alexjohnson', 
      password: 'password123', 
      name: 'Alex Johnson', 
      email: 'alex@example.com',
      role: 'athlete',
      profileImage: 'https://randomuser.me/api/portraits/men/32.jpg' 
    },
    { 
      id: 2, 
      username: 'coach', 
      password: 'coach123', 
      name: 'Coach Smith', 
      email: 'coach@example.com',
      role: 'coach',
      profileImage: 'https://randomuser.me/api/portraits/men/64.jpg' 
    },
    { 
      id: 3, 
      username: 'admin', 
      password: 'admin123', 
      name: 'Admin User', 
      email: 'admin@example.com',
      role: 'admin',
      profileImage: 'https://randomuser.me/api/portraits/women/58.jpg' 
    }
  ];
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // Don't send the password back
    const { password, ...userWithoutPassword } = user;
    res.json({ 
      success: true, 
      user: userWithoutPassword,
      token: 'fake-jwt-token-' + Math.random().toString(36).substring(2)
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

// Mock registration API
app.post('/api/auth/register', (req, res) => {
  const { username, password, name, email, role } = req.body;
  
  // In a real app, we would save this user to a database
  // For this demo, we just return a success response
  
  res.status(201).json({
    success: true,
    user: {
      id: Math.floor(Math.random() * 1000) + 10,
      username,
      name,
      email,
      role,
      profileImage: `https://randomuser.me/api/portraits/${role === 'athlete' ? 'men' : 'women'}/${Math.floor(Math.random() * 70)}.jpg`
    }
  });
});

// Mock user profile API
app.get('/api/user/:id', (req, res) => {
  // In a real app, we would fetch the user from a database
  res.json({
    id: req.params.id,
    username: 'alexjohnson',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'athlete',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    joinDate: '2025-01-15',
    school: 'Lincoln High School',
    gradYear: 2027,
    sports: ['Basketball', 'Track'],
    stats: {
      gamesPlayed: 28,
      averageGarScore: 76,
      improvementRate: 12,
      videosAnalyzed: 15
    }
  });
});

// Mock video upload API
app.post('/api/videos/upload', (req, res) => {
  // In a real app, we would handle file upload and storage
  setTimeout(() => {
    res.status(201).json({
      success: true,
      videoId: Math.floor(Math.random() * 1000) + 1,
      url: 'https://example.com/video/sample.mp4',
      message: 'Video uploaded successfully'
    });
  }, 2000); // Simulate upload time
});

// Mock video analysis API
app.post('/api/videos/analyze/:id', (req, res) => {
  // In a real app, we would process the video and generate analysis
  const videoId = req.params.id;
  
  // Simulate processing time
  setTimeout(() => {
    res.json({
      videoId,
      overallScore: Math.floor(Math.random() * 21) + 70, // 70-90
      physical: Math.floor(Math.random() * 21) + 70,
      technical: Math.floor(Math.random() * 21) + 65,
      tactical: Math.floor(Math.random() * 21) + 60,
      mental: Math.floor(Math.random() * 21) + 75,
      academicStatus: 'On Track',
      strengths: [
        "Excellent shooting form",
        "Good court awareness",
        "Strong defensive positioning",
        "Effective communication with teammates"
      ],
      improvements: [
        "Work on lateral movement speed",
        "Improve left-hand dribbling control",
        "Increase shooting consistency from mid-range",
        "Develop more explosive first step"
      ],
      insights: "Your shooting mechanics are solid, but there's room for improvement in your off-hand ball handling. Your defensive positioning is above average for your age group. The video shows good teamwork and communication skills. Focus on developing more explosiveness in your first step to create separation from defenders."
    });
  }, 5000); // Simulate analysis time
});

// Get user's videos
app.get('/api/videos/user/:userId', (req, res) => {
  // In a real app, we would fetch videos from a database
  res.json([
    {
      id: 1,
      title: "Game Highlights vs. Central High",
      date: "May 18, 2025",
      thumbnail: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500",
      duration: "4:25",
      views: 76,
      garScore: 83,
      sport: "Basketball"
    },
    {
      id: 2,
      title: "Practice Shooting Drills",
      date: "May 15, 2025",
      thumbnail: "https://images.unsplash.com/photo-1627627256672-027a4613d028?w=500",
      duration: "2:18",
      views: 42,
      garScore: 77,
      sport: "Basketball"
    },
    {
      id: 3,
      title: "Speed Training Session",
      date: "May 10, 2025",
      thumbnail: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=500",
      duration: "3:45",
      views: 31,
      garScore: 79,
      sport: "Track"
    }
  ]);
});

// Get NCAA eligibility status
app.get('/api/academics/:userId', (req, res) => {
  // In a real app, we would fetch academic data from a database
  res.json({
    gpa: 3.2,
    eligibilityStatus: "On Track",
    coreCoursesCompleted: 10,
    coreCoursesRequired: 16,
    satScore: 1120,
    actScore: 24,
    recentGrades: [
      { course: "English 2", grade: "B+", credits: 1.0, completed: true },
      { course: "Algebra II", grade: "B", credits: 1.0, completed: true },
      { course: "Biology", grade: "A-", credits: 1.0, completed: true },
      { course: "U.S. History", grade: "B+", credits: 1.0, completed: true },
      { course: "Spanish II", grade: "B", credits: 1.0, completed: true }
    ]
  });
});

// ==== CATCH-ALL ROUTE ====

// Always return index.html for any routes not matched by API routes
// This enables client-side routing
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'client/dist/index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application is being built. Please try again in a few minutes.');
  }
});

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
  const bootTime = Date.now() - startTime;
  console.log(`┌──────────────────────────────────────────┐`);
  console.log(`│  Go4It Sports Server                     │`);
  console.log(`├──────────────────────────────────────────┤`);
  console.log(`│  Server running on port: ${PORT}            │`);
  console.log(`│  Started in: ${bootTime}ms                   │`);
  console.log(`│  Environment: ${process.env.NODE_ENV || 'development'}               │`);
  console.log(`│  URL: http://localhost:${PORT}                 │`);
  console.log(`└──────────────────────────────────────────┘`);
});