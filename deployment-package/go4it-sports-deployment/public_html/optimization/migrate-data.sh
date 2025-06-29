#!/bin/bash
# Go4It Sports Database and File Migration Script
# This script helps migrate data from the old server to the new one

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration - MODIFY THESE
OLD_SERVER_IP="5.16.1.9"
NEW_SERVER_IP="188.245.209.124"
DB_NAME="go4it"
DB_USER="go4ituser"
DB_PASS="CHANGE_THIS_PASSWORD" # Change this!
MIGRATION_TIME=$(date +"%Y%m%d-%H%M%S")
BACKUP_DIR="/tmp/go4it-migration-${MIGRATION_TIME}"

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Go4It Sports Data Migration Script${NC}"
echo -e "${GREEN}From: ${OLD_SERVER_IP} To: ${NEW_SERVER_IP}${NC}"
echo -e "${GREEN}=========================================${NC}"

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
    echo -e "${RED}This script must be run as root${NC}"
    exit 1
fi

# Create backup directory
mkdir -p ${BACKUP_DIR}
chmod 700 ${BACKUP_DIR}

# Ask for SSH access to old server
echo -e "\n${YELLOW}Do you have SSH key-based access to the old server?${NC}"
read -p "Enter 'yes' or 'no': " HAS_SSH_ACCESS

# Step 1: Database Migration
echo -e "\n${GREEN}Step 1: Database Migration${NC}"
if [ "$HAS_SSH_ACCESS" = "yes" ]; then
    echo -e "${YELLOW}Connecting to old server to dump database...${NC}"
    ssh root@${OLD_SERVER_IP} "pg_dump -U ${DB_USER} ${DB_NAME} > /tmp/go4it_dump.sql"
    echo -e "${YELLOW}Transferring database dump from old server...${NC}"
    scp root@${OLD_SERVER_IP}:/tmp/go4it_dump.sql ${BACKUP_DIR}/
    echo -e "${YELLOW}Cleaning up temporary file on old server...${NC}"
    ssh root@${OLD_SERVER_IP} "rm /tmp/go4it_dump.sql"
else
    echo -e "${YELLOW}Please download the database dump from the old server and upload it to this server.${NC}"
    echo -e "${YELLOW}On the old server, run:${NC}"
    echo "pg_dump -U ${DB_USER} ${DB_NAME} > /tmp/go4it_dump.sql"
    echo -e "${YELLOW}Then download the file and upload it to the new server.${NC}"
    
    read -p "Enter the path to the uploaded database dump file: " DB_DUMP_PATH
    
    if [ ! -f "$DB_DUMP_PATH" ]; then
        echo -e "${RED}Database dump file not found: ${DB_DUMP_PATH}${NC}"
        exit 1
    fi
    
    # Copy to backup directory
    cp $DB_DUMP_PATH ${BACKUP_DIR}/go4it_dump.sql
    echo -e "${GREEN}Database dump file copied to backup directory.${NC}"
fi

# Restore database
echo -e "${YELLOW}Restoring database on new server...${NC}"
sudo -u postgres psql -c "DROP DATABASE IF EXISTS ${DB_NAME};"
sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"
sudo -u postgres psql -d ${DB_NAME} -f ${BACKUP_DIR}/go4it_dump.sql
echo -e "${GREEN}Database restored successfully!${NC}"

# Step 2: File Migration (uploads)
echo -e "\n${GREEN}Step 2: Uploads Directory Migration${NC}"
UPLOADS_DIR="/var/www/go4it/uploads"
mkdir -p ${UPLOADS_DIR}

if [ "$HAS_SSH_ACCESS" = "yes" ]; then
    echo -e "${YELLOW}Creating compressed archive of uploads directory on old server...${NC}"
    ssh root@${OLD_SERVER_IP} "cd /var/www/go4it && tar -czf /tmp/uploads.tar.gz uploads"
    echo -e "${YELLOW}Transferring uploads from old server...${NC}"
    scp root@${OLD_SERVER_IP}:/tmp/uploads.tar.gz ${BACKUP_DIR}/
    echo -e "${YELLOW}Cleaning up temporary file on old server...${NC}"
    ssh root@${OLD_SERVER_IP} "rm /tmp/uploads.tar.gz"
    
    echo -e "${YELLOW}Extracting uploads to new server...${NC}"
    tar -xzf ${BACKUP_DIR}/uploads.tar.gz -C /var/www/go4it/
    echo -e "${GREEN}Uploads directory migrated successfully!${NC}"
