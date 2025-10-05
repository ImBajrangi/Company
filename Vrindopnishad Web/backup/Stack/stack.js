// Use ApiService from global window object
// Old import: import ApiService from './api-service.js';

// Initialize custom cursor
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    
    // Smoother animation with requestAnimationFrame
    function animate() {
        // Smooth movement for cursor
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        
        // Smoother movement for follower
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
        
        requestAnimationFrame(animate);
    }
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Handle cursor hover states
    const hoverElements = document.querySelectorAll('a, button, .btn, .magnetic, .book-card');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1.5)`;
            follower.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1.5)`;
            cursor.style.background = 'rgba(255, 255, 255, 0.5)';
            follower.style.border = '1px solid rgba(255, 255, 255, 0.8)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1)`;
            follower.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1)`;
            cursor.style.background = 'rgba(255, 255, 255, 0.8)';
            follower.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        });
    });
    
    // Start animation loop
    animate();
    
    // Show cursors after initialization
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Handle cursor visibility when leaving/entering window
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });
}

// Book data (fallback if API fails)
let fallbackBooks = [];

// Function to load fallback books from JSON file
async function loadFallbackBooks() {
    try {
        const response = await fetch('./books-data.json');
        if (!response.ok) {
            throw new Error('Failed to load fallback books data');
        }
        const data = await response.json();
        fallbackBooks = data.books;
        console.log('Fallback books loaded from JSON file');
    } catch (error) {
        console.error('Error loading fallback books:', error);
        // If JSON loading fails, use the hardcoded fallback data
        fallbackBooks = [
            {
                id: 1,
                title: "Bhagavad Gita",
                description: "The divine song of spiritual wisdom that forms part of the Hindu epic Mahabharata. It contains a conversation between Prince Arjuna and Lord Krishna on life's philosophical and spiritual questions.",
                author: "Vyasa",
                year: "~400 BCE",
                category: "vedic",
                language: "sanskrit",
                format: ["pdf", "epub"],
                cover: "../image/books/bhagavad-gita.jpg",
                readingProgress: 0
            },
            {
                id: 2,
                title: "Upanishads",
                description: "Ancient Sanskrit texts that contain the philosophical and spiritual teachings of Hinduism. They explore concepts of Brahman, Atman, and the nature of reality.",
                author: "Various Sages",
                year: "~800-500 BCE",
                category: "vedic",
                language: "sanskrit",
                format: ["pdf"],
                cover: "../image/books/upanishads.jpg",
                readingProgress: 0
            },
            {
                id: 3,
                title: "Vedas",
                description: "The oldest sacred texts of Hinduism, composed in Vedic Sanskrit. They contain hymns, philosophical discussions, and instructions for rituals.",
                author: "Various Rishis",
                year: "~1500-500 BCE",
                category: "vedic",
                language: "sanskrit",
                format: ["pdf", "audio"],
                cover: "../image/books/vedas.jpg",
                readingProgress: 0
            },
            {
                id: 4,
                title: "Ramayana",
                description: "An ancient Indian epic that narrates the journey of Rama, a prince of Ayodhya, whose wife Sita is abducted by the demon king Ravana.",
                author: "Valmiki",
                year: "~500-100 BCE",
                category: "puranas",
                language: "sanskrit",
                format: ["pdf", "epub"],
                cover: "../image/books/ramayana.jpg",
                readingProgress: 0
            },
            {
                id: 5,
                title: "Mahabharata",
                description: "One of the two major Sanskrit epics of ancient India. It narrates the struggle between two groups of cousins in the Kurukshetra War and the fates of the Kaurava and the Pandava princes.",
                author: "Vyasa",
                year: "~400 BCE-400 CE",
                category: "puranas",
                language: "sanskrit",
                format: ["pdf", "epub", "audio"],
                cover: "../image/books/mahabharata.jpg",
                readingProgress: 0
            },
            {
                id: 6,
                title: "Srimad Bhagavatam",
                description: "One of the eighteen Puranas, a text from ancient India. It is the most complete and authoritative exposition of Vedantic philosophy, focusing on the devotion to Lord Krishna.",
                author: "Vyasa",
                year: "~800-1000 CE",
                category: "puranas",
                language: "sanskrit",
                format: ["pdf"],
                cover: "../image/books/bhagavata.jpg",
                readingProgress: 0
            },
            {
                id: 7,
                title: "Autobiography of a Yogi",
                description: "The autobiography of Paramahansa Yogananda that introduces the reader to his life and his encounters with spiritual figures of both the Eastern and the Western world.",
                author: "Paramahansa Yogananda",
                year: "1946",
                category: "modern",
                language: "english",
                format: ["pdf", "epub", "audio"],
                cover: "../image/books/autobiography.jpg",
                readingProgress: 0
            },
            {
                id: 8,
                title: "Living with the Himalayan Masters",
                description: "Swami Rama shares his experiences with the great teachers who guided his life, revealing the spiritual wisdom he received from them.",
                author: "Swami Rama",
                year: "1978",
                category: "modern",
                language: "english",
                format: ["pdf", "epub"],
                cover: "../image/books/living.jpg",
                readingProgress: 0
            },
            {
                id: 9,
                title: "The Gospel of Sri Ramakrishna",
                description: "A firsthand account of the life and teachings of Sri Ramakrishna, written by his disciple Mahendranath Gupta, who recorded his conversations with the master.",
                author: "Mahendranath Gupta",
                year: "1942",
                category: "modern",
                language: "english",
                format: ["pdf"],
                cover: "../image/books/gospel.jpg",
                readingProgress: 0
            }
        ];
    }
}

// State management
const state = {
    activeFilters: {
        categories: [],
        languages: [],
        formats: []
    },
    searchQuery: "",
    activeBook: null,
    readingProgress: {},
    books: [],
    isLoading: false,
    apiConnected: false
};

// DOM Elements
const bookGrid = document.querySelector('.book-grid');
const searchInput = document.querySelector('.search-input');
const searchOverlay = document.querySelector('.search-overlay');
const searchToggle = document.querySelector('#searchIcon');
const filterSidebar = document.querySelector('.filter-sidebar');
const filterToggle = document.querySelector('.filter-toggle');
const filterClose = document.querySelector('.filter-close');
const bookModal = document.querySelector('.book-modal');
const readingProgress = document.querySelector('.reading-progress');
const notificationContainer = document.querySelector('.notification-container');
const loadingOverlay = document.querySelector('.loading-overlay');
const searchBar = document.querySelector('.search-bar');

// Initialize the application
async function init() {
    // Show loading overlay
    showLoadingOverlay(true);
    
    // Initialize custom cursor
    initCustomCursor();
    
    // Load fallback books from JSON file
    await loadFallbackBooks();
    
    try {
        // Check API status
        const apiStatus = await ApiService.checkApiStatus();
        state.apiConnected = apiStatus.server === 'running';
        
        if (state.apiConnected) {
            showNotification('Connected to backend API', 'success');
            
            // Fetch books from API
            const response = await ApiService.getBooks();
            if (response.success && response.data) {
                state.books = response.data;
            } else {
                // Fallback to local data if API fails
                state.books = [...fallbackBooks];
                showNotification('Using local book data', 'info');
            }
        } else {
            // Fallback to local data if API is not connected
            state.books = [...fallbackBooks];
            showNotification('Backend API not available, using local data', 'warning');
        }
    } catch (error) {
        console.error('Error initializing app:', error);
        state.books = [...fallbackBooks];
        showNotification('Error connecting to backend, using local data', 'error');
    }
    
    // Normalize book data
    normalizeBookData();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize CSS animations (replaced GSAP)
    //initializeGSAP();
    
    // Initialize magnetic effect for buttons
    initializeMagneticEffect();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize footer particles
    initializeFooterParticles();
    
    // Initialize back to top button
    initializeBackToTop();
    
    // Check URL parameters
    checkUrlParameters();
    
    // Load reading progress
    loadReadingProgress();
    
    // Render books
    renderBooks(state.books);
    
    // Initialize book cards
    initializeBookCards();
    
    // Hide loading overlay
    showLoadingOverlay(false);
}

// Normalize book data structure to ensure consistency
function normalizeBookData() {
    state.books.forEach(book => {
        // Convert meta structure to direct properties if needed
        if (book.meta) {
            book.author = book.meta.author;
            book.year = book.meta.year;
            book.category = book.meta.category;
            book.language = book.meta.language;
            book.format = book.meta.formats;
            delete book.meta;
        }
        
        // Ensure readingProgress property exists
        if (book.progress !== undefined && book.readingProgress === undefined) {
            book.readingProgress = book.progress;
            delete book.progress;
        }
        
        // Ensure format is always an array
        if (!Array.isArray(book.format)) {
            book.format = [book.format].filter(Boolean);
        }
    });
}

// Event Listeners
function initializeEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        
        // Clear search when ESC key is pressed
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                renderSearchResults([]);
                toggleSearch();
            }
        });
    }
    
    // Also add event listener to search bar input
    const searchBarInput = document.querySelector('.search-bar input');
    if (searchBarInput) {
        searchBarInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Filter functionality
    const filterToggle = document.querySelector('.filter-toggle');
    const filterClose = document.querySelector('.filter-close');
    const filterBackBtn = document.querySelector('.filter-back-btn');
    
    filterToggle?.addEventListener('click', toggleFilter);
    filterClose?.addEventListener('click', toggleFilter);
    filterBackBtn?.addEventListener('click', toggleFilter);
    
    document.querySelectorAll('.filter-group input').forEach(input => {
        input.addEventListener('change', handleFilterChange);
    });

    // Apply and reset filters
    document.querySelector('.apply-filters')?.addEventListener('click', applyFilters);
    document.querySelector('.reset-filters')?.addEventListener('click', () => {
        document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        state.activeFilters = {
            categories: [],
            languages: [],
            formats: []
        };
        
        applyFilters();
    });
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
}

// Initialize navigation
function initializeNavigation() {
    const searchToggle = document.querySelector('#searchToggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchInput = document.querySelector('.search-input');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.navigation ul');
    const menuOverlay = document.querySelector('.menu-overlay');
    const navLinks = document.querySelectorAll('.navigation ul li a');
    const navItems = document.querySelectorAll('.navigation ul li');
    const menuCloseBtn = document.querySelector('.menu-close-btn');
    
    // Set animation delay for menu items
    navItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index);
    });
    
    // Toggle search overlay
    if (searchToggle) {
        searchToggle.addEventListener('click', () => {
            searchOverlay.classList.toggle('active');
            if (searchOverlay.classList.contains('active')) {
                setTimeout(() => searchInput.focus(), 100);
            }
        });
    }
    
    // Close search overlay when clicking outside
    document.addEventListener('click', (e) => {
        if (searchOverlay && searchOverlay.classList.contains('active') && 
            !e.target.closest('.search-container') && 
            !e.target.closest('#searchToggle')) {
            searchOverlay.classList.remove('active');
        }
    });
    
    // Toggle mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Prevent scrolling when menu is open
            if (document.body.classList.contains('menu-open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }

        });
    }
    
    // Close menu with close button
    if (menuCloseBtn) {
        menuCloseBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        });
    }
    
    // Close menu when clicking on overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        });
    }
    
    // Close menu when clicking on a link (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close menu on resize if window becomes larger than mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        }
    });
    
    // Add active class to current page link
    const currentPage = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'home.html') ||
            (currentPage === 'photo.html' && linkPage === '#')) {
            link.parentElement.classList.add('active');
        }
    });
    
    // Make logo and navigation items magnetic on desktop
    const magneticElements = document.querySelectorAll('.navigation .magnetic');
    magneticElements.forEach(el => {
        const strength = el.getAttribute('data-magnetic-strength') || 0.5;
        
        if (window.innerWidth > 768) {
            el.addEventListener('mousemove', (e) => {
                const position = el.getBoundingClientRect();
                const x = e.clientX - position.left - position.width / 2;
                const y = e.clientY - position.top - position.height / 2;
                
                el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0px, 0px)';
            });
        }
    });
    
    // Handle swipe to close menu on mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (navMenu) {
        navMenu.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        navMenu.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
    }
    
    function handleSwipe() {
        if (touchStartX - touchEndX > 70 && window.innerWidth <= 768) {
            // Swiped left
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        }
    }
}

// Initialize CSS animations (replaced GSAP)
function initializeGSAP() {
    // This function has been replaced with CSS animations and Intersection Observer
    // The animations are now handled by the initScrollAnimations function
    
    // Comment out any GSAP-related code
    /*
    // Add parallax effect for hero background using scroll event
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const translateY = scrollPosition * 0.3;
            heroBackground.style.transform = `translateY(${translateY}px)`;
        });
    }
    */
    
    // The rest of the animations are handled by the Intersection Observer in initScrollAnimations
    console.log('GSAP animations disabled - using CSS-based animations instead');
}

// Toggle search bar
function toggleSearchBar() {
    searchBar?.classList.toggle('active');
    if (searchBar?.classList.contains('active')) {
        searchBar.querySelector('input')?.focus();
    }
}

// Book rendering
function renderBooks(booksToRender) {
    if (!bookGrid) return;

    bookGrid.innerHTML = '';
    const categories = groupBooksByCategory(booksToRender);

    Object.entries(categories).forEach(([category, books]) => {
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';
        categorySection.innerHTML = `
            <h2 class="category-title reveal-element">${formatCategoryTitle(category)}</h2>
            <div class="books-container">
                ${books.map(book => createBookCard(book)).join('')}
            </div>
        `;
        bookGrid.appendChild(categorySection);
    });

    initializeBookCards();
}

function createBookCard(book) {
    return `
        <div class="book-card magnetic" data-magnetic-strength="0.1" data-book-id="${book.id}">
            <div class="book-cover">
                <img src="${book.cover}" alt="${book.title}" loading="lazy">
            </div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p>${truncateText(book.description, 100)}</p>
                <button class="btn view-book">Read More</button>
            </div>
            ${book.readingProgress ? `
                <div class="reading-indicator" style="width: ${book.readingProgress}%"></div>
            ` : ''}
        </div>
    `;
}

function initializeBookCards() {
    document.querySelectorAll('.book-card').forEach(card => {
        // Add click event for opening modal when clicking anywhere except buttons
        card.addEventListener('click', (e) => {
            if (!e.target.matches('.btn')) {
                const bookId = parseInt(card.dataset.bookId);
                openBookModal(bookId);
            }
        });

        // Add specific click event for the Read More button
        const readMoreBtn = card.querySelector('.view-book');
        if (readMoreBtn) {
            readMoreBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent the card click event
                const bookId = parseInt(card.dataset.bookId);
                openBookModal(bookId);
            });
        }

        // Add loading animation for images
        const img = card.querySelector('img');
        if (img) {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });

    // Initialize magnetic effect
    initializeMagneticEffect();
}

// Modal functionality
function openBookModal(bookId) {
    const book = state.books.find(b => b.id === bookId);
    if (!book || !bookModal) return;

    state.activeBook = book;
    
    const modalContent = bookModal.querySelector('.modal-content');
    modalContent.innerHTML = `
        <button class="modal-close magnetic" data-magnetic-strength="0.5">&times;</button>
        <div class="book-preview">
            <div class="book-3d">
                <div class="book-cover-3d">
                    <img src="${book.cover}" alt="${book.title}" loading="lazy">
                </div>
            </div>
            <div class="book-details">
                <h2 class="book-title">${book.title}</h2>
                <p class="book-description">${book.description}</p>
                <div class="book-meta">
                    <span class="book-author">By ${book.author}</span>
                    <span class="book-year">${book.year}</span>
                </div>
                <div class="book-formats">
                    <span>Available formats: ${book.format.map(f => f.toUpperCase()).join(', ')}</span>
                </div>
                <div class="book-actions">
                    <button class="btn magnetic read-btn" data-magnetic-strength="0.3">Read Now</button>
                    <button class="btn magnetic download-btn" data-magnetic-strength="0.3">Download PDF</button>
                    <button class="btn magnetic share-btn" data-magnetic-strength="0.3">Share</button>
                </div>
            </div>
        </div>
    `;

    bookModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Add event listener to close button
    const closeBtn = modalContent.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeBookModal);
    }

    // Close modal when clicking outside content
    bookModal.addEventListener('click', function(e) {
        if (e.target === bookModal) {
            closeBookModal();
        }
    });

    // Reinitialize magnetic effect for new buttons
    initializeMagneticEffect();
}

function closeBookModal() {
    if (!bookModal) return;
    
    bookModal.classList.remove('active');
    document.body.style.overflow = '';
    state.activeBook = null;
}

// Handle search input
function handleSearch(e) {
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length < 2) {
        renderSearchResults([]);
        return;
    }
    
    // Filter books based on search query
    const results = state.books.filter(book => 
        book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query) || 
        book.description.toLowerCase().includes(query) ||
        (book.category && book.category.toLowerCase().includes(query))
    );
    
    // Sort results by relevance (title match first)
    results.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        
        // Title starts with query (highest priority)
        if (aTitle.startsWith(query) && !bTitle.startsWith(query)) return -1;
        if (!aTitle.startsWith(query) && bTitle.startsWith(query)) return 1;
        
        // Title contains query (medium priority)
        if (aTitle.includes(query) && !bTitle.includes(query)) return -1;
        if (!aTitle.includes(query) && bTitle.includes(query)) return 1;
        
        // Default to alphabetical
        return aTitle.localeCompare(bTitle);
    });
    
    // Limit to 10 results for performance
    renderSearchResults(results.slice(0, 10));
    
    // Show search overlay if not already visible
    const searchOverlay = document.querySelector('.search-overlay');
    if (searchOverlay && !searchOverlay.classList.contains('active')) {
        searchOverlay.classList.add('active');
    }
}

// Render search results
function renderSearchResults(results) {
    const searchResults = document.querySelector('.search-results');
    if (!searchResults) return;
    
    // Clear previous results
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                <p>No books found. Try a different search term.</p>
            </div>
        `;
        return;
    }
    
    // Create result items
    results.forEach(book => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.dataset.bookId = book.id;
        
        resultItem.innerHTML = `
            <div class="search-result-cover">
                <img src="${book.cover || '../image/books/default-cover.jpg'}" alt="${book.title}" loading="lazy">
            </div>
            <div class="search-result-info">
                <div class="search-result-title">${book.title}</div>
                <div class="search-result-author">by ${book.author}</div>
                <div class="search-result-description">${truncateText(book.description, 100)}</div>
            </div>
        `;
        
        // Add click event to open book modal
        resultItem.addEventListener('click', () => {
            openBookModal(book.id);
            toggleSearch();
        });
        
        searchResults.appendChild(resultItem);
    });
}

