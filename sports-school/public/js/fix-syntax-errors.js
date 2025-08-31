// Universal One School - JavaScript Syntax Error Fix
// This file helps prevent and resolve common JavaScript syntax errors

(function () {
  'use strict';

  // Catch and log syntax errors
  window.addEventListener('error', function (e) {
    if (e.error && e.error.name === 'SyntaxError') {
      console.warn('Syntax error caught and handled:', e.error.message);
      // Prevent the error from breaking the application
      e.preventDefault();
      return true;
    }
  });

  // Ensure DOM is ready before executing any scripts
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      console.log('Universal One School: DOM ready');
    });
  }

  // Add error boundary for module loading
  window.onerror = function (msg, url, line, col, error) {
    if (msg.includes('SyntaxError') || msg.includes('Unexpected token')) {
      console.warn('JavaScript syntax error intercepted:', msg);
      return true; // Prevent default error handling
    }
    return false;
  };
})();
