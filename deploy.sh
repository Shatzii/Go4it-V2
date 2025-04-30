#!/bin/bash

# Go4It Sports - Complete Deployment Script
# Usage: ./deploy.sh [package_path]

# Set color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}      Go4It Sports - Complete Deployment Script           ${NC}"
echo -e "${GREEN}============================================================${NC}"
echo

# Configuration variables
SERVER_URL="188.245.209.124"
CLIENT_PATH="/var/www/go4itsports/client"
SERVER_PATH="/var/www/go4itsports/server"
SHARED_PATH="/var/www/go4itsports/shared"
BACKUP_PATH="/var/www/go4itsports/backups"
TEMP_PATH="/var/www/go4itsports/uploads/temp"
LOG_FILE="/var/www/go4itsports/deploy.log"

# Get package path from argument or use default
PACKAGE_PATH=${1:-"${TEMP_PATH}/Go4It_Package.zip"}

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

# Check if package exists
if [ ! -f "${PACKAGE_PATH}" ]; then
    log "Package not found at ${PACKAGE_PATH}" "ERROR"
    exit 1
fi

# Create directories if they don't exist
log "Creating directories if they don't exist" "INFO"
mkdir -p "${CLIENT_PATH}"
mkdir -p "${SERVER_PATH}"
mkdir -p "${SHARED_PATH}"
mkdir -p "${BACKUP_PATH}"
mkdir -p "${TEMP_PATH}"

# Create backup of current state
BACKUP_DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_PATH}/backup_${BACKUP_DATE}.zip"
log "Creating backup of current state to ${BACKUP_FILE}" "INFO"

# Use zip to create backup
zip -r "${BACKUP_FILE}" "${CLIENT_PATH}" "${SERVER_PATH}" "${SHARED_PATH}" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    log "Backup created successfully" "SUCCESS"
else
    log "Failed to create backup" "ERROR"
    exit 1
fi

# Create temp extraction directory
EXTRACT_DIR="${TEMP_PATH}/extract_${BACKUP_DATE}"
mkdir -p "${EXTRACT_DIR}"

# Extract package
log "Extracting package to ${EXTRACT_DIR}" "INFO"
unzip -q "${PACKAGE_PATH}" -d "${EXTRACT_DIR}"
if [ $? -eq 0 ]; then
    log "Package extracted successfully" "SUCCESS"
else
    log "Failed to extract package" "ERROR"
    exit 1
fi

# Find the actual content directory (might be nested)
CONTENT_DIR="${EXTRACT_DIR}"
if [ -d "${EXTRACT_DIR}/client" ] && [ -d "${EXTRACT_DIR}/server" ]; then
    log "Found client and server directories in the root of the package" "INFO"
else
    # Look for subdirectories that might contain the actual content
    for dir in $(find "${EXTRACT_DIR}" -maxdepth 2 -type d); do
        if [ -d "${dir}/client" ] && [ -d "${dir}/server" ]; then
            CONTENT_DIR="${dir}"
            log "Found client and server directories in ${dir}" "INFO"
            break
        fi
    done
fi

# Check if content directories were found
if [ ! -d "${CONTENT_DIR}/client" ] || [ ! -d "${CONTENT_DIR}/server" ]; then
    log "Could not find client and server directories in the package" "ERROR"
    exit 1
fi

# Deploy client files
log "Deploying client files to ${CLIENT_PATH}" "INFO"
rm -rf "${CLIENT_PATH:?}/"*  # Clean target directory
cp -r "${CONTENT_DIR}/client/"* "${CLIENT_PATH}/"
if [ $? -eq 0 ]; then
    log "Client files deployed successfully" "SUCCESS"
else
    log "Failed to deploy client files" "ERROR"
    # Don't exit, try to deploy other components
fi

# Deploy server files
log "Deploying server files to ${SERVER_PATH}" "INFO"
rm -rf "${SERVER_PATH:?}/"*  # Clean target directory
cp -r "${CONTENT_DIR}/server/"* "${SERVER_PATH}/"
if [ $? -eq 0 ]; then
    log "Server files deployed successfully" "SUCCESS"
else
    log "Failed to deploy server files" "ERROR"
    # Don't exit, try to deploy other components
fi

# Deploy shared files if they exist
if [ -d "${CONTENT_DIR}/shared" ]; then
    log "Deploying shared files to ${SHARED_PATH}" "INFO"
    rm -rf "${SHARED_PATH:?}/"*  # Clean target directory
    cp -r "${CONTENT_DIR}/shared/"* "${SHARED_PATH}/"
    if [ $? -eq 0 ]; then
        log "Shared files deployed successfully" "SUCCESS"
    else
        log "Failed to deploy shared files" "ERROR"
        # Don't exit, continue with deployment
    fi
else
    log "No shared directory found in the package" "WARNING"
fi

# Set permissions
log "Setting file permissions" "INFO"
find "${CLIENT_PATH}" -type d -exec chmod 755 {} \; 2>/dev/null
find "${CLIENT_PATH}" -type f -exec chmod 644 {} \; 2>/dev/null
find "${SERVER_PATH}" -type d -exec chmod 755 {} \; 2>/dev/null
find "${SERVER_PATH}" -type f -exec chmod 644 {} \; 2>/dev/null
find "${SERVER_PATH}" -name "*.sh" -exec chmod 755 {} \; 2>/dev/null
find "${SHARED_PATH}" -type d -exec chmod 755 {} \; 2>/dev/null
find "${SHARED_PATH}" -type f -exec chmod 644 {} \; 2>/dev/null

# Run verify_structure.sh if it exists in the server directory
if [ -f "${SERVER_PATH}/verify_structure.sh" ]; then
    log "Running structure verification script" "INFO"
    chmod +x "${SERVER_PATH}/verify_structure.sh"
    "${SERVER_PATH}/verify_structure.sh"
    if [ $? -eq 0 ]; then
        log "Structure verification completed successfully" "SUCCESS"
    else
        log "Structure verification had issues, check logs for details" "WARNING"
    fi
else
    log "No structure verification script found" "INFO"
fi

# Clean up
log "Cleaning up temporary files" "INFO"
rm -rf "${EXTRACT_DIR}"

# Create a restore script that can revert to this backup
cat > "${BACKUP_PATH}/restore_${BACKUP_DATE}.sh" << EOF
#!/bin/bash
# Restore script for backup created on ${BACKUP_DATE}
echo "Restoring from backup ${BACKUP_FILE}..."
unzip -o "${BACKUP_FILE}" -d /
echo "Restoration complete!"
EOF
chmod +x "${BACKUP_PATH}/restore_${BACKUP_DATE}.sh"

# Create/Update the restore_last.sh script to point to the latest backup
cat > "/var/www/go4itsports/restore_last.sh" << EOF
#!/bin/bash
# This script restores the most recent backup
"${BACKUP_PATH}/restore_${BACKUP_DATE}.sh"
EOF
chmod +x "/var/www/go4itsports/restore_last.sh"

echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}      Go4It Sports Deployment Completed Successfully!      ${NC}"
echo -e "${GREEN}============================================================${NC}"
echo
echo -e "${YELLOW}Backup created:${NC} ${BACKUP_FILE}"
echo -e "${YELLOW}To restore this backup:${NC} ${BACKUP_PATH}/restore_${BACKUP_DATE}.sh"
echo -e "${YELLOW}To restore the latest backup:${NC} /var/www/go4itsports/restore_last.sh"
echo
echo -e "${BLUE}You can now access the Go4It Sports platform at:${NC}"
echo -e "${GREEN}http://${SERVER_URL}/${NC}"
echo
log "Deployment completed successfully" "SUCCESS"