function toggleSearch() {
    const searchOverlay = document.querySelector('.search-overlay');
    const searchInput = document.querySelector('.search-input');
    
    if (!searchOverlay) return;
    
    searchOverlay.classList.toggle('active');
    
    if (searchOverlay.classList.contains('active')) {
        setTimeout(() => searchInput.focus(), 100);
    }
}

// Filter functionality
function handleFilterChange() {
    const categories = Array.from(document.querySelectorAll('input[type="checkbox"][value^="categories-"]'))
        .filter(input => input.checked)
        .map(input => input.value.replace('categories-', ''));

    const languages = Array.from(document.querySelectorAll('input[type="checkbox"][value="sanskrit"], input[type="checkbox"][value="english"], input[type="checkbox"][value="hindi"]'))
        .filter(input => input.checked)
        .map(input => input.value);

    const formats = Array.from(document.querySelectorAll('input[type="checkbox"][value="pdf"], input[type="checkbox"][value="epub"], input[type="checkbox"][value="audio"]'))
        .filter(input => input.checked)
        .map(input => input.value);

    state.activeFilters = { categories, languages, formats };
    applyFilters();
}

function applyFilters() {
    const { categories, languages, formats } = state.activeFilters;
    
    const filteredBooks = state.books.filter(book => {
        const categoryMatch = categories.length === 0 || categories.includes(book.category);
        const languageMatch = languages.length === 0 || languages.includes(book.language);
        const formatMatch = formats.length === 0 || book.format.some(f => formats.includes(f));
        
        return categoryMatch && languageMatch && formatMatch;
    });

    renderBooks(filteredBooks);
    
    // Show notification about filter results
    if (filteredBooks.length === 0) {
        showNotification('No books match your filters', 'warning');
    } else if (filteredBooks.length < state.books.length) {
        showNotification(`Found ${filteredBooks.length} books matching your filters`, 'info');
    }
    
    // Close filter sidebar after applying filters on mobile
    if (window.innerWidth <= 768) {
        toggleFilter();
    }
}

