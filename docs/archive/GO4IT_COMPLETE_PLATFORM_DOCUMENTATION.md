# 🏟️ Go4it Sports Academy - Complete Platform Documentation

**Version:** 2.1 (November 2025)  
**Business Model:** Online-First NCAA Readiness School  
**Contact:** info@go4itsports.org | USA: +1-205-434-8405 | EU: +43 650 564 4236  
**Website:** https://go4itsports.org  
**Locations:** Denver, CO • Vienna, AT • Dallas, TX • Mérida, MX

---

## 📝 Document Updates (v2.1)

**Key Changes from v2.0:**
- ✅ Repositioned Go4it as an **online-first NCAA readiness school**
- ✅ Added **supplemental enrollment option** for students at traditional schools
- ✅ Enhanced Go4it Academy section with three enrollment paths
- ✅ Clarified GAR testing includes **remote verification** options
- ✅ Positioned residency programs as **optional enrichment**, not core offering
- ✅ Added **supplementalCoursePlan** field to database schema
- ✅ Updated API documentation for course recommendations
- ✅ Added comprehensive **Marketing & Customer Funnel** section
- ✅ Expanded compliance section with supplemental course guidelines
- ✅ Reinforced StarPath as the **unifying operating system** for all services

**Technical Preservation:**
- ✅ All code, schemas, and API endpoints preserved verbatim
- ✅ No breaking changes to existing functionality
- ✅ All AI pipelines, automations, and integrations unchanged
- ✅ Compliance and security frameworks maintained

---

## 📋 Table of Contents

