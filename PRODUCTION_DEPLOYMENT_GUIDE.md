# Go4It Sports Platform - Production Deployment Guide

## Overview
Complete production deployment guide for the AI Strength & Conditioning Coach platform with integrated coaching marketplace and live streaming capabilities.

## Architecture Summary

### Core Platform
- **Frontend**: Next.js 15 with React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js with API routes
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based with bcrypt
- **Payments**: Stripe integration for coach sessions and live classes
- **AI Integration**: ElevenLabs voice coaching (Agent ID: tb80F0KNyKEjO8IymYOU)

### New Features Added
- **Coaches Corner**: Mentor marketplace with 1-on-1 sessions
- **Live Streaming Classes**: WebRTC-based live training sessions
- **Revenue Sharing**: 85% to coaches, 15% platform fee
- **Payment Processing**: Integrated Stripe checkout for all services

## Environment Variables Required

```env
# Database
DATABASE_URL=postgresql://...
PGHOST=
PGPORT=5432
PGDATABASE=
PGUSER=
PGPASSWORD=

# Authentication
JWT_SECRET=your-jwt-secret-here
SESSION_SECRET=your-session-secret-here

# Stripe Integration
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLIC_KEY=pk_live_...

# AI Integration
OPENAI_API_KEY=sk-...
ELEVENLABS_AGENT_ID=tb80F0KNyKEjO8IymYOU

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

## Database Schema Updates

### New Tables Required

```sql
-- Coaches table
CREATE TABLE coaches (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  specialty TEXT[] NOT NULL,
  experience VARCHAR NOT NULL,
  credentials TEXT[] NOT NULL,
  hourly_rate INTEGER NOT NULL,
  bio TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  availability VARCHAR DEFAULT 'Available',
  success_stories INTEGER DEFAULT 0,
  live_classes_enabled BOOLEAN DEFAULT false,
  revenue_share DECIMAL(3,2) DEFAULT 0.85,
  total_earnings INTEGER DEFAULT 0,
  status VARCHAR DEFAULT 'pending_approval',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Live classes table
CREATE TABLE live_classes (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  coach_id VARCHAR REFERENCES coaches(id),
  start_time TIMESTAMP NOT NULL,
  duration INTEGER NOT NULL, -- minutes
  price INTEGER NOT NULL, -- cents
  max_attendees INTEGER NOT NULL,
  current_attendees INTEGER DEFAULT 0,
  category VARCHAR NOT NULL,
  equipment TEXT[] NOT NULL,
  level VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'scheduled',
  stream_url VARCHAR,
  revenue INTEGER DEFAULT 0,
  platform_fee INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Class enrollments table
CREATE TABLE class_enrollments (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id VARCHAR REFERENCES live_classes(id),
  user_id VARCHAR REFERENCES users(id),
  payment_intent_id VARCHAR NOT NULL,
  amount_paid INTEGER NOT NULL,
  enrolled_at TIMESTAMP DEFAULT NOW(),
  access_granted BOOLEAN DEFAULT true
);

-- Coach sessions table
CREATE TABLE coach_sessions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id VARCHAR REFERENCES coaches(id),
  user_id VARCHAR REFERENCES users(id),
  session_type VARCHAR NOT NULL, -- 'consultation', 'training', 'live_class'
  scheduled_time TIMESTAMP NOT NULL,
  duration INTEGER NOT NULL, -- minutes
  price INTEGER NOT NULL, -- cents
  status VARCHAR DEFAULT 'scheduled',
  payment_intent_id VARCHAR,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Revenue tracking table
CREATE TABLE revenue_tracking (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id VARCHAR REFERENCES coaches(id),
  transaction_type VARCHAR NOT NULL, -- 'class', 'session', 'consultation'
  transaction_id VARCHAR NOT NULL,
  gross_amount INTEGER NOT NULL, -- cents
  platform_fee INTEGER NOT NULL, -- cents
  coach_earnings INTEGER NOT NULL, -- cents
  processed_at TIMESTAMP DEFAULT NOW()
);
```

## Deployment Steps

### 1. Infrastructure Setup

```bash
# Clone repository
git clone https://github.com/your-org/go4it-sports-platform
cd go4it-sports-platform

# Install dependencies
npm install

# Build application
npm run build
```

### 2. Database Migration

```bash
# Run database migrations
npm run db:push

# Seed initial data (optional)
npm run db:seed
```

### 3. Environment Configuration

Create production environment file:

```bash
cp .env.example .env.production
# Edit .env.production with production values
```

### 4. Stripe Configuration

1. **Create Stripe Products**:
   - Coach Consultation Sessions
   - Live Training Classes
   - 1-on-1 Training Sessions

2. **Set up Webhooks**:
   - Endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

3. **Configure Revenue Sharing**:
   - Enable Stripe Connect for coach payouts
   - Set up automatic transfers (85% to coaches)

### 5. WebRTC Streaming Setup

For production live streaming, integrate with:

**Option A: Self-hosted**
```bash
# Install WebRTC infrastructure
npm install kurento-client
# Configure media server
```

**Option B: Third-party service**
- Agora.io for scalable video streaming
- Twilio Video for enterprise-grade streaming
- Zoom SDK for integrated video calls

### 6. Load Balancing & CDN

```nginx
# Nginx configuration
upstream go4it_app {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
}

server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://go4it_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # WebSocket support for live streaming
    location /ws {
        proxy_pass http://go4it_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 7. Monitoring & Analytics

```javascript
// Add production monitoring
const monitoring = {
  // Revenue tracking
  revenueMetrics: {
    totalPlatformRevenue: 0,
    coachPayouts: 0,
    activeClasses: 0,
    enrollmentRate: 0
  },
  
  // Performance monitoring
  apiResponseTimes: {},
  streamQuality: {},
  userEngagement: {}
};
```

## Revenue Model Implementation

### Coach Revenue Sharing (85/15 Split)

```javascript
// Automatic revenue calculation
const calculateRevenue = (grossAmount) => {
  const platformFee = Math.round(grossAmount * 0.15);
  const coachEarnings = grossAmount - platformFee;
  
  return {
    grossAmount,
    platformFee,
    coachEarnings
  };
};
```

### Pricing Structure

- **Coach Consultations**: $50-100/hour
- **1-on-1 Training**: $75-150/hour  
- **Live Classes**: $25-50/session
- **Group Sessions**: $15-35/person

## Security Considerations

### Payment Security
- PCI DSS compliance through Stripe
- No card data stored on servers
- Encrypted payment processing

### Stream Security
- JWT-based stream access tokens
- Time-limited stream URLs
- User enrollment verification

### Data Protection
- GDPR compliance for user data
- Encrypted database connections
- Secure API endpoints

## Performance Optimization

### Caching Strategy
```javascript
// Redis caching for frequently accessed data
const cacheConfig = {
  coaches: '1 hour',
  liveClasses: '5 minutes',
  userSessions: '30 minutes'
};
```

### CDN Integration
- Static assets via CloudFront/CloudFlare
- Video streaming via dedicated CDN
- Global content delivery

## Monitoring & Maintenance

### Key Metrics to Track
- **Revenue Metrics**: Daily/monthly revenue, coach payouts
- **User Engagement**: Class attendance, session bookings
- **Platform Performance**: API response times, stream quality
- **Coach Satisfaction**: Earnings, rating scores

### Automated Alerts
- Payment processing failures
- Stream connectivity issues
- Database performance problems
- High API error rates

## Launch Checklist

- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] Stripe integration tested
- [ ] ElevenLabs AI coach functional
- [ ] Live streaming infrastructure ready
- [ ] Coach onboarding process active
- [ ] Payment processing verified
- [ ] Revenue sharing automated
- [ ] Monitoring systems active
- [ ] Security audit completed
- [ ] Performance testing passed
- [ ] Documentation updated

## Support & Maintenance

### Coach Support
- Dedicated coach dashboard for earnings tracking
- Technical support for streaming issues
- Marketing materials and resources

### User Support
- 24/7 chat support during live classes
- Refund processing automation
- Technical troubleshooting guides

## Scaling Considerations

### Infrastructure Scaling
- Auto-scaling for traffic spikes during popular classes
- Database read replicas for performance
- Geographic distribution for global users

### Feature Expansion
- On-demand video library
- Mobile app development
- International payment processing
- Multi-language support

---

**Platform Revenue Projections**:
- 1000 active users × $50 average spend = $50,000/month gross
- 15% platform fee = $7,500/month platform revenue
- 85% to coaches = $42,500/month coach payouts

This comprehensive production deployment ensures a scalable, secure, and profitable coaching marketplace integrated with your existing AI strength & conditioning platform.