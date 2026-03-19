/**
 * Vrindopnishad Shared Authentication Service
 * Manages unified login state across all sub-domains and projects using Firebase.
 */
// Define base URL for the project root (one level up from this script in js/)
const LOGIN_URL = new URL('../login.html', import.meta.url).href;
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import {
    getDatabase,
    ref,
    set,
    get,
    push,
    child
} from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCxBytUXjMdhBQfSjjuaIGfcXZe8N0WkH0",
    authDomain: "login-me-vrinda.firebaseapp.com",
    projectId: "login-me-vrinda",
    storageBucket: "login-me-vrinda.firebasestorage.app",
    messagingSenderId: "1019370299171",
    appId: "1:1019370299171:web:1a6df319b2fbfd6fcd3696",
    measurementId: "G-NN88X7N454"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);

// Keep a local cached user state to avoid async delays where possible
let currentUser = null;
let authStateInitialized = false;

// Global listener for auth state changes
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    authStateInitialized = true;
});

// Helper to wait for the initial auth state to resolve
const ensureAuthInitialized = () => {
    return new Promise((resolve) => {
        if (authStateInitialized) {
            resolve(currentUser);
        } else {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                resolve(user);
                unsubscribe();
            });
        }
    });
};

const AuthService = {
    // Expose firebase auth instance for pages that need deeper integration
    auth,

    /**
     * Get current user session
     */
    async getUser() {
        return await ensureAuthInitialized();
    },

    /**
     * Check if user is logged in
     */
    async isAuthenticated() {
        const user = await this.getUser();
        return !!user;
    },

    /**
     * Save a purchase to the database
     */
    async savePurchase(purchaseData) {
        const user = await this.getUser();
        if (!user) throw new Error("Authentication required to save purchase.");

        const purchaseRef = ref(db, `users/${user.uid}/purchases/${purchaseData.id}`);
        await set(purchaseRef, {
            ...purchaseData,
            timestamp: new Date().toISOString()
        });
        return true;
    },

    /**
     * Get all purchases for the current user
     */
    async getPurchases() {
        const user = await this.getUser();
        if (!user) return {};

        const userPurchasesRef = ref(db, `users/${user.uid}/purchases`);
        const snapshot = await get(userPurchasesRef);

        if (snapshot.exists()) {
            return snapshot.val();
        }
        return {};
    },

    /**
     * Save favorites to the database
     */
    async saveFavorites(favorites) {
        const user = await this.getUser();
        if (!user) return false;
        const favRef = ref(db, `users/${user.uid}/favorites`);
        await set(favRef, favorites);
        return true;
    },

    /**
     * Get favorites from the database
     */
    async getFavorites() {
        const user = await this.getUser();
        if (!user) return [];
        const favRef = ref(db, `users/${user.uid}/favorites`);
        const snapshot = await get(favRef);
        return snapshot.exists() ? snapshot.val() : [];
    },

    /**
     * Save shopping bag to the database
     */
    async saveBag(bag) {
        const user = await this.getUser();
        if (!user) return false;
        const bagRef = ref(db, `users/${user.uid}/bag`);
        await set(bagRef, bag);
        return true;
    },

    /**
     * Get shopping bag from the database
     */
    async getBag() {
        const user = await this.getUser();
        if (!user) return [];
        const bagRef = ref(db, `users/${user.uid}/bag`);
        const snapshot = await get(bagRef);
        return snapshot.exists() ? snapshot.val() : [];
    },

    /**
     * Logout from all sites
     */
    async logout() {
        try {
            await signOut(auth);
            window.location.href = '/';
        } catch (error) {
            console.error("Logout error:", error);
        }
    },

    /**
     * Redirect to login if not authenticated
     */
    async requireAuth(redirectTo = window.location.pathname) {
        const isAuthenticated = await this.isAuthenticated();
        if (!isAuthenticated) {
            const loginUrl = new URL(LOGIN_URL);
            loginUrl.searchParams.set('redirect', redirectTo);
            window.location.href = loginUrl.toString();
        }
    },

    /**
     * Get user initials from name or email
     */
    getInitials(user) {
        if (!user) return '';

        const fullName = user.displayName || '';

        if (fullName) {
            const names = fullName.split(' ');
            if (names.length >= 2) {
                return (names[0][0] + names[names.length - 1][0]).toUpperCase();
            }
            return names[0][0].toUpperCase();
        }

        // Fallback to email
        const email = user.email || '';
        return email ? email[0].toUpperCase() : '?';
    },

    /**
     * Get user avatar URL from OAuth provider
     */
    getAvatarUrl(user) {
        if (!user) return null;
        return user.photoURL || null;
    },

    /**
     * Update a profile button with user state
     */
    async updateProfileUI(buttonId) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        const user = await this.getUser();

        // Clear previous content
        button.innerHTML = '';

        if (user) {
            const avatarUrl = this.getAvatarUrl(user);

            if (avatarUrl) {
                // Show profile picture
                button.innerHTML = `<img class="auth-avatar" src="${avatarUrl}" alt="Profile" onerror="this.parentElement.innerHTML='<div class=\'auth-initials\'>${this.getInitials(user)}</div>'" />`;
            } else {
                // Show initials
                const initials = this.getInitials(user);
                button.innerHTML = `<div class="auth-initials">${initials}</div>`;
            }
            button.classList.add('logged-in');
        } else {
            // Show person icon
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            `;
            button.classList.remove('logged-in');
        }

        // Always call ensureDropdown to set up the listener and menu shell
        this.ensureDropdown(button);
    },

    /**
     * Ensure dropdown menu exists and click listener is set
     */
    ensureDropdown(button) {
        let dropdown = document.getElementById('auth-dropdown');
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.id = 'auth-dropdown';
            dropdown.className = 'auth-dropdown-menu';
            document.body.appendChild(dropdown);

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!button.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.remove('show');
                }
            });
        }

        // Set up click listener ONCE per button
        if (!button.dataset.authListenerSet) {
            button.dataset.authListenerSet = 'true';
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const isGuest = !button.classList.contains('logged-in');

                if (isGuest) {
                    // Redirect to login
                    const currentPath = window.location.pathname;
                    const loginUrl = new URL(LOGIN_URL);
                    loginUrl.searchParams.set('redirect', currentPath);
                    window.location.href = loginUrl.toString();
                    return;
                }

                // Toggle dropdown for logged in users
                const dropdownEl = document.getElementById('auth-dropdown');
                if (dropdownEl) {
                    dropdownEl.classList.toggle('show');
                    if (dropdownEl.classList.contains('show')) {
                        // Position dropdown
                        const rect = button.getBoundingClientRect();
                        dropdownEl.style.top = (rect.bottom + 10) + 'px';
                        dropdownEl.style.right = (window.innerWidth - rect.right) + 'px';
                    }
                }
            });
        }

        // Update dropdown content if logged in
        this.getUser().then(user => {
            if (!user) {
                dropdown.innerHTML = ''; // Clear if not logged in
                return;
            }
            dropdown.innerHTML = `
                <div class="dropdown-header">
                    <div class="user-email">${user.email}</div>
                </div>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item" onclick="window.AuthService.logout()">
                    <i class="fa-solid fa-right-from-bracket"></i> Logout
                </button>
            `;
        });
    },

    /**
     * Inject necessary styles for the profile UI
     */
    injectStyles() {
        if (document.getElementById('auth-styles')) return;
        const style = document.createElement('style');
        style.id = 'auth-styles';
        style.innerHTML = `
            .auth-initials {
                width: 32px;
                height: 32px;
                background: #d4af37;
                color: #fff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 14px;
                letter-spacing: 0.05em;
                box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
            }
            .auth-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid #d4af37;
                box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
            }
            .auth-dropdown-menu {
                position: fixed;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                padding: 8px;
                min-width: 200px;
                z-index: 9999;
                display: none;
                flex-direction: column;
                transition: all 0.3s ease;
            }
            .auth-dropdown-menu.show {
                display: flex;
            }
            .dropdown-header {
                padding: 12px 16px;
                font-size: 0.85rem;
                opacity: 0.7;
            }
            .dropdown-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 16px;
                border: none;
                background: none;
                width: 100%;
                text-align: left;
                cursor: pointer;
                border-radius: 8px;
                font-size: 0.9rem;
                color: #333;
                transition: background 0.2s;
            }
            .dropdown-item:hover {
                background: rgba(0,0,0,0.05);
            }
            .dropdown-divider {
                height: 1px;
                background: rgba(0,0,0,0.05);
                margin: 4px 0;
            }
            @media (prefers-color-scheme: dark) {
                .auth-dropdown-menu {
                    background: rgba(20, 20, 20, 0.95);
                    border-color: rgba(255, 255, 255, 0.1);
                    color: #fff;
                }
                .dropdown-item { color: #fff; }
                .dropdown-item:hover { background: rgba(255,255,255,0.05); }
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * Monitor auth state changes - wrapped for compatibility
     */
    onAuthStateChange(callback) {
        return onAuthStateChanged(auth, (user) => {
            callback('SIGNED_IN_OR_OUT', user);
        });
    }
};

// Initial setup
AuthService.injectStyles();
window.AuthService = AuthService;

// Auto-initialize UI if the standard button ID is found
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('user-auth-btn')) {
            AuthService.updateProfileUI('user-auth-btn');
            AuthService.onAuthStateChange(() => {
                AuthService.updateProfileUI('user-auth-btn');
            });
        }
    });
}

export default AuthService;
