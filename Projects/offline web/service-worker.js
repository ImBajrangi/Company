// A name for our cache. Change this when you update the service worker.
const CACHE_NAME = 'offline-assets-v2';

// A list of files to cache to create a basic offline experience.
const ASSETS_TO_CACHE = [
  '/', // The root of the site (often serves index.html)
  'example page.html',
  'offline-page.html',
  'registration.js'
  // You can add paths to your CSS files, images, or other assets here
];

// On install, cache the essential assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install event in progress.');
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      // addAll() fetches and caches all the specified resources.
      await cache.addAll(ASSETS_TO_CACHE);
      console.log('Assets cached successfully.');
    } catch (error) {
      console.error('Failed to cache assets during install:', error);
    }
  })());
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

// On activate, clean up old caches to save space and avoid conflicts.
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate event in progress.');
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => {
        // If the cache name is not our current one, we delete it.
        if (cacheName !== CACHE_NAME) {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        }
      })
    );
    // Tell the active service worker to take control of the page immediately.
    await self.clients.claim();
  })());
});

// On fetch, intercept network requests
self.addEventListener('fetch', (event) => {
  // We only want to handle navigation requests (i.e., for HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        // First, try to use the network to fulfill the request.
        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
        // If the network fails, the user is offline.
        console.log('Fetch failed; returning a cached page or offline page.', error);

        const cache = await caches.open(CACHE_NAME);
        
        // 1. Try to serve the requested page from the cache first.
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // 2. If the specific page isn't in the cache, serve the generic offline page.
        const offlinePageResponse = await cache.match('offline.html');
        return offlinePageResponse;
      }
    })());
  }
  // For non-navigation requests (like images, styles), you can add other caching strategies.
  // For now, we'll let them pass through, and they will fail if the user is offline.
});