/**
 * Go4It Sports - Monaco Editor + StarCoder Integration
 * 
 * This script integrates Monaco Editor with StarCoder AI to provide
 * intelligent code editing, completion, and analysis for the Go4It Sports
 * platform development.
 */

// StarCoder Integration
(function() {
    // Configuration
    const CONFIG = {
        starCoderEndpoint: 'http://localhost:11434/v1/chat/completions',
        starCoderModel: 'codellama:13b-8bit',
        monacoLoadCheckInterval: 500, // ms to check if Monaco is loaded
        statusBarPosition: 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
        keybindings: {
            autoFix: 'ctrl+shift+f', // Auto-fix code
            askQuestion: 'ctrl+shift+q', // Ask AI a question
            codeAudit: 'ctrl+shift+a', // Run code audit
        }
    };

    // State
    let editor = null;
    let monaco = null;
    let statusBar = null;
    let outputPanel = null;
    let isStarCoderEnabled = false;

    // Initialize
    function initialize() {
        console.log('Go4It Sports - Monaco + StarCoder Integration initializing...');
        waitForMonaco();
    }

    // Wait for Monaco to load
    function waitForMonaco() {
        const interval = setInterval(() => {
            if (typeof window.monaco !== 'undefined') {
                clearInterval(interval);
                console.log('Monaco detected, continuing integration...');
                monaco = window.monaco;
                waitForEditor();
            }
        }, CONFIG.monacoLoadCheckInterval);
    }

    // Wait for editor instance
    function waitForEditor() {
        const interval = setInterval(() => {
            if (monaco.editor && monaco.editor.getModels().length > 0) {
                clearInterval(interval);
                console.log('Monaco editor instance detected, setting up integration...');
                setupIntegration();
            }
        }, CONFIG.monacoLoadCheckInterval);
    }

    // Set up the integration
    function setupIntegration() {
        // Get the editor instance
        editor = monaco.editor.getEditors()[0];
        if (!editor) {
            console.error('Failed to get editor instance');
            return;
        }

        // Initialize UI components
        initUI();

        // Set up event listeners
        setupEventListeners();

        // Initialize StarCoder connection
        connectToStarCoder();
    }

    // Initialize UI elements
    function initUI() {
        console.log('Initializing UI elements...');
        
        // Create status bar
        createStatusBar();
        
        // Create output panel
        createOutputPanel();
        
        // Update status
        updateStatus('Initializing StarCoder integration...', 'info');
    }

    // Create status bar
    function createStatusBar() {
        statusBar = document.createElement('div');
        statusBar.id = 'starcoder-status';
        statusBar.style.position = 'fixed';
        
        // Position based on configuration
        switch(CONFIG.statusBarPosition) {
            case 'bottom-right':
                statusBar.style.bottom = '20px';
                statusBar.style.right = '20px';
                break;
            case 'bottom-left':
                statusBar.style.bottom = '20px';
                statusBar.style.left = '20px';
                break;
            case 'top-right':
                statusBar.style.top = '20px';
                statusBar.style.right = '20px';
                break;
            case 'top-left':
                statusBar.style.top = '20px';
                statusBar.style.left = '20px';
                break;
        }
        
        statusBar.style.padding = '8px 12px';
        statusBar.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        statusBar.style.borderRadius = '4px';
        statusBar.style.color = 'white';
        statusBar.style.fontFamily = 'monospace';
        statusBar.style.zIndex = '9999';
        statusBar.style.cursor = 'pointer';
        statusBar.textContent = 'StarCoder: Connecting...';
        statusBar.style.display = 'flex';
        statusBar.style.alignItems = 'center';
        statusBar.style.gap = '8px';
        
        // Add status indicator
        const indicator = document.createElement('div');
        indicator.id = 'starcoder-indicator';
        indicator.style.width = '10px';
        indicator.style.height = '10px';
        indicator.style.borderRadius = '50%';
        indicator.style.backgroundColor = '#f5a623'; // Orange/yellow for pending
        statusBar.prepend(indicator);
        
        // Add status bar to body
        document.body.appendChild(statusBar);
        
        // Add click event to toggle output panel
        statusBar.addEventListener('click', toggleOutputPanel);
    }

    // Create output panel
    function createOutputPanel() {
        outputPanel = document.createElement('div');
        outputPanel.id = 'starcoder-output';
        outputPanel.style.position = 'fixed';
        outputPanel.style.bottom = '60px';
        outputPanel.style.right = '20px';
        outputPanel.style.width = '500px';
        outputPanel.style.maxHeight = '400px';
        outputPanel.style.backgroundColor = 'rgba(30, 30, 30, 0.95)';
        outputPanel.style.borderRadius = '8px';
        outputPanel.style.color = 'white';
        outputPanel.style.fontFamily = 'monospace';
        outputPanel.style.zIndex = '9998';
        outputPanel.style.overflow = 'auto';
        outputPanel.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        outputPanel.style.display = 'none'; // Hidden by default
        
        // Create header
        const header = document.createElement('div');
        header.style.padding = '10px 15px';
        header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        
        const title = document.createElement('div');
        title.textContent = 'StarCoder AI';
        title.style.fontWeight = 'bold';
        
        const closeBtn = document.createElement('div');
        closeBtn.textContent = '✕';
        closeBtn.style.cursor = 'pointer';
        closeBtn.addEventListener('click', () => {
            outputPanel.style.display = 'none';
        });
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        // Create content area
        const content = document.createElement('div');
        content.id = 'starcoder-content';
        content.style.padding = '15px';
        content.style.maxHeight = '320px';
        content.style.overflow = 'auto';
        
        // Create footer with input
        const footer = document.createElement('div');
        footer.style.padding = '10px 15px';
        footer.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
        footer.style.display = 'flex';
        
        const input = document.createElement('input');
        input.id = 'starcoder-input';
        input.type = 'text';
        input.placeholder = 'Ask StarCoder a question...';
        input.style.flex = '1';
        input.style.padding = '8px 12px';
        input.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        input.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        input.style.borderRadius = '4px';
        input.style.color = 'white';
        input.style.width = '100%';
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const question = input.value.trim();
                if (question) {
                    askStarCoder(question);
                    input.value = '';
                }
            }
        });
        
        footer.appendChild(input);
        
        // Assemble the panel
        outputPanel.appendChild(header);
        outputPanel.appendChild(content);
        outputPanel.appendChild(footer);
        
        // Add to document
        document.body.appendChild(outputPanel);
    }

    // Toggle output panel visibility
    function toggleOutputPanel() {
        if (outputPanel.style.display === 'none') {
            outputPanel.style.display = 'block';
            setTimeout(() => {
                document.getElementById('starcoder-input').focus();
            }, 100);
        } else {
            outputPanel.style.display = 'none';
        }
    }

    // Update status bar
    function updateStatus(message, type = 'info') {
        if (!statusBar) return;
        
        const indicator = document.getElementById('starcoder-indicator');
        statusBar.textContent = `StarCoder: ${message}`;
        statusBar.prepend(indicator);
        
        // Set color based on type
        switch(type) {
            case 'success':
                indicator.style.backgroundColor = '#4ade80'; // Green
                statusBar.style.backgroundColor = 'rgba(0, 100, 0, 0.7)';
                break;
            case 'error':
                indicator.style.backgroundColor = '#f87171'; // Red
                statusBar.style.backgroundColor = 'rgba(100, 0, 0, 0.7)';
                break;
            case 'warning':
                indicator.style.backgroundColor = '#fbbf24'; // Yellow
                statusBar.style.backgroundColor = 'rgba(100, 75, 0, 0.7)';
                break;
            case 'info':
            default:
                indicator.style.backgroundColor = '#60a5fa'; // Blue
                statusBar.style.backgroundColor = 'rgba(0, 0, 100, 0.7)';
                break;
        }
        
        // Reset after 3 seconds for non-error states
        if (type !== 'error') {
            setTimeout(() => {
                if (isStarCoderEnabled) {
                    indicator.style.backgroundColor = '#4ade80'; // Green
                    statusBar.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                    statusBar.textContent = 'StarCoder: Ready';
                    statusBar.prepend(indicator);
                }
            }, 3000);
        }
    }

    // Add a message to the output panel
    function addMessage(message, sender = 'system', type = 'info') {
        const content = document.getElementById('starcoder-content');
        
        const messageEl = document.createElement('div');
        messageEl.className = `starcoder-message starcoder-${sender}`;
        messageEl.style.marginBottom = '10px';
        messageEl.style.padding = '8px';
        messageEl.style.borderRadius = '4px';
        
        // Style based on sender
        if (sender === 'system') {
            messageEl.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
            messageEl.style.fontStyle = 'italic';
        } else if (sender === 'user') {
            messageEl.style.backgroundColor = 'rgba(66, 135, 245, 0.1)';
            messageEl.style.borderLeft = '3px solid #4287f5';
        } else if (sender === 'ai') {
            messageEl.style.backgroundColor = 'rgba(74, 222, 128, 0.1)';
            messageEl.style.borderLeft = '3px solid #4ade80';
        }
        
        // Style based on type
        if (type === 'error') {
            messageEl.style.backgroundColor = 'rgba(248, 113, 113, 0.1)';
            messageEl.style.borderLeft = '3px solid #f87171';
        } else if (type === 'warning') {
            messageEl.style.backgroundColor = 'rgba(251, 191, 36, 0.1)';
            messageEl.style.borderLeft = '3px solid #fbbf24';
        }
        
        // Format code blocks
        if (message.includes('```')) {
            let formatted = '';
            const blocks = message.split('```');
            
            blocks.forEach((block, index) => {
                if (index % 2 === 0) {
                    // Not a code block
                    formatted += block;
                } else {
                    // Code block
                    const code = block.trim();
                    formatted += `<pre style="background-color: rgba(0, 0, 0, 0.3); padding: 10px; border-radius: 4px; overflow-x: auto;"><code>${code}</code></pre>`;
                }
            });
            
            messageEl.innerHTML = formatted;
        } else {
            messageEl.textContent = message;
        }
        
        content.appendChild(messageEl);
        content.scrollTop = content.scrollHeight;
        
        // Show the panel if it's hidden
        if (outputPanel.style.display === 'none') {
            outputPanel.style.display = 'block';
        }
    }

    // Set up keyboard shortcuts and event listeners
    function setupEventListeners() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Auto-fix code
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'f') {
                e.preventDefault();
                autoFixCode();
            }
            
            // Ask a question
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'q') {
                e.preventDefault();
                toggleOutputPanel();
            }
            
            // Run code audit
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
                e.preventDefault();
                auditCode();
            }
        });
        
        // Set up editor change event
        if (editor) {
            editor.onDidChangeModelContent(() => {
                // You could implement real-time suggestions here
                // But we'll keep it simple for now
            });
        }
    }

    // Connect to StarCoder API
    async function connectToStarCoder() {
        updateStatus('Connecting to StarCoder...', 'info');
        addMessage('Initializing StarCoder AI connection...', 'system');
        
        try {
            // Send a test request to the StarCoder API
            const response = await callStarCoder('Hello, are you working? Please respond with a simple greeting.');
            
            if (response && !response.includes('Error')) {
                isStarCoderEnabled = true;
                updateStatus('Connected', 'success');
                addMessage('StarCoder AI connection established successfully!', 'system', 'success');
                addMessage(response, 'ai');
            } else {
                updateStatus('Connection failed', 'error');
                addMessage('Failed to connect to StarCoder AI. Check server configuration.', 'system', 'error');
                addMessage(`Error: ${response}`, 'system', 'error');
            }
        } catch (error) {
            isStarCoderEnabled = false;
            updateStatus('Connection failed', 'error');
            addMessage(`Error connecting to StarCoder: ${error.message}`, 'system', 'error');
            console.error('Error connecting to StarCoder:', error);
        }
    }

    // Call StarCoder API
    async function callStarCoder(prompt, systemPrompt = null) {
        try {
            const messages = [];
            
            if (systemPrompt) {
                messages.push({
                    role: 'system',
                    content: systemPrompt
                });
            }
            
            messages.push({
                role: 'user',
                content: prompt
            });
            
            const response = await fetch(CONFIG.starCoderEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: CONFIG.starCoderModel,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error calling StarCoder API:', error);
            return `Error: ${error.message}`;
        }
    }

    // Auto-fix code
    async function autoFixCode() {
        if (!isStarCoderEnabled || !editor) {
            updateStatus('StarCoder not available', 'error');
            return;
        }
        
        updateStatus('Auto-fixing code...', 'info');
        
        // Get the current code
        const code = editor.getValue();
        const model = editor.getModel();
        const filename = model ? model.uri.path.split('/').pop() : 'unknown';
        const language = model ? model.getLanguageId() : 'javascript';
        
        addMessage('Auto-fixing code...', 'system');
        addMessage(`File: ${filename} (${language})`, 'system');
        
        const systemPrompt = `You are an expert code reviewer and fixer. You are reviewing a ${language} file named ${filename}. Fix any issues you find in the code, focusing on bugs, performance issues, and best practices. Return ONLY the fixed code, with no explanation or markdown formatting.`;
        
        try {
            // Call StarCoder to fix the code
            const fixedCode = await callStarCoder(code, systemPrompt);
            
            if (fixedCode && !fixedCode.includes('Error')) {
                // Extract just the code (remove any markdown formatting)
                let cleanCode = fixedCode;
                if (fixedCode.includes('```')) {
                    const codeMatch = fixedCode.match(/```(?:\w+)?\n([\s\S]+?)\n```/);
                    if (codeMatch && codeMatch[1]) {
                        cleanCode = codeMatch[1];
                    }
                }
                
                // Update the editor
                editor.setValue(cleanCode);
                
                updateStatus('Code fixed', 'success');
                addMessage('Code has been auto-fixed!', 'system', 'success');
            } else {
                updateStatus('Auto-fix failed', 'error');
                addMessage(`Failed to auto-fix code: ${fixedCode}`, 'system', 'error');
            }
        } catch (error) {
            updateStatus('Auto-fix failed', 'error');
            addMessage(`Error during auto-fix: ${error.message}`, 'system', 'error');
            console.error('Error during auto-fix:', error);
        }
    }

    // Ask a question to StarCoder
    async function askStarCoder(question) {
        if (!isStarCoderEnabled) {
            updateStatus('StarCoder not available', 'error');
            addMessage('StarCoder is not connected. Cannot process your question.', 'system', 'error');
            return;
        }
        
        updateStatus('Processing question...', 'info');
        addMessage(question, 'user');
        
        try {
            // Add context about the current file
            let context = '';
            if (editor) {
                const model = editor.getModel();
                if (model) {
                    const filename = model.uri.path.split('/').pop();
                    const language = model.getLanguageId();
                    context = `I'm working on a ${language} file named ${filename}. `;
                }
            }
            
            // Call StarCoder with the question
            const systemPrompt = 'You are an AI coding assistant for Go4It Sports, a platform for neurodivergent student athletes. Provide helpful, concise answers to coding questions. When providing code examples, use appropriate syntax highlighting. Focus on practical solutions and explain your reasoning.';
            const response = await callStarCoder(context + question, systemPrompt);
            
            if (response && !response.includes('Error')) {
                updateStatus('Response received', 'success');
                addMessage(response, 'ai');
            } else {
                updateStatus('Response failed', 'error');
                addMessage(`Failed to get response: ${response}`, 'system', 'error');
            }
        } catch (error) {
            updateStatus('Response failed', 'error');
            addMessage(`Error processing question: ${error.message}`, 'system', 'error');
            console.error('Error processing question:', error);
        }
    }

    // Audit code
    async function auditCode() {
        if (!isStarCoderEnabled || !editor) {
            updateStatus('StarCoder not available', 'error');
            return;
        }
        
        updateStatus('Auditing code...', 'info');
        
        // Get the current code
        const code = editor.getValue();
        const model = editor.getModel();
        const filename = model ? model.uri.path.split('/').pop() : 'unknown';
        const language = model ? model.getLanguageId() : 'javascript';
        
        addMessage('Running code audit...', 'system');
        addMessage(`File: ${filename} (${language})`, 'system');
        
        const systemPrompt = `You are an expert code auditor specializing in security, performance, and code quality. You are auditing a ${language} file named ${filename}. Analyze the code and provide a detailed report on:
1. Security vulnerabilities
2. Performance issues
3. Code quality concerns
4. Best practice violations
5. Suggested improvements

Format your response with proper markdown headings and bullet points. Be specific about line numbers when possible.`;
        
        try {
            // Call StarCoder to audit the code
            const auditResult = await callStarCoder(code, systemPrompt);
            
            if (auditResult && !auditResult.includes('Error')) {
                updateStatus('Audit complete', 'success');
                addMessage('Code audit completed!', 'system', 'success');
                addMessage(auditResult, 'ai');
            } else {
                updateStatus('Audit failed', 'error');
                addMessage(`Failed to audit code: ${auditResult}`, 'system', 'error');
            }
        } catch (error) {
            updateStatus('Audit failed', 'error');
            addMessage(`Error during audit: ${error.message}`, 'system', 'error');
            console.error('Error during audit:', error);
        }
    }

    // Start initialization
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }
})();