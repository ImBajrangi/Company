/**
 * PWA Initialization Script
 * Handles early capture of the PWA install prompt and other initial setup.
 */

console.log("🚀 APP VERSION: 2.2 (Error Fixes Applied)");

// Capture the install prompt early, before the main module loads
window.deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    window.deferredPrompt = e;
    console.log("✅ 'beforeinstallprompt' fired early and captured.");

    // Dispatch a custom event to notify the main script if it's already listening
    window.dispatchEvent(new CustomEvent('deferred-prompt-ready'));
});