// Toggle filter sidebar
function toggleFilter() {
    const filterSidebar = document.querySelector('.filter-sidebar');
    
    if (!filterSidebar) return;
    
    filterSidebar.classList.toggle('active');
    document.body.classList.toggle('filter-open');
    
    // Create filter overlay if it doesn't exist
    let filterOverlay = document.querySelector('.filter-overlay');
    if (!filterOverlay) {
        filterOverlay = document.createElement('div');
        filterOverlay.className = 'filter-overlay';
        document.body.appendChild(filterOverlay);
        
        // Close filter when overlay is clicked
        filterOverlay.addEventListener('click', function() {
            toggleFilter();
        });
    }
    
    // Create back button for mobile if it doesn't exist and sidebar is active
    if (filterSidebar.classList.contains('active') && window.innerWidth <= 768) {
        let backBtn = filterSidebar.querySelector('.filter-back-btn');
        if (!backBtn) {
            backBtn = document.createElement('button');
            backBtn.className = 'filter-back-btn';
            backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Books';
            backBtn.addEventListener('click', toggleFilter);
            filterSidebar.insertBefore(backBtn, filterSidebar.firstChild);
        }
    }
}

// Reading progress
function loadReadingProgress() {
    const savedProgress = localStorage.getItem('readingProgress');
    if (savedProgress) {
        state.readingProgress = JSON.parse(savedProgress);
        updateReadingProgress();
    }
}

