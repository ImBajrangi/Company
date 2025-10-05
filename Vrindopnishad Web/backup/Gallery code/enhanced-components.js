/**
 * Enhanced components with advanced responsive handling
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize enhanced components
  initEnhancedGallery();
  initEnhancedLoader();
  initEnhancedFooter();
});

/**
 * Enhanced gallery with improved block sizing and gaps
 */
function initEnhancedGallery() {
  // Apply enhanced gallery styles
  const galleryStyles = document.createElement('link');
  galleryStyles.rel = 'stylesheet';
  galleryStyles.href = './Gallery code/enhanced-gallery.css';
  document.head.appendChild(galleryStyles);
  
  // Find existing gallery container or create one
  let galleryContainer = document.querySelector('.gallery-masonry-container');
  const galleryParent = document.querySelector('.image-gallery');
  
  if (!galleryContainer && galleryParent) {
    // Create container if it doesn't exist
    galleryContainer = document.createElement('div');
    galleryContainer.className = 'gallery-masonry-container';
    
    // Get all images from the parent and add them to the gallery
    const images = galleryParent.querySelectorAll('img:not(.wam_1 ~ img)');
    
    images.forEach(img => {
      // Create gallery item
      const galleryItem = document.createElement('div');
      galleryItem.className = 'gallery-item';
      
      // Create image container
      const imageContainer = document.createElement('div');
      imageContainer.className = 'image-container';
      
      // Clone the image
      const imgClone = img.cloneNode(true);
      imageContainer.appendChild(imgClone);
      
      // Add overlay with details
      const overlay = createGalleryItemOverlay(img);
      imageContainer.appendChild(overlay);
      
      // Add event listeners
      addGalleryItemInteractivity(galleryItem);
      
      // Add to gallery
      galleryItem.appendChild(imageContainer);
      galleryContainer.appendChild(galleryItem);
    });
    
    // Replace original content with new gallery
    galleryParent.innerHTML = '';
    galleryParent.appendChild(galleryContainer);
  }
  
  // Enable masonry layout and optimized sizing
  enableDynamicGalleryLayout();
}

/**
 * Create overlay for gallery items
 */
function createGalleryItemOverlay(img) {
  const overlay = document.createElement('div');
  overlay.className = 'item-overlay';
  
  // Extract info from image
  const alt = img.alt || 'Gallery Image';
  const category = getCategoryFromImgSrc(img.src);
  
  // Add title
  const title = document.createElement('h3');
  title.textContent = formatTitle(alt);
  overlay.appendChild(title);
  
  // Add category tag
  const categoryTag = document.createElement('span');
  categoryTag.className = 'category-tag';
  categoryTag.textContent = formatCategory(category);
  overlay.appendChild(categoryTag);
  
  // Add action buttons
  const actions = document.createElement('div');
  actions.className = 'item-actions';
  
  // View button
  const viewBtn = document.createElement('button');
  viewBtn.className = 'action-button view-button';
  viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
  actions.appendChild(viewBtn);
  
  // Like button
  const likeBtn = document.createElement('button');
  likeBtn.className = 'action-button like-button';
  likeBtn.innerHTML = '<i class="fas fa-heart"></i>';
  actions.appendChild(likeBtn);
  
  overlay.appendChild(actions);
  return overlay;
}

/**
 * Add interactivity to gallery items
 */
function addGalleryItemInteractivity(item) {
  // Add click handler for opening modal/lightbox
  item.addEventListener('click', (e) => {
    if (e.target.closest('.like-button')) {
      // Handle like button click
      e.stopPropagation();
      toggleFavorite(item);
    } else {
      // Open image modal/lightbox
      const img = item.querySelector('img');
      if (img) {
        openImageModal(img.src, img.alt, getCategoryFromImgSrc(img.src));
      }
    }
  });
  
  // Add hover animations
  item.addEventListener('mouseenter', () => {
    const img = item.querySelector('img');
    if (img) {
      img.style.transform = 'scale(1.08)';
    }
  });
  
  item.addEventListener('mouseleave', () => {
    const img = item.querySelector('img');
    if (img) {
      img.style.transform = 'scale(1)';
    }
  });
}

