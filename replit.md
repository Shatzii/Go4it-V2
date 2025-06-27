# Go4It Sports Platform

## Overview

Go4It Sports is a comprehensive sports analytics platform designed specifically for neurodivergent student athletes aged 12-18, particularly those with ADHD. The platform combines video analysis, skill progression tracking, AI coaching, and recruitment tools to provide a complete development ecosystem for young athletes.

## System Architecture

The platform follows a modern full-stack architecture optimized for deployment on Replit and traditional servers:

### Frontend Architecture
- **Framework**: React.js with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Authentication**: Clerk for user management with session bridging
- **Styling**: Tailwind CSS with dark theme (ADHD-friendly design)
- **State Management**: Built-in React state with hooks
- **UI Components**: Custom component library optimized for neurodivergent users

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Dual system - Clerk (frontend) with Express sessions (backend)
- **AI Services**: Integrated OpenAI and Anthropic APIs for coaching features
- **File Storage**: Local filesystem with cloud storage options
- **WebSocket Support**: Real-time features for live coaching and notifications

## Key Components

### 1. Video Analysis System (GAR)
- **Growth and Ability Rating (GAR)**: Proprietary scoring system (0-100 scale)
- **Upload Processing**: Drag-and-drop interface with AI-powered analysis
- **Frame Analysis**: Detailed breakdown of athletic performance
- **Comparison Tools**: Before/after video analysis capabilities

### 2. StarPath Skill Development
- **Interactive Skill Trees**: Visual progression system with unlockable nodes
- **XP System**: Points-based advancement through completed activities
- **Achievement Badges**: Milestone rewards and recognition system
- **Personalized Recommendations**: AI-driven drill and training suggestions

### 3. User Management System
- **Multi-Role Support**: Student athletes, coaches, and parents
- **Profile Management**: Sport-specific profiles with performance tracking
- **Academic Integration**: NCAA eligibility monitoring and GPA tracking
- **Communication Tools**: Coach-athlete messaging and progress sharing

### 4. AI Coaching Engine
- **Multiple AI Providers**: OpenAI and Anthropic integration with fallback support
- **Personalized Coaching**: ADHD-aware coaching recommendations
- **Performance Analysis**: Automated insights from video and performance data
- **Mock AI Support**: Development-friendly testing without API costs

### 5. Recruitment Hub
- **Scout Monitoring**: 711 active athlete scouts tracking recruitment data
- **Transfer Portal**: 395 monitors tracking player movements
- **College Matching**: NCAA school database with program information
- **Communication Tracking**: Recruitment timeline and contact management

## Data Flow

### Authentication Flow
1. User authenticates via Clerk (frontend)
2. Middleware bridges Clerk session to Express backend
3. Backend validates session for API access
4. User data synced between Clerk and PostgreSQL

### Video Analysis Flow
1. User uploads video via drag-and-drop interface
2. File processed and stored in uploads directory
3. AI analysis triggered (OpenAI/Anthropic or mock data)
4. GAR score calculated and stored in database
5. Results displayed in interactive dashboard

### Skill Progression Flow
1. User completes activities or uploads performance videos
2. XP points calculated based on performance metrics
3. Skill tree nodes unlocked based on XP thresholds
4. Achievement badges awarded for milestones
5. Progress synced across all user interfaces

## External Dependencies

### Required Services
- **PostgreSQL**: Primary database for user data, performance metrics, and content
- **Clerk**: Authentication and user management service
- **OpenAI API**: AI coaching and analysis features
- **Anthropic API**: Alternative AI provider for coaching features

### Optional Services
- **Twilio**: SMS notifications for coaches and parents
- **SendGrid**: Transactional email delivery
- **Cloud Storage**: Alternative to local file storage

### Development Dependencies
- **Drizzle ORM**: Type-safe database operations
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type safety across the entire stack

## Deployment Strategy

### Replit Deployment (Current)
- **Port Configuration**: Frontend (3000), Backend (5000), WebSocket (5001)
- **Database**: PostgreSQL module integrated with Replit
- **Environment**: Development-optimized with hot reloading
- **Scaling**: Autoscale deployment target for production

### Production Deployment Options
1. **Hetzner VPS**: Optimized configuration for go4itsports.org
2. **Traditional Server**: Nginx reverse proxy with PM2 process management
3. **Cloud Platforms**: AWS, DigitalOcean, or similar providers

### Database Migration Strategy
- **Schema Management**: Drizzle migrations for version control
- **Data Seeding**: Automated population of NCAA schools, skill trees, and sample data
- **Backup System**: Automated PostgreSQL backups with retention policies

## Recent Changes

### Platform Status: June 2025
- ✓ All 10 comprehensive improvements successfully implemented
- ✓ Complete Go4It Teams section with sport-specific management
- ✓ Real-time performance tracking and advanced AI coaching
- ✓ Mobile video tools and enhanced accessibility features
- ✓ Platform running on Next.js with port configuration resolved
- ✓ GitHub Copilot build prompts created for complete platform reconstruction
- ✓ Subscription-based licensing system implemented for self-hosted deployment
- ✓ License validation and feature gating system integrated
- ✓ Self-hosted packages created for three subscription tiers
- Admin access: username "admin", password "MyTime$$"

- June 23, 2025: **Complete Platform Enhancement & Go4It Teams Integration**
  - **Real-Time Performance Tracking**: Live heart rate monitoring, instant feedback, personalized ADHD attention zones
  - **Advanced AI Coaching**: Emotional intelligence analysis, frustration detection, adaptive coaching tones
  - **Gamified Achievement System**: Daily/weekly challenges, team competitions, parent celebration moments
  - **Mobile Video Recording Tools**: Built-in camera with technique overlays, voice guidance, offline recording
  - **Go4It Teams Management**: Complete team system for flag football, soccer, basketball, track & field
  - **Communication Hub**: Coach-athlete messaging, parent progress sharing, peer support groups
  - **Academic Integration Expansion**: GPA tracking, NCAA eligibility timeline, scholarship matching
  - **Enhanced Accessibility**: Neurodivergent support, multi-language, sensory preferences, focus modes
  - **Injury Prevention System**: Biomechanical analysis, recovery recommendations, medical integration
  - **Advanced Analytics Platform**: Longitudinal tracking, predictive modeling, recruitment insights

## Changelog

- June 23, 2025. Initial setup and complete platform build

## User Preferences

Preferred communication style: Simple, everyday language.