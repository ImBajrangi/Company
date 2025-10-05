// Enhanced Unified Data Manager with Edit Functionality
class UnifiedDataManager {
    constructor() {
        this.data = this.loadData();
        this.currentEditingItem = null;
        this.currentEditingType = null;
        this.init();
    }

    init() {
        this.bindEventListeners();
        this.updateStats();
        this.updatePreview();
        this.loadInitialData();
    }

    loadData() {
        const defaultData = {
            books: [],
            images: [],
            audio: [],
            collections: {
                featured: { title: "Featured Collections", items: [] },
                popular: { title: "Popular Right Now", items: [] },
                nature: { title: "Nature & Landscapes", items: [] },
                anime: { title: "Anime & Art", items: [] },
                architecture: { title: "Architecture & Urban", items: [] }
            },
            content: [],
            siteConfig: {
                siteName: "Vrindopnishad",
                tagline: "Spiritual & Divine Collection",
                description: "Discover sacred images and divine artworks that inspire the soul."
            }
        };

        const stored = localStorage.getItem('unifiedWebData');
        return stored ? JSON.parse(stored) : defaultData;
    }

    saveData() {
        localStorage.setItem('unifiedWebData', JSON.stringify(this.data));
        this.updatePreview();
        this.updateStats();
        this.showMessage('Data saved successfully!', 'success');
    }

    bindEventListeners() {
        // Form submissions
        this.bindFormListener('bookForm', this.handleBookSubmit.bind(this));
        this.bindFormListener('imageForm', this.handleImageSubmit.bind(this));
        this.bindFormListener('audioForm', this.handleAudioSubmit.bind(this));
        this.bindFormListener('contentForm', this.handleContentSubmit.bind(this));
        this.bindFormListener('collectionForm', this.handleCollectionSubmit.bind(this));

        // Image preview
        const imageSrc = document.getElementById('imageSrc');
        if (imageSrc) {
            imageSrc.addEventListener('input', this.handleImagePreview.bind(this));
        }

        // Auto-save interval
        setInterval(() => {
            if (this.hasUnsavedChanges()) {
                this.saveData();
            }
        }, 30000);
    }