function updateReadingProgress() {
    state.books.forEach(book => {
        book.readingProgress = state.readingProgress[book.id] || 0;
    });
    
    // Update reading progress UI
    updateReadingProgressUI();
}

function updateReadingProgressUI() {
    const progressItems = document.querySelector('.progress-items');
    if (!progressItems) return;
    
    const booksWithProgress = state.books.filter(book => state.readingProgress[book.id] > 0);
    
    if (booksWithProgress.length === 0) {
        progressItems.innerHTML = '<p>You haven\'t started reading any books yet.</p>';
        return;
    }
    
    progressItems.innerHTML = booksWithProgress
        .sort((a, b) => state.readingProgress[b.id] - state.readingProgress[a.id])
        .map(book => `
            <div class="progress-item" data-book-id="${book.id}">
                <div class="progress-book-info">
                    <h4>${book.title}</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${state.readingProgress[book.id]}%"></div>
                    </div>
                    <span>${state.readingProgress[book.id]}% complete</span>
                </div>
                <button class="btn continue-reading">Continue</button>
            </div>
        `).join('');
    
    // Add click events to continue reading buttons
    progressItems.querySelectorAll('.continue-reading').forEach(button => {
        button.addEventListener('click', () => {
            const bookId = parseInt(button.closest('.progress-item').dataset.bookId);
            const book = state.books.find(b => b.id === bookId);
            if (book) {
                openBookModal(bookId);
            }
        });
    });
    
    // Show reading progress panel if there are books with progress
    if (booksWithProgress.length > 0) {
        readingProgress?.classList.add('active');
    }
}

