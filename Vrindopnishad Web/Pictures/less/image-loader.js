class ImageGallery {
    constructor() {
        this.images = [];
        this.categories = [];
        this.currentFilter = 'All';
        this.searchQuery = '';
        this.currentImageIndex = 0;
        this.masonryContainer = document.getElementById('masonry-conta    showLoading(show) {
        if (!this.loadingIndicator) return;
        
        if (show) {
            this.loadingIndicator.style.display = 'flex';
            this.loadingIndicator.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Loading gallery...</p>
                <p class="loading-tip" style="font-size: 0.9rem; color: rgba(255,255,255,0.7); margin-top: 0.5rem;">
                    This may take a moment while we load and optimize your images
                </p>
            `;
        } else {
            // Use opacity for smooth transition
            this.loadingIndicator.style.opacity = '0';
            setTimeout(() => {
                this.loadingIndicator.style.display = 'none';
                this.loadingIndicator.style.opacity = '1';
            }, 300);
        }
    }

    showError(message) {
        if (!this.masonryContainer) return;
        
        const errorHtml = `
            <div class="error-message" style="
                text-align: center;
                padding: 3rem 2rem;
                color: #721c24;
                background-color: #f8d7da;
                border: 1px solid #f5c6cb;
                border-radius: 10px;
                margin: 2rem auto;
                max-width: 600px;
                animation: fadeIn 0.3s ease-in-out;
            ">
                <i class="fas fa-exclamation-circle" style="
                    font-size: 4rem;
                    color: #dc3545;
                    margin-bottom: 1.5rem;
                    display: block;
                "></i>
                <h3 style="margin-bottom: 1rem; color: #721c24;">Oops! Something went wrong</h3>
                <p style="margin: 1rem 0; font-size: 1.1rem; line-height: 1.5;">${message}</p>
                <button onclick="location.reload()" class="filter-btn magnetic" data-magnetic-strength="0.3" style="
                    margin-top: 1.5rem;
                    padding: 0.8rem 1.5rem;
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                ">
                    <i class="fas fa-sync-alt"></i> Try Again
                </button>
            </div>      this.loadingIndicator = document.getElementById('loading-indicator');
        this.filterButtons = document.getElementById('filter-buttons');
        this.searchInput = document.getElementById('search-input');
        this.lightbox = document.querySelector('.lightbox');
        this.lightboxImg = document.querySelector('.lightbox-img');
        this.lightboxCaption = document.querySelector('.lightbox-caption');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.closeLightboxBtn = document.querySelector('.close-lightbox');

        this.initialize();
    }

    async initialize() {
        try {
            // Show loading indicator immediately
            this.showLoading(true);
            console.log('Initializing gallery...');

            // Load image data first
            await this.loadImageData();
            
            // Only proceed with initialization if we have data
            if (this.images && this.images.length > 0) {
                console.log('Setting up gallery components...');
                this.setupEventListeners();
                this.createFilterButtons();
                this.renderImages();
                console.log('Gallery initialization complete');
            } else {
                throw new Error('No images were loaded');
            }
            
        } catch (error) {
            console.error('Failed to initialize gallery:', error);
            this.showError('Failed to load gallery. Please check your internet connection and try again.');
        } finally {
            // Ensure loading indicator is hidden
            this.showLoading(false);
        }
    }

    async loadImageData() {
        try {
            this.showLoading(true);
            console.log('Attempting to load image data...');
            
            // Try to load from different possible paths
            const paths = [
                './image-data.json',
                'image-data.json',
                '/class/json/images_json.json',
                '../image-data.json',
                '../../image-data.json',
                '/integrated Folders/Bhakt Pic Collection/image-data.json',
                '/Users/mr.bajrangi/Library/Mobile Documents/com~apple~CloudDocs/Visual Studio Code/Website/integrated Folders/Bhakt Pic Collection/image-data.json'
            ];
            
            let jsonData = null;
            let loadedPath = null;
            
            for (const path of paths) {
                try {
                    console.log(`Trying path: ${path}`);
                    const response = await fetch(path);
                    
                    if (!response.ok) {
                        console.warn(`HTTP error loading from ${path}: ${response.status}`);
                        continue;
                    }
                    
                    const data = await response.json();
                    
                    // Validate data structure
                    if (!data.images || !Array.isArray(data.images)) {
                        console.warn(`Invalid data structure from ${path}: missing images array`);
                        continue;
                    }
                    
                    jsonData = data;
                    loadedPath = path;
                    console.log('Successfully loaded JSON data from:', path);
                    break;
                    
                } catch (err) {
                    console.warn(`Failed to load from ${path}:`, err.message);
                }
            }
            
            if (!jsonData) {
                throw new Error('Failed to load image data from any path. Please check your internet connection and try again.');
            }
            
            // Set categories with fallback
            this.categories = jsonData.categories || ['All'];
            if (!Array.isArray(this.categories)) {
                console.warn('Invalid categories format, using default');
                this.categories = ['All'];
            }
            
            // Set images
            this.images = jsonData.images;
            console.log(`Loaded ${this.images.length} images from ${loadedPath}`);
            
            // Preload images
            console.log('Starting image preload...');
            await Promise.allSettled(this.images.map(img => this.preloadImage(img.src)));
            console.log('Image preload complete');
            
        } catch (error) {
            console.error('Error loading gallery:', error);
            throw new Error(`Failed to load image data: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }

    preloadImage(url) {
        return new Promise((resolve) => {
            // If the URL is empty or invalid, resolve immediately
            if (!url || url.includes('undefined')) {
                console.warn('Invalid image URL:', url);
                resolve();
                return;
            }

            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => {
                console.warn(`Failed to load image: ${url}, using placeholder`);
                resolve();
            };
            img.src = url;
        });
    }

    setupEventListeners() {
        // Search input
        this.searchInput.addEventListener('input', () => {
            this.searchQuery = this.searchInput.value.toLowerCase();
            this.renderImages();
        });

        // Lightbox navigation
        this.prevBtn.addEventListener('click', () => this.navigateLightbox('prev'));
        this.nextBtn.addEventListener('click', () => this.navigateLightbox('next'));
        this.closeLightboxBtn.addEventListener('click', () => this.closeLightbox());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            
            switch(e.key) {
                case 'ArrowLeft': this.navigateLightbox('prev'); break;
                case 'ArrowRight': this.navigateLightbox('next'); break;
                case 'Escape': this.closeLightbox(); break;
            }
        });
    }

    createFilterButtons() {
        this.filterButtons.innerHTML = this.categories.map(category => `
            <button class="filter-btn magnetic ${category.id === 'all' ? 'active' : ''}" 
                    data-category="${category.id}"
                    data-magnetic-strength="0.3">
                ${category.name}
            </button>
        `).join('');

        this.filterButtons.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.currentFilter = e.target.dataset.category;
                this.updateActiveFilter();
                this.renderImages();
            }
        });
    }

    updateActiveFilter() {
        this.filterButtons.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === this.currentFilter);
        });
    }

    renderImages() {
        const filteredImages = this.filterImages();
        
        const imagesHTML = filteredImages.map((image, index) => {
            const fallbackUrl = "https://via.placeholder.com/400x300.jpg?text=Image+Not+Found";
            return `
                <div class="image-card" data-category="${image.category}">
                    <img src="${image.src || fallbackUrl}" 
                         alt="${image.alt}"
                         loading="lazy"
                         onerror="this.onerror=null; this.src='${fallbackUrl}';">
                    <div class="image-overlay">
                        <div class="image-actions">
                            <button class="action-btn magnetic heart-btn" data-magnetic-strength="0.6" title="Like">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button class="action-btn view-btn magnetic" data-magnetic-strength="0.6" title="View" onclick="gallery.openLightbox(${index})">
                                <i class="fas fa-expand"></i>
                            </button>
                            <button class="action-btn download-btn magnetic" data-magnetic-strength="0.6" title="Download">
                                <i class="fas fa-download"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Clear existing content except lightbox
        const lightbox = this.masonryContainer.querySelector('.lightbox');
        this.masonryContainer.innerHTML = imagesHTML;
        if (lightbox) this.masonryContainer.appendChild(lightbox);

        // Reinitialize magnetic effect
        if (typeof initializeMagneticEffect === 'function') {
            initializeMagneticEffect();
        }
    }

    filterImages() {
        return this.images.filter(image => {
            const matchesFilter = this.currentFilter === 'All' || image.category === this.currentFilter;
            const matchesSearch = this.searchQuery === '' || 
                                image.title.toLowerCase().includes(this.searchQuery) ||
                                image.description.toLowerCase().includes(this.searchQuery) ||
                                (image.tags && image.tags.some(tag => tag.toLowerCase().includes(this.searchQuery)));
            return matchesFilter && matchesSearch;
        });
    }

    openLightbox(index) {
        this.currentImageIndex = index;
        this.updateLightboxContent();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    navigateLightbox(direction) {
        const filteredImages = this.filterImages();
        if (direction === 'prev') {
            this.currentImageIndex = (this.currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
        } else {
            this.currentImageIndex = (this.currentImageIndex + 1) % filteredImages.length;
        }
        this.updateLightboxContent();
    }

    updateLightboxContent() {
        const image = this.filterImages()[this.currentImageIndex];
        this.lightboxImg.src = image.url;
        this.lightboxCaption.textContent = `${image.title} - ${image.description}`;
    }

    showLoading(show) {
        this.loadingIndicator.style.display = show ? 'flex' : 'none';
    }

    showError(message) {
        const errorHtml = `
            <div class="error-message" style="text-align: center; padding: 2rem; color: #fff;">
                <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: #ff6b6b; margin-bottom: 1rem;"></i>
                <p style="margin: 1rem 0; font-size: 1.2rem;">${message}</p>
                <p style="margin: 0.5rem 0; font-size: 0.9rem; color: rgba(255,255,255,0.7);">
                    Check the browser console for detailed error information.
                </p>
                <button onclick="gallery.initialize()" class="retry-btn magnetic" 
                    data-magnetic-strength="0.3"
                    style="padding: 0.8rem 1.5rem; margin-top: 1rem; background: rgba(255,255,255,0.1); 
                           border: 1px solid rgba(255,255,255,0.2); color: #fff; border-radius: 8px; 
                           cursor: pointer; transition: all 0.3s ease;">
                    Try Again
                </button>
            </div>
        `;
        this.masonryContainer.innerHTML = errorHtml;
    }
}

// Initialize gallery
const gallery = new ImageGallery();
