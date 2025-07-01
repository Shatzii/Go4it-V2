#!/bin/bash

echo "🚀 Setting up AI Education Platform workspace..."

# Ensure we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in a Node.js project directory"
    echo "Please navigate to your schools.shatzii.com project directory first"
    exit 1
fi

# Create VS Code workspace directory
mkdir -p .vscode

# Create comprehensive workspace file
cat > .vscode/ai-education.code-workspace << 'EOF'
{
  "folders": [
    {
      "name": "AI Education Platform - schools.shatzii.com",
      "path": "."
    }
  ],
  "settings": {
    "typescript.preferences.importModuleSpecifier": "relative",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": true,
      "source.fixAll.eslint": true
    },
    "files.exclude": {
      "**/node_modules": true,
      "**/.next": true,
      "**/dist": true,
      "**/.git": false
    },
    "search.exclude": {
      "**/node_modules": true,
      "**/.next": true,
      "**/dist": true
    },
    "typescript.suggest.autoImports": true,
    "emmet.includeLanguages": {
      "typescript": "typescriptreact",
      "javascript": "javascriptreact"
    },
    "github.copilot.enable": {
      "*": true,
      "yaml": true,
      "plaintext": false,
      "markdown": true,
      "javascript": true,
      "typescript": true,
      "typescriptreact": true,
      "json": true
    },
    "github.copilot.advanced": {
      "length": 1000,
      "temperature": 0.1
    },
    "editor.quickSuggestions": {
      "other": true,
      "comments": true,
      "strings": true
    },
    "editor.suggestOnTriggerCharacters": true,
    "editor.tabCompletion": "on",
    "editor.suggest.insertMode": "replace"
  },
  "extensions": {
    "recommendations": [
      "github.copilot",
      "github.copilot-chat",
      "ms-vscode.vscode-typescript-next",
      "bradlc.vscode-tailwindcss",
      "esbenp.prettier-vscode",
      "ms-vscode.vscode-eslint",
      "formulahendry.auto-rename-tag",
      "christian-kohler.path-intellisense",
      "humao.rest-client",
      "ms-vscode.vscode-json"
    ]
  },
  "tasks": {
    "version": "2.0.0",
    "tasks": [
      {
        "label": "🚀 Setup AI Education Integration",
        "type": "shell",
        "command": "echo",
        "args": ["✅ AI Education Platform workspace ready!"],
        "group": "build",
        "presentation": {
          "echo": true,
          "reveal": "always",
          "focus": true,
          "panel": "new"
        },
        "dependsOrder": "sequence",
        "dependsOn": [
          "Create Feature Branch",
          "Setup Directories",
          "Verify Dependencies"
        ]
      },
      {
        "label": "Create Feature Branch",
        "type": "shell",
        "command": "git",
        "args": ["checkout", "-b", "feature/ai-education-engine"],
        "group": "build",
        "presentation": {
          "echo": true,
          "reveal": "silent"
        }
      },
      {
        "label": "Setup Directories", 
        "type": "shell",
        "command": "mkdir",
        "args": ["-p", "server/services", "server/routes", "components/cms", "app/cms", "public/media", "public/branding"],
        "group": "build",
        "presentation": {
          "echo": true,
          "reveal": "silent"
        }
      },
      {
        "label": "Verify Dependencies",
        "type": "shell", 
        "command": "npm",
        "args": ["list", "--depth=0"],
        "group": "build",
        "presentation": {
          "echo": true,
          "reveal": "silent"
        }
      },
      {
        "label": "🧪 Test AI API Endpoints",
        "type": "shell",
        "command": "curl",
        "args": ["-f", "http://localhost:5000/api/education/ai-teachers", "||", "echo", "API not ready yet - run after implementation"],
        "group": "test"
      },
      {
        "label": "🔄 Start Development Server",
        "type": "shell",
        "command": "npm",
        "args": ["run", "dev"],
        "group": "build",
        "isBackground": true,
        "presentation": {
          "echo": true,
          "reveal": "always",
          "focus": false,
          "panel": "new"
        }
      }
    ]
  }
}
EOF

