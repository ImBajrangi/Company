// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Global variables
let imageData = {};
let filteredImages = [];
let currentFilter = 'all';
let currentIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    // Load images from JSON first, then initialize everything else
    loadImagesFromJSON().then(() => {
        initializeAll();
    });
});

// Load images from JSON file
async function loadImagesFromJSON() {
    const loadingIndicator = document.getElementById('loading-indicator');
    
    try {
        // Show loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.display = 'flex';
        }
        
        // Fetch the JSON data
        const response = await fetch('/class/json/images_json.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        imageData = await response.json();
        
        // Validate the data structure
        if (!imageData.images || !Array.isArray(imageData.images)) {
            throw new Error('Invalid JSON structure: missing images array');
        }
        
        // Update category counts
        updateCategoryCounts();
        
        // Generate filter buttons
        generateFilterButtons();
        
        // Generate image cards
        generateImageCards();
        
        // Initialize all functionality after images are loaded
        initializeAll();
        
        // Hide loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        
        // Show success notification
        showNotification(`Loaded ${imageData.images.length} images successfully!`, 'success');
        
    } catch (error) {
        console.error('Error loading images:', error);
        
        // Hide loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        
        // Show error message
        showErrorMessage(error.message);
        
        // Show error notification
        showNotification('Failed to load images. Please check your connection.', 'error');
    }
}

// Update category counts based on loaded images
function updateCategoryCounts() {
    if (!imageData.categories || !imageData.images) return;
    
    // Reset all counts
    imageData.categories.forEach(category => {
        category.count = 0;
    });
    
    // Count images per category
    imageData.images.forEach(image => {
        const category = imageData.categories.find(cat => cat.id === image.category);
        if (category) {
            category.count++;
        }
    });
    
    // Update 'all' count
    const allCategory = imageData.categories.find(cat => cat.id === 'all');
    if (allCategory) {
        allCategory.count = imageData.images.length;
    }
}

// Generate filter buttons dynamically
function generateFilterButtons() {
    const filterContainer = document.getElementById('filter-buttons');
    if (!filterContainer || !imageData.categories) return;
    
    // Clear existing buttons
    filterContainer.innerHTML = '';
    
    // Generate buttons for each category
    imageData.categories.forEach((category, index) => {
        const button = document.createElement('button');
        button.className = `filter-btn magnetic ${index === 0 ? 'active' : ''}`;
        button.setAttribute('data-magnetic-strength', '0.3');
        button.setAttribute('data-filter', category.id);
        button.textContent = `${category.name} (${category.count})`;
        
        filterContainer.appendChild(button);
    });
}

// Generate image cards dynamically
function generateImageCards() {
    const masonryContainer = document.getElementById('masonry-container');
    const loadingIndicator = document.getElementById('loading-indicator');
    
    if (!masonryContainer || !imageData.images) return;
    
    // Clear existing content (except loading indicator and lightbox)
    const existingCards = masonryContainer.querySelectorAll('.image-card');
    existingCards.forEach(card => card.remove());
    
    // Create document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    // Generate image cards
    imageData.images.forEach((image, index) => {
        const imageCard = createImageCard(image, index);
        fragment.appendChild(imageCard);
    });
    
    // Insert before lightbox (lightbox should be the last element)
    const lightbox = masonryContainer.querySelector('.lightbox');
    if (lightbox) {
        masonryContainer.insertBefore(fragment, lightbox);
    } else {
        masonryContainer.appendChild(fragment);
    }
    
    // Store filtered images for lightbox navigation
    filteredImages = [...imageData.images];
}

