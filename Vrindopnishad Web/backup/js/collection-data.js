// Collection data and functionality
let collectionsData = null;

// Load JSON data
async function loadJsonData() {
    try {
        const response = await fetch('/class/json/collections_data.json');
        const data = await response.json();
        collectionsData = data.collections;
        updateSiteConfig(data.siteConfig);
        return data;
    } catch (error) {
        console.error('Error loading collections data:', error);
        return null;
    }
}

// Update site configuration
function updateSiteConfig(config) {
    // Update logo and site name
    document.title = config.siteName + ' Collection';
    const logoIcon = document.querySelector('.logo i');
    const logoText = document.querySelector('.logo h1');
    if (logoIcon) logoIcon.className = config.siteIcon;
    if (logoText) logoText.textContent = config.siteName;

    // Update hero section
    const heroTitle = document.querySelector('.hero-title');
    const heroDesc = document.querySelector('.hero-description');
    if (heroTitle) heroTitle.textContent = config.tagline;
    if (heroDesc) heroDesc.textContent = config.description;
}

// Load collections into sliders
function loadCollections() {
    if (!collectionsData) return;

    const sections = ['featured', 'popular', 'nature', 'anime', 'architecture'];
    sections.forEach(section => {
        const slider = document.getElementById(`${section}-slider`);
        if (!slider || !collectionsData[section]) return;

        generateCollectionItems(slider, collectionsData[section].items);
    });
}

// Generate collection items
function generateCollectionItems(container, items) {
    container.innerHTML = '';
    
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'collection-item';
        itemElement.style.backgroundImage = `url('${item.image}')`;
        
        itemElement.innerHTML = `
            <span class="category-tag">${item.category}</span>
            <div class="item-content">
                <h3 class="item-title">${item.title}</h3>
                <p class="item-description">${item.description}</p>
                <div class="item-stats">
                    <span class="item-count">
                        <i class="fas fa-image"></i>${item.count}
                    </span>
                    <span class="item-views">
                        <i class="fas fa-eye"></i>${item.views || 0}
                    </span>
                </div>
            </div>
        `;
        
        itemElement.addEventListener('click', () => openPopup(item));
        container.appendChild(itemElement);
    });
}

// Open popup with item details
function openPopup(item) {
    const modal = document.getElementById('popup-modal');
    const hero = document.getElementById('popup-hero');
    const title = document.querySelector('.popup-title');
    const rating = document.querySelector('.popup-rating span');
    const count = document.querySelector('.popup-count');
    const category = document.querySelector('.popup-category');
    const description = document.querySelector('.popup-description');
    const stats = document.querySelectorAll('.stat-number');

    if (!modal || !hero || !title || !rating || !count || !category || !description) return;

    hero.style.backgroundImage = `url('${item.image}')`;
    title.textContent = item.title;
    rating.textContent = item.rating || '4.5';
    count.textContent = `${item.count} items`;
    category.textContent = item.category;
    description.textContent = item.description;

    // Update stats
    if (stats.length >= 3) {
        stats[0].textContent = item.count;
        stats[1].textContent = item.views || '0';
        stats[2].textContent = Math.floor((item.views || 0) * 0.7); // Example likes calculation
    }

    modal.classList.add('active');
}

// Initialize sliders functionality
function initializeSliders() {
    document.querySelectorAll('.slider-container').forEach(container => {
        const slider = container.querySelector('.items-slider');
        const leftBtn = container.querySelector('.scroll-btn.left');
        const rightBtn = container.querySelector('.scroll-btn.right');
        if (!slider || !leftBtn || !rightBtn) return;

        const scrollAmount = slider.clientWidth * 0.8;

        leftBtn.addEventListener('click', () => {
            slider.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        rightBtn.addEventListener('click', () => {
            slider.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        // Show/hide scroll buttons based on scroll position
        slider.addEventListener('scroll', () => {
            leftBtn.style.display = slider.scrollLeft > 0 ? 'flex' : 'none';
            rightBtn.style.display = 
                slider.scrollLeft < (slider.scrollWidth - slider.clientWidth - 1) 
                ? 'flex' 
                : 'none';
        });

        // Initial check
        leftBtn.style.display = 'none';
        rightBtn.style.display = 
            slider.scrollWidth > slider.clientWidth 
            ? 'flex' 
            : 'none';
    });
}