// Unified Data Manager
class UnifiedDataManager {
    constructor() {
        this.data = this.loadData();
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
    }

    // Books methods
    addBook(book) {
        book.id = Date.now();
        book.readingProgress = 0;
        this.data.books.push(book);
        this.saveData();
    }

    getBooks(category = null) {
        return category ? 
            this.data.books.filter(book => book.category === category) : 
            this.data.books;
    }

    deleteBook(id) {
        this.data.books = this.data.books.filter(book => book.id !== id);
        this.saveData();
    }

    // Images methods
    addImage(image) {
        image.id = Date.now().toString();
        this.data.images.push(image);
        this.saveData();
    }

    getImages(category = null) {
        return category ? 
            this.data.images.filter(image => image.category === category) : 
            this.data.images;
    }

    deleteImage(id) {
        this.data.images = this.data.images.filter(image => image.id !== id);
        this.saveData();
    }

    // Audio methods
    addAudio(audio) {
        audio.id = Date.now().toString();
        this.data.audio.push(audio);
        this.saveData();
    }

    getAudio(category = null) {
        return category ? 
            this.data.audio.filter(audio => audio.category === category) : 
            this.data.audio;
    }

    deleteAudio(id) {
        this.data.audio = this.data.audio.filter(audio => audio.id !== id);
        this.saveData();
    }

    // Content methods
    addContent(content) {
        content.id = Date.now();
        content.created = new Date().toISOString();
        content.modified = new Date().toISOString();
        this.data.content.push(content);
        this.saveData();
    }

    getContent(status = null) {
        return status ? 
            this.data.content.filter(content => content.status === status) : 
            this.data.content;
    }

    deleteContent(id) {
        this.data.content = this.data.content.filter(content => content.id !== id);
        this.saveData();
    }

    // General methods
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
    }

    importData(importedData) {
        if (importedData.books) this.data.books = [...this.data.books, ...importedData.books];
        if (importedData.images) this.data.images = [...this.data.images, ...importedData.images];
        if (importedData.audio) this.data.audio = [...this.data.audio, ...importedData.audio];
        if (importedData.content) this.data.content = [...this.data.content, ...importedData.content];
        this.saveData();
    }

    clearData() {
        this.data = {
            books: [],
            images: [],
            audio: [],
            collections: { featured: { items: [] }, popular: { items: [] } },
            content: []
        };
        this.saveData();
    }

    updatePreview() {
        document.getElementById('dataPreview').textContent = JSON.stringify(this.data, null, 2);
    }

    updateStats() {
        document.getElementById('totalBooks').textContent = this.data.books.length;
        document.getElementById('totalImages').textContent = this.data.images.length;
        document.getElementById('totalAudio').textContent = this.data.audio.length;
        document.getElementById('totalContent').textContent = this.data.content.length;
    }
}

// Initialize the manager
const dataManager = new UnifiedDataManager();

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
            displayBooks();
            break;
        case 'images':
            displayImages();
            break;
        case 'audio':
            displayAudio();
            break;
        case 'content':
            displayContent();
            break;
        case 'api':
            dataManager.updatePreview();
            break;
    }
}

// Books functionality
document.getElementById('bookForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const book = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        year: document.getElementById('bookYear').value,
        category: document.getElementById('bookCategory').value,
        language: document.getElementById('bookLanguage').value,
        cover: document.getElementById('bookCover').value,
        description: document.getElementById('bookDescription').value,
        format: ["pdf", "epub"]
    };
    dataManager.addBook(book);
    this.reset();
    displayBooks();
});

function displayBooks() {
    const books = dataManager.getBooks();
    const container = document.getElementById('booksList');
    container.innerHTML = books.map(book => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">${book.title}</div>
                <div class="item-actions">
                    <button class="btn btn-danger" onclick="deleteBook(${book.id})">Delete</button>
                </div>
            </div>
            <p><strong>Author:</strong> ${book.author} | <strong>Year:</strong> ${book.year}</p>
            <p><strong>Category:</strong> ${book.category} | <strong>Language:</strong> ${book.language}</p>
            <p>${book.description}</p>
        </div>
    `).join('');
}

function deleteBook(id) {
    if (confirm('Delete this book?')) {
        dataManager.deleteBook(id);
        displayBooks();
    }
}

// Images functionality
document.getElementById('imageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const image = {
        title: document.getElementById('imageTitle').value,
        src: document.getElementById('imageSrc').value,
        category: document.getElementById('imageCategory').value,
        alt: document.getElementById('imageAlt').value,
        description: document.getElementById('imageDescription').value
    };
    dataManager.addImage(image);
    this.reset();
    displayImages();
});

function displayImages() {
    const images = dataManager.getImages();
    const container = document.getElementById('imagesList');
    container.innerHTML = images.map(image => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">${image.title}</div>
                <div class="item-actions">
                    <button class="btn btn-danger" onclick="deleteImage('${image.id}')">Delete</button>
                </div>
            </div>
            <p><strong>Category:</strong> ${image.category}</p>
            <p>${image.description}</p>
            <img src="${image.src}" alt="${image.alt}" style="max-width: 100px; height: auto; border-radius: 4px;">
        </div>
    `).join('');
}

