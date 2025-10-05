/**
 * Advanced Gallery Controller with modern interactions
 */
class GalleryController {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.galleryContainer = null;
    this.filterButtons = [];
    this.items = [];
    this.currentFilter = 'all';
    this.currentLayout = 'grid';
    this.currentIndex = 0;
    
    // Subscribe to events
    this.eventBus.on('state:changed', this.handleStateChange.bind(this));
    this.eventBus.on('gallery:filter', this.filterGallery.bind(this));
    this.eventBus.on('gallery:layout', this.changeLayout.bind(this));
    this.eventBus.on('gallery:next', this.showNextItem.bind(this));
    this.eventBus.on('gallery:prev', this.showPrevItem.bind(this));
  }
  
  init() {
    this.galleryContainer = document.querySelector('.image-gallery');
    if (!this.galleryContainer) return;
    
    // Create masonry layout for gallery
    this.createMasonryLayout();
    
    // Initialize gallery items with animations
    this.initGalleryItems();
    
    // Add filter controls
    this.createFilterControls();
    
    // Add layout toggle
    this.createLayoutToggle();
    
    // Add hover effects
    this.addHoverEffects();
    
    // Enable drag-to-scroll in horizontal layout
    this.enableDragScroll();
    
    // Initialize Intersection Observer for lazy loading
    this.initLazyLoading();
  }
  
  createMasonryLayout() {
    // Create masonry layout container
    const masonryContainer = document.createElement('div');
    masonryContainer.className = 'gallery-masonry-container';
    
    // Replace existing gallery content with masonry layout
    if (this.galleryContainer) {
      const itemsHtml = Array.from(this.galleryContainer.querySelectorAll('img')).map(img => {
        const category = img.getAttribute('data-category') || this.getCategoryFromSrc(img.src);
        return `
          <div class="gallery-item" data-category="${category}">
            <div class="image-container">
              <img src="${img.src}" alt="${img.alt || 'Gallery Image'}" loading="lazy">
              <div class="item-overlay">
                <h3>${this.getTitleFromAlt(img.alt)}</h3>
                <span class="category-tag">${category}</span>
                <div class="item-actions">
                  <button class="action-button view-button" data-src="${img.src}">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="action-button like-button">
                    <i class="fas fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
      
      masonryContainer.innerHTML = itemsHtml;
      this.galleryContainer.innerHTML = '';
      this.galleryContainer.appendChild(masonryContainer);
    }
  }
  
  initGalleryItems() {
    // Get all gallery items
    this.items = Array.from(document.querySelectorAll('.gallery-item'));
    
    // Add click event listeners
    this.items.forEach((item, index) => {
      const viewButton = item.querySelector('.view-button');
      const likeButton = item.querySelector('.like-button');
      
      viewButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal(index);
      });
      
      likeButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleFavorite(index);
      });
      
      // Make the entire item clickable
      item.addEventListener('click', (e) => {
        // Only open modal if not clicking on buttons
        if (!e.target.closest('.action-button')) {
          this.openModal(index);
        }
      });
    });
  }
  
  createFilterControls() {
    // Create filter controls container
    const filterContainer = document.createElement('div');
    filterContainer.className = 'gallery-filter-controls';
    
    // Get unique categories
    const categories = this.getUniqueCategories();
    
    // Create filter buttons
    const filterButtonsHtml = `
      <button class="filter-button active" data-filter="all">All</button>
      ${categories.map(category => 
        `<button class="filter-button" data-filter="${category}">${this.formatCategory(category)}</button>`
      ).join('')}
    `;
    
    filterContainer.innerHTML = filterButtonsHtml;
    
    // Insert filter controls before gallery
    if (this.galleryContainer.parentNode) {
      this.galleryContainer.parentNode.insertBefore(filterContainer, this.galleryContainer);
    }
    
    // Add event listeners to filter buttons
    this.filterButtons = Array.from(document.querySelectorAll('.filter-button'));
    this.filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        this.filterGallery(filter);
        
        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });
  }
  
  createLayoutToggle() {
    // Create layout toggle
    const layoutToggle = document.createElement('div');
    layoutToggle.className = 'gallery-layout-toggle';
    layoutToggle.innerHTML = `
      <button class="layout-button active" data-layout="grid">
        <i class="fas fa-th"></i>
      </button>
      <button class="layout-button" data-layout="masonry">
        <i class="fas fa-th-large"></i>
      </button>
      <button class="layout-button" data-layout="horizontal">
        <i class="fas fa-grip-lines"></i>
      </button>
    `;
    
    // Add to filter container
    const filterContainer = document.querySelector('.gallery-filter-controls');
    if (filterContainer) {
      filterContainer.appendChild(layoutToggle);
    }
    
    // Add event listeners
    const layoutButtons = Array.from(document.querySelectorAll('.layout-button'));
    layoutButtons.forEach(button => {
      button.addEventListener('click', () => {
        const layout = button.dataset.layout;
        this.changeLayout(layout);
        
        // Update active button
        layoutButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });
  }
  
  getUniqueCategories() {
    const categories = this.items.map(item => item.dataset.category);
    return [...new Set(categories)].filter(Boolean);
  }
  
  formatCategory(category) {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  
  filterGallery(filter) {
    this.currentFilter = filter;
    
    gsap.to('.gallery-masonry-container', {
      opacity: 0,
      y: 20,
      duration: 0.3,
      onComplete: () => {
        this.items.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
        
        gsap.to('.gallery-masonry-container', {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.1
        });
      }
    });
  }
  
  changeLayout(layout) {
    this.currentLayout = layout;
    
    const container = document.querySelector('.gallery-masonry-container');
    if (!container) return;
    
    // Remove previous layout classes
    container.classList.remove('grid-layout', 'masonry-layout', 'horizontal-layout');
    
    // Add new layout class
    container.classList.add(`${layout}-layout`);
    
    // Apply layout specific styling
    if (layout === 'horizontal') {
      this.enableDragScroll();
    } else {
      this.disableDragScroll();
    }
    
    // Re-animate items
    gsap.from('.gallery-item', {
      opacity: 0,
      y: 30,
      duration: 0.5,
      stagger: 0.05,
      delay: 0.2
    });
  }
  
  enableDragScroll() {
    const container = document.querySelector('.gallery-masonry-container');
    if (!container || this.currentLayout !== 'horizontal') return;
    
    let isDragging = false;
    let startX;
    let scrollLeft;
    
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.classList.add('grabbing');
    });
    
    container.addEventListener('mouseleave', () => {
      isDragging = false;
      container.classList.remove('grabbing');
    });
    
    container.addEventListener('mouseup', () => {
      isDragging = false;
      container.classList.remove('grabbing');
    });
    
    container.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    });
  }
  
  disableDragScroll() {
    const container = document.querySelector('.gallery-masonry-container');
    if (!container) return;
    
    container.classList.remove('grabbing');
    
    // Remove event listeners (simplified)
    container.onmousedown = null;
    container.onmouseleave = null;
    container.onmouseup = null;
    container.onmousemove = null;
  }
  
  addHoverEffects() {
    this.items.forEach(item => {
      const image = item.querySelector('img');
      const overlay = item.querySelector('.item-overlay');
      
      // Set up GSAP hover animation
      item.addEventListener('mouseenter', () => {
        gsap.to(overlay, {
          opacity: 1,
          duration: 0.3
        });
        
        gsap.to(image, {
          scale: 1.1,
          duration: 0.5
        });
      });
      
      item.addEventListener('mouseleave', () => {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3
        });
        
        gsap.to(image, {
          scale: 1,
          duration: 0.5
        });
      });
    });
  }
  
  initLazyLoading() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          const image = item.querySelector('img');
          
          if (image.dataset.src) {
            image.src = image.dataset.src;
            image.removeAttribute('data-src');
          }
          
          // Add animation when item comes into view
          gsap.fromTo(item, 
            { opacity: 0, y: 30 }, 
            { opacity: 1, y: 0, duration: 0.5 }
          );
          
          observer.unobserve(item);
        }
      });
    }, options);
    
    this.items.forEach(item => {
      observer.observe(item);
    });
  }
  
  openModal(index) {
    this.currentIndex = index;
    this.eventBus.emit('modal:open', {
      items: this.items.filter(item => 
        this.currentFilter === 'all' || 
        item.dataset.category === this.currentFilter
      ),
      index: this.findFilteredIndex(index)
    });
  }
  
  findFilteredIndex(originalIndex) {
    if (this.currentFilter === 'all') return originalIndex;
    
    // Find matching index in filtered items
    const visibleItems = this.items.filter(
      item => item.dataset.category === this.currentFilter
    );
    
    const originalItem = this.items[originalIndex];
    return visibleItems.findIndex(item => item === originalItem);
  }
  
  showNextItem() {
    const visibleItems = this.items.filter(item => 
      this.currentFilter === 'all' || 
      item.dataset.category === this.currentFilter
    );
    
    this.currentIndex = (this.currentIndex + 1) % visibleItems.length;
    this.eventBus.emit('modal:update', {
      index: this.currentIndex,
      items: visibleItems
    });
  }
  
  showPrevItem() {
    const visibleItems = this.items.filter(item => 
      this.currentFilter === 'all' || 
      item.dataset.category === this.currentFilter
    );
    
    this.currentIndex = (this.currentIndex - 1 + visibleItems.length) % visibleItems.length;
    this.eventBus.emit('modal:update', {
      index: this.currentIndex,
      items: visibleItems
    });
  }
  
  toggleFavorite(index) {
    const item = this.items[index];
    const likeButton = item.querySelector('.like-button');
    
    item.classList.toggle('favorited');
    likeButton.classList.toggle('active');
    
    // Animate heart
    if (item.classList.contains('favorited')) {
      gsap.fromTo(likeButton, 
        { scale: 1 }, 
        { scale: 1.5, duration: 0.2, yoyo: true, repeat: 1 }
      );
      
      // Add favorite to application state
      this.eventBus.emit('favorite:add', {
        src: item.querySelector('img').src,
        category: item.dataset.category
      });
    } else {
      // Remove from favorites
      this.eventBus.emit('favorite:remove', {
        src: item.querySelector('img').src
      });
    }
  }
  
  getCategoryFromSrc(src) {
    // Extract category from image name
    const filename = src.split('/').pop();
    
    if (filename.includes('rv')) return 'radhe-krishna';
    if (filename.includes('bs')) return 'bhagwan-shiva';
    if (filename.includes('s')) return 'shiva';
    if (filename.includes('n')) return 'nature';
    if (filename.includes('rp')) return 'radha-priya';
    if (filename.includes('k')) return 'krishna';
    
    return 'other';
  }
  
  getTitleFromAlt(alt) {
    if (!alt) return 'Gallery Image';
    
    // Capitalize each word
    return alt.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  handleStateChange(state) {
    if (state.filterCategory !== this.currentFilter) {
      this.filterGallery(state.filterCategory);
    }
    
    if (state.currentView !== this.currentLayout) {
      this.changeLayout(state.currentView);
    }
  }
} 