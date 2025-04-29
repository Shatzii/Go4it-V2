# Connecting Star Coder to Monaco Editor

## Integration Steps

1. **Upload the integration file**
   - Upload `direct_integration.js` to `/var/www/html/pharaoh/js/`

2. **Update monaco-setup.js**
   - Open `/var/www/html/pharaoh/js/monaco-setup.js`
   - Add this code at the end of the file (after the editor is initialized):

```javascript
// Integrate Star Coder
if (typeof integrateStarCoderWithMonaco === 'function') {
  integrateStarCoderWithMonaco(monaco, editor);
  console.log('Star Coder integration initialized');
} else {
  console.error('Star Coder integration function not found');
}
```

3. **Update your HTML file**
   - Open the HTML file that includes Monaco Editor (likely `command_panel.html`)
   - Add this script tag before the Monaco Editor initialization:

```html
<script src="/pharaoh/js/direct_integration.js"></script>
```

## Testing the Integration

After implementing these changes, you can test the integration with these keyboard shortcuts:

- `Ctrl+Shift+A` - Analyze code with Star Coder
- `Ctrl+Shift+F` - Fix code with Star Coder
- `Ctrl+Shift+Q` - Ask Star Coder a question about your code

You'll also get intelligent code completions as you type.

## Integration Components

The integration adds several components to your Monaco Editor:

1. **Code Analysis**
   - Scans your code for bugs and improvement opportunities
   - Displays detailed diagnostic information
   - Highlights issues directly in the editor

2. **Code Fixing**
   - Automatically generates fixes for identified issues
   - Lets you review and apply the fixes with a confirmation

3. **AI Assistance**
   - Ask questions about your code
   - Get detailed explanations and suggestions

4. **Code Completion**
   - Smart suggestions as you type
   - Context-aware completions based on your code

## Troubleshooting

If you encounter issues:

1. Check browser console (F12) for any JavaScript errors
2. Verify Star Coder API is running (`curl http://localhost:11434/v1/models` should return a list of models)
3. Make sure the paths in `direct_integration.js` match your actual setup

## Advanced Configuration

If needed, you can adjust settings in the `config` object at the top of `direct_integration.js`:

```javascript
const config = {
  starCoderApiUrl: 'http://localhost:11434/v1', // Your Star Coder API endpoint
  projectRoot: '/var/www/go4itsports',          // Your project root directory
  modelName: 'codellama:13b'                    // Your Star Coder model
};
```