function deleteImage(id) {
    if (confirm('Delete this image?')) {
        dataManager.deleteImage(id);
        displayImages();
    }
}

// Audio functionality
document.getElementById('audioForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const audio = {
        title: document.getElementById('audioTitle').value,
        audioSrc: document.getElementById('audioSrc').value,
        artist: document.getElementById('audioArtist').value,
        duration: document.getElementById('audioDuration').value,
        category: document.getElementById('audioCategory').value,
        description: document.getElementById('audioDescription').value
    };
    dataManager.addAudio(audio);
    this.reset();
    displayAudio();
});

function displayAudio() {
    const audioList = dataManager.getAudio();
    const container = document.getElementById('audioList');
    container.innerHTML = audioList.map(audio => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">${audio.title}</div>
                <div class="item-actions">
                    <button class="btn btn-danger" onclick="deleteAudio('${audio.id}')">Delete</button>
                </div>
            </div>
            <p><strong>Artist:</strong> ${audio.artist} | <strong>Duration:</strong> ${audio.duration}</p>
            <p><strong>Category:</strong> ${audio.category}</p>
            <p>${audio.description}</p>
        </div>
    `).join('');
}

function deleteAudio(id) {
    if (confirm('Delete this audio?')) {
        dataManager.deleteAudio(id);
        displayAudio();
    }
}

// Content functionality
document.getElementById('contentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const content = {
        title: document.getElementById('contentTitle').value,
        type: document.getElementById('contentType').value,
        status: document.getElementById('contentStatus').value,
        excerpt: document.getElementById('contentExcerpt').value,
        content: document.getElementById('contentBody').value,
        tags: document.getElementById('contentTags').value.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    dataManager.addContent(content);
    this.reset();
    displayContent();
});

function displayContent() {
    const content = dataManager.getContent();
    const container = document.getElementById('contentList');
    container.innerHTML = content.map(item => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">${item.title}</div>
                <div class="item-actions">
                    <button class="btn btn-danger" onclick="deleteContent(${item.id})">Delete</button>
                </div>
            </div>
            <p><strong>Type:</strong> ${item.type} | <strong>Status:</strong> ${item.status}</p>
            <p><strong>Tags:</strong> ${item.tags.join(', ')}</p>
            <p>${item.excerpt}</p>
        </div>
    `).join('');
}

function deleteContent(id) {
    if (confirm('Delete this content?')) {
        dataManager.deleteContent(id);
        displayContent();
    }
}

// Collections functionality
function addCollection() {
    const name = prompt('Collection name:');
    if (name) {
        if (!dataManager.data.collections[name.toLowerCase()]) {
            dataManager.data.collections[name.toLowerCase()] = {
                title: name,
                items: []
            };
            dataManager.saveData();
            alert('Collection added successfully!');
        } else {
            alert('Collection already exists!');
        }
    }
}

function viewCollections() {
    const collections = dataManager.data.collections;
    const container = document.getElementById('collectionsContent');
    container.innerHTML = Object.keys(collections).map(key => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">${collections[key].title}</div>
                <div class="item-actions">
                    <button class="btn btn-danger" onclick="deleteCollection('${key}')">Delete</button>
                </div>
            </div>
            <p>Items: ${collections[key].items ? collections[key].items.length : 0}</p>
        </div>
    `).join('');
}

function deleteCollection(key) {
    if (confirm('Delete this collection?')) {
        delete dataManager.data.collections[key];
        dataManager.saveData();
        viewCollections();
    }
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
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    dataManager.importData(importedData);
                    alert('Data imported successfully!');
                    dataManager.updatePreview();
                } catch (error) {
                    alert('Error reading file!');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone!')) {
        dataManager.clearData();
        displayBooks();
        displayImages();
        displayAudio();
        displayContent();
        alert('All data cleared!');
    }
}

// Make the data manager globally accessible for web pages
window.UnifiedDataManager = dataManager;

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    dataManager.updateStats();
    dataManager.updatePreview();
    displayBooks();
});

// Auto-save every 30 seconds
setInterval(() => {
    dataManager.saveData();
}, 30000);