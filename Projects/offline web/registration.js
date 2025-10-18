// This script registers the service worker.
// It's best to place this in its own file and link to it from your HTML.

if ('serviceWorker' in navigator) {
  // Wait for the page to load before registering the service worker.
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('Service Worker registered successfully with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker registration failed: ', error);
      });
  });
} else {
    console.log('Service Worker is not supported by this browser.');
}