1. [Platform Overview](#platform-overview)
2. [Core Services](#core-services)
3. [Technical Architecture](#technical-architecture)
4. [Web Scrapers & Data Collection](#web-scrapers--data-collection)
5. [AI Processing Pipelines](#ai-processing-pipelines)
6. [Automation Systems](#automation-systems)
7. [Database Architecture](#database-architecture)
8. [API Endpoints](#api-endpoints)
9. [Marketing & Customer Funnel](#marketing--customer-funnel)
10. [Integration Points](#integration-points)
11. [Deployment & Operations](#deployment--operations)
12. [Security & Compliance](#security--compliance)
13. [Support & Documentation](#support--documentation)

---

## 🎯 Platform Overview

### Mission Statement
Go4it Sports Academy is an NCAA-compliant online and hybrid school built for student-athletes, uniting academic coursework, athletic verification, and behavioral development into one continuous readiness system.

### Core Value Proposition
**"Train with Data. Study with Purpose. Qualify with Go4it."**

An online-first NCAA readiness school that provides:
- **Academic Coursework** (NCAA-approved core classes via Go4it Academy)
- **Academic Tracking** (ARI - Academic Readiness Index)
- **Athletic Verification** (GAR - Game Athletic Rating)
- **Behavioral Development** (Mindset & Character)
- **NCAA Compliance** (Real-time Eligibility Tracking)
- **AI Coaching** (Self-hosted, compliant models)

Every Go4it student — full-time, supplemental, or audit-only — has a **StarPath profile**: the NCAA readiness engine that powers every feature we build.

### Target Markets
- **Primary:** Student-athletes (ages 13-19) in USA
- **Secondary:** International athletes (Austria, Europe)
- **Stakeholders:** Parents, coaches, athletic directors
- **Sports:** Football, Basketball, Soccer, Track, Baseball, Volleyball, Lacrosse, Hockey, Tennis, Golf, Swimming, Ski Jumping, Flag Football

---

## 🚀 Core Services

### 1. StarPath System™
**The NCAA Readiness Operating System**

StarPath is the unifying engine that ties together academics (ARI), athletics (GAR), and behavior into one continuous readiness profile. Every Go4it student — whether enrolled full-time, taking supplemental courses, or audit-only — has a StarPath profile that tracks their path to NCAA eligibility and college success.

#### Three Integrated Layers:

**1. ACADEMICS (ARI) – Go4it Academy**
- **ARI Score: 0-100** - Academic Readiness Index
- NCAA eligibility compliance tracking
- GPA and core course progress (16 required NCAA courses)
- Credit hour verification
- Entry point: $199 Transcript Audit

**2. ATHLETICS (GAR) – Verified Readiness Metrics**
- **GAR Score: 0-100 → 0-5 Stars** - Game Athletic Rating
- 13 sports supported
- Biomechanical analysis
- Position-specific metrics
- Combine testing events OR remote verification (video/coach upload)

**3. BEHAVIOR – Mindset & Character Development**
- Leadership assessment
- Coachability tracking
- Discipline metrics
- Coach feedback integration
- XP progression system (gamification)

#### StarPath Features:
- Real-time NCAA eligibility dashboard
- 30-day improvement plans (academic, athletic, behavioral)
- AI-generated weekly reports (Ollama-powered)
- Automated follow-ups and nudges
- Mobile-first athlete experience
- Recruiting profile integration

### 2. Transcript Audit Service
**$199 NCAA Eligibility Analysis – Gateway to Go4it**

The Transcript Audit is both an **entry point** to the Go4it system and a **diagnostic tool** for determining whether an athlete should enroll full-time, take supplemental NCAA-approved classes through Go4it Academy, or continue on their current academic path.

#### Process:
1. Upload/input high school transcript
2. Line-by-line NCAA compliance review
3. Core course verification (16 required courses)
4. GPA calculation (2.3+ for D1)
5. Credit gap identification
6. ARI score generation (0-100)
7. 30-day action plan delivery
8. **NEW:** Supplemental course path recommendation

#### Deliverables:
- Detailed eligibility report
- Core course checklist
- GPA trends analysis
- Recommended courses
- Timeline to eligibility
- NCAA Division recommendations
- **Action Plan with 3 Possible Outcomes:**
  - ✅ "Eligible for NCAA (On Track)"
  - ⚠️ "Eligible with Go4it Supplemental Classes"
  - ❌ "Ineligible – Missing Core Courses (Enrollment Recommended)"

**Audit results automatically populate ARI score and recommended path in the athlete's StarPath dashboard.**

### 3. Go4it Academy
**Online-First NCAA School Platform**

Go4it Academy is an **online school platform** delivering NCAA-approved academics integrated directly into StarPath. It serves as the academic foundation of the Go4it readiness system.

#### Who We Serve:

**Full-Time Students**
- Go4it as their primary accredited school
- Complete NCAA core curriculum online
- Integrated athletic and academic tracking
- Full StarPath profile with ARI, GAR, and Behavior

**Supplemental Students** (NEW)
- Remain enrolled in traditional public or private school
- Take NCAA-approved Go4it core classes online to:
  - Fill eligibility gaps
  - Replace non-approved courses
  - Improve GPA for NCAA readiness
  - Accelerate graduation timeline
- Credits issued via U.S. partner schools
- StarPath profile tracks combined academic progress

**International Students**
- Enroll online via Austria campus or hybrid Vienna hub
- NCAA-compliant coursework for U.S. college placement
- Support for home country curriculum requirements
- Dual-pathway academic tracking

#### Structure:
- U.S. homeschool learning provider
- Accredited school-of-record partnerships
- LMS integration with StarPath (real-time ARI updates)
- International curriculum support:
  - Austrian Matura
  - International Baccalaureate (IB)
  - A-Levels (UK)
  - Other international systems

#### NCAA Core Courses:
- **English:** 4 years (composition, literature)
- **Math:** 3 years (Algebra I, Geometry, Algebra II or higher)
- **Natural Science:** 2 years (biology, chemistry, physics)
- **Social Science:** 2 years (history, government, economics)
- **Additional:** 1 year math/science + 4 electives
- College prep (SAT/ACT)
- Advanced placement options
- Sport-specific health & wellness

#### Integration Notes:
- Academic progress feeds into `transcriptAudits` table
- Transcript Audit results trigger `supplementalCoursePlan` recommendations
- Course completion updates ARI score in real-time
- All coursework visible in athlete's StarPath dashboard

### 4. GAR Testing & Combine Events
**Verified Athletic Performance Metrics**

#### Purpose:
GAR Testing data feeds into StarPath automatically, providing verified athletic performance scores (0-100 → 0-5 Stars) that complement academic readiness. Athletes can verify results through **in-person combine events** OR **remote verification** via coach-uploaded data or video submission to receive a verified GAR score without attending a combine.

This **online-first approach** supports the Go4it school model by making athletic verification accessible globally, not just at physical testing locations.

#### Testing Locations:
- **GetVerified Denver** - Nov 21-22, 2025
- **GetVerified Vienna** - Dec 2025
- **GetVerified Dallas** - Dec 2025
- **Friday Night Lights (FNL)** - Regular showcases

#### Remote Verification Options:
- **Coach Upload:** Verified coaches submit athlete metrics directly
- **Video Submission:** Athletes submit drill/testing videos for AI analysis
- **School Partnership:** Partner schools conduct testing with Go4it protocols
- **Home Testing:** Self-recorded metrics with video verification

#### Metrics Tested:
- **Speed:** 40-yard dash, shuttle runs
- **Strength:** Bench press, squat, vertical jump
- **Agility:** Cone drills, ladder drills
- **Sport-specific:** Position drills, ball handling
- **Biomechanics:** Video analysis with AI

### 5. Residency Programs
**Optional In-Person Enrichment Experiences**

> **Note:** Residency programs are limited, optional in-person experiences layered onto the Go4it online model. They allow select student-athletes — primarily in American football and soccer — to train and study together in live environments. **The core Go4it system remains fully online and accessible globally.**

#### Vienna Soccer Academy
- **Dates:** Feb 2–Apr 3, 2026
- **Focus:** International soccer + European academics
- **Capacity:** Limited enrollment (20-30 athletes)
- **Features:**
  - Professional coaching
  - NCAA-ready coursework
  - European exposure
  - Cultural immersion
  - Full StarPath integration

#### Dallas Multi-Sport Academy
- **Dates:** Jul 6–Sep 25, 2026
- **Focus:** Football, Basketball (AAU), Flag Football
- **Capacity:** Limited enrollment (40-60 athletes)
- **Features:**
  - Combines + Transcript Audits
  - StarPath coaching
  - Recruiting exposure
  - College placement support
  - Full academic coursework available

### 6. Drill Library System (NEW)
**NCAA/FERPA-Compliant Training Platform**

Integrated with StarPath to generate individualized athletic improvement plans. Used by Go4it students to train against NCAA-level benchmarks across 13 sports. The drill library connects athletic development directly to GAR component tracking in each athlete's readiness profile.

#### Features:
- 180+ professional drills across 5 sports
- AI-powered drill tagging (Ollama)
- Self-hosted transcription (Whisper)
- Vector search for semantic discovery
- Mobile workout player
- Performance tracking (RED zone compliant)
- StarPath integration (GAR improvement tracking)

#### Sports Coverage:
- Football: 40+ drills
- Basketball: 40+ drills
- Soccer: 40+ drills
- Ski Jumping: 30+ drills
- Flag Football: 30+ drills

#### Categories:
- Strength, Speed, Agility
- Skill, Technique, Conditioning
- Position-specific training

#### StarPath Connection:
- Assigned drills appear in athlete dashboard
- Completion updates XP and behavior scores
- Performance data feeds GAR component analysis
- AI-generated improvement plans based on GAR gaps

### 7. Recruiting Hub
**College Matching & Placement with Verified Readiness Data**

Displays verified readiness data from StarPath (ARI, GAR, Behavior) for college visibility. Used for **readiness tracking — not recruiting guarantees.** The Recruiting Hub showcases NCAA-compliant student-athlete profiles to college coaches while maintaining amateur status.

#### Features:
- College database (1,200+ institutions)
- Division filtering (D1, D2, D3, NAIA, NJCAA)
- Scholarship opportunity tracking
- Coach communication tools
- Highlight reel builder
- Video analysis platform
- **StarPath Profile Integration:**
  - Display verified ARI score (academic readiness)
  - Display verified GAR score (athletic performance)
  - Display behavior/character metrics
  - Show 30-day improvement trends

#### Database Coverage:
- NCAA Division I: 350+ schools
- NCAA Division II: 300+ schools
- NCAA Division III: 450+ schools
- NAIA: 250+ schools
- NJCAA: 500+ junior colleges

#### NCAA Compliance:
- No recruiting guarantees made
- Amateur status preserved
- Transparent, verified data only
- Parental consent required for profiles
- Opt-in visibility controls

---

## 🏗️ Technical Architecture

### Technology Stack

#### Frontend
- **Framework:** Next.js 15.5.4 (App Router)
- **Language:** TypeScript 5.6
- **UI Library:** React 18.3.1
- **Styling:** Tailwind CSS 3.4.1
- **Components:** shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod validation

#### Backend
- **Runtime:** Node.js 20+
- **Server:** Express.js
- **API:** Next.js API Routes
- **Database:** PostgreSQL 15 + Drizzle ORM
- **Legacy:** MongoDB (migration in progress)

#### AI & ML
- **Self-Hosted:**
  - Ollama (localhost:11434) - 12 models
  - Whisper Docker (localhost:8000) - Transcription
- **Models:**
  - claude-educational-primary (7B)
  - claude-educational-secondary (13B)
  - Sports Analysis Model (1.2GB)
  - local_fast_llm (tagging)
  - local_embed_model (nomic-embed-text, 768D vectors)
  - 7 additional specialized models
- **Total Storage:** 10-12GB

#### Infrastructure
- **Hosting:** Replit / VPS (production)
- **CDN:** Cloudflare
- **Storage:** Cloudflare R2 (S3-compatible)
- **Video:** LiveKit (self-hosted option available)
- **Containers:** Docker + Docker Compose

#### Authentication & Payments
- **Auth:** Clerk (enterprise-grade, ready)
- **Payments:** Stripe (fully integrated)
- **Sessions:** JWT tokens

#### Design System
- **Primary:** Charcoal (#0B0F14)
- **Accent:** Cyan (#00D4FF)
- **Success:** Green (#27E36A)
- **Secondary:** Mid-gray (#5C6678)
- **Background:** Light (#E6EAF0)

---

## 🔍 Web Scrapers & Data Collection

### 1. Athlete Data Scraper (`lib/real-scraper.ts`)

#### Purpose
Collect real athlete data from public sources for recruiting database.

#### Data Sources

##### MaxPreps (High School Sports)
- **URL:** https://www.maxpreps.com
- **Coverage:** All 50 US states
- **Sports:** Football, Basketball, Baseball, Soccer, Track
- **Data Points:**
  - Athlete name
  - High school
  - Position
  - Class year (2024, 2025, 2026, 2027)
  - Statistics
  - Rankings (national, state, position)

**Implementation:**
```typescript
async scrapeMaxPreps(sport: string = 'basketball', state?: string): Promise<RealAthleteData[]>
```

**Features:**
- Cheerio HTML parsing
- Rate limiting (polite delays)
- Error handling with retries
- User-agent rotation
- Robots.txt compliance

##### 247Sports (Recruiting Rankings)
- **URL:** https://247sports.com
- **Coverage:** Top recruits nationwide
- **Data:** Rankings, commitment status, offers
- **Compliance:** Public data only, no paywall content

##### ESPN Recruiting
- **URL:** https://www.espn.com/college-sports/recruiting
- **Coverage:** D1 prospects
- **Data:** Ratings, school interest, combine metrics

##### State High School Athletic Associations
- **Examples:**
  - California: https://www.cifss.org
  - Texas: https://www.uiltexas.org
  - Florida: https://www.fhsaa.org
  - New York: https://www.nysphsaa.org

**Data Collected:**
- Player rosters
- Season statistics
- All-conference/all-state selections
- Championship results

#### International Athlete Scraper

##### American Football Sources
**1stLookSports (Europe)**
- European American football players
- EFAF (European Federation) data

**NFL International Player Pathway**
- International prospects
- European academy players

#### Data Storage
```typescript
interface RealAthleteData {
  id: string;
  name: string;
  sport: string;
  position?: string;
  classYear?: string;
  school?: string;
  state?: string;
  stats?: Record<string, any>;
  rankings?: {
    national?: number;
    state?: number;
    position?: number;
  };
  recruiting?: {
    status?: string;
    commitment?: string;
    offers?: string[];
  };
  source: string;
  url: string;
  lastUpdated: string;
  confidence: number; // 0-100
}
```

### 2. College Database Scraper (`app/api/colleges/populate/route.ts`)

#### Purpose
Maintain comprehensive database of ALL NCAA, NAIA, and NJCAA institutions.

#### Data Points Per College:
- Institution name and aliases
- Division (D1, D2, D3, NAIA, NJCAA)
- Conference affiliation
- Location (city, state, zip code)
- Enrollment statistics
- Acceptance rate
- Tuition (in-state / out-of-state)
- Athletic director contact
- Website URLs
- Team colors
- Mascot
- Sports offered (with scholarship counts)
- Coaching staff directory

#### Database Size:
- **Total Colleges:** 1,200+
- **D1 Schools:** 350+
- **D2 Schools:** 300+
- **D3 Schools:** 450+
- **NAIA:** 250+
- **NJCAA:** 500+

#### Example Entry:
```typescript
{
  name: 'University of Alabama',
  shortName: 'Alabama',
  mascot: 'Crimson Tide',
  division: 'D1',
  subdivision: 'FBS',
  conference: 'SEC',
  city: 'Tuscaloosa',
  state: 'Alabama',
  enrollment: 38563,
  tuitionInState: '12780',
  tuitionOutState: '31090',
  acceptanceRate: 80,
  athleticDirector: 'Greg Byrne',
  athleticDirectorEmail: 'gbyrne@ua.edu',
  athleticDirectorPhone: '(205) 348-6084',
  sportsOffered: [
    { name: 'football', gender: 'men', scholarships: 85, season: 'fall' },
    { name: 'basketball', gender: 'men', scholarships: 13, season: 'winter' },
    // ... more sports
  ]
}
```

### 3. Content Scraper (`automation/prompts/scraper.md`)

#### Purpose
Collect timely, relevant information for content calendar and parent education.

#### Target Sources

**NCAA & Compliance:**
- NCAA.org eligibility center updates
- NCAA Legislative Updates (LSDBi public summaries)
- State high school athletic association news

**Recruiting & Sports:**
- MaxPreps/247Sports rankings releases
- College athletic department announcements
- USA Football, US Soccer, NAIA public feeds

**Academic Calendars:**
- College Board (SAT dates)
- ACT.org (test dates)
- Common App/Coalition App deadlines
- NCAA D1/D2/D3 signing periods

**Training & Performance:**
- NSCA (National Strength & Conditioning) public articles
- Sports science journals (open access)
- Olympic training center blogs

#### Output Format:
```json
{
  "scrapedAt": "2025-11-05T10:00:00Z",
  "seeds": [
    {
      "topic": "NCAA Eligibility",
      "headline": "NCAA Adjusts GPA Requirements for 2026 Enrollees",
      "summary": "The NCAA Eligibility Center announced...",
      "source": "NCAA.org",
      "url": "https://www.ncaa.org/...",
      "relevance": "High — Directly impacts our Go4it families",
      "publishedAt": "2025-10-28",
      "tags": ["ncaa", "eligibility", "academics", "2026"]
    }
  ]
}
```

#### Compliance Rules:
1. ✅ No paywalls - Only publicly accessible content
2. ✅ Robots.txt compliant - Respect site policies
3. ✅ Attribution required - Always include source URL
4. ✅ Fact-check - Verify against official sources
5. ✅ Timely - Prioritize content from last 30 days
6. ✅ Relevant - Must connect to Go4it's mission

#### Technology:
- **Library:** Crawlee (Playwright-based)
- **Max requests:** 50 per crawl
- **Concurrency:** 2 (polite scraping)
- **Timeout:** 60 seconds per request

---

## 🤖 AI Processing Pipelines

### Overview
The AI pipelines support the **StarPath Operating System** for academic and athletic evaluation. All processing is self-hosted (NCAA/FERPA compliant) using Ollama and Whisper Docker services.

**Pipeline Purposes:**
- **Whisper Transcription:** Convert drill videos/audio to text for analysis
- **AI Tagging:** Classify drills by sport, category, skill level, GAR components
- **Vector Embeddings:** Enable semantic search for personalized drill recommendations
- **StarPath AI:** Generate improvement plans, follow-ups, and readiness reports

### 1. Drill Library AI Pipeline

#### Architecture: Event-Driven, Self-Hosted

**6-Stage Pipeline:**
```
Upload → Whisper → AI Tagging → Embeddings → Approval → Publish
```

#### Stage 1: Upload (Cloudflare R2)
**Location:** `app/api/drills/upload/route.ts`

**Process:**
1. Receive video/audio file
2. Validate file type (video/audio/image)
3. Upload to Cloudflare R2 bucket
4. Generate CDN URL
5. Create mediaAsset record in database
6. Emit `media.uploaded` event

**Zone Classification:**
- GREEN: Public drill demonstrations
- RED: Athlete performance recordings

**Environment Variables:**
```bash
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=go4it-drills
CLOUDFLARE_CDN_URL=https://cdn.go4itsports.com
```

#### Stage 2: Whisper Transcription (Self-Hosted)
**Location:** `workers/whisper-transcription.ts`

**Process:**
1. Listen for `media.uploaded` event
2. Download audio from R2
3. Extract audio from video (if needed) using ffmpeg
4. Send to Whisper Docker service
5. Receive transcript + confidence scores
6. Store transcript in mediaAsset record
7. Emit `media.transcribed` event

**Whisper Models:**
- **tiny:** Fastest, less accurate (~1GB)
- **base:** Good balance (~1.5GB) - **DEFAULT**
- **small:** Better accuracy (~2.5GB)
- **medium:** Very accurate (~5GB)
- **large:** Best accuracy (~10GB)

**Docker Setup:**
```bash
docker run -d -p 8000:8000 \
  --name whisper-service \
  --restart unless-stopped \
  ghcr.io/openai/whisper:latest
```

**Environment Variables:**
```bash
WHISPER_SERVICE_URL=http://localhost:8000
WHISPER_MODEL=base
```

**Processing Time:**
- 1 minute video: ~5-15 seconds
- 5 minute video: ~20-60 seconds
- 10 minute video: ~45-120 seconds

#### Stage 3: AI Tagging (Ollama)
**Location:** `workers/ai-tagging.ts`

**Process:**
1. Listen for `media.transcribed` event
2. Fetch drill + transcript
3. Build tagging prompt with context
4. Call Ollama `local_fast_llm` model
5. Extract structured tags from response
6. Update drill record with:
   - Sport classification
   - Category (strength, speed, agility, etc.)
   - Skill level (beginner, intermediate, advanced, elite)
   - Equipment needed
   - Coaching points
   - GAR component mapping
7. Emit `drill.tagged` event

**Ollama Model:** claude-educational-primary (7B)

**Prompt Template:**
```
Analyze this training drill video transcript and extract:
- Sport (football, basketball, soccer, etc.)
- Category (strength, speed, agility, skill, technique, conditioning)
- Skill level (beginner, intermediate, advanced, elite)
- Equipment needed (list all)
- Key coaching points (3-5 bullet points)
- GAR components addressed (speed, strength, agility, etc.)

Transcript: {transcript}

Respond in JSON format.
```

**Environment Variables:**
```bash
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_FAST_MODEL=claude-educational-primary:7b
```

#### Stage 4: Vector Embeddings (Ollama)
**Location:** `workers/embeddings.ts`

**Process:**
1. Listen for `drill.tagged` event
2. Build comprehensive embedding prompt:
   ```
   Sport: {sport}
   Category: {category}
   Title: {title}
   Description: {description}
   Transcript: {transcript}
   Equipment: {equipment}
   Coaching Points: {coachingPoints}
   ```
3. Call Ollama `local_embed_model` (nomic-embed-text)
4. Receive 768-dimensional vector
5. Store embeddings in drill record
6. Emit `drill.embedded` event

**Semantic Search:**
```typescript
async function searchDrillsBySimilarity(
  query: string,
  filters?: {
    sport?: string;
    category?: string;
    skillLevel?: string;
  },
  limit = 10
): Promise<Drill[]>
```

**Environment Variables:**
```bash
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_EMBED_MODEL=nomic-embed-text
```

#### Stage 5: Human Approval
**Location:** Admin dashboard

**Process:**
1. Review auto-tagged drill
2. Verify accuracy of:
   - Sport classification
   - Category assignment
   - Skill level rating
   - Equipment list
   - Coaching points
3. Edit if needed
4. Approve or reject
5. Emit `drill.approved` event (on approval)

#### Stage 6: Publish
**Process:**
1. Listen for `drill.approved` event
2. Update drill status to 'published'
3. Make available in public library (if GREEN zone)
4. Add to search index
5. Notify relevant coaches
6. Emit `drill.published` event

### 2. Event System Architecture

**Location:** `lib/events/drill-events.ts`

#### Event Types (10 Total):
```typescript
type DrillEventType =
  | 'media.uploaded'
  | 'media.transcribed'
  | 'drill.tagged'
  | 'drill.embedded'
  | 'drill.approved'
  | 'drill.published'
  | 'drill.assigned'
  | 'drill.completed'
  | 'drill.rated'
  | 'workout.assigned';
```

#### Core Classes:

**DrillEventEmitter:**
- Type-safe event emission
- Console logging with emojis
- Zone warnings for RED zone data

**EventMonitor:**
- Event count tracking
- Last emitted timestamps
- Average processing time calculation

**PipelineTracker:**
- Stage progression monitoring
- Processing time per stage
- Pipeline completion detection
- Total processing time calculation

**WebhookManager:**
- External integration support
- Zone-based filtering
- Retry logic with exponential backoff

#### Usage Example:
```typescript
import { drillEvents, pipelineTracker } from '@/lib/events/drill-events';

// Emit event
drillEvents.emit('media.uploaded', {
  mediaAssetId: 'asset-123',
  filename: 'squat-tutorial.mp4',
  fileType: 'video',
  storageUrl: 'https://cdn.go4itsports.com/drills/squat-tutorial.mp4',
  uploadedBy: 'coach-456',
  zone: 'GREEN'
});

// Listen for event
drillEvents.on('media.transcribed', async (event) => {
  console.log(`Transcript ready: ${event.wordCount} words`);
  // Trigger next stage
});

// Track pipeline
pipelineTracker.recordStage('asset-123', {
  stage: 'transcription',
  status: 'completed',
  timestamp: new Date(),
  processingTime: 5432 // ms
});
```

### 3. StarPath AI Services

#### Location: `ai-engine/starpath/`

**Services Supporting the StarPath Operating System:**

1. `starpath-summary.ts` - Generate athlete dashboard summaries
   - Analyzes ARI, GAR, and Behavior scores
   - Provides holistic NCAA readiness overview
   - Identifies strengths and gaps

2. `starpath-followup.ts` - Create personalized follow-up messages
   - Academic nudges (missing courses, GPA improvements)
   - Athletic reminders (drill assignments, GAR testing)
   - Behavioral encouragement (XP milestones, streaks)

3. `starpath-content.ts` - Generate social media content
   - Athlete achievement highlights
   - ARI/GAR improvement stories
   - NCAA eligibility milestone celebrations

4. `starpath-plan.ts` - Build 30-day improvement plans
   - Academic: Course recommendations, study schedules
   - Athletic: Drill assignments, GAR component focus
   - Behavioral: Leadership activities, character development

#### Usage:
```typescript
import { generateStarPathSummary } from '@/ai-engine/starpath/starpath-summary';

const summary = await generateStarPathSummary({
  athleteId: 'athlete-123',
  includeRecommendations: true,
  includeNextSteps: true
});
```

**Output:**
```typescript
interface StarPathSummary {
  athleteId: string;
  ari: {
    score: number;
    status: 'on-track' | 'at-risk' | 'needs-review';
    coreCoursesCompleted: number;
    coreCoursesRequired: number;
    currentGPA: number;
    ncaaEligibility: 'eligible' | 'partial' | 'ineligible';
  };
  gar: {
    score: number;
    stars: number; // 0-5
    lastTested: Date;
    improvements: string[];
  };
  behavior: {
    score: number;
    leadership: number;
    coachability: number;
    discipline: number;
  };
  recommendations: string[];
  nextSteps: string[];
  generatedAt: Date;
}
```

---

## ⚙️ Automation Systems

### Overview
Automation systems provide the operational backbone for the Go4it online school model, handling parent communications, content marketing showcasing student success, and personalized academic/athletic follow-ups through the StarPath system.

### 1. Content Calendar Automation

**Location:** `app/api/automation/content-calendar/route.ts`

#### Purpose
Auto-schedule 3-5 social media posts per week showcasing platform features.

#### Weekly Schedule:
```typescript
const WEEKLY_SCHEDULE = [
  { day: 'Monday', time: '09:00', contentType: 'gar-score' },
  { day: 'Tuesday', time: '18:00', contentType: 'parent-night' },
  { day: 'Thursday', time: '10:00', contentType: 'recruiting' },
  { day: 'Friday', time: '15:00', contentType: 'starpath' },
  { day: 'Sunday', time: '12:00', contentType: 'athlete-story' }
];
```

#### Content Types:
1. **gar-score** - GAR test results, athlete rankings
2. **parent-night** - Free info session promotions
3. **recruiting** - College signing announcements
4. **starpath** - ARI improvements, NCAA eligibility milestones
5. **athlete-story** - Success stories, testimonials

#### API Usage:
```bash
# Generate next 2 weeks of content
curl -X POST http://localhost:3000/api/automation/content-calendar \
  -H "Content-Type: application/json" \
  -d '{
    "weeksAhead": 2,
    "platforms": ["instagram", "facebook", "twitter"],
    "useAI": true
  }'
```

**Response:**
```json
{
  "success": true,
  "calendars": [
    {
      "week": 1,
      "posts": [
        {
          "id": "post-1",
          "contentType": "gar-score",
          "platform": "instagram",
          "text": "🎯 Meet Jordan - went from 2.8 to 4.2 GAR...",
          "scheduledFor": "2025-11-11T09:00:00Z",
          "status": "scheduled"
        }
      ]
    }
  ]
}
```

### 2. Parent Night Automation

**Location:** `app/api/automation/parent-night/route.ts`

#### Purpose
100% FREE communication sequences for Parent Night funnel.

#### Sequences:

**Tuesday Info Session:**
1. Immediate confirmation email
2. Immediate SMS (via email-to-SMS gateway)
3. 24-hour reminder email
4. 1-hour reminder SMS

**Thursday Info Session:**
1. Immediate confirmation email
2. Immediate SMS
3. 24-hour reminder email
4. 1-hour reminder SMS

**Monday Onboarding:**
1. Immediate confirmation email
2. Immediate SMS
3. Morning-of reminder (9am)

#### Email Templates:
- Professional HTML design
- Personalized with athlete name
- Agenda bullet points
- Zoom/Calendar links
- Call-to-action buttons

#### SMS Templates:
- Under 160 characters
- Personalized
- Emoji for engagement
- Shortened URL links

#### Free SMS Implementation:
```typescript
// Email-to-SMS gateway (Verizon example)
const smsEmail = `${phone}@vtext.com`;

await sendEmail({
  to: smsEmail,
  subject: '', // Empty for SMS
  text: `📚 ${name}, Parent Night TODAY at 7 PM! Join: go4it.org/tuesday`
});
```

#### Supported Carriers:
- Verizon: `@vtext.com`
- AT&T: `@txt.att.net`
- T-Mobile: `@tmomail.net`
- Sprint: `@messaging.sprintpcs.com`

### 3. StarPath Follow-Up Automation

**Location:** `app/api/automation/starpath-followup/route.ts`

#### Purpose
GPT-powered personalized follow-up messages after Transcript Audits.

#### Triggers:
1. Transcript Audit completed
2. GAR test completed
3. Parent Night attended
4. 30-day plan milestone reached

#### Message Generation:
```typescript
const message = await generateFollowUpMessage({
  athleteId: 'athlete-123',
  context: 'transcript_audit_completed',
  ari: 67,
  garScore: 42,
  nextStep: 'Schedule GAR verification test'
});
```

**Output:**
- Email (HTML)
- SMS (plain text, <160 chars)
- Social media DM (platform-specific formatting)

#### Content Includes:
- Personalized greeting
- Current ARI/GAR scores
- Specific achievements
- Gap analysis
- Next recommended actions
- Motivational closing

### 4. Scraper Automation Schedule

#### Recommended Cron Jobs:

**Daily (Every Morning at 6 AM):**
```bash
0 6 * * * /usr/local/bin/scrape-ncaa-updates.sh
```
- NCAA eligibility center updates
- Test date changes (SAT/ACT)
- Application deadlines

**Weekly (Monday at 8 AM):**
```bash
0 8 * * 1 /usr/local/bin/scrape-rankings.sh
```
- MaxPreps rankings updates
- 247Sports recruiting updates
- State athletic association news

**Monthly (1st of month at 3 AM):**
```bash
0 3 1 * * /usr/local/bin/scrape-colleges.sh
```
- College database refresh
- Coaching staff changes
- Scholarship availability updates

---

## 🗄️ Database Architecture

### PostgreSQL Schema (Drizzle ORM)

#### Core Tables:

**1. users**
```typescript
{
  id: uuid,
  clerkId: string (unique),
  email: string,
  name: string,
  role: 'athlete' | 'parent' | 'coach' | 'admin',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**2. athletes**
```typescript
{
  id: uuid,
  userId: uuid (FK),
  dateOfBirth: date,
  grade: integer,
  graduationYear: integer,
  primarySport: string,
  height: string,
  weight: integer,
  position: string,
  garScore: decimal,
  garStars: integer (0-5),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**3. transcriptAudits**
```typescript
{
  id: uuid,
  athleteId: uuid (FK),
  status: 'pending' | 'processing' | 'completed',
  ariScore: decimal (0-100),
  currentGPA: decimal,
  coreCoursesCompleted: integer,
  coreCoursesRequired: integer,
  ncaaEligibility: 'on-track' | 'at-risk' | 'needs-review',
  auditReport: jsonb,
  actionPlan: jsonb,
  
  // NEW: Supplemental Course Recommendations
  supplementalCoursePlan: jsonb,
  // {
  //   recommendedCourses: ['Algebra II', 'English III'],
  //   enrollmentStatus: 'recommended' | 'in-progress' | 'completed',
  //   priorityLevel: 'critical' | 'recommended' | 'optional',
  //   estimatedCompletionDate: timestamp
  // }
  
  completedAt: timestamp,
  createdAt: timestamp
}
```

**4. colleges**
```typescript
{
  id: uuid,
  name: string,
  shortName: string,
  division: 'D1' | 'D2' | 'D3' | 'NAIA' | 'NJCAA',
  subdivision: 'FBS' | 'FCS' | null,
  conference: string,
  city: string,
  state: string,
  enrollment: integer,
  tuitionInState: decimal,
  tuitionOutState: decimal,
  acceptanceRate: integer,
  athleticDirector: string,
  athleticDirectorEmail: string,
  athleticDirectorPhone: string,
  website: string,
  athleticsWebsite: string,
  primaryColor: string,
  secondaryColor: string,
  mascot: string,
  contactsVerified: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**5. sportsPrograms**
```typescript
{
  id: uuid,
  collegeId: uuid (FK),
  sport: string,
  gender: 'men' | 'women',
  scholarshipsAvailable: integer,
  season: 'fall' | 'winter' | 'spring' | 'year-round',
  divisionLevel: string,
  createdAt: timestamp
}
```

**6. coachingStaff**
```typescript
{
  id: uuid,
  collegeId: uuid (FK),
  firstName: string,
  lastName: string,
  title: string,
  sport: string,
  gender: 'men' | 'women',
  email: string,
  phone: string,
  recruitingEmail: string,
  twitterHandle: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Drill Library Tables:

**7. mediaAssets**
```typescript
{
  id: uuid,
  filename: string,
  fileType: 'video' | 'audio' | 'image',
  mimeType: string,
  fileSize: bigint,
  duration: integer (seconds),
  storageUrl: string (R2),
  cdnUrl: string,
  thumbnailUrl: string,
  zone: 'GREEN' | 'YELLOW' | 'RED',
  
  // Transcription
  transcript: text,
  transcriptConfidence: decimal,
  transcriptionStatus: 'pending' | 'processing' | 'completed' | 'failed',
  transcribedAt: timestamp,
  
  // AI Processing
  aiTags: jsonb,
  vectorEmbeddings: vector(768),
  embeddingsGenerated: boolean,
  
  // Metadata
  uploadedBy: uuid (FK users),
  processingLog: jsonb,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**8. drills**
```typescript
{
  id: uuid,
  title: string,
  description: text,
  sport: string,
  category: 'strength' | 'speed' | 'agility' | 'skill' | 'technique' | 'conditioning',
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'elite',
  duration: integer (minutes),
  sets: integer,
  reps: integer,
  restPeriod: integer (seconds),
  
  // Equipment & Setup
  equipment: jsonb,
  spaceRequired: string,
  setupInstructions: text,
  
  // Coaching
  keyPoints: jsonb,
  commonMistakes: jsonb,
  progressions: jsonb,
  regressions: jsonb,
  coachingCues: jsonb,
  
  // GAR Mapping
  garComponents: jsonb,
  ariAlignment: jsonb,
  behaviorFocus: jsonb,
  
  // Media
  videoMediaId: uuid (FK mediaAssets),
  imageMediaId: uuid (FK mediaAssets),
  
  // Ratings & Analytics
  avgRating: decimal,
  totalRatings: integer,
  avgDifficulty: decimal,
  avgEffectiveness: decimal,
  completionCount: integer,
  
  // Publishing
  status: 'draft' | 'pending_review' | 'published' | 'archived',
  zone: 'GREEN' | 'YELLOW' | 'RED',
  visibility: 'public' | 'coaches_only' | 'private',
  featuredOrder: integer,
  
  createdBy: uuid (FK users),
  approvedBy: uuid (FK users),
  approvedAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**9. workoutTemplates**
```typescript
{
  id: uuid,
  title: string,
  description: text,
  sport: string,
  focusArea: string,
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'elite',
  totalDuration: integer (minutes),
  
  // Structure
  drillSequence: jsonb, // [{ drillId, order, duration, sets, reps, restAfter }]
  warmupDrills: jsonb,
  mainDrills: jsonb,
  cooldownDrills: jsonb,
  
  // Metadata
  targetAudience: jsonb,
  seasonPhase: 'pre-season' | 'in-season' | 'post-season' | 'off-season',
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly',
  
  status: 'draft' | 'published' | 'archived',
  createdBy: uuid (FK users),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**10. athleteDrillAssignments**
```typescript
{
  id: uuid,
  athleteId: uuid (FK athletes),
  drillId: uuid (FK drills),
  workoutTemplateId: uuid (FK workoutTemplates),
  
  // Assignment
  assignedBy: uuid (FK users, coach),
  assignedAt: timestamp,
  dueDate: timestamp,
  priority: 'low' | 'medium' | 'high',
  
  // Completion
  status: 'assigned' | 'in_progress' | 'completed' | 'skipped',
  startedAt: timestamp,
  completedAt: timestamp,
  actualDuration: integer (minutes),
  
  // Performance (RED ZONE)
  performanceNotes: text,
  selfRating: integer (1-5),
  coachRating: integer (1-5),
  coachFeedback: text,
  videoRecordingId: uuid (FK mediaAssets),
  
  // XP & Gamification
  xpEarned: integer,
  bonusXp: integer,
  streakBonus: integer,
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**11. drillRatings** (YELLOW ZONE - Anonymizable)
```typescript
{
  id: uuid,
  drillId: uuid (FK drills),
  athleteId: uuid (FK athletes),
  
  // Ratings
  overallRating: integer (1-5),
  difficultyRating: integer (1-5),
  effectivenessRating: integer (1-5),
  funRating: integer (1-5),
  
  // Feedback
  comment: text,
  wouldRecommend: boolean,
  
  // Anonymization Support
  anonymized: boolean,
  anonymizedAt: timestamp,
  
  createdAt: timestamp
}
```

**12. drillCollections**
```typescript
{
  id: uuid,
  title: string,
  description: text,
  drillIds: jsonb, // Array of drill IDs
  
  // Categorization
  collectionType: 'beginner_path' | 'position_specific' | 'injury_recovery' | 'pre_combine' | 'featured',
  sport: string,
  targetAudience: jsonb,
  
  // Display
  coverImage: string,
  featured: boolean,
  displayOrder: integer,
  
  status: 'draft' | 'published' | 'archived',
  createdBy: uuid (FK users),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Indexes:
```sql
-- Performance indexes
CREATE INDEX idx_athletes_gar_score ON athletes(garScore DESC);
CREATE INDEX idx_colleges_division ON colleges(division);
CREATE INDEX idx_drills_sport_category ON drills(sport, category);
CREATE INDEX idx_drills_embeddings ON drills USING ivfflat (vectorEmbeddings vector_cosine_ops);
CREATE INDEX idx_assignments_athlete_status ON athleteDrillAssignments(athleteId, status);
```

---

## 🔌 API Endpoints

### Authentication

**POST /api/auth/register**
- Create new user account
- Body: `{ email, password, name, role }`

**POST /api/auth/login**
- Authenticate user
- Body: `{ email, password }`

### StarPath

**GET /api/starpath/summary?athleteId={id}**
- Get athlete's StarPath dashboard data
- Returns: ARI, GAR, Behavior scores + recommendations
- **NEW:** Includes supplemental course recommendations if applicable

**POST /api/transcript-audits**
- Create new transcript audit
- Body: `{ athleteId, transcriptData }`
- Triggers: Followup automation + supplemental course plan generation

**GET /api/transcript-audits?athleteId={id}**
- List audits for athlete
- Includes supplemental course recommendations

**GET /api/transcript-audits/{id}**
- Get specific audit details
- Full report with action plan and course recommendations

### Colleges

**GET /api/colleges/comprehensive**
- Query parameters:
  - `division` - D1, D2, D3, NAIA, NJCAA
  - `state` - Two-letter state code
  - `sport` - Sport name
  - `search` - Text search
  - `limit` - Max results (default 50)

**POST /api/colleges/populate**
- Admin only: Populate college database
- Inserts 1,200+ institutions

### Drills

**GET /api/drills**
- Query parameters:
  - `sport` - Filter by sport
  - `category` - Filter by category
  - `skillLevel` - Filter by skill level
  - `search` - Semantic search query
  - `limit` - Max results (default 20)

**POST /api/drills/upload**
- Upload drill video/audio
- Multipart form data
- Triggers: AI pipeline

**POST /api/drills/complete-workout**
- Mark workout as completed
- Body: `{ assignmentId, athleteId, performanceData }`

### Automation

**POST /api/automation/content-calendar**
- Generate social media content schedule
- Body: `{ weeksAhead, platforms, useAI }`

**POST /api/automation/parent-night**
- Trigger Parent Night email/SMS sequence
- Body: `{ name, email, phone, athleteName, rsvpType }`

**POST /api/automation/starpath-followup**
- Generate personalized follow-up message
- Body: `{ athleteId, context, nextStep }`

### Social Media

**GET /api/social-media/campaigns**
- List all campaigns

**POST /api/social-media/generate**
- Generate social media content with AI
- Body: `{ feature, platform, customPrompt, athleteData }`

**POST /api/screenshots**
- Generate feature screenshots for social media
- Body: `{ feature, athleteId }`

---

## 🔗 Integration Points

### 1. Clerk Authentication
- User registration & login
- Session management
- Role-based access control
- SSO support (Google, Facebook, etc.)

### 2. Stripe Payments
- One-time payments ($199 Transcript Audit)
- Subscription billing (monthly coaching plans)
- Invoice generation
- Payment history

### 3. Cloudflare
- **R2 Storage:** Video/audio file hosting
- **CDN:** Fast content delivery
- **DNS:** Domain management
- **Analytics:** Traffic monitoring

### 4. LiveKit (Optional)
- Video conferencing (Parent Nights)
- 1-on-1 coaching sessions
- Live events streaming

### 5. OpenAI / Anthropic (Optional)
- GPT-4 for complex content generation
- Claude for educational content
- **Note:** Self-hosted Ollama preferred for RED zone

### 6. Email Services
- **SMTP:** Nodemailer for transactional emails
- **Email-to-SMS:** Free SMS via carrier gateways
- **Templates:** HTML email design

### 7. Monitoring
- **Winston:** Application logging
- **PostHog:** Product analytics (optional)
- **Sentry:** Error tracking (optional)

---

## 🚀 Deployment & Operations

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/go4it

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Payments (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudflare R2
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=go4it-drills
CLOUDFLARE_CDN_URL=https://cdn.go4itsports.com

# AI Services
OLLAMA_BASE_URL=http://localhost:11434
WHISPER_SERVICE_URL=http://localhost:8000
WHISPER_MODEL=base

# OpenAI (Optional, for GPT-4 features)
OPENAI_API_KEY=sk-...

# LiveKit (Optional)
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
LIVEKIT_URL=wss://your-livekit-server.com
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-server.com

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@go4itsports.org

# Site
NEXT_PUBLIC_APP_URL=https://go4itsports.org
NEXT_PUBLIC_SITE_URL=https://go4itsports.org

# Feature Flags
FEATURE_SMART_ROUTING=false
FEATURE_PROGRESSIVE_LOADING=false
FEATURE_PERFORMANCE_MONITORING=true
FEATURE_PREDICTIVE_CACHING=false
```

### Docker Setup

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
      - ollama
      - whisper

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_USER=go4it
      - POSTGRES_PASSWORD=secure_password
      - POSTGRES_DB=go4it
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  ollama:
    image: ollama/ollama:latest
    volumes:
      - ollama_data:/root/.ollama
    ports:
      - "11434:11434"

  whisper:
    image: ghcr.io/openai/whisper:latest
    ports:
      - "8000:8000"

volumes:
  postgres_data:
  ollama_data:
```

### Deployment Steps

1. **Initial Setup:**
```bash
# Clone repository
git clone https://github.com/Shatzii/Go4it-V2.git
cd Go4it-V2

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your values

# Database migration
npm run db:generate
npm run db:migrate

# Seed colleges
curl -X POST http://localhost:3000/api/colleges/populate

# Seed drills
npx tsx scripts/seed-drills.ts
```

2. **Start Services:**
```bash
# Development
npm run dev

# Production (with Docker)
docker-compose up -d

# Production (without Docker)
npm run build
npm run start
```

3. **Verify Services:**
```bash
# Check Ollama
curl http://localhost:11434/api/tags

# Check Whisper
curl http://localhost:8000/health

# Check database
psql $DATABASE_URL -c "SELECT COUNT(*) FROM colleges;"
```

### Monitoring

**Health Check Endpoint:**
```bash
curl http://localhost:3000/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "services": {
    "database": "connected",
    "ollama": "running",
    "whisper": "running",
    "r2": "accessible"
  },
  "version": "2.0",
  "uptime": 86400
}
```

### Backup Strategy

**Database Backups (Daily):**
```bash
# Automated backup script
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/go4it_$(date +\%Y\%m\%d).sql.gz
```

**R2 Storage Backups:**
- Cloudflare R2 provides automatic redundancy
- Use versioning for critical files
- Export metadata to database for recovery

**Ollama Models:**
- Models stored in Docker volume
- Backup volume: `docker run --rm -v ollama_data:/data -v $(pwd):/backup ubuntu tar cvf /backup/ollama_backup.tar /data`

---

## 📊 Key Metrics & Analytics

### Platform Metrics
- Total registered athletes
- Active users (last 30 days)
- Transcript audits completed
- GAR tests administered
- Drills completed
- Workouts assigned/completed
- College matches made

### Business Metrics
- Revenue (Transcript Audits)
- Conversion rate (Parent Night → Audit)
- Retention rate (monthly active)
- NPS score
- Average ARI improvement
- Average GAR improvement

### Technical Metrics
- API response time (p50, p95, p99)
- Database query time
- Ollama inference time
- Whisper transcription time
- R2 upload/download speed
- Error rate
- Uptime

---

## � Marketing & Customer Funnel

### Customer Journey Overview

Go4it's funnel is designed to educate families about NCAA eligibility while demonstrating the value of our online school model through progressive engagement.

| Funnel Stage | Description | Primary CTA | Typical Timeline |
|-------------|-------------|-------------|------------------|
| **Awareness** | Social media, ads, word-of-mouth | Learn More | Day 0 |
| **Education** | Free Parent Night info sessions | RSVP for Parent Night | Day 1-7 |
| **Evaluation** | $199 Transcript Audit + StarPath setup | Start Audit | Day 8-14 |
| **Enrollment Decision** | Audit results show 3 paths: | See Results | Day 15-21 |
| | • On Track (continue current school) | Monitor via StarPath | |
| | • Supplemental Courses Needed | Enroll in Courses | |
| | • Full Enrollment Recommended | Join Go4it Academy | |
| **Active Student** | Academic + Athletic tracking via StarPath | Access Dashboard | Ongoing |
| **Optional Enrichment** | Residency programs, GAR events | Register for Event | Seasonal |

### Enrollment Paths Explained

**Path 1: StarPath Monitoring Only**
- Athlete is NCAA-eligible at current school
- Purchase StarPath access ($49/month or included with audit)
- Monitor ARI, track GAR, behavioral development
- Access drill library and recruiting hub

**Path 2: Supplemental Enrollment**
- Athlete needs specific NCAA core courses
- Enroll in 1-4 Go4it courses while staying at current school
- Pricing: $399-799 per course per semester
- Full StarPath integration
- Credits transfer via school-of-record partner

**Path 3: Full-Time Enrollment**
- Athlete switches to Go4it as primary school
- Complete NCAA core curriculum online
- Pricing: $4,995-7,995 per semester (sliding scale)
- Full StarPath + drill library + recruiting hub
- Optional: Residency program add-ons

### Content Marketing Strategy

The Content Calendar automation (see [Automation Systems](#automation-systems)) generates 3-5 posts per week showcasing:
- **Student Success Stories:** ARI improvements, GAR advancements
- **NCAA Education:** Eligibility tips, deadline reminders, rule changes
- **Parent Testimonials:** Real families sharing Go4it impact
- **Behind-the-Scenes:** Drill library features, coach highlights
- **Event Promotions:** Parent Nights, GAR testing, residency programs

---

## �🔐 Security & Compliance

### Data Zones

**🔴 RED Zone (Maximum Protection)**
- Athlete PII (names, birthdates, SSN)
- Performance data
- Video analysis results
- Whisper transcripts
- Coach feedback
- **Processing:** Self-hosted ONLY (Whisper + Ollama)

**🟡 YELLOW Zone (Anonymizable)**
- Aggregated statistics
- Drill ratings
- Anonymous feedback
- De-identified trends
- **Processing:** Self-hosted OR anonymized external

**🟢 GREEN Zone (Public)**
- Public drill library
- Marketing content
- Event information
- Blog posts
- **Processing:** External APIs allowed

### Compliance

**NCAA Rules:**
- No recruiting guarantees
- Amateur status preserved
- Transparent pricing
- Verified data only
- School operates within NCAA academic eligibility guidelines

**FERPA:**
- Parental consent required (< 18)
- Secure transcript handling
- Access logs maintained
- Data portability

**GDPR (EU Athletes):**
- Right to access
- Right to erasure
- Data portability
- Explicit consent
- Privacy by design

**Supplemental Course Compliance:**
Go4it also provides supplemental NCAA-approved core courses for student-athletes attending other schools. Families must coordinate with their primary institution to ensure proper credit transfer or NCAA recognition. Go4it issues credits through accredited U.S. school-of-record partners recognized by the NCAA Eligibility Center.

---

## 📞 Support & Documentation

### For Athletes & Parents
- **Email:** info@go4itsports.org
- **USA Phone:** +1-205-434-8405
- **EU Phone:** +43 650 564 4236
- **Help Center:** https://help.go4itsports.org
- **Parent Night:** Tuesdays & Thursdays 7 PM

### For Developers
- **Technical Docs:** /docs
- **API Docs:** /docs/api
- **GitHub:** https://github.com/Shatzii/Go4it-V2
- **Issues:** GitHub Issues
- **Contributing:** CONTRIBUTING.md

### For Coaches & Partners
- **Partnership Inquiries:** partnerships@go4itsports.org
- **Recruiting Network:** recruiting@go4itsports.org
- **Event Hosting:** events@go4itsports.org

---

## 🎓 Training Resources

### Video Tutorials
- Platform walkthrough
- Transcript audit process
- GAR testing preparation
- Drill library usage
- Mobile app training

### Documentation
- User guides (PDF)
- Coach handbook
- Admin manual
- API documentation
- Integration guides

---

**Last Updated:** November 5, 2025  
**Document Version:** 2.1 (Online-First School Model)  
**Platform Version:** Go4it OS 2.0  
**Business Model:** NCAA Readiness School (Full-Time + Supplemental Enrollment)

---

*This documentation is maintained by the Go4it development team. For updates or corrections, please submit a pull request or contact the technical team.*

## 💡 Quick Reference

### For New Developers:
- Start with [Platform Overview](#platform-overview) and [Technical Architecture](#technical-architecture)
- Review [Database Architecture](#database-architecture) for schema understanding
- Check [AI Processing Pipelines](#ai-processing-pipelines) for event-driven workflows
- Reference [API Endpoints](#api-endpoints) for integration development

### For Marketing/Sales:
- Review [Platform Overview](#platform-overview) for positioning
- Study [Marketing & Customer Funnel](#marketing--customer-funnel) for enrollment paths
- Reference [Core Services](#core-services) for feature explanations
- Use [Support & Documentation](#support--documentation) for customer resources

### For School Administrators:
- Focus on [Go4it Academy](#3-go4it-academy) enrollment options
- Review [Transcript Audit Service](#2-transcript-audit-service) for intake process
- Study [StarPath System](#1-starpath-system) for student tracking
- Reference [Compliance](#compliance) for NCAA/FERPA requirements

### For Athletic Directors/Coaches:
- Review [GAR Testing](#4-gar-testing--combine-events) for athlete evaluation
- Study [Drill Library System](#6-drill-library-system-new) for training resources
- Reference [Recruiting Hub](#7-recruiting-hub) for college placement
- Check [Automation Systems](#automation-systems) for parent communications
