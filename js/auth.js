/**
 * Vrindopnishad Shared Authentication Service
 * Manages unified login state across all sub-domains and projects.
 */

const SUPABASE_URL = 'https://tilimltxgeucefxzerqi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_0YiM-Q8itRORUDdToracaQ_vzcrjUlC';

// Initialize Supabase client globally if not already present
if (typeof supabase === 'undefined') {
    console.warn('Supabase library not found. Please ensure the CDN is included.');
} else {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Handle OAuth callback - process tokens from URL hash after OAuth redirect
    (async function handleOAuthCallback() {
        const hash = window.location.hash;
        // Check if this is an OAuth callback with tokens
        if (hash && hash.includes('access_token')) {
            try {
                // Supabase automatically picks up the session from URL hash
                const { data, error } = await window.supabaseClient.auth.getSession();
                if (error) {
                    console.error('OAuth callback error:', error);
                } else if (data.session) {
                    console.log('OAuth login successful');
                    // Clean the URL by removing the hash fragment
                    window.history.replaceState(null, '', window.location.pathname + window.location.search);
                }
            } catch (err) {
                console.error('Error processing OAuth callback:', err);
            }
        }
    })();
}

const AuthService = {
    /**
     * Get current user session
     */
    async getUser() {
        if (!window.supabaseClient) return null;
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        return session?.user || null;
    },

    /**
     * Check if user is logged in
     */
    async isAuthenticated() {
        const user = await this.getUser();
        return !!user;
    },

    /**
     * Logout from all sites
     */
    async logout() {
        if (!window.supabaseClient) return;
        await window.supabaseClient.auth.signOut();
        window.location.href = '/';
    },

    /**
     * Redirect to login if not authenticated
     */
    async requireAuth(redirectTo = window.location.pathname) {
        const auth = await this.isAuthenticated();
        if (!auth) {
            const loginUrl = new URL('/login.html', window.location.origin);
            loginUrl.searchParams.set('redirect', redirectTo);
            window.location.href = loginUrl.toString();
        }
    },

    /**
     * Get user initials from name or email
     */
    getInitials(user) {
        if (!user) return '';

        const metadata = user.user_metadata || {};
        const fullName = metadata.full_name || metadata.name || '';

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
     * Get user avatar URL from OAuth provider or uploaded picture
     */
    getAvatarUrl(user) {
        if (!user) return null;

        const metadata = user.user_metadata || {};

        // Check for avatar from OAuth providers (Google, GitHub, etc.)
        return metadata.avatar_url || metadata.picture || null;
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
                    const loginUrl = new URL('/login.html', window.location.origin);
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
                <button class="dropdown-item" onclick="AuthService.logout()">
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
     * Monitor auth state changes
     */
    onAuthStateChange(callback) {
        if (!window.supabaseClient) return;
        return window.supabaseClient.auth.onAuthStateChange((event, session) => {
            callback(event, session?.user || null);
        });
    }
};

// Initial setup
AuthService.injectStyles();
window.AuthService = AuthService;
