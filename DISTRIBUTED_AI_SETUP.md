# Distributed AI Engine Setup - Go4It Sports Platform

## Overview
This setup allows you to run the AI processing on a separate server to distribute computational load and improve performance for the Go4It Sports Platform.

## Quick Setup Guide

### 1. Current Configuration
Your system is already configured to support distributed AI processing:
- ✅ Remote AI engine support added to `lib/ai-models.ts`
- ✅ Environment variables configured in `.env.local`
- ✅ Deployment script created (`deploy-ai-engine.sh`)
- ✅ Standalone AI engine server (`ai-engine-server.js`)

### 2. How to Enable Distributed AI

**Option A: Run AI Engine on Same Server (Different Port)**
```bash
# Set environment variables
export AI_ENGINE_PORT=3001
export AI_ENGINE_API_KEY="your-secure-api-key"

# Deploy AI engine locally
./deploy-ai-engine.sh local

# Update main app to use remote engine
# In .env.local:
USE_REMOTE_AI_ENGINE=true
AI_ENGINE_URL=http://localhost:3001
AI_ENGINE_API_KEY=your-secure-api-key
```

**Option B: Run AI Engine on Separate Server**
```bash
# Deploy to remote server
SERVER_HOST=192.168.1.100 AI_ENGINE_API_KEY="your-key" ./deploy-ai-engine.sh remote

# Update main app to use remote engine
# In .env.local:
USE_REMOTE_AI_ENGINE=true
AI_ENGINE_URL=http://192.168.1.100:3001
AI_ENGINE_API_KEY=your-secure-api-key
```

### 3. Benefits of This Setup

**Performance Benefits:**
- 🚀 **Faster Response Times**: Dedicated server for AI processing
- 📈 **Better Scalability**: Scale AI processing independently
- 💰 **Cost Efficiency**: Use high-performance servers only when needed
- 🔄 **Load Distribution**: Spread computational load across servers

**Reliability Benefits:**
- 🛡️ **Graceful Fallback**: If AI server fails, main app continues with local analysis
- 📊 **Independent Scaling**: Add more AI servers as needed
- 🔧 **Easy Maintenance**: Update AI models without affecting main app
- 📱 **Better User Experience**: Main app stays responsive during heavy AI processing

### 4. Architecture Comparison

**Before (Single Server):**
```
[Web App + Database + AI Processing] → Overloaded Server
```

**After (Distributed):**
```
[Web App + Database] → Light, Fast, Responsive
        ↓
[AI Engine Server] → Heavy Processing, Scalable
```

### 5. Load Balancing Multiple AI Servers

You can run multiple AI engines for even better performance:

```bash
# Start multiple AI engines on different ports
AI_ENGINE_PORT=3001 ./deploy-ai-engine.sh local
AI_ENGINE_PORT=3002 ./deploy-ai-engine.sh local
AI_ENGINE_PORT=3003 ./deploy-ai-engine.sh local

# Use nginx for load balancing (nginx.conf included)
```

### 6. Testing the Setup

Test the distributed AI engine:
```bash
# Test AI engine directly
curl -H "X-API-Key: your-key" http://localhost:3001/health

# Test video analysis through AI engine
curl -X POST http://localhost:3001/api/analyze-video \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-key" \
  -d '{"sport": "basketball", "testMode": true}'
```

### 7. Monitoring and Management

**Health Monitoring:**
```bash
# Check AI engine status
curl -H "X-API-Key: your-key" http://localhost:3001/health

# Monitor with PM2 (if deployed remotely)
pm2 status ai-engine
pm2 logs ai-engine
```

**Performance Monitoring:**
- CPU usage on AI server
- Memory usage for AI models
- Response times for AI requests
- Queue length for processing

### 8. Security Considerations

**API Key Security:**
- Use strong, unique API keys for each AI engine
- Rotate API keys regularly
- Restrict access to AI engine ports

**Network Security:**
- Use VPN or private networks for AI engine communication
- Configure firewall rules appropriately
- Use HTTPS for production deployments

### 9. Cost Optimization

**Server Sizing:**
- **Main App Server**: 2-4 vCPUs, 8GB RAM (handles web traffic)
- **AI Engine Server**: 8-16 vCPUs, 16-32GB RAM (handles AI processing)

**Auto-scaling:**
- Use cloud auto-scaling for AI engines
- Scale based on queue length and response times
- Consider spot instances for cost savings

### 10. Deployment Examples

**AWS Deployment:**
```bash
# Deploy main app on smaller instance
AWS_INSTANCE_TYPE=t3.medium

# Deploy AI engine on larger instance
AWS_INSTANCE_TYPE=c5.4xlarge SERVER_HOST=ai-server.aws ./deploy-ai-engine.sh remote
```

**Docker Deployment:**
```bash
# Run AI engine in Docker
docker run -d -p 3001:3001 \
  -e AI_ENGINE_API_KEY=your-key \
  -e PORT=3001 \
  go4it-ai-engine
```

### 11. Migration from Single to Distributed

**Step 1**: Deploy AI engine on separate server
```bash
./deploy-ai-engine.sh remote
```

**Step 2**: Update main app configuration
```env
USE_REMOTE_AI_ENGINE=true
AI_ENGINE_URL=http://your-ai-server:3001
AI_ENGINE_API_KEY=your-secure-key
```

**Step 3**: Test and verify
```bash
# Test main app still works
curl -H "Authorization: Bearer your-jwt" http://localhost:5000/api/gar/analyze -d '{"sport": "basketball", "testMode": true}'
```

**Step 4**: Monitor performance improvement

## Current Status
Your Go4It Sports Platform now supports both:
- ✅ **Local AI Processing**: Self-hosted models on same server
- ✅ **Distributed AI Processing**: Dedicated AI servers for heavy workloads

The system automatically falls back to local analysis if the remote AI engine is unavailable, ensuring reliability and uptime.

## Next Steps
1. Choose your deployment strategy (local or remote)
2. Run the deployment script with your configuration
3. Update environment variables to enable remote AI engine
4. Test the setup and monitor performance
5. Scale AI engines as needed for your workload

The distributed AI engine setup gives you professional-grade scalability while maintaining the reliability of the existing system.