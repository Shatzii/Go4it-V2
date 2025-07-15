# Go4It Sports Platform - Replit.md

## Overview

Go4It Sports Platform is an advanced AI-powered athletics platform designed specifically for neurodivergent student athletes. The platform combines video analysis, performance tracking, academic monitoring, and recruitment tools into a comprehensive solution. It features a Growth and Ability Rating (GAR) system, StarPath progression tracking, and extensive NCAA compliance tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14.1.0 with React 18.2.0
- **Styling**: Tailwind CSS with custom component library
- **UI Components**: Radix UI for accessible, customizable components
- **State Management**: React Query for server state, React Hook Form for form handling
- **Build Tool**: Vite for development, Next.js for production builds

### Backend Architecture
- **Server**: Express.js with custom middleware
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based auth with bcrypt for password hashing
- **API Design**: RESTful endpoints with comprehensive error handling
- **File Handling**: Multer for file uploads with organized storage structure

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Drizzle ORM
- **Connection**: Uses @neondatabase/serverless for cloud database connectivity
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Caching**: Redis-based caching system for improved performance

## Key Components

### 1. Video Analysis System (GAR)
- AI-powered video processing for athletic performance analysis
- Growth and Ability Rating system with standardized scoring
- Optimized for 4 vCPU/16GB RAM server configuration
- Supports multiple video formats with automatic transcoding

### 2. StarPath Progression System
- Skill tree implementation with XP tracking
- Achievement system with visual progress indicators
- Gamified learning experience tailored for neurodivergent athletes

### 3. Academic Tracking
- Course enrollment and grade tracking
- NCAA eligibility monitoring
- Core course identification for compliance

### 4. Recruitment Tools
- NCAA school and coaching staff database
- Transfer portal monitoring
- Social media scouting capabilities
- Athletic department contact management

### 5. Team Management
- Comprehensive team roster management
- Performance analytics and reporting
- Coach-athlete communication tools

## Data Flow

### Authentication Flow
1. User submits credentials via login form
2. Server validates against database using bcrypt
3. JWT token generated and returned to client
4. Token stored in session and included in API requests
5. Server middleware validates token on protected routes

### Video Analysis Flow
1. Admin uploads video files via web interface
2. Files stored in organized directory structure
3. AI processing pipeline analyzes video content
4. Results stored in database with associated metadata
5. Frontend displays analysis results with interactive visualizations

### Data Synchronization
- Real-time updates via WebSocket connections
- Cached data with TTL for performance optimization
- Background sync for offline capabilities

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT with bcrypt
- **File Processing**: Multer for uploads
- **UI Framework**: Radix UI components
- **Styling**: Tailwind CSS

### AI/ML Integration
- OpenAI API for advanced text analysis
- Custom video processing pipeline
- Hugging Face model integration for sports analysis

### Development Tools
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Drizzle Kit for database management

## Deployment Strategy

### Development Environment
- Uses Replit for development and testing
- Custom server configuration for port 5000
- Health check endpoints for monitoring
- Automated build and deployment scripts

### Production Deployment
- Optimized for go4itsports.org domain
- Static file serving with CDN considerations
- Environment-specific configurations
- Database migration scripts for schema updates

### Performance Optimizations
- Code splitting and lazy loading
- Image optimization and compression
- Database query optimization
- Caching strategies for frequently accessed data

### Monitoring and Maintenance
- Health check endpoints (`/api/health`)
- Error logging and monitoring
- Performance metrics tracking
- Automated backup systems

## Architecture Decisions

### Database Choice: PostgreSQL with Drizzle ORM
- **Problem**: Need for reliable, scalable database with type safety
- **Solution**: PostgreSQL provides ACID compliance and scalability, Drizzle ORM offers type-safe queries
- **Alternatives**: MongoDB, MySQL with different ORMs
- **Pros**: Strong consistency, excellent performance, type safety
- **Cons**: More complex setup than NoSQL alternatives

### Authentication Strategy: JWT with bcrypt
- **Problem**: Secure user authentication and session management
- **Solution**: JWT tokens for stateless authentication, bcrypt for password hashing
- **Alternatives**: Session-based auth, OAuth providers
- **Pros**: Stateless, scalable, secure password storage
- **Cons**: Token management complexity, potential for token hijacking

### Frontend Framework: Next.js with React
- **Problem**: Need for modern, performant web application
- **Solution**: Next.js provides SSR/SSG capabilities with React ecosystem
- **Alternatives**: Vue.js, Angular, vanilla React
- **Pros**: Great developer experience, built-in optimizations, large ecosystem
- **Cons**: Framework lock-in, learning curve for team

### Styling Solution: Tailwind CSS
- **Problem**: Consistent, maintainable styling system
- **Solution**: Utility-first CSS framework with design system
- **Alternatives**: Styled-components, CSS modules, traditional CSS
- **Pros**: Rapid development, consistent design, small bundle size
- **Cons**: Learning curve, potential for cluttered markup