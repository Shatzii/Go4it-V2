# CodePilot Master Build Prompt - Go4It Sports Platform v2.0

## Project Overview
You are building the Go4It Sports platform - an advanced AI-enhanced sports analytics platform designed specifically for neurodivergent student athletes aged 12-18. This is a comprehensive rebuild using modern frameworks with operational backend infrastructure already established.

## Core Architecture

### Frontend Stack
- **Framework**: Next.js 14+ with App Router
- **UI Library**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with custom component library
- **Authentication**: Clerk for user management
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation

### Backend Infrastructure (Already Operational)
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI Services**: Claude (Anthropic) + OpenAI integration
- **Real-time**: WebSocket connections
- **Cache**: Enhanced in-memory cache system
- **Monitoring**: 711 active athlete scouts + 395 transfer portal monitors

## Key Platform Features to Build

### 1. Dashboard Hub
**File**: `app/dashboard/page.tsx`
```typescript
// Create comprehensive dashboard with:
- Real-time athlete performance metrics
- StarPath progression overview
- Video analysis queue status
- Academic progress tracking
- Recent achievements and notifications
- Quick action buttons for common tasks
```

### 2. StarPath Interactive System
**File**: `app/starpath/page.tsx`
```typescript
// Build interactive skill tree with:
- Visual skill node network with SVG/Canvas
- Real-time XP progression and leveling
- Achievement unlock animations
- Skill recommendations based on position
- Progress tracking across multiple sports
- Parent/coach visibility controls
```

### 3. Video Analysis Portal
**File**: `app/video-analysis/page.tsx`
```typescript
// Comprehensive video analysis with:
- Drag & drop video upload interface
- Real-time GAR scoring display
- AI-powered highlight generation
- Frame-by-frame analysis tools
- Performance comparison features
- Export and sharing capabilities
```

### 4. Academic Progress Tracker
**File**: `app/academics/page.tsx`
```typescript
// NCAA compliance monitoring with:
- GPA tracking and visualization
- Course requirement checklist
- Eligibility status indicators
- Academic milestone tracking
- College recruitment preparation
- Scholarship opportunity alerts
```

### 5. Profile Management
**File**: `app/profile/page.tsx`
```typescript
// Comprehensive athlete profiles with:
- Multi-sport capability tracking
- Physical metrics and measurements
- Performance statistics dashboard
- Media gallery management
- Contact information for scouts
- Privacy and visibility settings
```

### 6. Recruitment Hub
**File**: `app/recruitment/page.tsx`
```typescript
// College recruitment features with:
- Active scout monitoring (711 scouts)
- Transfer portal tracking (395 monitors)
- College interest tracking
- Scholarship opportunity dashboard
- Communication log with coaches
- Recruitment timeline management
```

### 7. AI Coaching Interface
**File**: `app/coaching/page.tsx`
```typescript
// AI-powered coaching with:
- Personalized training recommendations
- Performance analysis insights
- Skill development suggestions
- Injury prevention guidance
- Mental health and focus support
- Progress celebration and motivation
```

## Component Architecture

### Core Components
```typescript
// components/ui/ - Base UI components
- Button, Input, Card, Modal, Toast
- Chart, Graph, Progress bars
- Video player, Image gallery
- Form components with validation

// components/sports/ - Sports-specific components
- PerformanceChart, SkillTree, VideoAnalyzer
- GARScoreDisplay, AchievementBadge
- StatisticsGrid, ProgressRing

// components/layout/ - Layout components
- Navigation, Sidebar, Header
- DashboardLayout, AuthLayout
- ResponsiveGrid, ContentArea
```

### Advanced Features

#### Real-time Data Integration
```typescript
// hooks/useRealTimeData.ts
- Connect to backend WebSocket for live updates
- Real-time scout activity monitoring
- Live performance data streaming
- Instant notification system
```

#### AI Integration
```typescript
// services/aiService.ts
- Claude integration for coaching insights
- OpenAI integration for content generation
- Real-time AI analysis of performance data
- Personalized recommendation engine
```

