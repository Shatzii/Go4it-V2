#!/bin/bash

# Go4It Sports Code Editor with AI Assistance Setup
# This script sets up a web-based Monaco editor with AI assistance

# Set color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration variables - EDIT THESE
DOMAIN="edit.go4itsports.org"
EDITOR_PORT=8080
EMAIL="a.barrett@go4itsports.org"
OPENAI_API_KEY="your_openai_api_key" # Will be used for StarCoder integration

echo -e "${GREEN}=== Go4It Sports Code Editor Setup Script ===${NC}"
echo -e "${YELLOW}This script will install a web-based Monaco editor with AI assistance.${NC}"
echo

# Step 1: Install dependencies
echo -e "${GREEN}Step 1: Installing dependencies...${NC}"
apt update
apt install -y nodejs npm git nginx certbot python3-certbot-nginx

# Step 2: Create editor directory
echo -e "\n${GREEN}Step 2: Creating editor directory...${NC}"
mkdir -p /var/www/code-editor
cd /var/www/code-editor

# Step 3: Initialize npm project
echo -e "\n${GREEN}Step 3: Initializing project...${NC}"
npm init -y

# Step 4: Install editor dependencies
echo -e "\n${GREEN}Step 4: Installing editor packages...${NC}"
npm install express @monaco-editor/react monaco-editor react react-dom react-scripts axios body-parser cors openai @anthropic-ai/sdk

# Step 5: Create editor structure
echo -e "\n${GREEN}Step 5: Creating editor structure...${NC}"
mkdir -p public src src/components src/services