// Create individual image card
function createImageCard(image, index) {
    const imageCard = document.createElement('div');
    imageCard.className = 'image-card';
    imageCard.setAttribute('data-category', image.category);
    imageCard.setAttribute('data-image-id', image.id);
    imageCard.setAttribute('data-index', index);
    
    imageCard.innerHTML = `
        <img src="${image.src}" alt="${image.alt}" loading="lazy">
        <div class="image-overlay">
            <div class="image-actions">
                <button class="action-btn magnetic" data-magnetic-strength="0.6" title="Like">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="action-btn view-btn magnetic" data-magnetic-strength="0.6" title="View">
                    <i class="fas fa-expand"></i>
                </button>
                <button class="action-btn download-btn magnetic" data-magnetic-strength="0.6" title="Download">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add hover animations
    imageCard.addEventListener('mouseenter', () => {
        gsap.to(imageCard, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    imageCard.addEventListener('mouseleave', () => {
        gsap.to(imageCard, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    return imageCard;
}

// Show error message when loading fails
function showErrorMessage(errorText) {
    const masonryContainer = document.getElementById('masonry-container');
    if (!masonryContainer) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Failed to Load Images</h3>
            <p>${errorText}</p>
            <button class="retry-btn" onclick="location.reload()">
                <i class="fas fa-redo"></i> Retry
            </button>
        </div>
    `;
    
    // Add some basic styling
    errorDiv.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 400px;
        width: 100%;
        text-align: center;
        color: var(--text-light);
    `;
    
    masonryContainer.appendChild(errorDiv);
}

// Initialize all functionality after images are loaded
function initializeAll() {
    // Initialize masonry layout
    initializeMasonryLayout();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize filter functionality
    initializeFilters();
    
    // Initialize lightbox
    initializeLightbox();
    
    // Initialize theme toggle
    initializeThemeToggle();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize download functionality
    initializeDownload();
    
    // Initialize tools menu
    initializeToolsMenu();
    
    // Initialize magnetic effects
    initializeMagneticEffect();
    
    // Initialize heart button functionality
    initializeHeartButtons();
}

// Initialize masonry layout
function initializeMasonryLayout() {
    const imageCards = document.querySelectorAll('.image-card');
    imageCards.forEach(card => {
        // Load image and trigger layout update
        const img = card.querySelector('img');
        if (img) {
            img.onload = () => {
                // Trigger a reflow for the masonry layout
                const masonryLayout = document.querySelector('.masonry-layout');
                if (masonryLayout) {
                    masonryLayout.style.display = 'none';
                    masonryLayout.offsetHeight; // Force reflow
                    masonryLayout.style.display = '';
                }
            };
        }
    });
}

// Animation functions
function initializeAnimations() {
    const imageCards = document.querySelectorAll('.image-card');
    
    imageCards.forEach((card) => {
        gsap.fromTo(card, {
            opacity: 0,
            y: 50,
            rotateX: 10,
        }, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
                trigger: card,
                start: "top bottom-=100",
                end: "top center",
                toggleActions: "play none none none",
                markers: false,
                scrub: 0.5,
            }
        });
    });
}

// Filter functionality
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filterValue = button.getAttribute('data-filter');
            currentFilter = filterValue;
            
            // Filter images
            filterImageCards(filterValue);
            
            // Refresh ScrollTrigger
            ScrollTrigger.refresh();
        });
    });
}

// Filter image cards
function filterImageCards(filterValue) {
    const imageCards = document.querySelectorAll('.image-card');
    
    // Update filtered images array for lightbox
    if (filterValue === 'all') {
        filteredImages = [...imageData.images];
    } else {
        filteredImages = imageData.images.filter(image => image.category === filterValue);
    }
    
    imageCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Lightbox functionality
function initializeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    const lightboxContent = document.querySelector('.lightbox-content');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // Add download button to lightbox content
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'lightbox-download-btn';
    downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
    downloadBtn.title = 'Download image';
    lightboxContent.appendChild(downloadBtn);
    
    let currentIndex = 0;
    
    // Open lightbox when view button is clicked
    document.addEventListener('click', (e) => {
        if (e.target.closest('.view-btn')) {
            const imageCard = e.target.closest('.image-card');
            const imageId = parseInt(imageCard.getAttribute('data-image-id'));
            
            // Find the image in filtered images
            const imageIndex = filteredImages.findIndex(img => img.id === imageId);
            if (imageIndex !== -1) {
                openLightbox(imageIndex);
            }
        }
    });
    
    // Open lightbox function
    function openLightbox(index) {
        currentIndex = index;
        const image = filteredImages[index];
        
        if (!image) return;
        
        lightboxImg.setAttribute('src', image.src);
        lightboxCaption.textContent = image.alt;
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Initialize magnetic effect after lightbox is opened
        setTimeout(() => {
            addMagneticEffectToLightboxButtons();
        }, 300);
    }
    
    // Download image from lightbox
    downloadBtn.addEventListener('click', () => {
        const image = filteredImages[currentIndex];
        if (!image) return;
        
        const fileName = image.alt.replace(/\s+/g, '_').toLowerCase() || `image_${image.id}`;
        
        // Handle the download using the download helper function
        downloadImage(image.src, fileName);
        
        // Add animation to the button
        gsap.from(downloadBtn, {
            rotate: 360,
            scale: 0.5,
            duration: 0.5,
            ease: "back.out(1.7)"
        });
    });
    
    // Close lightbox
    closeLightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Click outside to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Next image
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % filteredImages.length;
        const image = filteredImages[currentIndex];
        
        if (!image) return;
        
        // Add transition effect
        gsap.to(lightboxImg, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                lightboxImg.setAttribute('src', image.src);
                lightboxCaption.textContent = image.alt;
                gsap.to(lightboxImg, {
                    opacity: 1,
                    duration: 0.2
                });
            }
        });
    });
    
    // Previous image
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
        const image = filteredImages[currentIndex];
        
        if (!image) return;
        
        // Add transition effect
        gsap.to(lightboxImg, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                lightboxImg.setAttribute('src', image.src);
                lightboxCaption.textContent = image.alt;
                gsap.to(lightboxImg, {
                    opacity: 1,
                    duration: 0.2
                });
            }
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'ArrowRight') {
            nextBtn.click();
        } else if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'Escape') {
            closeLightbox.click();
        }
    });
}

// Theme toggle functionality
function initializeThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    if (!themeToggle || !themeIcon) return;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Toggle theme
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        // Toggle icon
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
        
        // Add animation to body
        gsap.from('body', {
            opacity: 0.5,
            duration: 0.3,
            ease: "power1.out"
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase().trim();
        const imageCards = document.querySelectorAll('.image-card');
        
        if (searchValue === '') {
            // If search is empty, show all images based on current filter
            filterImageCards(currentFilter);
            return;
        }
        
        // Filter images based on search and current category
        let searchFilteredImages = [];
        
        imageCards.forEach(card => {
            const imageId = parseInt(card.getAttribute('data-image-id'));
            const image = imageData.images.find(img => img.id === imageId);
            
            if (!image) return;
            
            const matchesSearch = image.alt.toLowerCase().includes(searchValue) ||
                                image.title?.toLowerCase().includes(searchValue) ||
                                image.description?.toLowerCase().includes(searchValue);
            
            const matchesCategory = currentFilter === 'all' || image.category === currentFilter;
            
            if (matchesSearch && matchesCategory) {
                searchFilteredImages.push(image);
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Update filtered images for lightbox
        filteredImages = searchFilteredImages;
        
        // Refresh ScrollTrigger
        ScrollTrigger.refresh();
    });
}

// Download functionality
function initializeDownload() {
    // Use event delegation for dynamically created download buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.download-btn')) {
            e.preventDefault();
            e.stopPropagation();
            
            const downloadBtn = e.target.closest('.download-btn');
            const imageCard = downloadBtn.closest('.image-card');
            const imageId = parseInt(imageCard.getAttribute('data-image-id'));
            
            // Find the image data
            const image = imageData.images.find(img => img.id === imageId);
            if (!image) return;
            
            const fileName = image.alt.replace(/\s+/g, '_').toLowerCase() || `image_${image.id}`;
            
            // Use the download helper function
            downloadImage(image.src, fileName);
            
            // Add animation to the button
            gsap.from(downloadBtn, {
                rotate: 360,
                scale: 0.5,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
        }
    });
}

// Initialize heart button functionality
function initializeHeartButtons() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.heart-btn')) {
            e.preventDefault();
            e.stopPropagation();
            
            const heartBtn = e.target.closest('.heart-btn');
            const heartIcon = heartBtn.querySelector('i');
            
            // Toggle heart state
            if (heartIcon.classList.contains('fas')) {
                // Already liked - unlike
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                heartBtn.style.color = '';
                showNotification('Removed from favorites', 'info');
            } else {
                // Not liked - like
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                heartBtn.style.color = '#ff6b6b';
                showNotification('Added to favorites!', 'success');
                
                // Add heart animation
                gsap.from(heartBtn, {
                    scale: 0.5,
                    duration: 0.5,
                    ease: "back.out(1.7)"
                });
            }
        }
    });
}

// Helper function to download images
function downloadImage(imgSrc, fileName) {
    // Create notification
    showNotification('Downloading image...', 'info');
    
    // For testing purposes, we'll check if manual download is needed
    const isAllowedURL = checkAllowedURL(imgSrc);
    
    if (!isAllowedURL) {
        // Images from these domains need special handling
        showNotification('Opening direct download link...', 'info');
        window.open(imgSrc, '_blank');
        return;
    }
    
    // First try the direct approach which works in most cases for modern browsers
    directDownload(imgSrc, fileName);
}

// Check if URL is from a domain that allows CORS
function checkAllowedURL(url) {
    try {
        const hostname = new URL(url).hostname;
        // Some image services don't allow CORS, so we'll just open them in a new tab
        const disallowedDomains = [
            'alphacoders.com', 
            'images.alphacoders.com',
            'images2.alphacoders.com',
            'images3.alphacoders.com',
            'images4.alphacoders.com',
            'images5.alphacoders.com',
            'images6.alphacoders.com',
            'images7.alphacoders.com',
            'images8.alphacoders.com',
            'freepik.com',
            'img.freepik.com'
        ];
        
        return !disallowedDomains.some(domain => hostname.includes(domain));
    } catch (e) {
        console.error('Error checking URL:', e);
        return true; // Default to trying
    }
}

function directDownload(imgSrc, fileName) {
    // Create a temporary image element
    const tempImg = new Image();
    tempImg.crossOrigin = 'anonymous'; // Try to request CORS access
    
    tempImg.onload = function() {
        try {
            // Create canvas and draw image
            const canvas = document.createElement('canvas');
            canvas.width = tempImg.width;
            canvas.height = tempImg.height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(tempImg, 0, 0);
            
            // Try to get data URL
            const dataURL = canvas.toDataURL('image/png');
            
            // Check if we got a valid data URL (if not, it means CORS issues)
            if (dataURL.indexOf('data:image/png') === 0) {
                // Create download link with data URL
                const downloadLink = document.createElement('a');
                downloadLink.href = dataURL;
                downloadLink.download = `${fileName}_${Date.now()}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                
                showNotification('Download successful!', 'success');
            } else {
                throw new Error('Failed to get data URL - CORS issue');
            }
        } catch (error) {
            console.error('Canvas data URL error:', error);
            // Try proxy method
            proxyDownload(imgSrc, fileName);
        }
    };
    
    tempImg.onerror = function() {
        console.error('Failed to load image directly');
        // Try proxy method
        proxyDownload(imgSrc, fileName);
    };
    
    // Set source and attempt to load image
    tempImg.src = imgSrc;
    
    // If the image is already cached this might not trigger onload
    if (tempImg.complete || tempImg.complete === undefined) {
        tempImg.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        tempImg.src = imgSrc;
    }
}

