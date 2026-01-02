// --- Unified Link Manager ---
// This file defines all project paths (PROJECT_PATHS) and contains the logic
// to automatically apply those links to any element with a 'data-link' attribute.

const PROJECT_PATHS = {
  // --- Internal Page Links ---
  'home': '/',
  'about': '/Vrindopnishad Web/about code/main/about.html',
  'gallery': '/Vrindopnishad Web/Pictures/main/Gallery.html',
  'pictures': '/Vrindopnishad Web/Pictures/main/pictures.html',
  'pdf': '/Vrindopnishad Web/pdf/main/pdf-viewer.html',
  'book': 'https://imbajrangi.github.io/Company/Vrindopnishad Web/sketch/main/new-read-me.html',
  'articles': 'https://imbajrangi.github.io/Company/Vrindopnishad Web/sketch/main/nw-read-me.html', // (aka web-content-manager)
  'stack': '/Vrindopnishad Web/Pictures/main/Gallery.html', // (aka web-content-manager)

  // --- Tool Links ---
  'login-page': 'https://imbajrangi.github.io/Company/Projects/LoginPage/loginew.html',
  'cloud-kitchen': 'https://imbajrangi.github.io/Company/Projects/Cloud-Kitchen/modern-kitchen(payment).html',
  'vrinda-foods': 'https://imbajrangi.github.io/Company/Projects/Cloud-Kitchen/kitchen(developer).html',
  'kitchen-picture': 'https://imbajrangi.github.io/Company/Projects/Cloud-Kitchen/kitchen(withPicture).html',
  'kitchen-staff': 'https://imbajrangi.github.io/Company/Projects/Cloud-Kitchen/kitchen(staff-no-error).html',
  'kitchen-old': 'https://imbajrangi.github.io/Company/Projects/Cloud-Kitchen/kitchen.html',
  'kitchen-modern': 'https://imbajrangi.github.io/Company/Projects/Cloud-Kitchen/modern-kitchen.html',
  'dark-reader': 'https://imbajrangi.github.io/Company/Vrindopnishad Web/श्री_हरिवंश.html',
  'tourism-map': 'https://imbajrangi.github.io/Company/Projects/Brij Yatra/map.html',
  'chat-animated': 'https://imbajrangi.github.io/Company/Projects/chat/animated-chatbot.html',
  'chat-embedded': 'https://imbajrangi.github.io/Company/Projects/chat/chatbot-embedded.html',
  'trials-brij-1': 'https://imbajrangi.github.io/Company/Projects/Trials/rejected/brij-pilgrimage-web/index.html',
  'trials-brij-2': 'https://imbajrangi.github.io/Company/Projects/Trials/rejected/brij-tourism-site/index.html',
  'trials-hotel': 'https://imbajrangi.github.io/Company/Projects/Trials/Hotels Booking/index.html',
  'trials-tours': 'https://imbajrangi.github.io/Company/Projects/Trials/tours.html',
  'video-player': 'https://imbajrangi.github.io/Company/Projects/Video/video-player.html',
  'zen-search': 'https://imbajrangi.github.io/Company/Projects/Video/zen-mode.html',
  'service-chat': 'https://imbajrangi.github.io/Company/Projects/Vrinda Chat/vrinda chat.html',
  'web-dev': 'https://imbajrangi.github.io/Company/Projects/Web dev/vrinda web dev.html',

  // --- Social Media Links ---
  'instagram': 'https://www.instagram.com/vrindopnishad/',
  'facebook': 'https://www.facebook.com/vrindopnishad/',
  'youtube': 'https://www.youtube.com/@vrindopnishad/',
  'whatsapp_channel': 'https://whatsapp.com/channel/0029Vb6UR3Z9mrGcDXbHzA1Q',
  'pinterest': 'https://www.pinterest.com/vrindopnishad/'
};

// --- Link Application Logic ---
document.addEventListener('DOMContentLoaded', () => {
  const linkElements = document.querySelectorAll('[data-link]');

  console.log(`link-manager.js: Found ${linkElements.length} elements with [data-link].`);

  linkElements.forEach(element => {
    const linkKey = element.getAttribute('data-link');
    const destinationUrl = PROJECT_PATHS[linkKey];

    if (destinationUrl) {
      if (element.tagName === 'A') {
        element.href = destinationUrl;

        // Handle target="_blank" for external links outside the GitHub domain
        if (destinationUrl.startsWith('http://') || destinationUrl.startsWith('https://')) {
          if (!destinationUrl.includes('imbajrangi.github.io/Company/')) {
            element.target = '_blank';
            element.rel = 'noopener noreferrer';
          }
        }
      } else {
        // Handle navigation for non-anchor tags (like buttons or divs)
        element.addEventListener('click', () => {
          if (destinationUrl.startsWith('http://') || destinationUrl.startsWith('https://')) {
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