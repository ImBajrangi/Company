/**
 * Vrindopnishad Unified Cart & E-commerce System
 * Manages Bag, Favorites, and Purchases with Cloud Sync.
 */

class CartSystem {
    constructor() {
        this.bag = JSON.parse(localStorage.getItem('shoppingBag')) || [];
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.purchased = JSON.parse(localStorage.getItem('purchasedItems')) || {};
        this.isLoggedIn = false;
        
        this.init();
    }

    async init() {
        console.log('🛒 Cart System Initializing...');
        
        // Setup Auth Listener with Retry/Wait for Module Load
        const setupAuth = async () => {
            if (window.AuthService) {
                console.log('✅ AuthService found, connecting...');
                window.AuthService.onAuthStateChange(async (status, user) => {
                    this.isLoggedIn = !!user;
                    console.log(`👤 Auth State Change: ${this.isLoggedIn ? 'Logged In' : 'Logged Out'}`);
                    if (this.isLoggedIn) {
                        await this.syncWithCloud();
                    }
                    this.updateUI();
                });
                return true;
            }
            return false;
        };

        // Immediate attempt
        if (!await setupAuth()) {
            // Backup: Poll for it (since auth.js is a module and might load later)
            let attempts = 0;
            const authInterval = setInterval(async () => {
                attempts++;
                if (await setupAuth() || attempts > 20) {
                    clearInterval(authInterval);
                }
            }, 250);
        }

        // Global Event Listeners for UI
        this.setupGlobalListeners();
        this.updateUI();
    }

    // --- Core Logic ---

    async addToBag(item) {
        if (!item || !item.id) return;
        
        const exists = this.bag.find(i => i.id === item.id);
        if (!exists) {
            this.bag.push({
                id: item.id,
                title: item.title,
                price: item.price,
                image: item.image || item.imageUrl,
                category: item.category,
                dateAdded: new Date().toISOString()
            });
            this.saveLocal();
            this.showToast(`Added ${item.title} to bag`, 'success');
            
            if (this.isLoggedIn) await this.pushBagToCloud();
        } else {
            this.showToast('Item already in bag', 'info');
        }
        this.updateUI();
    }

    async removeFromBag(id) {
        this.bag = this.bag.filter(item => item.id !== id);
        this.saveLocal();
        if (this.isLoggedIn) await this.pushBagToCloud();
        this.updateUI();
    }

    async addToFavorites(item) {
        if (!item || !item.id) return;
        const exists = this.favorites.find(i => i.id === item.id);
        if (!exists) {
            this.favorites.push(item);
            this.saveLocal();
            this.showToast('Added to wishlist', 'success');
            if (this.isLoggedIn) await window.AuthService.saveFavorites(this.favorites);
        } else {
            this.favorites = this.favorites.filter(i => i.id !== item.id);
            this.saveLocal();
            this.showToast('Removed from wishlist', 'info');
            if (this.isLoggedIn) await window.AuthService.saveFavorites(this.favorites);
        }
        this.updateUI();
    }

    saveLocal() {
        localStorage.setItem('shoppingBag', JSON.stringify(this.bag));
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        localStorage.setItem('purchasedItems', JSON.stringify(this.purchased));
    }

    // --- Cloud Sync ---

    async syncWithCloud() {
        if (!window.AuthService) return;
        
        try {
            const cloudBag = await window.AuthService.getBag();
            const cloudFavs = await window.AuthService.getFavorites();
            const cloudPurchased = await window.AuthService.getPurchases();

            // Simple Merge Strategy: Cloud wins for purchases, merge for bag/favs
            if (cloudBag) this.bag = this.mergeCollections(this.bag, cloudBag);
            if (cloudFavs) this.favorites = this.mergeCollections(this.favorites, cloudFavs);
            if (cloudPurchased) this.purchased = { ...this.purchased, ...cloudPurchased };

            this.saveLocal();
        } catch (e) {
            console.warn('Cloud sync failed:', e);
        }
    }

    mergeCollections(local, cloud) {
        const cloudArray = Array.isArray(cloud) ? cloud : Object.values(cloud);
        const combined = [...local];
        cloudArray.forEach(c => {
            if (!combined.find(l => l.id === c.id)) combined.push(c);
        });
        return combined;
    }

    async pushBagToCloud() {
        if (window.AuthService && this.isLoggedIn) {
            await window.AuthService.saveBag(this.bag);
        }
    }

    // --- UI Helpers ---

