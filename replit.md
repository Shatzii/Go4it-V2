# Go4It Sports Platform

## Overview

Go4It Sports Platform is an advanced AI-powered athletics platform designed for neurodivergent student athletes. It offers comprehensive video analysis, performance tracking, academic monitoring, and recruitment tools. Key capabilities include the Growth and Ability Rating (GAR) system, StarPath progression tracking, and extensive NCAA compliance features. The platform aims to be a comprehensive solution for student athletes, offering both athletic and academic support, with a vision to dominate the sports recruitment and development market.

## User Preferences

Preferred communication style: Simple, everyday language.
User wants approval before any design or content changes.

## Recent Changes (August 2025)

- **Seamless CMS Implementation**: Built comprehensive content management system for complete admin control
- **Dynamic Content Loading**: Landing page now dynamically loads from CMS with fallback support
- **Admin Dashboard**: Created unified admin dashboard with navigation to all management tools
- **Mexico Events Integration**: Real camp information from provided documents fully editable through CMS
- **Content API System**: Built robust API endpoints for CMS content management and public consumption
- **Live Content Updates**: Admin can update hero sections, events, pricing, and global settings in real-time
- **USA Football Integration**: Implemented "Pathway to America" marketing strategy with official membership benefits
- **6-Month Platform Access**: Added Go4It site pass integration for standard edition participants
- **Visual Integration**: Incorporated real site images including "GET VERIFIED" graphic and Go4It logo
- **Neon Styling Integration**: Applied original site's glow effects, glass cards, and neon aesthetic from provided HTML
- **Sales Funnel Optimization**: Added "One Platform. One Mission. Go D1." CTA banner matching original content structure
- **Player Cards Enhancement**: Created neon-styled player cards with GAR scores and verification badges
- **Auto-Verification System**: Added automatic verification badge after GAR analysis completion
- **Admin User Management**: Created full admin panel at /admin/users with verification privileges
- **Database Enhancement**: Added verification columns, GAR scores, and logging system
- **Authentication System**: Created comprehensive user registration and camp registration integration
- **Database Integration**: 64 existing users confirmed, camp registration system ready
- **Storage Layer Update**: Aligned database schema with storage layer to fix authentication (January 2, 2025)

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14.1.0 with React 18.2.0
- **Styling**: Tailwind CSS with custom component library
- **UI Components**: Radix UI for accessible, customizable components
- **State Management**: React Query for server state, React Hook Form for form handling

### Backend Architecture
- **Server**: Express.js with custom middleware
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **API Design**: RESTful endpoints with comprehensive error handling
- **File Handling**: Multer for file uploads with organized storage structure

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Drizzle ORM, utilizing @neondatabase/serverless for cloud connectivity.
- **Schema Management**: Drizzle Kit for migrations and schema generation.
- **Caching**: Redis-based caching system for improved performance.

### Key Components & Features
- **Video Analysis System (GAR)**: AI-powered video processing for athletic performance analysis, supporting both cloud (OpenAI, Anthropic) and local (Ollama) AI models. Features a standardized scoring system and detailed biomechanical analysis.
- **StarPath Progression System**: Gamified skill tree with XP and achievement tracking, designed for neurodivergent athletes. Integrates athletic development, college path, and progress tracking into a unified journey.
- **Academic Tracking**: Monitors course enrollment, grades, and NCAA eligibility, including international diploma recognition and core course validation.
- **Recruitment Tools**: Includes an NCAA school and coaching staff database, transfer portal monitoring, social media scouting, and AI-powered matching based on coaching schemes and roster opportunities. Features comprehensive ranking systems for various sports and regions.
- **Team Management**: Provides tools for roster management, performance analytics, and coach-athlete communication.
- **Subscription Monetization System**: Implements a freemium model with tiered subscriptions (Starter, Pro, Elite) and one-time services.
- **Mobile Content Upload System**: Supports multiple upload methods including direct camera recording, file uploads, PWA share menu integration, and email fallback.
- **Smart Content Tagging AI System**: AI-powered analysis for videos, images, and documents, generating automatic tags and performance metrics.
- **Comprehensive School System**: Integration of a full K-12 educational institution with student information system (SIS), curriculum management, and academic tracking.
- **Seamless CMS System**: Complete content management system allowing real-time editing of all website content, events, pricing, and global settings through an intuitive admin interface.

### Core Architectural Decisions
- **Database**: PostgreSQL with Drizzle ORM chosen for scalability, reliability, and type safety.
- **Authentication**: JWT with bcrypt for stateless, scalable, and secure user authentication.
- **Frontend**: Next.js with React for modern, performant web application development, leveraging SSR/SSG capabilities.
- **Styling**: Tailwind CSS for a consistent, maintainable, and rapid development styling system.
- **AI Architecture**: Hybrid approach supporting both cloud AI APIs (OpenAI, Anthropic) and local self-hosted models (Ollama) for flexibility and performance optimization. Secure offline AI model protection with AES-256 encryption and hardware binding.
- **UI/UX**: Emphasis on a professional dark theme (slate-900/slate-800) with dynamic, interactive elements and a clean, user-friendly interface. Designed with ADHD-friendly optimizations and clear visual feedback.

## External Dependencies

- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Cloud Database Connectivity**: @neondatabase/serverless
- **Authentication**: JWT, bcrypt
- **File Uploads**: Multer
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **AI/ML Integration**:
    - **Cloud AI Providers**: OpenAI API (GPT-4o), Anthropic (Claude Sonnet)
    - **Local LLMs**: Ollama (for Llama 2, Mistral, CodeLlama models)
    - **Computer Vision**: TensorFlow.js (MoveNet, MediaPipe)
- **Payment Processing**: Stripe
- **Caching**: Redis
- **Development Tools**: TypeScript, ESLint, Drizzle Kit
- **Third-Party Integrations (for data scraping/sync)**: ESPN, EuroLeague, 1stLookSports, Rivals.com, 247Sports, On3, Hudl, MaxPreps, Sports Reference (Note: These are primarily data sources for the platform's scraping system)