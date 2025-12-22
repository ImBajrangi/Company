// Search and Clock functionality for Literary Hub

// Initialize DOM elements when document is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded - initializing functionality");
    
    // Digital Clock Implementation
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        const timeDisplay = document.querySelector('.digital-clock .time');
        if (timeDisplay) {
            timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }

    // Update clock immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);

    // Enhanced Search Implementation
    function performSearch(query) {
        if (!query || !query.trim()) return;
        
        query = query.toLowerCase().trim();
        const blocks = document.querySelectorAll('.block');
        let hasResults = false;
        const searchLoading = document.querySelector('.search-loading');
        
        if (searchLoading) {
            searchLoading.style.display = 'flex';
        }

        // Hide mobile search after search is initiated
        if (window.innerWidth <= 992) {
            const mobileSearch = document.querySelector('.search-bar.mobile-search');
            if (mobileSearch) {
                setTimeout(() => {
                    mobileSearch.style.display = 'none';
                    mobileSearch.style.opacity = '0';
                    mobileSearch.style.transform = 'translateY(-10px)';
                }, 300);
            }
        }

        // Simulate search delay for UX
        setTimeout(() => {
            blocks.forEach(block => {
                const title = block.querySelector('h4')?.textContent.toLowerCase() || '';
                const description = block.querySelector('p')?.textContent.toLowerCase() || '';
                const tags = Array.from(block.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
                
                if (title.includes(query) || 
                    description.includes(query) || 
                    tags.some(tag => tag.includes(query))) {
                    block.style.display = 'block';
                    hasResults = true;
                    block.classList.add('search-result-appear');
                } else {
                    block.style.display = 'none';
                    block.classList.remove('search-result-appear');
                }
            });

            // Show no results message if needed
            const existingNoResults = document.querySelector('.no-results-message');
            if (!hasResults) {
                if (!existingNoResults) {
                    const noResults = document.createElement('div');
                    noResults.className = 'no-results-message';
                    noResults.innerHTML = `
                        <div class="no-results-content">
                            <i class="fas fa-search"></i>
                            <h3>No results found</h3>
                            <p>We couldn't find any books matching "${query}"</p>
                            <p>कोई परिणाम नहीं मिला</p>
                        </div>
                    `;
                    document.querySelector('.blocks-container').appendChild(noResults);
                }
            } else if (existingNoResults) {
                existingNoResults.remove();
            }

            if (searchLoading) {
                searchLoading.style.display = 'none';
            }

            // Scroll to results
            const gallerySection = document.querySelector('.gallery');
            if (gallerySection) {
                gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 500);
    }

    // Search Input Event Handlers
    const searchInputs = document.querySelectorAll('#searchInput, #mobileSearchInput');
    searchInputs.forEach(input => {
        if (!input) return;

        const clearButton = input.parentElement.querySelector('.clear-search-btn');
        const searchButton = input.parentElement.querySelector('.search-button');

        // Show/hide clear button based on input content
        input.addEventListener('input', function() {
            if (clearButton) {
                clearButton.style.display = this.value ? 'flex' : 'none';
            }
        });

        // Handle Enter key
        input.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                performSearch(this.value);
            }
        });

        // Clear button functionality
        if (clearButton) {
            clearButton.addEventListener('click', function() {
                input.value = '';
                this.style.display = 'none';
                input.focus();
                filterByCategory('all');
            });
        }

        // Search button functionality
        if (searchButton) {
            searchButton.addEventListener('click', function() {
                performSearch(input.value);
            });
        }
    });

    // Menu Toggle Functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.querySelector('.main-menu');
    
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            mainMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Update aria-expanded attribute for accessibility
            const isExpanded = mainMenu.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            
            // Prevent body scrolling when menu is open
            if (isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
            
            console.log('Menu toggle clicked, active:', mainMenu.classList.contains('active'));
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (mainMenu.classList.contains('active') && !e.target.closest('.main-menu') && !e.target.closest('.menu-toggle')) {
                mainMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Show/hide top search bar on scroll
    const topSearchSection = document.querySelector('.search-section-top');
    if (topSearchSection) {
        // Make the top search always visible
        topSearchSection.style.transform = 'translateY(0)';
        topSearchSection.style.opacity = '1';
    }
    
    // Handle search tag clicks
    const searchTags = document.querySelectorAll('.search-tag');
    searchTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const searchTerm = this.textContent;
            
            // Set the search term in the input
            const searchInput = document.querySelector('#searchInput');
            if (searchInput) {
                searchInput.value = searchTerm;
                // Show the clear button
                const clearButton = searchInput.nextElementSibling;
                if (clearButton) {
                    clearButton.style.display = 'flex';
                }
            }
            
            // Perform search
            performSearch(searchTerm);
        });
    });
    
    // Filter buttons functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Get the filter category
            const filterValue = this.getAttribute('data-filter');
            // Filter blocks
            filterByCategory(filterValue);
        });
    });
    
    // Apply initial state - show all blocks
    filterByCategory('all');
    
    // Add click event handlers for menu items
    const menuItems = document.querySelectorAll('.main-menu li a');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Get the text of the menu item
            const menuText = this.querySelector('.text').textContent.trim().toLowerCase();
            
            // Handle different menu items
            if (menuText === 'home') {
                console.log('Home menu clicked');
                // Home functionality - already on home page, just scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else if (menuText === 'books') {
                console.log('Books menu clicked');
                // Scroll to books section
                const booksSection = document.querySelector('.gallery');
                if (booksSection) {
                    booksSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            } else if (menuText === 'web') {
                console.log('Web menu clicked');
                // Web functionality
                // Show only web category items
                filterByCategory('web');
                
                // Scroll to gallery section
                const gallerySection = document.querySelector('.gallery');
                if (gallerySection) {
                    gallerySection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
                
                // Update active filter button
                const filterButtons = document.querySelectorAll('.filter-btn');
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.getAttribute('data-filter') === 'web') {
                        btn.classList.add('active');
                    }
                });
            } else if (menuText === 'about') {
                console.log('About menu clicked');
                // About functionality
                // Scroll to about section or open about modal
                const aboutSection = document.querySelector('.featured-section');
                if (aboutSection) {
                    aboutSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            } else if (menuText === 'contact') {
                console.log('Contact menu clicked');
                // Contact functionality
                // Scroll to contact section or open contact modal
                const contactSection = document.querySelector('.newsletter-section');
                if (contactSection) {
                    contactSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
            
            // Close mobile menu if open
            const mainMenu = document.querySelector('.main-menu');
            const menuToggle = document.querySelector('.menu-toggle');
            if (mainMenu && mainMenu.classList.contains('active')) {
                mainMenu.classList.remove('active');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
                document.body.style.overflow = '';
            }
            
            // Update active menu item
            const menuItems = document.querySelectorAll('.main-menu li');
            menuItems.forEach(item => {
                item.classList.remove('active');
            });
            this.closest('li').classList.add('active');
            
            // Prevent default link behavior
            e.preventDefault();
        });
    });
    
    // Settings Modal Functionality
    const settingsModal = document.getElementById('settingsModal');
    const settingsButton = document.getElementById('settingsButton');
    const closeSettingsBtn = settingsModal.querySelector('.close-modal');
    
    // Theme buttons
    const themeButtons = document.querySelectorAll('.theme-btn');
    const fontButtons = document.querySelectorAll('.font-btn');
    const animationSpeedSlider = document.getElementById('animationSpeed');
    const speedValue = document.querySelector('.speed-value');
    const saveSettingsBtn = document.querySelector('.save-settings');
    
    // Variables to store temporary settings
    let tempSettings = {
        theme: localStorage.getItem('userSettings') ? JSON.parse(localStorage.getItem('userSettings')).theme : 'dark',
        fontSize: localStorage.getItem('userSettings') ? JSON.parse(localStorage.getItem('userSettings')).fontSize : 'medium',
        animationSpeed: localStorage.getItem('userSettings') ? JSON.parse(localStorage.getItem('userSettings')).animationSpeed : '1'
    };
    
    // Open Settings Modal
    settingsButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Reset temporary settings to current saved settings
        if (localStorage.getItem('userSettings')) {
            const savedSettings = JSON.parse(localStorage.getItem('userSettings'));
            tempSettings = { ...savedSettings };
            
            // Update UI to reflect current saved settings
            themeButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.theme === savedSettings.theme) {
                    btn.classList.add('active');
                }
            });
            
            fontButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.font === savedSettings.fontSize) {
                    btn.classList.add('active');
                }
            });
            
            if (animationSpeedSlider) {
                animationSpeedSlider.value = savedSettings.animationSpeed;
                speedValue.textContent = savedSettings.animationSpeed + 'x';
            }
            
            // Apply saved settings visually
            if (savedSettings.theme === 'light-mode') {
                document.body.classList.add('light-mode');
            } else {
                document.body.classList.remove('light-mode');
            }
            
            document.documentElement.style.setProperty('--base-font-size', 
                savedSettings.fontSize === 'small' ? '14px' : 
                savedSettings.fontSize === 'large' ? '18px' : '16px'
            );
            
            document.documentElement.style.setProperty('--animation-speed', savedSettings.animationSpeed);
        }
        
        settingsModal.style.display = 'flex';
        setTimeout(() => {
            settingsModal.querySelector('.modal-content').style.transform = 'scale(1)';
            settingsModal.querySelector('.modal-content').style.opacity = '1';
        }, 10);
    });
    
    // Close Settings Modal
    closeSettingsBtn.addEventListener('click', function() {
        settingsModal.querySelector('.modal-content').style.transform = 'scale(0.9)';
        settingsModal.querySelector('.modal-content').style.opacity = '0';
        
        // Revert to saved settings if user closes without saving
        if (localStorage.getItem('userSettings')) {
            const savedSettings = JSON.parse(localStorage.getItem('userSettings'));
            
            // Revert theme
            if (savedSettings.theme === 'light-mode') {
                document.body.classList.add('light-mode');
            } else {
                document.body.classList.remove('light-mode');
            }
            
            // Revert font size
            document.documentElement.style.setProperty('--base-font-size', 
                savedSettings.fontSize === 'small' ? '14px' : 
                savedSettings.fontSize === 'large' ? '18px' : '16px'
            );
            
            // Revert animation speed
            document.documentElement.style.setProperty('--animation-speed', savedSettings.animationSpeed);
        }
        
        setTimeout(() => {
            settingsModal.style.display = 'none';
        }, 300);
    });
    
    // Theme Selection - only updates temporary settings
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            themeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update temporary settings
            tempSettings.theme = this.dataset.theme;
            
            // Apply theme visually (temporary)
            if (this.dataset.theme === 'light-mode') {
                document.body.classList.add('light-mode');
            } else {
                document.body.classList.remove('light-mode');
            }
        });
    });
    
    // Font Size Selection - only updates temporary settings
    fontButtons.forEach(button => {
        button.addEventListener('click', function() {
            fontButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update temporary settings
            tempSettings.fontSize = this.dataset.font;
            
            // Apply font size visually (temporary)
            const fontSize = this.dataset.font;
            document.documentElement.style.setProperty('--base-font-size', 
                fontSize === 'small' ? '14px' : 
                fontSize === 'large' ? '18px' : '16px'
            );
        });
    });
    
    // Animation Speed Control - only updates temporary settings
    if (animationSpeedSlider) {
        animationSpeedSlider.addEventListener('input', function() {
            const speed = this.value;
            speedValue.textContent = speed + 'x';
            
            // Update temporary settings
            tempSettings.animationSpeed = speed;
            
            // Apply animation speed visually (temporary)
            document.documentElement.style.setProperty('--animation-speed', speed);
        });
    }
    
    // Save Settings - permanently saves the temporary settings
    saveSettingsBtn.addEventListener('click', function() {
        // Save temporary settings to localStorage
        localStorage.setItem('userSettings', JSON.stringify(tempSettings));
        
        console.log('Settings saved:', tempSettings);
        
        // Show save confirmation
        const saveConfirmation = document.createElement('div');
        saveConfirmation.className = 'save-confirmation';
        saveConfirmation.innerHTML = '<i class="fas fa-check-circle"></i> सेटिंग्स सेव हो गई हैं';
        saveConfirmation.style.position = 'absolute';
        saveConfirmation.style.bottom = '20px';
        saveConfirmation.style.left = '50%';
        saveConfirmation.style.transform = 'translateX(-50%)';
        saveConfirmation.style.background = 'rgba(67, 97, 238, 0.9)';
        saveConfirmation.style.color = 'white';
        saveConfirmation.style.padding = '10px 20px';
        saveConfirmation.style.borderRadius = '30px';
        saveConfirmation.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        saveConfirmation.style.zIndex = '9999';
        saveConfirmation.style.opacity = '0';
        saveConfirmation.style.transition = 'opacity 0.3s ease';
        
        document.body.appendChild(saveConfirmation);
        
        // Show and then hide the confirmation
        setTimeout(() => {
            saveConfirmation.style.opacity = '1';
            
            setTimeout(() => {
                saveConfirmation.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(saveConfirmation);
                }, 300);
            }, 2000);
        }, 100);
        
        // Close modal with animation
        settingsModal.querySelector('.modal-content').style.transform = 'scale(0.9)';
        settingsModal.querySelector('.modal-content').style.opacity = '0';
        setTimeout(() => {
            settingsModal.style.display = 'none';
        }, 300);
    });
    
    // Load saved settings on page load
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Initialize tempSettings with saved settings
        tempSettings = { ...settings };
        
        // Apply theme
        if (settings.theme === 'light-mode') {
            document.body.classList.add('light-mode');
            document.querySelector(`[data-theme="light-mode"]`).classList.add('active');
            document.querySelector(`[data-theme="dark"]`).classList.remove('active');
        }
        
        // Apply font size
        const fontSizeBtn = document.querySelector(`[data-font="${settings.fontSize}"]`);
        if (fontSizeBtn) {
            fontButtons.forEach(btn => btn.classList.remove('active'));
            fontSizeBtn.classList.add('active');
            
            document.documentElement.style.setProperty('--base-font-size', 
                settings.fontSize === 'small' ? '14px' : 
                settings.fontSize === 'large' ? '18px' : '16px'
            );
        }
        
        // Apply animation speed
        if (animationSpeedSlider) {
            animationSpeedSlider.value = settings.animationSpeed;
            speedValue.textContent = settings.animationSpeed + 'x';
            document.documentElement.style.setProperty('--animation-speed', settings.animationSpeed);
        }
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === settingsModal) {
            settingsModal.querySelector('.modal-content').style.transform = 'scale(0.9)';
            settingsModal.querySelector('.modal-content').style.opacity = '0';
            setTimeout(() => {
                settingsModal.style.display = 'none';
            }, 300);
        }
    });
    
    // Mobile Search Functionality
    const searchToggle = document.querySelector('.search-toggle.mobile-only');
    const mobileSearchContainer = document.querySelector('.mobile-search-container');
    const backToMenuBtn = document.querySelector('.back-to-menu');
    const mobileSearchInput = document.querySelector('.mobile-search input');
    const mobileSearchButton = document.querySelector('.mobile-search .search-button');
    const clearSearchBtn = document.querySelector('.mobile-search .clear-search-btn');

    if (searchToggle && mobileSearchContainer) {
        // Toggle mobile search
        searchToggle.addEventListener('click', function() {
            mobileSearchContainer.classList.add('active');
            if (mobileSearchInput) {
                mobileSearchInput.focus();
            }
        });

        // Back button functionality
        if (backToMenuBtn) {
            backToMenuBtn.addEventListener('click', function() {
                mobileSearchContainer.classList.remove('active');
            });
        }

        // Handle search input
        if (mobileSearchInput) {
            mobileSearchInput.addEventListener('input', function() {
                if (clearSearchBtn) {
                    clearSearchBtn.style.display = this.value ? 'block' : 'none';
                }
            });

            mobileSearchInput.addEventListener('keyup', function(event) {
                if (event.key === 'Enter') {
                    performSearch(this.value);
                }
            });
        }

        // Handle search button click
        if (mobileSearchButton) {
            mobileSearchButton.addEventListener('click', function() {
                const searchValue = mobileSearchInput ? mobileSearchInput.value.trim() : '';
                if (searchValue) {
                    performSearch(searchValue);
                }
            });
        }

        // Clear search functionality
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', function() {
                if (mobileSearchInput) {
                    mobileSearchInput.value = '';
                    clearSearchBtn.style.display = 'none';
                    mobileSearchInput.focus();
                }
            });
        }

        // Close search on outside click
        document.addEventListener('click', function(e) {
            if (!mobileSearchContainer.contains(e.target) && 
                !searchToggle.contains(e.target)) {
                mobileSearchContainer.classList.remove('active');
            }
        });

        // Close search on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                mobileSearchContainer.classList.remove('active');
            }
        });
    }

    // Movable Search Bar Functionality
    const movableSearchWrapper = document.getElementById('movableSearch');
    const expandSearchIcon = document.getElementById('expandSearchIcon');
    const collapseSearchIcon = document.getElementById('collapseSearchIcon');
    const movableSearchInput = document.getElementById('movableSearchInput');

    if (movableSearchWrapper && expandSearchIcon && collapseSearchIcon && movableSearchInput) {
        // Make the movable search bar more prominent since we're hiding the menu search icon
        // Position it in a more visible location
        movableSearchWrapper.style.top = '20px';
        movableSearchWrapper.style.right = '20px';
        
        // Add a subtle animation to draw attention to it on page load
        setTimeout(() => {
            movableSearchWrapper.style.animation = 'attention-pulse 1.5s ease-in-out 2';
            
            // Add the animation keyframes
            const attentionStyle = document.createElement('style');
            attentionStyle.textContent = `
                @keyframes attention-pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(67, 97, 238, 0.4); }
                    50% { transform: scale(1.2); box-shadow: 0 0 0 10px rgba(67, 97, 238, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(67, 97, 238, 0); }
                }
            `;
            document.head.appendChild(attentionStyle);
            
            // Remove the animation after it completes
            setTimeout(() => {
                movableSearchWrapper.style.animation = '';
            }, 3000);
        }, 1000);
        
        // Make search bar draggable
        let isDragging = false;
        let offsetX, offsetY;
        let initialX, initialY;
        let velocity = { x: 0, y: 0 };
        let lastX, lastY;
        let animationFrame;
        let mouseDownTime = 0; // Track when mouse was pressed down
        let hasMoved = false; // Track if mouse has moved during drag
        let inactivityTimer; // Timer for inactivity
        let lastInteractionTime = Date.now(); // Track last interaction time

        // Function to add magnetic snap effect
        const magneticSnap = (x, y) => {
            // Snap to edges if close enough
            const threshold = 20;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const wrapperWidth = movableSearchWrapper.offsetWidth;
            const wrapperHeight = movableSearchWrapper.offsetHeight;
            
            // Snap to right edge
            if (windowWidth - (x + wrapperWidth) < threshold) {
                x = windowWidth - wrapperWidth;
            }
            
            // Snap to left edge
            if (x < threshold) {
                x = 0;
            }
            
            // Snap to top edge
            if (y < threshold) {
                y = 0;
            }
            
            // Snap to bottom edge
            if (windowHeight - (y + wrapperHeight) < threshold) {
                y = windowHeight - wrapperHeight;
            }
            
            return { x, y };
        };

        // Function to snap to nearest side after inactivity
        const snapToNearestSide = () => {
            // Only snap if not currently dragging and not expanded
            if (!isDragging && movableSearchWrapper.classList.contains('collapsed')) {
                const rect = movableSearchWrapper.getBoundingClientRect();
                const windowWidth = window.innerWidth;
                const centerX = rect.left + rect.width / 2;
                
                // Determine which side is closer
                const snapToRight = centerX > windowWidth / 2;
                
                // Add transition for smooth movement
                movableSearchWrapper.style.transition = 'all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                
                // Remove any existing animation class
                movableSearchWrapper.classList.remove('auto-closing');
                
                // Add snapping class for animation
                movableSearchWrapper.classList.add('snapping');
                
                if (snapToRight) {
                    // Snap to right side
                    movableSearchWrapper.style.left = 'auto';
                    movableSearchWrapper.style.right = '20px';
                } else {
                    // Snap to left side
                    movableSearchWrapper.style.right = 'auto';
                    movableSearchWrapper.style.left = '20px';
                }
                
                // Remove snapping class after animation completes
                setTimeout(() => {
                    movableSearchWrapper.classList.remove('snapping');
                    
                    // Remove transition after animation completes
                    setTimeout(() => {
                        movableSearchWrapper.style.transition = '';
                    }, 300);
                }, 700);
            }
        };

        // Function to reset inactivity timer
        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimer);
            lastInteractionTime = Date.now();
            
            inactivityTimer = setTimeout(() => {
                // First close the search bar if it's expanded
                if (movableSearchWrapper.classList.contains('expanded')) {
                    // Close the search bar
                    closeSearchBar();
                    
                    // After closing, wait a bit and then snap to side
                    setTimeout(() => {
                        snapToNearestSide();
                    }, 5000);
                } else {
                    // If already collapsed, just snap to side
                    snapToNearestSide();
                }
            }, 5000); // 5 seconds of inactivity (changed from 3 to 5 seconds)
        };
        
        // Function to close search bar
        const closeSearchBar = () => {
            // Add auto-closing class for animation
            movableSearchWrapper.classList.add('auto-closing');
            
            // Add collapsing animation
            movableSearchWrapper.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            // Animate input out first
            if (movableSearchInput.style.display !== 'none') {
                movableSearchInput.style.transition = 'all 0.2s ease';
                movableSearchInput.style.opacity = '0';
                movableSearchInput.style.transform = 'translateX(-10px)';
                
                setTimeout(() => {
                    movableSearchInput.style.display = 'none';
                    collapseSearchIcon.style.display = 'none';
                    movableSearchInput.value = '';
                    
                    // Then collapse the wrapper
                    movableSearchWrapper.classList.remove('expanded');
                    movableSearchWrapper.classList.add('collapsed');
                    
                    // Reset transitions after animation completes
                    setTimeout(() => {
                        movableSearchWrapper.classList.remove('auto-closing');
                        movableSearchWrapper.style.transition = '';
                        movableSearchInput.style.transition = '';
                        movableSearchInput.style.transform = '';
                    }, 500);
                }, 200);
            }
        };

        // Initialize inactivity timer
        resetInactivityTimer();

        // Function to add inertia effect
        const applyInertia = () => {
            if (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1) {
                let rect = movableSearchWrapper.getBoundingClientRect();
                let x = rect.left + velocity.x;
                let y = rect.top + velocity.y;
                
                // Apply boundary constraints
                const maxX = window.innerWidth - movableSearchWrapper.offsetWidth;
                const maxY = window.innerHeight - movableSearchWrapper.offsetHeight;
                x = Math.max(0, Math.min(x, maxX));
                y = Math.max(0, Math.min(y, maxY));
                
                // Apply magnetic snap
                const snapped = magneticSnap(x, y);
                x = snapped.x;
                y = snapped.y;
                
                // Update position
                movableSearchWrapper.style.left = x + 'px';
                movableSearchWrapper.style.top = y + 'px';
                
                // Reduce velocity (friction)
                velocity.x *= 0.95;
                velocity.y *= 0.95;
                
                // Continue animation
                animationFrame = requestAnimationFrame(applyInertia);
            } else {
                // Stop animation when velocity is very low
                cancelAnimationFrame(animationFrame);
                
                // Reset inactivity timer after movement stops
                resetInactivityTimer();
            }
        };

        movableSearchWrapper.addEventListener('mousedown', function(e) {
            // Reset inactivity timer on interaction
            resetInactivityTimer();
            
            // Only allow dragging from the search icon, wrapper itself, or the drag handle (top area)
            const isTopArea = e.clientY - movableSearchWrapper.getBoundingClientRect().top < 20;
            
            if (e.target.closest('#expandSearchIcon') || e.target === movableSearchWrapper || isTopArea) {
                isDragging = true;
                initialX = movableSearchWrapper.getBoundingClientRect().left;
                initialY = movableSearchWrapper.getBoundingClientRect().top;
                offsetX = e.clientX - initialX;
                offsetY = e.clientY - initialY;
                lastX = e.clientX;
                lastY = e.clientY;
                mouseDownTime = Date.now(); // Record when mouse was pressed
                hasMoved = false; // Reset movement flag
                
                // Add grabbing class for visual feedback
                movableSearchWrapper.classList.add('grabbing');
                
                // Stop any ongoing animation
                cancelAnimationFrame(animationFrame);
                
                // Prevent text selection during drag
                e.preventDefault();
            }
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                // Reset inactivity timer on interaction
                resetInactivityTimer();
                
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                
                // Calculate velocity for inertia effect
                velocity.x = e.clientX - lastX;
                velocity.y = e.clientY - lastY;
                lastX = e.clientX;
                lastY = e.clientY;
                
                // Check if mouse has moved significantly to consider it a drag
                const moveThreshold = 5; // pixels
                if (Math.abs(e.clientX - (initialX + offsetX)) > moveThreshold || 
                    Math.abs(e.clientY - (initialY + offsetY)) > moveThreshold) {
                    hasMoved = true;
                }
                
                // Keep the search bar within the viewport
                const maxX = window.innerWidth - movableSearchWrapper.offsetWidth;
                const maxY = window.innerHeight - movableSearchWrapper.offsetHeight;
                
                movableSearchWrapper.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
                movableSearchWrapper.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
                movableSearchWrapper.style.right = 'auto'; // Clear the right property when dragging
                
                // Add subtle rotation based on velocity for more natural feel
                const rotateX = velocity.y * 0.5; // Tilt based on vertical movement
                const rotateY = -velocity.x * 0.5; // Tilt based on horizontal movement
                movableSearchWrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                const wasDragging = hasMoved;
                isDragging = false;
                
                // Remove grabbing class
                movableSearchWrapper.classList.remove('grabbing');
                
                // Reset transform
                movableSearchWrapper.style.transform = '';
                
                // Only apply inertia and bounce if actually dragged
                if (wasDragging) {
                    // Apply inertia effect
                    applyInertia();
                    
                    // Add subtle bounce effect
                    movableSearchWrapper.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    movableSearchWrapper.style.transform = 'scale(1.05)';
                    
                    setTimeout(() => {
                        movableSearchWrapper.style.transform = 'scale(1)';
                        
                        // Remove transition after animation completes
                        setTimeout(() => {
                            movableSearchWrapper.style.transition = '';
                        }, 300);
                    }, 100);
                }
                
                // Reset inactivity timer after drag ends
                resetInactivityTimer();
            }
        });

        // Expand search on click
        expandSearchIcon.addEventListener('click', function(e) {
            // Reset inactivity timer on interaction
            resetInactivityTimer();
            
            // Only expand if it wasn't a drag operation
            if (!hasMoved && !isDragging) {
                // Add expanding animation
                movableSearchWrapper.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                
                movableSearchWrapper.classList.remove('collapsed');
                movableSearchWrapper.classList.add('expanded');
                
                // Delay showing input for smoother animation
                setTimeout(() => {
                    movableSearchInput.style.display = 'block';
                    collapseSearchIcon.style.display = 'block';
                    movableSearchInput.focus();
                    
                    // Add subtle animation to input
                    movableSearchInput.style.opacity = '0';
                    movableSearchInput.style.transform = 'translateX(-10px)';
                    
                    setTimeout(() => {
                        movableSearchInput.style.transition = 'all 0.3s ease';
                        movableSearchInput.style.opacity = '1';
                        movableSearchInput.style.transform = 'translateX(0)';
                    }, 50);
                }, 150);
                
                e.stopPropagation();
            }
        });

        // Collapse search on close icon click
        collapseSearchIcon.addEventListener('click', function() {
            // Reset inactivity timer on interaction
            resetInactivityTimer();
            
            // Use the closeSearchBar function
            closeSearchBar();
        });

        // Search on Enter key
        movableSearchInput.addEventListener('keyup', function(e) {
            // Reset inactivity timer on interaction
            resetInactivityTimer();
            
            if (e.key === 'Enter') {
                // Add search animation
                const searchButton = document.createElement('div');
                searchButton.className = 'search-animation';
                searchButton.style.position = 'absolute';
                searchButton.style.top = '50%';
                searchButton.style.right = '15px';
                searchButton.style.transform = 'translateY(-50%)';
                searchButton.style.width = '30px';
                searchButton.style.height = '30px';
                searchButton.style.borderRadius = '50%';
                searchButton.style.background = 'rgba(67, 97, 238, 0.2)';
                searchButton.style.zIndex = '1';
                searchButton.style.animation = 'search-pulse 0.5s ease-out';
                
                movableSearchWrapper.appendChild(searchButton);
                
                // Remove animation element after it completes
                setTimeout(() => {
                    movableSearchWrapper.removeChild(searchButton);
                }, 500);
                
                performSearch(this.value);
            }
        });

        // Prevent collapsing when clicking on input
        movableSearchInput.addEventListener('click', function(e) {
            // Reset inactivity timer on interaction
            resetInactivityTimer();
            e.stopPropagation();
        });
        
        // Add search pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes search-pulse {
                0% { transform: translateY(-50%) scale(1); opacity: 1; }
                100% { transform: translateY(-50%) scale(3); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // Double click to reset position
        movableSearchWrapper.addEventListener('dblclick', function(e) {
            // Reset inactivity timer on interaction
            resetInactivityTimer();
            
            // Only if clicking on the top area (drag handle)
            const isTopArea = e.clientY - movableSearchWrapper.getBoundingClientRect().top < 20;
            
            if (isTopArea) {
                // Animate back to original position
                movableSearchWrapper.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                movableSearchWrapper.style.top = '100px';
                movableSearchWrapper.style.right = '20px';
                movableSearchWrapper.style.left = 'auto';
                
                // Add bounce effect
                setTimeout(() => {
                    movableSearchWrapper.style.transform = 'scale(1.1)';
                    
                    setTimeout(() => {
                        movableSearchWrapper.style.transform = 'scale(1)';
                        
                        // Remove transition after animation completes
                        setTimeout(() => {
                            movableSearchWrapper.style.transition = '';
                        }, 300);
                    }, 150);
                }, 500);
                
                e.stopPropagation();
            }
        });
        
        // Reset inactivity timer on window scroll
        window.addEventListener('scroll', resetInactivityTimer);
        
        // Reset inactivity timer on window resize
        window.addEventListener('resize', resetInactivityTimer);
    }

    // Add 3D Magnetic Effect to Blocks
    function enhanceBlocksWith3DEffect() {
        const blocks = document.querySelectorAll('.block');
        
        // Only apply 3D effect on desktop devices (width > 992px)
        const isDesktop = window.innerWidth > 992;
        
        if (!isDesktop) {
            console.log("3D effect disabled on mobile devices");
            return; // Don't apply effect on mobile devices
        }
        
        blocks.forEach(block => {
            // Add 3D rotation effect on mouse move
            block.addEventListener('mousemove', (e) => {
                const rect = block.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate rotation angles based on mouse position
                // Reduce the divisor to increase the effect, increase to make it more subtle
                const angleX = (y - centerY) / 20;
                const angleY = (centerX - x) / 20;
                
                // Apply 3D transform
                block.style.transform = `
                    perspective(1000px)
                    rotateX(${angleX}deg)
                    rotateY(${angleY}deg)
                    translateZ(10px)
                    scale(1.02)
                `;
                
                // Add shadow based on mouse position for enhanced 3D effect
                const shadowX = (x - centerX) / 10;
                const shadowY = (y - centerY) / 10;
                block.style.boxShadow = `
                    ${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.3),
                    0 10px 20px rgba(0, 0, 0, 0.2)
                `;
            });
            
            // Reset transform and shadow on mouse leave
            block.addEventListener('mouseleave', () => {
                block.style.transform = 'translateY(-15px) scale(1.02)';
                block.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.2)';
                
                // Add transition for smooth reset
                block.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
                
                // Remove transition after animation completes
                setTimeout(() => {
                    block.style.transition = '';
                }, 500);
            });
        });
    }
    
    // Initialize 3D effect for blocks
    enhanceBlocksWith3DEffect();
    
    // Re-initialize 3D effect when window is resized
    window.addEventListener('resize', function() {
        // Remove existing event listeners from blocks
        const blocks = document.querySelectorAll('.block');
        blocks.forEach(block => {
            block.removeEventListener('mousemove', () => {});
            block.removeEventListener('mouseleave', () => {});
            
            // Reset styles
            block.style.transform = '';
            block.style.boxShadow = '';
            block.style.transition = '';
        });
        
        // Re-apply 3D effect if on desktop
        if (window.innerWidth > 992) {
            enhanceBlocksWith3DEffect();
        }
    });

    // Initialize preview buttons for book blocks
    function initializePreviewButtons() {
        const previewButtons = document.querySelectorAll('.block-btn.preview-btn');
        
        previewButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Get the parent block element
                const bookBlock = this.closest('.block');
                
                // Extract book information
                const title = bookBlock.querySelector('h4').textContent;
                const description = bookBlock.querySelector('p').textContent;
                const imageSrc = bookBlock.querySelector('.block-img img').getAttribute('src');
                const tags = Array.from(bookBlock.querySelectorAll('.tag')).map(tag => tag.textContent);
                
                // Get author from tags or default
                const author = tags.find(tag => !tag.includes('Classic') && !tag.includes('Fiction') && !tag.includes('Non-Fiction')) || 'Unknown Author';
                
                // Get category/genre
                const category = bookBlock.getAttribute('data-category') || 'fiction';
                
                // Get rating
                const ratingElement = bookBlock.querySelector('.rating-count');
                const rating = ratingElement ? parseFloat(ratingElement.textContent.replace(/[()]/g, '')) : 4.5;
                
                // Create a temporary book object with an ID
                const bookId = generateTempId(title);
                
                // Store book data in localStorage for collection-detail.html to access
                const bookData = {
                    _id: bookId,
                    title: title,
                    author: author,
                    description: description,
                    coverImage: imageSrc,
                    genre: category,
                    rating: rating,
                    tags: tags
                };
                
                // Store the book data in localStorage
                localStorage.setItem('previewBook', JSON.stringify(bookData));
                
                // Open collection-detail.html with the book ID
                window.open(`Collection/collection-detail.html?bookId=${bookId}`, '_blank');
            });
        });
    }

    // Generate a temporary ID based on the book title
    function generateTempId(title) {
        // Create a simple hash from the title
        let hash = 0;
        for (let i = 0; i < title.length; i++) {
            const char = title.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return `temp_${Math.abs(hash)}`;
    }

    // Initialize preview buttons when the page loads
    initializePreviewButtons();
});