function saveReadingProgress(bookId, progress) {
    state.readingProgress[bookId] = progress;
    localStorage.setItem('readingProgress', JSON.stringify(state.readingProgress));
    updateReadingProgress();
}

// Book actions
function handleReadBook(e) {
    if (!state.activeBook) return;
    
    // Simulate starting to read
    showNotification('Opening book viewer...', 'info');
    closeBookModal();
    
    // Update reading progress
    const currentProgress = state.readingProgress[state.activeBook.id] || 0;
    const newProgress = currentProgress === 0 ? 5 : Math.min(100, currentProgress + Math.floor(Math.random() * 10) + 5);
    
    saveReadingProgress(state.activeBook.id, newProgress);
    showReadingProgress();
}

function handleDownload(e) {
    if (!state.activeBook) return;
    showNotification(`Downloading ${state.activeBook.title}...`, 'info');
    
    // Simulate download
    setTimeout(() => {
        showNotification(`${state.activeBook.title} downloaded successfully!`, 'success');
    }, 2000);
}

function handleShare(e) {
    if (!state.activeBook) return;
    
    // Create the share data
    const shareData = {
        title: state.activeBook.title,
        text: `Check out "${state.activeBook.title}" by ${state.activeBook.author}`,
        url: `${window.location.origin}${window.location.pathname}?book=${state.activeBook.id}`
    };

    // Try to use the Web Share API first
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => {
                showNotification('Successfully shared!', 'success');
            })
            .catch((error) => {
                console.log('Error sharing:', error);
                fallbackShare(shareData);
            });
    } else {
        fallbackShare(shareData);
    }
}

