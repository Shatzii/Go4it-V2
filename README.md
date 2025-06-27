# Go4It Sports Platform

A comprehensive sports analytics platform designed for neurodivergent student athletes aged 12-18, featuring AI-powered video analysis, skill progression tracking, and team management tools.

## Overview

Go4It Sports transforms athletic development through personalized AI coaching, GAR (Growth and Ability Rating) video analysis, and StarPath skill progression - all optimized for ADHD-friendly design patterns.

## Key Features

### 🎯 Core Platform
- **GAR Video Analysis**: AI-powered 0-100 scale performance scoring
- **StarPath Progression**: Interactive skill trees with XP-based advancement
- **Go4It Teams**: Complete management for flag football, soccer, basketball, track & field
- **Real-Time Performance Tracking**: Live metrics and personalized ADHD attention zones
- **Academic Integration**: NCAA eligibility monitoring and GPA tracking

### 🤖 AI-Powered Coaching
- **Multiple AI Providers**: OpenAI and Anthropic integration with emotional intelligence
- **Self-Hosted AI Models**: Complete Hugging Face model integration for cost-effective analysis
- **Personalized Recommendations**: ADHD-aware coaching and development suggestions
- **Mock AI Support**: Development-friendly testing without API costs

### 🏆 Advanced Features
- **Mobile Video Tools**: Built-in recording with technique overlays
- **Communication Hub**: Coach-athlete messaging and parent progress sharing
- **Achievement System**: Gamified badges, challenges, and milestone rewards
- **Recruitment Tools**: College matching and scout monitoring

## Business Model

### Subscription-Based Self-Hosting
- **Starter**: $47/month (50 athletes, basic features)
- **Professional**: $97/month (200 athletes, full AI)
- **Enterprise**: $297/month (unlimited, white-label)

### Benefits
- **For Customers**: Complete data ownership, no usage limits, offline capability
- **For Business**: Recurring revenue without infrastructure costs
- **Win-Win**: Reduced operational overhead while maintaining feature control

## Technical Architecture

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with dark theme (ADHD-optimized)
- **Authentication**: JWT-based with session management
- **State Management**: React hooks with TanStack Query

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI, Anthropic, and self-hosted Hugging Face models
- **License Management**: Subscription validation and feature gating

### Self-Hosted AI
- **Player Detection**: facebook/detr-resnet-50-dc5
- **Sport Classification**: microsoft/resnet-50
- **Pose Estimation**: google/movenet-singlepose-thunder
- **Action Recognition**: FCakyon/yolov8n-action-classification
- **Text Generation**: TheBloke/Llama-2-7B-Chat-GGML

## Quick Start

### Requirements
- Node.js 18+
- PostgreSQL 15+
- Docker (recommended)
- 4GB RAM minimum (8GB recommended)

### Installation
```bash
# Clone repository
git clone https://github.com/Shatzii/Go4it-V2.git
cd Go4it-V2

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Set up database
npm run db:push

# Start development server
npm run dev
```

### Self-Hosted Deployment
```bash
# Extract deployment package
unzip go4it-sports-professional.zip
cd go4it-sports-professional

# One-command setup
./scripts/setup.sh

# Access at https://localhost
```

## Server Requirements

### Minimum (Starter Edition)
- 2 CPU cores
- 4GB RAM
- 20GB SSD storage
- 10 Mbps network

### Recommended (Professional Edition)
- 4 CPU cores
- 8GB RAM
- 50GB SSD storage
- 25 Mbps network

### Optimal (Enterprise Edition)
- 8 CPU cores
- 16GB RAM
- 100GB SSD storage
- 50 Mbps network

## License & Subscription

This software operates on a subscription-based licensing model:

- Software remains owned by Go4It Sports
- Customers license usage rights based on subscription tier
- License validation occurs every 24 hours
- Features automatically adjust based on subscription status
- Grace periods provided for offline operation

## Documentation

- [Deployment Guide](SUBSCRIPTION_DEPLOYMENT_GUIDE.md)
- [Business Model](BUSINESS_MODEL_TRANSITION.md)
- [Server Requirements](SERVER_REQUIREMENTS_GUIDE.md)
- [GitHub Copilot Build Guide](COPILOT_BUILD_PROMPT.md)
- [License Management](SUBSCRIPTION_LICENSING_MODEL.md)

## Support

### For Customers
- Documentation and user guides included
- Community forum access
- Priority support with Professional/Enterprise tiers

### For Developers
- Complete GitHub Copilot build prompts
- Self-hosted AI model integration
- Comprehensive API documentation

## Contributing

This is commercial software. For feature requests or bug reports, please contact support through the customer portal.

## Security

- Server fingerprinting prevents license sharing
- Encrypted license validation
- Secure JWT authentication
- GDPR-compliant data handling

## Changelog

### v2.0.0 (June 2025)
- Complete platform rebuild with all 10 comprehensive improvements
- Subscription-based licensing system implementation
- Self-hosted AI model integration
- Advanced team management for 4 sports
- Real-time performance tracking
- Enhanced accessibility features

### v1.0.0 (December 2024)
- Initial platform launch
- Basic GAR analysis
- Team management foundation
- Authentication system

---

**Go4It Sports** - Empowering neurodivergent student athletes through intelligent sports analytics.

For more information, visit [go4itsports.com](https://go4itsports.com)