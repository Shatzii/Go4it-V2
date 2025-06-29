#!/bin/bash

# Go4It Sports - Restore Latest Backup Script
# This script restores the most recent backup from the backups directory

# Set color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}      Go4It Sports - Restore Latest Backup Script          ${NC}"
echo -e "${GREEN}============================================================${NC}"
echo

# Configuration
BACKUP_PATH="/var/www/go4itsports/backups"
LOG_FILE="/var/www/go4itsports/restore.log"

# Ensure log file exists
touch "${LOG_FILE}"

# Function to log messages
log() {
    local message="$1"
    local type="${2:-INFO}"
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    echo -e "[${timestamp}] [${type}] ${message}" >> "${LOG_FILE}"
    echo -e "[${timestamp}] [${type}] ${message}"
}

# Check if backups directory exists
if [ ! -d "${BACKUP_PATH}" ]; then
    log "Backups directory not found: ${BACKUP_PATH}" "ERROR"
    echo -e "${RED}Error: Backups directory not found!${NC}"
    exit 1
fi

# Find the latest backup
latest_backup=$(find "${BACKUP_PATH}" -name "backup_*.zip" -type f -printf "%T@ %p\n" | sort -nr | head -1 | cut -d' ' -f2-)

if [ -z "${latest_backup}" ]; then
    log "No backup found in ${BACKUP_PATH}" "ERROR"
    echo -e "${RED}Error: No backup found!${NC}"
    exit 1
fi

# Extract backup date from filename
backup_date=$(echo "${latest_backup}" | grep -o "backup_[0-9_]*" | sed 's/backup_//')

# Create a backup of the current state before restoring
current_date=$(date +"%Y%m%d_%H%M%S")
current_backup="${BACKUP_PATH}/pre_restore_${current_date}.zip"

log "Creating backup of current state before restoring: ${current_backup}" "INFO"
echo -e "${YELLOW}Creating backup of current state before restoring...${NC}"

# Locations to backup
CLIENT_PATH="/var/www/go4itsports/client"
SERVER_PATH="/var/www/go4itsports/server"
SHARED_PATH="/var/www/go4itsports/shared"

# Create current backup
zip -r "${current_backup}" "${CLIENT_PATH}" "${SERVER_PATH}" "${SHARED_PATH}" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    log "Current state backup created successfully" "SUCCESS"
    echo -e "${GREEN}Current state backup created successfully.${NC}"
else
    log "Failed to create current state backup" "ERROR"
    echo -e "${RED}Warning: Failed to create current state backup.${NC}"
    
    # Ask user if they want to continue
    echo -e "${YELLOW}Do you want to continue with the restore anyway? (y/n)${NC}"
    read -r answer
    if [[ ! $answer =~ ^[Yy]$ ]]; then
        log "Restore cancelled by user" "INFO"
        echo -e "${YELLOW}Restore cancelled.${NC}"
        exit 0
    fi
fi

# Restore from latest backup
log "Restoring from backup: ${latest_backup}" "INFO"
echo -e "${YELLOW}Restoring from backup: ${latest_backup}${NC}"

# Perform the restore
unzip -o "${latest_backup}" -d / > /dev/null 2>&1
if [ $? -eq 0 ]; then
    log "Backup restored successfully" "SUCCESS"
    echo -e "${GREEN}Backup restored successfully!${NC}"
else
    log "Failed to restore backup" "ERROR"
    echo -e "${RED}Error: Failed to restore backup!${NC}"
    exit 1
fi

# Create a revert script to go back to the state before this restore
cat > "${BACKUP_PATH}/revert_to_pre_restore_${current_date}.sh" << EOF
#!/bin/bash
# Revert script to go back to state before restore on ${current_date}
echo "Reverting to state before restore..."
unzip -o "${current_backup}" -d /
echo "Reversion complete!"
EOF
chmod +x "${BACKUP_PATH}/revert_to_pre_restore_${current_date}.sh"

echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}      Go4It Sports - Restore Completed Successfully!       ${NC}"
echo -e "${GREEN}============================================================${NC}"
echo
echo -e "${YELLOW}Restored from:${NC} ${latest_backup}"
echo -e "${YELLOW}Pre-restore backup:${NC} ${current_backup}"
echo -e "${YELLOW}To revert this restore:${NC} ${BACKUP_PATH}/revert_to_pre_restore_${current_date}.sh"
echo
log "Restore process completed successfully" "SUCCESS"