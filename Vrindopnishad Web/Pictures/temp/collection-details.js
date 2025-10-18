document.addEventListener('DOMContentLoaded', () => {
    // State management
    let wishlist = [];
    let cart = [];
    let currentCollection = null;
    
    // Collections Data (abbreviated for performance)
    // const collectionsData = {
    //   "collections": {
    //     "featured": {
    //       "title": "Featured Collections",
    //       "items": [
    //         { "id": "sacred-temples", "title": "Sacred Temples", "description": "Ancient temples and spiritual architecture", "count": 45, "rating": 4.8, "image": "https://i.postimg.cc/G2Jtvrzx/tempImageN7Ynt8.avif", "category": "Architecture", "price": 49999 },
    //         { "id": "divine-portraits", "title": "Divine Portraits", "description": "Beautiful deity artwork and paintings", "count": 67, "rating": 4.9, "image": "https://i.postimg.cc/yx32SQ76/62.avif", "category": "Art", "price": 59999 },
    //         { "id": "spiritual-landscapes", "title": "Spiritual Landscapes", "description": "Sacred places and holy sites", "count": 34, "rating": 4.7, "image": "https://i.postimg.cc/nzYrqZTT/tempImagepeTFpY.avif", "category": "Nature", "price": 39999 },
    //         { "id": "festival-moments", "title": "Festival Moments", "description": "Captured spiritual celebrations", "count": 89, "rating": 4.6, "image": "https://i.postimg.cc/L82pZfGK/tempImage0MZ1Qo.avif", "category": "Events", "price": 44999 },
    //         { "id": "meditation-spaces", "title": "Meditation Spaces", "description": "Peaceful environments for contemplation", "count": 23, "rating": 4.8, "image": "https://i.postimg.cc/hjgy2bbR/tempImageO8LIr2.avif", "category": "Nature", "price": 34999 }
    //       ]
    //     },
    //     "popular": {
    //       "title": "Popular Right Now",
    //       "items": [
    //         { "id": "trending-now", "title": "Trending Now", "description": "Most viewed this week", "count": 156, "rating": 4.5, "image": "https://i.postimg.cc/SsNLXZf8/tempImageXR0Khf.avif", "category": "Trending", "price": 29999 },
    //         { "id": "rising-stars", "title": "Rising Stars", "description": "Newly popular collections", "count": 78, "rating": 4.7, "image": "https://i.postimg.cc/66ZV8GdG/tempImageEpdAxY.avif", "category": "New", "price": 39999 }
    //       ]
    //     }
    //   }
    // };

        // Data is now embedded directly in the script to avoid fetch errors.
    const collectionsData = {
      "siteConfig": { /* ... existing siteConfig data ... */ },
      "navigation": [ /* ... existing navigation data ... */ ],
      "heroSection": { /* ... existing heroSection data ... */ },
      "collections": {
        "featured": {
          "title": "Featured Collections",
          "items": [
            { "id": "sacred-temples", "title": "Sacred Temples", "description": "Ancient temples and spiritual architecture", "count": 45, "rating": 4.8, "image": "https://i.postimg.cc/G2Jtvrzx/tempImageN7Ynt8.avif", "category": "architecture", "featured": true },
            { "id": "divine-portraits", "title": "Divine Portraits", "description": "Beautiful deity artwork and paintings", "count": 67, "rating": 4.9, "image": "https://i.postimg.cc/yx32SQ76/62.avif", "category": "art", "featured": true },
            { "id": "spiritual-landscapes", "title": "Spiritual Landscapes", "description": "Sacred places and holy sites", "count": 34, "rating": 4.7, "image": "https://i.postimg.cc/nzYrqZTT/tempImagepeTFpY.avif", "category": "nature", "featured": true },
            { "id": "festival-moments", "title": "Festival Moments", "description": "Captured spiritual celebrations", "count": 89, "rating": 4.6, "image": "https://i.postimg.cc/L82pZfGK/tempImage0MZ1Qo.avif", "category": "events", "featured": true },
            { "id": "meditation-spaces", "title": "Meditation Spaces", "description": "Peaceful environments for contemplation", "count": 23, "rating": 4.8, "image": "https://i.postimg.cc/hjgy2bbR/tempImageO8LIr2.avif", "category": "nature", "featured": true }
          ]
        },
        "popular": {
          "title": "Popular Right Now",
          "items": [
            { "id": "trending-now", "title": "Trending Now", "description": "Most viewed this week", "count": 156, "rating": 4.5, "image": "https://i.postimg.cc/SsNLXZf8/tempImageXR0Khf.avif", "category": "trending", "views": 15600 },
            { "id": "rising-stars", "title": "Rising Stars", "description": "Newly popular collections", "count": 78, "rating": 4.7, "image": "https://i.postimg.cc/66ZV8GdG/tempImageEpdAxY.avif", "category": "new", "views": 8900 },
            { "id": "community-favorites", "title": "Community Favorites", "description": "Highly rated by users", "count": 234, "rating": 4.9, "image": "https://i.postimg.cc/L89jQCG1/tempImageQAFHVQ.avif", "category": "community", "views": 23400 },
            { "id": "editors-choice", "title": "Editor's Choice", "description": "Curated by our team", "count": 123, "rating": 4.8, "image": "https://i.postimg.cc/cJ6w0KxH/tempImageyiRJ1l.avif", "category": "editorial", "views": 12300 },
            { "id": "most-downloaded", "title": "Most Downloaded", "description": "Popular downloads", "count": 345, "rating": 4.6, "image": "https://i.postimg.cc/Fs1PCKcg/tempImagez5mFhZ.avif", "category": "downloads", "views": 34500 }
          ]
        },
        "anime": {
          "title": "Anime Style",
          "items": [
            { "id": "mountain-vistas", "title": "Mountain Vistas", "description": "Breathtaking mountain landscapes", "count": 67, "rating": 4.7, "image": "https://i.postimg.cc/VsxMwHMk/temp-Image-DVx-VWQ.avif", "category": "mountains" },
            { "id": "ocean-views", "title": "Ocean Views", "description": "Stunning seascapes and beaches", "count": 89, "rating": 4.6, "image": "https://i.postimg.cc/h4zxHqXr/temp-Image0m4o-HY.avif", "category": "ocean" },
            { "id": "forest-paths", "title": "Forest Paths", "description": "Mystical forest photography", "count": 45, "rating": 4.8, "image": "https://i.postimg.cc/g2Yxk92N/temp-Image-Y61d7-W.avif", "category": "forest" },
            { "id": "desert-landscapes", "title": "Desert Landscapes", "description": "Vast desert scenery", "count": 34, "rating": 4.5, "image": "https://i.postimg.cc/PJHFPtVy/32.avif", "category": "desert" },
            { "id": "wildlife", "title": "Wildlife", "description": "Amazing animal photography", "count": 123, "rating": 4.9, "image": "https://i.postimg.cc/Ghc5Rmyh/33.avif", "category": "animals" }
          ]
        },
        "rapper": {
          "title": "Rapper Style",
          "items": [
            { "id": "classic-rapper", "title": "Classic Rapper", "description": "Timeless rap artwork", "count": 234, "rating": 4.8, "image": "https://i.postimg.cc/15935GrX/temp-Image5xgxp-E.avif", "category": "classic" },
            { "id": "modern-art", "title": "Modern Art", "description": "Contemporary anime styles", "count": 145, "rating": 4.7, "image": "https://i.postimg.cc/bN3NGZmF/temp-Imagefa-W5wa.avif", "category": "modern" },
            { "id": "character-art", "title": "Character Art", "description": "Detailed character illustrations", "count": 178, "rating": 4.6, "image": "https://i.postimg.cc/RZhCwvYL/temp-Image-Fsblv-Q.avif", "category": "characters" },
            { "id": "fantasy-worlds", "title": "Fantasy Worlds", "description": "Magical anime landscapes", "count": 89, "rating": 4.9, "image": "https://i.postimg.cc/L6H86t3s/temp-Image6-M4-FDA.avif", "category": "fantasy" },
            { "id": "abstract-designs", "title": "Abstract Designs", "description": "Artistic interpretations", "count": 67, "rating": 4.5, "image": "https://i.postimg.cc/hPpPJX24/temp-Imageg-VDr-Y9.avif", "category": "abstract" },
            { "id": "abstract-designs-2", "title": "Abstract Designs", "description": "Artistic interpretations", "count": 67, "rating": 4.5, "image": "https://i.postimg.cc/9FJF4DLF/temp-Image-IZi-RGt.avif", "category": "abstract" },
            { "id": "abstract-designs-3", "title": "Abstract Designs", "description": "Artistic interpretations", "count": 67, "rating": 4.5, "image": "https://i.postimg.cc/9FJF4DLd/temp-Imageo-NP2g-B.avif", "category": "abstract" },
            { "id": "abstract-designs-4", "title": "Abstract Designs", "description": "Artistic interpretations", "count": 67, "rating": 4.5, "image": "https://i.postimg.cc/yYV8Ymyd/temp-Imagew-PU6id.avif", "category": "abstract" },
            { "id": "abstract-designs-5", "title": "Abstract Designs", "description": "Artistic interpretations", "count": 67, "rating": 4.5, "image": "https://i.postimg.cc/Fs9HsyVJ/temp-Imagex8-E6l-H.avif", "category": "abstract" }
          ]
        },
        "dark": {
          "title": "Dark Aesthetic",
          "items": [
            { "id": "modern-buildings", "title": "Modern Buildings", "description": "Contemporary architecture", "count": 89, "rating": 4.6, "image": "https://i.postimg.cc/rsQv1t57/temp-Imageq2-Af-Gz.avif", "category": "architecture", "views": 15600 },
            { "id": "historic-structures", "title": "Historic Structures", "description": "Ancient architectural marvels", "count": 67, "rating": 4.8, "image": "https://i.postimg.cc/FFVmFYkR/temp-Imageoo-RS7-Y.avif", "category": "architecture", "views": 12300 },
            { "id": "city-skylines", "title": "City Skylines", "description": "Urban landscape photography", "count": 123, "rating": 4.7, "image": "https://i.postimg.cc/fWCnn11f/temp-Image-Qu2-Bi-Z.avif", "category": "architecture", "views": 18900 },
            { "id": "bridges-roads", "title": "Bridges & Roads", "description": "Infrastructure photography", "count": 45, "rating": 4.5, "image": "https://i.postimg.cc/rFGD2ns7/94.avif", "category": "architecture", "views": 9800 },
            { "id": "interior-design", "title": "Interior Design", "description": "Beautiful indoor spaces", "count": 78, "rating": 4.7, "image": "https://i.postimg.cc/GmH1jz7H/temp-Image-UQR4i-G.avif", "category": "architecture", "views": 14500 },
            { "id": "modern-buildings-2", "title": "Modern Buildings", "description": "Contemporary architecture", "count": 89, "rating": 4.6, "image": "https://i.postimg.cc/NFpW6rRP/temp-Image-Xfywpn.avif", "category": "modern" },
            { "id": "historic-structures-2", "title": "Historic Structures", "description": "Ancient architectural marvels", "count": 67, "rating": 4.8, "image": "https://i.postimg.cc/tC2C1sBT/temp-Imageh-Vn64z.avif", "category": "historic" },
            { "id": "city-skylines-2", "title": "City Skylines", "description": "Urban landscape photography", "count": 123, "rating": 4.7, "image": "https://i.postimg.cc/3JKxJXFJ/temp-Image-VVft-EX.avif", "category": "urban" },
            { "id": "bridges-roads-2", "title": "Bridges & Roads", "description": "Infrastructure photography", "count": 45, "rating": 4.5, "image": "https://i.postimg.cc/x1hVpHhM/temp-Imageb-UOb-Rv.avif", "category": "infrastructure" },
            { "id": "interior-design-2", "title": "Interior Design", "description": "Beautiful indoor spaces", "count": 78, "rating": 4.4, "image": "https://i.postimg.cc/3JLTpzB8/temp-Image-Jc5pu-P.avif", "category": "interior" }
          ]
        },
        "warrior": {
          "title": "Warrior Theme",
          "items": [
            { "id": "samurai-culture", "title": "Samurai Culture", "description": "Ancient Japanese warriors", "count": 56, "rating": 4.8, "image": "https://i.postimg.cc/XqVRBgBX/temp-Image-KVsh-Fy.avif", "category": "samurai" },
            { "id": "medieval-knights", "title": "Medieval Knights", "description": "European knightly traditions", "count": 78, "rating": 4.7, "image": "https://i.postimg.cc/0yF1XmFV/temp-Image-PRh2-Km.avif", "category": "knights" },
            { "id": "viking-heritage", "title": "Viking Heritage", "description": "Norse warrior culture", "count": 45, "rating": 4.6, "image": "https://i.postimg.cc/nzY8LWzT/temp-Image0-GHro6.avif", "category": "viking" },
            { "id": "spartan-warriors", "title": "Spartan Warriors", "description": "Ancient Greek fighters", "count": 34, "rating": 4.9, "image": "https://i.postimg.cc/BnXGCNYt/temp-Image4-RTJPu.avif", "category": "spartan" },
            { "id": "native-warriors", "title": "Native Warriors", "description": "Indigenous fighting traditions", "count": 23, "rating": 4.5, "image": "https://i.postimg.cc/4dJP64sG/tempImage6EgCLR.avif", "category": "native" },
            { "id": "native-warriors-2", "title": "Native Warriors", "description": "Indigenous fighting traditions", "count": 23, "rating": 4.5, "image": "https://i.postimg.cc/v84q3B5D/tempImageid8ES0.avif", "category": "native" },
            { "id": "native-warriors-3", "title": "Native Warriors", "description": "Indigenous fighting traditions", "count": 23, "rating": 4.5, "image": "https://i.postimg.cc/43RB3b07/tempImageIWRFom.avif", "category": "native" },
            { "id": "native-warriors-4", "title": "Native Warriors", "description": "Indigenous fighting traditions", "count": 23, "rating": 4.5, "image": "https://i.postimg.cc/SNq9j1Qm/tempImagel86fFm.avif", "category": "native" },
            { "id": "native-warriors-5", "title": "Native Warriors", "description": "Indigenous fighting traditions", "count": 23, "rating": 4.5, "image": "https://i.postimg.cc/TwG7tqjQ/tempImageKypZIV.avif", "category": "native" },
            { "id": "native-warriors-6", "title": "Native Warriors", "description": "Indigenous fighting traditions", "count": 23, "rating": 4.5, "image": "https://i.postimg.cc/PxtyWfTk/tempImageN3ABj4.avif", "category": "native" }
          ]
        },
        "chhibi": {
          "title": "Chhibi Style",
          "items": [
            { "id": "cute-characters", "title": "Cute Characters", "description": "Adorable chibi illustrations", "count": 123, "rating": 4.9, "image": "https://i.postimg.cc/65SMkNLH/tempImagett5arh.avif", "category": "cute" },
            { "id": "fantasy-chibis", "title": "Fantasy Chibis", "description": "Magical chibi designs", "count": 89, "rating": 4.8, "image": "https://i.postimg.cc/RFs7wcgR/tempImagej79Z1R.avif", "category": "fantasy" },
            { "id": "animal-chibis", "title": "Animal Chibis", "description": "Chibi animal characters", "count": 67, "rating": 4.7, "image": "https://i.postimg.cc/zfkSGmWd/tempImagedDXBmr.avif", "category": "animals" },
            { "id": "everyday-chibis", "title": "Everyday Chibis", "description": "Daily life in chibi form", "count": 45, "rating": 4.6, "image": "https://i.postimg.cc/zGKF4HfL/tempImagemb1IW9.avif", "category": "daily" },
            { "id": "holiday-chibis", "title": "Holiday Chibis", "description": "Festive chibi celebrations", "count": 34, "rating": 4.5, "image": "https://i.postimg.cc/1tJHJx3C/tempImagenyhCwi.avif", "category": "holiday" },
            { "id": "holiday-chibis-2", "title": "Holiday Chibis", "description": "Festive chibi celebrations", "count": 34, "rating": 4.5, "image": "https://i.postimg.cc/sDFcmJjy/tempImageQzI30m.avif", "category": "holiday" },
            { "id": "holiday-chibis-3", "title": "Holiday Chibis", "description": "Festive chibi celebrations", "count": 34, "rating": 4.5, "image": "https://i.postimg.cc/1zD70YFk/tempImagerYw6TE.avif", "category": "holiday" },
            { "id": "holiday-chibis-4", "title": "Holiday Chibis", "description": "Festive chibi celebrations", "count": 34, "rating": 4.5, "image": "https://i.postimg.cc/fRqS2wcD/tempImage7ir1Kw.avif", "category": "holiday" }
          ]
        }
      },
      "socialLinks": [ /* ... existing socialLinks data ... */ ],
      "footer": { /* ... existing footer data ... */ }
    };

    // DOM Elements
    const container = document.getElementById('collection-container');
    const relatedContainer = document.getElementById('related-items');
    const searchBtn = document.getElementById('search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const closeSearch = document.getElementById('close-search');
    const wishlistBtn = document.getElementById('wishlist-btn');
    const wishlistOverlay = document.getElementById('wishlist-overlay');
    const wishlistItems = document.getElementById('wishlist-items');
    const closeWishlist = document.getElementById('close-wishlist');
    const cartBtn = document.getElementById('cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItems = document.getElementById('cart-items');
    const closeCart = document.getElementById('close-cart');
    const wishlistCount = document.getElementById('wishlist-count');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const cartFooter = document.getElementById('cart-footer');

    // Helper Functions
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

    const getCollectionIdFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    };

    const findCollection = (data, id) => {
        for (const categoryKey in data.collections) {
            const category = data.collections[categoryKey];
            const foundItem = category.items.find(item => item.id === id);
            if (foundItem) {
                return { ...foundItem, category: foundItem.category || category.title };
            }
        }
        return null;
    };

    const getAllCollections = () => {
        let allItems = [];
        for (const categoryKey in collectionsData.collections) {
            allItems = [...allItems, ...collectionsData.collections[categoryKey].items];
        }
        return allItems;
    };

    const updateBadges = () => {
        wishlistCount.textContent = wishlist.length;
        cartCount.textContent = cart.length;
        wishlistCount.classList.toggle('show', wishlist.length > 0);
        cartCount.classList.toggle('show', cart.length > 0);
    };

    const isInWishlist = (id) => {
        return wishlist.some(item => item.id === id);
    };

    const isInCart = (id) => {
        return cart.some(item => item.id === id);
    };

    // Search Functionality
    const openSearch = () => {
        searchOverlay.classList.add('active');
        searchInput.focus();
    };

    const closeSearchPanel = () => {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
    };

    const performSearch = (query) => {
        if (!query.trim()) {
            searchResults.innerHTML = '';
            return;
        }

        const allCollections = getAllCollections();
        const results = allCollections.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );

        if (results.length === 0) {
            searchResults.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-secondary);">No results found</p>';
            return;
        }

        searchResults.innerHTML = results.slice(0, 6).map(item => `
            <a href="collection-details.html?id=${item.id}" class="search-result-item">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="search-result-info">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                </div>
            </a>
        `).join('');
    };

    // Wishlist Functionality
    const addToWishlist = (item) => {
        if (!isInWishlist(item.id)) {
            wishlist.push(item);
            updateBadges();
            renderWishlist();
            showNotification(`${item.title} added to wishlist`);
        }
    };

    const removeFromWishlist = (id) => {
        wishlist = wishlist.filter(item => item.id !== id);
        updateBadges();
        renderWishlist();
    };

    const renderWishlist = () => {
        if (wishlist.length === 0) {
            wishlistItems.innerHTML = '<p class="empty-message">Your wishlist is empty</p>';
            return;
        }

        wishlistItems.innerHTML = wishlist.map(item => `
            <div class="sidebar-item">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="sidebar-item-info">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    <div class="sidebar-item-price">${formatPrice(item.price)}</div>
                </div>
                <button class="sidebar-item-remove" onclick="window.removeFromWishlist('${item.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    };

    const openWishlist = () => {
        wishlistOverlay.classList.add('active');
        renderWishlist();
    };

    const closeWishlistPanel = () => {
        wishlistOverlay.classList.remove('active');
    };

    // Cart Functionality
    const addToCart = (item) => {
        if (!isInCart(item.id)) {
            cart.push(item);
            updateBadges();
            renderCart();
            showNotification(`${item.title} added to bag`);
        } else {
            showNotification(`${item.title} is already in your bag`);
        }
    };

    const removeFromCart = (id) => {
        cart = cart.filter(item => item.id !== id);
        updateBadges();
        renderCart();
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price, 0);
    };

    const renderCart = () => {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-message">Your bag is empty</p>';
            cartFooter.style.display = 'none';
            return;
        }

        cartItems.innerHTML = cart.map(item => `
            <div class="sidebar-item">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="sidebar-item-info">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    <div class="sidebar-item-price">${formatPrice(item.price)}</div>
                </div>
                <button class="sidebar-item-remove" onclick="window.removeFromCart('${item.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        cartTotal.textContent = formatPrice(calculateTotal());
        cartFooter.style.display = 'block';
    };

    const openCart = () => {
        cartOverlay.classList.add('active');
        renderCart();
    };

    const closeCartPanel = () => {
        cartOverlay.classList.remove('active');
    };

    // Notification
    const showNotification = (message) => {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--text-primary);
            color: var(--bg-primary);
            padding: 16px 24px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            z-index: 3000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    };

    // Render Collection Details
    const renderCollectionDetails = (item) => {
        currentCollection = item;
        const mockImages = [
            item.image,
            "https://placehold.co/600x600/f5f5f7/1d1d1f?text=View+2",
            "https://placehold.co/600x600/f5f5f7/1d1d1f?text=View+3",
            "https://placehold.co/600x600/f5f5f7/1d1d1f?text=View+4",
        ];

        const isLiked = isInWishlist(item.id);

        container.innerHTML = `
            <div class="collection-detail-grid">
                <div class="collection-gallery">
                    <div class="main-image-wrapper">
                        <img src="${item.image}" alt="${item.title}" class="main-image" id="main-image" loading="lazy">
                    </div>
                    <div class="thumbnail-grid" id="thumbnail-grid">
                        ${mockImages.map((img, index) => `
                            <div class="thumbnail-wrapper ${index === 0 ? 'active' : ''}" data-image="${img}">
                                <img src="${img}" alt="View ${index + 1}" class="thumbnail-img" loading="lazy">
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
                        <p class="price">${formatPrice(item.price)}</p>
                    </div>
                    <div class="cta-buttons">
                        <button class="btn btn-primary" id="add-to-cart-btn">
                            <i class="fas fa-shopping-bag"></i> Add to Bag
                        </button>
                        <button class="btn btn-secondary" id="add-to-wishlist-btn">
                            <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i> 
                            ${isLiked ? 'In Wishlist' : 'Add to Wishlist'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners for thumbnails
        document.querySelectorAll('.thumbnail-wrapper').forEach(thumb => {
            thumb.addEventListener('click', () => {
                const mainImage = document.getElementById('main-image');
                const newSrc = thumb.dataset.image;
                
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.src = newSrc;
                    mainImage.style.opacity = '1';
                }, 150);
                
                document.querySelector('.thumbnail-wrapper.active').classList.remove('active');
                thumb.classList.add('active');
            });
        });
        
        document.getElementById('main-image').style.transition = 'opacity 0.3s ease';

        // Add to cart button
        document.getElementById('add-to-cart-btn').addEventListener('click', () => {
            addToCart(item);
        });

        // Add to wishlist button
        document.getElementById('add-to-wishlist-btn').addEventListener('click', () => {
            const btn = document.getElementById('add-to-wishlist-btn');
            if (isInWishlist(item.id)) {
                removeFromWishlist(item.id);
                btn.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
            } else {
                addToWishlist(item);
                btn.innerHTML = '<i class="fas fa-heart"></i> In Wishlist';
            }
        });
    };

    // Render Related Items
    const renderRelatedItems = (data, currentId) => {
        const allItems = getAllCollections();
        const relatedItems = allItems
            .filter(item => item.id !== currentId)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);

        relatedContainer.innerHTML = relatedItems.map(item => `
            <a href="collection-details.html?id=${item.id}" class="related-item-card">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="related-item-info">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            </a>
        `).join('');
    };

    // Render Not Found
    const renderNotFound = () => {
         container.innerHTML = `<p style="text-align: center; font-size: 1.2rem; padding: 4rem 0; color: var(--text-secondary);">Collection not found.</p>`;
         relatedContainer.innerHTML = '';
         if(document.querySelector('.related-section')) {
            document.querySelector('.related-section').style.display = 'none';
         }
    };

    // Event Listeners
    searchBtn.addEventListener('click', openSearch);
    closeSearch.addEventListener('click', closeSearchPanel);
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) closeSearchPanel();
    });
    searchInput.addEventListener('input', (e) => performSearch(e.target.value));

    wishlistBtn.addEventListener('click', openWishlist);
    closeWishlist.addEventListener('click', closeWishlistPanel);
    wishlistOverlay.addEventListener('click', (e) => {
        if (e.target === wishlistOverlay) closeWishlistPanel();
    });

    cartBtn.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartPanel);
    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) closeCartPanel();
    });

    // Expose functions globally for inline event handlers
    window.removeFromWishlist = removeFromWishlist;
    window.removeFromCart = removeFromCart;

    // Initialize
    const init = () => {
        let collectionId = getCollectionIdFromURL();
        
        if (!collectionId) {
            const featuredItems = collectionsData.collections?.featured?.items;
            if (featuredItems && featuredItems.length > 0) {
                collectionId = featuredItems[0].id;
            } else {
                renderNotFound();
                return;
            }
        }

        const collectionItem = findCollection(collectionsData, collectionId);

        if (collectionItem) {
            document.title = `${collectionItem.title} - Vrindopnishad`;
            renderCollectionDetails(collectionItem);
            renderRelatedItems(collectionsData, collectionId);
        } else {
            renderNotFound();
        }
        
        updateBadges();
    };

    init();

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});