/**
 * Direct Integration between Monaco Editor and Star Coder
 * 
 * This script connects your existing Monaco Editor with your Star Coder instance.
 * Simply add this to your current Monaco Editor setup.
 */

// Configuration - Change these to match your setup
const config = {
  starCoderApiUrl: 'http://localhost:11434/v1', // Your existing Star Coder endpoint
  projectRoot: '/var/www/go4itsports'           // Your project root directory
};

// Function to analyze code with Star Coder
async function analyzeWithStarCoder(code, language) {
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

    const response = await fetch(`${config.starCoderApiUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0].message.content) {
      try {
        return JSON.parse(data.choices[0].message.content);
      } catch (parseError) {
        console.error('Error parsing analysis response:', parseError);
        return {
          issues: [],
          suggestions: [],
          summary: "Error parsing analysis results"
        };
      }
    } else {
      throw new Error('Invalid response from Star Coder');
    }
  } catch (error) {
    console.error('Error analyzing code with Star Coder:', error);
    return {
      issues: [],
      suggestions: [],
      summary: `Error: ${error.message}`
    };
  }
}

// Function to get code completions from Star Coder
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

    const response = await fetch(`${config.starCoderApiUrl}/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'codellama:13b',
        prompt,
        max_tokens: 250,
        temperature: 0.1,
        stop: ["\n\n", "```"]
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0].text) {
      return {
        completions: [data.choices[0].text]
      };
    } else {
      throw new Error('Invalid completion response from Star Coder');
    }
  } catch (error) {
    console.error('Error getting completions from Star Coder:', error);
    return {
      completions: []
    };
  }
}

