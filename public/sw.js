const CACHE_NAME = 'go4it-sports-v1'
const urlsToCache = [
  '/',
  '/dashboard',
  '/academy',
  '/upload',
  '/ai-teachers',
  '/manifest.json'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})

self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: '/icon-192.png',
    badge: '/icon-192.png'
  }
  
  event.waitUntil(
    self.registration.showNotification('Go4It Sports', options)
  )
})