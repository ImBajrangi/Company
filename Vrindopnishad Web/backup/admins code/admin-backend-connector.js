// Admin Backend Connector with Real Backend API
class AdminApiService {
    static BASE_URL = 'http://localhost:5000/api';
    static TOKEN_KEY = 'admin_token';
    static MOCK_DB_KEY = 'vrindopnishad_mock_db';

    // Initialize mock database if it doesn't exist
    static initMockDatabase() {
        console.log('Mock database initialized as fallback');
        if (!localStorage.getItem(this.MOCK_DB_KEY)) {
            const mockDb = {
                gallery: [
                    {
                        id: '1',
                        title: 'Krishna with Flute',
                        description: 'Beautiful image of Lord Krishna playing flute',
                        image: './icons/icon-192x192.png',
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: '2',
                        title: 'Radha Krishna',
                        description: 'Divine couple Radha and Krishna',
                        image: './icons/icon-192x192.png',
                        createdAt: new Date().toISOString()
                    }
                ],
                books: [
                    {
                        id: '1',
                        title: 'Bhagavad Gita',
                        author: 'Vyasa',
                        description: 'The Bhagavad Gita is a 700-verse Hindu scripture that is part of the epic Mahabharata.',
                        cover: './icons/icon-192x192.png',
                        category: 'vedic',
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: '2',
                        title: 'Ramayana',
                        author: 'Valmiki',
                        description: 'The Ramayana is one of the two major Sanskrit epics of ancient India.',
                        cover: './icons/icon-192x192.png',
                        category: 'puranas',
                        createdAt: new Date().toISOString()
                    }
                ],
                collections: [
                    {
                        id: '1',
                        title: 'Vedic Scriptures',
                        description: 'Collection of ancient Vedic texts',
                        cover: './icons/icon-192x192.png',
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: '2',
                        title: 'Bhakti Literature',
                        description: 'Collection of devotional texts',
                        cover: './icons/icon-192x192.png',
                        createdAt: new Date().toISOString()
                    }
                ],
                pdfs: [
                    {
                        id: '1',
                        title: 'Bhagavad Gita PDF',
                        description: 'PDF version of Bhagavad Gita with translations',
                        file: './icons/icon-192x192.png',
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: '2',
                        title: 'Upanishads Collection',
                        description: 'Collection of major Upanishads',
                        file: './icons/icon-192x192.png',
                        createdAt: new Date().toISOString()
                    }
                ],
                users: [
                    {
                        id: '1',
                        name: 'Admin',
                        email: 'admin@vrindopnishad.com',
                        password: 'admin123', // In a real app, this would be hashed
                        role: 'admin',
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: '2',
                        name: 'Editor',
                        email: 'editor@vrindopnishad.com',
                        password: 'editor123', // In a real app, this would be hashed
                        role: 'editor',
                        createdAt: new Date().toISOString()
                    }
                ]
            };
            localStorage.setItem(this.MOCK_DB_KEY, JSON.stringify(mockDb));
            console.log('Mock database initialized');
        }
    }

    // Mock database operations
    static getMockDb() {
        this.initMockDatabase();
        return JSON.parse(localStorage.getItem(this.MOCK_DB_KEY));
    }

    static saveMockDb(db) {
        localStorage.setItem(this.MOCK_DB_KEY, JSON.stringify(db));
    }

