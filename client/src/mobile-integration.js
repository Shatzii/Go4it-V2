/**
 * Go4It Sports - Mobile Integration Module
 * 
 * This module connects the mobile optimization features to the main application.
 * It should be imported in the main client entry point.
 */

import { mobileOptimization } from './mobile-optimization';
import './mobile-enhanced.css';

/**
 * Initialize mobile optimizations when the page loads
 */
export function initMobileFeatures() {
  // Initialize core mobile features
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      mobileOptimization.init();
    });
  } else {
    mobileOptimization.init();
  }

  // Register service worker for offline support
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
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
  
  // Create mobile navigation if it doesn't exist
  setupMobileNavigation();
  
  // Set up swipe gesture handlers
  setupSwipeHandlers();
}

/**
 * Create a mobile-friendly bottom navigation
 */
function setupMobileNavigation() {
  if (document.querySelector('.mobile-nav')) return;
  
  // Only create mobile nav on mobile devices
  if (!mobileOptimization.detectMobile()) return;
  
  const navItems = [
    { icon: 'home', label: 'Home', url: '/' },
    { icon: 'user', label: 'Profile', url: '/profile' },
    { icon: 'star', label: 'StarPath', url: '/starpath' },
    { icon: 'video', label: 'Videos', url: '/videos' },
    { icon: 'menu', label: 'More', url: '/menu' }
  ];
  
  const mobileNav = document.createElement('nav');
  mobileNav.className = 'mobile-nav';
  mobileNav.setAttribute('aria-label', 'Mobile navigation');
  
  navItems.forEach(item => {
    const navItem = document.createElement('a');
    navItem.className = 'mobile-nav-item';
    navItem.href = item.url;
    
    // Use an SVG icon if available, otherwise use icon name
    navItem.innerHTML = `
      <span class="mobile-nav-icon ${item.icon}"></span>
      <span class="mobile-nav-label">${item.label}</span>
    `;
    
    mobileNav.appendChild(navItem);
  });
  
  document.body.appendChild(mobileNav);
  
  // Add padding to bottom of content to account for nav bar
  const mainContent = document.querySelector('main') || document.body;
  mainContent.style.paddingBottom = '70px';
}

/**
 * Setup swipe gesture handlers for enhanced navigation
 */
function setupSwipeHandlers() {
  // Listen for custom swipe events
  document.addEventListener('swipeleft', (event) => {
    // Navigate forward in history or to next item
    handleSwipeNavigation('next');
  });
  
  document.addEventListener('swiperight', (event) => {
    // Navigate back in history or to previous item
    handleSwipeNavigation('prev');
  });
  
  document.addEventListener('swipeup', (event) => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  document.addEventListener('swipedown', (event) => {
    // Pull to refresh-like action
    if (window.scrollY === 0) {
      window.location.reload();
    }
  });
}

/**
 * Handle navigation based on swipe direction
 */
function handleSwipeNavigation(direction) {
  // Check if we're in a carousel/slider
  const activeCarousel = document.querySelector('.carousel.active, .slider.active, [data-slider].active');
  
  if (activeCarousel) {
    // Trigger next/prev buttons in carousel
    const button = direction === 'next' 
      ? activeCarousel.querySelector('.carousel-next, .slider-next, [data-next]')
      : activeCarousel.querySelector('.carousel-prev, .slider-prev, [data-prev]');
    
    if (button) {
      button.click();
      return;
    }
  }
  
  // Check if we're in a tabbed interface
  const activeTabs = document.querySelector('.tabs, [role="tablist"]');
  
  if (activeTabs) {
    const tabs = Array.from(activeTabs.querySelectorAll('[role="tab"], .tab'));
    const activeTab = tabs.find(tab => tab.getAttribute('aria-selected') === 'true' || tab.classList.contains('active'));
    
    if (activeTab) {
      const activeIndex = tabs.indexOf(activeTab);
      const targetIndex = direction === 'next' ? activeIndex + 1 : activeIndex - 1;
      
      if (targetIndex >= 0 && targetIndex < tabs.length) {
        tabs[targetIndex].click();
        return;
      }
    }
  }
  
  // Otherwise just use browser history
  if (direction === 'prev' && window.history.length > 1) {
    window.history.back();
  }
}

/**
 * Add a button to toggle focus mode for neurodivergent users
 */
export function addFocusModeToggle() {
  // Create the focus mode toggle button
  const focusButton = document.createElement('button');
  focusButton.className = 'focus-mode-toggle';
  focusButton.setAttribute('aria-label', 'Toggle focus mode');
  focusButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  `;
  
  // Position it fixed in the corner
  Object.assign(focusButton.style, {
    position: 'fixed',
    bottom: '80px',
    right: '20px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'rgba(0,112,243,0.8)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    zIndex: '999',
    cursor: 'pointer'
  });
  
  // Add click handler to toggle focus mode
  focusButton.addEventListener('click', () => {
    document.body.classList.toggle('focused-ui');
    
    // Store preference
    if (document.body.classList.contains('focused-ui')) {
      localStorage.setItem('focused-ui', 'true');
      
      // Apply focus mode styles
      applyFocusMode(true);
    } else {
      localStorage.setItem('focused-ui', 'false');
      
      // Remove focus mode styles
      applyFocusMode(false);
    }
  });
  
  // Check if user previously enabled focus mode
  if (localStorage.getItem('focused-ui') === 'true') {
    document.body.classList.add('focused-ui');
    applyFocusMode(true);
  }
  
  // Add button to page
  document.body.appendChild(focusButton);
}

/**
 * Apply focus mode styles to help neurodivergent users focus
 */
function applyFocusMode(enabled) {
  if (enabled) {
    // Hide non-essential elements
    document.querySelectorAll('.decoration, .animation, .advertisement, [data-decoration]').forEach(el => {
      el.style.display = 'none';
    });
    
    // Simplify layout
    document.querySelectorAll('main, .content, .main-content').forEach(el => {
      el.style.maxWidth = '800px';
      el.style.margin = '0 auto';
      el.style.padding = '0 20px';
    });
    
    // Reduce animations
    document.documentElement.classList.add('reduce-motion');
    
    // Increase contrast
    document.documentElement.classList.add('high-contrast');
    
    // Enhance readability
    document.documentElement.classList.add('enhanced-readability');
  } else {
    // Reset styles
    document.querySelectorAll('.decoration, .animation, .advertisement, [data-decoration]').forEach(el => {
      el.style.display = '';
    });
    
    document.querySelectorAll('main, .content, .main-content').forEach(el => {
      el.style.maxWidth = '';
      el.style.margin = '';
      el.style.padding = '';
    });
    
    // Reset classes
    document.documentElement.classList.remove('reduce-motion');
    document.documentElement.classList.remove('high-contrast');
    document.documentElement.classList.remove('enhanced-readability');
  }
}

/**
 * Initialize mobile features and neurodivergent-friendly UI
 */
export function setupEnhancedMobileExperience() {
  // Initialize core mobile features
  initMobileFeatures();
  
  // Add focus mode toggle button
  addFocusModeToggle();
  
  // Check if user has set a preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.documentElement.classList.add('reduce-motion');
  }
  
  // Check if user has set a preference for color scheme
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDarkMode) {
    document.documentElement.classList.add('dark-theme');
  }
}