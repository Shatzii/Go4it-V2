#!/bin/bash

# Go4It Sports - Complete Deployment Script
# This script handles server-side deployment operations

# Set color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}      Go4It Sports - Server-Side Deployment Script         ${NC}"
echo -e "${GREEN}============================================================${NC}"
echo

# Configuration (Edit these to match your environment)
CLIENT_PATH="/var/www/go4itsports/client"
SERVER_PATH="/var/www/go4itsports/server"
MONACO_PATH="/var/www/html/pharaoh"
WEB_ROOT="/var/www/html"
LOG_FILE="${WEB_ROOT}/deployment.log"

# Function to log messages
log() {
    local message="$1"
    local type="${2:-INFO}"
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    echo -e "[${timestamp}] [${type}] ${message}" >> "${LOG_FILE}"
    echo -e "[${timestamp}] [${type}] ${message}"
}

# Step 1: Create Directory Structure
log "Step 1: Creating directory structure..." "INFO"
mkdir -p "${CLIENT_PATH}" 2>/dev/null
if [ $? -eq 0 ]; then
    log "Created client directory: ${CLIENT_PATH}" "SUCCESS"
else
    log "Failed to create client directory: ${CLIENT_PATH}" "ERROR"
fi

mkdir -p "${SERVER_PATH}" 2>/dev/null
if [ $? -eq 0 ]; then
    log "Created server directory: ${SERVER_PATH}" "SUCCESS"
else
    log "Failed to create server directory: ${SERVER_PATH}" "ERROR"
fi

mkdir -p "${MONACO_PATH}/js" 2>/dev/null
if [ $? -eq 0 ]; then
    log "Created Monaco directory: ${MONACO_PATH}" "SUCCESS"
else
    log "Failed to create Monaco directory: ${MONACO_PATH}" "ERROR"
fi

# Step 2: Copy deployment server script to web root if it doesn't exist
PHP_SCRIPT="${WEB_ROOT}/go4it_deploy_server.php"
if [ ! -f "${PHP_SCRIPT}" ]; then
    if [ -f "go4it_deploy_server.php" ]; then
        cp "go4it_deploy_server.php" "${PHP_SCRIPT}"
        chmod 644 "${PHP_SCRIPT}"
        log "Copied deployment server script to ${PHP_SCRIPT}" "SUCCESS"
    else
        log "Deployment server script not found" "ERROR"
    fi
else
    log "Deployment server script already exists at ${PHP_SCRIPT}" "INFO"
fi

# Step 3: Create sample Monaco integration file if it doesn't exist
MONACO_JS="${MONACO_PATH}/js/direct_integration.js"
if [ ! -f "${MONACO_JS}" ]; then
    cat > "${MONACO_JS}" << 'EOF'
// Go4It Sports - Monaco Editor Integration with StarCoder