#### Video Processing
```typescript
// services/videoService.ts
- Upload and processing pipeline
- GAR score calculation engine
- Highlight generation and editing
- Performance comparison tools
```

## Database Integration

### Key Schemas (Already Defined)
```typescript
// shared/schema.ts integration with:
- Users and authentication
- Athletes and performance data
- Skills and progression tracking
- Videos and analysis results
- Academic records and requirements
- Scout activity and recruitment data
```

### API Routes
```typescript
// app/api/ structure:
/skill-tree/* - StarPath progression APIs
/video-analysis/* - Video processing APIs
/academics/* - Academic tracking APIs
/recruitment/* - Scout and recruitment APIs
/coaching/* - AI coaching APIs
/profile/* - User profile management
```

## Styling Guidelines

### Design System
```css
/* Tailwind configuration for sports platform */
- Primary: Blue spectrum (#2563eb to #1d4ed8)
- Secondary: Purple for achievements (#7c3aed)
- Success: Green for progress (#059669)
- Warning: Orange for alerts (#ea580c)
- Background: Dark theme (#0f172a, #1e293b)
```

### Component Styling
```typescript
// Use consistent styling patterns:
- Cards with subtle borders and shadows
- Gradient backgrounds for hero sections
- Smooth animations for state changes
- Responsive design for all screen sizes
- Accessibility-first approach
```

## User Experience Features

### Neurodivergent-Friendly Design
- Clear navigation with consistent patterns
- Visual progress indicators
- Customizable interface options
- Reduced cognitive load design
- Focus management and attention helpers

### Mobile-First Approach
- Touch-friendly interface design
- Swipe gestures for navigation
- Optimized video playback
- Offline capability for key features

### Gamification Elements
- Achievement system integration
- Progress bars and leveling
- Celebration animations
- Leaderboards and competitions
- Milestone rewards

## Performance Optimization

### Frontend Optimizations
```typescript
// Implement performance best practices:
- Code splitting and lazy loading
- Image optimization and WebP support
- Service worker for offline functionality
- Efficient state management
- Component memoization strategies
```

### Data Management
```typescript
// Efficient data handling:
- TanStack Query for server state
- Optimistic updates for better UX
- Background data synchronization
- Intelligent caching strategies
```

## Integration Points

### Authentication Flow
```typescript
// Clerk integration:
- Sign-up/sign-in workflows
- Role-based access control
- Parent/athlete/coach permissions
- Session management
```

### Backend Services Connection
```typescript
// Connect to operational services:
- 711 athlete scout monitoring system
- 395 transfer portal tracking
- AI coaching service (Claude)
- Video analysis engine
- Academic tracking system
```

## Development Workflow

### Setup Process
1. Install dependencies: `npm install`
2. Configure environment variables
3. Set up Clerk authentication
4. Connect to operational database
5. Start development: `npm run dev`

### Testing Strategy
```typescript
// Implement comprehensive testing:
- Unit tests for components
- Integration tests for API routes
- E2E tests for critical workflows
- Performance testing for video features
```

### Deployment Preparation
```typescript
// Production readiness:
- Environment configuration
- Build optimization
- Database migration scripts
- Service deployment manifests
```

## Success Metrics

### User Engagement
- Daily active users tracking
- Feature adoption rates
- Video upload and analysis usage
- StarPath progression engagement
- Academic milestone achievements

### Performance Monitoring
- Page load times and optimization
- Video processing efficiency
- Real-time data synchronization
- Scout monitoring effectiveness

## Next Steps for Implementation

1. **Phase 1**: Core dashboard and navigation
2. **Phase 2**: StarPath interactive system
3. **Phase 3**: Video analysis integration
4. **Phase 4**: Academic and recruitment features
5. **Phase 5**: AI coaching and advanced analytics

## Backend Service Status
Your operational infrastructure includes:
- ✅ 711 athlete scouts monitoring recruitment
- ✅ 395 transfer portal monitors active
- ✅ AI Coach Service with Claude integration
- ✅ Database schema with all tables created
- ✅ Cache management system operational
- ✅ Blog generator creating sports content

Build the frontend to connect seamlessly with these operational services for a complete, production-ready platform.