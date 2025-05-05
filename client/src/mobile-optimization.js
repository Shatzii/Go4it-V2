/**
 * Go4It Sports - Mobile Experience Enhancement
 * 
 * This module improves the mobile experience for neurodivergent student-athletes
 * with touch-optimized interfaces, offline capabilities, and performance enhancements.
 */

// Mobile detection and optimization
export const mobileOptimization = {
  /**
   * Initialize mobile optimizations
   */
  init() {
    // Check if this is a mobile device
    const isMobile = this.detectMobile();
    
    // Set data attribute on body for CSS targeting
    document.body.setAttribute('data-device-type', isMobile ? 'mobile' : 'desktop');
    
    // Apply mobile-specific enhancements
    if (isMobile) {
      this.enhanceTouchTargets();
      this.optimizeForLowBandwidth();
      this.improveTextReadability();
      this.setupOfflineSupport();
      this.optimizeAnimations();
    }
    
    // Log detection for analytics
    console.log('Browser compatibility features detected:', {
      webp: this.supportsWebP(),
      grid: this.supportsCSS('grid'),
      flexGap: this.supportsCSS('flex-gap'),
      touchDevice: isMobile,
      passiveEvents: this.supportsPassiveEvents(),
      deviceType: isMobile ? 'mobile' : 'desktop'
    });
    
    // Always register gesture handlers for multi-input support
    this.registerGestureHandlers();
    
    // Register orientation change handler
    window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
    
    // Initialize service worker for offline support
    this.registerServiceWorker();
  },
  
  /**
   * Detect if the user is on a mobile device
   */
  detectMobile() {
    // Check for touch capability as primary indicator
    const hasTouchScreen = (
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0)
    );
    
    // Check user agent as secondary indicator
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent);
    
    // Check screen size as tertiary indicator
    const isSmallScreen = window.innerWidth < 768;
    
    // If at least two indicators match, consider it a mobile device
    const indicators = [hasTouchScreen, isMobileUA, isSmallScreen];
    const mobileScore = indicators.filter(Boolean).length;
    
    return mobileScore >= 2;
  },
  
  /**
   * Enhance touch targets for better usability on mobile
   * Especially important for neurodivergent users with motor control challenges
   */
  enhanceTouchTargets() {
    // Add CSS class for larger touch targets
    document.documentElement.classList.add('enhanced-touch-targets');
    
    // Find all interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, select, [role="button"]');
    
    // Ensure minimum touch target size (44x44px is recommended)
    interactiveElements.forEach(element => {
      // Only apply if not already styled appropriately
      const computedStyle = window.getComputedStyle(element);
      const height = parseInt(computedStyle.height);
      const width = parseInt(computedStyle.width);
      
      if (height < 44) {
        element.style.minHeight = '44px';
      }
      
      if (width < 44) {
        element.style.minWidth = '44px';
      }
      
      // Increase spacing between elements
      element.style.margin = '0.5rem';
    });
    
    // Add touch feedback
    interactiveElements.forEach(element => {
      element.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      }, { passive: true });
      
      element.addEventListener('touchend', function() {
        this.classList.remove('touch-active');
      }, { passive: true });
    });
  },
  
  /**
   * Optimize performance for low bandwidth mobile connections
   */
  optimizeForLowBandwidth() {
    // Check if the user is on a slow connection
    const connection = navigator.connection || navigator.mozConnection || 
                      navigator.webkitConnection || {effectiveType: '4g'};
    
    const isSlowConnection = ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
    
    if (isSlowConnection) {
      // Add data attribute for CSS targeting
      document.body.setAttribute('data-connection', 'slow');
      
      // Disable non-essential animations
      document.body.classList.add('reduce-motion');
      
      // Lazy load non-essential resources
      this.deferNonEssentialResources();
      
      // Reduce image quality
      this.downgradeImageQuality();
    }
    
    // Disable video autoplay on mobile
    document.querySelectorAll('video[autoplay]').forEach(video => {
      video.removeAttribute('autoplay');
      video.setAttribute('preload', 'none');
      
      // Add play button overlay
      const playButton = document.createElement('button');
      playButton.className = 'video-play-button';
      playButton.setAttribute('aria-label', 'Play video');
      playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z"/></svg>';
      
      // Insert after video
      video.parentNode.insertBefore(playButton, video.nextSibling);
      
      // Add click handler
      playButton.addEventListener('click', () => {
        video.play();
        playButton.style.display = 'none';
      });
    });
  },
  
  /**
   * Improve text readability for neurodivergent users on mobile
   */
  improveTextReadability() {
    // Add class for improved readability
    document.documentElement.classList.add('enhanced-readability');
    
    // Find all text content containers
    const textContainers = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td, th, blockquote, figcaption');
    
    textContainers.forEach(container => {
      // Increase line height for better readability
      container.style.lineHeight = '1.5';
      
      // Ensure adequate spacing between paragraphs
      if (container.tagName === 'P') {
        container.style.marginBottom = '1em';
      }
    });
    
    // Increase font size for better readability on mobile
    document.body.style.fontSize = '1rem';
    
    // Adjust contrast for better readability
    document.documentElement.classList.add('high-contrast');
  },
  
  /**
   * Set up offline support for mobile users
   */
  setupOfflineSupport() {
    // Add offline status indicator
    const offlineIndicator = document.createElement('div');
    offlineIndicator.className = 'offline-indicator';
    offlineIndicator.innerHTML = '<span>You are offline</span>';
    document.body.appendChild(offlineIndicator);
    
    // Show/hide based on network status
    window.addEventListener('online', () => {
      offlineIndicator.classList.remove('visible');
      this.syncOfflineData();
    });
    
    window.addEventListener('offline', () => {
      offlineIndicator.classList.add('visible');
    });
    
    // Initially check network status
    if (!navigator.onLine) {
      offlineIndicator.classList.add('visible');
    }
    
    // Setup IndexedDB for offline data storage
    this.initializeOfflineStorage();
  },
  
  /**
   * Initialize IndexedDB for offline storage
   */
  initializeOfflineStorage() {
    // Only initialize if IndexedDB is available
    if (!window.indexedDB) return;
    
    // Open or create the database
    const request = window.indexedDB.open('Go4ItSportsOffline', 1);
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores for offline data
      if (!db.objectStoreNames.contains('cachedPages')) {
        db.createObjectStore('cachedPages', { keyPath: 'url' });
      }
      
      if (!db.objectStoreNames.contains('userActivities')) {
        db.createObjectStore('userActivities', { keyPath: 'id', autoIncrement: true });
      }
    };
    
    request.onsuccess = (event) => {
      // Store database reference for later use
      this.offlineDB = event.target.result;
    };
  },
  
  /**
   * Sync offline data when coming back online
   */
  syncOfflineData() {
    if (!this.offlineDB) return;
    
    const transaction = this.offlineDB.transaction(['userActivities'], 'readonly');
    const store = transaction.objectStore('userActivities');
    const getAllRequest = store.getAll();
    
    getAllRequest.onsuccess = () => {
      const activities = getAllRequest.result;
      
      if (activities.length > 0) {
        // Show sync indicator
        const syncIndicator = document.createElement('div');
        syncIndicator.className = 'sync-indicator';
        syncIndicator.textContent = 'Syncing data...';
        document.body.appendChild(syncIndicator);
        
        // Process each activity
        Promise.all(activities.map(activity => {
          // Send to server
          return fetch(activity.endpoint, {
            method: activity.method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(activity.data)
          })
          .then(response => {
            if (response.ok) {
              // Remove from offline store on success
              const deleteTransaction = this.offlineDB.transaction(['userActivities'], 'readwrite');
              const deleteStore = deleteTransaction.objectStore('userActivities');
              deleteStore.delete(activity.id);
              return true;
            }
            return false;
          })
          .catch(error => {
            console.error('Sync error:', error);
            return false;
          });
        }))
        .then(results => {
          // Update sync indicator
          const successCount = results.filter(Boolean).length;
          syncIndicator.textContent = `Synced ${successCount} of ${activities.length} items`;
          
          // Remove indicator after delay
          setTimeout(() => {
            syncIndicator.remove();
          }, 3000);
        });
      }
    };
  },
  
  /**
   * Register service worker for offline capabilities
   */
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registration successful');
          })
          .catch(error => {
            console.log('ServiceWorker registration failed:', error);
          });
      });
    }
  },
  
  /**
   * Optimize animations for mobile devices
   * Particularly important for users with ADHD to reduce distractions
   */
  optimizeAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      document.body.classList.add('reduce-motion');
    }
    
    // Find all animations
    const animatedElements = document.querySelectorAll('.animated, [data-animation]');
    
    animatedElements.forEach(element => {
      // Simplify animations on mobile
      element.style.animationDuration = '0.5s';
      
      // Only play animations when in viewport
      this.enableIntersectionBasedAnimation(element);
    });
    
    // Adjust transition speeds
    document.querySelectorAll('[style*="transition"]').forEach(element => {
      const style = window.getComputedStyle(element);
      const transitionDuration = parseFloat(style.transitionDuration);
      
      if (transitionDuration > 0.3) {
        element.style.transitionDuration = '0.3s';
      }
    });
  },
  
  /**
   * Only play animations when element is in viewport
   */
  enableIntersectionBasedAnimation(element) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            element.classList.add('in-viewport');
            observer.unobserve(element);
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(element);
    } else {
      // Fallback for browsers without IntersectionObserver
      element.classList.add('in-viewport');
    }
  },
  
  /**
   * Defer loading of non-essential resources
   */
  deferNonEssentialResources() {
    // Find all non-essential images and videos
    const nonEssentialMedia = document.querySelectorAll('img:not([data-essential]), video:not([data-essential])');
    
    nonEssentialMedia.forEach(media => {
      if (media.tagName === 'IMG') {
        // Replace with placeholder and lazy load
        const src = media.getAttribute('src');
        
        if (src) {
          media.setAttribute('data-src', src);
          media.setAttribute('src', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E');
          media.classList.add('lazy-load');
        }
      } else if (media.tagName === 'VIDEO') {
        // Disable autoplay and lazy load
        media.setAttribute('preload', 'none');
        media.removeAttribute('autoplay');
      }
    });
    
    // Set up intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
      const lazyImageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.remove('lazy-load');
            lazyImageObserver.unobserve(lazyImage);
          }
        });
      });
      
      document.querySelectorAll('.lazy-load').forEach(lazyImage => {
        lazyImageObserver.observe(lazyImage);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      document.querySelectorAll('.lazy-load').forEach(lazyImage => {
        lazyImage.src = lazyImage.dataset.src;
        lazyImage.classList.remove('lazy-load');
      });
    }
  },
  
  /**
   * Reduce image quality for slow connections
   */
  downgradeImageQuality() {
    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      
      if (src && src.includes('?')) {
        // Add quality parameter to URL
        img.setAttribute('src', `${src}&q=60`);
      } else if (src && !src.startsWith('data:')) {
        // Add quality parameter to URL
        img.setAttribute('src', `${src}?q=60`);
      }
    });
  },
  
  /**
   * Register gesture handlers for mobile interactions
   * Especially important for neurodivergent users who may prefer gesture interaction
   */
  registerGestureHandlers() {
    // Add swipe functionality
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(event) {
      touchStartX = event.changedTouches[0].screenX;
      touchStartY = event.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(event) {
      touchEndX = event.changedTouches[0].screenX;
      touchEndY = event.changedTouches[0].screenY;
      handleGesture();
    }, { passive: true });
    
    // Detect and handle gestures
    function handleGesture() {
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      
      // Threshold for recognizing a swipe (in pixels)
      const threshold = 100;
      
      // Check if horizontal or vertical swipe is larger
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) < threshold) return;
        
        if (deltaX > 0) {
          // Swipe right - previous page
          const event = new CustomEvent('swiperight', { detail: { deltaX } });
          document.dispatchEvent(event);
        } else {
          // Swipe left - next page
          const event = new CustomEvent('swipeleft', { detail: { deltaX } });
          document.dispatchEvent(event);
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) < threshold) return;
        
        if (deltaY > 0) {
          // Swipe down - refresh or close modal
          const event = new CustomEvent('swipedown', { detail: { deltaY } });
          document.dispatchEvent(event);
        } else {
          // Swipe up - open menu or scroll to top
          const event = new CustomEvent('swipeup', { detail: { deltaY } });
          document.dispatchEvent(event);
        }
      }
    }
  },
  
  /**
   * Handle device orientation changes
   */
  handleOrientationChange() {
    // Add class to body indicating orientation
    if (window.orientation === 90 || window.orientation === -90) {
      document.body.classList.add('landscape');
      document.body.classList.remove('portrait');
    } else {
      document.body.classList.add('portrait');
      document.body.classList.remove('landscape');
    }
    
    // Recalculate layout
    document.dispatchEvent(new CustomEvent('orientationchange'));
  },
  
  /**
   * Check if the browser supports feature detection
   */
  supportsCSS(property) {
    return property in document.documentElement.style;
  },
  
  /**
   * Check if browser supports WebP format
   */
  supportsWebP() {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      // Check if toDataURL('image/webp') returns a WebP string
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  },
  
  /**
   * Check if browser supports passive event listeners
   */
  supportsPassiveEvents() {
    let supportsPassive = false;
    try {
      // Test for passive event support
      const options = Object.defineProperty({}, 'passive', {
        get: function() {
          supportsPassive = true;
          return true;
        }
      });
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch (e) {
      // Passive events not supported
    }
    return supportsPassive;
  }
};

