/* Workbox-style service worker (runtime caching + precache)
   This is a lightweight, CDN-backed Workbox setup suitable for modern PWAs.
   It precaches core assets and provides runtime caching for images and API calls.
*/
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (self.workbox) {
  const { precaching, routing, strategies, expiration, core } = workbox;

  core.setCacheNameDetails({ prefix: 'go4it-sports', suffix: 'v1' });

  // Precache core assets (keep small and explicit)
  precaching.precacheAndRoute([
    { url: '/', revision: null },
    { url: '/manifest.json', revision: null },
    { url: '/icons/icon-192x192.svg', revision: null },
    { url: '/icons/icon-512x512.svg', revision: null },
    { url: '/og-image.svg', revision: null },
    { url: '/logo.svg', revision: null },
  ]);

  // App shell navigation fallback
  routing.registerNavigationRoute('/index.html', {
    blacklist: [/^\/api\//, /\/_next\//, /\/.+\.[a-zA-Z0-9]+$/],
  });

  // Runtime caching for images - StaleWhileRevalidate
  routing.registerRoute(
    ({ request }) => request.destination === 'image' || /\.(?:png|jpg|jpeg|svg|gif|webp)$/.test(request.url),
    new strategies.StaleWhileRevalidate({
      cacheName: 'images-cache',
      plugins: [new expiration.ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 })],
    }),
  );

  // Runtime caching for API - NetworkFirst with short fallback
  routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new strategies.NetworkFirst({
      cacheName: 'api-cache',
      networkTimeoutSeconds: 3,
      plugins: [new expiration.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 5 })],
    }),
  );

  // Fallback to network for other requests
  routing.setDefaultHandler(new strategies.NetworkFirst());

  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
} else {
  // Workbox failed to load - fallback to minimal cache-first behavior
  self.addEventListener('install', (e) => e.waitUntil(self.skipWaiting()));
  self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
  self.addEventListener('fetch', (event) => {
    event.respondWith(caches.match(event.request).then((r) => r || fetch(event.request)));
  });
}
