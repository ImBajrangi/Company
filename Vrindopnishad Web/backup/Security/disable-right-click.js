/**
 * Security.js - Content Protection Functionality
 * 
 * This script disables content copying, text selection, and right-clicking
 * to help protect the content of the website.
 */

// Main initialization function
document.addEventListener('DOMContentLoaded', function() {
  disableContentProtection();
});

/**
 * Main function to disable content protection
 */
function disableContentProtection() {
  disableRightClick();
  disableTextSelection();
  disableCopyPaste();
  disableKeyboardShortcuts();
  disableDragDrop();
  addProtectionStyles();
}

/**
 * Disable right-click functionality
 */
function disableRightClick() {
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showProtectionMessage('Right-click is disabled on this page');
    return false;
  });
}

/**
 * Disable text selection
 */
function disableTextSelection() {
  document.addEventListener('selectstart', function(e) {
    // Ignore inputs and textareas
    if (isInputField(e.target)) return true;
    
    e.preventDefault();
    return false;
  });
}

/**
 * Disable copy, cut, and paste events
 */
function disableCopyPaste() {
  // Disable copy
  document.addEventListener('copy', function(e) {
    // Ignore inputs and textareas
    if (isInputField(e.target)) return true;
    
    e.preventDefault();
    showProtectionMessage('Copying is disabled on this page');
    return false;
  });
  
  // Disable cut
  document.addEventListener('cut', function(e) {
    // Ignore inputs and textareas
    if (isInputField(e.target)) return true;
    
    e.preventDefault();
    return false;
  });
  
  // Disable paste
  document.addEventListener('paste', function(e) {
    // Ignore inputs and textareas
    if (isInputField(e.target)) return true;
    
    e.preventDefault();
    return false;
  });
}

/**
 * Prevent keyboard shortcuts for copy/paste
 */
function disableKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Ignore inputs and textareas
    if (isInputField(e.target)) return true;
    
    // Check for Ctrl+C, Ctrl+X, Ctrl+V, Cmd+C, Cmd+X, Cmd+V
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'x' || e.key === 'v')) {
      e.preventDefault();
      showProtectionMessage('Keyboard shortcuts for copy/paste are disabled');
      return false;
    }
  });
}

/**
 * Prevent drag and drop
 */
function disableDragDrop() {
  document.addEventListener('dragstart', function(e) {
    // Ignore inputs, textareas, and interactive elements
    if (isInputField(e.target)) return true;
    
    e.preventDefault();
    return false;
  });
}

/**
 * Add CSS styles to disable user-select
 */
function addProtectionStyles() {
  const style = document.createElement('style');
  style.textContent = `
    body, p, div, h1, h2, h3, h4, h5, h6, span, li, ul, ol, article, section, 
    main, header, footer, nav, aside, figure, img, a {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    
    /* Allow selection in inputs and textareas */
    input, textarea, [contenteditable="true"] {
      -webkit-user-select: auto;
      -moz-user-select: auto;
      -ms-user-select: auto;
      user-select: auto;
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
  // Check if the existing showNotification function is available
  if (typeof window.showNotification === 'function') {
    window.showNotification(message, 'info');
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
    background-color: rgba(0, 0, 0, 0.8);
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

// Export functions for potential external use
window.disableContentProtection = disableContentProtection; 