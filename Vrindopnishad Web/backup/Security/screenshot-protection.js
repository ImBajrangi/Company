/**
 * screenshot-protection.js - Prevent Screenshots and Screen Recording
 * 
 * This script attempts to prevent or detect screenshots and screen recordings
 * using various techniques, though perfect prevention is technically not possible.
 */

// Main initialization function
document.addEventListener('DOMContentLoaded', function() {
  initScreenshotProtection();
});

/**
 * Main function to initialize screenshot protection
 */
function initScreenshotProtection() {
  // Apply all protection mechanisms
  disablePrintScreen();
  detectClipboardCopies();
  detectVisibilityChanges();
  addBlurOnInactive();
  addWatermark();
  applyContentBlurring();
}

/**
 * Try to disable the Print Screen key and Snipping Tool shortcuts
 */
function disablePrintScreen() {
  document.addEventListener('keydown', function(e) {
    // PrintScreen key detection
    if (e.key === 'PrintScreen' || e.keyCode === 44) {
      e.preventDefault();
      showProtectionMessage('Screenshots are not allowed on this page');
      return false;
    }
    
    // Detect Windows Snipping Tool shortcuts (Win+Shift+S)
    if (e.shiftKey && e.key === 'S' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      showProtectionMessage('Screenshots are not allowed on this page');
      return false;
    }
    
    // Mac screenshots (Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5)
    if (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) {
      e.preventDefault();
      showProtectionMessage('Screenshots are not allowed on this page');
      return false;
    }
  });
}

/**
 * Detect changes to clipboard which might indicate screenshots
 */
function detectClipboardCopies() {
  document.addEventListener('copy', function(e) {
    // Skip check for input fields
    if (isInputField(e.target)) return true;
    
    // Otherwise log and notify
    console.log('Copy action detected, checking for possible screenshot...');
    setTimeout(checkForScreenshotInClipboard, 500);
  });
}

/**
 * Check if clipboard may contain a screenshot
 * Note: Modern browsers restrict clipboard access for security reasons
 * This will only work with proper permissions
 */
function checkForScreenshotInClipboard() {
  try {
    if (navigator.clipboard && navigator.clipboard.read) {
      navigator.clipboard.read()
        .then(data => {
          // Check clipboard data types
          for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item.types.some(type => type.startsWith('image/'))) {
              showProtectionMessage('Screenshot detected! Please respect our content protection policy.');
              
              // Optional: You could try to clear the clipboard
              // navigator.clipboard.writeText('');
            }
          }
        })
        .catch(err => {
          // Permission denied or other error, just log silently
          console.log('Unable to check clipboard contents:', err);
        });
    }
  } catch (e) {
    // Silently fail if clipboard API is not supported
    console.log('Clipboard API not fully supported in this browser');
  }
}

/**
 * Detect tab/window visibility changes which might indicate screen recording apps
 */
function detectVisibilityChanges() {
  let visibilityChangeCount = 0;
  let lastChangeTime = Date.now();
  
  document.addEventListener('visibilitychange', function() {
    const currentTime = Date.now();
    
    // If visibility changes happen too frequently, might be recording software switching contexts
    if (currentTime - lastChangeTime < 1000) {
      visibilityChangeCount++;
      
      if (visibilityChangeCount > 5) {
        showProtectionMessage('Unusual activity detected. Screen recording tools may be in use.');
        visibilityChangeCount = 0;
      }
    } else {
      visibilityChangeCount = 0;
    }
    
    lastChangeTime = currentTime;
  });
}

/**
 * Blur sensitive content when tab is not in focus or inactive
 * This makes screen recordings less useful
 */
