# 🏋️ Go4it Drill Library System

Complete NCAA/FERPA/GDPR-compliant training drill and workout management system with self-hosted AI pipeline.

## 📋 Overview

The Drill Library System provides a comprehensive platform for managing, discovering, and executing training drills across 5 sports:
- 🏈 Football
- 🏀 Basketball
- ⚽ Soccer
- ⛷️ Ski Jumping
- 🚩 Flag Football

### Key Features

- **RED/YELLOW/GREEN Zone Architecture** - Data sensitivity-based processing
- **Self-Hosted AI Pipeline** - Whisper + Ollama (NCAA/FERPA compliant)
- **Cloudflare R2 Storage** - Scalable video/media hosting
- **Mobile-First Design** - Dedicated mobile athlete routes (/m/*)
- **StarPath Integration** - GAR/ARI component mapping
- **Event-Driven Pipeline** - Decoupled processing stages
- **Semantic Search** - Vector embeddings for intelligent drill discovery

---

## 🏗️ Architecture

### Database Schema (6 Tables)

#### 1. `mediaAssets` (Hybrid: GREEN/RED)
- Video/audio/image storage with Cloudflare R2
- Whisper transcription support
- Vector embeddings for semantic search
- Processing pipeline tracking

#### 2. `drills` (Hybrid: GREEN/RED)
- 35+ fields covering all aspects of training drills
- Sport-specific categorization (5 sports)
- GAR/ARI/Behavior mapping
- AI-generated and manual tags
- Equipment, setup, coaching points
- Success metrics and assessment criteria

#### 3. `workoutTemplates` (Hybrid: GREEN/RED)
- Multi-drill workout sequences
- Warmup/main/cooldown structure
- Position-specific and season-specific templates

#### 4. `athleteDrillAssignments` (RED ZONE)
- Personalized drill assignments
- Due dates and priority levels
- Performance tracking
- Coach feedback and athlete reflection

#### 5. `drillRatings` (YELLOW ZONE)
- Aggregated drill feedback
- Anonymization support
- Multiple rating dimensions (difficulty, effectiveness, fun)

#### 6. `drillCollections`
- Curated drill sets
- Featured collections
- Beginner paths, position-specific, injury recovery

---

## 🔄 AI Processing Pipeline

### 6-Stage Pipeline Flow

```
1. UPLOAD → Cloudflare R2
   ↓ (media.uploaded event)
   
2. WHISPER → Self-hosted transcription
   ↓ (media.transcribed event)
   
3. AI TAGGING → local_fast_llm classification
   ↓ (drill.tagged event)
   
4. EMBEDDINGS → local_embed_model vectors
   ↓ (drill.embedded event)
   
5. APPROVAL → Human review
   ↓ (drill.approved event)
   
6. PUBLISH → Public library
   (drill.published event)
```

### Event System

**10 Event Types:**
- `media.uploaded` - New media uploaded to R2
- `media.transcribed` - Whisper transcription complete
- `drill.tagged` - AI tagging complete
- `drill.embedded` - Vector embeddings generated
- `drill.approved` - Admin/coach approval
- `drill.published` - Made public
- `drill.assigned` - Assigned to athlete (RED zone)
- `drill.completed` - Athlete completed drill (RED zone)
- `drill.rated` - Drill feedback submitted
- `workout.assigned` - Workout assigned (RED zone)

**Features:**
- Type-safe event payloads
- EventMonitor for statistics
- PipelineTracker for stage management
- WebhookManager for external integrations (zone-filtered)

---

## 🎨 Components

### `<DrillBrowser />` - Search & Discovery

**Props:**
```typescript
{
  mode: 'library' | 'assigned' | 'recommended'
  athleteId?: string  // RED zone personalization
  garComponent?: string  // Filter by GAR component
  onDrillSelect?: (drill) => void
  showAssignButton?: boolean
}
```

**Features:**
- Filter by sport, category, skill level, position
- Keyword search + semantic search (when embeddings available)
- Video preview
- Assignment status tracking (RED zone)
- Touch-optimized mobile cards

**Used In:**
- `/dashboard` - Assigned drills view
- `/starpath/training/[skillId]` - GAR-specific drills
- `/m/drills` - Mobile drill browser
- `/admin/content` - Content management

### `<WorkoutPlayer />` - Execution Interface

**Props:**
```typescript
{
  assignmentId: string
  athleteId: string  // RED zone
  workoutTitle: string
  workoutSteps: WorkoutStep[]
  totalDuration: number
  onComplete?: (results) => void
  onCancel?: () => void
}
```

**Features:**
- Step-by-step workout execution
- Video playback for each drill
- Timer with rest period management
- Set/rep tracking
- Performance notes and self-assessment
- XP rewards and completion tracking

**Used In:**
- `/dashboard` - Execute assigned workouts
- `/m/workout` - Mobile workout execution
- `/starpath/training` - Training session player

---

## 📱 Mobile Routes

### `/m/dashboard` - Athlete Training Hub
- Today's assignments with priority badges
- Weekly stats (completed, XP earned, completion rate)
- Quick actions (Browse Drills, View StarPath)
- Tab navigation (Today / All assignments)
- Touch-optimized drill cards

### `/m/drills` - Mobile Drill Library
- Filter by sport, category, skill level
- Touch-friendly search
- Video previews
- Save to favorites

### `/m/workout` - Mobile Workout Player
- Full-screen video playback
- Touch-optimized controls
- Progress tracking
- Performance logging
- XP celebration on completion

**Bottom Navigation:**
- Training (dashboard)
- Drills (library)
- Progress (StarPath)
- Dashboard (main app)

---

## 🔐 Zone-Based Security

### RED Zone (Athlete PII - Self-Hosted Only)
**Data:**
- `athleteDrillAssignments` - Personal assignments
- Athlete video submissions
- Performance data
- Transcripts of athlete videos

**Processing:**
- Whisper Docker (localhost:8000)
- Ollama local_fast_llm (localhost:11434)
- Ollama local_embed_model (localhost:11434)
- NO external APIs

**Routes:**
- `POST /api/drills/upload` (with athleteId)
- `GET /m/dashboard`
- `GET /m/workout?assignmentId={id}`

### YELLOW Zone (Anonymized/Aggregated)
**Data:**
- `drillRatings` (anonymizable)
- `workoutTemplates` (aggregated)
- Drill usage statistics

**Processing:**
- Can use self-hosted models
- Careful with hosted models (anonymize first)

**Routes:**
- `GET /api/drills` (with stats)
- Drill recommendations

### GREEN Zone (Public Content)
**Data:**
- Public drill library (`drills` with isPublic=true)
- `mediaAssets` for library content
- `drillCollections` public sets

**Processing:**
- Can use hosted_creative_llm for marketing copy
- External APIs allowed

**Routes:**
- `GET /api/drills?isPublic=true`
- `/m/drills` (public library)

---

## 🚀 Setup & Deployment

### 1. Environment Variables

```bash
# Cloudflare R2 (Video Storage)
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=go4it-drills
CLOUDFLARE_CDN_URL=https://cdn.go4itsports.com

# Whisper Docker (Self-Hosted Transcription)
WHISPER_API_URL=http://localhost:8000
WHISPER_MODEL=base  # tiny, base, small, medium, large

# Ollama (Self-Hosted AI)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_FAST_MODEL=claude-educational-primary  # 7B model
OLLAMA_EMBED_MODEL=nomic-embed-text  # 768D embeddings
```

### 2. Install Docker Services

**Whisper Docker:**
```bash
docker run -d -p 8000:8000 ghcr.io/openai/whisper
```

**Ollama (Already Running):**
```bash
# Already installed with 12 models
ollama list
# Pull embedding model if not present
ollama pull nomic-embed-text
```

### 3. Database Migration

```bash
# Generate migration
npm run db:generate

# Run migration
npm run db:migrate

# Seed drills (40+ per sport)
npx tsx scripts/seed-drills.ts
```

### 4. Start Workers

Workers auto-start when imported, or manually:

```typescript
// In your app initialization
import { initWhisperWorker } from '@/workers/whisper-transcription';
import { initEmbeddingsWorker } from '@/workers/embeddings';
import '@/workers/ai-tagging'; // Auto-starts

// Workers will listen for events and process automatically
```

---

## 📊 Usage Examples

### Upload a Drill Video (Coach)

```typescript
const formData = new FormData();
formData.append('file', videoFile);
formData.append('uploadType', 'library');
formData.append('zone', 'GREEN');
formData.append('sport', 'football');
formData.append('title', '40-Yard Dash Technique');

const response = await fetch('/api/drills/upload', {
  method: 'POST',
  body: formData,
});

// Pipeline automatically:
// 1. Uploads to R2
// 2. Transcribes with Whisper
// 3. Tags with AI
// 4. Generates embeddings
// 5. Ready for approval
```

### Assign Drill to Athlete (Coach)

```typescript
const assignment = await db.insert(athleteDrillAssignments).values({
  athleteId: 'user_123',
  drillId: 'drill_456',
  assignedBy: coachUserId,
  assignmentType: 'practice',
  dueDate: new Date('2025-11-10'),
  priority: 'high',
  customSets: 5,
  customReps: '10',
  notes: 'Focus on proper form - we\'ll review video next week',
});

// Emits drill.assigned event (RED zone)
drillEvents.emitDrillAssigned({
  assignmentId: assignment.id,
  athleteId: 'user_123',
  drillId: 'drill_456',
  assignedBy: coachUserId,
  assignmentType: 'practice',
  dueDate: new Date('2025-11-10'),
  priority: 'high',
  timestamp: new Date(),
});
```

### Complete Workout (Athlete)

```typescript
// Athlete uses WorkoutPlayer component
<WorkoutPlayer
  assignmentId={assignmentId}
  athleteId={userId}
  workoutTitle="Pre-Game Speed Session"
  workoutSteps={steps}
  totalDuration={45}
  onComplete={(results) => {
    // Results include:
    // - completedSteps
    // - skippedSteps
    // - totalTimeSpent
    // - performanceNotes
    // - selfRatings
    // - xpEarned
    console.log(`Earned ${results.xpEarned} XP!`);
  }}
/>

// Emits drill.completed event (RED zone)
```

### Search Drills with Semantic Search

```typescript
import { searchDrillsBySimilarity } from '@/workers/embeddings';

const results = await searchDrillsBySimilarity(
  'explosive first step acceleration',
  10,
  {
    sport: 'football',
    category: 'speed',
    skillLevel: 'intermediate',
  }
);

// Returns drills semantically similar to query
// Uses vector embeddings for intelligent matching
```

---

## 🎯 StarPath Integration

### GAR Component Mapping

Drills map to GAR components:
- `sprint` - 40-yard dash, acceleration drills
- `cod` - Change of direction, agility drills
- `vertical` - Jump training, explosive power
- `strength` - Weightlifting, resistance training
- `endurance` - Conditioning, stamina drills

### ARI Connection

Drills support academic development:
- `focus` - Concentration drills
- `discipline` - Routine-building exercises
- `time_management` - Structured training schedules

### Behavior Connection

Drills reinforce positive behaviors:
- `teamwork` - Partner/team drills
- `resilience` - High-difficulty challenges
- `leadership` - Coaching other athletes

**Usage:**
```typescript
// Filter drills by GAR component
<DrillBrowser
  mode="recommended"
  athleteId={userId}
  garComponent="sprint"  // Only sprint-related drills
/>

// In /starpath/training/[skillId] route
// Automatically filters by skill's GAR component
```

---

## 📈 Analytics & Monitoring

### Event Statistics

```typescript
import { eventMonitor } from '@/lib/events/drill-events';

// Get all event stats
const stats = eventMonitor.getStats();

// Get specific event stats
const uploadStats = eventMonitor.getStatsByType('media.uploaded');
console.log(`Total uploads: ${uploadStats.count}`);
console.log(`Last upload: ${uploadStats.lastEmitted}`);

// Get total events processed
const total = eventMonitor.getTotalEvents();
```

### Pipeline Tracking

```typescript
import { pipelineTracker } from '@/lib/events/drill-events';

// Get pipeline status for media asset
const stages = pipelineTracker.getPipeline('media_asset_123');

// Check if pipeline complete
const isComplete = pipelineTracker.isPipelineComplete('media_asset_123');

// Get total processing time
const totalTime = pipelineTracker.getTotalProcessingTime('media_asset_123');
```

### Webhook Integration

```typescript
import { webhookManager } from '@/lib/events/drill-events';

// Register webhook for external system
webhookManager.registerWebhook('zapier_integration', {
  url: 'https://hooks.zapier.com/hooks/catch/...',
  events: ['drill.completed', 'workout.assigned'],
  zone: 'YELLOW',  // Only send YELLOW/GREEN zone events
  headers: {
    'Authorization': 'Bearer token',
  },
  retryAttempts: 3,
});

// Webhook automatically filters RED zone events for security
```

---

## 🐛 Troubleshooting

### Whisper Not Working

```bash
# Check if Whisper Docker is running
curl http://localhost:8000/health

# If not running, start container
docker run -d -p 8000:8000 ghcr.io/openai/whisper

# Check worker health
import { checkWhisperHealth } from '@/workers/whisper-transcription';
const healthy = await checkWhisperHealth();
```

### Ollama Embeddings Not Working

```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# Pull embedding model
ollama pull nomic-embed-text

# Check worker health
import { checkOllamaEmbeddingsHealth } from '@/workers/embeddings';
const healthy = await checkOllamaEmbeddingsHealth();
```

### Uploads Failing

```bash
# Check R2 credentials
echo $CLOUDFLARE_R2_ACCESS_KEY_ID

# Test R2 connection
curl -X PUT \
  "https://$CLOUDFLARE_R2_ACCOUNT_ID.r2.cloudflarestorage.com/go4it-drills/test.txt" \
  -H "Authorization: Bearer $CLOUDFLARE_R2_SECRET_ACCESS_KEY" \
  -d "test"
```

---

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] Video analysis with computer vision (pose estimation)
- [ ] Automatic drill difficulty adjustment based on performance
- [ ] Peer comparison (anonymized, YELLOW zone)
- [ ] Coach drill creation wizard with AI assistance
- [ ] Advanced semantic search with pgvector

### Phase 3 Features
- [ ] Live drill feedback using camera (mobile)
- [ ] Social features (share achievements, YELLOW zone)
- [ ] Drill marketplace (coaches sell custom drills)
- [ ] Integration with wearables (heart rate, GPS)

---

## 📚 Additional Resources

### Related Documentation
- `components/team/metadad.md` - SEO/META DAD framework
- `components/team/ContentCreator.md` - Content strategy
- `GO4IT_AI_MODELS_DOCUMENTATION.md` - Self-hosted AI models
- `SECRETS_AND_KEYS_GUIDE.md` - Environment setup

### API Endpoints
- `POST /api/drills/upload` - Upload media
- `GET /api/drills/upload?mediaAssetId={id}` - Check upload status
- `GET /api/drills` - Search/filter drills
- `POST /api/drills/complete-workout` - Submit workout results
- `GET /api/drills/{id}` - Get drill details

### Database Queries
```typescript
// Find drills by sport and category
const speedDrills = await db.query.drills.findMany({
  where: and(
    eq(drills.sport, 'football'),
    eq(drills.category, 'speed'),
    eq(drills.isPublic, true)
  ),
  limit: 20,
});

// Get athlete assignments
const assignments = await db.query.athleteDrillAssignments.findMany({
  where: and(
    eq(athleteDrillAssignments.athleteId, userId),
    eq(athleteDrillAssignments.status, 'assigned')
  ),
  with: {
    drill: true,
  },
});

// Get workout template with drills
const workout = await db.query.workoutTemplates.findFirst({
  where: eq(workoutTemplates.id, workoutId),
});
```

---

## 🤝 Contributing

### Adding New Drills

1. Use seed data format in `scripts/seed-drills.ts`
2. Include all required fields:
   - title, description, sport, category, skillLevel
   - keyPoints, equipment, xpReward
3. Set appropriate zone (GREEN for public library)
4. Add GAR/ARI/Behavior connections
5. Test drill card rendering in DrillBrowser

### Adding New Sports

1. Update `SPORTS` constant in `components/drills/DrillBrowser.tsx`
2. Add sport-specific drills to seed data
3. Create sport-specific collections
4. Update documentation

---

## 📄 License

Proprietary - Go4it Sports Academy
All rights reserved.

---

**Built with ❤️ for NCAA-ready student-athletes**