function fallbackShare(shareData) {
    // Create a temporary input element
    const tempInput = document.createElement('input');
    tempInput.value = shareData.url;
    document.body.appendChild(tempInput);
    
    // Select and copy the URL
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    // Show success notification
    showNotification('Link copied to clipboard!', 'success');
}

// Newsletter
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (!email || !isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate API call
    showLoadingOverlay(true);
    setTimeout(() => {
        showLoadingOverlay(false);
        showNotification('Thank you for subscribing!', 'success');
        e.target.reset();
    }, 1500);
}

// Play notification sound based on type
function playNotificationSound(type) {
    // Create audio context only when needed to comply with autoplay policies
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    try {
        const context = new AudioContext();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        // Configure sound based on notification type
        switch(type) {
            case 'success':
                // Success: Gentle chime sound
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(880, context.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(660, context.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.15, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
                break;
            case 'error':
                // Error: Double low tone
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(320, context.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(180, context.currentTime + 0.3);
                gainNode.gain.setValueAtTime(0.15, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.4);
                break;
            default: // info
                // Info: Soft ping
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(520, context.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(480, context.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.1, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
        }
        
        // Connect the nodes and start
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        oscillator.start();
        
        // Stop the sound after duration
        oscillator.stop(context.currentTime + 0.7);
    } catch (e) {
        console.log('Audio notification error:', e);
        // Silently fail if browser doesn't support audio
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Get notifications container
    let notifications = document.getElementById('notifications');
    
    if (!notifications) {
        // Create notifications container if it doesn't exist
        notifications = document.createElement('div');
        notifications.id = 'notifications';
        notifications.className = 'notifications';
        document.body.appendChild(notifications);
    }
    
    // Play notification sound
    playNotificationSound(type);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Get current time
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' + minutes : minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
    
    // Create notification content
    let appName = '';
    let icon = '';
    if (type === 'success') {
        appName = 'Success';
        icon = '<i class="fas fa-check"></i>';
    } else if (type === 'error') {
        appName = 'Alert';
        icon = '<i class="fas fa-exclamation"></i>';
    } else {
        appName = 'Info';
        icon = '<i class="fas fa-info"></i>';
    }
    
    // Create notification header
    const header = document.createElement('div');
    header.className = 'notification-header';
    header.innerHTML = `
        <div class="notification-app-icon">${icon}</div>
        <div class="notification-app-name">${appName}</div>
        <div class="notification-time">${formattedTime}</div>
    `;
    
    // Create notification content
    const content = document.createElement('div');
    content.className = 'notification-content';
    content.innerHTML = `<span>${message}</span>`;
    
    // Add close button to notification
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.addEventListener('click', () => {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    notification.appendChild(header);
    notification.appendChild(content);
    notification.appendChild(closeBtn);
    notifications.appendChild(notification);
    
    // Mobile device haptic feedback (if available)
    if (window.navigator && window.navigator.vibrate) {
        try {
            window.navigator.vibrate(50);
        } catch (e) {
            // Silently fail if vibration API not supported
        }
    }
    
    // Auto remove after delay
    const timeoutId = setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
    
    // If user hovers, pause the auto-removal
    notification.addEventListener('mouseenter', () => {
        clearTimeout(timeoutId);
    });
    
    // Resume auto-removal on mouse leave
    notification.addEventListener('mouseleave', () => {
        const newTimeoutId = setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 1500);
        
        // Store the new timeout ID
        notification.dataset.timeoutId = newTimeoutId;
    });
    
    // Add swipe functionality
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const minSwipeDistance = 50;
    
    notification.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
        
        // Add class to indicate touch in progress
        notification.classList.add('swiping');
    }, { passive: true });
    
    notification.addEventListener('touchmove', e => {
        // Get current touch position
        const currentX = e.changedTouches[0].clientX;
        const currentY = e.changedTouches[0].clientY;
        
        // Calculate distance moved
        const deltaX = currentX - touchStartX;
        const deltaY = currentY - touchStartY;
        
        // Apply transform based on movement (horizontal movement takes precedence)
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            notification.style.transform = `translateX(${deltaX}px)`;
        } else {
            notification.style.transform = `translateY(${deltaY}px)`;
        }
        
        // Decrease opacity as it's moved
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = 150;
        const opacity = Math.max(0, 1 - distance / maxDistance);
        notification.style.opacity = opacity;
    }, { passive: true });
    
    notification.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        
        // Remove swiping class
        notification.classList.remove('swiping');
        
        // Calculate distance
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance >= minSwipeDistance) {
            // Determine direction for animation class
            let direction;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                direction = deltaX > 0 ? 'right' : 'left';
            } else {
                direction = deltaY > 0 ? 'down' : 'up';
            }
            
            // Add appropriate direction class
            notification.classList.add(`swipe-${direction}`);
            
            // Vibrate if supported
            if (window.navigator && window.navigator.vibrate) {
                try {
                    window.navigator.vibrate(20);
                } catch (e) {
                    // Silently fail
                }
            }
            
            // Remove after animation
            setTimeout(() => {
                notification.remove();
            }, 300);
        } else {
            // Reset transform and opacity if not swiped far enough
            notification.style.transform = '';
            notification.style.opacity = '';
        }
    }, { passive: true });
    
    return notification;
}

