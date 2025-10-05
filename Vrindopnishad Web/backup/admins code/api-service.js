/**
 * API Service for Admin Panel
 */
class ApiService {
    static BASE_URL = 'http://localhost:5000/api';
    static TOKEN_KEY = 'admin_token';

    // Helper Methods
    static async request(endpoint, options = {}) {
        try {
            const token = localStorage.getItem(this.TOKEN_KEY);
            const headers = {
    'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers
            };

            const response = await fetch(`${this.BASE_URL}${endpoint}`, {
                ...options,
                headers
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem(this.TOKEN_KEY);
                    window.location.reload();
                    return { success: false, error: 'Session expired' };
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('API Request failed:', error);
            return { success: false, error: error.message };
        }
    }

    static async uploadRequest(endpoint, formData, method = 'POST') {
        try {
            const token = localStorage.getItem(this.TOKEN_KEY);
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const response = await fetch(`${this.BASE_URL}${endpoint}`, {
                method,
                headers,
                body: formData
        });
        
        if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem(this.TOKEN_KEY);
                    window.location.reload();
                    return { success: false, error: 'Session expired' };
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
    } catch (error) {
            console.error('Upload Request failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Auth Methods
    static async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (response.success) {
            localStorage.setItem(this.TOKEN_KEY, response.data.token);
        }

        return response;
    }

    static async logout() {
        await this.request('/auth/logout', { method: 'POST' });
        localStorage.removeItem(this.TOKEN_KEY);
        return { success: true };
    }

    static async verifyToken() {
        return this.request('/auth/verify');
    }

    // Gallery Methods
    static async getGalleryItems() {
        return this.request('/gallery');
    }

    static async getGalleryItem(id) {
        return this.request(`/gallery/${id}`);
    }

    static async saveGalleryItem(formData) {
        const id = formData.get('id');
        return this.uploadRequest(
            id ? `/gallery/${id}` : '/gallery',
            formData,
            id ? 'PUT' : 'POST'
        );
    }

    static async deleteGalleryItem(id) {
        return this.request(`/gallery/${id}`, { method: 'DELETE' });
    }

    // Book Methods
    static async getBooks() {
        return this.request('/books');
    }

    static async getBook(id) {
        return this.request(`/books/${id}`);
    }

    static async saveBook(formData) {
        const id = formData.get('id');
        return this.uploadRequest(
            id ? `/books/${id}` : '/books',
            formData,
            id ? 'PUT' : 'POST'
        );
    }

    static async deleteBook(id) {
        return this.request(`/books/${id}`, { method: 'DELETE' });
    }

    // Collection Methods
    static async getCollections() {
        return this.request('/collections');
    }

    static async getCollection(id) {
        return this.request(`/collections/${id}`);
    }

    static async saveCollection(formData) {
        const id = formData.get('id');
        return this.uploadRequest(
            id ? `/collections/${id}` : '/collections',
            formData,
            id ? 'PUT' : 'POST'
        );
    }

    static async deleteCollection(id) {
        return this.request(`/collections/${id}`, { method: 'DELETE' });
    }

    // PDF Methods
    static async getPDFs() {
        return this.request('/pdfs');
    }

    static async getPDF(id) {
        return this.request(`/pdfs/${id}`);
    }

    static async savePDF(formData) {
        const id = formData.get('id');
        return this.uploadRequest(
            id ? `/pdfs/${id}` : '/pdfs',
            formData,
            id ? 'PUT' : 'POST'
        );
    }

    static async deletePDF(id) {
        return this.request(`/pdfs/${id}`, { method: 'DELETE' });
    }

    // User Methods
    static async getUsers() {
        return this.request('/users');
    }

    static async getUser(id) {
        return this.request(`/users/${id}`);
    }

    static async saveUser(formData) {
        const id = formData.get('id');
        return this.uploadRequest(
            id ? `/users/${id}` : '/users',
            formData,
            id ? 'PUT' : 'POST'
        );
    }

    static async deleteUser(id) {
        return this.request(`/users/${id}`, { method: 'DELETE' });
    }

    // Search Methods
    static async search(section, query) {
        return this.request(`/${section}/search?q=${encodeURIComponent(query)}`);
    }

    // Utility Methods
    static isAuthenticated() {
        return !!localStorage.getItem(this.TOKEN_KEY);
    }

    static getAuthToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }
}

// Make ApiService globally accessible
window.ApiService = ApiService; 