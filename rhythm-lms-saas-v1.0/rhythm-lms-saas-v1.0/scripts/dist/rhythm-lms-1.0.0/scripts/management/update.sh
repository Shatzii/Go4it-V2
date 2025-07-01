#!/bin/bash
# Rhythm-LMS Update Script

echo "Updating Rhythm-LMS..."

# Backup before update
./backup.sh

# Stop services
systemctl stop rhythm-lms

# Update application
cd /opt/rhythm-lms
git pull origin main
npm install
npm run build

# Update database schema
npm run db:push

# Start services
systemctl start rhythm-lms

# Verify update
sleep 10
if systemctl is-active --quiet rhythm-lms; then
    echo "✅ Update completed successfully"
else
    echo "❌ Update failed - restoring from backup"
    # Restore logic here
fi