function addBlurOnInactive() {
  const contentElements = document.querySelectorAll('.item_content, .book-cover, video.item_media');
  
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      // Page is not visible (user switched tabs)
      contentElements.forEach(el => {
        el.classList.add('protection-blur');
      });
    } else {
      // Page is visible again
      contentElements.forEach(el => {
        el.classList.remove('protection-blur');
      });
    }
  });
  
  // Also blur when window loses focus
  window.addEventListener('blur', function() {
    contentElements.forEach(el => {
      el.classList.add('protection-blur');
    });
  });
  
  window.addEventListener('focus', function() {
    contentElements.forEach(el => {
      el.classList.remove('protection-blur');
    });
  });
  
  // Add the CSS for blurring
  const style = document.createElement('style');
  style.textContent = `
    .protection-blur {
      filter: blur(20px) !important;
      transition: filter 0.3s ease;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Add a dynamic watermark to make screenshots less useful
 */
function addWatermark() {
  // Create watermark container
  const watermark = document.createElement('div');
  watermark.className = 'content-watermark';
  
  // Get user identifier (IP, username, email - whatever is available)
  let userIdentifier = 'Protected Content';
  
  // Get current date and time
  const now = new Date();
  const dateString = now.toLocaleDateString();
  const timeString = now.toLocaleTimeString();
  
  // Set watermark content
  watermark.innerHTML = `
    <div class="watermark-grid"></div>
  `;
  
  // Add watermark to page
  document.body.appendChild(watermark);
  
  // Add CSS for watermark
  const style = document.createElement('style');
  style.textContent = `
    .content-watermark {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9998;
      overflow: hidden;
    }
    
    .watermark-grid {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: repeating-linear-gradient(45deg, 
        rgba(150, 150, 150, 0.02) 0px, 
        rgba(150, 150, 150, 0.02) 10px,
        rgba(150, 150, 150, 0.04) 10px, 
        rgba(150, 150, 150, 0.04) 20px);
      z-index: 9998;
    }
    
    .watermark-grid::before {
      content: "${userIdentifier} • ${dateString} • ${timeString}";
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      transform-origin: center;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: calc(5vw + 5vh);
      color: rgba(0, 0, 0, 0.03);
      white-space: nowrap;
      z-index: 9999;
      pointer-events: none;
    }
    
    body.dark-mode .watermark-grid::before {
      color: rgba(255, 255, 255, 0.03);
    }
  `;
  document.head.appendChild(style);
  
  // Update time in watermark periodically
  setInterval(() => {
    const now = new Date();
    const dateString = now.toLocaleDateString();
    const timeString = now.toLocaleTimeString();
    
    // Update the watermark text
    style.textContent = style.textContent.replace(
      /content: ".*?"/,
      `content: "${userIdentifier} • ${dateString} • ${timeString}"`
    );
  }, 60000); // Update every minute
}

/**
 * Apply CSS techniques to make content harder to screenshot clearly
 */
function applyContentBlurring() {
  // Add special effects to make screenshots and recordings less useful
  const style = document.createElement('style');
  style.textContent = `
    /* Apply subtle text shadow to make OCR harder */
    p, h1, h2, h3, h4, h5, h6, span, li {
      text-shadow: 0 0 1px rgba(0, 0, 0, 0.3) !important;
    }
    
    body.dark-mode p, 
    body.dark-mode h1, 
    body.dark-mode h2, 
    body.dark-mode h3, 
    body.dark-mode h4, 
    body.dark-mode h5, 
    body.dark-mode h6, 
    body.dark-mode span, 
    body.dark-mode li {
      text-shadow: 0 0 1px rgba(255, 255, 255, 0.3) !important;
    }
    
    /* Add noise pattern overlay on text container elements */
    .item_content {
      position: relative;
    }
    
    .item_content::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      opacity: 0.02;
      background-image: url("data:image/png;base64,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");
    }
  `;
  document.head.appendChild(style);
}

/**
 * Display a message to the user when protection is triggered
 * 
 * @param {string} message - The message to display
 */
function showProtectionMessage(message) {
  // Check if the existing showNotification function is available from book.js
  if (typeof window.showNotification === 'function') {
    window.showNotification(message, 'error');
    return;
  }
  
  // Fallback notification if the book.js showNotification function is not available
  const notification = document.createElement('div');
  notification.className = 'protection-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(220, 53, 69, 0.9);
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 9999;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Fade in
  setTimeout(() => {
    notification.style.opacity = '1';
  }, 10);
  
  // Remove after delay
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

/**
 * Check if the target element is an input field or contentEditable
 * 
 * @param {Element} target - The element to check
 * @returns {boolean} - True if the element is an input field
 */
function isInputField(target) {
  const tagName = target.tagName.toLowerCase();
  return tagName === 'input' || 
         tagName === 'textarea' || 
         target.isContentEditable ||
         target.getAttribute('contenteditable') === 'true';
}

// Export for potential use by other scripts
window.initScreenshotProtection = initScreenshotProtection; 