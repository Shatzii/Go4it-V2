# Go4It Sports Platform - Deployment Package

## Overview
Go4It is a comprehensive AI-powered athletics platform for neurodivergent student athletes, featuring video analysis, performance tracking, academic monitoring, and recruitment tools with NCAA compliance.

## Quick Setup

### 1. Environment Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### 2. Required Environment Variables
```env
# Database
DATABASE_URL=your_postgresql_connection_string

# Authentication
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=http://localhost:3000

# AI Services (Optional)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# External Services (Optional)
STRIPE_SECRET_KEY=your_stripe_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

### 3. Database Setup
```bash
# Push database schema
npm run db:push

# Generate types
npm run db:generate
```

### 4. Development
```bash
# Start development server
npm run dev
```

### 5. Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

## Key Features
- **GAR Video Analysis**: AI-powered athletic performance analysis
- **StarPath System**: Gamified skill progression with XP tracking
- **College Path**: NCAA eligibility and recruitment tools
- **AI Coach Integration**: Voice coaching and personalized training
- **Academic Tracking**: K-12 course monitoring and progress tracking
- **Recruitment Automation**: AI-powered prospect discovery and outreach

## Tech Stack
- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL
- **Database**: Drizzle ORM with PostgreSQL
- **AI**: OpenAI GPT-4, Anthropic Claude, TensorFlow.js
- **Authentication**: NextAuth.js with JWT
- **Payments**: Stripe integration
- **UI**: Radix UI components with custom neon styling

## Project Structure
```
app/                 # Next.js app directory
├── api/            # API routes
├── (auth)/         # Authentication pages
├── dashboard/      # User dashboard
├── starpath/       # StarPath progression system
└── ...

components/         # Reusable React components
lib/               # Utility functions and integrations
shared/            # Shared schemas and types
```

## Deployment Notes
- Requires Node.js 18+ and PostgreSQL 14+
- Configure database connection string in environment variables
- Set up external API keys for full functionality
- Enable HTTPS in production for security

## Support
For technical support and documentation, visit the Go4It Sports Platform repository.