// Filter blocks based on category
function filterByCategory(category) {
    const blocks = document.querySelectorAll('.block');
    blocks.forEach(block => {
        if (category === 'all' || block.getAttribute('data-category') === category) {
            block.style.display = 'block';
            setTimeout(() => {
                block.style.opacity = '1';
                block.style.transform = 'translateY(0)';
            }, 100);
        } else {
            block.style.opacity = '0';
            block.style.transform = 'translateY(20px)';
            setTimeout(() => {
                block.style.display = 'none';
            }, 500);
        }
    });
}

// Loader functionality
window.addEventListener('load', function() {
    console.log("Window loaded - hiding loader after delay");
    
    // Navigation scroll effect
    const navigation = document.querySelector('.navigation');
    
    function handleScroll() {
        if (window.scrollY > 50) {
            navigation.classList.add('scrolled');
        } else {
            navigation.classList.remove('scrolled');
        }
    }
    
    // Initial check
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Make sure loader is visible initially
    const loader = document.querySelector('.loader-container');
    if (loader) {
        loader.style.display = 'flex';
        loader.style.opacity = '1';
        loader.style.visibility = 'visible';
        
        // Add animation to book elements
        const bookElements = document.querySelectorAll('.book, .book-cover, .book-pages, .book-page, .divine-particle, .divine-ray, .mandala-bg');
        bookElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }
    
    // Add a slight delay before removing the loader
    setTimeout(function() {
        console.log("Hiding loader now");
        // Add loaded class to body to trigger CSS transition
        document.body.classList.add('loaded');
        
        // Remove the loader from the DOM after fade out
        setTimeout(function() {
            if (loader) {
                loader.style.display = 'none';
                console.log("Loader hidden completely");
            }
        }, 500);
    }, 2000); // Show loader for at least 2 seconds
});

// Back to top button functionality
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Scroll to top when button is clicked
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