/**
 * Enhanced loader with smoother animations
 */
function initEnhancedLoader() {
  // Apply enhanced loader styles
  const loaderStyles = document.createElement('link');
  loaderStyles.rel = 'stylesheet';
  loaderStyles.href = './Gallery code/enhanced-loader.css';
  document.head.appendChild(loaderStyles);
  
  // Apply loader fix CSS for visibility
  const loaderFixStyles = document.createElement('link');
  loaderFixStyles.rel = 'stylesheet';
  loaderFixStyles.href = './Gallery code/enhanced-loader-fix.css';
  document.head.appendChild(loaderFixStyles);
  
  // Create and insert loader immediately
  createAndInsertLoader();

  // Handle page load event to hide loader
  window.addEventListener('load', handlePageLoad);
}

/**
 * Enhanced footer with better responsiveness
 */
function initEnhancedFooter() {
  // Apply enhanced footer styles
  const footerStyles = document.createElement('link');
  footerStyles.rel = 'stylesheet';
  footerStyles.href = './Gallery code/enhanced-footer.css';
  document.head.appendChild(footerStyles);
  
  // Create starry background for footer
  createStarryBackground('.cosmic-footer');
}

/**
 * Creates starry background effect within a given container
 */
function createStarryBackground(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const starBg = document.createElement('div');
  starBg.className = 'star-bg';
  container.prepend(starBg); // Add as first child

  const numStars = 150;
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('span');
    star.className = 'star';
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 2}s`;
    star.style.setProperty('--duration', `${2 + Math.random() * 3}s`);
    star.style.setProperty('--opacity', `${0.5 + Math.random() * 0.5}`);
    starBg.appendChild(star);
  }
}

/**
 * Helper function: Animate loader progress
 */
function animateLoader() {
  const progressCircle = document.querySelector('.progress-circle-fill');
  const progressText = document.querySelector('.loader-text');
  
  if (!progressCircle || !progressText) return;
  
  let progress = 0;
  const loadingTime = 2500; // ms
  const interval = 30; // ms
  const steps = loadingTime / interval;
  const increment = 100 / steps;
  
  // More natural loading progress simulation
  const progressInterval = setInterval(() => {
    progress += increment;
    
    // Apply easing for more natural progress
    let displayProgress;
    if (progress < 80) {
      displayProgress = Math.min(Math.round(progress), 100);
    } else {
      // Slow down at the end for a more realistic feel
      displayProgress = Math.min(Math.round(80 + (progress - 80) * 0.3), 99);
    }
    
    // Update progress circle
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (displayProgress / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
    progressCircle.style.strokeDasharray = circumference;
    
    // Update text
    progressText.textContent = `Loading ${displayProgress}%`;
    
    // Complete loading
    if (progress >= 100) {
      clearInterval(progressInterval);
      
      // Simulate final loading tasks
      setTimeout(() => {
        progressCircle.style.strokeDashoffset = 0;
        progressText.textContent = 'Loading 100%';
        
        // Hide loader
        setTimeout(() => {
          const loader = document.querySelector('.cosmic-loader-container');
          if (loader) {
            loader.classList.add('fade-out');
          }
        }, 300);
      }, 500);
    }
  }, interval);
}

/**
 * Helper function: Enable dynamic gallery layout
 */
function enableDynamicGalleryLayout() {
  // Use ResizeObserver for responsive layout adjustments
  if ('ResizeObserver' in window) {
    const galleryContainer = document.querySelector('.gallery-masonry-container');
    
    if (galleryContainer) {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          // Optimize layout based on container width
          optimizeGalleryLayout(entry.target, entry.contentRect.width);
        }
      });
      
      resizeObserver.observe(galleryContainer);
    }
  }
  
  // Initial layout optimization
  const galleryContainer = document.querySelector('.gallery-masonry-container');
  if (galleryContainer) {
    optimizeGalleryLayout(galleryContainer, galleryContainer.offsetWidth);
  }
}

/**
 * Helper function: Optimize gallery layout based on container width
 */
function optimizeGalleryLayout(container, width) {
  // Adjust item sizes and layout based on container width
  const items = container.querySelectorAll('.gallery-item');
  
  // Reset special items
  items.forEach(item => {
    item.style.gridColumn = '';
    item.style.gridRow = '';
  });
  
  // Apply special sizing only on larger screens
  if (width >= 768) {
    // Create featured items for visual interest
    if (items.length >= 5) {
      // Every 5th item spans 2 rows
      for (let i = 2; i < items.length; i += 5) {
        if (items[i]) {
          items[i].style.gridRow = 'span 2';
        }
      }
    }
    
    if (items.length >= 8) {
      // Every 8th item spans 2 columns
      for (let i = 5; i < items.length; i += 8) {
        if (items[i]) {
          items[i].style.gridColumn = 'span 2';
        }
      }
    }
  }
}

/**
 * Helper function: Add interactivity to footer
 */
function addFooterInteractivity() {
  // Animate social icons
  const socialIcons = document.querySelectorAll('.social-icon');
  
  socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      gsap.to(icon, {
        y: -5,
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    icon.addEventListener('mouseleave', () => {
      gsap.to(icon, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  });
  
  // Animate subscribe button
  const subscribeButton = document.querySelector('.subscribe-button');
  
  if (subscribeButton) {
    subscribeButton.addEventListener('mouseenter', () => {
      gsap.to(subscribeButton, {
        x: 3,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    subscribeButton.addEventListener('mouseleave', () => {
      gsap.to(subscribeButton, {
        x: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    // Handle subscribe form submission
    const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
      subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = subscribeForm.querySelector('.subscribe-input');
        
        if (input.value.trim() !== '') {
          // Simulate successful subscription
          input.value = '';
          
          // Show success animation
          const originalText = subscribeButton.textContent;
          subscribeButton.innerHTML = '<i class="fas fa-check"></i>';
          
          setTimeout(() => {
            subscribeButton.textContent = originalText;
          }, 2000);
        }
      });
    }
  }
}

/**
 * Helper function: Get category from image source
 */
function getCategoryFromImgSrc(src) {
  const filename = src.split('/').pop();
  
  if (filename.includes('rv')) return 'radhe-krishna';
  if (filename.includes('bs')) return 'bhagwan-shiva';
  if (filename.includes('s')) return 'shiva';
  if (filename.includes('n')) return 'nature';
  if (filename.includes('rp')) return 'radha-priya';
  if (filename.includes('k')) return 'krishna';
  
  return 'other';
}

/**
 * Helper function: Format title from image alt text
 */
function formatTitle(alt) {
  if (!alt || alt === '') return 'Gallery Image';
  
  return alt.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Helper function: Format category name
 */
function formatCategory(category) {
  return category.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Toggle favorite status for gallery item
 */
function toggleFavorite(item) {
  const likeButton = item.querySelector('.like-button');
  
  if (likeButton) {
    // Toggle active class
    likeButton.classList.toggle('active');
    item.classList.toggle('favorited');
    
    // Animate heart
    if (likeButton.classList.contains('active')) {
      gsap.fromTo(likeButton, 
        { scale: 1 }, 
        { scale: 1.5, duration: 0.2, yoyo: true, repeat: 1 }
      );
    }
  }
}

/**
 * Open image modal/lightbox
 */
function openImageModal(src, alt, category) {
  // Check if modal exists or create one
  let modal = document.querySelector('.cosmic-modal');
  
  if (!modal) {
    // Create modal if it doesn't exist
    modal = document.createElement('div');
    modal.className = 'cosmic-modal';
    document.body.appendChild(modal);
  }
  
  // Update modal with image details
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-container">
      <button class="modal-close">
        <i class="fas fa-times"></i>
      </button>
      <div class="modal-content">
        <div class="modal-image-container">
          <img src="${src}" alt="${alt}" class="modal-image">
        </div>
        <div class="modal-info">
          <h2 class="modal-title">${formatTitle(alt)}</h2>
          <p class="modal-category">${formatCategory(category)}</p>
          <div class="modal-description">
            <p>Experience the beauty of our cosmic gallery. Each image is carefully curated to showcase the wonders of the universe.</p>
          </div>
          <div class="modal-actions">
            <button class="modal-action like-action">
              <i class="fas fa-heart"></i>
              <span>Add to Favorites</span>
            </button>
            <button class="modal-action share-action">
              <i class="fas fa-share-alt"></i>
              <span>Share</span>
            </button>
            <button class="modal-action download-action">
              <i class="fas fa-download"></i>
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Add close event listeners
  const closeButton = modal.querySelector('.modal-close');
  const overlay = modal.querySelector('.modal-overlay');
  
  closeButton.addEventListener('click', () => {
    modal.classList.remove('active');
  });
  
  overlay.addEventListener('click', () => {
    modal.classList.remove('active');
  });
}

/**
 * Creates and inserts the loader into the DOM
 */
function createAndInsertLoader() {
  // Create loader container
  const loaderContainer = document.createElement('div');
  loaderContainer.className = 'cosmic-loader-container';
  loaderContainer.style.opacity = '1';
  loaderContainer.style.visibility = 'visible';

  // Create loader HTML
  loaderContainer.innerHTML = `
    <div class="cosmic-loader">
      <div class="loader-ring"></div>
      <div class="loader-pulse"></div>

      <div class="progress-circle-container">
        <svg class="progress-circle" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="cosmicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#72baff" />
              <stop offset="100%" stop-color="#bc72ff" />
            </linearGradient>
          </defs>
          <circle class="progress-circle-bg" cx="50" cy="50" r="45" />
          <circle class="progress-circle-fill" cx="50" cy="50" r="45" />
        </svg>
      </div>

      <div class="loader-text">Loading...</div>

      <div class="loader-particles-container">
        <div class="loader-particle" style="--tx: 40px; --ty: -30px; --opacity: 0.9;"></div>
        <div class="loader-particle" style="--tx: -50px; --ty: -40px; --opacity: 0.8;"></div>
        <div class="loader-particle" style="--tx: 30px; --ty: 50px; --opacity: 0.7;"></div>
        <div class="loader-particle" style="--tx: -40px; --ty: 30px; --opacity: 0.9;"></div>
        <div class="loader-particle" style="--tx: 50px; --ty: 20px; --opacity: 0.8;"></div>
      </div>
    </div>
  `;

  // Insert at the beginning of body
  document.body.insertBefore(loaderContainer, document.body.firstChild);

  // Start progress animation
  animateProgress();
}

/**
 * Handle page load event to fade out and remove loader
 */
function handlePageLoad() {
  // Simulate loading progress completion
  const progressCircle = document.querySelector('.progress-circle-fill');
  if (progressCircle) {
    progressCircle.style.strokeDashoffset = '0';
  }

  // Hide loader after content is fully loaded
  setTimeout(() => {
    const loaderContainer = document.querySelector('.cosmic-loader-container');
    if (loaderContainer) {
      loaderContainer.classList.add('fade-out');

      // Remove from DOM after animation completes
      setTimeout(() => {
        if (loaderContainer.parentNode) {
          loaderContainer.parentNode.removeChild(loaderContainer);
        }
      }, 800); // Match the CSS transition duration
    }
  }, 1500); // Adjust this time as needed
}

/**
 * Animates the progress circle for loader
 */
function animateProgress() {
  const progressCircle = document.querySelector('.progress-circle-fill');
  if (!progressCircle) return;

  let progress = 0;
  const totalDuration = 2000; // 2 seconds
  const interval = 30; // Update every 30ms
  const steps = totalDuration / interval;
  const increment = 283 / steps; // 283 is the circumference of the circle

  const progressInterval = setInterval(() => {
    progress += increment;
    const currentOffset = 283 - progress;

    if (currentOffset <= 0) {
      clearInterval(progressInterval);
      progressCircle.style.strokeDashoffset = '0';
    } else {
      progressCircle.style.strokeDashoffset = currentOffset;
    }
  }, interval);
} 