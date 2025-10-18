document.addEventListener('DOMContentLoaded', () => {
    const DATA_URL = 'https://imbajrangi.github.io/Company/Vrindopnishad Web/class/json/collections_data.json';
    const container = document.getElementById('collection-container');
    const relatedContainer = document.getElementById('related-items');

    const getCollectionIdFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    };

    const findCollection = (data, id) => {
        for (const categoryKey in data.collections) {
            const category = data.collections[categoryKey];
            const foundItem = category.items.find(item => item.id === id);
            if (foundItem) {
                // Return a copy of the item with its category
                return { ...foundItem, category: category.title };
            }
        }
        return null;
    };
    
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);
    };

    const renderStars = (rating) => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    };

    const renderCollectionDetails = (item) => {
        // Mock data for demonstration as it's not in JSON
        const mockData = {
            price: 49999,
            relatedImages: [
                item.image,
                "https://placehold.co/600x600/1e1e1e/f5f5f5?text=Art+2",
                "https://placehold.co/600x600/1e1e1e/f5f5f5?text=Art+3",
                "https://placehold.co/600x600/1e1e1e/f5f5f5?text=Art+4",
            ]
        };

        container.innerHTML = `
            <div class="collection-detail-grid">
                <div class="collection-gallery">
                    <div class="main-image-wrapper">
                        <img src="${item.image}" alt="${item.title}" class="main-image" id="main-image">
                    </div>
                    <div class="thumbnail-grid" id="thumbnail-grid">
                        ${mockData.relatedImages.map((img, index) => `
                            <div class="thumbnail-wrapper ${index === 0 ? 'active' : ''}" data-image="${img}">
                                <img src="${img}" alt="Thumbnail ${index + 1}" class="thumbnail-img">
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="collection-info">
                    <p class="category">${item.category || 'Collection'}</p>
                    <h1 class="title">${item.title}</h1>
                    <div class="rating">
                        <span class="stars">${renderStars(item.rating)}</span>
                        <span>(${item.rating.toFixed(1)})</span>
                    </div>
                    <p class="description">${item.description}. This exquisite collection features ${item.count} hand-picked items, celebrating the essence of timeless artistry and spiritual significance.</p>
                    <div class="price-box">
                        <p class="price">${formatPrice(mockData.price)}</p>
                    </div>
                    <div class="cta-buttons">
                        <button class="btn btn-primary"><i class="fas fa-shopping-bag"></i> Add to Bag</button>
                        <button class="btn btn-secondary"><i class="far fa-heart"></i> Add to Wishlist</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners to thumbnails
        document.querySelectorAll('.thumbnail-wrapper').forEach(thumb => {
            thumb.addEventListener('click', () => {
                const mainImage = document.getElementById('main-image');
                mainImage.src = thumb.dataset.image;

                document.querySelector('.thumbnail-wrapper.active').classList.remove('active');
                thumb.classList.add('active');
            });
        });
    };
    
    const renderRelatedItems = (data, currentId) => {
        let allItems = [];
        for (const categoryKey in data.collections) {
            allItems = [...allItems, ...data.collections[categoryKey].items];
        }

        const relatedItems = allItems
            .filter(item => item.id !== currentId)
            .sort(() => 0.5 - Math.random()) // Shuffle
            .slice(0, 4); // Take first 4

        relatedContainer.innerHTML = relatedItems.map(item => `
            <a href="collection.html?id=${item.id}" class="related-item-card">
                <img src="${item.image}" alt="${item.title}">
                <div class="related-item-info">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            </a>
        `).join('');
    };
    
    const renderNotFound = () => {
         container.innerHTML = `<p style="text-align: center; font-size: 1.2rem; padding: 4rem 0;">Collection not found. Please check the ID and try again.</p>`;
         relatedContainer.innerHTML = '';
         document.querySelector('.related-section').style.display = 'none';
    };

    const init = async () => {
        const collectionId = getCollectionIdFromURL();
        if (!collectionId) {
            renderNotFound();
            return;
        }

        try {
            const response = await fetch(DATA_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            
            const collectionItem = findCollection(data, collectionId);

            if (collectionItem) {
                renderCollectionDetails(collectionItem);
                renderRelatedItems(data, collectionId);
            } else {
                renderNotFound();
            }

        } catch (error) {
            console.error('Failed to fetch collection data:', error);
            container.innerHTML = `<p style="text-align: center; color: #ff6b6b;">Error loading collection data. Please try again later.</p>`;
        }
    };

    init();
});