// Admin API Service
const AdminApiService = {
    // Base URL for API calls
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5000/api' 
        : 'https://api.vrindopnishad.com/api',
    
    // Get authentication token from local storage
    getToken: function() {
        return localStorage.getItem('admin_token');
    },
    
    // Set authentication token in local storage
    setToken: function(token) {
        if (token) {
            localStorage.setItem('admin_token', token);
        } else {
            localStorage.removeItem('admin_token');
        }
    },
    
    // Check if user is authenticated
    isAuthenticated: function() {
        return !!this.getToken();
    },
    
    // Get authenticated user data
    getAuthUser: async function() {
        try {
            // For test token in local development
            const token = this.getToken();
            if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && 
                token === 'test-token-12345') {
                console.log('Using test token for local development');
                return {
                    success: true,
                    data: {
                        name: 'Test Admin',
                        email: 'admin@example.com',
                        role: 'admin'
                    }
                };
            }
            
            const response = await fetch(`${this.API_BASE_URL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to get user data');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error getting authenticated user:', error);
            return null;
        }
    },
    
    // Login user
    login: async function(email, password) {
        try {
            // Development only - Test credentials for local testing
            if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || 
                 window.location.protocol === 'file:') && 
                email === 'admin@example.com' && password === 'admin123') {
                console.log('Using test credentials for local development');
                return {
                    success: true,
                    token: 'test-token-12345',
                    user: {
                        name: 'Test Admin',
                        email: 'admin@example.com',
                        role: 'admin'
                    }
                };
            }
            
            const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }
            
            this.setToken(data.token);
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },
    
    // Logout user
    logout: function() {
        this.setToken(null);
    },
    
    // Get all books
    getBooks: async function() {
        try {
            // For test token in local development
            if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || 
                 window.location.protocol === 'file:') && 
                this.getToken() === 'test-token-12345') {
                console.log('Using test data for local development');
                return {
                    success: true,
                    data: [
                        {
                            id: '1',
                            title: 'Bhagavad Gita',
                            author: 'Vyasa',
                            description: 'The Bhagavad Gita is a 700-verse Hindu scripture that is part of the epic Mahabharata.',
                            cover: 'https://example.com/bhagavad-gita.jpg',
                            category: 'vedic',
                            language: 'sanskrit',
                            format: ['pdf', 'epub']
                        },
                        {
                            id: '2',
                            title: 'Ramayana',
                            author: 'Valmiki',
                            description: 'The Ramayana is one of the two major Sanskrit epics of ancient India.',
                            cover: 'https://example.com/ramayana.jpg',
                            category: 'puranas',
                            language: 'sanskrit',
                            format: ['pdf']
                        }
                    ]
                };
            }
            
            const response = await fetch(`${this.API_BASE_URL}/books`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching books:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Other API functions can be added as needed
};

// Main admin script
document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin panel initializing...');
    
    // Initialize the application
    init();
    
    // Main initialization function
    function init() {
        console.log('Running init function...');
        
        // Check authentication
        checkAuth();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize active section
        const activeSection = document.querySelector('.section.active');
        if (activeSection) {
            console.log('Active section:', activeSection.id);
            if (activeSection.id === 'books-section') {
                initBooksManagement();
            } else if (activeSection.id === 'pdf-section') {
                initPDFManagement();
            }
        }
    }
    
    // Authentication Functions
    function checkAuth() {
        console.log('Checking authentication...');
        const token = AdminApiService.getToken();
        if (!token) {
            showLoginForm();
        } else {
            validateToken(token);
        }
    }
    
    async function validateToken(token) {
        showLoading();
        try {
            console.log('Validating token...');
            const userData = await AdminApiService.getAuthUser();
            
            if (userData && userData.success && userData.data && userData.data.role === 'admin') {
                showAdminContent();
                displayAdminInfo(userData.data);
            } else {
                showError('आपके पास एडमिन अधिकार नहीं हैं');
                logout();
            }
        } catch (error) {
            console.error('Token validation error:', error);
            showError('सत्यापन में त्रुटि। कृपया फिर से लॉगिन करें।');
            logout();
        } finally {
            hideLoading();
        }
    }
    
    // Setup event listeners for the admin panel
    function setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                showLoading();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                console.log('Attempting login with:', email);
                
                try {
                    const response = await AdminApiService.login(email, password);
                    console.log('Login response:', response);
                    
                    if (response.success && response.token) {
                        AdminApiService.setToken(response.token);
                        showSuccess('लॉगिन सफल');
                        showAdminContent();
                        
                        if (response.user) {
                            displayAdminInfo(response.user);
                        }
                    } else {
                        showError(response.error || 'लॉगिन विफल। कृपया अपने क्रेडेंशियल्स की जांच करें।');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    showError('लॉगिन में त्रुटि। कृपया फिर से प्रयास करें।');
                } finally {
                    hideLoading();
                }
            });
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
        
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links
                document.querySelectorAll('.nav-link').forEach(l => {
                    l.classList.remove('active');
                    l.removeAttribute('aria-current');
                });
                
                // Add active class to clicked link
                e.currentTarget.classList.add('active');
                e.currentTarget.setAttribute('aria-current', 'page');
                
                // Hide all sections
                document.querySelectorAll('.section').forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show the target section
                const targetId = e.currentTarget.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId + '-section');
                if (targetSection) {
                    targetSection.classList.add('active');
                    // Set focus to the heading for accessibility
                    const heading = targetSection.querySelector('h2');
                    if (heading) {
                        heading.focus();
                    }
                    
                    // Initialize section-specific functionality
                    if (targetId === 'books') {
                        initBooksManagement();
                    } else if (targetId === 'pdf') {
                        initPDFManagement();
                    }
                }
            });
        });
    }
    
    function showLoginForm() {
        console.log('Showing login form...');
        const loginContainer = document.getElementById('login-container');
        const adminDashboard = document.getElementById('admin-dashboard');
        
        if (loginContainer) loginContainer.classList.remove('hidden');
        if (adminDashboard) adminDashboard.classList.add('hidden');
    }
    
    function showAdminContent() {
        console.log('Showing admin content...');
        const loginContainer = document.getElementById('login-container');
        const adminDashboard = document.getElementById('admin-dashboard');
        
        if (loginContainer) loginContainer.classList.add('hidden');
        if (adminDashboard) adminDashboard.classList.remove('hidden');
    }
    
    function displayAdminInfo(user) {
        console.log('Displaying admin info:', user);
        const adminInfo = document.getElementById('admin-info');
        if (adminInfo) {
            adminInfo.innerHTML = `
                <p>स्वागत है, ${user.firstName || user.name || 'Admin'}</p>
                <p>Email: ${user.email}</p>
                <p>Role: ${user.role}</p>
            `;
        }
    }
    
    function logout() {
        console.log('Logging out...');
        AdminApiService.logout();
        showLoginForm();
    }
    
    // Helper Functions
    function showLoading() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.classList.remove('hidden');
        }
    }
    
    function hideLoading() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
    }
    
    function showError(message, elementId = null) {
        console.error('Error:', message);
        
        // If element ID is provided, show error in that element
        if (elementId) {
            const errorDiv = document.getElementById(elementId);
            if (errorDiv) {
                errorDiv.textContent = message;
                errorDiv.classList.remove('hidden');
                
                setTimeout(() => {
                    errorDiv.classList.add('hidden');
                }, 5000);
                return;
            }
        }
        
        // Try to find a section-specific error element
        const activeSection = document.querySelector('.section.active');
        if (activeSection) {
            const sectionId = activeSection.id.replace('-section', '');
            const sectionErrorDiv = document.getElementById(`${sectionId}-error`);
            
            if (sectionErrorDiv) {
                sectionErrorDiv.textContent = message;
                sectionErrorDiv.classList.remove('hidden');
                
                setTimeout(() => {
                    sectionErrorDiv.classList.add('hidden');
                }, 5000);
                return;
            }
        }
        
        // Fallback to login error or alert
        const loginError = document.getElementById('login-error');
        if (loginError) {
            loginError.textContent = message;
            loginError.classList.remove('hidden');
            
            setTimeout(() => {
                loginError.classList.add('hidden');
            }, 5000);
        } else {
            alert(message);
        }
        
        // Vibrate on error for mobile devices
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
    }
    
    function showSuccess(message, elementId = null) {
        console.log('Success:', message);
        
        // If element ID is provided, show success in that element
        if (elementId) {
            const successDiv = document.getElementById(elementId);
            if (successDiv) {
                successDiv.textContent = message;
                successDiv.classList.remove('hidden');
                
                setTimeout(() => {
                    successDiv.classList.add('hidden');
                }, 5000);
                return;
            }
        }
        
        // Try to find a section-specific success element
        const activeSection = document.querySelector('.section.active');
        if (activeSection) {
            const sectionId = activeSection.id.replace('-section', '');
            const sectionSuccessDiv = document.getElementById(`${sectionId}-success`);
            
            if (sectionSuccessDiv) {
                sectionSuccessDiv.textContent = message;
                sectionSuccessDiv.classList.remove('hidden');
                
                setTimeout(() => {
                    sectionSuccessDiv.classList.add('hidden');
                }, 5000);
                return;
            }
        }
        
        // Fallback to alert
        alert(message);
    }
    
    // Debounce function to limit API calls
    function debounce(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }
    
    // Escape HTML to prevent XSS
    function escapeHTML(str) {
        if (!str) return '';
        return str
            .toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    // Truncate text with ellipsis
    function truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
    
    // Books Management Functions
    function initBooksManagement() {
        console.log('Initializing Books Management...');
        // Load books on page load
        loadBooks();
    }
    
    async function loadBooks() {
        const booksList = document.getElementById('books-list');
        if (!booksList) return;
        
        showLoading();
        try {
            const response = await AdminApiService.getBooks();
            
            if (response.success && response.data) {
                displayBooks(response.data);
                showSuccess('Books loaded successfully');
            } else {
                showError('Failed to load books: ' + (response.error || 'Unknown error'));
                displayBooks([]);
            }
        } catch (error) {
            console.error('Error loading books:', error);
            showError('Error loading books: ' + error.message);
            displayBooks([]);
        } finally {
            hideLoading();
        }
    }
    
    function displayBooks(books) {
        const booksList = document.getElementById('books-list');
        if (!booksList) return;
        
        if (!books || books.length === 0) {
            booksList.innerHTML = '<p class="empty-message">No books found. Add some books to get started.</p>';
            return;
        }
        
        booksList.innerHTML = '';
        
        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.className = 'item';
            bookItem.dataset.id = book._id || book.id;
            
            const coverUrl = book.cover || '../image/books/default-cover.jpg';
            
            bookItem.innerHTML = `
                <div class="item-image">
                    <img src="${escapeHTML(coverUrl)}" alt="${escapeHTML(book.title)}" loading="lazy">
                </div>
                <div class="item-details">
                    <h4>${escapeHTML(book.title)}</h4>
                    <p><strong>Author:</strong> ${escapeHTML(book.author)}</p>
                    <p><strong>Category:</strong> ${escapeHTML(formatCategory(book.category))}</p>
                    <p><strong>Language:</strong> ${escapeHTML(formatLanguage(book.language))}</p>
                    <p>${truncateText(escapeHTML(book.description), 150)}</p>
                </div>
                <div class="item-actions">
                    <button class="btn btn-icon edit-book-btn" data-id="${book._id || book.id}" aria-label="Edit book">
                        <i class="fas fa-edit" aria-hidden="true"></i>
                    </button>
                    <button class="btn btn-icon delete-book-btn" data-id="${book._id || book.id}" aria-label="Delete book">
                        <i class="fas fa-trash-alt" aria-hidden="true"></i>
                    </button>
                </div>
            `;
            
            booksList.appendChild(bookItem);
            
            // Add event listeners to the buttons
            const editBtn = bookItem.querySelector('.edit-book-btn');
            const deleteBtn = bookItem.querySelector('.delete-book-btn');
            
            if (editBtn) {
                editBtn.addEventListener('click', () => editBook(book._id || book.id));
            }
            
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => deleteBook(book._id || book.id));
            }
        });
    }
    
    function formatCategory(category) {
        const categories = {
            'vedic': 'Vedic Scriptures',
            'puranas': 'Puranas & Itihasas',
            'modern': 'Modern Texts'
        };
        
        return categories[category] || category;
    }
    
    function formatLanguage(language) {
        const languages = {
            'sanskrit': 'Sanskrit',
            'english': 'English',
            'hindi': 'Hindi'
        };
        
        return languages[language] || language;
    }
    
    // Initialize PDF Management
    function initPDFManagement() {
        console.log('Initializing PDF Management...');
        // Add PDF management code here
    }
}); 