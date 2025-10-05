/**
 * Advanced Category Filtering System
 * Adds multiple filter options to the gallery
 */
(function() {
  document.addEventListener('DOMContentLoaded', initCategoryFilters);
  
  // Store all items for filtering
  let allItems = [];
  
  function initCategoryFilters() {
    // Get all gallery items
    allItems = Array.from(document.querySelectorAll('.gallery-item, .block, .uniform-block'));
    
    // Extract all unique categories
    const categories = new Set();
    allItems.forEach(item => {
      const categoryTag = item.querySelector('.category-tag');
      if (categoryTag) {
        categories.add(categoryTag.textContent.trim());
      }
    });
    
    // Create filter buttons
    createFilterButtons(Array.from(categories));
    
    // Apply hover effects randomly
    applyRandomHoverEffects();
  }
  
  function createFilterButtons(categories) {
    // Check if filter container exists, if not create one
    let filterContainer = document.querySelector('.gallery-filter-controls');
    
    if (!filterContainer) {
      const gallerySection = document.querySelector('#collection') || 
                            document.querySelector('.gallery-section') ||
                            document.querySelector('.gallery-container');
      
      if (!gallerySection) return;
      
      // Create filter container
      filterContainer = document.createElement('div');
      filterContainer.className = 'gallery-filter-controls';
      
      // Insert before the gallery
      const galleryGrid = gallerySection.querySelector('.view') || 
                         gallerySection.querySelector('.gallery-masonry-container');
      
      if (galleryGrid) {
        galleryGrid.parentNode.insertBefore(filterContainer, galleryGrid);
      }
    }
    
    // Clear existing buttons
    filterContainer.innerHTML = '';
    
    // Add "All" button
    const allButton = document.createElement('button');
    allButton.className = 'filter-button active';
    allButton.textContent = 'All';
    allButton.addEventListener('click', () => filterGallery('all'));
    filterContainer.appendChild(allButton);
    
    // Add category buttons
    categories.forEach(category => {
      const button = document.createElement('button');
      button.className = 'filter-button';
      button.textContent = category;
      button.addEventListener('click', () => filterGallery(category));
      filterContainer.appendChild(button);
    });
  }
  
  function filterGallery(category) {
    // Update active button
    const buttons = document.querySelectorAll('.filter-button');
    buttons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.textContent === category || (category === 'all' && btn.textContent === 'All')) {
        btn.classList.add('active');
      }
    });
    
    // Filter items
    allItems.forEach(item => {
      const itemCategory = item.querySelector('.category-tag')?.textContent.trim() || '';
      
      if (category === 'all' || itemCategory === category) {
        item.style.display = '';
        // Animate item appearance
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 50);
      } else {
        // Animate item disappearance
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          item.style.display = 'none';
        }, 500);
      }
    });
  }
  
  function applyRandomHoverEffects() {
    const effects = [
      'hover-effect-zoom',
      'hover-effect-reveal',
      'hover-effect-tilt',
      'hover-effect-glitch',
      'hover-effect-parallax'
    ];
    
    allItems.forEach(item => {
      // Apply random effect class
      const randomEffect = effects[Math.floor(Math.random() * effects.length)];
      item.classList.add(randomEffect);
      
      // Set background image for glitch effect
      if (randomEffect === 'hover-effect-glitch') {
        const img = item.querySelector('img');
        if (img) {
          const imgSrc = img.getAttribute('data-src') || img.getAttribute('src');
          const container = item.querySelector('.image-container');
          if (container) {
            container.style.setProperty('--item-bg-image', `url(${imgSrc})`);
          }
        }
      }
    });
  }
})(); 