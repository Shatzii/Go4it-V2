# Go4It Sports Platform

## Overview

Go4It Sports Platform is an advanced AI-powered athletics platform for neurodivergent student athletes. It offers comprehensive video analysis (GAR system), performance tracking (StarPath), academic monitoring, and recruitment tools with extensive NCAA compliance features. The platform aims to be a comprehensive solution for student athletes, providing both athletic and academic support, with a vision to dominate the sports recruitment and development market.

## User Preferences

Preferred communication style: Simple, everyday language.
User wants approval before any design or content changes.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14.1.0 with React 18.2.0
- **Styling**: Tailwind CSS with custom component library, emphasizing a professional dark theme (slate-900/slate-800) with neon styling, glow effects, and glass cards.
- **UI Components**: Radix UI for accessible, customizable components. Designed with ADHD-friendly optimizations and clear visual feedback.
- **State Management**: React Query for server state, React Hook Form for form handling.

### Backend Architecture
- **Server**: Express.js with custom middleware.
- **Database**: PostgreSQL with Drizzle ORM.
- **Authentication**: JWT-based authentication with bcrypt for password hashing.
- **API Design**: RESTful endpoints with comprehensive error handling.
- **File Handling**: Multer for file uploads with organized storage structure.

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Drizzle ORM, utilizing @neondatabase/serverless for cloud connectivity.
- **Schema Management**: Drizzle Kit for migrations and schema generation.
- **Caching**: Redis-based caching system.

### Key Components & Features
- **Video Analysis System (GAR)**: AI-powered video processing for athletic performance analysis with a standardized scoring system and biomechanical analysis. Auto-verification after analysis completion.
- **StarPath Progression System**: Gamified skill tree for neurodivergent athletes, integrating athletic development and college path tracking.
- **Academic Tracking**: Monitors course enrollment, grades, and NCAA eligibility, including international diploma recognition. Integrates a full K-12 educational institution system.
- **Recruitment Tools**: NCAA school/coaching staff database, transfer portal monitoring, social media scouting, and AI-powered matching.
- **Team Management**: Tools for roster management, performance analytics, and coach-athlete communication, available as a premium module.
- **Subscription Monetization System**: Freemium model with tiered subscriptions (Starter, Pro, Elite) and one-time services.
- **Mobile Content Upload System**: Supports direct camera recording, file uploads, PWA share menu integration, and email fallback.
- **Smart Content Tagging AI System**: AI analysis for automatic tagging of videos, images, and documents.
- **Seamless CMS System**: Admin interface for real-time content editing (website content, events, pricing, global settings).
- **AI Football Coach Integration**: AI voice coaching system using ElevenLabs, integrated into GAR Analysis, StarPath, Challenges, and Recruiting Reports. Includes AI Playbook Creator and Tournament Management System.
- **SMS Notification System**: Enterprise-level SMS capabilities for payments, performance alerts, emergency communication, session management, recruitment, and gamification.
- **Performance & Optimization**: Implemented lazy loading, code splitting, image optimization, and advanced error handling.

### Core Architectural Decisions
- **Database**: PostgreSQL with Drizzle ORM for scalability, reliability, and type safety.
- **Authentication**: JWT with bcrypt for stateless, scalable, and secure user authentication.
- **Frontend**: Next.js with React for performant web application development, leveraging SSR/SSG.
- **Styling**: Tailwind CSS for consistent, maintainable, and rapid development.
- **AI Architecture**: Hybrid approach supporting both cloud AI APIs (OpenAI, Anthropic) and local self-hosted models (Ollama). Secure offline AI model protection with AES-256 encryption.

## External Dependencies

- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Cloud Database Connectivity**: @neondatabase/serverless
- **Authentication**: JWT, bcrypt
- **File Uploads**: Multer
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **AI/ML Integration**: OpenAI API (GPT-4o), Anthropic (Claude Sonnet), Ollama (for Llama 2, Mistral, CodeLlama), TensorFlow.js (MoveNet, MediaPipe), ElevenLabs (for AI voice).
- **Payment Processing**: Stripe
- **Caching**: Redis
- **Development Tools**: TypeScript, ESLint, Drizzle Kit
- **Third-Party Integrations (for data scraping/sync)**: ESPN, EuroLeague, 1stLookSports, Rivals.com, 247Sports, On3, Hudl, MaxPreps, Sports Reference.
- **SMS Integration**: Twilio