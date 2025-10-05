/**
 * Category Overlay Handler
 * Creates an overlay that shows items of a selected category when a gallery block is clicked
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the category overlay system
  initCategoryOverlay();
  
  function initCategoryOverlay() {
    // Create overlay container if it doesn't exist
    if (!document.getElementById('category-overlay')) {
      createOverlayContainer();
    }
    
    // Find all gallery blocks
    const galleryBlocks = document.querySelectorAll('.uniform-block, .gallery-item, .block, .wam_1, .wam_2, .wam_3, .wam_4, .wam_5, .wam_6, .wam_7, .wam_8, .wam_9');
    
    // Add click handler to each block
    galleryBlocks.forEach(block => {
      block.addEventListener('click', function(e) {
        // Prevent opening overlay if clicking on action button or link
        if (e.target.closest('.action-button, a, button')) {
          return;
        }
        
        // Get category from data attribute, class, or image source
        const category = block.dataset.category || getCategoryFromElement(block);
        if (category) {
          showCategoryOverlay(category);
        }
      });
    });
  }
  
  // Create the overlay container
  function createOverlayContainer() {
    const overlay = document.createElement('div');
    overlay.id = 'category-overlay';
    overlay.className = 'category-overlay';
    overlay.innerHTML = `
      <div class="overlay-background"></div>
      <div class="overlay-content">
        <div class="overlay-header">
          <h2 class="overlay-title"></h2>
          <p class="overlay-description"></p>
          <button class="overlay-close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <div class="overlay-grid"></div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Add close button functionality
    const closeButton = overlay.querySelector('.overlay-close');
    closeButton.addEventListener('click', hideOverlay);
    
    // Also close when clicking on the background
    const background = overlay.querySelector('.overlay-background');
    background.addEventListener('click', hideOverlay);
  }
  
  // Extract category from element
  function getCategoryFromElement(element) {
    // First check for category classes
    const classes = element.className.split(' ');
    const categoryClasses = ['radhekrishna', 'krishna', 'shiva', 'nature', 'radha-priya', 'bhagwan-shiva'];
    for (const cls of classes) {
      if (categoryClasses.includes(cls)) {
        return cls;
      }
    }
    
    // If no category found in classes, try to extract from image source
    const img = element.tagName.toLowerCase() === 'img' ? element : element.querySelector('img');
    if (img && img.src) {
      return getCategoryFromSrc(img.src);
    }
    
    return 'other';
  }
  
  // Get category from image source
  function getCategoryFromSrc(src) {
    const filename = src.split('/').pop().toLowerCase();
    
    if (filename.includes('rv')) return 'radhekrishna';
    if (filename.includes('bs')) return 'bhagwan-shiva';
    if (filename.includes('s')) return 'shiva';
    if (filename.includes('n')) return 'nature';
    if (filename.includes('rp')) return 'radha-priya';
    if (filename.includes('k')) return 'krishna';
    
    return 'other';
  }
  
  // Format category name for display
  function formatCategoryName(category) {
    return category
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Show the category overlay with items of the selected category
  function showCategoryOverlay(category) {
    // Get all images on the page
    const images = collectImagesForCategory(category);
    
    if (images.length === 0) {
      alert('No images found for this category.');
      return;
    }
    
    const overlay = document.getElementById('category-overlay');
    const title = overlay.querySelector('.overlay-title');
    const description = overlay.querySelector('.overlay-description');
    const grid = overlay.querySelector('.overlay-grid');
    
    // Set category information
    const categoryName = formatCategoryName(category);
    title.textContent = categoryName;
    description.textContent = `Collection of beautiful ${categoryName} images`;
    
    // Clear existing grid content
    grid.innerHTML = '';
    
    // Create grid items
    images.forEach(img => {
      const item = document.createElement('div');
      item.className = 'overlay-item uniform-block';
      item.dataset.category = category;
      
      item.innerHTML = `
        <div class="image-container">
          <img src="${img.src}" alt="${img.alt}" loading="lazy">
          <div class="scan-line"></div>
        </div>
        <div class="block-content">
          <h3 class="block-title">${img.title}</h3>
          <div class="action-buttons">
            <button class="action-button view-button">
              <i class="fa fa-eye"></i> View
            </button>
            <button class="action-button download-button">
              <i class="fa fa-download"></i> Download
            </button>
          </div>
        </div>
      `;
      
      grid.appendChild(item);
      
      // Add button functionality
      const viewButton = item.querySelector('.view-button');
      viewButton.addEventListener('click', function(e) {
        e.stopPropagation();
        openLightbox(img.src);
      });
      
      const downloadButton = item.querySelector('.download-button');
      downloadButton.addEventListener('click', function(e) {
        e.stopPropagation();
        downloadImage(img.src);
      });
    });
    
    // Show the overlay
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
  
  // Hide the category overlay
  function hideOverlay() {
    const overlay = document.getElementById('category-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
    }
  }
  
  // Collect all images for the selected category
  function collectImagesForCategory(category) {
    const images = [];
    
    // Find all img elements on the page
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
      if (img.src && getCategoryFromSrc(img.src) === category) {
        images.push({
          src: img.src,
          alt: img.alt || 'Gallery image',
          title: img.dataset.title || formatCategoryName(category) + ' Image'
        });
      }
    });
    
    // Find all gallery blocks with images
    const blocks = document.querySelectorAll('.uniform-block, .gallery-item, .block');
    blocks.forEach(block => {
      const img = block.querySelector('img');
      if (img && img.src && getCategoryFromSrc(img.src) === category) {
        const title = block.querySelector('.block-title') ? 
                     block.querySelector('.block-title').textContent : 
                     (img.alt || formatCategoryName(category) + ' Image');
        
        // Check if image already exists in our array
        const exists = images.some(image => image.src === img.src);
        if (!exists) {
          images.push({
            src: img.src,
            alt: img.alt || 'Gallery image',
            title: title
          });
        }
      }
    });
    
    return images;
  }
  
  // Open lightbox to view image
  function openLightbox(imgSrc) {
    // Use existing lightbox if available
    if (window.cosmicLightbox) {
      window.cosmicLightbox.open(imgSrc);
      return;
    }
    
    // Create simple lightbox if none exists
    const lightbox = document.createElement('div');
    lightbox.className = 'cosmic-simple-lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-overlay"></div>
      <div class="lightbox-content">
        <img src="${imgSrc}" alt="Enlarged view">
        <button class="lightbox-close">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    `;
    
    document.body.appendChild(lightbox);
    
    // Add close functionality
    const closeButton = lightbox.querySelector('.lightbox-close');
    closeButton.addEventListener('click', () => {
      document.body.removeChild(lightbox);
    });
    
    lightbox.querySelector('.lightbox-overlay').addEventListener('click', () => {
      document.body.removeChild(lightbox);
    });
  }
  
  // Download image
  function downloadImage(imgSrc) {
    const link = document.createElement('a');
    link.href = imgSrc;
    link.download = imgSrc.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}); 