    bindFormListener(formId, handler) {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', handler);
        }
    }

    hasUnsavedChanges() {
        // Simple check - in a real app, you'd track dirty state
        return true;
    }

    // Books Management
    handleBookSubmit(e) {
        e.preventDefault();
        const formData = this.getFormData('book');
        
        if (this.currentEditingItem && this.currentEditingType === 'book') {
            this.updateBook(this.currentEditingItem.id, formData);
        } else {
            this.addBook(formData);
        }
        
        this.clearBookForm();
        this.displayBooks();
    }

    getFormData(type) {
        const data = {};
        const prefix = type;
        
        document.querySelectorAll(`[id^="${prefix}"]`).forEach(element => {
            const key = element.id.replace(prefix, '').toLowerCase();
            if (element.type === 'checkbox') {
                data[key] = element.checked;
            } else if (element.tagName === 'SELECT') {
                data[key] = element.value;
            } else {
                data[key] = element.value;
            }
        });
        
        // Special handling for specific fields
        if (type === 'book') {
            if (data.formats) {
                data.formats = data.formats.split(',').map(f => f.trim()).filter(f => f);
            }
            if (data.gallery) {
                data.gallery = data.gallery.split(',').map(g => g.trim()).filter(g => g);
            }
        }
        
        if (type === 'content') {
            if (data.tags) {
                data.tags = data.tags.split(',').map(t => t.trim()).filter(t => t);
            }
        }

        return data;
    }

    addBook(book) {
        book.id = Date.now();
        book.readingProgress = 0;
        book.created = new Date().toISOString();
        this.data.books.push(book);
        this.saveData();
    }

    updateBook(id, updatedBook) {
        const index = this.data.books.findIndex(book => book.id === id);
        if (index !== -1) {
            updatedBook.id = id;
            updatedBook.modified = new Date().toISOString();
            this.data.books[index] = { ...this.data.books[index], ...updatedBook };
            this.saveData();
            this.currentEditingItem = null;
            this.currentEditingType = null;
            this.showMessage('Book updated successfully!', 'success');
        }
    }

    deleteBook(id) {
        if (confirm('Are you sure you want to delete this book?')) {
            this.data.books = this.data.books.filter(book => book.id !== id);
            this.saveData();
            this.displayBooks();
            this.showMessage('Book deleted successfully!', 'success');
        }
    }

    editBook(id) {
        const book = this.data.books.find(b => b.id === id);
        if (book) {
            this.currentEditingItem = book;
            this.currentEditingType = 'book';
            this.populateBookForm(book);
            document.getElementById('saveBookBtn').innerHTML = '<i class="fas fa-save"></i> Update Book';
            document.querySelector('button[onclick="showTab(\'books\')"]').click();
        }
    }

    populateBookForm(book) {
        document.getElementById('bookTitle').value = book.title || '';
        document.getElementById('bookAuthor').value = book.author || '';
        document.getElementById('bookYear').value = book.year || '';
        document.getElementById('bookCategory').value = book.category || 'vedic';
        document.getElementById('bookLanguage').value = book.language || 'sanskrit';
        document.getElementById('bookCover').value = book.cover || '';
        document.getElementById('bookFormats').value = book.formats ? book.formats.join(', ') : '';
        document.getElementById('bookGallery').value = book.gallery ? book.gallery.join(', ') : '';
        document.getElementById('bookDescription').value = book.description || '';
    }

    clearBookForm() {
        document.getElementById('bookForm').reset();
        this.currentEditingItem = null;
        this.currentEditingType = null;
        document.getElementById('saveBookBtn').innerHTML = '<i class="fas fa-save"></i> Add Book';
    }

    displayBooks() {
        const books = this.getBooks();
        const container = document.getElementById('booksList');
        if (!container) return;

        container.innerHTML = books.map(book => `
            <div class="item-card">
                <div class="item-header">
                    <div class="item-title">${this.escapeHtml(book.title)}</div>
                    <div class="item-actions">
                        <button class="btn btn-secondary" onclick="dataManager.editBook(${book.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger" onclick="dataManager.deleteBook(${book.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                <div class="item-meta">
                    <strong>Author:</strong> ${this.escapeHtml(book.author || 'Unknown')} | 
                    <strong>Year:</strong> ${this.escapeHtml(book.year || 'N/A')} | 
                    <strong>Category:</strong> ${this.escapeHtml(book.category || 'N/A')} | 
                    <strong>Language:</strong> ${this.escapeHtml(book.language || 'N/A')}
                </div>
                ${book.cover ? `<img src="${book.cover}" alt="${book.title}" style="max-width: 100px; height: auto; border-radius: 8px; margin: 10px 0;">` : ''}
                ${book.description ? `<div class="item-description">${this.escapeHtml(book.description)}</div>` : ''}
                ${book.formats && book.formats.length ? `<div class="item-meta"><strong>Formats:</strong> ${book.formats.join(', ')}</div>` : ''}
            </div>
        `).join('');
    }

    getBooks(category = null) {
        return category ? 
            this.data.books.filter(book => book.category === category) : 
            this.data.books;
    }

    // Images Management
    handleImageSubmit(e) {
        e.preventDefault();
        const formData = this.getFormData('image');
        
        if (this.currentEditingItem && this.currentEditingType === 'image') {
            this.updateImage(this.currentEditingItem.id, formData);
        } else {
            this.addImage(formData);
        }
        
        this.clearImageForm();
        this.displayImages();
    }

    addImage(image) {
        image.id = Date.now().toString();
        image.created = new Date().toISOString();
        this.data.images.push(image);
        this.saveData();
    }

    updateImage(id, updatedImage) {
        const index = this.data.images.findIndex(image => image.id === id);
        if (index !== -1) {
            updatedImage.id = id;
            updatedImage.modified = new Date().toISOString();
            this.data.images[index] = { ...this.data.images[index], ...updatedImage };
            this.saveData();
            this.currentEditingItem = null;
            this.currentEditingType = null;
            this.showMessage('Image updated successfully!', 'success');
        }
    }

    deleteImage(id) {
        if (confirm('Are you sure you want to delete this image?')) {
            this.data.images = this.data.images.filter(image => image.id !== id);
            this.saveData();
            this.displayImages();
            this.showMessage('Image deleted successfully!', 'success');
        }
    }

    editImage(id) {
        const image = this.data.images.find(i => i.id === id);
        if (image) {
            this.currentEditingItem = image;
            this.currentEditingType = 'image';
            this.populateImageForm(image);
            document.getElementById('saveImageBtn').innerHTML = '<i class="fas fa-save"></i> Update Image';
            document.querySelector('button[onclick="showTab(\'images\')"]').click();
        }
    }

    populateImageForm(image) {
        document.getElementById('imageTitle').value = image.title || '';
        document.getElementById('imageSrc').value = image.src || '';
        document.getElementById('imageCategory').value = image.category || 'anime';
        document.getElementById('imageAlt').value = image.alt || '';
        document.getElementById('imageDescription').value = image.description || '';
        this.handleImagePreview(); // Show preview
    }

    clearImageForm() {
        document.getElementById('imageForm').reset();
        this.currentEditingItem = null;
        this.currentEditingType = null;
        document.getElementById('saveImageBtn').innerHTML = '<i class="fas fa-save"></i> Add Image';
        document.getElementById('imagePreview').style.display = 'none';
    }

    handleImagePreview() {
        const src = document.getElementById('imageSrc').value;
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        
        if (src && this.isValidUrl(src)) {
            previewImg.src = src;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
    }

    displayImages() {
        const images = this.getImages();
        const container = document.getElementById('imagesList');
        if (!container) return;

        container.innerHTML = images.map(image => `
            <div class="item-card">
                <div class="item-header">
                    <div class="item-title">${this.escapeHtml(image.title)}</div>
                    <div class="item-actions">
                        <button class="btn btn-secondary" onclick="dataManager.editImage('${image.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger" onclick="dataManager.deleteImage('${image.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                <div class="item-meta">
                    <strong>Category:</strong> ${this.escapeHtml(image.category || 'N/A')}
                </div>
                ${image.src ? `<img src="${image.src}" alt="${image.alt || image.title}" style="max-width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; margin: 10px 0;">` : ''}
                ${image.description ? `<div class="item-description">${this.escapeHtml(image.description)}</div>` : ''}
            </div>
        `).join('');
    }

    getImages(category = null) {
        return category ? 
            this.data.images.filter(image => image.category === category) : 
            this.data.images;
    }

    // Audio Management
    handleAudioSubmit(e) {
        e.preventDefault();
        const formData = this.getFormData('audio');
        
        if (this.currentEditingItem && this.currentEditingType === 'audio') {
            this.updateAudio(this.currentEditingItem.id, formData);
        } else {
            this.addAudio(formData);
        }
        
        this.clearAudioForm();
        this.displayAudio();
    }

    addAudio(audio) {
        audio.id = Date.now().toString();
        audio.created = new Date().toISOString();
        this.data.audio.push(audio);
        this.saveData();
    }

    updateAudio(id, updatedAudio) {
        const index = this.data.audio.findIndex(audio => audio.id === id);
        if (index !== -1) {
            updatedAudio.id = id;
            updatedAudio.modified = new Date().toISOString();
            this.data.audio[index] = { ...this.data.audio[index], ...updatedAudio };
            this.saveData();
            this.currentEditingItem = null;
            this.currentEditingType = null;
            this.showMessage('Audio updated successfully!', 'success');
        }
    }

    deleteAudio(id) {
        if (confirm('Are you sure you want to delete this audio?')) {
            this.data.audio = this.data.audio.filter(audio => audio.id !== id);
            this.saveData();
            this.displayAudio();
            this.showMessage('Audio deleted successfully!', 'success');
        }
    }

    editAudio(id) {
        const audio = this.data.audio.find(a => a.id === id);
        if (audio) {
            this.currentEditingItem = audio;
            this.currentEditingType = 'audio';
            this.populateAudioForm(audio);
            document.getElementById('saveAudioBtn').innerHTML = '<i class="fas fa-save"></i> Update Audio';
            document.querySelector('button[onclick="showTab(\'audio\')"]').click();
        }
    }

    populateAudioForm(audio) {
        document.getElementById('audioTitle').value = audio.title || '';
        document.getElementById('audioSrc').value = audio.src || '';
        document.getElementById('audioArtist').value = audio.artist || '';
        document.getElementById('audioDuration').value = audio.duration || '';
        document.getElementById('audioType').value = audio.type || 'audio/mp3';
        document.getElementById('audioCategory').value = audio.category || 'Nature';
        document.getElementById('audioDescription').value = audio.description || '';
        document.getElementById('audioVisualizer').checked = audio.visualizer || false;
    }

    clearAudioForm() {
        document.getElementById('audioForm').reset();
        this.currentEditingItem = null;
        this.currentEditingType = null;
        document.getElementById('saveAudioBtn').innerHTML = '<i class="fas fa-save"></i> Add Audio';
    }

    displayAudio() {
        const audioList = this.getAudio();
        const container = document.getElementById('audioList');
        if (!container) return;

        container.innerHTML = audioList.map(audio => `
            <div class="item-card">
                <div class="item-header">
                    <div class="item-title">${this.escapeHtml(audio.title)}</div>
                    <div class="item-actions">
                        <button class="btn btn-secondary" onclick="dataManager.editAudio('${audio.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger" onclick="dataManager.deleteAudio('${audio.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                <div class="item-meta">
                    <strong>Artist:</strong> ${this.escapeHtml(audio.artist || 'Unknown')} | 
                    <strong>Duration:</strong> ${this.escapeHtml(audio.duration || 'N/A')} | 
                    <strong>Category:</strong> ${this.escapeHtml(audio.category || 'N/A')}
                </div>
                ${audio.src ? `
                    <audio controls style="width: 100%; margin: 10px 0;">
                        <source src="${audio.src}" type="${audio.type || 'audio/mp3'}">
                        Your browser does not support the audio element.
                    </audio>
                ` : ''}
                ${audio.description ? `<div class="item-description">${this.escapeHtml(audio.description)}</div>` : ''}
            </div>
        `).join('');
    }

    getAudio(category = null) {
        return category ? 
            this.data.audio.filter(audio => audio.category === category) : 
            this.data.audio;
    }

    // Content Management
    handleContentSubmit(e) {
        e.preventDefault();
        const formData = this.getFormData('content');
        
        if (this.currentEditingItem && this.currentEditingType === 'content') {
            this.updateContent(this.currentEditingItem.id, formData);
        } else {
            this.addContent(formData);
        }
        
        this.clearContentForm();
        this.displayContent();
    }

    addContent(content) {
        content.id = Date.now();
        content.created = new Date().toISOString();
        content.modified = new Date().toISOString();
        this.data.content.push(content);
        this.saveData();
    }

    updateContent(id, updatedContent) {
        const index = this.data.content.findIndex(content => content.id === id);
        if (index !== -1) {
            updatedContent.id = id;
            updatedContent.modified = new Date().toISOString();
            this.data.content[index] = { ...this.data.content[index], ...updatedContent };
            this.saveData();
            this.currentEditingItem = null;
            this.currentEditingType = null;
            this.showMessage('Content updated successfully!', 'success');
        }
    }

    deleteContent(id) {
        if (confirm('Are you sure you want to delete this content?')) {
            this.data.content = this.data.content.filter(content => content.id !== id);
            this.saveData();
            this.displayContent();
            this.showMessage('Content deleted successfully!', 'success');
        }
    }

    editContent(id) {
        const content = this.data.content.find(c => c.id === id);
        if (content) {
            this.currentEditingItem = content;
            this.currentEditingType = 'content';
            this.populateContentForm(content);
            document.getElementById('saveContentBtn').innerHTML = '<i class="fas fa-save"></i> Update Content';
            document.querySelector('button[onclick="showTab(\'content\')"]').click();
        }
    }

    populateContentForm(content) {
        document.getElementById('contentTitle').value = content.title || '';
        document.getElementById('contentType').value = content.type || 'page';
        document.getElementById('contentStatus').value = content.status || 'draft';
        document.getElementById('contentExcerpt').value = content.excerpt || '';
        document.getElementById('contentBody').value = content.body || '';
        document.getElementById('contentTags').value = content.tags ? content.tags.join(', ') : '';
    }

    clearContentForm() {
        document.getElementById('contentForm').reset();
        this.currentEditingItem = null;
        this.currentEditingType = null;
        document.getElementById('saveContentBtn').innerHTML = '<i class="fas fa-save"></i> Add Content';
    }

    displayContent() {
        const content = this.getContent();
        const container = document.getElementById('contentList');
        if (!container) return;

        container.innerHTML = content.map(item => `
            <div class="item-card">
                <div class="item-header">
                    <div class="item-title">${this.escapeHtml(item.title)}</div>
                    <div class="item-actions">
                        <button class="btn btn-secondary" onclick="dataManager.editContent(${item.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-warning" onclick="dataManager.previewContent(${item.id})">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                        <button class="btn btn-danger" onclick="dataManager.deleteContent(${item.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                <div class="item-meta">
                    <strong>Type:</strong> ${this.escapeHtml(item.type || 'N/A')} | 
                    <strong>Status:</strong> <span class="${item.status === 'published' ? 'text-success' : 'text-warning'}">${this.escapeHtml(item.status || 'N/A')}</span> |
                    <strong>Created:</strong> ${item.created ? new Date(item.created).toLocaleDateString() : 'N/A'}
                </div>
                ${item.tags && item.tags.length ? `<div class="item-meta"><strong>Tags:</strong> ${item.tags.join(', ')}</div>` : ''}
                ${item.excerpt ? `<div class="item-description">${this.escapeHtml(item.excerpt)}</div>` : ''}
            </div>
        `).join('');
    }

    getContent(status = null) {
        return status ? 
            this.data.content.filter(content => content.status === status) : 
            this.data.content;
    }

    previewContent(id) {
        const content = this.data.content.find(c => c.id === id);
        if (content) {
            const modal = document.getElementById('contentPreviewModal');
            const modalBody = document.getElementById('contentPreviewBody');
            
            modalBody.innerHTML = `
                <h2>${this.escapeHtml(content.title)}</h2>
                <div class="meta-info" style="color: #666; margin-bottom: 20px; font-size: 14px;">
                    <strong>Type:</strong> ${content.type} | 
                    <strong>Status:</strong> ${content.status} | 
                    <strong>Created:</strong> ${new Date(content.created).toLocaleDateString()}
                    ${content.tags && content.tags.length ? `<br><strong>Tags:</strong> ${content.tags.join(', ')}` : ''}
                </div>
                ${content.excerpt ? `<div class="excerpt" style="font-style: italic; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid #007bff; border-radius: 4px;">${this.escapeHtml(content.excerpt)}</div>` : ''}
                <div class="content-body" style="line-height: 1.6;">${this.formatContent(content.body || '')}</div>
            `;
            
            modal.style.display = 'block';
        }
    }

    formatContent(content) {
        // Simple content formatting - you can enhance this
        return content
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>');
    }

    // Collections Management
    handleCollectionSubmit(e) {
        e.preventDefault();
        const key = document.getElementById('collectionKey').value.toLowerCase();
        const title = document.getElementById('collectionTitle').value;
        const description = document.getElementById('collectionDesc').value;
        
        if (!this.data.collections[key]) {
            this.data.collections[key] = {
                title: title,
                description: description,
                items: []
            };
            this.saveData();
            this.clearCollectionForm();
            this.viewCollections();
            this.showMessage('Collection created successfully!', 'success');
        } else {
            this.showMessage('Collection already exists!', 'error');
        }
    }

    clearCollectionForm() {
        document.getElementById('collectionForm').reset();
        document.getElementById('addCollectionForm').style.display = 'none';
    }

    viewCollections() {
        const collections = this.data.collections;
        const container = document.getElementById('collectionsList');
        if (!container) return;

        container.innerHTML = Object.keys(collections).map(key => `
            <div class="item-card">
                <div class="item-header">
                    <div class="item-title">${this.escapeHtml(collections[key].title)}</div>
                    <div class="item-actions">
                        <button class="btn btn-secondary" onclick="dataManager.editCollection('${key}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger" onclick="dataManager.deleteCollection('${key}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                <div class="item-meta">
                    <strong>Items:</strong> ${collections[key].items ? collections[key].items.length : 0} | 
                    <strong>Key:</strong> ${key}
                </div>
                ${collections[key].description ? `<div class="item-description">${this.escapeHtml(collections[key].description)}</div>` : ''}
            </div>
        `).join('');
    }

    editCollection(key) {
        const collection = this.data.collections[key];
        if (collection) {
            // You can implement collection editing here
            this.showMessage('Collection editing feature coming soon!', 'info');
        }
    }

    deleteCollection(key) {
        if (confirm('Are you sure you want to delete this collection?')) {
            delete this.data.collections[key];
            this.saveData();
            this.viewCollections();
            this.showMessage('Collection deleted successfully!', 'success');
        }
    }

    // Search functionality
    searchBooks() {
        const query = document.getElementById('booksSearch').value.toLowerCase();
        this.filterAndDisplay('books', (book) => 
            book.title.toLowerCase().includes(query) || 
            book.author.toLowerCase().includes(query) ||
            book.description.toLowerCase().includes(query)
        );
    }

    searchImages() {
        const query = document.getElementById('imagesSearch').value.toLowerCase();
        this.filterAndDisplay('images', (image) => 
            image.title.toLowerCase().includes(query) || 
            image.description.toLowerCase().includes(query) ||
            image.category.toLowerCase().includes(query)
        );
    }

    searchAudio() {
        const query = document.getElementById('audioSearch').value.toLowerCase();
        this.filterAndDisplay('audio', (audio) => 
            audio.title.toLowerCase().includes(query) || 
            audio.artist.toLowerCase().includes(query) ||
            audio.description.toLowerCase().includes(query)
        );
    }

    searchContent() {
        const query = document.getElementById('contentSearch').value.toLowerCase();
        this.filterAndDisplay('content', (content) => 
            content.title.toLowerCase().includes(query) || 
            content.body.toLowerCase().includes(query) ||
            content.excerpt.toLowerCase().includes(query) ||
            (content.tags && content.tags.some(tag => tag.toLowerCase().includes(query)))
        );
    }

    filterImages() {
        const category = document.getElementById('imageFilter').value;
        if (category === 'all') {
            this.displayImages();
        } else {
            this.filterAndDisplay('images', (image) => image.category === category);
        }
    }

    filterContent() {
        const status = document.getElementById('contentFilter').value;
        if (status === 'all') {
            this.displayContent();
        } else {
            this.filterAndDisplay('content', (content) => content.status === status);
        }
    }

    filterAndDisplay(type, filterFn) {
        const originalData = this.data[type];
        const filteredData = originalData.filter(filterFn);
        
        // Temporarily replace data for display
        this.data[type] = filteredData;
        
        switch(type) {
            case 'books': this.displayBooks(); break;
            case 'images': this.displayImages(); break;
            case 'audio': this.displayAudio(); break;
            case 'content': this.displayContent(); break;
        }
        
        // Restore original data
        this.data[type] = originalData;
    }

    // Utility functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        
        let icon = 'fas fa-info-circle';
        if (type === 'success') icon = 'fas fa-check-circle';
        if (type === 'error') icon = 'fas fa-exclamation-circle';
        if (type === 'warning') icon = 'fas fa-exclamation-triangle';
        
        messageDiv.innerHTML = `<i class="${icon}"></i> ${message}`;
        
        const container = document.querySelector('.container');
        container.insertBefore(messageDiv, container.children[1]);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Data management
    getAllData() {
        return this.data;
    }

    exportData(type = 'all') {
        let exportData;
        let filename;

        switch(type) {
            case 'books':
                exportData = { books: this.data.books };
                filename = 'books-data.json';
                break;
            case 'images':
                exportData = { images: this.data.images };
                filename = 'images-data.json';
                break;
            case 'audio':
                exportData = { audio: this.data.audio };
                filename = 'audio-data.json';
                break;
            default:
                exportData = this.data;
                filename = 'unified-data.json';
        }

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', filename);
        linkElement.click();
        
        this.showMessage(`${type === 'all' ? 'All data' : type} exported successfully!`, 'success');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        
                        if (importedData.books) this.data.books = [...this.data.books, ...importedData.books];
                        if (importedData.images) this.data.images = [...this.data.images, ...importedData.images];
                        if (importedData.audio) this.data.audio = [...this.data.audio, ...importedData.audio];
                        if (importedData.content) this.data.content = [...this.data.content, ...importedData.content];
                        if (importedData.collections) {
                            Object.assign(this.data.collections, importedData.collections);
                        }
                        
                        this.saveData();
                        this.loadInitialData();
                        this.showMessage('Data imported successfully!', 'success');
                    } catch (error) {
                        this.showMessage('Error reading file! Please check the JSON format.', 'error');
                        console.error('Import error:', error);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone!')) {
            this.data = {
                books: [],
                images: [],
                audio: [],
                collections: {
                    featured: { title: "Featured Collections", items: [] },
                    popular: { title: "Popular Right Now", items: [] }
                },
                content: [],
                siteConfig: {
                    siteName: "Vrindopnishad",
                    tagline: "Spiritual & Divine Collection"
                }
            };
            this.saveData();
            this.loadInitialData();
            this.showMessage('All data cleared successfully!', 'success');
        }
    }

    updatePreview() {
        const previewElement = document.getElementById('dataPreview');
        if (previewElement) {
            previewElement.textContent = JSON.stringify(this.data, null, 2);
        }
    }

    updateStats() {
        const elements = {
            totalBooks: this.data.books.length,
            totalImages: this.data.images.length,
            totalAudio: this.data.audio.length,
            totalContent: this.data.content.length
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id];
            }
        });
    }

    loadInitialData() {
        this.displayBooks();
        this.displayImages();
        this.displayAudio();
        this.displayContent();
        this.viewCollections();
    }
}