/**
 * Create and register the service worker for offline functionality
 */
export function createServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  
  const swContent = `
  // Go4It Sports Service Worker for offline support
  const CACHE_NAME = 'go4it-sports-cache-v1';
  
  // Resources to pre-cache
  const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/offline.html',
    '/assets/styles/main.css',
    '/assets/js/main.js',
    '/assets/fonts/Inter-Regular.woff2',
    '/assets/fonts/Inter-Bold.woff2',
    '/assets/images/logo.svg',
    '/assets/images/offline-placeholder.svg'
  ];
  
  // Install event - precache assets
  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => cache.addAll(PRECACHE_URLS))
        .then(() => self.skipWaiting())
    );
  });
  
  // Activate event - clean up old caches
  self.addEventListener('activate', event => {
    const currentCaches = [CACHE_NAME];
    
    event.waitUntil(
      caches.keys()
        .then(cacheNames => {
          return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        })
        .then(cachesToDelete => {
          return Promise.all(cachesToDelete.map(cacheToDelete => {
            return caches.delete(cacheToDelete);
          }));
        })
        .then(() => self.clients.claim())
    );
  });
  
  // Fetch event - serve from cache, update cache from network
  self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
      return;
    }
    
    // For API requests, use network first, with cache as fallback
    if (event.request.url.includes('/api/')) {
      event.respondWith(
        fetch(event.request)
          .then(response => {
            // Cache successful API responses for offline use
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // If network request fails, try to serve from cache
            return caches.match(event.request)
              .then(cachedResponse => {
                if (cachedResponse) {
                  return cachedResponse;
                }
                // If no cached version, return offline JSON
                if (event.request.headers.get('accept').includes('application/json')) {
                  return new Response(JSON.stringify({ 
                    error: 'You are offline',
                    offline: true,
                    timestamp: new Date().toISOString()
                  }), {
                    headers: { 'Content-Type': 'application/json' }
                  });
                }
              });
          })
      );
      return;
    }
    
    // For page navigations, use cache first with network update
    if (event.request.mode === 'navigate') {
      event.respondWith(
        caches.match('/index.html')
          .then(cachedResponse => {
            const networkFetch = fetch(event.request)
              .then(response => {
                // Update the cache
                if (response.ok) {
                  caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, response.clone());
                  });
                }
                return response;
              })
              .catch(error => {
                if (cachedResponse) {
                  return cachedResponse;
                }
                return caches.match('/offline.html');
              });
            
            // Return cached response immediately, then update cache from network
            return cachedResponse || networkFetch;
          })
      );
      return;
    }
    
    // For other requests (assets), use cache first strategy
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // Update cache in background
            fetch(event.request).then(response => {
              if (response.ok) {
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, response);
                });
              }
            }).catch(() => {/* Ignore */});
            
            return cachedResponse;
          }
          
          // Not in cache, get from network
          return fetch(event.request)
            .then(response => {
              // Cache the response
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, responseClone);
                });
              }
              return response;
            })
            .catch(error => {
              // For image requests, return fallback image
              if (event.request.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
                return caches.match('/assets/images/offline-placeholder.svg');
              }
              
              throw error;
            });
        })
    );
  });
  
  // Background sync for offline actions
  self.addEventListener('sync', event => {
    if (event.tag === 'sync-offline-actions') {
      event.waitUntil(syncOfflineActions());
    }
  });
  
  // Push notification handler
  self.addEventListener('push', event => {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/assets/images/logo.png',
      badge: '/assets/images/badge.png',
      data: {
        url: data.url
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  
  // Notification click handler
  self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.notification.data && event.notification.data.url) {
      clients.openWindow(event.notification.data.url);
    }
  });
  
  // Sync offline actions with server
  async function syncOfflineActions() {
    // Implementation here would connect to IndexedDB
    // and sync offline data when back online
  }
  `;
  
  const fs = require('fs');
  
  // Create the service worker file
  fs.writeFileSync('public/service-worker.js', swContent);
  
  // Create offline fallback page
  const offlineHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Go4It Sports - Offline</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        background-color: #121212;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
        padding: 20px;
        text-align: center;
      }
      .offline-icon {
        width: 80px;
        height: 80px;
        margin-bottom: 20px;
      }
      h1 {
        margin-bottom: 10px;
        font-size: 24px;
      }
      p {
        margin-bottom: 30px;
        font-size: 16px;
        opacity: 0.8;
      }
      .btn {
        background: #0070f3;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        transition: background 0.2s;
      }
      .btn:hover {
        background: #0051b3;
      }
      .cached-content {
        margin-top: 40px;
        width: 100%;
        max-width: 500px;
      }
      .cached-item {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 10px;
      }
    </style>
  </head>
  <body>
    <svg class="offline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 1l22 22M16.72 16.72A5 5 0 0 1 9.27 9.27m5.66 5.66A7.92 7.92 0 0 0 12 14a7.92 7.92 0 0 0-3.28.68"></path>
      <path d="M5 12.55a11 11 0 0 1 14.08-1.54"></path>
      <path d="M8.53 16.11a6 6 0 0 1 6.95-6.95"></path>
      <circle cx="12" cy="12" r="1"></circle>
    </svg>
    <h1>You're currently offline</h1>
    <p>Please check your internet connection and try again.</p>
    <button class="btn" onclick="window.location.reload()">Try Again</button>
    
    <div class="cached-content" id="cachedContent"></div>
    
    <script>
      // Display cached content if available
      if ('caches' in window) {
        caches.open('go4it-sports-cache-v1').then(cache => {
          cache.keys().then(keys => {
            const cachedContentEl = document.getElementById('cachedContent');
            
            if (keys.length > 0) {
              const heading = document.createElement('h2');
              heading.textContent = 'Available offline content:';
              cachedContentEl.appendChild(heading);
              
              // Display up to 5 cached pages
              const pageKeys = keys.filter(key => 
                key.url.endsWith('.html') || 
                key.url.endsWith('/') || 
                !key.url.includes('.')
              ).slice(0, 5);
              
              pageKeys.forEach(key => {
                const item = document.createElement('div');
                item.className = 'cached-item';
                
                const link = document.createElement('a');
                link.href = key.url;
                link.textContent = key.url.split('/').pop() || 'Home';
                
                item.appendChild(link);
                cachedContentEl.appendChild(item);
              });
            }
          });
        });
      }
    </script>
  </body>
  </html>
  `;
  
  // Create the offline page
  fs.writeFileSync('public/offline.html', offlineHtml);
  
  return {
    serviceWorkerPath: '/service-worker.js',
    offlinePagePath: '/offline.html'
  };
}

/**
 * Initialize the mobile optimizations
 */
export function initMobileExperience() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      mobileOptimization.init();
    });
  } else {
    mobileOptimization.init();
  }

  // Register service worker
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
}