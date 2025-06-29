/**
 * Go4It Sports Entry Point
 * 
 * This file integrates the mobile optimizations and performance enhancements
 * into the main application.
 */

// Import mobile optimization features
import { setupEnhancedMobileExperience } from './mobile-integration';

// Initialize the mobile experience enhancements
document.addEventListener('DOMContentLoaded', () => {
  // Initialize mobile optimizations
  setupEnhancedMobileExperience();
  
  console.log('Go4It Sports mobile optimizations initialized');
});

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope:', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}