// Function to fix code with Star Coder
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

    const response = await fetch(`${config.starCoderApiUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'codellama:13b',
        messages: [
          { 
            role: 'system', 
            content: 'You are a code fixing assistant. Fix code errors precisely without changing functionality. Only return the complete fixed code with no explanations.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0].message.content) {
      const content = data.choices[0].message.content;
      const codeBlockRegex = /```(?:\w+)?\s*\n([\s\S]*?)```/;
      const match = content.match(codeBlockRegex);
      
      if (match && match[1]) {
        return match[1].trim();
      } else {
        return content.trim();
      }
    } else {
      throw new Error('Invalid fix response from Star Coder');
    }
  } catch (error) {
    console.error('Error fixing code with Star Coder:', error);
    return null;
  }
}

// Function to get AI assistance with a prompt
async function getAIAssistance(prompt, context) {
  try {
    let fullPrompt = prompt;
    
    if (context) {
      fullPrompt = `I'm working with this ${context.language} code:
\`\`\`${context.language}
${context.code}
\`\`\`

${prompt}`;
    }
    
    const response = await fetch(`${config.starCoderApiUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'codellama:13b',
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful coding assistant. Provide clear, concise responses with code examples when appropriate.' 
          },
          { role: 'user', content: fullPrompt }
        ],
        temperature: 0.7,
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0].message.content) {
      return data.choices[0].message.content;
    } else {
      throw new Error('Invalid assistance response from Star Coder');
    }
  } catch (error) {
    console.error('Error getting AI assistance:', error);
    return `Error: ${error.message}`;
  }
}

// Main integration function to add Star Coder to Monaco Editor
function integrateStarCoderWithMonaco(monaco, editor) {
  // Add command to analyze current code
  editor.addAction({
    id: 'analyze-with-starcoder',
    label: 'Analyze with Star Coder',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyA],
    contextMenuGroupId: 'navigation',
    run: async (editor) => {
      const code = editor.getValue();
      const model = editor.getModel();
      const language = model.getLanguageId();
      
      // Show loading indicator (you can customize this)
      const loadingDiv = document.createElement('div');
      loadingDiv.id = 'starcoder-loading';
      loadingDiv.style.position = 'absolute';
      loadingDiv.style.top = '10px';
      loadingDiv.style.right = '10px';
      loadingDiv.style.padding = '5px 10px';
      loadingDiv.style.background = '#1e1e1e';
      loadingDiv.style.color = 'white';
      loadingDiv.style.borderRadius = '3px';
      loadingDiv.style.zIndex = '1000';
      loadingDiv.textContent = 'Analyzing with Star Coder...';
      document.body.appendChild(loadingDiv);
      
      // Run analysis
      const analysis = await analyzeWithStarCoder(code, language);
      
      // Remove loading indicator
      document.getElementById('starcoder-loading').remove();
      
      // Apply diagnostics
      applyDiagnostics(monaco, editor, analysis.issues);
      
      // Show results in a modal or panel (you'll need to implement this)
      showAnalysisResults(analysis);
    }
  });
  
  // Add command to fix current code
  editor.addAction({
    id: 'fix-with-starcoder',
    label: 'Fix with Star Coder',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
    contextMenuGroupId: 'navigation',
    run: async (editor) => {
      const code = editor.getValue();
      const model = editor.getModel();
      const language = model.getLanguageId();
      
      // Show loading indicator
      const loadingDiv = document.createElement('div');
      loadingDiv.id = 'starcoder-loading';
      loadingDiv.style.position = 'absolute';
      loadingDiv.style.top = '10px';
      loadingDiv.style.right = '10px';
      loadingDiv.style.padding = '5px 10px';
      loadingDiv.style.background = '#1e1e1e';
      loadingDiv.style.color = 'white';
      loadingDiv.style.borderRadius = '3px';
      loadingDiv.style.zIndex = '1000';
      loadingDiv.textContent = 'Fixing with Star Coder...';
      document.body.appendChild(loadingDiv);
      
      // Run analysis first to get issues
      const analysis = await analyzeWithStarCoder(code, language);
      
      // Fix code
      const fixedCode = await fixCodeWithStarCoder(code, analysis.issues, language);
      
      // Remove loading indicator
      document.getElementById('starcoder-loading').remove();
      
      // Apply fixed code if available
      if (fixedCode) {
        // Ask user before applying
        if (confirm('Apply Star Coder fixes? This will replace your current code.')) {
          editor.setValue(fixedCode);
        }
      } else {
        alert('Unable to fix code with Star Coder.');
      }
    }
  });
  
  // Add command to get AI assistance
  editor.addAction({
    id: 'ask-starcoder',
    label: 'Ask Star Coder',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyQ],
    contextMenuGroupId: 'navigation',
    run: async (editor) => {
      const code = editor.getValue();
      const model = editor.getModel();
      const language = model.getLanguageId();
      
      // Create prompt input dialog
      const prompt = prompt('Ask Star Coder about your code:');
      if (!prompt) return;
      
      // Show loading indicator
      const loadingDiv = document.createElement('div');
      loadingDiv.id = 'starcoder-loading';
      loadingDiv.style.position = 'absolute';
      loadingDiv.style.top = '10px';
      loadingDiv.style.right = '10px';
      loadingDiv.style.padding = '5px 10px';
      loadingDiv.style.background = '#1e1e1e';
      loadingDiv.style.color = 'white';
      loadingDiv.style.borderRadius = '3px';
      loadingDiv.style.zIndex = '1000';
      loadingDiv.textContent = 'Getting response from Star Coder...';
      document.body.appendChild(loadingDiv);
      
      // Get assistance
      const response = await getAIAssistance(prompt, { code, language });
      
      // Remove loading indicator
      document.getElementById('starcoder-loading').remove();
      
      // Show response in a modal or panel (you'll need to implement this)
      showAIResponse(response);
    }
  });
  
  // Add completion provider for the editor
  const disposable = monaco.languages.registerCompletionItemProvider('*', {
    triggerCharacters: ['.', '(', '{', '[', ',', ' '],
    provideCompletionItems: async (model, position) => {
      const code = model.getValue();
      const cursorOffset = model.getOffsetAt(position);
      const language = model.getLanguageId();
      
      // Get completions from Star Coder
      const completionResponse = await getCompletionsFromStarCoder(
        code, 
        cursorOffset,
        language
      );
      
      if (!completionResponse.completions || completionResponse.completions.length === 0) {
        return { suggestions: [] };
      }
      
      // Create completion items
      const suggestions = completionResponse.completions.map(completion => {
        return {
          label: completion.substring(0, 50) + (completion.length > 50 ? '...' : ''),
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: 'Star Coder suggestion',
          insertText: completion,
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          }
        };
      });
      
      return { suggestions };
    }
  });
  
  // Return dispose function for cleanup
  return {
    dispose: () => {
      disposable.dispose();
    }
  };
}

// Apply diagnostics to the editor
function applyDiagnostics(monaco, editor, issues) {
  // Create markers for Monaco editor
  const markers = issues.map(issue => {
    return {
      severity: issue.severity === 'error' ? monaco.MarkerSeverity.Error :
                issue.severity === 'warning' ? monaco.MarkerSeverity.Warning :
                monaco.MarkerSeverity.Info,
      message: issue.message,
      startLineNumber: issue.line,
      startColumn: 1,
      endLineNumber: issue.line,
      endColumn: 1000 // End of line
    };
  });
  
  // Set markers on the model
  const model = editor.getModel();
  monaco.editor.setModelMarkers(model, 'starcoder', markers);
}

// Function to show analysis results (implement this based on your UI)
function showAnalysisResults(analysis) {
  // Create a modal or panel to show results
  const resultsContainer = document.createElement('div');
  resultsContainer.id = 'starcoder-results';
  resultsContainer.style.position = 'fixed';
  resultsContainer.style.bottom = '20px';
  resultsContainer.style.right = '20px';
  resultsContainer.style.width = '400px';
  resultsContainer.style.maxHeight = '300px';
  resultsContainer.style.overflow = 'auto';
  resultsContainer.style.background = '#1e1e1e';
  resultsContainer.style.color = 'white';
  resultsContainer.style.borderRadius = '5px';
  resultsContainer.style.padding = '15px';
  resultsContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
  resultsContainer.style.zIndex = '1000';
  
  // Create header
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.marginBottom = '10px';
  header.innerHTML = `
    <h3 style="margin: 0; font-size: 16px;">Star Coder Analysis</h3>
    <button style="background: none; border: none; color: white; cursor: pointer;">✕</button>
  `;
  resultsContainer.appendChild(header);
  
  // Close button event
  header.querySelector('button').addEventListener('click', () => {
    document.getElementById('starcoder-results').remove();
  });
  
  // Add summary
  const summary = document.createElement('div');
  summary.style.marginBottom = '10px';
  summary.style.padding = '8px';
  summary.style.background = '#2d2d2d';
  summary.style.borderRadius = '3px';
  summary.textContent = analysis.summary;
  resultsContainer.appendChild(summary);
  
  // Add issues
  if (analysis.issues && analysis.issues.length > 0) {
    const issuesHeader = document.createElement('h4');
    issuesHeader.style.margin = '10px 0';
    issuesHeader.style.fontSize = '14px';
    issuesHeader.textContent = 'Issues';
    resultsContainer.appendChild(issuesHeader);
    
    const issuesList = document.createElement('ul');
    issuesList.style.padding = '0 0 0 20px';
    issuesList.style.margin = '0';
    
    analysis.issues.forEach(issue => {
      const issueItem = document.createElement('li');
      issueItem.style.marginBottom = '5px';
      
      const severityColor = issue.severity === 'error' ? '#ff5555' :
                           issue.severity === 'warning' ? '#ffaa33' : '#5599ff';
      
      issueItem.innerHTML = `
        <span style="color: ${severityColor};">${issue.severity}: </span>
        Line ${issue.line} - ${issue.message}
      `;
      issuesList.appendChild(issueItem);
    });
    
    resultsContainer.appendChild(issuesList);
  }
  
  // Add suggestions
  if (analysis.suggestions && analysis.suggestions.length > 0) {
    const suggestionsHeader = document.createElement('h4');
    suggestionsHeader.style.margin = '10px 0';
    suggestionsHeader.style.fontSize = '14px';
    suggestionsHeader.textContent = 'Suggestions';
    resultsContainer.appendChild(suggestionsHeader);
    
    const suggestionsList = document.createElement('ul');
    suggestionsList.style.padding = '0 0 0 20px';
    suggestionsList.style.margin = '0';
    
    analysis.suggestions.forEach(suggestion => {
      const suggestionItem = document.createElement('li');
      suggestionItem.style.marginBottom = '5px';
      suggestionItem.textContent = suggestion.description;
      suggestionsList.appendChild(suggestionItem);
    });
    
    resultsContainer.appendChild(suggestionsList);
  }
  
  document.body.appendChild(resultsContainer);
}

// Function to show AI response (implement this based on your UI)
function showAIResponse(response) {
  // Create a modal or panel to show response
  const responseContainer = document.createElement('div');
  responseContainer.id = 'starcoder-response';
  responseContainer.style.position = 'fixed';
  responseContainer.style.bottom = '20px';
  responseContainer.style.right = '20px';
  responseContainer.style.width = '500px';
  responseContainer.style.maxHeight = '400px';
  responseContainer.style.overflow = 'auto';
  responseContainer.style.background = '#1e1e1e';
  responseContainer.style.color = 'white';
  responseContainer.style.borderRadius = '5px';
  responseContainer.style.padding = '15px';
  responseContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
  responseContainer.style.zIndex = '1000';
  
  // Create header
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.marginBottom = '10px';
  header.innerHTML = `
    <h3 style="margin: 0; font-size: 16px;">Star Coder Response</h3>
    <button style="background: none; border: none; color: white; cursor: pointer;">✕</button>
  `;
  responseContainer.appendChild(header);
  
  // Close button event
  header.querySelector('button').addEventListener('click', () => {
    document.getElementById('starcoder-response').remove();
  });
  
  // Format the response with syntax highlighting
  const formattedResponse = response.replace(/```(\w*)([\s\S]*?)```/g, (match, lang, code) => {
    return `<div style="background: #2d2d2d; padding: 10px; border-radius: 3px; margin: 10px 0; overflow-x: auto;">
      <pre style="margin: 0;"><code>${code}</code></pre>
    </div>`;
  });
  
  // Add response content
  const content = document.createElement('div');
  content.style.lineHeight = '1.5';
  content.style.whiteSpace = 'pre-wrap';
  content.innerHTML = formattedResponse;
  responseContainer.appendChild(content);
  
  document.body.appendChild(responseContainer);
}

// Export the integration function
if (typeof window !== 'undefined') {
  window.integrateStarCoderWithMonaco = integrateStarCoderWithMonaco;
}

// Usage example:
/*
// Add this to your Monaco Editor initialization
require(['vs/editor/editor.main'], function() {
  const editor = monaco.editor.create(document.getElementById('container'), {
    value: '',
    language: 'javascript'
  });
  
  // Integrate Star Coder
  const integration = integrateStarCoderWithMonaco(monaco, editor);
  
  // To dispose later if needed
  // integration.dispose();
});
*/