# Complete GPT Knowledge Base - Universal One School Senior Developer

## Knowledge Base Files Package

### Core Architecture Files
1. **replit.md** - Master project documentation with complete changelog
2. **LANDING_PAGE_CODE.tsx** - Full homepage implementation (36KB)
3. **package.json** - Dependencies and build configuration
4. **next.config.js** - Next.js production configuration
5. **tailwind.config.ts** - Styling and theme configuration

### Production Deployment Files
6. **GITHUB_DEPLOYMENT_PACKAGE.md** - Complete deployment procedures
7. **universal-one-school-v5.0.tar.gz** - Latest production-ready build
8. **CREATE_GITHUB_RELEASE.sh** - Automated release creation script
9. **SENIOR_DEVELOPER_GPT.md** - Role specifications and responsibilities

### School-Specific Documentation
10. **app/page.tsx** - Main homepage with all 5 schools implementation
11. **app/schools/[schoolId]/page.tsx** - Individual school pages structure
12. **components/ui/** - Shared UI component library documentation
13. **lib/utils.ts** - Utility functions and helpers

### AI Integration Files
14. **server/api/anthropic.ts** - Claude AI integration code
15. **shared/ai-teachers.ts** - School-specific AI teacher configurations
16. **types/education.ts** - Educational platform TypeScript definitions

### Database & API Files
17. **shared/schema.ts** - Complete database schema definitions
18. **server/storage.ts** - Data persistence layer
19. **server/routes.ts** - API endpoints documentation

### Deployment & DevOps Files
20. **deployment.config.js** - Production server configuration
21. **.env.production** - Production environment template
22. **nginx.conf** - Web server configuration
23. **pm2.ecosystem.js** - Process management configuration

## Advanced GPT Features Setup

### 1. Webhook Integration

```javascript
// GPT Webhook Configuration
const webhookConfig = {
  // GitHub Integration
  github: {
    endpoint: "https://api.github.com/repos/universal-one-school/main",
    events: ["push", "pull_request", "release"],
    authentication: "GITHUB_TOKEN"
  },
  
  // Production Server Monitoring
  server: {
    endpoint: "https://188.245.209.124:3721/api/webhook",
    events: ["deployment", "error", "performance"],
    authentication: "SERVER_WEBHOOK_TOKEN"
  },
  
  // Replit Integration
  replit: {
    endpoint: "https://replit.com/api/v1/webhook",
    events: ["build", "deploy", "error"],
    authentication: "REPLIT_API_TOKEN"
  }
};
```

### 2. Custom Actions Configuration

```yaml
# actions.yaml - GPT Custom Actions
actions:
  - name: "deploy_to_production"
    description: "Deploy latest GitHub release to production server"
    endpoint: "https://universal-one-school-api.com/deploy"
    method: "POST"
    authentication:
      type: "bearer"
      token: "${DEPLOYMENT_TOKEN}"
    
  - name: "create_github_release"
    description: "Create new GitHub release package"
    endpoint: "https://api.github.com/repos/universal-one-school/releases"
    method: "POST"
    authentication:
      type: "token"
      token: "${GITHUB_TOKEN}"
      
  - name: "monitor_server_health"
    description: "Check production server status and performance"
    endpoint: "https://188.245.209.124:3721/api/health"
    method: "GET"
    authentication:
      type: "bearer"
      token: "${MONITORING_TOKEN}"
      
  - name: "analyze_build_logs"
    description: "Analyze TypeScript build errors and provide fixes"
    endpoint: "https://build-analyzer.universal-one-school.com/analyze"
    method: "POST"
    authentication:
      type: "api_key"
      key: "${BUILD_ANALYZER_KEY}"
```

### 3. Real-time Monitoring Integration

```javascript
// monitoring-integration.js
const monitoringFeatures = {
  // Server Performance Monitoring
  serverMetrics: {
    endpoint: "https://188.245.209.124:3721/metrics",
    metrics: ["cpu", "memory", "disk", "network", "response_time"],
    alerts: {
      cpu_threshold: 80,
      memory_threshold: 85,
      response_time_threshold: 3000
    }
  },
  
  // Application Health Checks
  healthChecks: {
    homepage: "https://shatzii.com/",
    schools: [
      "https://shatzii.com/schools/primary",
      "https://shatzii.com/schools/secondary", 
      "https://shatzii.com/schools/sports",
      "https://shatzii.com/schools/legal",
      "https://shatzii.com/schools/language"
    ],
    apis: [
      "https://shatzii.com/api/auth/me",
      "https://shatzii.com/api/health",
      "https://shatzii.com/api/schools"
    ]
  },
  
  // User Experience Monitoring
  userExperience: {
    lighthouse_score: "minimum_90",
    mobile_compatibility: "required",
    accessibility_score: "WCAG_2.1_AA",
    load_time_target: "3_seconds_global"
  }
};
```

### 4. Automated Testing Integration

```yaml
# testing-automation.yaml
automated_testing:
  unit_tests:
    command: "npm run test"
    coverage_threshold: 80
    
  integration_tests:
    command: "npm run test:integration"
    environments: ["development", "staging", "production"]
    
  e2e_tests:
    command: "npm run test:e2e"
    browsers: ["chrome", "firefox", "safari", "mobile"]
    
  accessibility_tests:
    tool: "axe-core"
    standards: ["WCAG2A", "WCAG2AA"]
    
  performance_tests:
    lighthouse: true
    core_web_vitals: true
    mobile_performance: true
```

### 5. Code Quality Automation

```javascript
// code-quality-config.js
const codeQualityConfig = {
  // TypeScript Strict Mode Enforcement
  typescript: {
    strict: true,
    noImplicitAny: true,
    strictNullChecks: true,
    noUnusedLocals: true,
    noUnusedParameters: true
  },
  
  // ESLint Configuration
  eslint: {
    extends: ["@next/next/recommended", "@typescript-eslint/recommended"],
    rules: {
      "no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "react-hooks/exhaustive-deps": "error"
    }
  },
  
  // Prettier Configuration
  prettier: {
    semi: true,
    singleQuote: false,
    tabWidth: 2,
    trailingComma: "es5"
  },
  
  // Security Scanning
  security: {
    tools: ["npm audit", "snyk", "semgrep"],
    severity_threshold: "medium",
    auto_fix: true
  }
};
```

### 6. Database Management Automation

```sql
-- database-monitoring.sql
-- Automated database health checks and optimization

-- Performance Monitoring Queries
CREATE OR REPLACE FUNCTION check_database_performance()
RETURNS TABLE(
    metric_name VARCHAR(50),
    current_value NUMERIC,
    threshold NUMERIC,
    status VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'Connection Count'::VARCHAR(50),
        (SELECT count(*) FROM pg_stat_activity)::NUMERIC,
        100::NUMERIC,
        CASE WHEN (SELECT count(*) FROM pg_stat_activity) > 100 
             THEN 'WARNING'::VARCHAR(20)
             ELSE 'OK'::VARCHAR(20)
        END;
        
    RETURN QUERY
    SELECT 
        'Query Response Time'::VARCHAR(50),
        (SELECT avg(total_time) FROM pg_stat_statements LIMIT 1)::NUMERIC,
        1000::NUMERIC,
        CASE WHEN (SELECT avg(total_time) FROM pg_stat_statements LIMIT 1) > 1000
             THEN 'WARNING'::VARCHAR(20)
             ELSE 'OK'::VARCHAR(20)
        END;
END;
$$ LANGUAGE plpgsql;

-- Automated Index Optimization
CREATE OR REPLACE FUNCTION optimize_database_indexes()
RETURNS TEXT AS $$
DECLARE
    optimization_report TEXT := '';
BEGIN
    -- Analyze all tables
    FOR rec IN SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE 'ANALYZE ' || quote_ident(rec.schemaname) || '.' || quote_ident(rec.tablename);
        optimization_report := optimization_report || 'Analyzed: ' || rec.tablename || E'\n';
    END LOOP;
    
    RETURN optimization_report;
END;
$$ LANGUAGE plpgsql;
```

### 7. AI Teacher Performance Monitoring

```typescript
// ai-monitoring.ts
interface AITeacherMetrics {
  teacherId: string;
  school: string;
  responseTime: number;
  accuracy: number;
  userSatisfaction: number;
  adaptationEffectiveness: number;
}

const aiMonitoringConfig = {
  teachers: [
    { id: "dean_wonder", school: "primary", neurotype_support: ["adhd", "autism", "dyslexia"] },
    { id: "dean_sterling", school: "secondary", specialization: "theater_arts" },
    { id: "professor_barrett", school: "legal", expertise: "bar_exam_prep" },
    { id: "professor_lingua", school: "language", languages: ["english", "spanish", "german"] },
    { id: "coach_go4it", school: "sports", focus: "athletic_excellence" }
  ],
  
  performanceMetrics: {
    response_time_target: 2000, // milliseconds
    accuracy_threshold: 95, // percentage
    satisfaction_target: 4.5, // out of 5
    adaptation_effectiveness: 85 // percentage
  },
  
  monitoring_intervals: {
    real_time: 30, // seconds
    daily_report: true,
    weekly_analysis: true,
    monthly_optimization: true
  }
};
```

### 8. Deployment Pipeline Automation

```yaml
# deployment-pipeline.yaml
pipeline:
  stages:
    - name: "code_quality_check"
      steps:
        - typescript_compilation
        - eslint_validation
        - prettier_formatting
        - security_scan
        
    - name: "automated_testing"
      steps:
        - unit_tests
        - integration_tests
        - accessibility_tests
        - performance_tests
        
    - name: "build_optimization"
      steps:
        - asset_optimization
        - bundle_analysis
        - tree_shaking
        - compression
        
    - name: "staging_deployment"
      steps:
        - deploy_to_staging
        - smoke_tests
        - user_acceptance_testing
        
    - name: "production_deployment"
      steps:
        - create_backup
        - deploy_to_production
        - health_checks
        - rollback_capability
        
  notifications:
    success: ["email", "slack", "webhook"]
    failure: ["email", "sms", "pager"]
    
  rollback:
    automatic: true
    conditions: ["health_check_failure", "error_rate_spike"]
    retention: "7_days"
```

## GPT Integration Instructions

### Setting Up Your Custom GPT:

1. **Create New GPT** in ChatGPT interface
2. **Upload Knowledge Base**: All 23 files listed above
3. **Configure Actions**: Import the actions.yaml configuration
4. **Set Up Webhooks**: Configure monitoring endpoints
5. **Enable Capabilities**: Code Interpreter, Web Browsing, File Analysis
6. **Test Integration**: Run through all test scenarios

### Advanced Features Activation:

```bash
# GPT API Integration Setup
curl -X POST "https://api.openai.com/v1/assistants" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "instructions": "[Your complete system prompt]",
    "name": "Universal One School Senior Developer",
    "tools": [
      {"type": "code_interpreter"},
      {"type": "retrieval"},
      {"type": "function", "function": {...}}
    ],
    "model": "gpt-4-turbo-preview",
    "file_ids": ["file-1", "file-2", "..."]
  }'
```

Your GPT will now have complete access to the platform architecture, real-time monitoring capabilities, automated deployment tools, and comprehensive knowledge of all 5 schools' requirements. It can proactively monitor issues, deploy fixes, and maintain platform excellence 24/7.