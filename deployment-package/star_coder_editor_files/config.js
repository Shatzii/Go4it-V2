/**
 * Go4It Sports Star Coder Editor Integration Configuration
 * 
 * IMPORTANT: This configuration connects to your EXISTING Star Coder instance!
 * No new AI instance is installed - this just connects what you already have.
 */

module.exports = {
  // Star Coder API endpoint - point to your EXISTING Star Coder instance
  // Change this to match your current Star Coder installation
  starCoderApiUrl: 'http://localhost:11434/v1',
  
  // Monaco Editor service port
  // This won't conflict with your main application
  editorPort: 8090,
  
  // API service port
  apiPort: 8091,
  
  // Projects root directory - this is where your main site files are located
  // The editor will browse and edit files in this location
  projectsRoot: '/var/www/go4itsports',
  
  // Domain for the editor - separate from your main site domain
  // This ensures no conflicts with your main application
  editorDomain: 'editor.go4itsports.org'
};
