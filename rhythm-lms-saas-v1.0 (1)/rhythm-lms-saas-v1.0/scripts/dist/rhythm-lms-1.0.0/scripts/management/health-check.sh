#!/bin/bash
# Rhythm-LMS Health Check Script

echo "Checking Rhythm-LMS system health..."

# Check application
if curl -f http://localhost:5000/api/health >/dev/null 2>&1; then
    echo "✅ Application: Healthy"
else
    echo "❌ Application: Not responding"
fi

# Check database
if pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    echo "✅ Database: Connected"
else
    echo "❌ Database: Connection failed"
fi

# Check AI engine
if curl -f http://localhost:3030/health >/dev/null 2>&1; then
    echo "✅ AI Engine: Running"
else
    echo "❌ AI Engine: Not responding"
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 90 ]; then
    echo "✅ Disk Space: ${DISK_USAGE}% used"
else
    echo "⚠️  Disk Space: ${DISK_USAGE}% used (high)"
fi

# Check memory
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.2f", $3*100/$2}')
echo "📊 Memory Usage: ${MEMORY_USAGE}%"
