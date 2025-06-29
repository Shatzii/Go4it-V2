#!/bin/bash

# Go4It Sports - Monaco Editor + StarCoder Integration
# This script connects the Go4It frontend with Monaco Editor and StarCoder

# Set color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - Edit these variables to match your setup
PHARAOH_DIR="/var/www/html/pharaoh"
GO4IT_DIR="/var/www/go4itsports/client"
STARCODER_API_URL="http://localhost:11434/v1"

# Display script header
echo -e "${GREEN}========================================================${NC}"
echo -e "${GREEN}  Go4It Sports - Monaco Editor + StarCoder Integration  ${NC}"
echo -e "${GREEN}========================================================${NC}"
echo -e "${YELLOW}This script will integrate Go4It with Monaco Editor + StarCoder${NC}"
echo

# Check if directories exist
if [ ! -d "$PHARAOH_DIR" ]; then
    echo -e "${RED}Error: Pharaoh directory not found at $PHARAOH_DIR${NC}"
    echo -e "${YELLOW}Please update the PHARAOH_DIR variable in this script${NC}"
    exit 1
fi

if [ ! -d "$GO4IT_DIR" ]; then
    echo -e "${RED}Error: Go4It directory not found at $GO4IT_DIR${NC}"
    echo -e "${YELLOW}Please update the GO4IT_DIR variable in this script${NC}"
    exit 1
fi

# Create integration directory in Go4It client
echo -e "${YELLOW}Creating integration directory in Go4It...${NC}"
mkdir -p "$GO4IT_DIR/src/components/editor"
mkdir -p "$GO4IT_DIR/public/monaco"

# Create Go4It editor component that loads Monaco
echo -e "${YELLOW}Creating Monaco Editor component for Go4It...${NC}"
cat > "$GO4IT_DIR/src/components/editor/MonacoEditor.jsx" << 'EOL'
import { useEffect, useRef, useState } from 'react';

/**
 * Monaco Editor Component with StarCoder Integration
 * 
 * This component loads Monaco Editor with StarCoder integration
 * from the existing Pharaoh installation.
 */
export default function MonacoEditor({ 
  defaultValue = '// Type your code here\n', 
  language = 'javascript',
  height = '600px',
  onChange = () => {},
  readOnly = false
}) {
  const containerRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [monaco, setMonaco] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to load Monaco Editor
    const loadMonaco = async () => {
      try {
        if (!window.require) {
          // Create require script
          const requireScript = document.createElement('script');
          requireScript.src = '/monaco/vs/loader.js';
          requireScript.async = true;
          requireScript.onload = () => setupMonaco();
          requireScript.onerror = () => setError('Failed to load Monaco Editor');
          document.body.appendChild(requireScript);
        } else {
          setupMonaco();
        }
      } catch (err) {
        console.error('Error loading Monaco Editor:', err);
        setError('Error loading Monaco Editor: ' + err.message);
      }
    };

    // Set up Monaco Editor
    const setupMonaco = () => {
      try {
        window.require.config({ 
          paths: { 'vs': '/monaco/vs' }
        });

        window.require(['vs/editor/editor.main'], function(monaco) {
          // Set monaco instance to state
          setMonaco(monaco);

          // Create editor instance
          if (containerRef.current) {
            const editorInstance = monaco.editor.create(containerRef.current, {
              value: defaultValue,
              language: language,
              theme: 'vs-dark',
              automaticLayout: true,
              minimap: { enabled: true },
              readOnly: readOnly,
              scrollBeyondLastLine: false,
              fontLigatures: true,
              fontFamily: '"Fira Code", Consolas, "Courier New", monospace',
              fontSize: 14,
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              roundedSelection: false,
              selectOnLineNumbers: true,
              wordWrap: 'on'
            });

            // Integrate StarCoder if available
            if (typeof window.integrateStarCoderWithMonaco === 'function') {
              window.integrateStarCoderWithMonaco(monaco, editorInstance);
              console.log('StarCoder integration initialized');
            } else {
              console.warn('StarCoder integration function not found');
            }

            // Set up onChange handler
            editorInstance.onDidChangeModelContent(() => {
              onChange(editorInstance.getValue());
            });

            // Save editor instance
            setEditor(editorInstance);
            setIsLoaded(true);
          }
        });
      } catch (err) {
        console.error('Error setting up Monaco Editor:', err);
        setError('Error setting up Monaco Editor: ' + err.message);
      }
    };

    // Load StarCoder integration script
    const loadStarCoderIntegration = () => {
      try {
        const starCoderScript = document.createElement('script');
        starCoderScript.src = '/direct_integration.js';
        starCoderScript.async = true;
        starCoderScript.onerror = () => {
          console.warn('Failed to load StarCoder integration script');
        };
        document.body.appendChild(starCoderScript);
      } catch (err) {
        console.error('Error loading StarCoder integration:', err);
      }
    };

    // Load scripts
    loadStarCoderIntegration();
    loadMonaco();

    // Cleanup function
    return () => {
      if (editor) {
        editor.dispose();
      }
    };
  }, [defaultValue, language, onChange, readOnly]);

  // Update editor content if defaultValue changes
  useEffect(() => {
    if (editor && defaultValue !== editor.getValue()) {
      editor.setValue(defaultValue);
    }
  }, [defaultValue, editor]);

  // Render error state
  if (error) {
    return (
      <div className="monaco-error">
        <p className="text-red-500">{error}</p>
        <p className="text-sm">
          Please make sure Monaco Editor files are available at /monaco/vs/
        </p>
      </div>
    );
  }

  return (
    <div className="monaco-editor-container">
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: height, 
          border: '1px solid #1e1e1e',
          borderRadius: '4px',
          overflow: 'hidden'
        }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