else
    echo -e "${YELLOW}Please download the uploads directory from the old server and upload it to this server.${NC}"
    echo -e "${YELLOW}On the old server, run:${NC}"
    echo "cd /var/www/go4it && tar -czf /tmp/uploads.tar.gz uploads"
    echo -e "${YELLOW}Then download the file and upload it to the new server.${NC}"
    
    read -p "Enter the path to the uploaded tar.gz file: " UPLOADS_PATH
    
    if [ ! -f "$UPLOADS_PATH" ]; then
        echo -e "${RED}Uploads archive file not found: ${UPLOADS_PATH}${NC}"
        exit 1
    fi
    
    # Extract to new location
    tar -xzf $UPLOADS_PATH -C /var/www/go4it/
    echo -e "${GREEN}Uploads directory extracted successfully!${NC}"
fi

# Set proper permissions
echo -e "${YELLOW}Setting proper permissions on uploads directory...${NC}"
chown -R www-data:www-data ${UPLOADS_DIR}
chmod -R 755 ${UPLOADS_DIR}

# Step 3: Set up incremental sync (optional)
echo -e "\n${GREEN}Step 3: Set up incremental sync${NC}"
if [ "$HAS_SSH_ACCESS" = "yes" ]; then
    echo -e "${YELLOW}Would you like to set up automated incremental synchronization?${NC}"
    read -p "Enter 'yes' or 'no': " SETUP_SYNC
    
    if [ "$SETUP_SYNC" = "yes" ]; then
        # Install rsync
        apt-get update
        apt-get install -y rsync
        
        # Create sync script
        SYNC_SCRIPT="/var/scripts/sync-uploads.sh"
        mkdir -p /var/scripts
        
        cat > ${SYNC_SCRIPT} << EOF
#!/bin/bash
# Incremental sync of uploads from old server to new server
LOGFILE="/var/log/go4it-sync.log"
echo "===== Sync started at \$(date) =====" >> \$LOGFILE
rsync -avz --delete -e ssh root@${OLD_SERVER_IP}:/var/www/go4it/uploads/ /var/www/go4it/uploads/ >> \$LOGFILE 2>&1
chown -R www-data:www-data /var/www/go4it/uploads/
echo "===== Sync completed at \$(date) =====" >> \$LOGFILE
EOF
        
        chmod +x ${SYNC_SCRIPT}
        
        # Set up cron job
        echo -e "${YELLOW}Setting up hourly sync via cron...${NC}"
        (crontab -l 2>/dev/null; echo "0 * * * * /var/scripts/sync-uploads.sh") | crontab -
        
        echo -e "${GREEN}Incremental sync set up successfully!${NC}"
        echo -e "${YELLOW}Uploads will be synced hourly from old server to new server.${NC}"
    else
        echo -e "${YELLOW}Skipping incremental sync setup.${NC}"
    fi
else
    echo -e "${YELLOW}Incremental sync requires SSH access to old server.${NC}"
    echo -e "${YELLOW}Skipping this step.${NC}"
fi

# Final step: Create a migration report
echo -e "\n${GREEN}Creating migration report...${NC}"
cat > ${BACKUP_DIR}/migration-report.txt << EOF
Go4It Sports Migration Report
============================
Date: $(date)
From: ${OLD_SERVER_IP}
To: ${NEW_SERVER_IP}
Database: ${DB_NAME}

Migration Summary
----------------
- Database migrated and restored
- Uploads directory migrated
- Permissions set correctly
- Backup saved to: ${BACKUP_DIR}

Next Steps
---------
1. Verify the application is working correctly
2. Update DNS records to point to the new server
3. Monitor application for any issues
4. Once verified, cleanup old server

Backup Information
----------------
A backup of all migrated data is stored in:
${BACKUP_DIR}

You may want to keep this backup for a few days until
you're confident the migration was successful.
EOF

echo -e "${GREEN}Migration complete! Report saved to ${BACKUP_DIR}/migration-report.txt${NC}"
echo -e "${YELLOW}Please verify the application is working correctly on the new server.${NC}"
echo -e "${YELLOW}Then update DNS records to point to the new server IP (${NEW_SERVER_IP}).${NC}"

# Display summary
echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}Migration Summary:${NC}"
echo -e "${GREEN}=========================================${NC}"
echo -e "${YELLOW}Database:${NC} Migrated to ${DB_NAME}"
echo -e "${YELLOW}Uploads:${NC} Migrated to ${UPLOADS_DIR}"
echo -e "${YELLOW}Backup:${NC} Saved to ${BACKUP_DIR}"
echo -e "${YELLOW}Next:${NC} Verify application and update DNS records"