function showLoadingOverlay(show) {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (!loadingOverlay) return;
    
    if (show) {
        loadingOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling while loading
    } else {
        loadingOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

function showReadingProgress() {
    readingProgress?.classList.add('active');
}

// Scroll animations - No GSAP (Improved)
function initScrollAnimations() {
    // Use requestAnimationFrame for smoother scroll animations
    let ticking = false;
    let scrollY = window.scrollY;
    
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add specific animations based on element class
                if (entry.target.classList.contains('image-gallery-head')) {
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.opacity = '1';
                } else if (entry.target.classList.contains('image-gallery-des')) {
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.opacity = '1';
                } else if (entry.target.classList.contains('the-end-span')) {
                    entry.target.style.transform = 'scale(1)';
                    entry.target.style.opacity = '1';
                }
                
                // Once visible, no need to observe anymore
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Add animation classes to elements
    const imageGalleryHead = document.querySelector('.image-gallery .head');
    if (imageGalleryHead) {
        imageGalleryHead.classList.add('image-gallery-head');
        imageGalleryHead.style.transform = 'translateY(100px)';
        imageGalleryHead.style.opacity = '0';
        imageGalleryHead.style.transition = 'transform 1s ease, opacity 1s ease';
    }
    
    const imageGalleryDes = document.querySelector('.image-gallery .des');
    if (imageGalleryDes) {
        imageGalleryDes.classList.add('image-gallery-des');
        imageGalleryDes.style.transform = 'translateY(50px)';
        imageGalleryDes.style.opacity = '0';
        imageGalleryDes.style.transition = 'transform 1s ease, opacity 1s ease';
    }
    
    const theEndSpan = document.querySelector('.the-end span');
    if (theEndSpan) {
        theEndSpan.classList.add('the-end-span');
        theEndSpan.style.transform = 'scale(0.5)';
        theEndSpan.style.opacity = '0';
        theEndSpan.style.transition = 'transform 1s ease, opacity 1s ease';
    }

    // Observe all animated elements
    document.querySelectorAll('.fade-up, .reveal-element, .scale-in, .image-gallery-head, .image-gallery-des, .the-end-span').forEach(el => {
        observer.observe(el);
    });
    
    // Optimized scroll handler for parallax
    function updateParallax() {
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground) {
            // Use transform3d for GPU acceleration (reduces flickering)
            const translateY = scrollY * 0.2;
            heroBackground.style.transform = `translate3d(0, ${translateY}px, 0)`;
        }
        
        ticking = false;
    }
    
    // Throttled scroll event handler using requestAnimationFrame
    window.addEventListener('scroll', function() {
        scrollY = window.scrollY;
        
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
    
    // Initial call to set positions
    updateParallax();
}

// Utility functions
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

function formatCategoryTitle(category) {
    return category.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function groupBooksByCategory(books) {
    return books.reduce((acc, book) => {
        if (!acc[book.category]) {
            acc[book.category] = [];
        }
        acc[book.category].push(book);
        return acc;
    }, {});
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Initialize magnetic effect with reduced strength for book cards
function initializeMagneticEffect() {
    // Skip on mobile devices to improve performance
    if (window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches) {
        return;
    }
    
    const magneticElements = document.querySelectorAll('.magnetic:not(.navigation .magnetic)');
    
    // Use a throttled event handler for better performance
    const throttledMouseMove = throttle((e, el, strength) => {
        const position = el.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;
        
        // Use requestAnimationFrame for smoother animations
        requestAnimationFrame(() => {
            el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
    }, 10); // 10ms throttle for smooth animation
    
    magneticElements.forEach(el => {
        const strength = parseFloat(el.getAttribute('data-magnetic-strength')) || 0.5;
        
        el.addEventListener('mousemove', (e) => {
            throttledMouseMove(e, el, strength);
        });
        
        el.addEventListener('mouseleave', () => {
            // Use requestAnimationFrame for smoother reset
            requestAnimationFrame(() => {
                el.style.transform = 'translate(0px, 0px)';
            });
        });
        
        // Add active class on click for mobile fallback
        el.addEventListener('touchstart', () => {
            el.classList.add('active');
        });
        
        el.addEventListener('touchend', () => {
            setTimeout(() => {
                el.classList.remove('active');
            }, 300);
        });
    });
}

// Throttle function to limit function calls
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check for URL parameters
function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('book');
    
    if (bookId) {
        const id = parseInt(bookId);
        const book = state.books.find(b => b.id === id);
        if (book) {
            setTimeout(() => {
                openBookModal(id);
            }, 1000);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if all required elements exist
    if (!bookGrid) {
        console.warn('Book grid element not found');
    }
    
    if (!searchInput) {
        console.warn('Search input element not found');
    }
    
    if (!bookModal) {
        console.warn('Book modal element not found');
    }
    
    init();
    checkUrlParameters();
});

// Initialize footer particles
function initializeFooterParticles() {
    const footer = document.querySelector('footer');
    if (!footer) return;
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.className = 'footer-particles';
    footer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Resize canvas
    function resizeCanvas() {
        canvas.width = footer.offsetWidth;
        canvas.height = footer.offsetHeight;
    }
    
    // Create particles
    function createParticles() {
        particles = [];
        const particleCount = Math.floor(canvas.width / 20); // Adjust density
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                color: `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25
            });
        }
    }
    
    // Draw particles
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
        });
        
        requestAnimationFrame(drawParticles);
    }
    
    // Initialize
    resizeCanvas();
    createParticles();
    drawParticles();
    
    // Handle resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });
}

function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Add smooth scrolling for anchor links
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add smooth scrolling for "Explore Books" button
    const scrollToBooks = document.querySelector('.scroll-to-books');
    if (scrollToBooks) {
        scrollToBooks.addEventListener('click', () => {
            const bookGrid = document.querySelector('.book-grid');
            if (bookGrid) {
                bookGrid.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Toggle filter sidebar
    const filterToggleBtn = document.querySelector('.filter-toggle');
    if (filterToggleBtn) {
        filterToggleBtn.addEventListener('click', toggleFilter);
    }

    // Close filter sidebar
    const filterCloseBtn = document.querySelector('.filter-close');
    if (filterCloseBtn) {
        filterCloseBtn.addEventListener('click', toggleFilter);
    }

    // Apply filter button
    document.querySelector('.apply-filters')?.addEventListener('click', applyFilters);
    document.querySelector('.btn-apply')?.addEventListener('click', function() {
        // Apply filter logic here
        applyFilters();
        showNotification('Filters applied successfully!', 'success');
        toggleFilter(); // Close filter sidebar
    });

    // Reset filter button - update selector to match current HTML
    document.querySelector('.reset-filters')?.addEventListener('click', resetFilters);
    document.querySelector('.btn-reset')?.addEventListener('click', function() {
        resetFilters();
    });
});

// Reset filters function
function resetFilters() {
    // Reset filter logic here
    const checkboxes = document.querySelectorAll('.filter-content input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset active filters
    state.activeFilters = {
        categories: [],
        languages: [],
        formats: []
    };
    
    // Apply the reset
    applyFilters();
    
    // Show notification
    showNotification('Filters have been reset', 'info');
}