// Tab functionality
function showTab(tabName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected section
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    // Load data for the tab
    switch(tabName) {
        case 'books':
            dataManager.displayBooks();
            break;
        case 'images':
            dataManager.displayImages();
            break;
        case 'audio':
            dataManager.displayAudio();
            break;
        case 'content':
            dataManager.displayContent();
            break;
        case 'collections':
            dataManager.viewCollections();
            break;
        case 'api':
            dataManager.updatePreview();
            break;
    }
}

// Collection functions
function showAddCollectionForm() {
    document.getElementById('addCollectionForm').style.display = 'block';
}

function hideAddCollectionForm() {
    document.getElementById('addCollectionForm').style.display = 'none';
    dataManager.clearCollectionForm();
}

// Content preview functions
function previewContent() {
    const title = document.getElementById('contentTitle').value;
    const type = document.getElementById('contentType').value;
    const status = document.getElementById('contentStatus').value;
    const excerpt = document.getElementById('contentExcerpt').value;
    const body = document.getElementById('contentBody').value;
    const tags = document.getElementById('contentTags').value;

    const modal = document.getElementById('contentPreviewModal');
    const modalBody = document.getElementById('contentPreviewBody');
    
    modalBody.innerHTML = `
        <h2>${title || 'Untitled'}</h2>
        <div class="meta-info" style="color: #666; margin-bottom: 20px; font-size: 14px;">
            <strong>Type:</strong> ${type} | <strong>Status:</strong> ${status}
            ${tags ? `<br><strong>Tags:</strong> ${tags}` : ''}
        </div>
        ${excerpt ? `<div class="excerpt" style="font-style: italic; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid #007bff; border-radius: 4px;">${excerpt}</div>` : ''}
        <div class="content-body" style="line-height: 1.6;">${body ? dataManager.formatContent(body) : '<p><em>No content yet...</em></p>'}</div>
    `;
    
    modal.style.display = 'block';
}

