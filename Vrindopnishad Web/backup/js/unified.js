/**
 * Unified Data API Library
 * Provides external access to the unified data management system
 * Version: 1.0.0
 */

(function(window) {
    'use strict';

    // Check if data manager is available
    const getDataManager = () => {
        if (typeof window.dataManager !== 'undefined') {
            return window.dataManager;
        }
        
        // Try to get data from localStorage directly
        const stored = localStorage.getItem('unifiedWebData');
        if (stored) {
            return {
                data: JSON.parse(stored)
            };
        }
        
        // Return empty data structure
        return {
            data: {
                books: [],
                images: [],
                audio: [],
                content: [],
                collections: {}
            }
        };
    };

    // Core API object
    const UnifiedAPI = {
        // Version info
        version: '1.0.0',
        
        // Get all data
        getAllData() {
            const manager = getDataManager();
            return manager.data || {};
        },

        // Books API
        getBooks(category = null) {
            const manager = getDataManager();
            const books = manager.data.books || [];
            return category ? books.filter(book => book.category === category) : books;
        },

        getBooksData() {
            return {
                books: this.getBooks()
            };
        },

        addBook(book) {
            if (window.dataManager) {
                window.dataManager.addBook(book);
                return true;
            }
            return false;
        },

        updateBook(id, updatedBook) {
            if (window.dataManager) {
                window.dataManager.updateBook(id, updatedBook);
                return true;
            }
            return false;
        },

        deleteBook(id) {
            if (window.dataManager) {
                window.dataManager.deleteBook(id);
                return true;
            }
            return false;
        },

        // Images API
        getImages(category = null) {
            const manager = getDataManager();
            const images = manager.data.images || [];
            return category ? images.filter(image => image.category === category) : images;
        },

        getImagesData() {
            const images = this.getImages();
            const categories = [...new Set(images.map(img => img.category))].filter(Boolean);
            return {
                images: images,
                categories: categories
            };
        },

        addImage(image) {
            if (window.dataManager) {
                window.dataManager.addImage(image);
                return true;
            }
            return false;
        },

        updateImage(id, updatedImage) {
            if (window.dataManager) {
                window.dataManager.updateImage(id, updatedImage);
                return true;
            }
            return false;
        },

        deleteImage(id) {
            if (window.dataManager) {
                window.dataManager.deleteImage(id);
                return true;
            }
            return false;
        },

        // Audio API
        getAudio(category = null) {
            const manager = getDataManager();
            const audio = manager.data.audio || [];
            return category ? audio.filter(track => track.category === category) : audio;
        },

        getAudioData() {
            return {
                audio: this.getAudio()
            };
        },

        addAudio(audio) {
            if (window.dataManager) {
                window.dataManager.addAudio(audio);
                return true;
            }
            return false;
        },

        updateAudio(id, updatedAudio) {
            if (window.dataManager) {
                window.dataManager.updateAudio(id, updatedAudio);
                return true;
            }
            return false;
        },

        deleteAudio(id) {
            if (window.dataManager) {
                window.dataManager.deleteAudio(id);
                return true;
            }
            return false;
        },

        // Content API
        getContent(status = null) {
            const manager = getDataManager();
            const content = manager.data.content || [];
            return status ? content.filter(item => item.status === status) : content;
        },

        getContentData() {
            return {
                content: this.getContent()
            };
        },

        addContent(content) {
            if (window.dataManager) {
                window.dataManager.addContent(content);
                return true;
            }
            return false;
        },

        updateContent(id, updatedContent) {
            if (window.dataManager) {
                window.dataManager.updateContent(id, updatedContent);
                return true;
            }
            return false;
        },

        deleteContent(id) {
            if (window.dataManager) {
                window.dataManager.deleteContent(id);
                return true;
            }
            return false;
        },

        // Collections API
        getCollections() {
            const manager = getDataManager();
            return manager.data.collections || {};
        },

        getCollection(key) {
            const collections = this.getCollections();
            return collections[key] || null;
        },

        addToCollection(collectionKey, item) {
            const manager = getDataManager();
            if (manager.data.collections && manager.data.collections[collectionKey]) {
                manager.data.collections[collectionKey].items = manager.data.collections[collectionKey].items || [];
                manager.data.collections[collectionKey].items.push(item);
                
                if (window.dataManager) {
                    window.dataManager.saveData();
                }
                return true;
            }
            return false;
        },

        // Search functionality
        search(query, options = {}) {
            if (!query || typeof query !== 'string') {
                return {
                    books: [],
                    images: [],
                    audio: [],
                    content: [],
                    total: 0
                };
            }

            const searchTerm = query.toLowerCase();
            const { limit = null, types = ['books', 'images', 'audio', 'content'] } = options;

            const results = {
                books: [],
                images: [],
                audio: [],
                content: [],
                total: 0
            };

            // Search books
            if (types.includes('books')) {
                results.books = this.getBooks().filter(book => 
                    book.title.toLowerCase().includes(searchTerm) ||
                    book.author.toLowerCase().includes(searchTerm) ||
                    (book.description && book.description.toLowerCase().includes(searchTerm)) ||
                    (book.category && book.category.toLowerCase().includes(searchTerm))
                );
            }

            // Search images
            if (types.includes('images')) {
                results.images = this.getImages().filter(image => 
                    image.title.toLowerCase().includes(searchTerm) ||
                    (image.description && image.description.toLowerCase().includes(searchTerm)) ||
                    (image.category && image.category.toLowerCase().includes(searchTerm)) ||
                    (image.alt && image.alt.toLowerCase().includes(searchTerm))
                );
            }

            // Search audio
            if (types.includes('audio')) {
                results.audio = this.getAudio().filter(audio => 
                    audio.title.toLowerCase().includes(searchTerm) ||
                    (audio.artist && audio.artist.toLowerCase().includes(searchTerm)) ||
                    (audio.description && audio.description.toLowerCase().includes(searchTerm)) ||
                    (audio.category && audio.category.toLowerCase().includes(searchTerm))
                );
            }

            // Search content
            if (types.includes('content')) {
                results.content = this.getContent().filter(content => 
                    content.title.toLowerCase().includes(searchTerm) ||
                    (content.body && content.body.toLowerCase().includes(searchTerm)) ||
                    (content.excerpt && content.excerpt.toLowerCase().includes(searchTerm)) ||
                    (content.tags && content.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
                );
            }

            // Calculate total
            results.total = results.books.length + results.images.length + 
                          results.audio.length + results.content.length;

            // Apply limit if specified
            if (limit && typeof limit === 'number' && limit > 0) {
                let remaining = limit;
                Object.keys(results).forEach(key => {
                    if (key !== 'total' && Array.isArray(results[key])) {
                        const take = Math.min(remaining, results[key].length);
                        results[key] = results[key].slice(0, take);
                        remaining -= take;
                    }
                });
            }

            return results;
        },

        // Filter functionality
        filter(type, filterFn) {
            switch(type) {
                case 'books':
                    return this.getBooks().filter(filterFn);
                case 'images':
                    return this.getImages().filter(filterFn);
                case 'audio':
                    return this.getAudio().filter(filterFn);
                case 'content':
                    return this.getContent().filter(filterFn);
                default:
                    return [];
            }
        },

        // Utility functions
        getStats() {
            return {
                books: this.getBooks().length,
                images: this.getImages().length,
                audio: this.getAudio().length,
                content: this.getContent().length,
                collections: Object.keys(this.getCollections()).length
            };
        },

        // Data export
        export(type = 'all', format = 'json') {
            let data;
            
            switch(type) {
                case 'books':
                    data = this.getBooksData();
                    break;
                case 'images':
                    data = this.getImagesData();
                    break;
                case 'audio':
                    data = this.getAudioData();
                    break;
                case 'content':
                    data = this.getContentData();
                    break;
                case 'collections':
                    data = { collections: this.getCollections() };
                    break;
                default:
                    data = this.getAllData();
            }

            if (format === 'json') {
                return JSON.stringify(data, null, 2);
            }
            
            return data;
        },

        // Validation helpers
        validateBook(book) {
            const required = ['title', 'author'];
            const missing = required.filter(field => !book[field]);
            
            return {
                valid: missing.length === 0,
                missing: missing,
                errors: missing.map(field => `${field} is required`)
            };
        },

        validateImage(image) {
            const required = ['title', 'src'];
            const missing = required.filter(field => !image[field]);
            
            const validation = {
                valid: missing.length === 0,
                missing: missing,
                errors: missing.map(field => `${field} is required`)
            };

            // Validate URL format
            if (image.src && !this.isValidUrl(image.src)) {
                validation.valid = false;
                validation.errors.push('src must be a valid URL');
            }

            return validation;
        },

        validateAudio(audio) {
            const required = ['title', 'src'];
            const missing = required.filter(field => !audio[field]);
            
            const validation = {
                valid: missing.length === 0,
                missing: missing,
                errors: missing.map(field => `${field} is required`)
            };

            // Validate URL format
            if (audio.src && !this.isValidUrl(audio.src)) {
                validation.valid = false;
                validation.errors.push('src must be a valid URL');
            }

            return validation;
        },

        validateContent(content) {
            const required = ['title'];
            const missing = required.filter(field => !content[field]);
            
            return {
                valid: missing.length === 0,
                missing: missing,
                errors: missing.map(field => `${field} is required`)
            };
        },

        isValidUrl(string) {
            try {
                new URL(string);
                return true;
            } catch (_) {
                return false;
            }
        },

        // Category helpers
        getBookCategories() {
            const books = this.getBooks();
            return [...new Set(books.map(book => book.category))].filter(Boolean);
        },

        getImageCategories() {
            const images = this.getImages();
            return [...new Set(images.map(image => image.category))].filter(Boolean);
        },

        getAudioCategories() {
            const audio = this.getAudio();
            return [...new Set(audio.map(track => track.category))].filter(Boolean);
        },

        // Recent items
        getRecentItems(type, limit = 5) {
            let items = [];
            
            switch(type) {
                case 'books':
                    items = this.getBooks();
                    break;
                case 'images':
                    items = this.getImages();
                    break;
                case 'audio':
                    items = this.getAudio();
                    break;
                case 'content':
                    items = this.getContent();
                    break;
            }

            return items
                .sort((a, b) => {
                    const dateA = new Date(a.created || a.modified || 0);
                    const dateB = new Date(b.created || b.modified || 0);
                    return dateB - dateA;
                })
                .slice(0, limit);
        },

        // Get random items
        getRandomItems(type, limit = 5) {
            let items = [];
            
            switch(type) {
                case 'books':
                    items = this.getBooks();
                    break;
                case 'images':
                    items = this.getImages();
                    break;
                case 'audio':
                    items = this.getAudio();
                    break;
                case 'content':
                    items = this.getContent();
                    break;
            }

            // Shuffle array and return limited results
            const shuffled = items.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, limit);
        },

        // Event system for external integrations
        events: {},

        on(eventName, callback) {
            if (!this.events[eventName]) {
                this.events[eventName] = [];
            }
            this.events[eventName].push(callback);
        },

        trigger(eventName, data) {
            if (this.events[eventName]) {
                this.events[eventName].forEach(callback => {
                    try {
                        callback(data);
                    } catch (error) {
                        console.error('Event callback error:', error);
                    }
                });
            }
        },

        // Health check
        isHealthy() {
            try {
                const data = this.getAllData();
                return {
                    healthy: true,
                    dataManager: typeof window.dataManager !== 'undefined',
                    localStorage: typeof localStorage !== 'undefined',
                    hasData: Object.keys(data).length > 0,
                    timestamp: new Date().toISOString()
                };
            } catch (error) {
                return {
                    healthy: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                };
            }
        }
    };

    // Legacy compatibility
    const UnifiedDataManager = {
        getAllData: () => UnifiedAPI.getAllData(),
        getBooks: (category) => UnifiedAPI.getBooks(category),
        getImages: (category) => UnifiedAPI.getImages(category),
        getAudio: (category) => UnifiedAPI.getAudio(category),
        getContent: (status) => UnifiedAPI.getContent(status),
        getBooksData: () => UnifiedAPI.getBooksData(),
        getImagesData: () => UnifiedAPI.getImagesData(),
        getAudioData: () => UnifiedAPI.getAudioData(),
        getContentData: () => UnifiedAPI.getContentData(),
        search: (query) => UnifiedAPI.search(query),
        filter: (type, filterFn) => UnifiedAPI.filter(type, filterFn),
        getStats: () => UnifiedAPI.getStats()
    };

    // Export to global scope
    window.UnifiedAPI = UnifiedAPI;
    window.UnifiedDataManager = UnifiedDataManager;

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return UnifiedAPI;
        });
    }

    // CommonJS support
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = UnifiedAPI;
    }

})(typeof window !== 'undefined' ? window : this);