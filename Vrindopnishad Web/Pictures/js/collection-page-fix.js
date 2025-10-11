// Collection data - will be populated from JSON
let collectionsData = {};
const dataUrl = "https://imbajrangi.github.io/Company/Vrindopnishad%20Web/class/json/collections_data.json";

// Collection generation
function initializeCollections() {
    if (collectionsData.featured) generateCollectionItems('featured-slider', collectionsData.featured.items || collectionsData.featured);
    if (collectionsData.popular) generateCollectionItems('popular-slider', collectionsData.popular.items || collectionsData.popular);
    if (collectionsData.nature) generateCollectionItems('nature-slider', collectionsData.nature.items || collectionsData.nature);
    if (collectionsData.anime) generateCollectionItems('anime-slider', collectionsData.anime.items || collectionsData.anime);
    if (collectionsData.architecture) generateCollectionItems('architecture-slider', collectionsData.architecture.items || collectionsData.architecture);
}

// Fixed header background rotation
// function initializeHeaderBackground() {
//     const headerBgs = document.querySelectorAll('.header-bg');
//     if (headerBgs.length === 0) {
//         console.log('No header backgrounds found - skipping rotation');
//         return;
//     }
    
//     let currentBg = 0;

//     function changeHeaderBackground() {
//         // Remove active class from current background
//         if (headerBgs[currentBg]) {
//             headerBgs[currentBg].classList.remove('active');
//         }
        
//         // Move to next background
//         currentBg = (currentBg + 1) % headerBgs.length;
        
//         // Add active class to new background
//         if (headerBgs[currentBg]) {
//             headerBgs[currentBg].classList.add('active');
//         }
//     }

//     // Start the interval
//     setInterval(changeHeaderBackground, 5000);
// }

function generateCollectionItems(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return;
    }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
        console.warn(`No items for ${containerId}`);
        container.innerHTML = '<p style="padding: 2rem; text-align: center;">No items available</p>';
        return;
    }
    
    container.innerHTML = '';

    items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'collection-item loading';
        itemElement.setAttribute('data-category', item.category || '');
        itemElement.setAttribute('data-id', item.id || index);
        itemElement.style.backgroundImage = `url(${item.image})`;
        
        itemElement.innerHTML = `
            <div class="item-content">
                <h3 class="item-title">${item.title || 'Untitled'}</h3>
                <p class="item-description">${item.description || ''}</p>
                <div class="item-stats">
                    <span class="item-count">
                        <i class="fas fa-images"></i>
                        ${item.count || item.itemCount || 0} images
                    </span>
                    ${item.rating ? `
                        <span class="item-rating">
                            <i class="fas fa-star"></i>
                            ${item.rating.toFixed(1)}
                        </span>
                    ` : ''}
                    ${item.views ? `
                        <span class="item-views">
                            <i class="fas fa-eye"></i>
                            ${item.views.toLocaleString()}
                        </span>
                    ` : ''}
                </div>
                ${containerId === 'featured-slider' && item.category ? `<span class="category-tag">${item.category}</span>` : ''}
            </div>
        `;

        // Add click handler for popup
        itemElement.addEventListener('click', () => {
            openPopup(item);
        });

        container.appendChild(itemElement);

        // Preload image
        const img = new Image();
        img.src = item.image;
        img.onload = () => {
            itemElement.classList.remove('loading');
        };
        img.onerror = () => {
            itemElement.classList.remove('loading');
            itemElement.classList.add('error');
        };

        // Fallback for loading state
        setTimeout(() => {
            itemElement.classList.remove('loading');
        }, 3000);
    });
}

// Header scroll effect
// function initializeHeaderScroll() {
//     const header = document.getElementById('header');
//     if (!header) {
//         console.error('Header not found');
//         return;
//     }
    
//     let lastScrollPosition = 0;

//     window.addEventListener('scroll', () => {
//         const currentScroll = window.pageYOffset;
        
//         if (currentScroll > lastScrollPosition && currentScroll > 100) {
//             header.classList.add('scrolled');
//         } else {
//             header.classList.remove('scrolled');
//         }
        
//         lastScrollPosition = currentScroll;
//     });
// }

// Slider functionality
function initializeSliders() {
    document.querySelectorAll('.slider-container').forEach(container => {
        const slider = container.querySelector('.items-slider');
        const leftBtn = container.querySelector('.scroll-btn.left');
        const rightBtn = container.querySelector('.scroll-btn.right');
        
        if (!slider || !leftBtn || !rightBtn) return;
        
        let isScrolling = false;
        const scrollAmount = slider.offsetWidth * 0.8;
        
        leftBtn.addEventListener('click', () => {
            if (isScrolling) return;
            isScrolling = true;
            
            slider.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
            
            setTimeout(() => {
                isScrolling = false;
            }, 300);
        });
        
        rightBtn.addEventListener('click', () => {
            if (isScrolling) return;
            isScrolling = true;
            
            slider.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
            
            setTimeout(() => {
                isScrolling = false;
            }, 300);
        });
        
        // Update button states
        function updateButtonStates() {
            const isAtStart = slider.scrollLeft <= 0;
            const isAtEnd = slider.scrollLeft >= (slider.scrollWidth - slider.clientWidth);
            
            leftBtn.style.opacity = isAtStart ? '0.5' : '1';
            rightBtn.style.opacity = isAtEnd ? '0.5' : '1';
            leftBtn.disabled = isAtStart;
            rightBtn.disabled = isAtEnd;
        }
        
        updateButtonStates();
        slider.addEventListener('scroll', updateButtonStates);
        window.addEventListener('resize', updateButtonStates);
    });
}