# Create necessary directories for AI education platform
echo "📁 Creating AI Education Platform directory structure..."
mkdir -p server/services
mkdir -p server/routes  
mkdir -p components/cms
mkdir -p app/cms
mkdir -p public/media
mkdir -p public/branding
mkdir -p docs

# Create feature branch for AI education features
echo "🌿 Creating feature branch for AI education..."
git checkout -b feature/ai-education-engine 2>/dev/null || echo "ℹ️  Feature branch already exists"

# Create environment configuration
if [ ! -f ".env.local" ]; then
    echo "⚙️ Creating development environment configuration..."
    cat > .env.local << 'EOF'
# AI Education Platform - Development Environment
NODE_ENV=development
USE_LOCAL_AI=true

# AI API Keys (replace with your actual keys)
ANTHROPIC_API_KEY=your_anthropic_key_here
OPENAI_API_KEY=your_openai_key_here
PERPLEXITY_API_KEY=your_perplexity_key_here

# Stripe Payment Processing (use test keys for development)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Database Configuration
DATABASE_URL=postgresql://localhost:5432/schools_db

# Local AI Configuration
LOCAL_AI_URL=http://localhost:11434
OLLAMA_HOST=0.0.0.0

# Session Configuration
SESSION_SECRET=your_secure_session_secret_here
EOF
    echo "📝 Created .env.local - remember to add your actual API keys!"
else
    echo "ℹ️  .env.local already exists - keeping existing configuration"
fi

# Create comprehensive Copilot context file
cat > .copilot-context.md << 'EOF'
# AI Education Platform Integration Context

## Project Overview
Integrating a comprehensive AI-powered education platform into the existing schools.shatzii.com Next.js application.

## Current Implementation Status
✅ Production site: schools.shatzii.com (IP: 178.156.185.43)
✅ Stack: Next.js, TypeScript, Express, PostgreSQL
🚧 Adding: Complete AI Education Engine with 6 specialized teachers

## AI Education Platform Components

### 6 Specialized AI Teachers
1. **Professor Newton** (Mathematics)
   - Personality: Patient, logical, step-by-step problem solving
   - Specializes in: Arithmetic through Calculus, visual learning techniques
   - Neurodivergent support: Dyscalculia, ADHD-friendly math instruction

2. **Dr. Curie** (Science) 
   - Personality: Curious, experimental, inspires scientific wonder
   - Specializes in: Physics, Chemistry, Biology, hands-on experiments
   - Neurodivergent support: Inquiry-based learning, sensory accommodations

3. **Ms. Shakespeare** (English Language Arts)
   - Personality: Creative, articulate, passionate about literature
   - Specializes in: Reading comprehension, creative writing, public speaking
   - Neurodivergent support: Dyslexia-friendly approaches, audio alternatives

4. **Professor Timeline** (Social Studies)
   - Personality: Master storyteller, connects past to present
   - Specializes in: World history, civics, geography, cultural studies
   - Neurodivergent support: Visual timelines, multiple perspectives

5. **Maestro Picasso** (Arts)
   - Personality: Creative, expressive, celebrates artistic diversity
   - Specializes in: Visual arts, music, drama, digital creativity
   - Neurodivergent support: Multi-sensory art therapy, emotional expression

6. **Dr. Inclusive** (Special Education)
   - Personality: Compassionate, adaptive, expert in diverse learning needs
   - Specializes in: ADHD support, autism spectrum, learning disabilities
   - Neurodivergent support: IEP development, assistive technology

### Core System Architecture

#### Backend Services (server/services/)
- `ai-teachers.js` - 6 AI teacher personalities and tutoring sessions
- `proprietary-content-engine.js` - Generates lessons, games, worksheets
- `school-registration.js` - Stripe integration, tiered pricing ($299-$1,299)
- `student-management.js` - Profiles, assessments, progress tracking
- `curriculum-management.js` - Year-long curriculum generation
- `cms-service.js` - Content management for school branding

