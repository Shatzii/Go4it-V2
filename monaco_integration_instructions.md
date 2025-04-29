# Monaco Editor + Star Coder Integration Instructions

This guide explains how to integrate Star Coder with Monaco Editor for enhanced development capabilities.

## Overview

The integration provides:
- AI-powered code analysis
- Automated error fixing suggestions
- Code completions as you type
- In-editor AI assistance for questions about your code

## Prerequisites

1. Star Coder API must be running (typically via Ollama)
2. Monaco Editor must be already set up in your application

## Setup Instructions

### Step 1: Add the Integration Script

Upload `direct_integration.js` to `/var/www/html/pharaoh/js/`. This script contains all the necessary functions to connect Monaco Editor with Star Coder.

### Step 2: Update Monaco Editor Setup

Locate your Monaco Editor initialization code (typically in `monaco-setup.js`) and add the following code after the editor is initialized:

```javascript
// Integrate Star Coder with Monaco Editor
if (typeof integrateStarCoderWithMonaco === 'function') {
  integrateStarCoderWithMonaco(monaco, editor);
  console.log('Star Coder integration initialized');
} else {
  console.error('Star Coder integration function not found');
}
```

### Step 3: Import the Integration Script

In your HTML file where Monaco Editor is used, add the following script tag:

```html
<script src="/pharaoh/js/direct_integration.js"></script>
```

Make sure to add this script tag before Monaco Editor is initialized.

## Configuration

You can customize the integration by modifying the configuration variables at the top of `direct_integration.js`:

```javascript
// Configuration
const STAR_CODER_API_URL = "http://localhost:11434/v1"; // Change this if your API is at a different URL

// Keyboard shortcuts config
const SHORTCUTS = {
  ANALYZE: "ctrl+shift+a",
  FIX: "ctrl+shift+f",
  QUERY: "ctrl+shift+q"
};
```

## Usage

After integration, these features are available:

### Code Analysis
- Press `Ctrl+Shift+A` to analyze the current code
- A panel will appear with:
  - Summary of the code
  - Potential issues
  - Performance optimization suggestions
  - Security considerations
  - Improvement recommendations

### Code Fixing
- Press `Ctrl+Shift+F` to fix issues in the current code
- The editor will show suggestions for fixing detected problems

### AI Assistance
- Press `Ctrl+Shift+Q` to ask a question about your code
- Type your question and get an immediate response

### Code Completions
- As you type, the system will suggest code completions
- These suggestions are context-aware and based on your current code

## Troubleshooting

If you encounter issues:

1. Check browser console for errors (F12 > Console tab)
2. Verify Star Coder API is running (`curl http://localhost:11434/v1/models`)
3. Make sure `direct_integration.js` is loaded (should see "Star Coder integration loaded" in the console)
4. Check that you've added the integration code after Monaco Editor is initialized

## Common Errors

- **"Star Coder integration function not found"**: Make sure `direct_integration.js` is loaded before calling `integrateStarCoderWithMonaco`
- **"Failed to fetch"**: Check if Star Coder API is running at the configured URL
- **"Cannot read property 'appendChild' of null"**: Check if Monaco Editor is fully initialized before integration

## Customizing the UI

You can customize the appearance of the Star Coder integration panels by modifying the CSS in the `initUI()` function in `direct_integration.js`.