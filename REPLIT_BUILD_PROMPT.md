# Go4It Sports Platform - Complete Build Prompt for Replit

## Project Overview
Build a comprehensive AI-powered sports analytics platform for neurodivergent student athletes aged 12-18. The platform combines advanced analytics, self-hosted AI video analysis, NCAA eligibility tracking, and gamified skill development with a focus on accessibility and neurodivergent-friendly design.

## Core Requirements

### Technology Stack
- **Frontend**: React 18 with TypeScript, Wouter routing, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js with TypeScript, PostgreSQL database, Drizzle ORM
- **Authentication**: Session-based authentication with admin/admin123 default credentials
- **Deployment**: Production-ready for go4itsports.org (IP: 167.235.128.41)
- **Process Management**: PM2 with cluster mode, Nginx reverse proxy, SSL/HTTPS

### Database Schema (shared/schema.ts)
Create comprehensive PostgreSQL schema with these tables:

1. **Users Table**: id, username, email, password (hashed), firstName, lastName, profileImageUrl, role, createdAt, updatedAt
2. **GAR Scores Table**: id, userId, videoId, overallScore, gameScore, athleticismScore, readinessScore, sport, createdAt
3. **StarPath Progress Table**: id, userId, skillId, skillName, currentXp, level, totalXp, createdAt, updatedAt
4. **Videos Table**: id, userId, filename, originalName, mimeType, size, analysisStatus, analysisResults, uploadedAt
5. **Academic Records Table**: id, userId, gpa, creditsCompleted, currentYear, satScore, actScore, eligibilityStatus, updatedAt
6. **Achievements Table**: id, userId, achievementId, title, description, earnedAt, category
7. **USA Football Memberships Table**: id, userId, membershipNumber, status, expiryDate, registeredAt
8. **CMS Content Table**: id, slug, title, content, type, status, metadata, createdAt, updatedAt
9. **CMS Menus Table**: id, title, items (JSON), location, isActive, displayOrder
10. **CMS Sports Table**: id, name, description, skills (JSON), drills (JSON), isActive, displayOrder
11. **CMS Achievements Table**: id, achievementId, title, description, requirements (JSON), rewards (JSON), category, isActive
12. **CMS Settings Table**: id, key, value, type, category, description, isPublic

### Key Features to Implement

#### 1. Authentication System
- Login/logout functionality with session management
- Admin dashboard access (admin/admin123)
- User profile management with avatar support
- Role-based access control (admin, user)

#### 2. GAR Analytics System
**Critical Requirement**: GAR scores MUST translate to 5-star ratings displayed with cyan/electric blue colors and dark backgrounds throughout ALL user profiles.

