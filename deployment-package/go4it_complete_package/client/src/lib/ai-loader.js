/**
 * AI Utility Loader for Go4It Sports Platform
 * 
 * This module dynamically loads all AI utility scripts required by the application
 * and ensures they are properly initialized.
 * 
 * For production deployment to https://go4itsports.org
 */

// Import AI modules with proper ES module syntax
import agent from './agent.js';
import aiAssist from './ai_assist.js';
import upload from './upload.js';
import voice from './voice.js';

// Configuration with environment-aware base URL
const config = {
  apiBase: import.meta.env.PROD 
    ? 'https://go4itsports.org/api' 
    : '/api',
  assetBase: import.meta.env.PROD
    ? 'https://go4itsports.org/assets'
    : '/assets',
  debug: import.meta.env.DEV,
};

// Initialize all AI modules
function initializeAIModules() {
  if (config.debug) {
    console.log('Initializing AI modules for Go4It Sports platform');
  }
  
  try {
    // Initialize each module with the configuration
    agent.init(config);
    aiAssist.init(config);
    upload.init(config);
    voice.init(config);
    
    if (config.debug) {
      console.log('AI modules initialized successfully');
    }
    
    // Dispatch event when all modules are loaded
    window.dispatchEvent(new CustomEvent('ai-modules-loaded'));
    
    return true;
  } catch (error) {
    console.error('Error initializing AI modules:', error);
    return false;
  }
}

// Export a function to manually initialize when needed
export function loadAIModules() {
  return initializeAIModules();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAIModules);
} else {
  // DOM already loaded, initialize immediately
  initializeAIModules();
}

// Export the module for direct imports
export default {
  init: initializeAIModules,
  config
};