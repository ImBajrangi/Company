// Default admin credentials and initialization
const defaultAdmin = {
    email: 'admin@vrindopnishad.com',
    password: 'admin123',
    name: 'Admin',
    role: 'admin'
};

// Store in localStorage if not exists
if (!localStorage.getItem('default_admin')) {
    localStorage.setItem('default_admin', JSON.stringify(defaultAdmin));
}

// Ensure AdminApiService exists even if the main file fails to load
// This is a fallback to prevent JavaScript errors
if (typeof window.AdminApiService === 'undefined') {
    console.warn('AdminApiService not found, creating fallback');
    
    // Create a minimal fallback service
    window.AdminApiService = {
        TOKEN_KEY: 'admin_token',
        
        login(email, password) {
            console.log('Using fallback login');
            if (email === defaultAdmin.email && password === defaultAdmin.password) {
                const token = 'fallback-token-' + Date.now();
                localStorage.setItem(this.TOKEN_KEY, token);
                return Promise.resolve({ 
                    success: true, 
                    user: { ...defaultAdmin, id: '1' },
                    token 
                });
            }
            return Promise.resolve({ success: false, error: 'Invalid credentials' });
        },
        
        verifyToken() {
            const token = localStorage.getItem(this.TOKEN_KEY);
            if (token && token.startsWith('fallback-token-')) {
                return Promise.resolve({ 
                    success: true, 
                    user: { ...defaultAdmin, id: '1' } 
                });
            }
            return Promise.resolve({ success: false, error: 'Invalid token' });
        },
        
        logout() {
            localStorage.removeItem(this.TOKEN_KEY);
            return { success: true };
        },
        
        // Minimal content methods
        getGalleryItems() {
            return Promise.resolve({ success: true, data: [] });
        },
        
        getBooksItems() {
            return Promise.resolve({ success: true, data: [] });
        },
        
        getCollectionsItems() {
            return Promise.resolve({ success: true, data: [] });
        },
        
        getPDFsItems() {
            return Promise.resolve({ success: true, data: [] });
        },
        
        getUsersItems() {
            return Promise.resolve({ 
                success: true, 
                data: [{ ...defaultAdmin, id: '1' }] 
            });
        },
        
        // Item methods
        getGalleryItem(id) {
            return Promise.resolve({ success: true, data: { id, title: 'Fallback Item', description: 'This is a fallback item' } });
        },
        
        getBookItem(id) {
            return Promise.resolve({ success: true, data: { id, title: 'Fallback Book', author: 'Unknown', description: 'This is a fallback book' } });
        },
        
        getCollectionItem(id) {
            return Promise.resolve({ success: true, data: { id, title: 'Fallback Collection', description: 'This is a fallback collection' } });
        },
        
        getPDFItem(id) {
            return Promise.resolve({ success: true, data: { id, title: 'Fallback PDF', description: 'This is a fallback PDF' } });
        },
        
        getUserItem(id) {
            return Promise.resolve({ success: true, data: { ...defaultAdmin, id } });
        },
        
        // Save methods
        saveGalleryItem(formData) {
            return Promise.resolve({ success: true, data: { id: Date.now().toString(), title: formData.get('title') || 'New Item' } });
        },
        
        saveBookItem(formData) {
            return Promise.resolve({ success: true, data: { id: Date.now().toString(), title: formData.get('title') || 'New Book' } });
        },
        
        saveCollectionItem(formData) {
            return Promise.resolve({ success: true, data: { id: Date.now().toString(), title: formData.get('title') || 'New Collection' } });
        },
        
        savePDFItem(formData) {
            return Promise.resolve({ success: true, data: { id: Date.now().toString(), title: formData.get('title') || 'New PDF' } });
        },
        
        saveUserItem(formData) {
            return Promise.resolve({ success: true, data: { id: Date.now().toString(), name: formData.get('name') || 'New User' } });
        },
        
        // Delete methods
        deleteGalleryItem(id) {
            return Promise.resolve({ success: true });
        },
        
        deleteBookItem(id) {
            return Promise.resolve({ success: true });
        },
        
        deleteCollectionItem(id) {
            return Promise.resolve({ success: true });
        },
        
        deletePDFItem(id) {
            return Promise.resolve({ success: true });
        },
        
        deleteUserItem(id) {
            return Promise.resolve({ success: true });
        },
        
        // For backward compatibility
        getBooks() {
            return this.getBooksItems();
        },
        
        getBook(id) {
            return this.getBookItem(id);
        },
        
        saveBook(formData) {
            return this.saveBookItem(formData);
        },
        
        deleteBook(id) {
            return this.deleteBookItem(id);
        },
        
        getCollections() {
            return this.getCollectionsItems();
        },
        
        getCollection(id) {
            return this.getCollectionItem(id);
        },
        
        saveCollection(formData) {
            return this.saveCollectionItem(formData);
        },
        
        deleteCollection(id) {
            return this.deleteCollectionItem(id);
        },
        
        getPDFs() {
            return this.getPDFsItems();
        },
        
        getPDF(id) {
            return this.getPDFItem(id);
        },
        
        savePDF(formData) {
            return this.savePDFItem(formData);
        },
        
        deletePDF(id) {
            return this.deletePDFItem(id);
        },
        
        getUsers() {
            return this.getUsersItems();
        },
        
        getUser(id) {
            return this.getUserItem(id);
        },
        
        saveUser(formData) {
            return this.saveUserItem(formData);
        },
        
        deleteUser(id) {
            return this.deleteUserItem(id);
        }
    };
    
    // Also make it available as ApiService for compatibility
    window.ApiService = window.AdminApiService;
}

console.log('Default admin credentials loaded'); 