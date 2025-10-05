// Collection Folders JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initializeCollectionFolders();
});

function initializeCollectionFolders() {
    // Initialize search functionality
    const searchInput = document.getElementById('search-input');
    const collectionCards = document.querySelectorAll('.collection-card');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        collectionCards.forEach(card => {
            const cardName = card.querySelector('h3').textContent.toLowerCase();
            const shouldShow = cardName.includes(searchTerm);
            card.style.display = shouldShow ? 'block' : 'none';
        });
    });

    // Initialize theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        // Save theme preference
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        
        // Update icon
        const icon = themeToggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    // Load saved theme
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        const icon = themeToggle.querySelector('i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    // Initialize magnetic effect
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const strength = parseFloat(elem.getAttribute('data-magnetic-strength')) || 0.5;
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            elem.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });

        elem.addEventListener('mouseleave', () => {
            elem.style.transform = 'translate(0px, 0px)';
        });
    });

    // Load collection data from JSON
    loadCollectionData();
}

async function loadCollectionData() {
    try {
        const response = await fetch('/class/json/collections.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        updateCollectionInfo(data);
    } catch (error) {
        console.error('Error loading collection data:', error);
    }
}

function updateCollectionInfo(data) {
    const folders = document.querySelectorAll('.collection-folder');
    
    folders.forEach(folder => {
        const category = folder.dataset.category;
        const collectionData = data[category];
        
        if (collectionData) {
            const countElement = folder.querySelector('.folder-info p');
            countElement.textContent = `${collectionData.count} images`;
            
            // Update preview images if available
            const previewImages = folder.querySelectorAll('.preview-grid img');
            collectionData.previews.forEach((preview, index) => {
                if (previewImages[index]) {
                    previewImages[index].src = preview.url;
                    previewImages[index].alt = preview.alt;
                }
            });
        }
    });
}