- Game, Athleticism, Readiness scoring (1-5 stars each)
- Overall GAR score calculation and display
- Support for 12+ sports: Soccer, Basketball, American Football, Tennis, Baseball, Golf, Swimming, Track & Field, Volleyball, Gymnastics, Wrestling, Ski Jumping
- Star rating visualization with cyan (#06b6d4) color scheme
- Historical score tracking and trend analysis

#### 3. StarPath Skill Development
- Gamified skill progression system with XP and levels
- Animated progress bars and skill trees
- Skills: Accuracy, Power, Speed, Agility, Endurance, Technique, Strategy, Mental Focus
- Achievement system with unlockable badges
- Visual progress tracking with animations

#### 4. Self-Hosted AI Video Analysis
- File upload system for video analysis (max 50MB)
- AI model integration (simulate 4 AI models):
  - MediaPipe Pose Detection
  - YOLO Sports Object Detection
  - OpenPose Advanced Analysis
  - Motion Pattern Classifier
- Analysis results display with performance insights
- Privacy-focused local processing simulation

#### 5. NCAA Eligibility Calculator
- GPA tracking and eligibility status
- Academic credit monitoring
- SAT/ACT score tracking
- Division I, II, III eligibility calculations
- Progress toward eligibility requirements
- Alert system for academic milestones

#### 6. USA Football Integration
- Official affiliate membership tracking
- Membership number and status display
- Registration and renewal management
- Certification tracking

#### 7. Content Management System (CMS)
- Admin interface for content editing without code changes
- Page and blog post management
- Sports configuration and drill library
- Achievement system management
- Platform settings and branding controls
- Menu and navigation management

#### 8. Admin Dashboard
- System overview with key metrics
- User management interface
- Content moderation tools
- Analytics and reporting
- Platform health monitoring
- CMS administration panel

### Design Requirements

#### Color Scheme
- **Primary**: Cyan/Electric Blue (#06b6d4, #0891b2, #0e7490)
- **Background**: Dark theme with black/gray backgrounds
- **Star Ratings**: Cyan stars on dark backgrounds
- **Accents**: Complementary blues and teals
- **Text**: High contrast white/light gray on dark

#### User Interface
- Neurodivergent-friendly design with clear navigation
- Consistent star rating system across all profiles
- Responsive design for mobile and desktop
- Accessible components with proper ARIA labels
- Smooth animations and transitions
- Clear visual hierarchy and typography

#### Navigation Structure
- Landing page with platform overview
- Dashboard (main user interface)
- GAR Analysis page with score visualization
- StarPath Skills development
- NCAA Eligibility tracking
- Profile management
- Admin dashboard (admin access only)
- CMS Admin panel (admin access only)

### Pages to Create (client/src/pages/)

1. **landing.tsx**: Marketing page with platform features, hero section, testimonials
2. **login.tsx**: Authentication form with admin/user login
3. **dashboard.tsx**: Main user dashboard with overview cards, recent activity
4. **gar-analysis.tsx**: GAR scoring interface with 5-star ratings, sport selection
5. **starpath.tsx**: Skill development with animated progress, XP tracking
6. **ncaa-eligibility.tsx**: Academic tracking, eligibility calculator, progress charts
7. **profile.tsx**: User profile management, avatar upload, personal stats
8. **admin-dashboard.tsx**: System administration, user management, analytics
9. **cms-admin.tsx**: Content management interface, sports config, settings
10. **advanced-features.tsx**: AI video analysis, USA Football integration
11. **usa-football.tsx**: Membership tracking, certification status
12. **not-found.tsx**: 404 error page with navigation options

### API Endpoints (server/routes.ts)

#### Authentication
- POST /api/auth/login - User authentication
- POST /api/auth/logout - Session termination
- GET /api/auth/user - Current user data
- POST /api/auth/register - New user registration

#### GAR Analytics
- GET /api/gar-scores - User's GAR score history
- POST /api/gar-scores - Submit new GAR assessment
- GET /api/gar-scores/stats - Score statistics and trends

#### StarPath System
- GET /api/starpath - User's skill progress
- POST /api/starpath/add-xp - Add XP to skills
- GET /api/starpath/achievements - Available achievements

#### Video Analysis
- POST /api/videos/upload - Upload video for analysis
- GET /api/videos - User's video history
- GET /api/videos/:id/analysis - Analysis results

#### Academic Tracking
- GET /api/academic - Academic records
- POST /api/academic - Update academic information
- GET /api/academic/eligibility - NCAA eligibility status

#### CMS System
- GET /api/cms/content - All content items
- POST /api/cms/content - Create content
- PUT /api/cms/content/:id - Update content
- DELETE /api/cms/content/:id - Delete content
- GET/POST/PUT /api/cms/sports - Sports management
- GET/POST/PUT /api/cms/settings - Platform settings

#### System Health
- GET /api/health - System status and health check

### Special Implementation Notes

#### Star Rating System
```typescript
// Critical: Implement consistent 5-star rating with cyan colors
const StarRating = ({ score, maxStars = 5 }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(maxStars)].map((_, i) => (
        <Star 
          key={i}
          className={`w-6 h-6 ${i < score ? 'text-cyan-400 fill-cyan-400' : 'text-gray-600'}`}
        />
      ))}
    </div>
  );
};
```

#### GAR Score Calculation
```typescript
// Overall GAR = (Game + Athleticism + Readiness) / 3
const calculateOverallGAR = (game: number, athleticism: number, readiness: number) => {
  return Math.round((game + athleticism + readiness) / 3);
};
```

#### Production Configuration
- Environment variables for go4itsports.org deployment
- PM2 ecosystem configuration with cluster mode
- Nginx configuration with SSL/HTTPS enforcement
- PostgreSQL production database setup
- Security headers and CORS configuration

### File Structure
```
/
├── client/src/
│   ├── components/ui/ (shadcn components)
│   ├── pages/ (all page components)
│   ├── hooks/ (custom React hooks)
│   ├── lib/ (utilities and API client)
│   └── App.tsx (main router)
├── server/
│   ├── routes.ts (API endpoints)
│   ├── storage.ts (database interface)
│   ├── auth.ts (authentication middleware)
│   ├── db.ts (database connection)
│   └── index.ts (server setup)
├── shared/
│   └── schema.ts (database schema and types)
├── ecosystem.config.js (PM2 configuration)
├── production.env (environment template)
├── DEPLOYMENT_GUIDE.md (deployment instructions)
└── package.json (dependencies and scripts)
```

### Dependencies Required
```json
{
  "dependencies": {
    "react", "react-dom", "wouter", "tailwindcss", 
    "@radix-ui/*", "lucide-react", "framer-motion",
    "express", "drizzle-orm", "@neondatabase/serverless",
    "bcrypt", "express-session", "multer", "cors",
    "@tanstack/react-query", "zod", "react-hook-form"
  }
}
```

### Testing Requirements
- All features must be functional with sample data
- GAR star ratings must appear consistently across all pages
- Admin login (admin/admin123) must provide full system access
- CMS system must allow content editing without code changes
- Video upload simulation with analysis results
- NCAA eligibility calculator with accurate scoring
- Responsive design testing on mobile and desktop

### Deployment Targets
- Primary: go4itsports.org (167.235.128.41)
- SSL/HTTPS required with automatic certificate renewal
- PM2 process management with cluster mode
- Nginx reverse proxy with static file serving
- PostgreSQL database with connection pooling

## Success Criteria
1. ✅ Complete platform with all 12 pages functional
2. ✅ GAR analytics with cyan star ratings on all profiles
3. ✅ Working admin dashboard with CMS capabilities
4. ✅ Self-hosted AI video analysis simulation
5. ✅ NCAA eligibility tracking with calculations
6. ✅ StarPath skill development with animations
7. ✅ Production-ready deployment configuration
8. ✅ Neurodivergent-friendly design with accessibility
9. ✅ Mobile-responsive interface
10. ✅ Security-hardened with authentication

Build this as a complete, production-ready platform that serves the neurodivergent student athlete community with cutting-edge sports analytics and skill development tools.