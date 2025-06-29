/**
 * Go4It Sports Star Coder Integration
 * 
 * This script integrates your existing Star Coder instance with Monaco Editor
 * and adds visual diagnostics, error handling, and code correction features.
 */

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const { existsSync } = require('fs');
const bodyParser = require('body-parser');

// Configuration
const config = {
  // Your Star Coder API endpoint (adjust based on your setup)
  starCoderApiUrl: 'http://localhost:11434/v1',
  // Monaco Editor service port
  editorPort: 8090,
  // Projects root directory
  projectsRoot: '/var/www/go4itsports',
  // Visual diagnostics port
  diagnosticsPort: 8091,
  // Domain for the editor
  editorDomain: 'editor.go4itsports.org',
};

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes

/**
 * Fetch file content
 */
app.get('/api/file', async (req, res) => {
  try {
    const filePath = req.query.path;
    
    if (!filePath) {
      return res.status(400).json({ 
        success: false, 
        error: 'File path is required' 
      });
    }
    
    if (!isPathSafe(filePath)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied to this file location' 
      });
    }
    
    if (!existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        error: 'File not found' 
      });
    }
    
    const content = await fs.readFile(filePath, 'utf8');
    res.json({ 
      success: true, 
      content 
    });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ 
      success: false, 
      error: `Error reading file: ${error.message}` 
    });
  }
});

/**
 * Save file content
 */
app.post('/api/file', async (req, res) => {
  try {
    const { path: filePath, content } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ 
        success: false, 
        error: 'File path is required' 
      });
    }
    
    if (!isPathSafe(filePath)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied to this file location' 
      });
    }
    
    await fs.writeFile(filePath, content, 'utf8');
    
    // After saving, run diagnostics
    const diagnostics = await runDiagnostics(filePath, content);
    
    res.json({ 
      success: true,
      diagnostics
    });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ 
      success: false, 
      error: `Error saving file: ${error.message}` 
    });
  }
});

/**
 * List files in directory
 */
app.get('/api/files', async (req, res) => {
  try {
    const dirPath = req.query.path || config.projectsRoot;
    
    if (!isPathSafe(dirPath)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied to this directory' 
      });
    }
    
    if (!existsSync(dirPath)) {
      return res.status(404).json({ 
        success: false, 
        error: 'Directory not found' 
      });
    }
    
    const files = await getDirectoryContents(dirPath);
    res.json({ 
      success: true, 
      files 
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ 
      success: false, 
      error: `Error listing files: ${error.message}` 
    });
  }
});

/**
 * Run code analysis on a file
 */
app.post('/api/analyze', async (req, res) => {
  try {
    const { path: filePath, content } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ 
        success: false, 
        error: 'File path is required' 
      });
    }
    
    const fileExt = path.extname(filePath).toLowerCase();
    const language = getLanguageFromExtension(fileExt);
    
    // Run analysis with Star Coder
    const analysis = await analyzeCodeWithStarCoder(content, language);
    
    res.json({ 
      success: true, 
      analysis 
    });
  } catch (error) {
    console.error('Error analyzing code:', error);
    res.status(500).json({ 
      success: false, 
      error: `Error analyzing code: ${error.message}` 
    });
  }
});

/**
 * Get code completion suggestions
 */
app.post('/api/complete', async (req, res) => {
  try {
    const { content, position, path: filePath } = req.body;
    
    if (!content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Content is required' 
      });
    }
    
    const fileExt = path.extname(filePath).toLowerCase();
    const language = getLanguageFromExtension(fileExt);
    
    // Get completions from Star Coder
    const completions = await getCompletionsFromStarCoder(content, position, language);
    
    res.json({ 
      success: true, 
      completions 
    });
  } catch (error) {
    console.error('Error getting completions:', error);
    res.status(500).json({ 
      success: false, 
      error: `Error getting completions: ${error.message}` 
    });
  }
});

/**
 * Fix code with AI
 */
app.post('/api/fix', async (req, res) => {
  try {
    const { content, errors, path: filePath } = req.body;
    
    if (!content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Content is required' 
      });
    }
    
    const fileExt = path.extname(filePath).toLowerCase();
    const language = getLanguageFromExtension(fileExt);
    
    // Fix code with Star Coder
    const fixedCode = await fixCodeWithStarCoder(content, errors, language);
    
    res.json({ 
      success: true, 
      fixed: fixedCode 
    });
  } catch (error) {
    console.error('Error fixing code:', error);
    res.status(500).json({ 
      success: false, 
      error: `Error fixing code: ${error.message}` 
    });
  }
});

/**
 * Run server diagnostics
 */
