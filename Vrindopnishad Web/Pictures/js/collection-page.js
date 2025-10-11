// Collection data - will be populated from JSON
// let collectionsData = {};
const dataUrl = "https://imbajrangi.github.io/Company/Vrindopnishad%20Web/class/json/collections_data.json";

// Search functionality
function initializeSearch() {
    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    let searchTimeout = null;

    function toggleSearch() {
        searchOverlay.classList.toggle('active');
        if (searchOverlay.classList.contains('active')) {
            searchInput.focus();
        }
    }

    function handleSearch(e) {
        clearTimeout(searchTimeout);
        const query = e.target.value.toLowerCase();
        
        searchTimeout = setTimeout(() => {
            if (query.length < 2) {
                searchResults.innerHTML = '';
                return;
            }

            const results = Object.entries(collectionsData)
                .flatMap(([category, items]) => 
                    items.map(item => ({...item, category}))
                )
                .filter(item => 
                    item.title.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query)
                );

            searchResults.innerHTML = results.length > 0 
                ? results.map(item => `
                    <div class="search-result-item" data-category="${item.category}">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <span class="category-tag">${item.category}</span>
                    </div>
                `).join('')
                : '<p>No results found</p>';
        }, 300);
    }

    searchToggle.addEventListener('click', toggleSearch);
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            toggleSearch();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            toggleSearch();
        }
    });
    searchInput.addEventListener('input', handleSearch);
}

// Theme functionality
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    const root = document.documentElement;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('dark-mode', prefersDark);
        icon.className = prefersDark ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Theme toggle function
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';

        // Add transition class for smooth color changes
        root.style.setProperty('--transition', 'all 0.3s ease');
        setTimeout(() => {
            root.style.removeProperty('--transition');
        }, 300);
    });
}

// Collection generation
function initializeCollections() {
    if (collectionsData.featured) generateCollectionItems('featured-slider', collectionsData.featured.items);
    if (collectionsData.popular) generateCollectionItems('popular-slider', collectionsData.popular.items);
    if (collectionsData.nature) generateCollectionItems('nature-slider', collectionsData.nature.items);
    if (collectionsData.anime) generateCollectionItems('anime-slider', collectionsData.anime.items);
    if (collectionsData.architecture) generateCollectionItems('architecture-slider', collectionsData.architecture.items);
}

// Simple header background rotation
const headerBgs = document.querySelectorAll('.header-bg');
let currentBg = 0;

function changeHeaderBackground() {
    headerBgs[currentBg].classList.remove('active');
    currentBg = (currentBg + 1) % headerBgs.length;
    headerBgs[currentBg].classList.add('active');
}

setInterval(changeHeaderBackground, 5000);  // Change every 5 seconds

function generateCollectionItems(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container || !items?.length) return;
    
    container.innerHTML = '';

    items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'collection-item loading';
        itemElement.setAttribute('data-category', item.category || '');
        itemElement.setAttribute('data-id', item.id || '');
        itemElement.style.backgroundImage = `url(${item.image})`;
        
        itemElement.innerHTML = `
            <div class="item-content">
                <h3 class="item-title">${item.title}</h3>
                <p class="item-description">${item.description}</p>
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
        
        // // Add click handler
        // itemElement.addEventListener('click', () => {
        //     console.log(`Clicked on: ${item.title} (${item.id})`);
        //     // Add navigation logic here
        // });

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
function initializeHeaderScroll() {
    let lastScrollPosition = 0;
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScrollPosition && currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollPosition = currentScroll;
    });
}

// Slider functionality
function initializeSliders() {
    document.querySelectorAll('.scroll-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const direction = btn.classList.contains('left') ? 'left' : 'right';
            const sliderId = btn.closest('.slider-container').id;
            scrollSlider(sliderId, direction);
        });
    });
}

function scrollSlider(sliderId, direction) {
    const slider = document.querySelector(`#${sliderId} .items-slider`);
    if (!slider) return;
    
    const scrollAmount = slider.offsetWidth * 0.8;
    slider.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
    });
}

// Load collections data from JSON
async function loadCollectionsData() {
    try {
        console.log('Starting to load collections data...');
        // Use the correct path relative to the HTML file
        const response = await fetch(dataUrl);
        console.log('Response:', response);
        const data = await response.json();
        console.log('Loaded data:', data);
        
        // Transform data into the format we need
        collectionsData = data.collections;
        console.log('Transformed data:', collectionsData);

        // Update hero section
        updateHeroSection(data.heroSection);
        
        // Update site config
        updateSiteConfig(data.siteConfig);
        
        // Update navigation
        updateNavigation(data.navigation);
        
        return true;
    } catch (error) {
        console.error('Error loading collections data:', error);
        return false;
    }
}

// Update hero section content
function updateHeroSection(heroData) {
    if (!heroData) return;
    
    const heroSection = document.querySelector('.hero-section');
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    
    if (heroData.backgroundImage) {
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
    
    document.title = config.siteName + ' - Collection';
}

// Update navigation menu
function updateNavigation(navItems) {
    if (!navItems?.length) return;
    
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    navMenu.innerHTML = navItems.map(item => `
        <a href="${item.href}" class="nav-item ${item.active ? 'active' : ''}">${item.name}</a>
    `).join('');
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // First load the data
    const dataLoaded = await loadCollectionsData();
    
    if (dataLoaded) {
        // Then initialize all components
        initializeSearch();
        initializeTheme();
        initializeCollections();
        initializeHeaderScroll();
        initializeSliders();
        initPopup();
    } else {
        // Show error message if data loading failed
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <h2>Error Loading Collections</h2>
                    <p>Sorry, we couldn't load the collections data. Please try refreshing the page.</p>
                </div>
            `;
        }
    }
});

// Popup functions
function openPopup(item) {
    const modal = document.getElementById('popup-modal');
    const hero = document.getElementById('popup-hero');
    
    if (!modal || !hero) return;
    
    // Set hero background
    hero.style.backgroundImage = `url(${item.image})`;
    
    // Update content
    document.querySelector('.popup-title').textContent = item.title;
    document.querySelector('.popup-rating span').textContent = item.rating ? item.rating.toFixed(1) : '4.5';
    document.querySelector('.popup-year').textContent = '2024';
    document.querySelector('.popup-count').textContent = `${item.count || item.itemCount || 0} items`;
    document.querySelector('.popup-category').textContent = item.category || 'Collection';
    document.querySelector('.popup-description').textContent = item.description;
    
    // Update stats
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = item.count || item.itemCount || 0;
        statNumbers[1].textContent = item.views ? formatNumber(item.views) : '0';
        statNumbers[2].textContent = Math.floor(Math.random() * 1000); // Random likes
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
document.getElementById('popup-close')?.addEventListener('click', closePopup);
document.getElementById('popup-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'popup-modal') closePopup();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePopup();
});