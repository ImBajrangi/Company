// Simple fix to add to your existing collection-page.js
// Just replace the click handler in your generateCollectionItems function

// Add this popup data (add to top of your file)
const popupData = {
    "sacred-temples": {
        title: "Sacred Temples",
        description: "Explore magnificent temples and sacred architecture from around the world. This collection features ancient and modern spiritual buildings that showcase humanity's dedication to the divine through architectural excellence.",
        year: "2024",
        category: "Architecture",
        stats: { items: 45, views: 15600, likes: 1200 }
    },
    "divine-portraits": {
        title: "Divine Portraits", 
        description: "Beautiful artwork featuring deities and divine figures from various spiritual traditions. Each piece captures the essence of divinity through masterful artistic interpretation.",
        year: "2024",
        category: "Art",
        stats: { items: 67, views: 23400, likes: 1890 }
    },
    "spiritual-landscapes": {
        title: "Spiritual Landscapes",
        description: "Sacred places and holy sites captured in their natural beauty. These landscapes hold deep spiritual significance and offer viewers a glimpse into the divine presence in nature.",
        year: "2024", 
        category: "Nature",
        stats: { items: 34, views: 18200, likes: 1456 }
    }
};

// Add popup functions
function openPopup(item) {
    const modal = document.getElementById('popup-modal');
    const hero = document.getElementById('popup-hero');
    
    if (!modal || !hero) return;
    
    // Get extended data or use item data
    const popupInfo = popupData[item.id] || {
        title: item.title,
        description: item.description,
        year: "2024",
        category: item.category || "Collection",
        stats: { items: item.count || 0, views: item.views || 0, likes: 0 }
    };
    
    // Set hero background
    hero.style.backgroundImage = `url(${item.image})`;
    
    // Update content
    document.querySelector('.popup-title').textContent = popupInfo.title;
    document.querySelector('.popup-rating span').textContent = item.rating ? item.rating.toFixed(1) : '4.5';
    document.querySelector('.popup-year').textContent = popupInfo.year;
    document.querySelector('.popup-count').textContent = `${popupInfo.stats.items} items`;
    document.querySelector('.popup-category').textContent = popupInfo.category;
    document.querySelector('.popup-description').textContent = popupInfo.description;
    
    // Update stats
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = popupInfo.stats.items;
        statNumbers[1].textContent = formatNumber(popupInfo.stats.views);
        statNumbers[2].textContent = formatNumber(popupInfo.stats.likes);
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

// Initialize popup close handlers
function initPopup() {
    const modal = document.getElementById('popup-modal');
    const closeBtn = document.getElementById('popup-close');
    
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
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closePopup();
        }
    });
}

// MODIFY your existing generateCollectionItems function
// Change the click handler from this:
/*
itemElement.addEventListener('click', () => {
    console.log(`Clicked on: ${item.title} (${item.id})`);
    // Add navigation logic here
});
*/

// To this:
itemElement.addEventListener('click', () => {
    openPopup(item);
});

// Add this to your existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', async () => {
    // ... your existing code ...
    
    // Add this line after your existing initializations
    initPopup();
});