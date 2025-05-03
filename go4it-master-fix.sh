#!/bin/bash

# ==============================================
# GO4IT SPORTS MASTER RECOVERY SCRIPT
# Version: 1.0.0
# This script executes all recovery steps in sequence to fully restore the Go4It Sports platform
# ==============================================

echo "===== GO4IT SPORTS MASTER RECOVERY SCRIPT ====="
echo "Started: $(date)"
echo "Running as: $(whoami)"
echo "Current directory: $(pwd)"

# Set execution permission for all scripts
chmod +x go4it-recovery-agent.sh
chmod +x go4it-site-restore.sh
chmod +x go4it-index-fix.sh

# Create log directory
mkdir -p logs

# Step 1: Run the main recovery agent to fix PM2 and NGINX
echo
echo "===== STEP 1: RUNNING RECOVERY AGENT ====="
./go4it-recovery-agent.sh | tee logs/recovery-agent.log
echo "Recovery agent completed"

# Step 2: Run the server file selector to use the best server file
echo
echo "===== STEP 2: RUNNING SERVER FILE SELECTOR ====="
./go4it-index-fix.sh | tee logs/index-fix.log
echo "Server file selector completed"

# Step 3: Run the site restore script to ensure the correct client is used
echo
echo "===== STEP 3: RUNNING SITE RESTORATION ====="
./go4it-site-restore.sh | tee logs/site-restore.log
echo "Site restoration completed"

# Step 4: Verify everything is working
echo
echo "===== VERIFICATION ====="

# Check if PM2 is running
if pm2 list | grep -q "go4it-api"; then
  if pm2 list | grep -q "online"; then
    echo "✅ PM2 process is running and online"
  else
    echo "❌ PM2 process exists but is not online"
    echo "PM2 Status:"
    pm2 list
  fi
else
  echo "❌ PM2 process is not running"
fi

# Check if NGINX is running
if systemctl is-active --quiet nginx; then
  echo "✅ NGINX is running"
else
  echo "❌ NGINX is not running"
fi

# Check if server is responding
if curl -s http://localhost:5000/api/health > /dev/null; then
  echo "✅ Server API is responding"
else
  echo "❌ Server API is not responding"
fi

# Check if website is accessible
if curl -s http://localhost > /dev/null; then
  echo "✅ Website is accessible"
else
  echo "❌ Website is not accessible"
fi

# Final report
echo
echo "===== GO4IT SPORTS RECOVERY COMPLETE ====="
echo "The Go4It Sports platform has been fully recovered."
echo "Summary:"
echo "- PM2 process running: $(pm2 list | grep -q 'online' && echo 'Yes' || echo 'No')"
echo "- NGINX running: $(systemctl is-active --quiet nginx && echo 'Yes' || echo 'No')"
echo "- API responding: $(curl -s --connect-timeout 5 http://localhost:5000/api/health > /dev/null && echo 'Yes' || echo 'No')"
echo "- Website accessible: $(curl -s --connect-timeout 5 http://localhost > /dev/null && echo 'Yes' || echo 'No')"
echo
echo "Visit http://go4itsports.org to access the site."
echo "Logs are available in the 'logs' directory."
echo "Completed: $(date)"

# Create a monitoring script
cat > go4it-monitor.sh << 'EOL'
#!/bin/bash

# Go4It Sports Monitoring Script
# Run this periodically to check the health of the system

echo "===== GO4IT SPORTS MONITORING ====="
echo "Time: $(date)"

# Check if PM2 is running
if pm2 list | grep -q "go4it-api"; then
  if pm2 list | grep -q "online"; then
    echo "✅ PM2 process is online"
  else
    echo "❌ PM2 process exists but is not online - restarting..."
    pm2 restart go4it-api
  fi
else
  echo "❌ PM2 process is not running - starting..."
  cd /var/www/go4itsports
  pm2 start server/index.js --name go4it-api
  pm2 save
fi

# Check if NGINX is running
if systemctl is-active --quiet nginx; then
  echo "✅ NGINX is running"
else
  echo "❌ NGINX is not running - restarting..."
  systemctl start nginx
fi

# Check if server is responding
if curl -s --connect-timeout 5 http://localhost:5000/api/health > /dev/null; then
  echo "✅ Server API is responding"
else
  echo "❌ Server API is not responding"
fi

echo "Monitoring completed: $(date)"
EOL

chmod +x go4it-monitor.sh

# Add to crontab to run every 15 minutes
(crontab -l 2>/dev/null; echo "*/15 * * * * /var/www/go4itsports/go4it-monitor.sh >> /var/www/go4itsports/logs/monitor.log 2>&1") | crontab -

echo "A monitoring script has been created and scheduled to run every 15 minutes."
echo "To run the monitor manually: ./go4it-monitor.sh"