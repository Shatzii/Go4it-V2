# Go4It Sports Platform Functionality Summary

## Platform Overview

Go4It Sports is a comprehensive sports performance platform designed for neurodivergent student athletes aged 12-18, with a specialized approach for those with ADHD. The platform combines video analysis, performance tracking, and personalized development tools with mobile-first design principles and a PlayStation 5-quality "My Player" interface.

## Core Components

### 1. Admin File Upload System (`uploader.ts`)

This component provides a secure method for uploading and managing files within the platform.

**Key Features:**
- Secure file uploading with administrator authentication
- Support for JS and ZIP files with size validation
- Detailed logging of all upload activities
- Customizable file storage locations
- Protection against unauthorized uploads

**API Endpoints:**
- `/api/admin/upload/upload` - For uploading files
- `/api/admin/upload/logs` - For viewing upload activity logs

### 2. AI Integration System (`agent-message.ts`)

This component integrates OpenAI and Anthropic AI capabilities into the platform for code assistance and other AI-powered features.

**Key Features:**
- Integration with OpenAI's GPT models
- Fallback to Anthropic's Claude models when available
- Detailed logging of all AI interactions
- Context-aware AI responses
- Error handling with fallback mechanisms

**API Endpoints:**
- `/api/agent-message` - For sending messages to AI models
- `/api/agent-logs` - For viewing AI interaction history
- `/api/ai-status` - For checking AI API connection status

### 3. System Status Monitoring (`status.ts`)

This component provides real-time information about the system's health and build status.

**Key Features:**
- Build information tracking (version, build date, etc.)
- System health monitoring
- Uploader service status checking
- AI connection status validation

**API Endpoints:**
- `/api/status` - For checking overall system status
- `/api/update-build-info` - For updating build information

## Core Platform Functionality

### User Experience and Interface

1. **Mobile-First Video Capture**
   - Streamlined recording interface optimized for mobile devices
   - Real-time GAR feedback during recording sessions
   - Simplified video uploading and processing

2. **My Player Game Interface**
   - PlayStation 5-quality user interface
   - Interactive Skill Tree Progression Visualization
   - Star Path visualization with navigation between views

3. **Enhanced GAR Feature**
   - Tabbed interface for Overview, Trends, Comparison, and Videos
   - Comprehensive scoring for physical, psychological, and technical abilities
   - Visual representation of athlete progress

### Athlete Development Tools

1. **Profile Management**
   - Comprehensive onboarding workflow
   - Sport-specific profile customization
   - Academic performance tracking integration

2. **GAR Scoring System**
   - Evaluates three main categories (physical, psychological, technical)
   - Sport-specific evaluation criteria
   - Trend analysis and comparison features

3. **XP and Progression System**
   - Level progression from Rookie to Legend
   - Streak tracking with milestone bonuses
   - Rewards for consistent engagement

### Collaboration Features

1. **Parent/Coach Collaboration Portal**
   - Shared viewing of GAR results
   - Notation and feedback capabilities
   - Progress tracking and communication tools

2. **Media Partnership Discovery**
   - Connection with relevant media outlets
   - Exposure opportunities for athletes
   - Media partnership scouting

### Technical Infrastructure

1. **Authentication System**
   - Secure token-based authentication
   - Role-based access control
   - Password reset capabilities

2. **Database Integration**
   - PostgreSQL with Drizzle ORM
   - Efficient data retrieval and storage
   - Relationship modeling for complex data structures

3. **Production Deployment Infrastructure**
   - Build information tracking
   - System status monitoring
   - Secure file upload management

## Sport Types Supported

The platform currently supports comprehensive analysis and training for the following sports:

1. Basketball
2. Football
3. Soccer
4. Baseball
5. Volleyball
6. Track
7. Swimming
8. Tennis
9. Golf
10. Wrestling

Each sport has dedicated GAR scoring criteria, training recommendations, and skill development pathways tailored to the specific requirements of that sport.

## Rank System Progression

Athletes progress through the following ranks as they develop:

1. Rookie
2. Prospect
3. Rising Star
4. All-Star
5. MVP
6. Legend

The Star Path feature also includes 5 levels of progression from Rising Prospect to Five-Star Athlete.

## Summary

The Go4It Sports platform represents a comprehensive ecosystem for neurodivergent student-athlete development, combining video analysis, AI-driven insights, and gamified progression systems. The newly implemented server components enhance the platform's capabilities with secure file management, AI integration, and system monitoring, ensuring a robust and reliable experience for all users.