    // Auth Methods
    static async login(email, password) {
        try {
            console.log(`Attempting login with: ${email}`);
            
            try {
                // Try real API login first
                const response = await fetch(`${this.BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                
                if (response.ok) {
                    console.log('Login successful with real API');
                    localStorage.setItem(this.TOKEN_KEY, data.token);
                    return { success: true, user: data.user || { name: 'Admin', email, role: 'admin' }, token: data.token };
                } else {
                    console.log('API login failed, trying mock database');
                    throw new Error(data.message || 'Login failed');
                }
            } catch (apiError) {
                console.log('API error, falling back to mock database', apiError);
                
                // Fallback to mock database
                const db = this.getMockDb();
                const user = db.users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    console.log('Login successful with mock database');
                    const mockUser = { ...user };
                    delete mockUser.password; // Don't send password to client
                    
                    const mockToken = `mock-token-${Date.now()}`;
                    localStorage.setItem(this.TOKEN_KEY, mockToken);
                    
                    return { 
                        success: true, 
                        user: mockUser,
                        token: mockToken
                    };
                } else {
                    console.log('Login failed: Invalid credentials');
                    return { success: false, error: 'Invalid email or password' };
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error occurred' };
        }
    }

    static async verifyToken() {
        const token = localStorage.getItem(this.TOKEN_KEY);
        if (!token) {
            return { success: false, error: 'No token found' };
        }

        try {
            // For mock token
            if (token.startsWith('mock-token-')) {
                console.log('Using mock token verification');
                return { 
                    success: true, 
                    user: {
                        id: '1',
                        name: 'Admin',
                        email: 'admin@vrindopnishad.com',
                        role: 'admin'
                    }
                };
            }

            // For real API verification
            try {
                const response = await fetch(`${this.BASE_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    return { success: true, user: data.data };
                } else {
                    throw new Error(data.message || 'Token verification failed');
                }
            } catch (apiError) {
                console.log('API token verification failed, using mock verification', apiError);
                return { 
                    success: true, 
                    user: {
                        id: '1',
                        name: 'Admin',
                        email: 'admin@vrindopnishad.com',
                        role: 'admin'
                    }
                };
            }
        } catch (error) {
            console.error('Token verification error:', error);
            return { success: false, error: 'Network error occurred' };
        }
    }

    static logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        return { success: true };
    }

    // Generic CRUD operations
    static async getItems(section) {
        try {
            const token = this.getToken();
            if (!token) {
                return { success: false, error: 'Not authenticated' };
            }

            try {
                // Try real API first
                let endpoint = '';
                switch(section) {
                    case 'gallery':
                        endpoint = '/gallery';
                        break;
                    case 'books':
                        endpoint = '/books';
                        break;
                    case 'collections':
                        endpoint = '/collections';
                        break;
                    case 'pdfs':
                        endpoint = '/pdfs';
                        break;
                    case 'users':
                        endpoint = '/users';
                        break;
                    default:
                        endpoint = `/${section}`;
                }

                const response = await this.makeAuthRequest(endpoint);
                if (response.success) {
                    // Transform the data to match our expected format if needed
                    const items = Array.isArray(response.data) ? response.data : 
                                 (response.data && response.data.data ? response.data.data : []);
                    
                    return {
                        success: true,
                        data: items.map(item => ({
                            id: item._id || item.id,
                            ...item
                        }))
                    };
                } else {
                    throw new Error(response.error || `Failed to fetch ${section}`);
                }
            } catch (apiError) {
                console.log(`API error fetching ${section}, falling back to mock data`, apiError);
                
                // Fallback to mock database
                if (token.startsWith('mock-token-')) {
                    const db = this.getMockDb();
                    return {
                        success: true,
                        data: db[section] || []
                    };
                } else {
                    throw apiError;
                }
            }
        } catch (error) {
            console.error(`Error getting ${section}:`, error);
            return { success: false, error: 'Failed to fetch data' };
        }
    }