function proxyDownload(imgSrc, fileName) {
    // Use a CORS proxy to bypass cross-origin restrictions
    const corsProxyUrl = 'https://api.allorigins.win/raw?url=';
    const proxyImgSrc = corsProxyUrl + encodeURIComponent(imgSrc);
    
    // Create a temporary image element to download via canvas
    const tempImg = new Image();
    tempImg.crossOrigin = 'anonymous';
    
    tempImg.onload = function() {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = tempImg.width;
        canvas.height = tempImg.height;
        
        // Draw image on canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(tempImg, 0, 0);
        
        // Convert to data URL and download
        try {
            canvas.toBlob(function(blob) {
                if (blob) {
                    // Create object URL from blob
                    const blobUrl = URL.createObjectURL(blob);
                    
                    // Create download link
                    const downloadLink = document.createElement('a');
                    downloadLink.href = blobUrl;
                    downloadLink.download = `${fileName}_${Date.now()}.png`;
                    document.body.appendChild(downloadLink);
                    
                    // Trigger download
                    downloadLink.click();
                    
                    // Clean up
                    setTimeout(() => {
                        URL.revokeObjectURL(blobUrl);
                        document.body.removeChild(downloadLink);
                    }, 100);
                    
                    showNotification('Download successful!', 'success');
                } else {
                    throw new Error('Failed to create blob');
                }
            }, 'image/png');
        } catch (error) {
            console.error('Canvas download error:', error);
            blobDownload(imgSrc, fileName);
        }
    };
    
    tempImg.onerror = function() {
        console.error('Failed to load image with CORS proxy');
        blobDownload(imgSrc, fileName);
    };
    
    // Set source with proxy
    try {
        tempImg.src = proxyImgSrc;
    } catch (error) {
        console.error('Error setting proxy source:', error);
        blobDownload(imgSrc, fileName);
    }
}

