#!/bin/bash
# start-app.sh - Start the Next.js application

set -e

echo "🎬 Starting Go4it application..."

# Set production environment
export NODE_ENV=production

# Kill any existing process
if [ -f "app.pid" ]; then
    old_pid=$(cat app.pid)
    if ps -p $old_pid > /dev/null 2>&1; then
        echo "🛑 Stopping existing process (PID: $old_pid)..."
        kill $old_pid
        sleep 3
    fi
    rm app.pid
fi

# Create logs directory
mkdir -p logs

# Start application in background
echo "🚀 Starting application on port 3000..."
npm run start:production > logs/app.log 2>&1 &

# Save PID
app_pid=$!
echo $app_pid > app.pid
echo "✓ Application started (PID: $app_pid)"

# Wait for startup
echo "⏳ Waiting for application to start..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "✓ Application is responding"
        break
    fi
    
    # Check if process is still running
    if ! ps -p $app_pid > /dev/null 2>&1; then
        echo "❌ Application process died"
        echo "Last 20 lines of log:"
        tail -20 logs/app.log
        exit 1
    fi
    
    sleep 2
    ((attempt++))
    echo -n "."
done
echo ""

if [ $attempt -eq $max_attempts ]; then
    echo "❌ Application failed to start within timeout"
    echo "Last 50 lines of log:"
    tail -50 logs/app.log
    exit 1
fi

# Health check
echo "🏥 Running comprehensive health check..."
response=$(curl -s http://localhost:3000/api/health)

if echo "$response" | grep -q '"status":"healthy"'; then
    echo "✅ Application is healthy!"
    echo ""
    echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
else
    echo "⚠️  Application started but health check shows issues:"
    echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
fi

echo ""
echo "📝 Monitor logs: tail -f logs/app.log"
echo "🛑 Stop app: kill \$(cat app.pid)"
echo ""
echo "✅ Application is running!"
echo ""
