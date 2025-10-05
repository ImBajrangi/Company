const imageDataStructure = {
  "images": [
    {
      "id": 1,
      "src": "https://i.postimg.cc/y6nMpbfG/1.avif",
      "alt": "Anime wallpaper",
      "category": "anime",
      "title": "Beautiful Anime Scene",
      "description": "A stunning anime landscape wallpaper",
      "tags": ["anime", "landscape", "colorful"],
      "featured": false
    },
    {
      "id": 2,
      "src": "https://i.postimg.cc/D0CRWSJh/2.avif",
      "alt": "Shri Rasik Bihari Ji",
      "category": "spiritual",
      "title": "Shri Rasik Bihari Ji",
      "description": "Divine spiritual artwork",
      "tags": ["spiritual", "divine", "art"],
      "featured": true
    }
    // ... more images
  ],
  "categories": [
    { "id": "all", "name": "All", "count": 0 },
    { "id": "anime", "name": "Anime", "count": 0 },
    { "id": "landscape", "name": "Landscape", "count": 0 },
    { "id": "nature", "name": "Nature", "count": 0 },
    { "id": "spiritual", "name": "Spiritual", "count": 0 }
  ]
};

// Dynamic Image Gallery Generator Class
class ImageGalleryGenerator {
    constructor(jsonFilePath = 'images.json') {
        this.jsonFilePath = jsonFilePath;
        this.imageData = null;
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.masonryContainer = null;
        this.lightboxImages = [];
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadImageData();
            this.setupContainers();
            this.generateFilterButtons();
            this.generateImageGrid();
            this.initializeEventListeners();
            this.updateImageCount();
            
            // Show loading complete notification
            if (typeof showNotification === 'function') {
                showNotification(`Gallery loaded successfully! ${this.imageData.images.length} images found.`, 'success');
            }
        } catch (error) {
            console.error('Error initializing gallery:', error);
            this.handleLoadError(error);
        }
    }
    
    async loadImageData() {
        try {
            const response = await fetch(this.jsonFilePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.imageData = await response.json();
            
            // Validate data structure
            if (!this.imageData.images || !Array.isArray(this.imageData.images)) {
                throw new Error('Invalid JSON structure: images array not found');
            }
            
            // Calculate category counts
            this.calculateCategoryCounts();
            
        } catch (error) {
            // Fallback to embedded sample data for demo purposes
            console.warn('Could not load JSON file, using sample data:', error.message);
            this.imageData = this.getSampleData();
            this.calculateCategoryCounts();
        }
    }
    
    getSampleData() {
        return {
            "images": [
                {
                    "id": 1,
                    "src": "https://i.postimg.cc/y6nMpbfG/1.avif",
                    "alt": "Anime wallpaper",
                    "category": "anime",
                    "title": "Beautiful Anime Scene",
                    "description": "A stunning anime landscape wallpaper",
                    "tags": ["anime", "landscape", "colorful"],
                    "featured": false
                },
                {
                    "id": 2,
                    "src": "https://i.postimg.cc/D0CRWSJh/2.avif",
                    "alt": "Shri Rasik Bihari Ji",
                    "category": "spiritual",
                    "title": "Shri Rasik Bihari Ji",
                    "description": "Divine spiritual artwork",
                    "tags": ["spiritual", "divine", "art"],
                    "featured": true
                },
                {
                    "id": 3,
                    "src": "https://i.postimg.cc/ncz6yGgh/3.avif",
                    "alt": "Anime wallpaper",
                    "category": "anime",
                    "title": "Anime Character",
                    "description": "Beautiful anime character illustration",
                    "tags": ["anime", "character", "art"],
                    "featured": false
                },
                {
                    "id": 4,
                    "src": "https://i.postimg.cc/d3Qzt20n/4.avif",
                    "alt": "Landscape wallpaper",
                    "category": "landscape",
                    "title": "Mountain Landscape",
                    "description": "Breathtaking mountain scenery",
                    "tags": ["landscape", "mountains", "nature"],
                    "featured": false
                },
                {
                    "id": 5,
                    "src": "https://i.postimg.cc/V6TFMKV6/12.avif",
                    "alt": "Nature wallpaper",
                    "category": "nature",
                    "title": "Forest Scene",
                    "description": "Peaceful forest environment",
                    "tags": ["nature", "forest", "peaceful"],
                    "featured": false
                }
            ],
            "categories": [
                { "id": "all", "name": "All", "count": 0 },
                { "id": "anime", "name": "Anime", "count": 0 },
                { "id": "landscape", "name": "Landscape", "count": 0 },
                { "id": "nature", "name": "Nature", "count": 0 },
                { "id": "spiritual", "name": "Spiritual", "count": 0 }
            ]
        };
    }
    
    calculateCategoryCounts() {
        // Reset counts
        this.imageData.categories.forEach(cat => cat.count = 0);
        
        // Count images per category
        this.imageData.images.forEach(image => {
            const category = this.imageData.categories.find(cat => cat.id === image.category);
            if (category) {
                category.count++;
            }
        });
        
        // Set 'all' count to total images
        const allCategory = this.imageData.categories.find(cat => cat.id === 'all');
        if (allCategory) {
            allCategory.count = this.imageData.images.length;
        }
    }
    
    setupContainers() {
        this.masonryContainer = document.querySelector('.masonry-layout');
        if (!this.masonryContainer) {
            console.error('Masonry container not found');
            return;
        }
        
        // Clear existing content except lightbox
        const existingCards = this.masonryContainer.querySelectorAll('.image-card');
        existingCards.forEach(card => card.remove());
    }
    
    generateFilterButtons() {
        const filterButtonsContainer = document.querySelector('.filter-buttons');
        if (!filterButtonsContainer) {
            console.warn('Filter buttons container not found');
            return;
        }
        
        // Clear existing buttons
        filterButtonsContainer.innerHTML = '';
        
        // Generate buttons from categories
        this.imageData.categories.forEach((category, index) => {
            const button = document.createElement('button');
            button.className = `filter-btn magnetic ${index === 0 ? 'active' : ''}`;
            button.setAttribute('data-magnetic-strength', '0.3');
            button.setAttribute('data-filter', category.id);
            button.innerHTML = `${category.name} ${category.count > 0 ? `(${category.count})` : ''}`;
            
            // Add click event
            button.addEventListener('click', (e) => {
                this.handleFilterClick(e, category.id);
            });
            
            filterButtonsContainer.appendChild(button);
        });
    }
    
    generateImageGrid() {
        if (!this.masonryContainer) return;
        
        // Clear existing image cards
        const existingCards = this.masonryContainer.querySelectorAll('.image-card');
        existingCards.forEach(card => card.remove());
        
        // Reset lightbox images array
        this.lightboxImages = [];
        
        // Generate image cards
        this.imageData.images.forEach((image, index) => {
            const imageCard = this.createImageCard(image, index);
            this.masonryContainer.appendChild(imageCard);
            this.lightboxImages.push(image);
        });
        
        // Refresh ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
        
        // Re-initialize animations if available
        if (typeof initializeAnimations === 'function') {
            initializeAnimations();
        }
        
        // Re-initialize magnetic effects if available
        if (typeof initializeMagneticEffect === 'function') {
            initializeMagneticEffect();
        }
    }
    
    createImageCard(image, index) {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.setAttribute('data-category', image.category);
        card.setAttribute('data-image-id', image.id);
        card.setAttribute('data-index', index);
        
        // Add featured class if applicable
        if (image.featured) {
            card.classList.add('featured');
        }
        
        // Add search data attributes for better filtering
        card.setAttribute('data-title', image.title || '');
        card.setAttribute('data-description', image.description || '');
        card.setAttribute('data-tags', (image.tags || []).join(' '));
        
        card.innerHTML = `
            <img src="${image.src}" alt="${image.alt}" loading="lazy">
            <div class="image-overlay">
                <div class="image-actions">
                    <button class="action-btn like-btn magnetic" data-magnetic-strength="0.6" title="Like">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn view-btn magnetic" data-magnetic-strength="0.6" title="View">
                        <i class="fas fa-expand"></i>
                    </button>
                    <button class="action-btn download-btn magnetic" data-magnetic-strength="0.6" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
                ${image.title ? `<div class="image-info">
                    <h3 class="image-title">${image.title}</h3>
                    ${image.description ? `<p class="image-description">${image.description}</p>` : ''}
                </div>` : ''}
            </div>
        `;
        
        // Add event listeners
        this.addImageCardEventListeners(card, image, index);
        
        return card;
    }
    
    addImageCardEventListeners(card, image, index) {
        // Like button
        const likeBtn = card.querySelector('.like-btn');
        likeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleLike(image.id, likeBtn);
        });
        
        // View button
        const viewBtn = card.querySelector('.view-btn');
        viewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleView(index);
        });
        
        // Download button
        const downloadBtn = card.querySelector('.download-btn');
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleDownload(image);
        });
        
        // Card click for lightbox
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.image-actions')) {
                this.handleView(index);
            }
        });
    }
    
    handleLike(imageId, button) {
        // Toggle like state
        const isLiked = button.classList.contains('liked');
        
        if (isLiked) {
            button.classList.remove('liked');
            button.querySelector('i').classList.remove('fas');
            button.querySelector('i').classList.add('far');
            if (typeof showNotification === 'function') {
                showNotification('Removed from favorites', 'info');
            }
        } else {
            button.classList.add('liked');
            button.querySelector('i').classList.remove('far');
            button.querySelector('i').classList.add('fas');
            if (typeof showNotification === 'function') {
                showNotification('Added to favorites!', 'success');
            }
        }
        
        // Save to localStorage
        this.saveLikeState(imageId, !isLiked);
        
        // Animation
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(button, 
                { scale: 1 }, 
                { 
                    scale: 1.3, 
                    duration: 0.1, 
                    yoyo: true, 
                    repeat: 1,
                    ease: "power2.inOut"
                }
            );
        }
    }
    
    handleView(index) {
        // Update lightbox with current images and open at specified index
        if (typeof openLightbox === 'function') {
            openLightbox(index);
        } else {
            // Fallback lightbox implementation
            this.openCustomLightbox(index);
        }
    }
    
    handleDownload(image) {
        if (typeof downloadImage === 'function') {
            const filename = image.title ? image.title.replace(/\s+/g, '_').toLowerCase() : image.alt.replace(/\s+/g, '_').toLowerCase();
            downloadImage(image.src, filename);
        } else {
            // Fallback download
            window.open(image.src, '_blank');
        }
    }
    
    openCustomLightbox(index) {
        const lightbox = document.querySelector('.lightbox');
        const lightboxImg = document.querySelector('.lightbox-img');
        const lightboxCaption = document.querySelector('.lightbox-caption');
        
        if (!lightbox || !lightboxImg) return;
        
        const image = this.lightboxImages[index];
        if (!image) return;
        
        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt;
        
        if (lightboxCaption) {
            lightboxCaption.innerHTML = `
                ${image.title ? `<h3>${image.title}</h3>` : ''}
                ${image.description ? `<p>${image.description}</p>` : ''}
            `;
        }
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Store current index for navigation
        lightbox.setAttribute('data-current-index', index);
    }
    
    handleFilterClick(event, filterValue) {
        // Remove active class from all buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        event.target.classList.add('active');
        
        // Update current filter
        this.currentFilter = filterValue;
        
        // Apply filter
        this.applyFilters();
        
        // Show notification
        if (typeof showNotification === 'function') {
            const category = this.imageData.categories.find(cat => cat.id === filterValue);
            const categoryName = category ? category.name : filterValue;
            showNotification(`Showing ${categoryName} images`, 'info');
        }
    }
    
    applyFilters() {
        const imageCards = document.querySelectorAll('.image-card');
        let visibleCount = 0;
        
        imageCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const title = card.getAttribute('data-title').toLowerCase();
            const description = card.getAttribute('data-description').toLowerCase();
            const tags = card.getAttribute('data-tags').toLowerCase();
            const searchText = this.searchTerm.toLowerCase();
            
            // Check category filter
            const categoryMatch = this.currentFilter === 'all' || category === this.currentFilter;
            
            // Check search filter
            const searchMatch = !this.searchTerm || 
                                title.includes(searchText) || 
                                description.includes(searchText) || 
                                tags.includes(searchText) ||
                                card.querySelector('img').alt.toLowerCase().includes(searchText);
            
            // Show/hide card
            if (categoryMatch && searchMatch) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
                visibleCount++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Update lightbox images array with filtered images
        this.updateLightboxImages();
        
        // Show count
        console.log(`Showing ${visibleCount} images`);
        
        // Refresh ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }
    
    updateLightboxImages() {
        // Update lightbox images to only include visible images
        this.lightboxImages = [];
        const visibleCards = document.querySelectorAll('.image-card[style*="opacity: 1"], .image-card:not([style])');
        
        visibleCards.forEach(card => {
            const index = parseInt(card.getAttribute('data-index'));
            if (!isNaN(index) && this.imageData.images[index]) {
                this.lightboxImages.push(this.imageData.images[index]);
            }
        });
    }
    
    initializeEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                this.applyFilters();
            });
        }
        
        // Load like states
        this.loadLikeStates();
    }
    
    saveLikeState(imageId, isLiked) {
        let likedImages = JSON.parse(localStorage.getItem('likedImages') || '[]');
        
        if (isLiked && !likedImages.includes(imageId)) {
            likedImages.push(imageId);
        } else if (!isLiked) {
            likedImages = likedImages.filter(id => id !== imageId);
        }
        
        localStorage.setItem('likedImages', JSON.stringify(likedImages));
    }
    
    loadLikeStates() {
        const likedImages = JSON.parse(localStorage.getItem('likedImages') || '[]');
        
        likedImages.forEach(imageId => {
            const card = document.querySelector(`[data-image-id="${imageId}"]`);
            if (card) {
                const likeBtn = card.querySelector('.like-btn');
                if (likeBtn) {
                    likeBtn.classList.add('liked');
                    likeBtn.querySelector('i').classList.remove('far');
                    likeBtn.querySelector('i').classList.add('fas');
                }
            }
        });
    }
    
    updateImageCount() {
        // Update document title with image count
        const originalTitle = document.title;
        const imageCount = this.imageData.images.length;
        document.title = `${originalTitle} (${imageCount} images)`;
    }
    
    handleLoadError(error) {
        console.error('Gallery loading error:', error);
        
        // Show error notification
        if (typeof showNotification === 'function') {
            showNotification('Failed to load gallery data. Using sample images.', 'warning');
        }
        
        // You could also create a fallback UI here
        const masonryContainer = document.querySelector('.masonry-layout');
        if (masonryContainer && this.imageData.images.length === 0) {
            masonryContainer.innerHTML = `
                <div class="error-message" style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 2rem;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    color: var(--text-light);
                ">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <h3>Could not load gallery images</h3>
                    <p>Please check that the JSON file exists and is properly formatted.</p>
                </div>
            `;
        }
    }
    
    // Public methods for external use
    reload() {
        this.init();
    }
    
    addImage(imageData) {
        this.imageData.images.push(imageData);
        this.calculateCategoryCounts();
        this.generateFilterButtons();
        this.generateImageGrid();
    }
    
    removeImage(imageId) {
        this.imageData.images = this.imageData.images.filter(img => img.id !== imageId);
        this.calculateCategoryCounts();
        this.generateFilterButtons();
        this.generateImageGrid();
    }
    
    getImageData() {
        return this.imageData;
    }
    
    getLikedImages() {
        const likedIds = JSON.parse(localStorage.getItem('likedImages') || '[]');
        return this.imageData.images.filter(img => likedIds.includes(img.id));
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        window.imageGallery = new ImageGalleryGenerator('images.json');
    }, 100);
});

// Example usage and utility functions
window.GalleryUtils = {
    // Export current gallery data to JSON
    exportGalleryData() {
        if (window.imageGallery) {
            const data = window.imageGallery.getImageData();
            const dataStr = JSON.stringify(data, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = 'gallery-export.json';
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        }
    },
    
    // Get statistics about the gallery
    getStats() {
        if (window.imageGallery) {
            const data = window.imageGallery.getImageData();
            const likedImages = window.imageGallery.getLikedImages();
            
            return {
                totalImages: data.images.length,
                likedImages: likedImages.length,
                categories: data.categories.map(cat => ({
                    name: cat.name,
                    count: cat.count
                }))
            };
        }
        return null;
    }
};
