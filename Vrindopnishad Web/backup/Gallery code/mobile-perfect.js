/**
 * Enhanced Mobile Experience
 * Improved touch interactions and performance for all devices
 */
(function() {
  document.addEventListener('DOMContentLoaded', initMobileEnhancements);
  
  function initMobileEnhancements() {
    // Detect if it's a touch device
    const isTouchDevice = 'ontouchstart' in window || 
                          navigator.maxTouchPoints > 0 || 
                          navigator.msMaxTouchPoints > 0;
    
    if (isTouchDevice) {
      document.body.classList.add('touch-device');
      enhanceTouchInteractions();
      optimizeMobilePerformance();
    }
    
    // Always run these enhancements for better cross-device support
    improveResponsiveLayout();
    fixMobileMenuIssues();
    addOrientationHandler();
  }
  
  function enhanceTouchInteractions() {
    // Add tap interaction for gallery items since hover doesn't work on mobile
    const galleryItems = document.querySelectorAll('.gallery-item, .block, .uniform-block');
    
    galleryItems.forEach(item => {
      item.addEventListener('touchstart', function() {
        this.classList.add('touch-focus');
      }, { passive: true });
      
      // Remove class on touch end or if user scrolls/moves away
      item.addEventListener('touchend', function() {
        setTimeout(() => this.classList.remove('touch-focus'), 300);
      }, { passive: true });
      
      item.addEventListener('touchmove', function() {
        this.classList.remove('touch-focus');
      }, { passive: true });
    });
    
    // Add swipe support for mobile gallery navigation
    enableSwipeGestures();
  }
  
  function enableSwipeGestures() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Select gallery containers or sliders
    const sliderContainers = document.querySelectorAll('.divine-gallery-cards, .modal-content');
    
    sliderContainers.forEach(container => {
      container.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      container.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(container);
      }, { passive: true });
    });
    
    function handleSwipe(container) {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swiped left - next
          const nextBtn = container.querySelector('.nav-next') || 
                          document.querySelector('.next-button, .arrow-right');
          if (nextBtn) nextBtn.click();
        } else {
          // Swiped right - previous
          const prevBtn = container.querySelector('.nav-prev') || 
                          document.querySelector('.prev-button, .arrow-left');
          if (prevBtn) prevBtn.click();
        }
      }
    }
  }
  
  function optimizeMobilePerformance() {
    // Reduce particle count on mobile
    const particleContainers = document.querySelectorAll('.stars-container, .header-particles');
    particleContainers.forEach(container => {
      const particles = container.querySelectorAll('.star, .header-particle');
      
      // Keep only 40% of particles on mobile for better performance
      for (let i = 0; i < particles.length; i++) {
        if (i % 2.5 !== 0) {
          particles[i].style.display = 'none';
        }
      }
    });
    
    // Optimize animations
    if (typeof anime !== 'undefined') {
      const animeInstances = anime.running;
      animeInstances.forEach(instance => {
        // Lower the framerate for better performance
        if (instance.duration > 1000) {
          instance.duration *= 1.2;
        }
      });
    }
    
    // Detect low-end devices and further optimize
    if ('deviceMemory' in navigator && navigator.deviceMemory < 4) {
      document.body.classList.add('low-end-device');
      
      // Disable more complex animations
      const style = document.createElement('style');
      style.textContent = `
        .cosmic-background, .scan-line, .floating-item {
          animation-play-state: paused !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  function improveResponsiveLayout() {
    // Fix layout issues on various screen sizes
    const viewportHeight = window.innerHeight;
    
    // Adjust header height for small screens
    const header = document.querySelector('.divine-gallery-header');
    if (header && viewportHeight < 600) {
      header.style.minHeight = 'auto';
      header.style.padding = '2rem 1rem';
    }
    
    // Fix grid layout for different screen widths
    adjustGalleryGrid();
    
    // Make sure footer links are big enough on small screens
    const footerLinks = document.querySelectorAll('.cosmic-footer a');
    if (window.innerWidth < 768) {
      footerLinks.forEach(link => {
        link.style.padding = '8px 0';
        link.style.display = 'inline-block';
      });
    }
  }
  
  function adjustGalleryGrid() {
    const galleryContainer = document.querySelector('.gallery-masonry-container');
    if (!galleryContainer) return;
    
    const viewportWidth = window.innerWidth;
    
    if (viewportWidth < 480) {
      // Single column for very small screens
      galleryContainer.style.gridTemplateColumns = 'repeat(1, 1fr)';
    } else if (viewportWidth < 768) {
      // Two columns for small screens
      galleryContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
    }
    
    // Gallery item height adjustments for better visual appeal
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
      if (viewportWidth < 480) {
        // Make items shorter on small screens
        item.style.maxHeight = '250px';
      }
    });
  }
  
  function fixMobileMenuIssues() {
    // Ensure mobile menu works correctly
    const mobileToggle = document.querySelector('.cosmic-mobile-toggle');
    const mobileMenu = document.querySelector('.cosmic-mobile-menu');
    
    if (mobileToggle && mobileMenu) {
      // Fix potential z-index issues
      mobileMenu.style.zIndex = '1001';
      
      // Ensure menu closes when clicking outside
      document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
          mobileMenu.classList.remove('active');
        }
      });
      
      // Add extra safe close button on mobile
      if (!document.querySelector('.mobile-menu-close')) {
        const closeButton = document.createElement('button');
        closeButton.className = 'mobile-menu-close';
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          z-index: 10;
        `;
        closeButton.addEventListener('click', () => {
          mobileMenu.classList.remove('active');
        });
        
        mobileMenu.appendChild(closeButton);
      }
    }
  }
  
  function addOrientationHandler() {
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
      // Small delay to allow the browser to finish orientation change
      setTimeout(() => {
        improveResponsiveLayout();
        adjustGalleryGrid();
      }, 200);
    });
  }
})(); 