    updateUI() {
        // Update counts
        const bagCounts = document.querySelectorAll('.bag-count, #bag-count-badge');
        bagCounts.forEach(el => {
            el.textContent = this.bag.length;
            el.style.display = this.bag.length > 0 ? 'flex' : 'none';
        });

        const favCounts = document.querySelectorAll('.like-count, #fav-count-badge');
        favCounts.forEach(el => {
            el.textContent = this.favorites.length;
            el.style.display = this.favorites.length > 0 ? 'flex' : 'none';
        });

        // Re-render bag contents if container exists
        const bagContainers = document.querySelectorAll('#bag-content, .cart-items');
        bagContainers.forEach(container => this.renderBagContents(container));

        // Update footer if it exists
        const footers = document.querySelectorAll('#bag-footer, .cart-footer');
        footers.forEach(footer => this.renderBagFooter(footer));

        // Update totals
        const subtotal = this.bag.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
        const totalEls = document.querySelectorAll('.bag-total-amount, .cart-total-price');
        totalEls.forEach(el => {
            el.textContent = `₹${subtotal.toLocaleString()}`;
        });
        
        // Export UI functions to window for convenience
        window.toggleBag = () => this.toggleBag();
        window.toggleFavorites = () => this.toggleFavorites();
        window.togglePurchased = () => this.togglePurchased();
        window.showToast = (msg, type) => this.showToast(msg, type);

        // Dispatch global event for custom page logic
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { bag: this.bag, favs: this.favorites } }));
    }

    renderBagContents(container) {
        if (!container) return;
        
        if (this.bag.length === 0) {
            container.innerHTML = `
                <div class="empty-cart-message">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <h3>Your bag is empty</h3>
                    <p>Looks like you haven't added anything to your spiritual collection yet.</p>
                    <button class="btn-premium" onclick="window.toggleBag()">
                        <span>Start Shopping</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="bag-items-wrapper">
                ${this.bag.map(item => `
                    <div class="bag-item">
                        <img src="${item.image}" alt="${item.title}" class="bag-item-image">
                        <div class="bag-item-info">
                            <div class="bag-item-title">${item.title}</div>
                            <div class="bag-item-price">₹${(Number(item.price) || 0).toLocaleString()}</div>
                            <div class="bag-item-actions">
                                <button class="bag-item-remove" onclick="window.V_Cart.removeFromBag('${item.id}')">
                                    <i class="fas fa-trash-alt"></i> Remove
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderBagFooter(container) {
        if (!container) return;
        if (this.bag.length === 0) {
            container.innerHTML = '';
            return;
        }

        const subtotal = this.bag.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
        const tax = subtotal * 0.18;
        const total = subtotal + tax;

        container.innerHTML = `
            <div class="bag-summary">
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>₹${subtotal.toLocaleString()}</span>
                </div>
                <div class="summary-row">
                    <span>GST (18%)</span>
                    <span>₹${tax.toLocaleString()}</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span class="bag-total-amount">₹${total.toLocaleString()}</span>
                </div>
            </div>
            <div class="bag-checkout">
                <button class="btn btn-primary" id="checkout-btn" style="width: 100%; margin-top: 1rem;">
                    <i class="fas fa-${this.isLoggedIn ? 'lock' : 'user-lock'}"></i>
                    ${this.isLoggedIn ? `Check Out (₹${total.toLocaleString()})` : 'Login to Check Out'}
                </button>
                ${!this.isLoggedIn ? '<p style="font-size: 11px; text-align: center; margin-top: 8px; color: #888;">Authentication required for purchase</p>' : ''}
            </div>
        `;
    }

    // --- UI Controls ---

    closeAllModals() {
        const modals = document.querySelectorAll('.bag-modal, .favorites-modal, .purchased-modal');
        const overlay = document.getElementById('bag-overlay');
        modals.forEach(m => m.classList.remove('active'));
        if (overlay) overlay.classList.remove('active');
    }

    toggleBag() {
        const modal = document.getElementById('bag-modal');
        const overlay = document.getElementById('bag-overlay');
        const isActive = modal?.classList.contains('active');
        
        this.closeAllModals();
        
        if (!isActive && modal && overlay) {
            modal.classList.add('active');
            overlay.classList.add('active');
        }
    }

    toggleFavorites() {
        const modal = document.getElementById('favorites-modal');
        const overlay = document.getElementById('bag-overlay');
        const isActive = modal?.classList.contains('active');
        
        this.closeAllModals();
        
        if (!isActive && modal && overlay) {
            modal.classList.add('active');
            overlay.classList.add('active');
            // If opening favorites, re-render them
            const favContent = document.getElementById('favorites-content');
            if (favContent) this.renderFavorites(favContent);
        }
    }

    togglePurchased() {
        const modal = document.getElementById('purchased-modal');
        const overlay = document.getElementById('bag-overlay');
        const isActive = modal?.classList.contains('active');
        
        this.closeAllModals();
        
        if (!isActive && modal && overlay) {
            modal.classList.add('active');
            overlay.classList.add('active');
            const purchasedContent = document.getElementById('purchased-content');
            if (purchasedContent) this.renderPurchased(purchasedContent);
        }
    }

    renderFavorites(container) {
        if (!container) return;
        if (this.favorites.length === 0) {
            container.innerHTML = `
                <div class="empty-cart-message">
                    <div class="empty-cart-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <h3>Your favorites is empty</h3>
                    <p>Save your favorite divine collections here for easy access later.</p>
                    <button class="btn-premium" onclick="window.toggleFavorites()">
                        <span>Browse Collections</span>
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="bag-items-wrapper">
                ${this.favorites.map(item => `
                    <div class="bag-item">
                        <img src="${item.image}" alt="${item.title}" class="bag-item-image">
                        <div class="bag-item-info">
                            <div class="bag-item-title">${item.title}</div>
                            <div class="bag-item-price">₹${(Number(item.price) || 0).toLocaleString()}</div>
                            <div class="bag-item-actions">
                                <button class="bag-item-remove" onclick="window.V_Cart.addToFavorites(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                                    <i class="fas fa-heart"></i> Remove
                                </button>
                                <a href="/Vrindopnishad Web/Pictures/main/collection-details.html?id=${item.id}" class="bag-item-remove" style="text-decoration: none;">
                                    <i class="fas fa-eye"></i> View
                                </a>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderPurchased(container) {
        if (!container) return;
        const purchasedItems = Object.entries(this.purchased);
        if (purchasedItems.length === 0) {
            container.innerHTML = `
                <div class="empty-cart-message">
                    <div class="empty-cart-icon">
                        <i class="fas fa-cloud-download-alt"></i>
                    </div>
                    <h3>No purchases yet</h3>
                    <p>Experience the divine by adding some sacred art to your collection.</p>
                    <button class="btn-premium" onclick="window.togglePurchased()">
                        <span>Start Shopping</span>
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="bag-items-wrapper">
                ${purchasedItems.map(([id, data]) => `
                    <div class="bag-item">
                        <div class="bag-item-info">
                            <div class="bag-item-title">${data.title || 'Collection #' + id}</div>
                            <div class="bag-item-price" style="font-size: 11px;">Purchased: ${new Date(data.date).toLocaleDateString()}</div>
                            <div class="bag-item-actions">
                                <a href="/Vrindopnishad Web/Pictures/main/collection-details.html?id=${id}" class="bag-item-remove" style="text-decoration: none;">
                                    <i class="fas fa-download"></i> Download Details
                                </a>
                `).join('')}
            </div>
        `;
    }

    showToast(message, type = 'info') {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };

        const toast = document.createElement('div');
        toast.className = `v-toast v-toast-${type}`;
        toast.innerHTML = `
            <div class="v-toast-icon">
                <i class="${icons[type] || icons.info}"></i>
            </div>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Trigger reflow for animation
        toast.offsetHeight;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
    setupGlobalListeners() {
        // Handle global clicks
        document.addEventListener('click', (e) => {
            // Close buttons
            if (e.target.closest('#bag-close, #favorites-close, #purchased-close, .bag-close')) {
                this.closeAllModals();
            }
            
            // Overlay click
            if (e.target.id === 'bag-overlay') {
                this.closeAllModals();
            }
            
            // Checkout button
            const checkoutBtn = e.target.closest('#checkout-btn, .checkout-btn');
            if (checkoutBtn) {
                this.handleCheckout();
            }
        });

        // ESC key to close all modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    async handleCheckout() {
        if (!this.isLoggedIn) {
            this.showToast('Please login to checkout', 'info');
            if (window.AuthService) window.AuthService.requireAuth();
            return;
        }

        if (this.bag.length === 0) {
            this.showToast('Your bag is empty', 'error');
            return;
        }

        const subtotal = this.bag.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
        const tax = subtotal * 0.18; // 18% GST example
        const total = subtotal + tax;
        
        this.showToast('Initializing payment...', 'info');

        const options = {
            "key": "rzp_test_RU9lPJQl5wqQFM",
            "amount": Math.round(total * 100),
            "currency": "INR",
            "name": "Vrindopnishad",
            "description": `Divine Art Purchase (${this.bag.length} items)`,
            "handler": async (response) => {
                await this.onPaymentSuccess(response);
            },
            "prefill": {
                "name": window.AuthService.currentUser?.displayName || "",
                "email": window.AuthService.currentUser?.email || ""
            },
            "theme": { "color": "#c9a227" }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    }

    async onPaymentSuccess(response) {
        this.showToast('Payment Successful! ✅', 'success');
        
        const itemsToProcess = [...this.bag];
        this.bag = [];
        this.saveLocal();
        await this.pushBagToCloud();
        
        // Save to purchased
        for (const item of itemsToProcess) {
            const purchaseData = {
                ...item,
                paymentId: response.razorpay_payment_id,
                date: new Date().toISOString()
            };
            this.purchased[item.id] = purchaseData;
            if (window.AuthService) await window.AuthService.savePurchase(purchaseData);
        }
        
        this.saveLocal();
        this.updateUI();
        
        // Trigger generic success logic (e.g. redirect or show downloads)
        window.dispatchEvent(new CustomEvent('purchaseComplete', { detail: { items: itemsToProcess } }));
    }
}

// Global Export
window.V_Cart = new CartSystem();