    static async getItem(section, id) {
        try {
            const token = this.getToken();
            if (!token) {
                return { success: false, error: 'Not authenticated' };
            }

            try {
                // Try real API first
                let endpoint = '';
                switch(section) {
                    case 'gallery':
                        endpoint = `/gallery/${id}`;
                        break;
                    case 'books':
                        endpoint = `/books/${id}`;
                        break;
                    case 'collections':
                        endpoint = `/collections/${id}`;
                        break;
                    case 'pdfs':
                        endpoint = `/pdfs/${id}`;
                        break;
                    case 'users':
                        endpoint = `/users/${id}`;
                        break;
                    default:
                        endpoint = `/${section}/${id}`;
                }

                const response = await this.makeAuthRequest(endpoint);
                if (response.success) {
                    // Transform the data to match our expected format if needed
                    const item = response.data;
                    return {
                        success: true,
                        data: {
                            id: item._id || item.id,
                            ...item
                        }
                    };
                } else {
                    throw new Error(response.error || `Failed to fetch ${section} item`);
                }
            } catch (apiError) {
                console.log(`API error fetching ${section} item, falling back to mock data`, apiError);
                
                // Fallback to mock database
                if (token.startsWith('mock-token-')) {
                    const db = this.getMockDb();
                    const item = db[section].find(item => item.id === id);
                    
                    if (item) {
                        return {
                            success: true,
                            data: item
                        };
                    } else {
                        return {
                            success: false,
                            error: `${section.slice(0, -1)} not found`
                        };
                    }
                } else {
                    throw apiError;
                }
            }
        } catch (error) {
            console.error(`Error getting ${section} item:`, error);
            return { success: false, error: 'Failed to fetch data' };
        }
    }

    static async saveItem(section, formData) {
        try {
            const token = this.getToken();
            if (!token) {
                return { success: false, error: 'Not authenticated' };
            }

            try {
                // Try real API first
                const id = formData.get('id');
                let endpoint = '';
                let method = id ? 'PUT' : 'POST';
                
                switch(section) {
                    case 'gallery':
                        endpoint = id ? `/gallery/${id}` : '/gallery';
                        break;
                    case 'books':
                        endpoint = id ? `/books/${id}` : '/books';
                        break;
                    case 'collections':
                        endpoint = id ? `/collections/${id}` : '/collections';
                        break;
                    case 'pdfs':
                        endpoint = id ? `/pdfs/${id}` : '/pdfs';
                        break;
                    case 'users':
                        endpoint = id ? `/users/${id}` : '/users';
                        break;
                    default:
                        endpoint = id ? `/${section}/${id}` : `/${section}`;
                }

                // For file uploads
                const response = await this.makeAuthRequest(endpoint, {
                    method,
                    body: formData,
                    headers: {} // Let fetch set the Content-Type with boundary for FormData
                });
                
                if (response.success) {
                    // Transform the data to match our expected format if needed
                    const item = response.data;
                    return {
                        success: true,
                        data: {
                            id: item._id || item.id,
                            ...item
                        }
                    };
                } else {
                    throw new Error(response.error || `Failed to save ${section} item`);
                }
            } catch (apiError) {
                console.log(`API error saving ${section} item, falling back to mock data`, apiError);
                
                // Fallback to mock database
                if (token.startsWith('mock-token-')) {
                    const db = this.getMockDb();
                    const id = formData.get('id');
                    
                    // Convert FormData to object
                    const itemData = {};
                    for (const [key, value] of formData.entries()) {
                        // Skip file inputs if they're empty
                        if ((key === 'image' || key === 'cover' || key === 'file') && 
                            (value instanceof File && value.size === 0)) {
                            continue;
                        }
                        
                        // For file inputs, we'd normally upload the file and store the URL
                        // For mock data, we'll just use a placeholder
                        if (value instanceof File && value.size > 0) {
                            itemData[key] = './icons/icon-192x192.png';
                        } else {
                            itemData[key] = value;
                        }
                    }
                    
                    // Update or create
                    if (id) {
                        // Update existing item
                        const index = db[section].findIndex(item => item.id === id);
                        if (index !== -1) {
                            // Preserve fields that weren't in the form
                            const existingItem = db[section][index];
                            db[section][index] = {
                                ...existingItem,
                                ...itemData,
                                updatedAt: new Date().toISOString()
                            };
                            
                            this.saveMockDb(db);
                            return {
                                success: true,
                                data: db[section][index]
                            };
                        } else {
                            return {
                                success: false,
                                error: `${section.slice(0, -1)} not found`
                            };
                        }
                    } else {
                        // Create new item
                        const newItem = {
                            ...itemData,
                            id: Date.now().toString(),
                            createdAt: new Date().toISOString()
                        };
                        
                        db[section].push(newItem);
                        this.saveMockDb(db);
                        
                        return {
                            success: true,
                            data: newItem
                        };
                    }
                } else {
                    throw apiError;
                }
            }
        } catch (error) {
            console.error(`Error saving ${section} item:`, error);
            return { success: false, error: 'Failed to save data' };
        }
    }

