// Go4It Sports Service Worker
const CACHE_NAME = 'go4it-cache-v1';
const OFFLINE_URL = '/offline.html';
const OFFLINE_IMAGE = '/assets/images/offline-placeholder.svg';
const OFFLINE_CSS = '/assets/styles/offline.css';

// Assets to cache immediately on service worker install
const CACHE_ASSETS = [
  OFFLINE_URL,
  OFFLINE_IMAGE,
  OFFLINE_CSS,
  '/manifest.json',
  '/assets/images/logo.svg',
  // Add other essential assets here
];

// Service worker installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service worker caching assets');
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Service worker activation and cache cleanup
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('Service worker removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
    .then(() => self.clients.claim())
  );
});

// Network-first strategy with fallback to cache
async function networkFirstWithFallback(request) {
  try {
    // Try to fetch from network first
    const networkResponse = await fetch(request);
    
    // If successful, clone and cache the response
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      caches.open(CACHE_NAME).then(cache => {
        // Only cache successful responses from same origin or specific CDNs
        if (request.url.startsWith(self.location.origin) || 
            request.url.includes('unpkg.com') || 
            request.url.includes('images.unsplash.com')) {
          cache.put(request, responseToCache);
        }
      });
    }
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('Network request failed, trying cache', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If it's a navigation request (HTML page), return offline page
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }
    
    // If it's an image, return offline image
    if (request.destination === 'image') {
      return caches.match(OFFLINE_IMAGE);
    }
    
    // For other resources, return a simple error response
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Handle fetch events using network-first strategy with fallback
self.addEventListener('fetch', (event) => {
  // Skip cross-origin POST requests and browser extension requests
  if (event.request.method !== 'GET' || 
      event.request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  event.respondWith(networkFirstWithFallback(event.request));
});

// Handle offline form submission
async function syncOfflineActions() {
  const offlineActions = await localforage.getItem('offlineActions');
  
  if (offlineActions && offlineActions.length > 0) {
    for (const action of offlineActions) {
      try {
        await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body
        });
      } catch (error) {
        console.error('Failed to sync offline action:', error);
        return false;
      }
    }
    
    // Clear synced actions
    await localforage.setItem('offlineActions', []);
    return true;
  }
  
  return true;
}

// Sync event for when the device comes back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-actions') {
    event.waitUntil(syncOfflineActions());
  }
});

// Push notification support
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/assets/images/logo.svg',
    badge: '/assets/images/logo.svg',
    vibrate: [100, 50, 100],
    data: data.data
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Log service worker startup
console.log('Go4It Sports Service Worker Initialized');