// --- Unified Link Manager ---
// This file defines all project paths (PROJECT_PATHS) and contains the logic
// to automatically apply those links to any element with a 'data-link' attribute.

const PROJECT_PATHS = {
  // --- Internal Page Links ---
  'home': 'index.html',
  'about': 'Vrindopnishad Web/about code/main/about.html',
  'gallery': 'Vrindopnishad Web/Pictures/main/Gallery.html',
  'pictures': 'Vrindopnishad Web/Pictures/main/photos.html',
  'pdf': 'Vrindopnishad Web/pdf/main/pdf-viewer.html',
  'book': 'Vrindopnishad Web/sketch/main/new-read-me.html',
  'articles': 'Vrindopnishad Web/sketch/main/new-read-me.html',
  'stack': 'Vrindopnishad Web/Pictures/main/Gallery.html',

  // --- Tool Links ---
  'login-page': 'Projects/LoginPage/loginew.html',
  'cloud-kitchen': 'Projects/Cloud-Kitchen/kitchen.html',
  'vrinda-foods': 'Projects/Cloud-Kitchen/kitchen.html',
  'kitchen-picture': 'Projects/Cloud-Kitchen/kitchen.html',
  'kitchen-staff': 'Projects/Cloud-Kitchen/kitchen.html',
  'kitchen-old': 'Projects/Cloud-Kitchen/kitchen.html',
  'kitchen-modern': 'Projects/Cloud-Kitchen/kitchen.html',
  'dark-reader': 'Vrindopnishad Web/श्री_हरिवंश.html',
  'tourism-map': 'Projects/Vrinda-Tours/vrinda-tours.html',
  'chat-animated': 'Projects/Vrinda Chat/vrindaChat.html',
  'chat-embedded': 'Projects/Vrinda Chat/vrindaChat.html',
  'trials-brij-1': 'Projects/Trials/rejected/brij-pilgrimage-web/index.html',
  'trials-brij-2': 'Projects/Trials/rejected/brij-tourism-site/index.html',
  'trials-hotel': 'Projects/Trials/Hotels Booking/index.html',
  'trials-tours': 'Projects/Trials/tours.html',
  'video-player': 'Projects/Video/video-player.html',
  'zen-search': 'Projects/Video/zen-mode.html',
  'service-chat': 'Projects/Vrinda Chat/vrindaChat.html',
  'web-dev': 'Projects/Web dev/vrinda web dev.html',

  // --- Social Media Links ---
  'instagram': 'https://www.instagram.com/vrindopnishad/',
  'facebook': 'https://www.facebook.com/vrindopnishad/',
  'youtube': 'https://www.youtube.com/@vrindopnishad/',
  'whatsapp_channel': 'https://whatsapp.com/channel/0029Vb6UR3Z9mrGcDXbHzA1Q',
  'pinterest': 'https://www.pinterest.com/vrindopnishad/'
};

// --- Link Application Logic ---
document.addEventListener('DOMContentLoaded', () => {
  // Calculate relative path to root based on current file location
  const getRootPath = () => {
    const path = window.location.pathname;
    // For local file testing (file:///...)
    if (window.location.protocol === 'file:') {
      const companyIndex = path.indexOf('/Company/');
      if (companyIndex !== -1) {
        const afterCompany = path.substring(companyIndex + 9);
        const depth = (afterCompany.match(/\//g) || []).length;
        return '../'.repeat(depth);
      }
    }
    // For GitHub Pages (or any web server where Company is the root or a subfolder)
    // We assume the script is in a known location or we can use the depth of the current page
    // relative to where we expect 'index.html' to be.
    // A simpler way: count slashes in path relative to a known marker or just use depth.
    // If hosted at https://user.github.io/Company/, index.html is at /Company/
    const depth = (path.split('/').filter(p => p).length) - (path.includes('/Company/') ? (path.indexOf('/Company/') === 0 ? 1 : 2) : 0);
    // This is getting complex. Let's use a simpler heuristic: 
    // find index.html by going up until we find it or reach a limit? 
    // No, let's just use the fact that PROJECT_PATHS are relative to root.

    // Most reliable way: calculate depth from the current script's location or just hardcode the depth 
    // in the HTML if needed, but we want it automatic.

    // Revised depth calculation:
    const segments = window.location.pathname.split('/').filter(s => s);
    let rootDepth = 0;
    const companyIdx = segments.indexOf('Company');
    if (companyIdx !== -1) {
      rootDepth = segments.length - companyIdx - 1;
    }
    return '../'.repeat(rootDepth);
  };

  const rootPath = getRootPath();
  const linkElements = document.querySelectorAll('[data-link]');

  console.log(`link-manager.js: Root path depth: ${rootPath}. Found ${linkElements.length} elements with [data-link].`);

  linkElements.forEach(element => {
    const linkKey = element.getAttribute('data-link');
    let destinationUrl = PROJECT_PATHS[linkKey];

    if (destinationUrl) {
      // Prepend root path if it's an internal link (doesn't start with http)
      if (!destinationUrl.startsWith('http')) {
        destinationUrl = rootPath + destinationUrl;
      }

      if (element.tagName === 'A') {
        element.href = destinationUrl;

        // Handle target="_blank" for external links
        if (destinationUrl.startsWith('http')) {
          if (!destinationUrl.includes('imbajrangi.github.io/Company/')) {
            element.target = '_blank';
            element.rel = 'noopener noreferrer';
          }
        }
      } else {
        // Handle navigation for non-anchor tags
        element.addEventListener('click', () => {
          if (destinationUrl.startsWith('http')) {
            if (!destinationUrl.includes('imbajrangi.github.io/Company/')) {
              window.open(destinationUrl, '_blank');
              return;
            }
          }
          window.location.href = destinationUrl;
        });
      }
    } else {
      console.warn(`link-manager.js: No path found for data-link key: "${linkKey}"`);
    }
  });
});