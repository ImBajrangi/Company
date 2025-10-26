// --- Central Link & Path Management ---
// Define all project-wide links in this one file.
// The 'link-handler.js' script will use this object
// to find and apply links to any <a data-link="..."> tag.

const PROJECT_PATHS = {
  // --- Internal Page Links ---
  // (Links from your main navigation)
  'home': 'https://imbajrangi.github.io/Company/',
  'about': 'https://imbajrangi.github.io/Company/Vrindopnishad Web/about code/main/about.html',
  'gallery': 'https://imbajrangi.github.io/Company/Vrindopnishad Web/Pictures/main/Gallery.html',
  'pictures': 'https://imbajrangi.github.io/Company/Vrindopnishad Web/Pictures/main/pictures.html',
  'pdf-viewer': 'https://imbajrangi.github.io/Company/Vrindopnishad Web/pdf/main/pdf-viewer.html',
  'book': 'https://imbajrangi.github.io/Company/Vrindopnishad Web/sketch/main/new-read-me.html',
  'articles': 'https://imbajrangi.github.io/Company/Vrindopnishad Web/sketch/main/nw-read-me.html', // (aka web-content-manager)

  // --- Tool Links (from home.html tools menu) ---
  'stack': 'https://imbajrangi.github.io/Company/Vrindopnishad Web/Pictures/main/Gallery.html', // This was 'stack' in your HTML
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

  // --- Social Media Links (add your URLs here) ---
  'instagram': 'https://www.instagram.com/your-username/',
  'facebook': 'https://www.facebook.com/your-page/',
  'youtube': 'https://www.youtube.com/your-channel/',
  'whatsapp_channel': 'https://whatsapp.com/channel/your-channel-id',
  'pinterest': 'https://www.pinterest.com/your-username/'
};
