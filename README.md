# Rhythm LMS - AI-Powered Educational Platform

A comprehensive Learning Management System designed specifically for neurodivergent students aged 3-25, with full compliance for Texas, Alabama, Mississippi, Colorado, and Georgia K-12 requirements, plus English with Sports dual certification programs.

## Features

### Core Platform
- **Rhythm Language**: Custom templating system for adaptive educational content
- **State Compliance**: Full K-12 requirements for TX, AL, MS, CO, GA
- **Neurodivergent Support**: Built-in accommodations for ADHD, Autism, Dyslexia
- **Dual Certification**: English with Sports integrated curriculum
- **AI-Ready**: Extensible with external AI services for enhanced personalization

### Student Experience
- **Superhero-Themed Interface**: Engaging, neurodivergent-friendly design
- **Adaptive Learning Paths**: Personalized curriculum based on learning profiles
- **Progress Tracking**: Real-time monitoring with state standards alignment
- **Achievement System**: Gamified learning with milestone tracking
- **Accessibility Features**: WCAG 2.1 AA compliant with multiple accommodation options

### Educator Tools
- **Curriculum Generator**: State-aligned lesson planning with neurodivergent adaptations
- **Assessment Builder**: Accommodated testing with automatic reporting
- **Progress Analytics**: Detailed student performance insights
- **Compliance Reporting**: Automated state requirement documentation
- **Rhythm Editor**: Visual and code-based content creation

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Optional: OpenAI API key for AI features

### Installation
```bash
# Install dependencies
npm install

# Set up database
npm run db:push

# Start development server
npm run dev
```

### Production Deployment
```bash
# Build for production
npm run build

# Start production server
npm run start
```

## State Compliance Coverage

### Texas (TX)
- STAAR assessment preparation and tracking
- TEA reporting integration
- Dyslexia services compliance (TEC 38.003)
- Bilingual education support

### Alabama (AL)
- ACAP standards alignment
- Response to Instruction framework
- Career preparedness tracking

### Mississippi (MS)
- MAAP assessment integration
- Dyslexia therapy service tracking
- Multi-tiered support systems

### Colorado (CO)
- CMAS preparation tools
- READ Act compliance monitoring
- Individual Career and Academic Plans

### Georgia (GA)
- Georgia Milestones preparation
- Student Support Team processes
- Autism program supports

## English with Sports Dual Certification

Complete framework supporting:
- Combined English Language Arts and Physical Education curriculum
- State-specific certification requirements (150-400 practicum hours)
- Competency mapping between English and Sports standards
- Practicum tracking and assessment tools

## AI Integration

The platform supports integration with:
- OpenAI GPT-4 for curriculum generation
- Custom AI engines for specialized adaptations
- Real-time content personalization
- Automated assessment creation

To enable AI features, add your API key:
```env
OPENAI_API_KEY=your_api_key_here
```

## Architecture

- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js with Express, WebSocket support
- **Database**: PostgreSQL with Drizzle ORM
- **AI Services**: Pluggable architecture for multiple providers
- **Deployment**: Docker-ready with PM2 support

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For technical support or questions about deployment, please refer to the DEPLOYMENT.md guide or contact your system administrator.