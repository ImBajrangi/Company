/**
 * Cosmic Lightbox
 * Full-screen image viewer with navigation and zoom
 */
(function() {
  document.addEventListener('DOMContentLoaded', initCosmicLightbox);
  
  let currentIndex = 0;
  let galleryItems = [];
  let zoom = 1;
  
  function initCosmicLightbox() {
    createLightboxHTML();
    
    // Get all gallery items
    galleryItems = Array.from(document.querySelectorAll('.gallery-item, .block, .uniform-block'));
    
    // Add click event to each item
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        // Don't open lightbox if clicking on an action button
        if (e.target.closest('.action-button') || e.target.closest('a')) {
          return;
        }
        
        openLightbox(index);
      });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
      const lightbox = document.querySelector('.cosmic-lightbox');
      if (!lightbox || !lightbox.classList.contains('active')) return;
      
      switch(e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateLightbox('prev');
          break;
        case 'ArrowRight':
          navigateLightbox('next');
          break;
        case '+':
          zoomImage(0.1);
          break;
        case '-':
          zoomImage(-0.1);
          break;
      }
    });
  }
  
  function createLightboxHTML() {
    const lightboxHTML = `
      <div class="cosmic-lightbox">
        <div class="lightbox-content">
          <img src="" alt="Gallery Image" class="lightbox-image">
          <div class="lightbox-caption"></div>
          <div class="lightbox-counter"></div>
          <div class="lightbox-controls">
            <button class="lightbox-control prev-btn">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button class="lightbox-control next-btn">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          <button class="lightbox-close">
            <i class="fas fa-times"></i>
          </button>
          <div class="lightbox-zoom-controls">
            <button class="lightbox-zoom-btn zoom-out">
              <i class="fas fa-search-minus"></i>
            </button>
            <button class="lightbox-zoom-btn zoom-in">
              <i class="fas fa-search-plus"></i>
            </button>
          </div>
          <div class="lightbox-thumbnail-container"></div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    
    // Add event listeners
    const lightbox = document.querySelector('.cosmic-lightbox');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.prev-btn');
    const nextBtn = lightbox.querySelector('.next-btn');
    const zoomInBtn = lightbox.querySelector('.zoom-in');
    const zoomOutBtn = lightbox.querySelector('.zoom-out');
    
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox('prev'));
    nextBtn.addEventListener('click', () => navigateLightbox('next'));
    zoomInBtn.addEventListener('click', () => zoomImage(0.1));
    zoomOutBtn.addEventListener('click', () => zoomImage(-0.1));
    
    // Close when clicking outside the image
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }
  
  function openLightbox(index) {
    currentIndex = index;
    zoom = 1;
    
    const lightbox = document.querySelector('.cosmic-lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const caption = lightbox.querySelector('.lightbox-caption');
    const counter = lightbox.querySelector('.lightbox-counter');
    const thumbnailContainer = lightbox.querySelector('.lightbox-thumbnail-container');
    
    // Clear existing thumbnails
    thumbnailContainer.innerHTML = '';
    
    // Find image in the clicked item
    const item = galleryItems[index];
    const img = item.querySelector('img');
    const imgSrc = img.getAttribute('data-src') || img.getAttribute('src');
    
    // Get caption if available
    const captionText = item.querySelector('h3')?.textContent || '';
    const description = item.querySelector('p')?.textContent || '';
    
    // Set image source and caption
    lightboxImage.setAttribute('src', imgSrc);
    lightboxImage.style.transform = `scale(${zoom})`;
    caption.textContent = captionText + (description ? ` - ${description}` : '');
    counter.textContent = `${index + 1} / ${galleryItems.length}`;
    
    // Create thumbnails
    galleryItems.forEach((item, i) => {
      const thumbImg = item.querySelector('img');
      const thumbSrc = thumbImg.getAttribute('data-src') || thumbImg.getAttribute('src');
      
      const thumbnail = document.createElement('img');
      thumbnail.className = 'lightbox-thumbnail';
      thumbnail.src = thumbSrc;
      thumbnail.alt = 'Thumbnail';
      if (i === currentIndex) {
        thumbnail.classList.add('active');
      }
      
      thumbnail.addEventListener('click', () => {
        openLightbox(i);
      });
      
      thumbnailContainer.appendChild(thumbnail);
    });
    
    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
  
  function closeLightbox() {
    const lightbox = document.querySelector('.cosmic-lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  function navigateLightbox(direction) {
    if (direction === 'prev') {
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    } else {
      currentIndex = (currentIndex + 1) % galleryItems.length;
    }
    
    openLightbox(currentIndex);
  }
  
  function zoomImage(delta) {
    zoom = Math.max(0.5, Math.min(3, zoom + delta));
    
    const lightboxImage = document.querySelector('.lightbox-image');
    lightboxImage.style.transform = `scale(${zoom})`;
  }
})(); 