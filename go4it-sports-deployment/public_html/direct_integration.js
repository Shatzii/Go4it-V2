/**
 * Go4It Sports Star Coder Integration
 * 
 * This script integrates your existing Star Coder instance with Monaco Editor
 * and adds visual diagnostics, error handling, and code correction features.
 */

// Configuration
const STAR_CODER_API_URL = "http://localhost:11434/v1"; // Change this if your API is at a different URL

// Star Coder API endpoints
const API_ENDPOINTS = {
  COMPLETIONS: `${STAR_CODER_API_URL}/chat/completions`,
  MODELS: `${STAR_CODER_API_URL}/models`
};

// Keyboard shortcuts config
const SHORTCUTS = {
  ANALYZE: "ctrl+shift+a",
  FIX: "ctrl+shift+f",
  QUERY: "ctrl+shift+q"
};

/**
 * Analyzes code with Star Coder
 */
async function analyzeWithStarCoder(code, language) {
  try {
    const prompt = `
You are an expert code analyzer. Please analyze the following ${language} code and provide:
1. A brief summary of what the code does
2. Any potential bugs or issues
3. Performance optimizations
4. Security concerns (if any)
5. Suggestions for improvements

Format your response as JSON with these fields: 
{
  "summary": "Brief description",
  "bugs": ["Issue 1", "Issue 2"],
  "optimizations": ["Optimization 1", "Optimization 2"],
  "security": ["Concern 1", "Concern 2"],
  "improvements": ["Suggestion 1", "Suggestion 2"]
}

Here's the code:
\`\`\`${language}
${code}
\`\`\`
`;

    const response = await fetch(API_ENDPOINTS.COMPLETIONS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3",
        messages: [
          { role: "system", content: "You are a helpful programming assistant that provides code analysis in JSON format." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    try {
      const content = data.choices[0].message.content;
      return JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse Star Coder response:", e);
      return {
        summary: "Failed to analyze code",
        bugs: ["Error parsing Star Coder response"],
        optimizations: [],
        security: [],
        improvements: []
      };
    }
  } catch (error) {
    console.error("Star Coder analysis error:", error);
    return {
      summary: "Error connecting to Star Coder",
      bugs: ["Connection to Star Coder failed"],
      optimizations: [],
      security: [],
      improvements: []
    };
  }
}

/**
 * Get completions from Star Coder
 */
async function getCompletionsFromStarCoder(code, position, language) {
  try {
    // Get the current line up to the cursor
    const lines = code.split('\n');
    let lineIndex = 0;
    let charIndex = 0;
    let totalChars = 0;

    for (let i = 0; i < lines.length; i++) {
      if (totalChars + lines[i].length + 1 > position) {
        lineIndex = i;
        charIndex = position - totalChars;
        break;
      }
      totalChars += lines[i].length + 1; // +1 for newline
    }

    const currentLine = lines[lineIndex].substring(0, charIndex);
    
    // Get a few lines before for context (up to 10)
    const startLine = Math.max(0, lineIndex - 10);
    const context = lines.slice(startLine, lineIndex + 1).join('\n');

    const prompt = `
I'm writing ${language} code and need completion suggestions. Here's my current code context:

\`\`\`${language}
${context}
\`\`\`

I'm currently at this position (cursor is at the end of this line):
\`\`\`
${currentLine}█
\`\`\`

Please suggest 3-5 possible completions for what might come next in the code.
Format your response as a JSON array of string completions like this:
["completion1", "completion2", "completion3"]
Completions should be code snippets that would logically follow what I've written.
`;

    const response = await fetch(API_ENDPOINTS.COMPLETIONS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3",
        messages: [
          { role: "system", content: "You are a helpful programming assistant that offers code completions." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    try {
      const content = data.choices[0].message.content;
      const completions = JSON.parse(content);
      return Array.isArray(completions) ? completions : [];
    } catch (e) {
      console.error("Failed to parse Star Coder completions:", e);
      return [];
    }
  } catch (error) {
    console.error("Star Coder completions error:", error);
    return [];
  }
}

/**
 * Fix code with Star Coder
 */
async function fixCodeWithStarCoder(code, errors, language) {
  try {
    const errorList = errors.map(err => `Line ${err.lineNumber}: ${err.message}`).join('\n');

    const prompt = `
I have ${language} code with the following issues:
${errorList}

Here's the original code:
\`\`\`${language}
${code}
\`\`\`

Please fix the issues and provide the corrected code. Return ONLY the fixed code, with no explanations or markdown formatting.
`;

    const response = await fetch(API_ENDPOINTS.COMPLETIONS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3",
        messages: [
          { role: "system", content: "You are a helpful programming assistant that fixes code issues." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extract code from markdown code blocks if present
    const codeBlockMatch = content.match(/```(?:\w+)?\s*([\s\S]+?)```/);
    return codeBlockMatch ? codeBlockMatch[1].trim() : content.trim();
  } catch (error) {
    console.error("Star Coder fix error:", error);
    return null;
  }
}

/**
 * Ask Star Coder a question about code
 */
async function getAIAssistance(prompt, context) {
  try {
    const fullPrompt = context ? 
      `Code context:\n\`\`\`\n${context}\n\`\`\`\n\nQuestion: ${prompt}` : 
      prompt;

    const response = await fetch(API_ENDPOINTS.COMPLETIONS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3",
        messages: [
          { 
            role: "system", 
            content: "You are a helpful programming assistant. Provide clear, concise responses to questions about code."
          },
          { role: "user", content: fullPrompt }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Star Coder assistance error:", error);
    return "Error connecting to Star Coder. Please try again.";
  }
}

/**
 * Integrate Star Coder with Monaco Editor
 */
function integrateStarCoderWithMonaco(monaco, editor) {
  // Create diagnostic collection for editor
  const diagnosticCollection = monaco.editor.createModelMarkerData;
  let starCoderStatusElement;
  let starCoderOutputElement;
  
  // Initialize UI elements
  function initUI() {
    // Create status bar element if it doesn't exist
    if (!starCoderStatusElement) {
      starCoderStatusElement = document.createElement('div');
      starCoderStatusElement.id = 'star-coder-status';
      starCoderStatusElement.className = 'monaco-status-bar-item';
      starCoderStatusElement.style.cssText = 'position: absolute; bottom: 0; right: 5px; padding: 2px 5px; font-size: 12px; background: #007acc; color: white; border-radius: 3px;';
      starCoderStatusElement.textContent = 'Star Coder: Ready';
      document.querySelector('.monaco-editor').appendChild(starCoderStatusElement);
    }
    
    // Create output panel if it doesn't exist
    if (!starCoderOutputElement) {
      starCoderOutputElement = document.createElement('div');
      starCoderOutputElement.id = 'star-coder-output';
      starCoderOutputElement.className = 'monaco-editor-panel';
      starCoderOutputElement.style.cssText = 'position: absolute; bottom: 20px; left: 0; right: 0; height: 200px; background: #1e1e1e; color: #d4d4d4; overflow: auto; display: none; z-index: 10; border-top: 1px solid #454545; padding: 10px; font-family: monospace;';
      
      // Add close button
      const closeButton = document.createElement('button');
      closeButton.textContent = '×';
      closeButton.style.cssText = 'position: absolute; top: 5px; right: 5px; background: none; border: none; color: #d4d4d4; font-size: 16px; cursor: pointer;';
      closeButton.onclick = () => { starCoderOutputElement.style.display = 'none'; };
      
      starCoderOutputElement.appendChild(closeButton);
      document.querySelector('.monaco-editor').appendChild(starCoderOutputElement);
    }
  }
  
  // Show output panel with content
  function showOutput(content, title = 'Star Coder Analysis') {
    initUI();
    
    starCoderOutputElement.innerHTML = '';
    
    // Create header
    const header = document.createElement('div');
    header.style.cssText = 'font-weight: bold; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #454545;';
    header.textContent = title;
    starCoderOutputElement.appendChild(header);
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = 'position: absolute; top: 5px; right: 5px; background: none; border: none; color: #d4d4d4; font-size: 16px; cursor: pointer;';
    closeButton.onclick = () => { starCoderOutputElement.style.display = 'none'; };
    starCoderOutputElement.appendChild(closeButton);
    
    // Create content
    const contentElement = document.createElement('div');
    contentElement.innerHTML = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    starCoderOutputElement.appendChild(contentElement);
    
    // Show panel
    starCoderOutputElement.style.display = 'block';
  }
  
  // Display analysis results
  function showAnalysisResults(analysis) {
    const html = `
      <div style="padding: 10px;">
        <h3 style="margin-top: 0;">Code Analysis</h3>
        <div>
          <h4>Summary</h4>
          <p>${analysis.summary}</p>
        </div>
        ${analysis.bugs.length ? `
          <div>
            <h4>Potential Issues</h4>
            <ul>
              ${analysis.bugs.map(bug => `<li>${bug}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${analysis.optimizations.length ? `
          <div>
            <h4>Optimization Opportunities</h4>
            <ul>
              ${analysis.optimizations.map(opt => `<li>${opt}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${analysis.security.length ? `
          <div>
            <h4>Security Considerations</h4>
            <ul>
              ${analysis.security.map(sec => `<li>${sec}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${analysis.improvements.length ? `
          <div>
            <h4>Suggested Improvements</h4>
            <ul>
              ${analysis.improvements.map(imp => `<li>${imp}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
    
    showOutput(html, 'Code Analysis Results');
  }
  
  // Apply diagnostics to editor
  function applyDiagnostics(issues) {
    // Clear previous diagnostics
    monaco.editor.setModelMarkers(editor.getModel(), 'star-coder', []);
    
    if (!issues || !issues.length) return;
    
    // Convert issues to Monaco markers
    const markers = issues.map(issue => ({
      severity: monaco.MarkerSeverity.Warning,
      startLineNumber: issue.lineNumber,
      startColumn: 1,
      endLineNumber: issue.lineNumber,
      endColumn: issue.column || 1000,
      message: issue.message
    }));
    
    // Set markers
    monaco.editor.setModelMarkers(editor.getModel(), 'star-coder', markers);
  }
  
  // Format AI response as HTML
  function formatAIResponse(text) {
    // Convert markdown-like syntax to HTML
    let html = text
      .replace(/```(\w*)\n([\s\S]+?)```/g, '<pre class="code-block"><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n- /g, '<br/>• ');
      
    return html;
  }
  
  // Register keyboard shortcuts
  
  // Analyze code
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyA, async () => {
    const code = editor.getValue();
    const model = editor.getModel();
    const uri = model.uri.toString();
    const language = model.getLanguageId();
    
    starCoderStatusElement.textContent = 'Star Coder: Analyzing...';
    
    const analysis = await analyzeWithStarCoder(code, language);
    showAnalysisResults(analysis);
    
    // Extract potential issues for diagnostics
    if (analysis.bugs && analysis.bugs.length) {
      // Simple extraction of line numbers from issue descriptions
      const issues = analysis.bugs.map(bug => {
        const lineMatch = bug.match(/line (\d+)/i);
        return {
          lineNumber: lineMatch ? parseInt(lineMatch[1]) : 1,
          message: bug
        };
      });
      
      applyDiagnostics(issues);
    }
    
    starCoderStatusElement.textContent = 'Star Coder: Ready';
  });
  
  // Fix code issues
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, async () => {
    const code = editor.getValue();
    const model = editor.getModel();
    const uri = model.uri.toString();
    const language = model.getLanguageId();
    
    // Get current markers/errors
    const markers = monaco.editor.getModelMarkers({
      resource: model.uri
    });
    
    if (!markers || markers.length === 0) {
      showOutput("No issues detected in the code. Nothing to fix.", "Star Coder Fix");
      return;
    }
    
    starCoderStatusElement.textContent = 'Star Coder: Fixing...';
    
    const fixedCode = await fixCodeWithStarCoder(code, markers, language);
    
    if (fixedCode) {
      // Create diff to show changes
      const originalLines = code.split('\n');
      const fixedLines = fixedCode.split('\n');
      
      const diffHtml = `
        <div>
          <h3>Proposed Fixes</h3>
          <p>Star Coder suggests the following changes:</p>
          <div style="display: flex;">
            <div style="flex: 1; margin-right: 10px;">
              <h4>Original Code</h4>
              <pre style="max-height: 300px; overflow: auto;">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
            </div>
            <div style="flex: 1;">
              <h4>Fixed Code</h4>
              <pre style="max-height: 300px; overflow: auto;">${fixedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
            </div>
          </div>
          <button id="apply-fixes" style="margin-top: 10px; padding: 5px 10px; background: #0e639c; color: white; border: none; border-radius: 2px; cursor: pointer;">Apply Fixes</button>
        </div>
      `;
      
      showOutput(diffHtml, "Code Fix Suggestions");
      
      // Handle apply fixes button click
      setTimeout(() => {
        const applyBtn = document.getElementById('apply-fixes');
        if (applyBtn) {
          applyBtn.onclick = () => {
            editor.setValue(fixedCode);
            starCoderOutputElement.style.display = 'none';
          };
        }
      }, 100);
    } else {
      showOutput("Unable to fix the issues. Please try manually correcting the code.", "Star Coder Fix");
    }
    
    starCoderStatusElement.textContent = 'Star Coder: Ready';
  });
  
  // Ask AI a question about the code
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyQ, async () => {
    // Create a simple dialog to get the question
    const dialogHtml = `
      <div style="padding: 10px;">
        <h3 style="margin-top: 0;">Ask About Your Code</h3>
        <p>What would you like to know about this code?</p>
        <input id="ai-question-input" type="text" style="width: 100%; padding: 5px; margin-bottom: 10px;" placeholder="e.g., How can I improve error handling?">
        <div style="display: flex; justify-content: flex-end;">
          <button id="ai-question-cancel" style="margin-right: 10px; padding: 5px 10px; background: #3c3c3c; color: white; border: none; border-radius: 2px; cursor: pointer;">Cancel</button>
          <button id="ai-question-ask" style="padding: 5px 10px; background: #0e639c; color: white; border: none; border-radius: 2px; cursor: pointer;">Ask</button>
        </div>
      </div>
    `;
    
    showOutput(dialogHtml, "Ask Star Coder");
    
    // Handle dialog buttons
    setTimeout(() => {
      const input = document.getElementById('ai-question-input');
      const askBtn = document.getElementById('ai-question-ask');
      const cancelBtn = document.getElementById('ai-question-cancel');
      
      if (input) input.focus();
      
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          starCoderOutputElement.style.display = 'none';
        };
      }
      
      if (askBtn && input) {
        // Handle Enter key in input
        input.onkeydown = (e) => {
          if (e.key === 'Enter') {
            askBtn.click();
          }
        };
        
        askBtn.onclick = async () => {
          const question = input.value.trim();
          if (!question) return;
          
          starCoderStatusElement.textContent = 'Star Coder: Thinking...';
          
          const code = editor.getValue();
          const response = await getAIAssistance(question, code);
          
          const responseHtml = `
            <div style="padding: 10px;">
              <h3 style="margin-top: 0;">Response</h3>
              <div style="background: #252525; padding: 10px; border-radius: 3px;">
                <p><strong>Q: ${question}</strong></p>
                <div>${formatAIResponse(response)}</div>
              </div>
              <button id="ask-another" style="margin-top: 10px; padding: 5px 10px; background: #0e639c; color: white; border: none; border-radius: 2px; cursor: pointer;">Ask Another Question</button>
            </div>
          `;
          
          showOutput(responseHtml, "Star Coder Answer");
          
          setTimeout(() => {
            const askAnotherBtn = document.getElementById('ask-another');
            if (askAnotherBtn) {
              askAnotherBtn.onclick = () => {
                editor.trigger('keyboard', 'star-coder-question', null);
              };
            }
          }, 100);
          
          starCoderStatusElement.textContent = 'Star Coder: Ready';
        };
      }
    }, 100);
  });
  
  // Initialize UI
  initUI();
  
  // Register completions provider
  monaco.languages.registerCompletionItemProvider('*', {
    triggerCharacters: ['.', '(', ',', ' '],
    provideCompletionItems: async (model, position) => {
      // Only provide completions for typing pauses
      if (!editor.getModel()) return { suggestions: [] };
      
      const code = model.getValue();
      const offset = model.getOffsetAt(position);
      
      // Get completions from Star Coder
      const suggestions = await getCompletionsFromStarCoder(
        code,
        offset,
        model.getLanguageId()
      );
      
      // Convert to Monaco completion items
      return {
        suggestions: suggestions.map((suggestion, index) => ({
          label: suggestion,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: suggestion,
          sortText: String.fromCharCode(index + 65), // A, B, C, ...
          detail: 'Star Coder'
        }))
      };
    }
  });
  
  console.log('Star Coder integration loaded');
}