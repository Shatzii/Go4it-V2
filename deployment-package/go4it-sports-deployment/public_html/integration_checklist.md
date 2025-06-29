# Integration Checklist: Connecting Star Coder with Monaco Editor

## Required Information

1. **Star Coder API Details**
   - What URL/port is your Star Coder API running on? (Default is `http://localhost:11434/v1`)
   - What model are you using in Star Coder? (Default is `codellama:13b`)

2. **Monaco Editor Setup**
   - Where is your Monaco Editor implemented in your codebase?
   - Is it a standalone instance or part of a larger component?
   - Do you have access to modify the Monaco initialization code?

3. **Project Structure**
   - What is the root directory of your project on the server? (e.g., `/var/www/go4itsports`)
   - What is the main file extension type you'll be editing? (.js, .ts, etc.)

4. **Server Access**
   - Do you have full access to your server via File Browser?
   - Do you have permissions to modify JavaScript files on your site?

## Implementation Steps

1. **Adding the Integration**

   You have two implementation options:

   **Option A: Direct Script Integration (Recommended)**
   - Add the `direct_integration.js` script to your site
   - Import it in your Monaco editor initialization
   - Call `integrateStarCoderWithMonaco(monaco, editor)` where your editor is initialized

   **Option B: Add Script Tag**
   - Add this script tag to your HTML:
   ```html
   <script src="/path/to/direct_integration.js"></script>
   ```
   - Add this code after your Monaco editor initialization:
   ```javascript
   if (window.integrateStarCoderWithMonaco) {
     integrateStarCoderWithMonaco(monaco, editor);
   }
   ```

2. **Configuring the Integration**

   Edit these values at the top of the `direct_integration.js` file:
   ```javascript
   const config = {
     starCoderApiUrl: 'http://localhost:11434/v1', // Change to your Star Coder API URL
     projectRoot: '/var/www/go4itsports'           // Change to your project root
   };
   ```

3. **Testing the Integration**

   After implementation, you can test the integration with these keyboard shortcuts:
   - `Ctrl+Shift+A` - Analyze code with Star Coder
   - `Ctrl+Shift+F` - Fix code with Star Coder
   - `Ctrl+Shift+Q` - Ask Star Coder a question about your code

## Troubleshooting

If the integration doesn't work:

1. **Check Console Errors**
   - Open browser developer tools (F12)
   - Look for any JavaScript errors in the console

2. **Verify Star Coder API**
   - Make sure your Star Coder API is running
   - Test a direct API call to confirm it's responsive:
   ```bash
   curl -X POST http://localhost:11434/v1/chat/completions \
     -H "Content-Type: application/json" \
     -d '{"model":"codellama:13b","messages":[{"role":"user","content":"Hello"}]}'
   ```

3. **Check Path Access**
   - Verify that the JavaScript has permission to access your project files
   - Common issue: CORS problems if Star Coder API is on a different domain

## Next Steps After Integration

1. Start using the keyboard shortcuts to analyze and fix code
2. Add custom UI elements if needed 
3. Extend the integration with additional features based on your requirements