/**
 * Enhanced Image Loading System
 * Improves image loading with placeholders and progressive enhancement
 */
(function() {
  document.addEventListener('DOMContentLoaded', initEnhancedImageLoader);
  
  function initEnhancedImageLoader() {
    // Fix image paths and add progressive loading
    const galleryImages = document.querySelectorAll('.gallery-item img, .block img, .uniform-block img');
    
    galleryImages.forEach(img => {
      // Store original source
      const originalSrc = img.getAttribute('src');
      
      // Check if path needs fixing (if it doesn't start with ./ or /)
      if (originalSrc && !originalSrc.startsWith('./') && !originalSrc.startsWith('/') && !originalSrc.startsWith('http')) {
        // Fix relative path issue
        img.setAttribute('src', `./${originalSrc}`);
      } else if (originalSrc && originalSrc === 'placeholder.jpg') {
        // Replace placeholder with actual image using data-src if available
        const actualSrc = img.getAttribute('data-src');
        if (actualSrc) {
          loadImageProgressively(img, actualSrc);
        }
      }
      
      // Add loading animation
      addLoadingEffect(img);
    });
    
    // Initialize lazy loading
    initLazyLoading();
  }
  
  function loadImageProgressively(img, src) {
    // Add low-quality placeholder first
    img.style.filter = 'blur(10px)';
    
    // Create new image object to preload
    const newImg = new Image();
    newImg.src = src;
    
    newImg.onload = function() {
      // When fully loaded, replace source and remove blur
      img.src = src;
      
      // Fade in the full image
      setTimeout(() => {
        img.style.transition = 'filter 0.5s ease';
        img.style.filter = 'blur(0)';
      }, 10);
    };
    
    newImg.onerror = function() {
      console.error('Failed to load image:', src);
      // Apply error style
      img.classList.add('image-load-error');
      img.src = './image/image-error.jpg'; // Fallback image
    };
  }
  
  function addLoadingEffect(img) {
    // Create and add loading indicator
    const container = img.closest('.image-container');
    
    if (container) {
      const loadingIndicator = document.createElement('div');
      loadingIndicator.className = 'cosmic-image-loader';
      loadingIndicator.innerHTML = `<div class="loader-ring"></div>`;
      container.appendChild(loadingIndicator);
      
      // Remove loader when image loads
      img.addEventListener('load', () => {
        loadingIndicator.classList.add('loaded');
        setTimeout(() => {
          loadingIndicator.remove();
        }, 500);
      });
    }
  }
  
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img.lazyload');
      
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            
            if (src) {
              loadImageProgressively(img, src);
              img.classList.remove('lazyload');
              imageObserver.unobserve(img);
            }
          }
        });
      });
      
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      const lazyImages = document.querySelectorAll('img.lazyload');
      
      lazyImages.forEach(img => {
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.classList.remove('lazyload');
        }
      });
    }
  }
})(); 