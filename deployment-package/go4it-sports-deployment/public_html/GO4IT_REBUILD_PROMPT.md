# Go4It Sports Platform - Complete Rebuild Specification

## Project Overview
Build an advanced AI-enhanced sports analytics platform for neurodivergent student athletes (ages 12-18), with focus on ADHD-friendly design. The platform serves three primary user groups: **Student Athletes** (primary), **Coaches**, and **Parents**.

## Core Technology Stack
- **Frontend**: Next.js 15 with TypeScript + React
- **Styling**: Tailwind CSS with dark theme (slate-900 base)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Simple username/password (no external auth)
- **AI Integration**: Self-hosted models (no OpenAI dependency)
- **Deployment**: Replit-optimized

## Essential Features to Build

### 1. GAR Analytics System (Priority 1)
**Game Analysis Rating - Core scoring engine**
- Video upload and analysis interface
- AI-powered performance scoring (0-100 scale)
- Skill breakdown analysis (speed, accuracy, decision-making)
- Performance trend tracking over time
- Downloadable reports for coaches/parents

### 2. StarPath Skill Development (Priority 1)
**Interactive progression system**
- Skill tree visualization with unlock progression
- XP points system for completed drills/activities
- Achievement badges and milestone rewards
- Personalized drill recommendations
- Progress tracking dashboard

### 3. User Dashboard (Priority 2)
**Role-based interfaces**
- Student Athlete: GAR scores, StarPath progress, upcoming goals
- Coach: Team overview, individual player analytics, assignment tools
- Parent: Child's progress summary, academic tracking, coach communications

### 4. Video Analysis Interface (Priority 2)
- Drag-and-drop video upload
- AI processing status indicators
- Frame-by-frame analysis tools
- Annotation and markup features
- Comparison tools (before/after videos)

### 5. Academic Progress Tracking (Priority 3)
- NCAA eligibility monitoring
- GPA tracking and course management
- Academic goal setting
- Progress alerts and notifications

## Technical Implementation Requirements

### Database Schema (PostgreSQL)
```sql
-- Users table
users (id, username, password_hash, email, role, created_at)

-- GAR Scores table
gar_scores (id, user_id, video_id, overall_score, skill_breakdown, created_at)

-- StarPath Progress table
starpath_progress (id, user_id, skill_id, xp_points, level, unlocked_at)

-- Videos table
videos (id, user_id, filename, analysis_status, upload_date, gar_score_id)

-- Academic Records table
academic_records (id, user_id, gpa, courses, ncaa_eligible, updated_at)
```

### File Structure
```
/app
  /page.tsx (Homepage)
  /dashboard/page.tsx (Main dashboard)
  /gar-analysis/page.tsx (GAR scoring interface)
  /starpath/page.tsx (Skill development)
  /video-upload/page.tsx (Video upload interface)
  /profile/page.tsx (User profile management)
  /layout.tsx (Root layout)
  /globals.css (Tailwind styles)

/components
  /ui/ (Reusable UI components)
  /gar/ (GAR-specific components)
  /starpath/ (StarPath components)

/lib
  /db.ts (Database connection)
  /ai-analysis.ts (AI processing logic)
  /auth.ts (Authentication helpers)

/server
  /api/ (API routes for data operations)
```

### Key Features Implementation

#### GAR Analytics Engine
- **Input**: Video files (MP4, MOV formats)
- **Processing**: Frame analysis, movement tracking, skill assessment
- **Output**: Numerical score (0-100) + detailed breakdown
- **Storage**: Scores linked to user profiles with historical tracking

#### StarPath System
- **Skill Trees**: Sport-specific progression paths
- **XP Calculation**: Points based on drill completion, GAR improvements
- **Unlocks**: New drills/features based on skill level achievement
- **Visualization**: Interactive tree interface with progress indicators

#### User Authentication
- Simple username/password system
- Role-based access (Student/Coach/Parent)
- Session management without external dependencies
- Default admin credentials: username "admin", password "MyTime$$"

## UI/UX Requirements

### Design Principles
- **Neurodivergent-Friendly**: Clear navigation, consistent layouts, minimal cognitive load
- **Mobile-First**: Responsive design optimized for phone/tablet usage
- **Dark Theme**: Slate-900 background with high contrast text
- **Visual Hierarchy**: Clear information architecture with intuitive flow

### Color Scheme
- **Primary**: Blue (#3B82F6) for actions and highlights
- **Secondary**: Purple (#8B5CF6) for StarPath elements
- **Success**: Green (#10B981) for achievements and positive metrics
- **Warning**: Orange (#F59E0B) for alerts and attention items
- **Background**: Slate-900 (#0F172A) with slate-800 (#1E293B) for cards

### Navigation Structure
```
Header: Logo | Dashboard | GAR Analysis | StarPath | Profile
Main Content Area: Role-specific dashboard content
Sidebar: Quick stats, recent activity, notifications
```

## Performance Requirements
- **Page Load**: Under 2 seconds on mobile
- **Video Processing**: Status indicators during AI analysis
- **Database Queries**: Optimized for real-time dashboard updates
- **Mobile Responsive**: Touch-friendly interface elements

## Integration Points
- **Database**: PostgreSQL with connection pooling
- **File Storage**: Local file system with organized directory structure
- **AI Processing**: Self-hosted models for video analysis
- **Real-time Updates**: WebSocket connections for live data updates

## Success Metrics
- **Active Users**: 711 athlete scouts, 395 transfer portal monitors
- **Core Usage**: GAR analysis and StarPath progression tracking
- **User Retention**: Engagement through gamified skill development
- **Academic Tracking**: NCAA eligibility compliance monitoring

## Deployment Configuration
- **Platform**: Replit-optimized setup
- **Port**: 3000 for Next.js application
- **Environment**: Production-ready with proper error handling
- **Database**: PostgreSQL with proper connection management
- **File Uploads**: Secure handling of video files with size limits

## Build Instructions
1. Initialize Next.js project with TypeScript
2. Install dependencies: Tailwind CSS, Drizzle ORM, PostgreSQL client
3. Set up database connection and schema
4. Implement authentication system
5. Build core GAR and StarPath features
6. Create responsive UI components
7. Set up API routes for data operations
8. Test and optimize for Replit deployment

This specification provides everything needed to rebuild the Go4It Sports platform from scratch in a clean, organized manner focused on the three core user groups and two primary features (GAR Analytics and StarPath).