    static async deleteItem(section, id) {
        try {
            const token = this.getToken();
            if (!token) {
                return { success: false, error: 'Not authenticated' };
            }

            try {
                // Try real API first
                let endpoint = '';
                switch(section) {
                    case 'gallery':
                        endpoint = `/gallery/${id}`;
                        break;
                    case 'books':
                        endpoint = `/books/${id}`;
                        break;
                    case 'collections':
                        endpoint = `/collections/${id}`;
                        break;
                    case 'pdfs':
                        endpoint = `/pdfs/${id}`;
                        break;
                    case 'users':
                        endpoint = `/users/${id}`;
                        break;
                    default:
                        endpoint = `/${section}/${id}`;
                }

                const response = await this.makeAuthRequest(endpoint, {
                    method: 'DELETE'
                });
                
                if (response.success) {
                    return { success: true };
                } else {
                    throw new Error(response.error || `Failed to delete ${section} item`);
                }
            } catch (apiError) {
                console.log(`API error deleting ${section} item, falling back to mock data`, apiError);
                
                // Fallback to mock database
                if (token.startsWith('mock-token-')) {
                    const db = this.getMockDb();
                    const index = db[section].findIndex(item => item.id === id);
                    
                    if (index !== -1) {
                        db[section].splice(index, 1);
                        this.saveMockDb(db);
                        
                        return {
                            success: true
                        };
                    } else {
                        return {
                            success: false,
                            error: `${section.slice(0, -1)} not found`
                        };
                    }
                } else {
                    throw apiError;
                }
            }
        } catch (error) {
            console.error(`Error deleting ${section} item:`, error);
            return { success: false, error: 'Failed to delete data' };
        }
    }

    // Content Management Methods - Using the generic CRUD operations
    static async getGalleryItems() {
        return this.getItems('gallery');
    }

    static async getGalleryItem(id) {
        return this.getItem('gallery', id);
    }

    static async saveGalleryItem(formData) {
        return this.saveItem('gallery', formData);
    }

    static async deleteGalleryItem(id) {
        return this.deleteItem('gallery', id);
    }

    static async getBooksItems() {
        return this.getItems('books');
    }

    static async getBookItem(id) {
        return this.getItem('books', id);
    }

    static async saveBookItem(formData) {
        return this.saveItem('books', formData);
    }

    static async deleteBookItem(id) {
        return this.deleteItem('books', id);
    }

    static async getCollectionsItems() {
        return this.getItems('collections');
    }

    static async getCollectionItem(id) {
        return this.getItem('collections', id);
    }

    static async saveCollectionItem(formData) {
        return this.saveItem('collections', formData);
    }

    static async deleteCollectionItem(id) {
        return this.deleteItem('collections', id);
    }

    static async getPDFsItems() {
        return this.getItems('pdfs');
    }

    static async getPDFItem(id) {
        return this.getItem('pdfs', id);
    }

    static async savePDFItem(formData) {
        return this.saveItem('pdfs', formData);
    }

    static async deletePDFItem(id) {
        return this.deleteItem('pdfs', id);
    }

    static async getUsersItems() {
        return this.getItems('users');
    }

    static async getUserItem(id) {
        return this.getItem('users', id);
    }

    static async saveUserItem(formData) {
        return this.saveItem('users', formData);
    }

    static async deleteUserItem(id) {
        return this.deleteItem('users', id);
    }

    // For backward compatibility
    static async getBooks() {
        return this.getBooksItems();
    }

    static async getBook(id) {
        return this.getBookItem(id);
    }

    static async saveBook(formData) {
        return this.saveBookItem(formData);
    }

    static async deleteBook(id) {
        return this.deleteBookItem(id);
    }

    static async getCollections() {
        return this.getCollectionsItems();
    }

    static async getCollection(id) {
        return this.getCollectionItem(id);
    }

