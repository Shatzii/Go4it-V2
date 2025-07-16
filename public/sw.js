// Go4It Sports Platform Service Worker
// Provides offline functionality and handles file sharing

const CACHE_NAME = 'go4it-sports-v1'
const urlsToCache = [
  '/',
  '/dashboard',
  '/upload-mobile',
  '/upload-guide',
  '/pricing',
  '/auth',
  '/academy',
  '/ai-coach',
  '/manifest.json'
]

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
  )
})

// Share target handler
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SHARE_TARGET') {
    // Handle shared files
    const { files } = event.data
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        if (clients.length > 0) {
          clients[0].postMessage({
            type: 'SHARED_FILES',
            files: files
          })
        }
      })
    )
  }
})

// Background sync for offline uploads
self.addEventListener('sync', event => {
  if (event.tag === 'upload-sync') {
    event.waitUntil(
      syncUploads()
    )
  }
})

// Sync offline uploads when connection is restored
async function syncUploads() {
  const uploads = await getOfflineUploads()
  for (const upload of uploads) {
    try {
      await uploadFile(upload)
      await removeOfflineUpload(upload.id)
    } catch (error) {
      console.error('Sync upload failed:', error)
    }
  }
}

// Push notification handler
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json()
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        actions: [
          {
            action: 'view',
            title: 'View',
            icon: '/icons/view-icon.png'
          },
          {
            action: 'dismiss',
            title: 'Dismiss',
            icon: '/icons/dismiss-icon.png'
          }
        ]
      })
    )
  }
})

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close()
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    )
  }
})

// Helper functions
async function getOfflineUploads() {
  // Get uploads from IndexedDB
  return []
}

async function uploadFile(upload) {
  // Upload file to server
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: upload.formData
  })
  return response.json()
}

async function removeOfflineUpload(id) {
  // Remove from IndexedDB
  return true
}