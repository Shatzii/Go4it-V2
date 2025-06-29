# Go4It Sports Platform - Complete Build Prompt for GitHub Copilot

## Project Overview
Build a comprehensive sports analytics platform designed for neurodivergent student athletes aged 12-18, particularly those with ADHD. The platform combines video analysis, skill progression tracking, AI coaching, and recruitment tools.

## Tech Stack
- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Node.js with Express.js API routes
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Custom JWT-based system with bcryptjs
- **AI Integration**: OpenAI and Anthropic APIs with fallback support
- **Styling**: Dark theme optimized for ADHD users

## 10 Core Features to Implement

### 1. Go4It Teams Management System
Create comprehensive team management for 4 sports:
- **Flag Football**: Positions (QB, RB, WR, DB), playbook management, game strategies
- **Soccer**: Positions (GK, DF, MF, FW), formation tracking, tactical analysis
- **Basketball**: Positions (PG, SG, SF, PF, C), play calling, court positioning
- **Track & Field**: Events (sprints, distance, field events), performance metrics

**Components Needed:**
```typescript
// app/teams/page.tsx - Main teams dashboard
// app/teams/[sport]/page.tsx - Sport-specific management
// app/teams/[sport]/roster/page.tsx - Roster management
// app/teams/[sport]/analytics/page.tsx - Team analytics
// components/teams/TeamCard.tsx
// components/teams/RosterManager.tsx
// components/teams/SportSpecificDashboard.tsx
```

### 2. Real-Time Performance Tracking
Implement live monitoring system:
- Heart rate monitoring integration
- Instant feedback during activities
- Personalized ADHD attention zones
- Live performance graphs and metrics

### 3. Advanced AI Coaching with Emotional Intelligence
Create AI coaching system:
- Multiple AI provider support (OpenAI/Anthropic)
- Emotion-aware responses for ADHD users
- Personalized coaching recommendations
- Mock AI responses for development

### 4. Mobile Video Recording Tools
Build video analysis system:
- Drag-and-drop video upload
- GAR (Growth and Ability Rating) scoring (0-100 scale)
- Frame-by-frame analysis
- Before/after comparison tools
- Instant AI-powered feedback

### 5. Enhanced Gamified Achievement System
Implement comprehensive gamification:
- XP-based progression system
- Unlockable achievement badges
- Skill tree progression (StarPath system)
- Milestone rewards and recognition
- Leaderboards and competitions

### 6. Comprehensive Communication Hub
Create communication system:
- Coach-athlete messaging
- Parent notification system
- Team announcements
- Progress sharing tools
- Real-time chat functionality

### 7. Academic Integration Expansion
Build academic tracking:
- NCAA eligibility monitoring
- GPA tracking and alerts
- Course planning assistance
- Academic milestone tracking
- College recruitment timeline

### 8. Advanced Accessibility Features
Implement ADHD-friendly design:
- Dark theme with high contrast
- Focus indicators and visual cues
- Simplified navigation patterns
- Attention-friendly layouts
- Screen reader compatibility

### 9. Performance Insights Dashboard
Create analytics dashboard:
- Comprehensive performance metrics
- Progress visualization charts
- Trend analysis and predictions
- Comparative performance data
- Personalized insights

### 10. Team Collaboration Tools
Build collaboration features:
- Shared resource libraries
- Team calendars and scheduling
- Group training sessions
- Collaborative goal setting
- Team communication channels

## Database Schema (Drizzle ORM)

```typescript
// shared/schema.ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).default('athlete'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  sport: varchar('sport', { length: 50 }).notNull(),
  coachId: integer('coach_id').references(() => users.id),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const garAnalysis = pgTable('gar_analysis', {
  id: serial('id').primaryKey(),
  athleteId: integer('athlete_id').references(() => users.id),
  videoUrl: varchar('video_url', { length: 255 }),
  garScore: integer('gar_score'),
  analysisData: json('analysis_data'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description'),
  xpValue: integer('xp_value').default(0),
  unlockedAt: timestamp('unlocked_at').defaultNow(),
});

export const skillTrees = pgTable('skill_trees', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  sport: varchar('sport', { length: 50 }).notNull(),
  skillData: json('skill_data'),
  totalXp: integer('total_xp').default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

## API Routes Structure

```typescript
// app/api/auth/login/route.ts - Authentication
// app/api/auth/register/route.ts - User registration
// app/api/teams/route.ts - Team CRUD operations
// app/api/teams/[id]/route.ts - Individual team management
// app/api/gar/analyze/route.ts - Video analysis
// app/api/achievements/route.ts - Achievement system
// app/api/performance/route.ts - Performance tracking
// app/api/ai/coaching/route.ts - AI coaching responses
```

## Key Components Architecture

### Main Layout
```typescript
// app/layout.tsx - Root layout with dark theme
// app/page.tsx - Dashboard homepage
// app/dashboard/page.tsx - Main user dashboard
```

### Team Management
```typescript
// app/teams/page.tsx - Teams overview
// app/teams/[sport]/page.tsx - Sport-specific management
// components/teams/TeamCard.tsx - Individual team cards
// components/teams/RosterManager.tsx - Roster management
// components/teams/SportDashboard.tsx - Sport-specific dashboard
```

### Video Analysis (GAR System)
```typescript
// app/gar/page.tsx - Video upload and analysis
// app/gar/analysis/[id]/page.tsx - Individual analysis view
// components/gar/VideoUploader.tsx - Drag-and-drop uploader
// components/gar/AnalysisDisplay.tsx - Analysis results
// components/gar/ScoreDisplay.tsx - GAR score visualization
```

### AI Coaching
```typescript
// app/coaching/page.tsx - AI coaching interface
// components/coaching/ChatInterface.tsx - Chat with AI coach
// components/coaching/EmotionalInsights.tsx - ADHD-aware responses
// lib/ai/coaching.ts - AI provider integration
```

## Authentication System
- Custom JWT implementation using jose library
- Bcryptjs for password hashing
- Role-based access control (athlete, coach, admin)
- Session management with secure cookies

## Styling Guidelines
- Dark theme (#0f172a background, #1e293b cards)
- High contrast for ADHD accessibility
- Tailwind CSS utility classes
- shadcn/ui components for consistency
- Responsive design for mobile/desktop

## Environment Variables Needed
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Admin Access
- Username: `admin`
- Password: `MyTime$$`

## Special Features
- GAR scoring algorithm (0-100 scale)
- StarPath skill progression system
- ADHD-optimized UI/UX patterns
- Multi-sport team management
- Real-time performance tracking
- Comprehensive achievement system

## Build Instructions
1. Initialize Next.js project with TypeScript
2. Install dependencies: drizzle-orm, @neondatabase/serverless, jose, bcryptjs, lucide-react, tailwindcss
3. Set up database schema with Drizzle
4. Implement authentication system
5. Build team management features for all 4 sports
6. Create video analysis system with GAR scoring
7. Implement AI coaching with emotional intelligence
8. Add gamification and achievement systems
9. Build performance tracking dashboard
10. Implement accessibility features for neurodivergent users

This platform serves as a comprehensive solution for neurodivergent student athletes, combining sports analytics, team management, AI coaching, and academic tracking in one cohesive system.