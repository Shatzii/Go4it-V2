# Go4It AI Engine Server - Distributed Setup

## Overview
This setup allows you to run the AI Engine on a separate server to distribute computational load and improve performance.

## Architecture
```
Main App Server (Web Interface)  →  AI Engine Server (Processing)
- Frontend/Backend Logic          - Video Analysis
- Database                        - Self-Hosted AI Models
- User Management                 - Heavy Computations
- File Storage                    - Ollama/Local Models
```

## AI Engine Server Setup

### Server Requirements
- **CPU**: 8-16 vCPUs (for AI processing)
- **RAM**: 16-32GB (for AI models)
- **Storage**: 100GB+ SSD (for models and cache)
- **GPU**: Optional (NVIDIA GPU for acceleration)

### Installation Steps

#### 1. Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js and dependencies
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git curl

# Install Ollama for AI models
curl -fsSL https://ollama.ai/install.sh | sh

# Install PM2 for process management
sudo npm install -g pm2
```

#### 2. Clone AI Engine Code
```bash
# Create AI engine directory
sudo mkdir -p /opt/go4it-ai-engine
cd /opt/go4it-ai-engine

# Clone repository (just the AI components)
git clone https://github.com/yourusername/go4it-sports-platform.git .
```

#### 3. Configure AI Engine Service
Create the AI Engine service file:
```bash
sudo nano /opt/go4it-ai-engine/ai-engine-server.js
```

## API Configuration

### Update Main App to Use Remote AI Engine
```javascript
// In your main app's lib/ai-models.ts
export function createAIModelManager(): AIModelManager {
  // Use remote AI engine server
  const config: AIModelConfig = {
    type: 'remote',
    provider: 'go4it-ai-engine',
    endpoint: process.env.AI_ENGINE_URL || 'http://your-ai-server:3001',
    apiKey: process.env.AI_ENGINE_API_KEY,
    maxTokens: 2000,
    temperature: 0.7
  };
  
  return new AIModelManager(config);
}
```

### Environment Variables for Main App
```env
# AI Engine Configuration
AI_ENGINE_URL=http://your-ai-server.com:3001
AI_ENGINE_API_KEY=your-secure-api-key-here
USE_REMOTE_AI_ENGINE=true
```

## Load Balancing Options

### 1. Multiple AI Engine Servers
```yaml
# docker-compose.yml for multiple AI engines
version: '3.8'
services:
  ai-engine-1:
    build: ./ai-engine
    ports:
      - "3001:3001"
    environment:
      - AI_ENGINE_ID=engine-1
      - OLLAMA_HOST=0.0.0.0:11434
    
  ai-engine-2:
    build: ./ai-engine
    ports:
      - "3002:3001"
    environment:
      - AI_ENGINE_ID=engine-2
      - OLLAMA_HOST=0.0.0.0:11434
```

### 2. Nginx Load Balancer
```nginx
# nginx.conf for AI engine load balancing
upstream ai_engines {
    server ai-engine-1:3001;
    server ai-engine-2:3002;
    least_conn;
}

server {
    listen 80;
    server_name ai.yourdomain.com;
    
    location / {
        proxy_pass http://ai_engines;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 300s;
    }
}
```

## Security Configuration

### 1. API Authentication
```javascript
// AI Engine authentication middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.AI_ENGINE_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};
```

### 2. Rate Limiting
```javascript
// Rate limiting for AI requests
const rateLimit = require('express-rate-limit');

const aiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many AI requests from this IP'
});
```

## Monitoring and Scaling

### 1. Health Check Endpoint
```javascript
// Health check for AI engine
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    models_loaded: getLoadedModels()
  });
});
```

### 2. Auto-scaling Configuration
```yaml
# Kubernetes auto-scaling example
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ai-engine-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ai-engine
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Performance Optimization

### 1. Model Caching
```javascript
// Cache frequently used models
const modelCache = new Map();

const getCachedModel = (modelName) => {
  if (modelCache.has(modelName)) {
    return modelCache.get(modelName);
  }
  
  const model = loadModel(modelName);
  modelCache.set(modelName, model);
  return model;
};
```

### 2. Request Queuing
```javascript
// Queue system for AI requests
const Queue = require('bull');
const aiQueue = new Queue('AI processing');

aiQueue.process('analyze-video', async (job) => {
  const { videoPath, sport, userId } = job.data;
  return await processVideoAnalysis(videoPath, sport, userId);
});
```

## Cost Optimization

### 1. Spot Instances (AWS)
```yaml
# Use spot instances for cost savings
apiVersion: v1
kind: Node
metadata:
  name: ai-engine-spot
spec:
  taints:
  - key: "node.kubernetes.io/instance-type"
    value: "spot"
    effect: "NoSchedule"
```

### 2. Auto-shutdown for Idle Periods
```javascript
// Auto-shutdown when idle
let idleTimer;
const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const resetIdleTimer = () => {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    console.log('AI engine idle, shutting down...');
    process.exit(0);
  }, IDLE_TIMEOUT);
};
```

## Deployment Script

### Quick Deploy Script
```bash
#!/bin/bash
# deploy-ai-engine.sh

echo "Deploying Go4It AI Engine Server..."

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build if needed
npm run build

# Start with PM2
pm2 restart ai-engine || pm2 start ai-engine-server.js --name ai-engine

# Pull AI models
ollama pull llama3.1:8b
ollama pull gemma:2b

echo "AI Engine deployed successfully!"
```

## Benefits of This Setup

1. **Scalability**: Scale AI processing independently
2. **Cost Efficiency**: Use high-performance servers only for AI
3. **Reliability**: If AI server fails, main app continues with fallback
4. **Performance**: Dedicated resources for AI processing
5. **Flexibility**: Easy to upgrade or change AI models
6. **Load Distribution**: Spread computational load across servers

## Example Usage

```javascript
// From your main app
const aiResponse = await fetch(`${AI_ENGINE_URL}/api/analyze-video`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': AI_ENGINE_API_KEY
  },
  body: JSON.stringify({
    videoPath: '/uploads/video.mp4',
    sport: 'basketball',
    userId: 123
  })
});

const analysis = await aiResponse.json();
```

This setup gives you a powerful, scalable AI engine that can handle heavy processing while keeping your main application responsive.