function blobDownload(imgSrc, fileName) {
    // Try using fetch with proper CORS headers
    fetch(imgSrc, {
        mode: 'cors',
        headers: {
            'Origin': window.location.origin
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob();
    })
    .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = `${fileName}_${Date.now()}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        
        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
            document.body.removeChild(downloadLink);
        }, 100);
        
        showNotification('Download successful!', 'success');
    })
    .catch(error => {
        console.error('Blob download error:', error);
        fallbackDownload(imgSrc, fileName);
    });
}

function fallbackDownload(imgSrc, fileName) {
    // Try image service proxy as last resort
    const imageServiceProxy = 'https://images.weserv.nl/?url=';
    
    // Encode the image URL for the proxy
    const encodedImgUrl = encodeURIComponent(imgSrc);
    const proxyUrl = imageServiceProxy + encodedImgUrl;
    
    // Create a fallback download link
    const downloadLink = document.createElement('a');
    downloadLink.href = proxyUrl;
    downloadLink.download = `${fileName}_${Date.now()}.png`;
    downloadLink.target = '_blank'; // Open in new tab as fallback
    document.body.appendChild(downloadLink);
    
    // Click to download or open
    downloadLink.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(downloadLink);
    }, 100);
    
    showNotification('Opening image in new tab. Please save manually.', 'info');
}

// Tools Menu functionality
function initializeToolsMenu() {
    const toolsIcon = document.querySelector('.tools-icon');
    const toolsMenu = document.querySelector('.tools-menu');
    const toolsMenuClose = document.querySelector('.tools-menu-close');
    const toolItems = document.querySelectorAll('.tool-item');
    
    if (!toolsIcon || !toolsMenu || !toolsMenuClose) return;
    
    // Open tools menu
    toolsIcon.addEventListener('click', () => {
        // Add animation to icon before opening menu
        toolsIcon.classList.add('pulse-animation');
        
        // Rotate icon when clicked
        toolsIcon.style.transform = 'rotate(90deg) scale(1.8)';
        
        // Delay opening the menu slightly for better UX
        setTimeout(() => {
            toolsMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }, 200);
    });
    
    // Close tools menu
    toolsMenuClose.addEventListener('click', () => {
        toolsMenu.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Remove pulse animation and reset rotation
        setTimeout(() => {
            toolsIcon.classList.remove('pulse-animation');
            toolsIcon.style.transform = '';
        }, 300);
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && toolsMenu.classList.contains('active')) {
            toolsMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            setTimeout(() => {
                toolsIcon.classList.remove('pulse-animation');
                toolsIcon.style.transform = '';
            }, 300);
        }
    });
    
    // Add hover rotation effect
    toolsIcon.addEventListener('mouseenter', () => {
        if (!toolsMenu.classList.contains('active')) {
            gsap.to(toolsIcon, {
                rotation: 300,
                scale: 1.15,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });
    
    toolsIcon.addEventListener('mouseleave', () => {
        if (!toolsMenu.classList.contains('active')) {
            gsap.to(toolsIcon, {
                rotation: -300,
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });
    
    // Handle tool item hover effects
    toolItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const bgColor = item.getAttribute('data-bg-color');
            const textColor = item.getAttribute('data-text-color');
            
            if (bgColor && textColor) {
                item.style.backgroundColor = bgColor;
                item.style.color = textColor;
                
                // Change icon color
                const icon = item.querySelector('.tool-icon i');
                if (icon) {
                    icon.style.color = textColor;
                }
                
                // Apply styles to child elements
                const h3 = item.querySelector('h3');
                const p = item.querySelector('p');
                
                if (h3) h3.style.color = textColor;
                if (p) p.style.color = textColor;
            }
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = '';
            item.style.color = '';
            
            // Reset icon color
            const icon = item.querySelector('.tool-icon i');
            if (icon) {
                icon.style.color = '';
            }
            
            // Reset styles for child elements
            const h3 = item.querySelector('h3');
            const p = item.querySelector('p');
            
            if (h3) h3.style.color = '';
            if (p) p.style.color = '';
        });
    });
}

// Magnetic effect for all elements
function initializeMagneticEffect() {
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(elem => {
        // Get magnetic strength attribute
        const strength = parseFloat(elem.getAttribute('data-magnetic-strength')) || 0.3;
        
        // Modify strength based on element type for better UX
        let adjustedStrength = strength;
        if (elem.classList.contains('logo')) {
            adjustedStrength = strength * 0.3; // Reduce effect for logo
        } else if (elem.classList.contains('search-box')) {
            adjustedStrength = strength * 0.2; // Reduce effect for search box
        } else if (elem.classList.contains('filter-btn')) {
            adjustedStrength = strength * 0.5; // Medium effect for filter buttons
        } else if (elem.classList.contains('social-link')) {
            adjustedStrength = strength * 0.4; // Medium effect for social links
        }
        
        // Disable hover effect entirely on mobile/touch devices
        if (window.matchMedia('(hover: none)').matches) {
            return;
        }
        
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;
            
            // Limit movement to avoid excessive animation
            const maxMove = 10 * adjustedStrength;
            const limitedX = Math.max(Math.min(relX * adjustedStrength, maxMove), -maxMove);
            const limitedY = Math.max(Math.min(relY * adjustedStrength, maxMove), -maxMove);
            
            gsap.to(elem, {
                duration: 0.3,
                x: limitedX,
                y: limitedY,
                ease: 'power2.out'
            });
        });
        
        elem.addEventListener('mouseleave', () => {
            gsap.to(elem, {
                duration: 0.7,
                x: 0,
                y: 0,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

// Add magnetic effect to lightbox buttons
function addMagneticEffectToLightboxButtons() {
    const magneticElements = document.querySelectorAll('.lightbox-btn, .close-lightbox, .lightbox-download-btn');
    
    magneticElements.forEach(elem => {
        let strength = 0.3;
        if (elem.classList.contains('close-lightbox')) {
            strength = 0.2;
        } else if (elem.classList.contains('lightbox-download-btn')) {
            strength = 0.25;
        }
        
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;
            
            const maxMove = 10;
            const limitedX = Math.max(Math.min(relX * strength, maxMove), -maxMove);
            const limitedY = Math.max(Math.min(relY * strength, maxMove), -maxMove);
            
            gsap.to(elem, {
                x: limitedX,
                y: limitedY,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        elem.addEventListener('mouseleave', () => {
            gsap.to(elem, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
}

// Notification function
function showNotification(message, type = 'info', duration = 3000) {
    // Check if notification container exists, if not create it
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Define notification title and icon based on type
    let title = 'Information';
    let icon = 'fa-info-circle';
    
    switch(type) {
        case 'success':
            title = 'Success';
            icon = 'fa-check-circle';
            break;
        case 'error':
            title = 'Error';
            icon = 'fa-exclamation-circle';
            break;
        case 'warning':
            title = 'Warning';
            icon = 'fa-exclamation-triangle';
            break;
        default:
            title = 'Information';
            icon = 'fa-info-circle';
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Create icon element
    const iconElement = document.createElement('div');
    iconElement.className = 'notification-icon';
    iconElement.innerHTML = `<i class="fas ${icon}"></i>`;
    
    // Create content container
    const contentElement = document.createElement('div');
    contentElement.className = 'notification-content';
    
    // Create title element
    const titleElement = document.createElement('div');
    titleElement.className = 'notification-title';
    titleElement.textContent = title;
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = 'notification-message';
    messageElement.textContent = message;
    
    // Assemble notification
    contentElement.appendChild(titleElement);
    contentElement.appendChild(messageElement);
    notification.appendChild(iconElement);
    notification.appendChild(contentElement);
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 600);
    }, duration);
}