# Step 6: Create basic HTML template
echo -e "\n${GREEN}Step 6: Creating HTML template...${NC}"
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Go4It Code Editor</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body, html, #root {
      height: 100%;
      margin: 0;
      overflow: hidden;
    }
    .editor-container {
      height: calc(100vh - 56px);
      display: flex;
    }
    .file-explorer {
      width: 250px;
      height: 100%;
      overflow: auto;
      padding: 10px;
      border-right: 1px solid #e0e0e0;
    }
    .editor-wrapper {
      flex: 1;
      height: 100%;
      overflow: hidden;
    }
    .monaco-editor {
      height: 100%;
    }
    .ai-panel {
      height: 30%;
      overflow: auto;
      border-top: 1px solid #e0e0e0;
      padding: 10px;
      background-color: #f8f9fa;
    }
    .ai-prompt {
      width: 100%;
      padding: 5px;
      margin-bottom: 10px;
    }
    .ai-response {
      padding: 10px;
      background-color: #ffffff;
      border-radius: 5px;
      margin-bottom: 10px;
      white-space: pre-wrap;
    }
    .navbar {
      background-color: #0e1628;
      color: white;
    }
    .file-item {
      padding: 5px;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .file-item:hover {
      background-color: #f0f0f0;
    }
    .folder {
      font-weight: bold;
    }
    .file-selected {
      background-color: #e2e6ea;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
EOF

# Step 7: Create main app component
echo -e "\n${GREEN}Step 7: Creating React components...${NC}"
cat > src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
EOF

cat > src/App.js << 'EOF'
import React, { useState, useEffect } from 'react';
import MonacoEditor from './components/MonacoEditor';
import FileExplorer from './components/FileExplorer';
import AIAssistant from './components/AIAssistant';
import { fetchFiles, readFile, saveFile } from './services/fileService';

function App() {
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [showAI, setShowAI] = useState(false);
  const [rootPath, setRootPath] = useState('/var/www/go4itsports');

  useEffect(() => {
    loadFiles();
  }, [rootPath]);

  const loadFiles = async () => {
    try {
      const fileList = await fetchFiles(rootPath);
      setFiles(fileList);
    } catch (error) {
      console.error('Error loading files:', error);
      alert('Error loading files: ' + error.message);
    }
  };

  const openFile = async (path) => {
    try {
      const content = await readFile(path);
      setCurrentFile(path);
      setEditorContent(content);
    } catch (error) {
      console.error('Error opening file:', error);
      alert('Error opening file: ' + error.message);
    }
  };

  const handleSave = async () => {
    if (!currentFile) return;
    
    try {
      await saveFile(currentFile, editorContent);
      alert('File saved successfully!');
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Error saving file: ' + error.message);
    }
  };

  const handleContentChange = (newContent) => {
    setEditorContent(newContent);
  };

  const toggleAI = () => {
    setShowAI(!showAI);
  };

  const changeRootPath = () => {
    const newPath = prompt('Enter new root path:', rootPath);
    if (newPath && newPath !== rootPath) {
      setRootPath(newPath);
      setCurrentFile(null);
      setEditorContent('');
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      <nav className="navbar navbar-dark">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Go4It Code Editor</span>
          <div className="d-flex">
            <button className="btn btn-sm btn-outline-light me-2" onClick={loadFiles}>
              Refresh
            </button>
            <button className="btn btn-sm btn-outline-light me-2" onClick={changeRootPath}>
              Change Path
            </button>
            <button className="btn btn-sm btn-outline-light me-2" onClick={handleSave} disabled={!currentFile}>
              Save
            </button>
            <button className="btn btn-sm btn-outline-light" onClick={toggleAI}>
              {showAI ? 'Hide AI' : 'Show AI'}
            </button>
          </div>
        </div>
      </nav>
      
      <div className="editor-container">
        <FileExplorer 
          files={files} 
          onFileSelect={openFile} 
          currentFile={currentFile}
        />
        
        <div className="editor-wrapper d-flex flex-column">
          <div style={{ flex: showAI ? '70%' : '100%' }}>
            <MonacoEditor 
              content={editorContent} 
              onChange={handleContentChange}
              path={currentFile}
            />
          </div>
          
          {showAI && (
            <AIAssistant 
              code={editorContent}
              filePath={currentFile}
              onSuggestionApply={setEditorContent}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
EOF

# Step 8: Create Monaco Editor component
echo -e "\n${GREEN}Step 8: Creating Monaco Editor component...${NC}"
cat > src/components/MonacoEditor.js << 'EOF'
import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

function MonacoEditor({ content, onChange, path }) {
  const editorRef = useRef(null);
  
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };
  
  useEffect(() => {
    if (editorRef.current) {
      // Prevent the editor from marking the component as changed if we're just updating the content from props
      const model = editorRef.current.getModel();
      if (model && model.getValue() !== content) {
        editorRef.current.setValue(content);
      }
    }
  }, [content]);

  const getLanguage = () => {
    if (!path) return 'javascript';
    
    const extension = path.split('.').pop().toLowerCase();
    switch (extension) {
      case 'js': return 'javascript';
      case 'jsx': return 'javascript';
      case 'ts': return 'typescript';
      case 'tsx': return 'typescript';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'md': return 'markdown';
      case 'php': return 'php';
      case 'py': return 'python';
      case 'rb': return 'ruby';
      case 'sh': return 'shell';
      case 'sql': return 'sql';
      case 'yml':
      case 'yaml': return 'yaml';
      default: return 'plaintext';
    }
  };

  return (
    <Editor
      height="100%"
      language={getLanguage()}
      value={content}
      theme="vs-dark"
      onChange={onChange}
      onMount={handleEditorDidMount}
      options={{
        scrollBeyondLastLine: false,
        minimap: { enabled: true },
        wordWrap: 'on',
        fontSize: 14
      }}
    />
  );
}

export default MonacoEditor;
EOF

# Step 9: Create File Explorer component
echo -e "\n${GREEN}Step 9: Creating File Explorer component...${NC}"
cat > src/components/FileExplorer.js << 'EOF'
import React, { useState } from 'react';

function FileExplorer({ files, onFileSelect, currentFile }) {
  const [expandedFolders, setExpandedFolders] = useState({});

  const toggleFolder = (path) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const renderFileTree = (items, basePath = '') => {
    return items.map(item => {
      const fullPath = basePath ? `${basePath}/${item.name}` : item.name;
      
      if (item.type === 'directory') {
        const isExpanded = expandedFolders[fullPath];
        return (
          <div key={fullPath}>
            <div 
              className="file-item folder" 
              onClick={() => toggleFolder(fullPath)}
            >
              {isExpanded ? '📂 ' : '📁 '}{item.name}
            </div>
            {isExpanded && item.children && (
              <div style={{ paddingLeft: '15px' }}>
                {renderFileTree(item.children, fullPath)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div 
            key={fullPath}
            className={`file-item ${currentFile === fullPath ? 'file-selected' : ''}`}
            onClick={() => onFileSelect(fullPath)}
          >
            📄 {item.name}
          </div>
        );
      }
    });
  };

  return (
    <div className="file-explorer">
      <h6>File Explorer</h6>
      <div className="mt-2">
        {renderFileTree(files)}
      </div>
    </div>
  );
}

export default FileExplorer;
EOF

# Step 10: Create AI Assistant component
echo -e "\n${GREEN}Step 10: Creating AI Assistant component...${NC}"
cat > src/components/AIAssistant.js << 'EOF'
import React, { useState } from 'react';
import { getAIResponse } from '../services/aiService';

function AIAssistant({ code, filePath, onSuggestionApply }) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const fileInfo = filePath ? `File: ${filePath}\n\n` : '';
      const codeContext = code ? `Current code:\n\`\`\`\n${code}\n\`\`\`\n\n` : '';
      const fullPrompt = `${fileInfo}${codeContext}${prompt}`;
      
      const aiResponse = await getAIResponse(fullPrompt);
      setResponse(aiResponse);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const extractCodeBlock = () => {
    const codeBlockRegex = /```(?:[\w]*\n)?([\s\S]*?)```/;
    const match = response.match(codeBlockRegex);
    
    if (match && match[1]) {
      return match[1].trim();
    }
    
    return null;
  };

  const handleApplySuggestion = () => {
    const codeBlock = extractCodeBlock();
    
    if (codeBlock && onSuggestionApply) {
      if (window.confirm('This will replace your current code with the AI suggestion. Continue?')) {
        onSuggestionApply(codeBlock);
      }
    } else {
      alert('No code suggestion found to apply.');
    }
  };

  return (
    <div className="ai-panel">
      <h6>AI Assistant</h6>
      <form onSubmit={handleSubmit} className="mb-2">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Ask for help or suggestions..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Send'}
          </button>
        </div>
      </form>
      
      {response && (
        <div className="ai-response">
          <pre style={{ whiteSpace: 'pre-wrap' }}>{response}</pre>
          {extractCodeBlock() && (
            <button 
              className="btn btn-sm btn-success mt-2"
              onClick={handleApplySuggestion}
            >
              Apply Suggestion
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AIAssistant;
EOF

# Step 11: Create file service
echo -e "\n${GREEN}Step 11: Creating file service...${NC}"
cat > src/services/fileService.js << 'EOF'
import axios from 'axios';

const API_URL = '/api';

export const fetchFiles = async (path) => {
  try {
    const response = await axios.get(`${API_URL}/files`, {
      params: { path }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw new Error(error.response?.data?.message || 'Could not fetch files');
  }
};

export const readFile = async (path) => {
  try {
    const response = await axios.get(`${API_URL}/file`, {
      params: { path }
    });
    return response.data.content;
  } catch (error) {
    console.error('Error reading file:', error);
    throw new Error(error.response?.data?.message || 'Could not read file');
  }
};

export const saveFile = async (path, content) => {
  try {
    await axios.post(`${API_URL}/file`, {
      path,
      content
    });
    return true;
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error(error.response?.data?.message || 'Could not save file');
  }
};
EOF

# Step 12: Create AI service
echo -e "\n${GREEN}Step 12: Creating AI service...${NC}"
cat > src/services/aiService.js << 'EOF'
import axios from 'axios';

const API_URL = '/api/ai';

export const getAIResponse = async (prompt) => {
  try {
    const response = await axios.post(`${API_URL}/generate`, { prompt });
    return response.data.response;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error(error.response?.data?.message || 'AI service unavailable');
  }
};
EOF

# Step 13: Create server file
echo -e "\n${GREEN}Step 13: Creating server file...${NC}"
cat > server.js << 'EOF'
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { existsSync } = require('fs');
const { OpenAI } = require('openai');
const { exec } = require('child_process');
const util = require('util');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper functions
const execPromise = util.promisify(exec);

async function getDirectoryContents(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    const contents = await Promise.all(entries.map(async entry => {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        return {
          name: entry.name,
          type: 'directory',
          children: await getDirectoryContents(fullPath)
        };
      } else {
        return {
          name: entry.name,
          type: 'file'
        };
      }
    }));
    
    return contents.sort((a, b) => {
      // Sort directories first, then files
      if (a.type === 'directory' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'directory') return 1;
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return [];
  }
}

// Verify file path is within allowed directories for security
function isPathSafe(filePath) {
  const normalizedPath = path.normalize(filePath);
  
  // Define safe directories here
  const safePaths = [
    '/var/www/go4itsports',
    '/var/www/code-editor'
  ];
  
  return safePaths.some(safePath => normalizedPath.startsWith(safePath));
}

// API Routes
app.get('/api/files', async (req, res) => {
  try {
    const dirPath = req.query.path || '/var/www/go4itsports';
    
    if (!isPathSafe(dirPath)) {
      return res.status(403).json({ message: 'Access denied to this directory' });
    }
    
    if (!existsSync(dirPath)) {
      return res.status(404).json({ message: 'Directory not found' });
    }
    
    const contents = await getDirectoryContents(dirPath);
    res.json(contents);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: 'Error fetching files' });
  }
});

app.get('/api/file', async (req, res) => {
  try {
    const filePath = req.query.path;
    
    if (!filePath) {
      return res.status(400).json({ message: 'File path is required' });
    }
    
    if (!isPathSafe(filePath)) {
      return res.status(403).json({ message: 'Access denied to this file' });
    }
    
    if (!existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    const content = await fs.readFile(filePath, 'utf8');
    res.json({ content });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ message: 'Error reading file' });
  }
});

app.post('/api/file', async (req, res) => {
  try {
    const { path: filePath, content } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ message: 'File path is required' });
    }
    
    if (!isPathSafe(filePath)) {
      return res.status(403).json({ message: 'Access denied to this file' });
    }
    
    await fs.writeFile(filePath, content, 'utf8');
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ message: 'Error saving file' });
  }
});

app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { 
          role: "system", 
          content: "You are a helpful coding assistant for Go4It Sports platform. Provide clear, concise responses with code examples when appropriate. When showing code, always wrap it in triple backticks with the appropriate language identifier." 
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 2000,
    });
    
    const response = completion.choices[0].message.content;
    res.json({ response });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ message: 'Error generating AI response' });
  }
});

// Catch-all handler for React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Code Editor server running on port ${PORT}`);
});
EOF