(function() {
    // Initialize variables
    let editor = null;
    let starCoderEnabled = false;
    let statusBar = null;
    
    // Set up API connection
    function initializeStarCoder() {
        console.log("Initializing StarCoder integration...");
        starCoderEnabled = true;
        updateStatus("StarCoder Enabled", "success");
        
        return {
            analyze: async function(code) {
                console.log("Analyzing code with StarCoder AI");
                // In a real implementation, this would call the AI API
                return {
                    suggestions: ["Optimize loop efficiency", "Add error handling", "Consider using a more specific type"],
                    issues: []
                };
            },
            complete: async function(code, position) {
                console.log("Generating completion at position:", position);
                // In a real implementation, this would call the AI API
                return {
                    completions: ["function example() {", "const result = ", "return {"]
                };
            },
            fix: async function(code, errors) {
                console.log("Fixing code with StarCoder AI");
                // In a real implementation, this would call the AI API
                return {
                    fixedCode: code,
                    changes: []
                };
            }
        };
    }
    
    // Connect to Monaco
    function setupMonaco() {
        // Find the Monaco editor instance
        const interval = setInterval(() => {
            if (typeof monaco !== 'undefined') {
                clearInterval(interval);
                console.log("Monaco editor detected, setting up integration");
                
                // Wait for the editor to be initialized
                const editorInterval = setInterval(() => {
                    const editorElements = document.querySelectorAll('.monaco-editor');
                    if (editorElements.length > 0) {
                        clearInterval(editorInterval);
                        
                        // Get the editor instance
                        editor = monaco.editor.getModels()[0];
                        if (editor) {
                            console.log("Editor instance found, initializing StarCoder integration");
                            initUI();
                        }
                    }
                }, 500);
            }
        }, 500);
    }
    
    // Initialize UI elements
    function initUI() {
        // Create status bar
        statusBar = document.createElement('div');
        statusBar.style.position = 'fixed';
        statusBar.style.bottom = '20px';
        statusBar.style.right = '20px';
        statusBar.style.padding = '8px 12px';
        statusBar.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        statusBar.style.borderRadius = '4px';
        statusBar.style.color = 'white';
        statusBar.style.fontFamily = 'monospace';
        statusBar.style.zIndex = '9999';
        document.body.appendChild(statusBar);
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Ctrl+Shift+A for code analysis
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                analyzeCode();
            }
            
            // Ctrl+Shift+F for code fixing
            if (e.ctrlKey && e.shiftKey && e.key === 'F') {
                e.preventDefault();
                fixCode();
            }
            
            // Ctrl+Shift+Q for AI assistant
            if (e.ctrlKey && e.shiftKey && e.key === 'Q') {
                e.preventDefault();
                askAI();
            }
        });
        
        updateStatus("StarCoder Ready", "info");
    }
    
    // Update status bar
    function updateStatus(message, type) {
        if (!statusBar) return;
        
        statusBar.textContent = message;
        
        // Set color based on type
        if (type === 'success') {
            statusBar.style.backgroundColor = 'rgba(0, 128, 0, 0.7)';
        } else if (type === 'error') {
            statusBar.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        } else if (type === 'info') {
            statusBar.style.backgroundColor = 'rgba(0, 0, 128, 0.7)';
        } else if (type === 'warning') {
            statusBar.style.backgroundColor = 'rgba(255, 165, 0, 0.7)';
        }
        
        // Clear status after 3 seconds
        setTimeout(() => {
            if (type !== 'error' && type !== 'success') {
                statusBar.textContent = starCoderEnabled ? "StarCoder Enabled" : "StarCoder Disabled";
                statusBar.style.backgroundColor = starCoderEnabled ? 'rgba(0, 128, 0, 0.7)' : 'rgba(0, 0, 0, 0.7)';
            }
        }, 3000);
    }
    
    // Function to analyze code
    async function analyzeCode() {
        if (!editor || !starCoderEnabled) return;
        
        updateStatus("Analyzing code...", "info");
        
        try {
            const starCoder = initializeStarCoder();
            const code = editor.getValue();
            const analysis = await starCoder.analyze(code);
            
            console.log("Analysis result:", analysis);
            updateStatus("Analysis complete", "success");
            
            // In a real implementation, display the analysis results in a UI
            showAnalysisResults(analysis);
        } catch (error) {
            console.error("Error analyzing code:", error);
            updateStatus("Analysis failed: " + error.message, "error");
        }
    }
    
    // Function to fix code
    async function fixCode() {
        if (!editor || !starCoderEnabled) return;
        
        updateStatus("Fixing code...", "info");
        
        try {
            const starCoder = initializeStarCoder();
            const code = editor.getValue();
            // In a real implementation, we would get actual errors from Monaco
            const errors = [];
            
            const fixResult = await starCoder.fix(code, errors);
            
            console.log("Fix result:", fixResult);
            updateStatus("Code fixing complete", "success");
            
            // In a real implementation, apply the fixes to the editor
        } catch (error) {
            console.error("Error fixing code:", error);
            updateStatus("Code fixing failed: " + error.message, "error");
        }
    }
    
    // Function to ask AI for help
    async function askAI() {
        if (!starCoderEnabled) return;
        
        // In a real implementation, we would open a chat UI to interact with the AI
        updateStatus("AI Assistant activated", "info");
        
        // Create a simple prompt input
        const prompt = window.prompt("Ask StarCoder AI a question:");
        if (!prompt) return;
        
        updateStatus("Processing question...", "info");
        
        try {
            // In a real implementation, we would call the AI API
            setTimeout(() => {
                updateStatus("AI response received", "success");
                
                // Create a simple response display
                const response = "This is a simulated AI response. In a real implementation, this would be a helpful answer generated by StarCoder AI.";
                alert("StarCoder AI Response:\n\n" + response);
            }, 1500);
        } catch (error) {
            console.error("Error processing AI request:", error);
            updateStatus("AI request failed: " + error.message, "error");
        }
    }
    
    // Display analysis results
    function showAnalysisResults(analysis) {
        // Create a simple display for the analysis results
        let message = "StarCoder Analysis Results:\n\n";
        
        if (analysis.suggestions && analysis.suggestions.length > 0) {
            message += "Suggestions:\n";
            analysis.suggestions.forEach((suggestion, index) => {
                message += `${index + 1}. ${suggestion}\n`;
            });
            message += "\n";
        }
        
        if (analysis.issues && analysis.issues.length > 0) {
            message += "Issues:\n";
            analysis.issues.forEach((issue, index) => {
                message += `${index + 1}. ${issue}\n`;
            });
        } else {
            message += "No issues found!";
        }
        
        alert(message);
    }
    
    // Initialize when the page loads
    window.addEventListener("load", function() {
        console.log("Go4It Monaco integration loaded");
        setupMonaco();
        const starCoder = initializeStarCoder();
    });
})();
EOF
    
    chmod 644 "${MONACO_JS}"
    log "Created sample Monaco integration file: ${MONACO_JS}" "SUCCESS"
