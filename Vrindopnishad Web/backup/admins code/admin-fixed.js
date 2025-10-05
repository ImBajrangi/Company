// Import API Service
import AdminApiService from './api-service.js';

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
                
                try {
                    const response = await AdminApiService.login(email, password);
                    
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
        
        // PDF Management
        const addPdfForm = document.getElementById('add-pdf-form');
        if (addPdfForm) {
            addPdfForm.addEventListener('submit', handlePDFSubmit);
        }
        
        // Books Management
        const addBookForm = document.getElementById('add-book-form');
        if (addBookForm) {
            addBookForm.addEventListener('submit', handleAddBookSubmit);
        }
        
        const editBookForm = document.getElementById('edit-book-form');
        if (editBookForm) {
            editBookForm.addEventListener('submit', handleEditBookSubmit);
        }
        
        const viewBooksBtn = document.getElementById('view-books-btn');
        if (viewBooksBtn) {
            viewBooksBtn.addEventListener('click', loadBooks);
        }
        
        const booksSearch = document.getElementById('books-search');
        if (booksSearch) {
            booksSearch.addEventListener('input', debounce(handleBooksSearch, 300));
        }
        
        const booksSearchBtn = document.getElementById('books-search-btn');
        if (booksSearchBtn) {
            booksSearchBtn.addEventListener('click', () => handleBooksSearch({ target: booksSearch }));
        }
        
        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', closeModals);
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
    
    // PDF Management Functions
    async function handlePDFSubmit(e) {
        e.preventDefault();
        showLoading();
        
        const formData = new FormData(e.target);
        
        try {
            // Use the API service to upload PDF
            const response = await AdminApiService.uploadPdf(formData);
            
            if (response.success) {
                showSuccess('PDF सफलतापूर्वक अपलोड किया गया');
                e.target.reset();
                // Refresh PDF list if available
                if (document.getElementById('pdfs-list')) {
                    loadPdfs();
                }
            } else {
                showError(response.error || 'PDF अपलोड करने में विफल');
            }
        } catch (error) {
            console.error('PDF upload error:', error);
            showError('PDF अपलोड करने में विफल। कृपया फिर से प्रयास करें।');
        } finally {
            hideLoading();
        }
    }
    
    // Load PDFs function
    async function loadPdfs() {
        const pdfsList = document.getElementById('pdfs-list');
        if (!pdfsList) return;
        
        showLoading();
        pdfsList.innerHTML = '<p>Loading PDFs...</p>';
        
        try {
            const response = await AdminApiService.getPdfs();
            
            if (response.success) {
                if (response.data.length === 0) {
                    pdfsList.innerHTML = '<p>No PDFs found</p>';
                    return;
                }
                
                pdfsList.innerHTML = '';
                response.data.forEach(pdf => {
                    const li = document.createElement('li');
                    li.className = 'pdf-item';
                    li.dataset.id = pdf._id;
                    
                    li.innerHTML = `
                        <div class="pdf-info">
                            <h4>${pdf.title}</h4>
                            <p>${truncateText(pdf.description, 100)}</p>
                        </div>
                        <div class="pdf-actions">
                            <button class="btn view-pdf" data-url="${pdf.pdfUrl}">View</button>
                            <button class="btn delete-pdf" data-id="${pdf._id}">Delete</button>
                        </div>
                    `;
                    
                    pdfsList.appendChild(li);
                });
                
                // Add event listeners to buttons
                document.querySelectorAll('.view-pdf').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const url = btn.dataset.url;
                        window.open(url, '_blank');
                    });
                });
                
                document.querySelectorAll('.delete-pdf').forEach(btn => {
                    btn.addEventListener('click', async () => {
                        if (confirm('Are you sure you want to delete this PDF?')) {
                            const id = btn.dataset.id;
                            await deletePdf(id);
                        }
                    });
                });
            } else {
                pdfsList.innerHTML = '<p>Error loading PDFs</p>';
            }
        } catch (error) {
            console.error('Error loading PDFs:', error);
            pdfsList.innerHTML = '<p>Error loading PDFs</p>';
        } finally {
            hideLoading();
        }
    }
    
    // Delete PDF function
    async function deletePdf(id) {
        showLoading();
        
        try {
            const response = await AdminApiService.deletePdf(id);
            
            if (response.success) {
                showSuccess('PDF सफलतापूर्वक हटा दिया गया');
                // Remove from DOM
                const pdfItem = document.querySelector(`.pdf-item[data-id="${id}"]`);
                if (pdfItem) {
                    pdfItem.remove();
                }
            } else {
                showError(response.error || 'PDF हटाने में विफल');
            }
        } catch (error) {
            console.error('Error deleting PDF:', error);
            showError('PDF हटाने में विफल। कृपया फिर से प्रयास करें।');
        } finally {
            hideLoading();
        }
    }
    
    // Initialize PDF Management
    function initPDFManagement() {
        console.log('Initializing PDF Management...');
        loadPdfs();
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
    
    async function handleAddBookSubmit(event) {
        event.preventDefault();
        showLoading();
        
        try {
            const formData = new FormData(event.target);
            const bookData = {
                title: formData.get('title'),
                author: formData.get('author'),
                description: formData.get('description'),
                cover: formData.get('cover'),
                year: formData.get('year'),
                category: formData.get('category'),
                language: formData.get('language'),
                format: formData.get('format') ? formData.get('format').split(',').map(f => f.trim()) : []
            };
            
            const response = await AdminApiService.createBook(bookData);
            
            if (response.success) {
                showSuccess('Book added successfully');
                event.target.reset();
                loadBooks();
            } else {
                showError('Failed to add book: ' + (response.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error adding book:', error);
            showError('Error adding book: ' + error.message);
        } finally {
            hideLoading();
        }
    }
    
    async function editBook(bookId) {
        showLoading();
        
        try {
            const response = await AdminApiService.getBooks();
            
            if (response.success && response.data) {
                const book = response.data.find(b => (b._id || b.id) === bookId);
                
                if (book) {
                    populateEditBookForm(book);
                    openEditBookModal();
                } else {
                    showError('Book not found');
                }
            } else {
                showError('Failed to fetch book details: ' + (response.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error fetching book details:', error);
            showError('Error fetching book details: ' + error.message);
        } finally {
            hideLoading();
        }
    }
    
    function populateEditBookForm(book) {
        const editBookForm = document.getElementById('edit-book-form');
        if (!editBookForm) return;
        
        document.getElementById('edit-book-id').value = book._id || book.id;
        document.getElementById('edit-book-title').value = book.title || '';
        document.getElementById('edit-book-author').value = book.author || '';
        document.getElementById('edit-book-description').value = book.description || '';
        document.getElementById('edit-book-cover').value = book.cover || '';
        document.getElementById('edit-book-year').value = book.year || '';
        document.getElementById('edit-book-category').value = book.category || '';
        document.getElementById('edit-book-language').value = book.language || '';
        
        // Handle format which might be an array or string
        let formatValue = '';
        if (Array.isArray(book.format)) {
            formatValue = book.format.join(', ');
        } else if (typeof book.format === 'string') {
            formatValue = book.format;
        }
        document.getElementById('edit-book-format').value = formatValue;
    }
    
    function openEditBookModal() {
        const editBookModal = document.getElementById('edit-book-modal');
        if (!editBookModal) return;
        
        editBookModal.classList.add('active');
        document.body.classList.add('modal-open');
    }
    
    function closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.classList.remove('modal-open');
    }
    
    async function handleEditBookSubmit(event) {
        event.preventDefault();
        showLoading();
        
        try {
            const bookId = document.getElementById('edit-book-id').value;
            const formData = new FormData(event.target);
            
            const bookData = {
                title: formData.get('title'),
                author: formData.get('author'),
                description: formData.get('description'),
                cover: formData.get('cover'),
                year: formData.get('year'),
                category: formData.get('category'),
                language: formData.get('language'),
                format: formData.get('format') ? formData.get('format').split(',').map(f => f.trim()) : []
            };
            
            const response = await AdminApiService.updateBook(bookId, bookData);
            
            if (response.success) {
                showSuccess('Book updated successfully');
                closeModals();
                loadBooks();
            } else {
                showError('Failed to update book: ' + (response.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error updating book:', error);
            showError('Error updating book: ' + error.message);
        } finally {
            hideLoading();
        }
    }
    
    async function deleteBook(bookId) {
        if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
            return;
        }
        
        showLoading();
        
        try {
            const response = await AdminApiService.deleteBook(bookId);
            
            if (response.success) {
                showSuccess('Book deleted successfully');
                loadBooks();
            } else {
                showError('Failed to delete book: ' + (response.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            showError('Error deleting book: ' + error.message);
        } finally {
            hideLoading();
        }
    }
    
    function handleBooksSearch(event) {
        const searchTerm = event.target.value.toLowerCase().trim();
        const booksList = document.getElementById('books-list');
        
        if (!booksList) return;
        
        const bookItems = booksList.querySelectorAll('.item');
        
        if (bookItems.length === 0) {
            loadBooks(); // If no items are displayed, reload the list
            return;
        }
        
        let foundItems = 0;
        
        bookItems.forEach(item => {
            const title = item.querySelector('h4').textContent.toLowerCase();
            const author = item.querySelector('p:nth-child(2)').textContent.toLowerCase();
            const description = item.querySelector('p:nth-child(5)').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || author.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = '';
                foundItems++;
            } else {
                item.style.display = 'none';
            }
        });
        
        if (foundItems === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = 'No books found matching your search.';
            
            // Remove any existing empty message
            const existingEmptyMessage = booksList.querySelector('.empty-message');
            if (existingEmptyMessage) {
                existingEmptyMessage.remove();
            }
            
            booksList.appendChild(emptyMessage);
        } else {
            // Remove empty message if it exists
            const existingEmptyMessage = booksList.querySelector('.empty-message');
            if (existingEmptyMessage) {
                existingEmptyMessage.remove();
            }
        }
    }
}); 