// Main admin functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize admin panel
    const Admin = {
        currentSection: 'gallery',
        deleteTarget: null,
        editingItem: null,
        
        init() {
            console.log('Initializing admin panel...');
            
            // Wait for AdminApiService to be available
            if (typeof AdminApiService === 'undefined') {
                console.error('AdminApiService not found. Please ensure admin-backend-connector.js is loaded first.');
                return;
            }
            
            this.setupEventListeners();
            this.setupNetworkStatus();
            this.checkAuth();
        },
    
    // Event Listeners
        setupEventListeners() {
            console.log('Setting up event listeners...');
            
            // Login form
            const loginForm = document.getElementById('loginForm');
    if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
                    this.handleLogin(e);
                });
                } else {
                console.error('Login form not found');
            }
            
            // Navigation
            document.querySelectorAll('.sidebar a').forEach(link => {
                link.addEventListener('click', (e) => {
            e.preventDefault();
                    this.handleNavigation(e);
                });
            });
            
            // Logout
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    this.handleLogout();
                });
            }
            
            // Add new item button
            const addNewBtn = document.getElementById('addNewBtn');
            if (addNewBtn) {
                addNewBtn.addEventListener('click', () => {
                    this.handleAddNew();
                });
            }
            
            // Search with debounce
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.addEventListener('input', 
                    debounce((e) => {
                        const searchTerm = e.target.value.toLowerCase();
                        // Call the async method without awaiting it since this is a callback
                        // The searchContent method handles its own loading state
                        this.searchContent(this.currentSection, searchTerm)
                            .catch(error => {
                                console.error('Search error:', error);
                                this.showError('Error during search');
                            });
                    }, 300)
                );
            }
            
            // Modal events
            document.querySelectorAll('.close').forEach(btn => {
                btn.addEventListener('click', () => this.closeModal());
            });

            // Delete confirmation
            const confirmDelete = document.getElementById('confirmDelete');
            if (confirmDelete) {
                confirmDelete.addEventListener('click', () => this.handleConfirmDelete());
            }

            const cancelDelete = document.getElementById('cancelDelete');
            if (cancelDelete) {
                cancelDelete.addEventListener('click', () => {
                    document.getElementById('deleteModal').classList.remove('active');
                });
            }

            // Form submission
            const itemForm = document.getElementById('itemForm');
            if (itemForm) {
                itemForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleFormSubmit(e);
                });
            }

            // Notification close
            const notificationClose = document.getElementById('notificationClose');
            if (notificationClose) {
                notificationClose.addEventListener('click', () => {
                    document.getElementById('notification').classList.add('hidden');
                });
            }

            // Global event delegation for edit and delete buttons
            document.addEventListener('click', (e) => {
                // Edit button
                if (e.target.closest('.edit-btn')) {
                    const btn = e.target.closest('.edit-btn');
                    const card = btn.closest('.card');
                    const id = card.dataset.id;
                    this.editItem(this.currentSection, id);
                }
                
                // Delete button
                if (e.target.closest('.delete-btn')) {
                    const btn = e.target.closest('.delete-btn');
                    const card = btn.closest('.card');
                    const id = card.dataset.id;
                    this.deleteItem(this.currentSection, id);
                }
            });
        },

        // Network Status
        setupNetworkStatus() {
            const updateOnlineStatus = () => {
                const status = navigator.onLine;
                document.getElementById('onlineStatus').classList.toggle('hidden', !status);
                document.getElementById('offlineStatus').classList.toggle('hidden', status);
                document.getElementById('networkStatus').classList.toggle('offline', !status);
            };

            window.addEventListener('online', updateOnlineStatus);
            window.addEventListener('offline', updateOnlineStatus);
            updateOnlineStatus();
        },

        // Authentication
        async checkAuth() {
            console.log('Checking authentication...');
            const token = localStorage.getItem(AdminApiService.TOKEN_KEY);
            if (!token) {
                console.log('No token found, showing login form');
                this.showLoginForm();
                return;
            }

            try {
                console.log('Verifying token...');
                const response = await AdminApiService.verifyToken();
                console.log('Token verification response:', response);
                
                if (response.success) {
                    console.log('Token valid, showing dashboard');
                    this.showDashboard(response.user);
            } else {
                    console.log('Token invalid, showing login form');
                    this.showError('Session expired. Please login again.');
                    this.showLoginForm();
            }
        } catch (error) {
                console.error('Auth check failed:', error);
                this.showError('Authentication failed');
                this.showLoginForm();
            }
        },

        // Event Handlers
        async handleLogin(e) {
            e.preventDefault();
            this.showLoader();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            console.log(`Attempting login with email: ${email}`);

            try {
                const response = await AdminApiService.login(email, password);
                console.log('Login response:', response);
                
                if (response.success) {
                    this.showSuccess('Login successful');
                    this.showDashboard(response.user);
                } else {
                    this.showError(response.error || 'Invalid credentials');
                }
            } catch (error) {
                console.error('Login failed:', error);
                this.showError('Login failed. Please try again.');
            } finally {
                this.hideLoader();
            }
        },

        handleNavigation(e) {
            const link = e.currentTarget;
            const section = link.dataset.page;
            
            // Update active section
            document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            
            // Update page title
            document.getElementById('pageTitle').textContent = 
                `${section.charAt(0).toUpperCase() + section.slice(1)} Management`;
            
            // Show correct content section
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            document.getElementById(`${section}Content`).classList.add('active');
            
            // Update current section and load content
            this.currentSection = section;
            this.loadContent(section);
        },

        handleLogout() {
            console.log('Logging out...');
            AdminApiService.logout();
            this.showLoginForm();
            this.showSuccess('Logged out successfully');
        },

        handleAddNew() {
            this.editingItem = null;
            this.showModal(this.currentSection);
        },

        handleSearch(e) {
            const searchTerm = e.target.value.toLowerCase();
            this.searchContent(this.currentSection, searchTerm);
        },

        async handleFormSubmit(e) {
            e.preventDefault();
            this.showLoader();

            const form = e.target;
            const formData = new FormData(form);
            const section = this.currentSection;
            const isEdit = formData.get('id');
            
            console.log(`Submitting ${isEdit ? 'edit' : 'new'} form for ${section}`);

            try {
                // Use the appropriate method based on section
                const methodName = `save${section.charAt(0).toUpperCase() + section.slice(1)}Item`;
                console.log(`Calling method: ${methodName}`);
                
                const response = await AdminApiService[methodName](formData);
                console.log('Form submission response:', response);
                
                if (response.success) {
                    this.showSuccess(`${section} ${isEdit ? 'updated' : 'added'} successfully`);
                    this.closeModal();
                    this.loadContent(section);
            } else {
                    this.showError(response.error || `Failed to ${isEdit ? 'update' : 'add'} ${section}`);
            }
        } catch (error) {
                console.error(`Error saving ${section}:`, error);
                this.showError(`Failed to save ${section}`);
        } finally {
                this.hideLoader();
            }
        },

        async handleConfirmDelete() {
            const { section, id } = this.deleteTarget;
            this.showLoader();

            try {
                // Use the appropriate method based on section
                const methodName = `delete${section.charAt(0).toUpperCase() + section.slice(1)}Item`;
                console.log(`Calling method: ${methodName} with id: ${id}`);
                
                const response = await AdminApiService[methodName](id);
                console.log('Delete response:', response);
                
                if (response.success) {
                    this.showSuccess(`${section} deleted successfully`);
                    this.loadContent(section);
                } else {
                    this.showError(response.error || `Failed to delete ${section}`);
                }
            } catch (error) {
                console.error(`Error deleting ${section}:`, error);
                this.showError(`Failed to delete ${section}`);
            } finally {
                this.hideLoader();
                document.getElementById('deleteModal').classList.remove('active');
            }
        },

        // Content Management
        async loadContent(section) {
            console.log(`Loading ${section} content...`);
            this.showLoader();
            
            try {
                const methodName = `get${section.charAt(0).toUpperCase() + section.slice(1)}Items`;
                console.log(`Calling method: ${methodName}`);
                
                const response = await AdminApiService[methodName]();
                console.log(`${section} response:`, response);
                
                if (response.success) {
                    this.displayContent(section, response.data);
                } else {
                    this.showError(`Failed to load ${section}`);
                }
        } catch (error) {
                console.error(`Error loading ${section}:`, error);
                this.showError(`Error loading ${section}`);
        } finally {
                this.hideLoader();
            }
        },

        displayContent(section, items) {
            const grid = document.getElementById(`${section}Grid`);
            
            if (!items || items.length === 0) {
                grid.innerHTML = `<p class="empty-message">No ${section} found</p>`;
            return;
        }
        
            grid.innerHTML = items.map(item => this.createItemCard(section, item)).join('');
        },

        createItemCard(section, item) {
            // Determine the image source based on section type
            let imageSrc = './icons/icon-192x192.png'; // Default fallback
            
            if (section === 'gallery' && item.image) {
                imageSrc = item.image;
            } else if ((section === 'books' || section === 'collections') && item.cover) {
                imageSrc = item.cover;
            } else if (section === 'pdfs' && item.file) {
                imageSrc = item.file;
            }
            
            return `
                <div class="card" data-id="${item.id}">
                    <div class="card-image">
                        <img src="${imageSrc}" 
                             alt="${item.title || 'Item'}"
                             onerror="this.src='./icons/icon-192x192.png'">
                    </div>
                    <div class="card-content">
                        <h3>${item.title || 'Untitled'}</h3>
                        ${item.author ? `<p class="author">By: ${item.author}</p>` : ''}
                        <p>${item.description || ''}</p>
                        ${item.role ? `<p class="role">Role: ${item.role}</p>` : ''}
                        ${item.category ? `<p class="category">Category: ${item.category}</p>` : ''}
                    </div>
                    <div class="card-actions">
                        <button class="btn-secondary edit-btn">
                            <i class="fas fa-edit"></i> Edit
                </button>
                        <button class="btn-danger delete-btn">
                            <i class="fas fa-trash"></i> Delete
                </button>
                    </div>
                </div>
            `;
        },

        // Modal Management
        showModal(section, item = null) {
            const modal = document.getElementById('modal');
            const form = document.getElementById('itemForm');
            
            // Set modal title
            document.getElementById('modalTitle').textContent = 
                item ? `Edit ${section.charAt(0).toUpperCase() + section.slice(1)}` : `Add New ${section.charAt(0).toUpperCase() + section.slice(1)}`;
            
            // Generate form fields based on section
            form.innerHTML = this.getFormFields(section, item);
            
            // Show modal
            modal.classList.add('active');
        },

        closeModal() {
            document.getElementById('modal').classList.remove('active');
            document.getElementById('itemForm').reset();
            this.editingItem = null;
        },

        getFormFields(section, item = null) {
            // Return different form fields based on section
            const fields = {
                gallery: [
                    { name: 'title', label: 'Title', type: 'text', required: true },
                    { name: 'description', label: 'Description', type: 'textarea' },
                    { name: 'image', label: 'Image', type: 'file', accept: 'image/*' }
                ],
                books: [
                    { name: 'title', label: 'Title', type: 'text', required: true },
                    { name: 'author', label: 'Author', type: 'text', required: true },
                    { name: 'description', label: 'Description', type: 'textarea' },
                    { name: 'category', label: 'Category', type: 'text' },
                    { name: 'cover', label: 'Cover Image', type: 'file', accept: 'image/*' }
                ],
                collections: [
                    { name: 'title', label: 'Title', type: 'text', required: true },
                    { name: 'description', label: 'Description', type: 'textarea' },
                    { name: 'cover', label: 'Cover Image', type: 'file', accept: 'image/*' }
                ],
                pdfs: [
                    { name: 'title', label: 'Title', type: 'text', required: true },
                    { name: 'description', label: 'Description', type: 'textarea' },
                    { name: 'file', label: 'PDF File', type: 'file', accept: '.pdf' }
                ],
                users: [
                    { name: 'name', label: 'Name', type: 'text', required: true },
                    { name: 'email', label: 'Email', type: 'email', required: true },
                    { name: 'password', label: 'Password', type: 'password', required: !item },
                    { name: 'role', label: 'Role', type: 'select', options: ['admin', 'editor', 'user'] }
                ]
            };

            let html = '';
            
            // Add hidden id field if editing
            if (item && item.id) {
                html += `<input type="hidden" name="id" value="${item.id}">`;
            }
            
            // Add form fields
            html += fields[section].map(field => this.createFormField(field, item)).join('');
            
            // Add submit button
            html += `
                <div class="form-group">
                    <button type="submit" class="btn-primary">
                        ${item ? 'Update' : 'Add'} ${section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                </div>
            `;
            
            return html;
        },

        createFormField(field, item = null) {
            const value = item ? item[field.name] || '' : '';
            const required = field.required ? 'required' : '';
            
            let inputHtml = '';
            
            switch (field.type) {
                case 'textarea':
                    inputHtml = `<textarea id="${field.name}" name="${field.name}" ${required}>${value}</textarea>`;
                    break;
                    
                case 'select':
                    const options = field.options.map(option => 
                        `<option value="${option}" ${value === option ? 'selected' : ''}>${option.charAt(0).toUpperCase() + option.slice(1)}</option>`
                    ).join('');
                    
                    inputHtml = `<select id="${field.name}" name="${field.name}" ${required}>${options}</select>`;
                    break;
                    
                case 'file':
                    inputHtml = `
                        <input type="${field.type}" id="${field.name}" name="${field.name}" accept="${field.accept}" ${required}>
                        ${value ? `<p class="file-info">Current file: ${value}</p>` : ''}
                    `;
                    break;
                    
                default:
                    inputHtml = `<input type="${field.type}" id="${field.name}" name="${field.name}" value="${value}" ${required}>`;
            }
            
            return `
                        <div class="form-group">
                    <label for="${field.name}">${field.label}</label>
                    ${inputHtml}
            </div>
        `;
        },

        // UI Helpers
        showLoginForm() {
            document.getElementById('loginSection').classList.remove('hidden');
            document.getElementById('adminSection').classList.add('hidden');
            document.getElementById('loginForm').reset();
            document.getElementById('loginError').textContent = '';
        },

        showDashboard(user) {
            document.getElementById('loginSection').classList.add('hidden');
            document.getElementById('adminSection').classList.remove('hidden');
            document.getElementById('userName').textContent = user.name || 'Admin';
            this.loadContent(this.currentSection);
        },

        showLoader() {
            document.getElementById('loader').classList.remove('hidden');
        },

        hideLoader() {
            document.getElementById('loader').classList.add('hidden');
        },

        showNotification(message, type = 'info') {
            const notification = document.getElementById('notification');
            const messageEl = document.getElementById('notificationMessage');
            
            notification.className = `notification ${type}`;
            messageEl.textContent = message;
            notification.classList.remove('hidden');

            setTimeout(() => {
                notification.classList.add('hidden');
            }, 3000);
        },

        showError(message) {
            console.error('Error:', message);
            this.showNotification(message, 'error');
            
            // Also update login error if we're on the login screen
            if (!document.getElementById('loginSection').classList.contains('hidden')) {
                document.getElementById('loginError').textContent = message;
            }
        },

        showSuccess(message) {
            console.log('Success:', message);
            this.showNotification(message, 'success');
        },

        // Utility Methods
        async editItem(section, id) {
            this.showLoader();
            
            try {
                // Use the appropriate method based on section
                const methodName = `get${section.charAt(0).toUpperCase() + section.slice(1)}Item`;
                console.log(`Calling method: ${methodName} with id: ${id}`);
                
                const response = await AdminApiService[methodName](id);
                console.log('Edit item response:', response);
                
                if (response.success) {
                    this.editingItem = response.data;
                    this.showModal(section, response.data);
                } else {
                    this.showError(`Failed to load ${section} details`);
                }
        } catch (error) {
                console.error(`Error loading ${section} details:`, error);
                this.showError(`Error loading ${section} details`);
        } finally {
                this.hideLoader();
            }
        },

        deleteItem(section, id) {
            this.deleteTarget = { section, id };
            document.getElementById('deleteModal').classList.add('active');
        },

        async searchContent(section, searchTerm) {
            if (searchTerm === '') {
                // If search term is empty, just load all content
                this.loadContent(section);
                return;
            }
            
            this.showLoader();
            
            try {
                // Try to use the search API if available
                if (typeof AdminApiService.searchItems === 'function') {
                    const response = await AdminApiService.searchItems(section, searchTerm);
                
                    if (response.success) {
                        this.displayContent(section, response.data);
                        return;
                    }
                }
                
                // Fallback to client-side filtering
                const grid = document.getElementById(`${section}Grid`);
                const items = grid.getElementsByClassName('card');
                
                let hasVisibleItems = false;
                
                Array.from(items).forEach(item => {
                    const title = item.querySelector('h3').textContent.toLowerCase();
                    const description = item.querySelector('p') ? item.querySelector('p').textContent.toLowerCase() : '';
                    const author = item.querySelector('.author') ? item.querySelector('.author').textContent.toLowerCase() : '';
                    const category = item.querySelector('.category') ? item.querySelector('.category').textContent.toLowerCase() : '';
                    
                    const matches = 
                        title.includes(searchTerm) || 
                        description.includes(searchTerm) || 
                        author.includes(searchTerm) || 
                        category.includes(searchTerm);
                    
                    item.style.display = matches ? '' : 'none';
                    
                    if (matches) {
                        hasVisibleItems = true;
                    }
                });
                
                // Show empty message if no items match
                const emptyMessage = grid.querySelector('.empty-message');
                if (!hasVisibleItems) {
                    if (!emptyMessage || !emptyMessage.classList.contains('search-empty')) {
                        // Remove any existing empty message
                        if (emptyMessage) {
                            emptyMessage.remove();
                        }
                        
                        const message = document.createElement('p');
                        message.className = 'empty-message search-empty';
                        message.textContent = `No ${section} found matching "${searchTerm}"`;
                        grid.appendChild(message);
                    }
                } else {
                    // Remove empty message if it exists
                    const searchEmptyMessage = grid.querySelector('.search-empty');
                    if (searchEmptyMessage) {
                        searchEmptyMessage.remove();
                    }
                }
            } catch (error) {
                console.error(`Error searching ${section}:`, error);
                this.showError(`Error searching ${section}`);
            } finally {
                this.hideLoader();
            }
        }
    };

    // Initialize admin panel
    Admin.init();

    // Make Admin globally accessible
    window.Admin = Admin;
});

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 