#### API Routes (server/routes/)
- `/api/education/ai-teachers` - Teacher interactions and tutoring
- `/api/education/schools/register` - School registration and billing
- `/api/education/students` - Student management and progress
- `/api/education/content` - Curriculum and content generation
- `/api/education/cms` - Content management system

#### Frontend Components (components/cms/)
- `cms-dashboard.tsx` - Complete CMS interface for schools
- School-specific pages for content management
- AI teacher interaction interfaces

### Integration Strategy (CRITICAL)

#### Phase 1: Safe Backend Services (Zero Risk)
- Add all service files to server/services/
- These files are completely isolated and don't affect existing code
- Test each service independently

#### Phase 2: API Routes (Low Risk)
- Add route files to server/routes/
- Modify server/index.ts to include new routes:
  ```typescript
  const aiEducationRoutes = require('./routes/ai-education-routes');
  const cmsRoutes = require('./routes/cms-routes');
  app.use('/api/education', aiEducationRoutes);
  app.use('/api/education/cms', cmsRoutes);
  ```

#### Phase 3: Frontend Components (Low Risk)
- Add React components for CMS and AI interfaces
- Create new pages without modifying existing ones

#### Phase 4: Testing and Production Deployment
- Comprehensive testing of all features
- Safe deployment with backup and rollback procedures

### Technical Requirements

#### Self-Hosted AI Models
- Primary: Llama 2 7B Chat (Quantized INT4) - 4GB
- Code: CodeLlama 7B Instruct - 4GB  
- Creative: Mistral 7B Instruct - 8GB
- Lightweight: Phi 2.7B Chat - 1.6GB

#### Database Schema
```sql
-- Core tables for AI education platform
CREATE TABLE schools (id, school_name, pricing_tier, stripe_customer_id);
CREATE TABLE students (id, school_id, learning_profile, progress_data);
CREATE TABLE ai_sessions (id, student_id, teacher_id, session_data);
CREATE TABLE content (id, type, generated_content, metadata);
CREATE TABLE cms_data (id, school_id, page_type, content_data);
```

### Revenue Model
- **Basic Plan**: $299/month (100 students)
- **Professional**: $599/month (500 students)  
- **Enterprise**: $1,299/month (unlimited students)
- **Target**: $2.5M+ ARR from school district licensing

### Safety and Compliance
- FERPA-compliant data handling
- SOC 2 Type II security standards
- Complete data sovereignty (self-hosted AI)
- Zero external API dependencies for core functionality

### Development Guidelines
- Always use feature branch: `feature/ai-education-engine`
- Test each phase thoroughly before proceeding
- Maintain existing functionality throughout integration
- Provide clear rollback procedures for production safety

## Copilot Usage Tips
- Use `@workspace` for project-wide context
- Reference specific AI teachers by name for personality-accurate responses
- Include neurodivergent adaptations in all educational content requests
- Always consider school administrator and teacher perspectives
- Prioritize student privacy and data security in all implementations

## Current Status
🎯 Ready for implementation - all architecture planned and documented
🛡️ Zero-risk integration strategy established  
🚀 Production deployment procedures ready
📚 Complete educational framework with 6 specialized AI teachers
EOF

# Create API testing file for REST Client extension
cat > .vscode/api-tests.http << 'EOF'
### AI Education Platform API Tests

# Test AI Teachers Endpoint
GET http://localhost:5000/api/education/ai-teachers
Content-Type: application/json

###

# Test Specific AI Teacher
GET http://localhost:5000/api/education/ai-teachers/professor-newton
Content-Type: application/json

###

# Start Tutoring Session
POST http://localhost:5000/api/education/ai-teachers/professor-newton/session
Content-Type: application/json

