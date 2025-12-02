const CACHE_NAME = 'cloud-kitchen-v5';
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

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
    })))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)) {
    event.respondWith(
      caches.open('cloud-kitchen-images-v1').then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        try {
            const netRes = await fetch(event.request);
            cache.put(event.request, netRes.clone());
            return netRes;
        } catch (e) { return new Response('<svg...></svg>', { headers: { 'Content-Type': 'image/svg+xml' } }); }
      })
    );
  } else if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request).then(res => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
          return res;
      }).catch(() => caches.match(event.request))
    );
  }
});

self.addEventListener('push', (event) => {
  if (!event.data) return;
  const payload = event.data.text();
  const options = {
    body: payload,
    icon: './icon.svg',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    data: { time: Date.now() }
  };
  event.waitUntil(self.registration.showNotification('Cloud Kitchen', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'close') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 1. Focus existing tab
      for (const client of clientList) {
        if (client.url.includes('kitchen.html') && 'focus' in client) {
          return client.focus().then((focusedClient) => {
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
      // 2. Open new window if none exists
      if (clients.openWindow) return clients.openWindow('./kitchen.html');
    })
  );
});