function closeContentPreview() {
    document.getElementById('contentPreviewModal').style.display = 'none';
}

// Clear form functions
function clearBookForm() {
    dataManager.clearBookForm();
}

function clearImageForm() {
    dataManager.clearImageForm();
}

function clearAudioForm() {
    dataManager.clearAudioForm();
}

function clearContentForm() {
    dataManager.clearContentForm();
}

// Export functions
function exportAllData() {
    dataManager.exportData('all');
}

function exportBooks() {
    dataManager.exportData('books');
}

function exportImages() {
    dataManager.exportData('images');
}

function exportAudio() {
    dataManager.exportData('audio');
}

function importData() {
    dataManager.importData();
}

function clearAllData() {
    dataManager.clearAllData();
}

// Modal functions
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Collections functions
function viewCollections() {
    dataManager.viewCollections();
}

// Initialize the manager when DOM is loaded
let dataManager;

document.addEventListener('DOMContentLoaded', function() {
    dataManager = new UnifiedDataManager();
    
    // Make dataManager globally accessible
    window.dataManager = dataManager;
    
    // Close modals when clicking outside
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    };
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // ESC to close modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        }
        
        // Ctrl+S to save (prevent browser save dialog)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            dataManager.saveData();
        }
        
        // Ctrl+E to export all data
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            dataManager.exportData('all');
        }
    });
});

