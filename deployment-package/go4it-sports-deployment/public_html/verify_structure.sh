#!/bin/bash

# Go4It Sports - Structure Verification Script
# This script verifies the structure of the deployed Go4It Sports platform
# and uses StarCoder AI to suggest fixes for missing components

# Set color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}      Go4It Sports - Structure Verification Script         ${NC}"
echo -e "${GREEN}============================================================${NC}"
echo

# Configuration
CLIENT_PATH="/var/www/go4itsports/client"
SERVER_PATH="/var/www/go4itsports/server"
SHARED_PATH="/var/www/go4itsports/shared"
LOG_FILE="/var/www/go4itsports/verify_structure.log"
STARCODER_URL="http://localhost:11434/v1/chat/completions"

# Required files and directories
CLIENT_REQUIRED=(
    "package.json"
    "index.html"
    "src/App.tsx"
    "src/main.tsx"
    "src/pages"
    "src/components"
    "public"
)

SERVER_REQUIRED=(
    "package.json"
    "index.ts"
    "db.ts"
    "routes.ts"
    "storage.ts"
)

SHARED_REQUIRED=(
    "schema.ts"
    "types.ts"
)

# Function to log messages
log() {
    local message="$1"
    local type="${2:-INFO}"
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    echo -e "[${timestamp}] [${type}] ${message}" >> "${LOG_FILE}"
    echo -e "[${timestamp}] [${type}] ${message}"
}

# Ensure log file exists
touch "${LOG_FILE}"

# Function to check if an item exists
check_item() {
    local path="$1"
    local item="$2"
    local type="$3"
    
    if [ -e "${path}/${item}" ]; then
        log "✅ ${type} ${item} exists" "SUCCESS"
        return 0
    else
        log "❌ ${type} ${item} does not exist" "ERROR"
        return 1
    fi
}

# Function to call StarCoder API to generate missing file
generate_file() {
    local path="$1"
    local file="$2"
    local type="$3"
    
    log "🤖 Generating ${type} ${file} with StarCoder AI" "INFO"
    
    # Prepare prompt for StarCoder
    local prompt="Generate a standard ${file} file for the ${type} part of a sports platform called Go4It Sports. This platform is for neurodivergent student athletes aged 12-18 with ADHD. The platform uses React, TypeScript, Express, and PostgreSQL with Drizzle ORM. The file should be production-ready and follow best practices."
    
    # Create JSON payload
    local payload="{\"model\":\"codellama:13b-8bit\",\"messages\":[{\"role\":\"user\",\"content\":\"${prompt}\"}],\"temperature\":0.7,\"max_tokens\":2000}"
    
    # Call StarCoder API
    if command -v curl &> /dev/null; then
        local response=$(curl -s -X POST "${STARCODER_URL}" \
            -H "Content-Type: application/json" \
            -d "${payload}" 2>&1)
        
        # Check if we got a valid response
        if [[ $response == *"content"* ]]; then
            # Extract the code from the response
            local code=$(echo "$response" | grep -o '"content": *"[^"]*"' | sed 's/"content": *"\(.*\)"/\1/')
            
            # Remove escaped newlines and quotes
            code=$(echo "$code" | sed 's/\\n/\n/g' | sed 's/\\"/"/g')
            
            # Create the directory if it doesn't exist
            mkdir -p "$(dirname "${path}/${file}")"
            
            # Write the code to the file
            echo -e "$code" > "${path}/${file}"
            
            log "✅ Generated ${type} ${file} with StarCoder AI" "SUCCESS"
            return 0
        else
            log "❌ Failed to generate ${type} ${file} with StarCoder AI: $response" "ERROR"
            return 1
        fi
    else
        log "❌ curl command not found, cannot call StarCoder API" "ERROR"
        return 1
    fi
}

# Verify client structure
log "Verifying client structure..." "INFO"
missing_client=0

for item in "${CLIENT_REQUIRED[@]}"; do
    if ! check_item "${CLIENT_PATH}" "${item}" "Client"; then
        missing_client=$((missing_client + 1))
        
        # Try to generate missing file with StarCoder AI
        if [[ "$item" != *"/"* ]]; then  # Only generate files, not directories
            generate_file "${CLIENT_PATH}" "${item}" "Client"
        else
            # Create directory if it's missing
            mkdir -p "${CLIENT_PATH}/${item}"
            log "✅ Created directory ${CLIENT_PATH}/${item}" "SUCCESS"
        fi
    fi
done

# Verify server structure
log "Verifying server structure..." "INFO"
missing_server=0

for item in "${SERVER_REQUIRED[@]}"; do
    if ! check_item "${SERVER_PATH}" "${item}" "Server"; then
        missing_server=$((missing_server + 1))
        
        # Try to generate missing file with StarCoder AI
        if [[ "$item" != *"/"* ]]; then  # Only generate files, not directories
            generate_file "${SERVER_PATH}" "${item}" "Server"
        else
            # Create directory if it's missing
            mkdir -p "${SERVER_PATH}/${item}"
            log "✅ Created directory ${SERVER_PATH}/${item}" "SUCCESS"
        fi
    fi
done

# Verify shared structure
log "Verifying shared structure..." "INFO"
missing_shared=0

for item in "${SHARED_REQUIRED[@]}"; do
    if ! check_item "${SHARED_PATH}" "${item}" "Shared"; then
        missing_shared=$((missing_shared + 1))
        
        # Try to generate missing file with StarCoder AI
        if [[ "$item" != *"/"* ]]; then  # Only generate files, not directories
            generate_file "${SHARED_PATH}" "${item}" "Shared"
        else
            # Create directory if it's missing
            mkdir -p "${SHARED_PATH}/${item}"
            log "✅ Created directory ${SHARED_PATH}/${item}" "SUCCESS"
        fi
    fi
done

# Calculate total missing items
total_missing=$((missing_client + missing_server + missing_shared))

# Report results
echo -e "${GREEN}============================================================${NC}"
if [ $total_missing -eq 0 ]; then
    echo -e "${GREEN}      Go4It Sports - Structure Verification Successful!     ${NC}"
    log "Structure verification completed successfully. All required files and directories exist." "SUCCESS"
    echo -e "${GREEN}============================================================${NC}"
    echo
    echo -e "${GREEN}All required files and directories exist.${NC}"
    exit 0
else
    echo -e "${YELLOW}      Go4It Sports - Structure Verification Warning!       ${NC}"
    log "Structure verification completed with warnings. Some files or directories were missing and were attempted to be generated." "WARNING"
    echo -e "${YELLOW}============================================================${NC}"
    echo
    echo -e "${YELLOW}Missing items:${NC}"
    echo -e "${YELLOW}- Client: ${missing_client}${NC}"
    echo -e "${YELLOW}- Server: ${missing_server}${NC}"
    echo -e "${YELLOW}- Shared: ${missing_shared}${NC}"
    echo
    echo -e "${BLUE}Check the log file for details:${NC} ${LOG_FILE}"
    exit 1
fi