const CACHE_NAME = 'cloud-kitchen-v3';
const ASSETS_TO_CACHE = [
  './kitchen.html',
  './kitchen.css',
  './pwa-init.js',
  './js/app.js',
  './js/utils.js',
  './js/firebase-config.js',
  './manifest.json',
  './icon.svg'
];

// Install event: Cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Fetch event: Network first, then cache
// Fetch event: Strategic Caching
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // STRATEGY 1: Cache First for Images (including cross-origin like placehold.co)
  // This ensures images are downloaded once and served from cache forever
  if (event.request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)) {
    event.respondWith(
      caches.open('cloud-kitchen-images-v1').then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse; // Return cached image immediately
        }

        try {
          const networkResponse = await fetch(event.request);
          // Cache the new image for next time
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          console.log('[Service Worker] Image fetch failed', error);
          // Optional: Return a fallback placeholder if offline
          return new Response('<svg>...</svg>', { headers: { 'Content-Type': 'image/svg+xml' } });
        }
      })
    );
    return;
  }

  // STRATEGY 2: Network First for App Shell (HTML, JS, CSS)
  // Only for same-origin requests to avoid CORS issues with APIs
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});

// Push event: Handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Cloud Kitchen Update';
  const options = {
    body: event.data.text() || 'Your order status has changed!',
    icon: './icon.svg',
    badge: './icon.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      { action: 'explore', title: 'View Order', icon: './icon.svg' },
      { action: 'close', title: 'Close', icon: './icon.svg' },
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    clients.openWindow('./kitchen.html')
  );
});