// Load collections data from JSON
async function loadCollectionsData() {
    try {
        console.log('Loading collections data from:', dataUrl);
        const response = await fetch(dataUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Raw data loaded:', data);
        
        // Check if data has collections property
        if (data.collections) {
            collectionsData = data.collections;
        } else {
            // Try to use the data directly
            collectionsData = data;
        }
        
        console.log('Processed collections data:', collectionsData);

        // Update other sections
        if (data.heroSection) updateHeroSection(data.heroSection);
        if (data.siteConfig) updateSiteConfig(data.siteConfig);
        if (data.navigation) updateNavigation(data.navigation);
        
        return true;
    } catch (error) {
        console.error('Error loading collections data:', error);
        
        // Try fallback data structure
        console.log('Attempting to use fallback data structure...');
        collectionsData = {
            featured: [],
            popular: [],
            nature: [],
            anime: [],
            architecture: []
        };
        
        return false;
    }
}

// Update hero section content
function updateHeroSection(heroData) {
    if (!heroData) return;
    
    const heroSection = document.querySelector('.hero-section');
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    
    if (heroData.backgroundImage && heroSection) {
        heroSection.style.backgroundImage = `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%), url('${heroData.backgroundImage}')`;
    }
    
    if (heroTitle) heroTitle.textContent = heroData.title;
    if (heroDescription) heroDescription.textContent = heroData.description;
}

// Update site configuration
function updateSiteConfig(config) {
    if (!config) return;
    
    const siteName = document.querySelector('.logo h1');
    const siteIcon = document.querySelector('.logo i');
    
    if (siteName) siteName.textContent = config.siteName;
    if (siteIcon) siteIcon.className = config.siteIcon;
    
    if (config.siteName) {
        document.title = config.siteName + ' - Collection';
    }
}

// Update navigation menu
function updateNavigation(navItems) {
    if (!navItems || !Array.isArray(navItems) || navItems.length === 0) return;
    
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    navMenu.innerHTML = navItems.map(item => `
        <a href="${item.href}" class="nav-item ${item.active ? 'active' : ''}">${item.name}</a>
    `).join('');
}

// Popup functions
function openPopup(item) {
    const modal = document.getElementById('popup-modal');
    const hero = document.getElementById('popup-hero');
    
    if (!modal || !hero) {
        console.error('Popup elements not found');
        return;
    }
    
    // Set hero background
    hero.style.backgroundImage = `url(${item.image})`;
    
    // Update content safely
    const popupTitle = document.querySelector('.popup-title');
    const popupRating = document.querySelector('.popup-rating span');
    const popupYear = document.querySelector('.popup-year');
    const popupCount = document.querySelector('.popup-count');
    const popupCategory = document.querySelector('.popup-category');
    const popupDescription = document.querySelector('.popup-description');
    
    if (popupTitle) popupTitle.textContent = item.title || 'Untitled';
    if (popupRating) popupRating.textContent = item.rating ? item.rating.toFixed(1) : '4.5';
    if (popupYear) popupYear.textContent = item.year || '2024';
    if (popupCount) popupCount.textContent = `${item.count || item.itemCount || 0} items`;
    if (popupCategory) popupCategory.textContent = item.category || 'Collection';
    if (popupDescription) popupDescription.textContent = item.description || 'No description available';
    
    // Update stats
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = item.count || item.itemCount || 0;
        statNumbers[1].textContent = item.views ? formatNumber(item.views) : '0';
        statNumbers[2].textContent = Math.floor(Math.random() * 1000);
    }
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePopup() {
    const modal = document.getElementById('popup-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// Initialize popup
function initPopup() {
    const closeBtn = document.getElementById('popup-close');
    const modal = document.getElementById('popup-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closePopup);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePopup();
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePopup();
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded - Initializing...');
    
    // First load the data
    const dataLoaded = await loadCollectionsData();
    
    // Initialize all components regardless of data loading
    initializeHeaderScroll();
    initializeHeaderBackground();
    initializeSliders();
    initPopup();
    
    if (dataLoaded && Object.keys(collectionsData).length > 0) {
        console.log('Initializing collections with data');
        initializeCollections();
    } else {
        // Show error message if data loading failed
        console.error('Failed to load collections data');
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <h2>Error Loading Collections</h2>
                    <p>Sorry, we couldn't load the collections data. Please try refreshing the page.</p>
                    <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; cursor: pointer;">
                        Refresh Page
                    </button>
                </div>
            `;
        }
    }
});