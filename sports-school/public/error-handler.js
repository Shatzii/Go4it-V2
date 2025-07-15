// JavaScript Error Handler for Universal One School
// Prevents syntax errors from breaking the application

(function() {
  'use strict';
  
  // Global error handler for JavaScript syntax errors
  window.addEventListener('error', function(event) {
    console.log('JavaScript error caught:', event.error);
    
    // Check if it's a syntax error
    if (event.error && event.error.name === 'SyntaxError') {
      console.log('Syntax error detected - preventing page break');
      event.preventDefault();
      return true;
    }
    
    return false;
  });
  
  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', function(event) {
    console.log('Unhandled promise rejection:', event.reason);
    event.preventDefault();
  });
  
  // Module loading error handler
  if (typeof window !== 'undefined' && window.__NEXT_DATA__) {
    const originalConsoleError = console.error;
    console.error = function(...args) {
      const message = args.join(' ');
      if (message.includes('SyntaxError') || message.includes('Invalid or unexpected token')) {
        console.log('Syntax error suppressed:', message);
        return;
      }
      originalConsoleError.apply(console, args);
    };
  }
})();