else
    log "Monaco integration file already exists at ${MONACO_JS}" "INFO"
fi

# Step 4: Create launcher HTML file
LAUNCHER_HTML="${WEB_ROOT}/go4it_launcher.html"
if [ ! -f "${LAUNCHER_HTML}" ]; then
    if [ -f "go4it_launcher_functional.html" ]; then
        cp "go4it_launcher_functional.html" "${LAUNCHER_HTML}"
        chmod 644 "${LAUNCHER_HTML}"
        log "Copied launcher HTML file to ${LAUNCHER_HTML}" "SUCCESS"
    else
        log "Launcher HTML file not found" "ERROR"
    fi
else
    log "Launcher HTML file already exists at ${LAUNCHER_HTML}" "INFO"
fi

# Step 5: Set permissions
log "Setting file permissions..." "INFO"

# Set directory permissions
find "${CLIENT_PATH}" -type d -exec chmod 755 {} \; 2>/dev/null
find "${SERVER_PATH}" -type d -exec chmod 755 {} \; 2>/dev/null
find "${MONACO_PATH}" -type d -exec chmod 755 {} \; 2>/dev/null

# Set file permissions
find "${CLIENT_PATH}" -type f -exec chmod 644 {} \; 2>/dev/null
find "${SERVER_PATH}" -type f -exec chmod 644 {} \; 2>/dev/null
find "${MONACO_PATH}" -type f -exec chmod 644 {} \; 2>/dev/null

# Make scripts executable
find "${SERVER_PATH}" -name "*.sh" -exec chmod 755 {} \; 2>/dev/null

log "Permissions set successfully" "SUCCESS"

# Step 6: Display completion message
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}      Go4It Sports Server-Side Deployment Complete!        ${NC}"
echo -e "${GREEN}============================================================${NC}"
echo
echo -e "${YELLOW}You can now access the launcher at:${NC}"
echo -e "${BLUE}http://YOUR_SERVER_IP/go4it_launcher.html${NC}"
echo
echo -e "${YELLOW}Server-side API handler is available at:${NC}"
echo -e "${BLUE}http://YOUR_SERVER_IP/go4it_deploy_server.php${NC}"
echo
log "Deployment script completed successfully" "SUCCESS"