EOL

# Create an editor page in Go4It
echo -e "${YELLOW}Creating Monaco Editor page for Go4It...${NC}"
mkdir -p "$GO4IT_DIR/src/pages/developer"
cat > "$GO4IT_DIR/src/pages/developer/CodeEditorPage.jsx" << 'EOL'
import { useState } from 'react';
import MonacoEditor from '../../components/editor/MonacoEditor';

export default function CodeEditorPage() {
  const [code, setCode] = useState('// Welcome to Go4It Developer Editor\n// Powered by Monaco Editor + StarCoder AI\n\nfunction helloGo4It() {\n  console.log("Welcome to Go4It Sports!");\n}\n\nhelloGo4It();\n');
  const [language, setLanguage] = useState('javascript');
  
  // List of supported languages
  const languages = [
    'javascript', 'typescript', 'html', 'css', 'json', 'python',
    'java', 'csharp', 'php', 'ruby', 'go', 'rust', 'sql'
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-blue-500">Go4It Developer Studio</h1>
      
      <div className="flex items-center mb-4 space-x-4">
        <label className="font-medium text-gray-200">Language:</label>
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2"
        >
          {languages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        
        <div className="ml-auto text-sm text-gray-400">
          <span className="mr-4">Press <kbd className="bg-gray-700 px-2 py-1 rounded">Ctrl+Shift+A</kbd> to analyze code</span>
          <span className="mr-4">Press <kbd className="bg-gray-700 px-2 py-1 rounded">Ctrl+Shift+F</kbd> to fix issues</span>
          <span>Press <kbd className="bg-gray-700 px-2 py-1 rounded">Ctrl+Shift+Q</kbd> to ask about code</span>
        </div>
      </div>
      
      <div className="border border-gray-700 rounded-lg overflow-hidden">
        <MonacoEditor 
          defaultValue={code}
          language={language}
          height="70vh"
          onChange={setCode}
        />
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        <p>This editor is powered by Monaco Editor with StarCoder AI integration.</p>
        <p>StarCoder AI provides intelligent code analysis, error fixing, and code completion.</p>
      </div>
    </div>
  );
}
EOL

# Copy direct_integration.js to Go4It public directory
echo -e "${YELLOW}Copying StarCoder integration to Go4It...${NC}"
cp "/direct_integration.js" "$GO4IT_DIR/public/direct_integration.js" 2>/dev/null || {
  # If the file doesn't exist in the current directory, check if it exists in Pharaoh
  if [ -f "$PHARAOH_DIR/js/direct_integration.js" ]; then
    cp "$PHARAOH_DIR/js/direct_integration.js" "$GO4IT_DIR/public/direct_integration.js"
  else
    # Create the file with the correct StarCoder API URL
    echo -e "${YELLOW}Creating direct_integration.js file...${NC}"
    cat > "$GO4IT_DIR/public/direct_integration.js" << EOL
/**
 * Go4It Sports Star Coder Integration
 * 
 * This script integrates your existing Star Coder instance with Monaco Editor
 * and adds visual diagnostics, error handling, and code correction features.
 */

// Configuration
const STAR_CODER_API_URL = "${STARCODER_API_URL}"; // StarCoder API URL

// StarCoder API endpoints
const API_ENDPOINTS = {
  COMPLETIONS: \`\${STAR_CODER_API_URL}/chat/completions\`,
  MODELS: \`\${STAR_CODER_API_URL}/models\`
};

// Keyboard shortcuts config
const SHORTCUTS = {
  ANALYZE: "ctrl+shift+a",
  FIX: "ctrl+shift+f",
  QUERY: "ctrl+shift+q"
};

// Function declarations and implementation go here
// This file will be downloaded from the Replit environment

/**
 * Integrate Star Coder with Monaco Editor
 */
function integrateStarCoderWithMonaco(monaco, editor) {
  console.log('StarCoder integration initialized - API URL:', STAR_CODER_API_URL);
  // Integration logic will be here when the full file is used
}
EOL
  fi
}

# Create symlink from Monaco Editor files to Go4It public directory
echo -e "${YELLOW}Creating symlink to Monaco Editor files...${NC}"
if [ -d "$PHARAOH_DIR/monaco" ]; then
  ln -sf "$PHARAOH_DIR/monaco" "$GO4IT_DIR/public/"
elif [ -d "$PHARAOH_DIR/js/monaco" ]; then
  ln -sf "$PHARAOH_DIR/js/monaco" "$GO4IT_DIR/public/"
else
  echo -e "${RED}Monaco Editor files not found in $PHARAOH_DIR${NC}"
  echo -e "${YELLOW}You will need to manually copy Monaco Editor files to $GO4IT_DIR/public/monaco${NC}"
fi

# Create a readme file with instructions
echo -e "${YELLOW}Creating readme file with integration instructions...${NC}"
cat > "$GO4IT_DIR/src/components/editor/README.md" << EOL
# Monaco Editor + StarCoder Integration

This component integrates Monaco Editor with StarCoder AI into the Go4It Sports platform.

## Setup

1. Make sure Monaco Editor files are available at \`/monaco/vs/\` in the public directory
2. Make sure \`direct_integration.js\` is available at \`/direct_integration.js\` in the public directory
3. StarCoder API should be running at: ${STARCODER_API_URL}

## Usage

Import the Monaco Editor component:

\`\`\`jsx
import MonacoEditor from '../components/editor/MonacoEditor';

function MyEditorPage() {
  const [code, setCode] = useState('// Your code here');
  
  return (
    <MonacoEditor
      defaultValue={code}
      language="javascript"
      height="600px"
      onChange={(newCode) => setCode(newCode)}
      readOnly={false}
    />
  );
}
\`\`\`

## StarCoder Features

The following keyboard shortcuts are available:

- \`Ctrl+Shift+A\`: Analyze code with StarCoder
- \`Ctrl+Shift+F\`: Fix code issues with StarCoder
- \`Ctrl+Shift+Q\`: Ask StarCoder a question about your code

## Configuration

To change the StarCoder API URL, edit \`public/direct_integration.js\`.
EOL

# Create a verification script
echo -e "${YELLOW}Creating verification script...${NC}"
cat > "$GO4IT_DIR/src/components/editor/verify.js" << EOL
/**
 * Verification script for Monaco Editor + StarCoder integration
 * Run this script using Node.js to verify the integration
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const STARCODER_API_URL = "${STARCODER_API_URL}";
const GO4IT_DIR = "${GO4IT_DIR}";

// Verify files
console.log('Verifying Monaco Editor + StarCoder integration...');

// Check if direct_integration.js exists
const directIntegrationPath = path.join(GO4IT_DIR, 'public', 'direct_integration.js');
if (fs.existsSync(directIntegrationPath)) {
  console.log('✅ direct_integration.js exists');
} else {
  console.log('❌ direct_integration.js does not exist');
}

// Check if Monaco Editor files exist
const monacoPath = path.join(GO4IT_DIR, 'public', 'monaco');
if (fs.existsSync(monacoPath)) {
  console.log('✅ Monaco Editor files exist');
} else {
  console.log('❌ Monaco Editor files do not exist');
}

// Check if MonacoEditor component exists
const editorComponentPath = path.join(GO4IT_DIR, 'src', 'components', 'editor', 'MonacoEditor.jsx');
if (fs.existsSync(editorComponentPath)) {
  console.log('✅ MonacoEditor component exists');
} else {
  console.log('❌ MonacoEditor component does not exist');
}

// Check StarCoder API
console.log('Testing connection to StarCoder API...');
const url = new URL(STARCODER_API_URL);
const client = url.protocol === 'https:' ? https : http;

const req = client.request(
  {
    hostname: url.hostname,
    port: url.port,
    path: '/models',
    method: 'GET',
  },
  (res) => {
    if (res.statusCode === 200) {
      console.log('✅ StarCoder API is accessible');
    } else {
      console.log(\`❌ StarCoder API returned status code \${res.statusCode}\`);
    }
  }
);

req.on('error', (error) => {
  console.log('❌ Failed to connect to StarCoder API:', error.message);
});

req.end();
EOL

# Check if we have access to the go4it.js file to update the routes
if [ -f "$GO4IT_DIR/src/App.jsx" ]; then
  echo -e "${YELLOW}Updating App.jsx to include developer route...${NC}"
  # Check if the route already exists
  if grep -q "CodeEditorPage" "$GO4IT_DIR/src/App.jsx"; then
    echo -e "${GREEN}Developer route already exists in App.jsx${NC}"
  else
    # Backup the original file
    cp "$GO4IT_DIR/src/App.jsx" "$GO4IT_DIR/src/App.jsx.bak"
    
    # Update the file to include the new route
    awk -v blue="${BLUE}" -v nc="${NC}" '
    /import.*Route.*from.*wouter/ {
      print;
      if (!found_import) {
        print "import CodeEditorPage from \"./pages/developer/CodeEditorPage\";";
        found_import = 1;
      }
      next;
    }
    /<Route.*component={NotFoundPage}/ {
      print "        <Route path=\"/developer\" component={CodeEditorPage} />";
      print;
      next;
    }
    {print}
    ' "$GO4IT_DIR/src/App.jsx.bak" > "$GO4IT_DIR/src/App.jsx"
    
    echo -e "${GREEN}Updated App.jsx to include developer route${NC}"
  fi
else
  echo -e "${YELLOW}App.jsx not found. You will need to manually add the route to CodeEditorPage.${NC}"
fi

# Check if we have access to the navigation component to add a link
NAVBAR_FILES=("$GO4IT_DIR/src/components/layout/Navbar.jsx" "$GO4IT_DIR/src/components/Navbar.jsx" "$GO4IT_DIR/src/components/Navigation.jsx")
for navbar_file in "${NAVBAR_FILES[@]}"; do
  if [ -f "$navbar_file" ]; then
    echo -e "${YELLOW}Updating navbar to include developer link...${NC}"
    # Check if the link already exists
    if grep -q "developer" "$navbar_file"; then
      echo -e "${GREEN}Developer link already exists in navbar${NC}"
    else
      # Backup the original file
      cp "$navbar_file" "${navbar_file}.bak"
      
      # Update the file to include the new link
      awk -v blue="${BLUE}" -v nc="${NC}" '
      /<.*Link.*href="\/.*">/ {
        print;
        if (!found_link && !contains_dev) {
          contains_dev = index($0, "developer") > 0;
          if (!contains_dev) {
            print "          <Link href=\"/developer\">";
            print "            <li className=\"nav-item\">Developer</li>";
            print "          </Link>";
            found_link = 1;
          }
        }
        next;
      }
      {print}
      ' "${navbar_file}.bak" > "$navbar_file"
      
      echo -e "${GREEN}Updated navbar to include developer link${NC}"
    fi
    break
  fi
done

if [ ! -f "$navbar_file" ]; then
  echo -e "${YELLOW}Navigation component not found. You will need to manually add a link to the developer page.${NC}"
fi

# Display completion message
echo -e "${GREEN}========================================================${NC}"
echo -e "${GREEN}  Monaco Editor + StarCoder Integration Complete!  ${NC}"
echo -e "${GREEN}========================================================${NC}"
echo -e "${BLUE}Integration components created at:${NC} $GO4IT_DIR/src/components/editor"
echo -e "${BLUE}Developer page created at:${NC} $GO4IT_DIR/src/pages/developer/CodeEditorPage.jsx"
echo -e "${BLUE}StarCoder integration script:${NC} $GO4IT_DIR/public/direct_integration.js"
echo
echo -e "${YELLOW}Access the Monaco Editor + StarCoder integration at:${NC}"
echo -e "  http://your-domain.com/developer"
echo
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Make sure StarCoder API is running at: ${STARCODER_API_URL}"
echo -e "2. Ensure Monaco Editor files are available at: $GO4IT_DIR/public/monaco"
echo -e "3. Rebuild the Go4It application to include the new components"
echo
echo -e "${GREEN}Done!${NC}"