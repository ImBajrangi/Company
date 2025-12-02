const CACHE_NAME = 'cloud-kitchen-v4';
const ASSETS_TO_CACHE = [
  './kitchen.html',
  './manifest.json',
  './icon.svg',
  './kitchen.css',
  './pwa-init.js',
  './js/app.js',
  './js/notifications.js',
  './js/utils.js',
  './js/firebase-config.js'
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

// Fetch event: Strategic Caching
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // STRATEGY 1: Cache First for Images (including cross-origin like placehold.co)
  if (event.request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)) {
    event.respondWith(
      caches.open('cloud-kitchen-images-v1').then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;

        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          // Fallback placeholder
          return new Response('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#eee"/></svg>', { headers: { 'Content-Type': 'image/svg+xml' } });
        }
      })
    );
    return;
  }

  // STRATEGY 2: Network First for App Shell (HTML, JS, CSS)
  // We use Network First to ensure the user always gets the latest code updates
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
// Note: This requires a backend server sending push payloads. 
// However, the client-side 'notifications.js' can also trigger notifications locally.
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const payload = event.data.text();
  console.log('[Service Worker] Push Received:', payload);

  const title = 'Cloud Kitchen Update';
  const options = {
    body: payload || 'Check your order status!',
    icon: './icon.svg',
    badge: './icon.svg',
    vibrate: [200, 100, 200],
    data: {
      time: Date.now()
    },
    actions: [
      { action: 'view', title: 'View Order' }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event - Handles "Mobile Direct" interaction
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  if (event.action === 'close') return;

  // This looks for an open window/tab of the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 1. Try to find an existing open tab
      for (const client of clientList) {
        if (client.url.includes('kitchen.html') && 'focus' in client) {
          return client.focus().then((focusedClient) => {
             // 2. Send a message to the app to route to the specific order
             if(event.notification.data && event.notification.data.orderId) {
                 focusedClient.postMessage({
                     action: 'OPEN_ORDER',
                     orderId: event.notification.data.orderId
                 });
             }
             return focusedClient;
          });
        }
      }
      // 3. If no tab is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow('./kitchen.html');
      }
    })
  );
});