    static async saveCollection(formData) {
        return this.saveCollectionItem(formData);
    }

    static async deleteCollection(id) {
        return this.deleteCollectionItem(id);
    }

    static async getPDFs() {
        return this.getPDFsItems();
    }

    static async getPDF(id) {
        return this.getPDFItem(id);
    }

    static async savePDF(formData) {
        return this.savePDFItem(formData);
    }

    static async deletePDF(id) {
        return this.deletePDFItem(id);
    }

    static async getUsers() {
        return this.getUsersItems();
    }

    static async getUser(id) {
        return this.getUserItem(id);
    }

    static async saveUser(formData) {
        return this.saveUserItem(formData);
    }

    static async deleteUser(id) {
        return this.deleteUserItem(id);
    }

    // Helper Methods
    static getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static async makeAuthRequest(endpoint, options = {}) {
        const token = this.getToken();
        if (!token) {
            return { success: false, error: 'Not authenticated' };
        }

        try {
            const headers = {
                'Authorization': `Bearer ${token}`,
                ...options.headers
            };

            // Don't set Content-Type for FormData
            if (!(options.body instanceof FormData)) {
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(`${this.BASE_URL}${endpoint}`, {
                ...options,
                headers
            });

            const data = await response.json();
            return { 
                success: response.ok, 
                data: data.data || data,
                error: !response.ok ? (data.message || 'API request failed') : null
            };
        } catch (error) {
            console.error('API request error:', error);
            return { success: false, error: 'Network error occurred' };
        }
    }

    // Search functionality
    static async searchItems(section, query) {
        try {
            const token = this.getToken();
            if (!token) {
                return { success: false, error: 'Not authenticated' };
            }

            try {
                // Try real API search first
                let endpoint = '';
                switch(section) {
                    case 'gallery':
                        endpoint = `/gallery?search=${encodeURIComponent(query)}`;
                        break;
                    case 'books':
                        endpoint = `/books?search=${encodeURIComponent(query)}`;
                        break;
                    case 'collections':
                        endpoint = `/collections?search=${encodeURIComponent(query)}`;
                        break;
                    case 'pdfs':
                        endpoint = `/pdfs?search=${encodeURIComponent(query)}`;
                        break;
                    case 'users':
                        endpoint = `/users?search=${encodeURIComponent(query)}`;
                        break;
                    default:
                        endpoint = `/${section}?search=${encodeURIComponent(query)}`;
                }

                const response = await this.makeAuthRequest(endpoint);
                if (response.success) {
                    // Transform the data to match our expected format if needed
                    const items = Array.isArray(response.data) ? response.data : 
                                 (response.data && response.data.data ? response.data.data : []);
                    
                    return {
                        success: true,
                        data: items.map(item => ({
                            id: item._id || item.id,
                            ...item
                        }))
                    };
                } else {
                    throw new Error(response.error || `Failed to search ${section}`);
                }
            } catch (apiError) {
                console.log(`API error searching ${section}, falling back to mock data`, apiError);
                
                // Fallback to mock database
                if (token.startsWith('mock-token-')) {
                    const db = this.getMockDb();
                    const items = db[section] || [];
                    
                    // Simple search implementation
                    const results = items.filter(item => {
                        const searchableFields = ['title', 'description', 'author', 'name', 'email', 'category', 'role'];
                        return searchableFields.some(field => {
                            if (item[field]) {
                                return item[field].toLowerCase().includes(query.toLowerCase());
                            }
                            return false;
                        });
                    });
                    
                    return {
                        success: true,
                        data: results
                    };
                } else {
                    throw apiError;
                }
            }
        } catch (error) {
            console.error(`Error searching ${section}:`, error);
            return { success: false, error: 'Failed to search data' };
        }
    }
}

// Make AdminApiService globally accessible
window.AdminApiService = AdminApiService;
// Also make it available as ApiService for compatibility
window.ApiService = AdminApiService;

// Initialize mock database
AdminApiService.initMockDatabase();

// Log initialization
console.log('Admin Backend Connector initialized with real API and mock database fallback'); 