# Step 14: Create package.json
echo -e "\n${GREEN}Step 14: Updating package.json...${NC}"
cat > package.json << EOF
{
  "name": "go4it-code-editor",
  "version": "1.0.0",
  "description": "Web-based code editor for Go4It Sports",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "build": "react-scripts build",
    "dev": "react-scripts start"
  },
  "dependencies": {
    "@monaco-editor/react": "^4.4.6",
    "axios": "^0.27.2",
    "body-parser": "^1.20.0",
    "cors": "^2.8.5",
    "express": "^4.18.1",
    "monaco-editor": "^0.34.0",
    "openai": "^4.0.0",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-scripts": "5.0.1"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOF

# Step 15: Create build script
echo -e "\n${GREEN}Step 15: Creating build script...${NC}"
cat > build.sh << 'EOF'
#!/bin/bash
# Build React app
echo "Building React app..."
npm run build

# Set environment variable
echo "Setting OpenAI API key..."
export OPENAI_API_KEY="your_openai_api_key"

# Create systemd service
echo "Creating systemd service..."
cat > /etc/systemd/system/go4it-editor.service << EOSERVICE
[Unit]
Description=Go4It Code Editor
After=network.target

[Service]
Environment="OPENAI_API_KEY=${OPENAI_API_KEY}"
Environment="PORT=8080"
WorkingDirectory=/var/www/code-editor
ExecStart=/usr/bin/node server.js
Restart=always
User=root
Group=root

[Install]
WantedBy=multi-user.target
EOSERVICE

# Reload systemd
systemctl daemon-reload

# Start and enable service
systemctl start go4it-editor
systemctl enable go4it-editor

echo "Code editor service started!"
EOF
chmod +x build.sh

# Step 16: Configure Nginx
echo -e "\n${GREEN}Step 16: Configuring Nginx...${NC}"
cat > /etc/nginx/sites-available/code-editor << EOF
server {
    listen 80;
    server_name ${DOMAIN};

    location / {
        proxy_pass http://localhost:${EDITOR_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site 
ln -sf /etc/nginx/sites-available/code-editor /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Step 17: Set up SSL
echo -e "\n${GREEN}Step 17: Setting up SSL certificate...${NC}"
certbot --nginx -d ${DOMAIN} --non-interactive --agree-tos --email ${EMAIL} || {
    echo -e "${YELLOW}Warning: SSL setup failed. Your domain may not be pointing to this server yet.${NC}"
    echo -e "${YELLOW}You can run this command later: certbot --nginx -d ${DOMAIN}${NC}"
}

# Step 18: Build and start the editor
echo -e "\n${GREEN}Step 18: Building and starting the editor...${NC}"
export OPENAI_API_KEY=${OPENAI_API_KEY}
sed -i "s/your_openai_api_key/${OPENAI_API_KEY}/g" build.sh

npm run build
chmod +x build.sh
./build.sh

echo -e "\n${GREEN}=== Code Editor Setup Complete! ===${NC}"
echo -e "${YELLOW}Your Go4It Sports Code Editor is now available at:${NC}"
echo "https://${DOMAIN}"
echo
echo -e "${YELLOW}You can edit any file on your server using this web editor.${NC}"
echo -e "${YELLOW}The AI assistant is powered by OpenAI and can help you with coding tasks.${NC}"
echo
echo -e "${GREEN}To check the editor status:${NC} systemctl status go4it-editor"
echo -e "${GREEN}To view logs:${NC} journalctl -u go4it-editor"