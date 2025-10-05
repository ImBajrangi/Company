/**
 * Mobile Menu and Search Enhancements
 */
(function() {
  document.addEventListener('DOMContentLoaded', initMobileEnhancements);
  
  function initMobileEnhancements() {
    // Create back button for full-screen menu
    addMobileBackButton();
    
    // Enhance search functionality
    enhanceSearchFunctionality();
    
    // Fix touch event issues
    fixTouchEvents();
  }
  
  function addMobileBackButton() {
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;
    
    // Check if there's a fullscreen menu
    const fullscreenMenu = document.querySelector('.cosmic-menu-fullscreen, .menu-fullscreen');
    if (!fullscreenMenu) return;
    
    // Create back button
    const backButton = document.createElement('div');
    backButton.className = 'mobile-back-button';
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
    
    // Add functionality to back button
    backButton.addEventListener('click', function() {
      // If there's a close button, trigger it
      const closeBtn = document.querySelector('.menu-close, .close-menu');
      if (closeBtn) {
        closeBtn.click();
      } else {
        // Otherwise, just go back in history
        window.history.back();
      }
    });
    
    // Add to menu
    fullscreenMenu.appendChild(backButton);
    
    // Listen for menu open events to ensure button is visible
    const menuToggles = document.querySelectorAll('.menu-toggle, .toggle-menu');
    menuToggles.forEach(toggle => {
      toggle.addEventListener('click', function() {
        // Ensure back button is visible
        setTimeout(() => {
          backButton.style.display = 'flex';
        }, 100);
      });
    });
  }
  
  function enhanceSearchFunctionality() {
    // Get search elements
    const searchToggle = document.querySelector('.cosmic-search-toggle');
    const searchOverlay = document.querySelector('.cosmic-search-overlay');
    
    if (!searchToggle || !searchOverlay) return;
    
    // Improve search toggle animation
    searchToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Remove any existing classes to avoid conflicts
      searchOverlay.classList.remove('searchDisappear');
      
      // Toggle active state with animation
      if (searchOverlay.classList.contains('active')) {
        // Close with animation
        searchOverlay.style.animation = 'searchDisappear 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
        setTimeout(() => {
          searchOverlay.classList.remove('active');
          searchOverlay.style.animation = '';
        }, 300);
      } else {
        // Open with animation
        searchOverlay.classList.add('active');
        searchOverlay.style.animation = 'searchAppear 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        // Focus input after animation
        setTimeout(() => {
          const searchInput = searchOverlay.querySelector('input');
          if (searchInput) searchInput.focus();
        }, 300);
      }
    });
    
    // Enhanced close button
    const searchClose = searchOverlay.querySelector('.cosmic-search-close');
    if (searchClose) {
      searchClose.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Use animation to close
        searchOverlay.style.animation = 'searchDisappear 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
        setTimeout(() => {
          searchOverlay.classList.remove('active');
          searchOverlay.style.animation = '';
        }, 300);
      });
    }
    
    // Close on click outside with improved reliability
    document.addEventListener('click', function(e) {
      if (!searchOverlay.classList.contains('active')) return;
      
      // Check if click was outside search container
      const searchContainer = searchOverlay.querySelector('.cosmic-search-container');
      if (searchContainer && !searchContainer.contains(e.target) && 
          !searchToggle.contains(e.target)) {
        
        // Use animation to close
        searchOverlay.style.animation = 'searchDisappear 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
        setTimeout(() => {
          searchOverlay.classList.remove('active');
          searchOverlay.style.animation = '';
        }, 300);
      }
    });
  }
  
  function fixTouchEvents() {
    // Fix double-tap issues on iOS
    const links = document.querySelectorAll('a[href], button, .btn, .gallery-item');
    links.forEach(link => {
      link.addEventListener('touchend', function(e) {
        // Only if this is a simple tap (not a swipe or scroll)
        if (!this.touchMoved) {
          e.preventDefault();
          
          // Simulate click for better response
          this.click();
        }
        
        // Reset touchMoved flag
        this.touchMoved = false;
      });
      
      link.addEventListener('touchmove', function() {
        // Mark as a moved touch, not a tap
        this.touchMoved = true;
      });
      
      link.addEventListener('touchstart', function() {
        // Initialize for a new touch
        this.touchMoved = false;
      });
    });
  }
  
  // Helper to check if element is visible in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Listen for orientation changes
  window.addEventListener('orientationchange', function() {
    // Re-initialize after orientation change
    setTimeout(initMobileEnhancements, 300);
  });
})(); 