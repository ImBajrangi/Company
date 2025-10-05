// Service Worker for Vrindopnishad Admin Panel
const CACHE_NAME = 'vrindopnishad-admin-v1';

// Files to cache
const CACHE_ASSETS = [
  './',
  './admin.html',
  './admin.js',
  './admin.css',
  './admin-backend-connector.js',
  './default-admin.js',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/books.png',
  './icons/collections.png',
  './icons/default-gallery.png',
  './icons/default-books.png',
  './icons/default-collections.png',
  './icons/default-pdfs.png',
  './icons/default-users.png'
];

// Install event - cache assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  
  // Skip waiting to ensure the new service worker activates immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching assets');
        return cache.addAll(CACHE_ASSETS);
      })
      .catch(error => {
        console.error('[Service Worker] Cache failure:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  
  // Claim clients to ensure the service worker controls all clients immediately
  event.waitUntil(self.clients.claim());
  
  // Clean up old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip API requests
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if available
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response as it can only be consumed once
            const responseToCache = response.clone();
            
            // Cache the new resource
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            console.error('[Service Worker] Fetch error:', error);
            
            // For HTML requests, return the offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('./admin.html');
            }
            
            // Otherwise just propagate the error
            throw error;
          });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

// Function to sync stored form data
async function syncForms() {
  try {
    // Get stored form submissions from IndexedDB or localStorage
    const storedForms = JSON.parse(localStorage.getItem('pendingForms')) || [];
    
    if (storedForms.length === 0) {
      return;
    }
    
    // Process each stored form
    const successfulSubmissions = [];
    
    for (const formData of storedForms) {
      try {
        // Attempt to submit the form
        const response = await fetch(formData.url, {
          method: formData.method,
          headers: formData.headers,
          body: formData.body
        });
        
        if (response.ok) {
          successfulSubmissions.push(formData.id);
        }
      } catch (error) {
        console.error('[Service Worker] Sync error for form:', formData.id, error);
      }
    }
    
    // Remove successful submissions from storage
    if (successfulSubmissions.length > 0) {
      const remainingForms = storedForms.filter(form => 
        !successfulSubmissions.includes(form.id)
      );
      
      localStorage.setItem('pendingForms', JSON.stringify(remainingForms));
      
      // Notify clients about successful sync
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETED',
          successCount: successfulSubmissions.length
        });
      });
    }
  } catch (error) {
    console.error('[Service Worker] Sync error:', error);
  }
} 