app.post('/api/diagnostics', async (req, res) => {
  try {
    const { path: folderPath } = req.body;
    
    if (!folderPath) {
      return res.status(400).json({ 
        success: false, 
        error: 'Folder path is required' 
      });
    }
    
    if (!isPathSafe(folderPath)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied to this directory' 
      });
    }
    
    // Run diagnostics on the entire folder
    const diagnosticsResults = await runBulkDiagnostics(folderPath);
    
    res.json({ 
      success: true, 
      diagnostics: diagnosticsResults 
    });
  } catch (error) {
    console.error('Error running diagnostics:', error);
    res.status(500).json({ 
      success: false, 
      error: `Error running diagnostics: ${error.message}` 
    });
  }
});

// Helper Functions

/**
 * Check if path is safe to access
 */
function isPathSafe(filePath) {
  const normalizedPath = path.normalize(filePath);
  const projectRoot = path.normalize(config.projectsRoot);
  
  return normalizedPath.startsWith(projectRoot);
}

/**
 * Get directory contents recursively
 */
async function getDirectoryContents(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    const contents = await Promise.all(entries.map(async entry => {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        return {
          name: entry.name,
          path: fullPath,
          type: 'directory',
          children: await getDirectoryContents(fullPath)
        };
      } else {
        return {
          name: entry.name,
          path: fullPath,
          type: 'file',
          extension: path.extname(entry.name).toLowerCase().substring(1)
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

/**
 * Get language from file extension
 */
function getLanguageFromExtension(extension) {
  const ext = extension.startsWith('.') ? extension.substring(1) : extension;
  
  const languageMap = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'md': 'markdown',
    'py': 'python',
    'php': 'php',
    'rb': 'ruby',
    'sh': 'shell',
    'sql': 'sql',
    'yml': 'yaml',
    'yaml': 'yaml',
    'go': 'go',
    'java': 'java',
    'cs': 'csharp',
    'c': 'c',
    'cpp': 'cpp',
    'h': 'cpp',
    'rs': 'rust'
  };
  
  return languageMap[ext] || 'plaintext';
}

/**
 * Analyze code with Star Coder
 */
async function analyzeCodeWithStarCoder(code, language) {
  try {
    const prompt = `Analyze the following ${language} code and provide feedback on:
1. Potential bugs or issues
2. Performance improvements
3. Code structure and organization
4. Best practices

CODE:
\`\`\`${language}
${code}
\`\`\`

FORMAT RESPONSE AS JSON WITH THE FOLLOWING PROPERTIES:
- issues: array of objects with line, message, severity (error, warning, info)
- suggestions: array of objects with description, lineStart, lineEnd, replacement (optional)
- summary: overall code quality assessment`;

    const response = await axios.post(`${config.starCoderApiUrl}/chat/completions`, {
      model: 'codellama:13b',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert code analyzer focusing on detecting issues and suggesting improvements. Provide detailed, actionable feedback in JSON format.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    try {
      // Parse the response as JSON
      const jsonResponse = JSON.parse(response.data.choices[0].message.content);
      return jsonResponse;
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      
      // If JSON parsing fails, return a structured error
      return {
        issues: [],
        suggestions: [],
        summary: "Error parsing analysis results",
        error: true
      };
    }
  } catch (error) {
    console.error('Error analyzing code with Star Coder:', error);
    throw new Error(`Star Coder analysis failed: ${error.message}`);
  }
}

/**
 * Get code completions from Star Coder
 */
async function getCompletionsFromStarCoder(code, position, language) {
  try {
    // Extract the code context before the cursor position
    const codeBeforeCursor = code.substring(0, position);
    
    const prompt = `Complete the following ${language} code. Only return the completion, nothing else.

CODE CONTEXT:
\`\`\`${language}
${codeBeforeCursor}
\`\`\`

COMPLETION:`;

    const response = await axios.post(`${config.starCoderApiUrl}/completions`, {
      model: 'codellama:13b',
      prompt,
      max_tokens: 250,
      temperature: 0.1,
      stop: ["\n\n", "```"]
    });

    return {
      completions: [response.data.choices[0].text]
    };
  } catch (error) {
    console.error('Error getting completions from Star Coder:', error);
    throw new Error(`Star Coder completions failed: ${error.message}`);
  }
}

/**
 * Fix code with Star Coder
 */
async function fixCodeWithStarCoder(code, errors, language) {
  try {
    const errorText = errors.map(e => `Line ${e.line}: ${e.message}`).join('\n');
    
    const prompt = `Fix the following ${language} code that has these errors:
${errorText}

CODE:
\`\`\`${language}
${code}
\`\`\`

Please provide the complete fixed code. Only return the fixed code, no explanations.`;

    const response = await axios.post(`${config.starCoderApiUrl}/chat/completions`, {
      model: 'codellama:13b',
      messages: [
        { 
          role: 'system', 
          content: 'You are a code fixing assistant. Fix code errors precisely without changing functionality. Only return the complete fixed code with no explanations.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2
    });

    // Extract code from the response
    const content = response.data.choices[0].message.content;
    const codeRegex = /```(?:\w+)?\s*\n([\s\S]*?)```/;
    const match = content.match(codeRegex);
    
    if (match && match[1]) {
      return match[1].trim();
    } else {
      return content.trim();
    }
  } catch (error) {
    console.error('Error fixing code with Star Coder:', error);
    throw new Error(`Star Coder fix failed: ${error.message}`);
  }
}

/**
 * Run diagnostics on a file
 */
async function runDiagnostics(filePath, content) {
  const fileExt = path.extname(filePath).toLowerCase();
  const language = getLanguageFromExtension(fileExt);
  
  try {
    // For JavaScript/TypeScript files, use ESLint-like diagnostics
    if (language === 'javascript' || language === 'typescript') {
      return await analyzeJSCode(content, language);
    }
    
    // For Python files
    if (language === 'python') {
      return await analyzePythonCode(content);
    }
    
    // For other files, use generic analysis
    return await analyzeCodeWithStarCoder(content, language);
  } catch (error) {
    console.error(`Error running diagnostics on ${filePath}:`, error);
    return {
      issues: [],
      suggestions: [],
      summary: `Error running diagnostics: ${error.message}`
    };
  }
}

/**
 * Analyze JavaScript/TypeScript code
 */
async function analyzeJSCode(content, language) {
  // This is a simplified version. In production, you'd use ESLint/TypeScript
  const errorPatterns = [
    { regex: /console\.log/g, message: 'Avoid console.log in production code', severity: 'warning' },
    { regex: /var /g, message: 'Use const or let instead of var', severity: 'warning' },
    { regex: /==/g, message: 'Use === for comparison', severity: 'warning' },
    { regex: /!=/g, message: 'Use !== for comparison', severity: 'warning' },
    { regex: /catch\s*\(\s*[^)]*\s*\)\s*{/g, message: 'Empty catch block', severity: 'warning' },
    { regex: /\/\/ TODO/g, message: 'TODO comment found', severity: 'info' },
  ];
  
  const lines = content.split('\n');
  const issues = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    for (const pattern of errorPatterns) {
      if (pattern.regex.test(line)) {
        issues.push({
          line: i + 1,
          message: pattern.message,
          severity: pattern.severity
        });
        
        // Reset regex lastIndex
        pattern.regex.lastIndex = 0;
      }
    }
  }
  
  // Get more advanced analysis from Star Coder
  const starCoderAnalysis = await analyzeCodeWithStarCoder(content, language);
  
  return {
    issues: [...issues, ...(starCoderAnalysis.issues || [])],
    suggestions: starCoderAnalysis.suggestions || [],
    summary: starCoderAnalysis.summary || 'Basic analysis completed'
  };
}

/**
 * Analyze Python code
 */
async function analyzePythonCode(content) {
  // This is a simplified version. In production, you'd use pylint or similar
  const errorPatterns = [
    { regex: /print\(/g, message: 'Avoid print() in production code', severity: 'warning' },
    { regex: /except:/g, message: 'Specify exception type', severity: 'warning' },
    { regex: /# TODO/g, message: 'TODO comment found', severity: 'info' },
  ];
  
  const lines = content.split('\n');
  const issues = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    for (const pattern of errorPatterns) {
      if (pattern.regex.test(line)) {
        issues.push({
          line: i + 1,
          message: pattern.message,
          severity: pattern.severity
        });
        
        // Reset regex lastIndex
        pattern.regex.lastIndex = 0;
      }
    }
  }
  
  // Get more advanced analysis from Star Coder
  const starCoderAnalysis = await analyzeCodeWithStarCoder(content, 'python');
  
  return {
    issues: [...issues, ...(starCoderAnalysis.issues || [])],
    suggestions: starCoderAnalysis.suggestions || [],
    summary: starCoderAnalysis.summary || 'Basic analysis completed'
  };
}

/**
 * Run diagnostics on multiple files
 */
async function runBulkDiagnostics(folderPath) {
  try {
    const allFiles = await getAllFiles(folderPath);
    const results = [];
    
    for (const file of allFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const diagnostics = await runDiagnostics(file, content);
        
        if (diagnostics.issues && diagnostics.issues.length > 0) {
          results.push({
            path: file,
            issues: diagnostics.issues,
            summary: diagnostics.summary
          });
        }
      } catch (fileError) {
        console.error(`Error processing file ${file}:`, fileError);
      }
    }
    
    return results;
  } catch (error) {
    console.error(`Error running bulk diagnostics on ${folderPath}:`, error);
    throw error;
  }
}

/**
 * Get all files recursively from a directory
 */
async function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = await fs.readdir(dirPath);
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = await fs.stat(fullPath);
    
    if (stat.isDirectory()) {
      await getAllFiles(fullPath, arrayOfFiles);
    } else {
      // Only include text files
      const ext = path.extname(fullPath).toLowerCase();
      const textExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.html', '.css', '.json', '.md', '.sql', '.yml', '.yaml'];
      
      if (textExtensions.includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  }
  
  return arrayOfFiles;
}

// Start the server
app.listen(config.editorPort, () => {
  console.log(`⚡️ Star Coder Integration running on port ${config.editorPort}`);
});