#!/bin/bash

# Shatzii AI Engines Startup Script
# This script starts all AI marketing and sales agents for autonomous operation

set -e

echo "🚀 Starting Shatzii AI Engines..."

# Check prerequisites
echo "Checking prerequisites..."

# Verify Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required but not installed"
    exit 1
fi

# Verify database connection
if ! pg_isready -h ${PGHOST:-localhost} -p ${PGPORT:-5432} -U ${PGUSER:-postgres} &> /dev/null; then
    echo "Error: PostgreSQL database is not accessible"
    echo "Please ensure database is running and environment variables are set:"
    echo "  PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE"
    exit 1
fi

# Check required API keys
missing_keys=()

if [ -z "$OPENAI_API_KEY" ]; then
    missing_keys+=("OPENAI_API_KEY")
fi

if [ -z "$SENDGRID_API_KEY" ]; then
    missing_keys+=("SENDGRID_API_KEY")
fi

if [ -z "$APOLLO_API_KEY" ]; then
    echo "Warning: APOLLO_API_KEY not set - lead generation will use limited functionality"
fi

if [ -z "$ZOOMINFO_API_KEY" ]; then
    echo "Warning: ZOOMINFO_API_KEY not set - prospect database will be limited"
fi

if [ -z "$TWILIO_ACCOUNT_SID" ] || [ -z "$TWILIO_AUTH_TOKEN" ]; then
    echo "Warning: Twilio credentials not set - voice calling will be disabled"
fi

if [ ${#missing_keys[@]} -gt 0 ]; then
    echo "Error: Missing required API keys:"
    printf '  %s\n' "${missing_keys[@]}"
    echo ""
    echo "Please set these environment variables and try again."
    echo "For setup instructions, see: ./deployment/DEPLOYMENT_BLUEPRINT.md"
    exit 1
fi

# Initialize database schema if needed
echo "Checking database schema..."
npm run db:push

# Start the AI engines
echo "Starting AI Engine Manager..."
node -r tsx/esm server/ai-engines/engine-manager.ts &
ENGINE_PID=$!

# Start main application
echo "Starting main application..."
npm run start &
APP_PID=$!

# Health check function
health_check() {
    local max_attempts=30
    local attempt=1
    
    echo "Performing health checks..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:5000/api/engines/status > /dev/null 2>&1; then
            echo "✅ Application is healthy"
            return 0
        fi
        
        echo "Attempt $attempt/$max_attempts - waiting for application..."
        sleep 5
        ((attempt++))
    done
    
    echo "❌ Health check failed - application not responding"
    return 1
}

# Wait for application to start
sleep 10

# Perform health check
if health_check; then
    echo ""
    echo "🎉 Shatzii AI Engines started successfully!"
    echo ""
    echo "Services running:"
    echo "  📊 Dashboard: http://localhost:5000"
    echo "  🤖 Marketing Engine: Active"
    echo "  💼 Sales Engine: Active"
    echo "  📈 Live Operations: http://localhost:5000/autonomous-marketing"
    echo ""
    echo "Engine Status:"
    curl -s http://localhost:5000/api/engines/status | jq '.'
    echo ""
    echo "Current Metrics:"
    curl -s http://localhost:5000/api/engines/metrics | jq '.combined'
    echo ""
    echo "The AI agents are now running autonomously and will:"
    echo "  • Generate leads continuously"
    echo "  • Create and execute marketing campaigns"
    echo "  • Qualify and nurture prospects"
    echo "  • Conduct sales demos"
    echo "  • Negotiate and close deals"
    echo ""
    echo "Monitor progress at: http://localhost:5000/autonomous-marketing"
    echo "Logs are available in: ./logs/"
else
    echo "❌ Failed to start engines"
    kill $ENGINE_PID $APP_PID 2>/dev/null
    exit 1
fi

# Keep script running and monitor processes
trap 'echo "Shutting down..."; kill $ENGINE_PID $APP_PID; exit' INT TERM

# Monitor and restart if needed
while true; do
    if ! kill -0 $ENGINE_PID 2>/dev/null; then
        echo "Engine process died, restarting..."
        node -r tsx/esm server/ai-engines/engine-manager.ts &
        ENGINE_PID=$!
    fi
    
    if ! kill -0 $APP_PID 2>/dev/null; then
        echo "Application process died, restarting..."
        npm run start &
        APP_PID=$!
    fi
    
    sleep 30
done