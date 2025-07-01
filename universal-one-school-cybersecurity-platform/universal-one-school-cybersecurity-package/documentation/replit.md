# Sentinel AI - Enterprise Cybersecurity Platform

## Overview

Sentinel AI is a comprehensive, AI-powered cybersecurity platform designed for enterprise organizations. It provides advanced threat detection, automated incident response, and regulatory compliance management through a modern SaaS architecture built on Node.js, React, and PostgreSQL.

The platform simulates a real-world enterprise security operations center (SOC) with features like real-time threat monitoring, network topology visualization, compliance auditing, and executive dashboards for C-suite reporting.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with a professional dark cybersecurity theme
- **State Management**: TanStack Query for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Real-time**: WebSocket integration for live security feeds
- **Charts**: Chart.js and Recharts for data visualization

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with session-based authentication
- **Database**: PostgreSQL with Drizzle ORM for type-safe queries
- **Real-time**: WebSocket server for live data streaming
- **Authentication**: bcrypt for password hashing, session middleware
- **Security**: Multi-tenant architecture with client isolation

### Data Storage Solution
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Automated schema management via drizzle-kit
- **Connection Pooling**: Neon serverless pool for optimal performance

## Key Components

### Security Monitoring Services
1. **Threat Detection Service**: Real-time pattern matching with ML-based anomaly detection
2. **Log Analysis Service**: Intelligent log parsing with threat indicator correlation
3. **Network Monitor Service**: Active network scanning and topology mapping
4. **File Integrity Service**: Critical file monitoring with hash-based change detection
5. **Anomaly Detection Service**: Behavioral analysis for unusual activity patterns

### Integration & Automation
1. **Alert System Service**: Multi-channel notification orchestration
2. **Notification Hub**: Centralized message routing (WebSocket, Slack, email)
3. **Webhook Service**: Third-party integrations (Slack, Discord, PagerDuty)
4. **Performance Optimizer**: Caching and query optimization engine
5. **Real-time Sync Service**: WebSocket-based data synchronization

### Business Intelligence
1. **Executive Dashboard**: C-suite security metrics and ROI reporting
2. **Compliance Management**: SOC 2, ISO 27001, GDPR, HIPAA automation
3. **Incident Response Workflow**: Automated playbook execution
4. **Security Analytics**: Advanced threat correlation and trending

## Data Flow

### Authentication Flow
1. User credentials validated against bcrypt-hashed passwords
2. Session established with secure cookie management
3. Role-based access control (admin, user, client_admin)
4. Multi-tenant isolation based on clientId

### Real-time Data Flow
1. Security services generate events and store in PostgreSQL
2. Notification Hub receives events and routes to appropriate channels
3. WebSocket server broadcasts updates to connected clients
4. Frontend components update via TanStack Query cache invalidation

### Compliance Data Flow
1. Automated evidence collection from security events
2. Compliance rules engine evaluates against frameworks
3. Gap analysis and remediation recommendations generated
4. Audit-ready reports compiled with timeline tracking

## External Dependencies

### Core Dependencies
- `@neondatabase/serverless`: PostgreSQL serverless database
- `drizzle-orm`: Type-safe SQL query builder
- `@tanstack/react-query`: Server state management
- `@radix-ui/*`: Accessible UI component primitives
- `@slack/web-api`: Slack integration for alerts

### Security Libraries
- `bcrypt`: Password hashing and validation
- `express-session`: Session management
- `connect-pg-simple`: PostgreSQL session store

### Visualization & Charts
- `chart.js`: Dashboard metrics visualization
- `recharts`: React-specific charting library

## Deployment Strategy

### Development Environment
- Replit-hosted with automatic deployment
- Hot module replacement for frontend development
- PostgreSQL database via Neon serverless
- Environment variables for configuration

### Production Considerations
- Docker containerization support via package.json scripts
- Database migrations via `drizzle-kit push`
- Static asset optimization via Vite build
- Session-based authentication with secure cookies

### Scaling Architecture
- Multi-tenant SaaS design with client isolation
- Connection pooling for database optimization
- WebSocket scaling via message broadcasting
- Caching layer for frequently accessed data

## Changelog

- June 28, 2025. Initial setup
- June 30, 2025. Complete SaaS marketing package created with business plan and landing page
- June 30, 2025. Multi-school platform integration strategy developed with 15 high-impact features
- June 30, 2025. Full Universal One School cybersecurity integration completed with Next.js optimization
- June 30, 2025. Social media safety monitoring system implemented with student account connectivity
- June 30, 2025. Educational cybersecurity platform deployed with COPPA/FERPA/GDPR compliance

## User Preferences

Preferred communication style: Simple, everyday language.