// Enhanced search functions with debouncing
let searchTimeouts = {};

function debounceSearch(searchFunction, delay = 300) {
    return function(...args) {
        const key = searchFunction.name;
        clearTimeout(searchTimeouts[key]);
        searchTimeouts[key] = setTimeout(() => {
            searchFunction.apply(this, args);
        }, delay);
    };
}

// Apply debouncing to search functions
const debouncedSearchBooks = debounceSearch(function() {
    dataManager.searchBooks();
});

const debouncedSearchImages = debounceSearch(function() {
    dataManager.searchImages();
});

const debouncedSearchAudio = debounceSearch(function() {
    dataManager.searchAudio();
});

const debouncedSearchContent = debounceSearch(function() {
    dataManager.searchContent();
});

// Global search functions that are called from HTML
function searchBooks() {
    debouncedSearchBooks();
}

function searchImages() {
    debouncedSearchImages();
}

function searchAudio() {
    debouncedSearchAudio();
}

function searchContent() {
    debouncedSearchContent();
}

function filterImages() {
    dataManager.filterImages();
}

function filterContent() {
    dataManager.filterContent();
}

// Utility functions for external use
window.UnifiedAPI = {
    // Get data functions
    getAllData: () => dataManager.getAllData(),
    getBooks: (category) => dataManager.getBooks(category),
    getImages: (category) => dataManager.getImages(category),
    getAudio: (category) => dataManager.getAudio(category),
    getContent: (status) => dataManager.getContent(status),
    getCollections: () => dataManager.data.collections,
    
    // Add data functions
    addBook: (book) => dataManager.addBook(book),
    addImage: (image) => dataManager.addImage(image),
    addAudio: (audio) => dataManager.addAudio(audio),
    addContent: (content) => dataManager.addContent(content),
    
    // Search function
    search: (query) => {
        const results = {
            books: dataManager.data.books.filter(book => 
                book.title.toLowerCase().includes(query.toLowerCase()) ||
                book.author.toLowerCase().includes(query.toLowerCase()) ||
                book.description.toLowerCase().includes(query.toLowerCase())
            ),
            images: dataManager.data.images.filter(image => 
                image.title.toLowerCase().includes(query.toLowerCase()) ||
                image.description.toLowerCase().includes(query.toLowerCase())
            ),
            audio: dataManager.data.audio.filter(audio => 
                audio.title.toLowerCase().includes(query.toLowerCase()) ||
                audio.artist.toLowerCase().includes(query.toLowerCase()) ||
                audio.description.toLowerCase().includes(query.toLowerCase())
            ),
            content: dataManager.data.content.filter(content => 
                content.title.toLowerCase().includes(query.toLowerCase()) ||
                content.body.toLowerCase().includes(query.toLowerCase()) ||
                content.excerpt.toLowerCase().includes(query.toLowerCase())
            )
        };
        return results;
    },
    
    // Legacy format compatibility
    getBooksData: () => ({ books: dataManager.data.books }),
    getImagesData: () => ({ 
        images: dataManager.data.images,
        categories: [...new Set(dataManager.data.images.map(img => img.category))]
    }),
    getAudioData: () => ({ audio: dataManager.data.audio }),
    getContentData: () => ({ content: dataManager.data.content })
};