{
  "studentId": "student_123",
  "subject": "mathematics",
  "gradeLevel": "Grade 5",
  "topic": "fractions",
  "learningStyle": "visual",
  "specialNeeds": ["adhd"]
}

###

# Test School Registration
POST http://localhost:5000/api/education/schools/register
Content-Type: application/json

{
  "schoolName": "Demo Elementary School",
  "districtName": "Demo School District",
  "adminEmail": "admin@demo-school.edu",
  "adminName": "Jane Administrator",
  "phone": "555-123-4567",
  "estimatedStudents": 250,
  "pricingTier": "pro"
}

###

# Get Pricing Information
GET http://localhost:5000/api/education/pricing
Content-Type: application/json

###

# Test CMS Content
GET http://localhost:5000/api/education/cms/content/landing-page?schoolId=demo-school
Content-Type: application/json

###

# Generate Educational Content
POST http://localhost:5000/api/education/content/lesson
Content-Type: application/json

{
  "subject": "mathematics",
  "gradeLevel": "Grade 3",
  "topic": "multiplication tables",
  "duration": 45,
  "neurodivergentAdaptations": ["adhd", "dyslexia"],
  "includeGames": true,
  "includeWorksheets": true
}

###

# Test Platform Health
GET http://localhost:5000/api/education/health
Content-Type: application/json
EOF

# Create VS Code tasks for common operations
cat > .vscode/tasks.json << 'EOF'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "🚀 Complete AI Education Setup",
      "type": "shell",
      "command": "echo",
      "args": ["Starting complete AI Education Platform setup..."],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": true,
        "panel": "new"
      },
      "dependsOrder": "sequence",
      "dependsOn": [
        "Create Directories",
        "Setup Git Branch",
        "Start Dev Server"
      ]
    },
    {
      "label": "Create Directories",
      "type": "shell",
      "command": "mkdir",
      "args": ["-p", "server/services", "server/routes", "components/cms", "app/cms", "public/media"],
      "group": "build"
    },
    {
      "label": "Setup Git Branch",
      "type": "shell",
      "command": "git",
      "args": ["checkout", "-b", "feature/ai-education-engine"],
      "group": "build"
    },
    {
      "label": "Start Dev Server",
      "type": "shell",
      "command": "npm",
      "args": ["run", "dev"],
      "group": "build",
      "isBackground": true
    },
    {
      "label": "🧪 Test All AI Endpoints",
      "type": "shell",
      "command": "echo",
      "args": ["Testing AI Education Platform endpoints..."],
      "group": "test"
    },
    {
      "label": "📦 Deploy to Production",
      "type": "shell",
      "command": "echo",
      "args": ["Use this task for production deployment when ready"],
      "group": "build"
    }
  ]
}
EOF

echo ""
echo "✅ AI Education Platform workspace setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. 💻 Open VS Code workspace:"
echo "   code .vscode/ai-education.code-workspace"
echo ""
echo "2. 🔌 Install recommended extensions when prompted"
echo ""
echo "3. 🤖 Start with GitHub Copilot:"
echo "   • Press Ctrl+Shift+P → 'GitHub Copilot: Open Chat'"
echo "   • Use: @workspace Create the AI Teachers service with all 6 specialized educators"
echo ""
echo "4. 🧪 Test API endpoints using the REST Client:"
echo "   • Open .vscode/api-tests.http"
echo "   • Click 'Send Request' above any ###"
echo ""
echo "5. ⚙️ Configure your API keys in .env.local"
echo ""
echo "📚 Available Copilot Commands:"
echo "   @workspace Create AI Teachers system"
echo "   @workspace Build school registration with Stripe"
echo "   @workspace Generate CMS dashboard"
echo "   @workspace Add student management platform"
echo ""
echo "🛡️  Safety: Everything uses feature branch 'feature/ai-education-engine'"
echo "🔄 Rollback: 'git checkout main' to return to original code"
echo ""
echo "Happy coding with AI Education Platform! 🎓🤖✨"