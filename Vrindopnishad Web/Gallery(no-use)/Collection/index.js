// Search functionality for Literary Hub

// Initialize DOM elements when document is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded - initializing search functionality");
    
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
    
    // Handle search input events for the search input
    const searchInput = document.querySelector('#searchInput');
    if (searchInput) {
        // Get the clear button next to this input
        const clearButton = searchInput.nextElementSibling;
        
        // Show/hide clear button based on input content
        searchInput.addEventListener('input', function() {
            if (clearButton) {
                clearButton.style.display = this.value ? 'flex' : 'none';
            }
        });
        
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                performSearch(this.value);
            }
        });
        
        // Store original placeholder
        const originalPlaceholder = searchInput.placeholder;
        
        // Clear on focus
        searchInput.addEventListener('focus', function() {
            this.placeholder = '';
        });
        
        // Restore on blur
        searchInput.addEventListener('blur', function() {
            this.placeholder = originalPlaceholder;
        });
    }
    
    // Show/hide top search bar on scroll
    const topSearchSection = document.querySelector('.search-section-top');
    if (topSearchSection) {
        // Make the top search always visible
        topSearchSection.style.transform = 'translateY(0)';
        topSearchSection.style.opacity = '1';
    }
    
    // Handle clear button clicks
    const clearButton = document.querySelector('.clear-search-btn');
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            // Get the input element
            const input = this.previousElementSibling;
            if (input) {
                // Clear the input
                input.value = '';
                // Hide the clear button
                this.style.display = 'none';
                // Focus the input
                input.focus();
                
                // Reset to show all books (or current category)
                const activeFilterBtn = document.querySelector('.filter-btn.active');
                if (activeFilterBtn) {
                    const category = activeFilterBtn.getAttribute('data-filter');
                    filterByCategory(category);
                } else {
                    // If no active filter, show all
                    const blocks = document.querySelectorAll('.block');
                    blocks.forEach(block => {
                        block.style.display = 'block';
                    });
                    
                    // Remove any no-results message
                    const existingNoResults = document.querySelector('.no-results-message');
                    if (existingNoResults) {
                        existingNoResults.remove();
                    }
                }
            }
        });
    }
    
    // Handle search button click
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            // Get the input element - it might be the previous sibling or the sibling before the clear button
            let input = this.previousElementSibling;
            if (input && input.classList.contains('clear-search-btn')) {
                input = input.previousElementSibling;
            }
            
            if (input && input.tagName === 'INPUT') {
                performSearch(input.value);
            }
        });
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
    
    // Search Toggle Functionality
    const searchToggle = document.getElementById('searchToggle');
    const mobileSearchContainer = document.getElementById('mobileSearchContainer');
    const backToMenuBtn = document.querySelector('.back-to-menu');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const mobileSearchButton = mobileSearchContainer.querySelector('.search-button');
    
    // Toggle search on click
    if (searchToggle) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check window width to determine which search to show
            if (window.innerWidth <= 992) {
                // Show mobile search
                mobileSearchContainer.classList.add('active');
            } else {
                // Show top search section
                topSearchSection.classList.toggle('active');
            }
        });
    }
    
    // Back to menu button
    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', function() {
            mobileSearchContainer.classList.remove('active');
        });
    }
    
    // Handle mobile search input
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
    
    // Handle mobile search button click
    if (mobileSearchButton) {
        mobileSearchButton.addEventListener('click', function() {
            performSearch(mobileSearchInput.value);
        });
    }
    
    // Close search on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (mobileSearchContainer.classList.contains('active')) {
                mobileSearchContainer.classList.remove('active');
            }
            
            if (topSearchSection.classList.contains('active')) {
                topSearchSection.classList.remove('active');
            }
        }
    });
    
    // Close search when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#mobileSearchContainer') && 
            !e.target.closest('#searchToggle') && 
            !e.target.closest('#topSearchSection')) {
            
            if (mobileSearchContainer.classList.contains('active')) {
                mobileSearchContainer.classList.remove('active');
            }
            
            if (topSearchSection && topSearchSection.classList.contains('active') && 
                !e.target.closest('.search-section-top')) {
                topSearchSection.classList.remove('active');
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            // Hide mobile search on larger screens
            if (mobileSearchContainer.classList.contains('active')) {
                mobileSearchContainer.classList.remove('active');
            }
        } else {
            // Hide top search on smaller screens
            if (topSearchSection && topSearchSection.classList.contains('active')) {
                topSearchSection.classList.remove('active');
            }
        }
    });

    // Initialize Movable Search Bar
    initializeMovableSearch();
});

// Function to initialize the movable search functionality
function initializeMovableSearch() {
    const movableSearchWrapper = document.getElementById('movableSearch');
    const expandSearchIcon = document.getElementById('expandSearchIcon');
    const collapseSearchIcon = document.getElementById('collapseSearchIcon');
    const searchInput = document.getElementById('movableSearchInput');
    
    if (!movableSearchWrapper || !expandSearchIcon || !collapseSearchIcon || !searchInput) {
        console.error('One or more search elements not found');
        return;
    }

    let isDragging = false;
    let hasMoved = false;
    let initialX, initialY, offsetX, offsetY;
    let inactivityTimer;
    const inactivityTimeout = 2000; // 2 seconds
    const moveThreshold = 5; // Minimum pixels to consider a drag
    
    // Velocity tracking for inertia effect
    let velocity = { x: 0, y: 0 };
    let lastPosition = { x: 0, y: 0 };
    let lastTimestamp = 0;
    
    // Magnetic snap distance threshold
    const magneticThreshold = 40;
    
    // Function to apply magnetic snap effect
    const magneticSnap = (x, y) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const elementWidth = movableSearchWrapper.offsetWidth;
        const elementHeight = movableSearchWrapper.offsetHeight;
        
        // Distance from edges
        const distanceFromLeft = x;
        const distanceFromRight = viewportWidth - (x + elementWidth);
        const distanceFromTop = y;
        const distanceFromBottom = viewportHeight - (y + elementHeight);
        
        // Find the closest edge
        const distances = [
            { edge: 'left', distance: distanceFromLeft },
            { edge: 'right', distance: distanceFromRight },
            { edge: 'top', distance: distanceFromTop },
            { edge: 'bottom', distance: distanceFromBottom }
        ];
        
        // Sort by distance
        distances.sort((a, b) => a.distance - b.distance);
        
        // If closest edge is within threshold, snap to it
        if (distances[0].distance < magneticThreshold) {
            switch (distances[0].edge) {
                case 'left':
                    return { x: 0, y };
                case 'right':
                    return { x: viewportWidth - elementWidth, y };
                case 'top':
                    return { x, y: 0 };
                case 'bottom':
                    return { x, y: viewportHeight - elementHeight };
            }
        }
        
        return { x, y };
    };
    
    // Function to snap to nearest side
    const snapToNearestSide = () => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const elementWidth = movableSearchWrapper.offsetWidth;
        const elementHeight = movableSearchWrapper.offsetHeight;
        
        // Get current position
        const rect = movableSearchWrapper.getBoundingClientRect();
        const x = rect.left;
        const y = rect.top;
        
        // Calculate distances to each edge
        const distanceToLeft = x;
        const distanceToRight = viewportWidth - (x + elementWidth);
        const distanceToTop = y;
        const distanceToBottom = viewportHeight - (y + elementHeight);
        
        // Find the closest edge
        const minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);
        
        // Remove any existing transition classes
        movableSearchWrapper.classList.remove('auto-closing');
        
        // Add snapping class for animation
        movableSearchWrapper.classList.add('snapping');
        
        // Snap to the closest edge
        if (minDistance === distanceToLeft) {
            movableSearchWrapper.style.left = '20px';
            movableSearchWrapper.style.top = Math.max(80, Math.min(y, viewportHeight - elementHeight - 20)) + 'px';
            movableSearchWrapper.style.right = 'auto';
        } else if (minDistance === distanceToRight) {
            movableSearchWrapper.style.right = '20px';
            movableSearchWrapper.style.top = Math.max(80, Math.min(y, viewportHeight - elementHeight - 20)) + 'px';
            movableSearchWrapper.style.left = 'auto';
        } else if (minDistance === distanceToTop) {
            movableSearchWrapper.style.top = '80px';
            movableSearchWrapper.style.left = Math.max(20, Math.min(x, viewportWidth - elementWidth - 20)) + 'px';
            movableSearchWrapper.style.right = 'auto';
        } else {
            movableSearchWrapper.style.top = (viewportHeight - elementHeight - 20) + 'px';
            movableSearchWrapper.style.left = Math.max(20, Math.min(x, viewportWidth - elementWidth - 20)) + 'px';
            movableSearchWrapper.style.right = 'auto';
        }
        
        // Remove the snapping class after animation completes
        setTimeout(() => {
            movableSearchWrapper.classList.remove('snapping');
        }, 700);
    };
    
    // Function to reset inactivity timer
    const resetInactivityTimer = () => {
        clearTimeout(inactivityTimer);
        
        // Only set timer if search is expanded
        if (movableSearchWrapper.classList.contains('expanded')) {
            inactivityTimer = setTimeout(() => {
                closeSearchBar();
                // After closing, snap to nearest side
                setTimeout(snapToNearestSide, 500);
            }, inactivityTimeout);
        }
    };
    
    // Function to close search bar
    const closeSearchBar = () => {
        // Only proceed if it's currently expanded
        if (!movableSearchWrapper.classList.contains('expanded')) return;
        
        // Add auto-closing class for animation
        movableSearchWrapper.classList.add('auto-closing');
        
        // Hide input and close icon
        searchInput.style.display = 'none';
        collapseSearchIcon.style.display = 'none';
        
        // Show search icon
        expandSearchIcon.style.display = 'flex';
        
        // Remove expanded class and add collapsed class
        movableSearchWrapper.classList.remove('expanded');
        movableSearchWrapper.classList.add('collapsed');
        
        // Clear input value
        searchInput.value = '';
        
        // Remove auto-closing class after animation completes
        setTimeout(() => {
            movableSearchWrapper.classList.remove('auto-closing');
        }, 500);
    };
    
    // Function to apply inertia effect
    const applyInertia = () => {
        if (Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1) return;
        
        const rect = movableSearchWrapper.getBoundingClientRect();
        let x = rect.left + velocity.x;
        let y = rect.top + velocity.y;
        
        // Apply magnetic snap if close to edges
        const snappedPosition = magneticSnap(x, y);
        x = snappedPosition.x;
        y = snappedPosition.y;
        
        // Keep within viewport bounds
        const maxX = window.innerWidth - movableSearchWrapper.offsetWidth;
        const maxY = window.innerHeight - movableSearchWrapper.offsetHeight;
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));
        
        // Apply position
        movableSearchWrapper.style.left = x + 'px';
        movableSearchWrapper.style.top = y + 'px';
        
        // Reduce velocity for next frame (friction)
        velocity.x *= 0.9;
        velocity.y *= 0.9;
        
        // Continue inertia if velocity is still significant
        if (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1) {
            requestAnimationFrame(applyInertia);
        } else {
            // When inertia stops, reset inactivity timer
            resetInactivityTimer();
        }
    };
    
    // Expand search bar on click
    expandSearchIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Only proceed if it's currently collapsed
        if (!movableSearchWrapper.classList.contains('collapsed')) return;
        
        // Hide search icon
        expandSearchIcon.style.display = 'none';
        
        // Show input and close icon
        searchInput.style.display = 'block';
        collapseSearchIcon.style.display = 'flex';
        
        // Remove collapsed class and add expanded class
        movableSearchWrapper.classList.remove('collapsed');
        movableSearchWrapper.classList.add('expanded');
        
        // Focus the input
        searchInput.focus();
        
        // Reset inactivity timer
        resetInactivityTimer();
    });
    
    // Collapse search bar on close icon click
    collapseSearchIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        closeSearchBar();
    });
    
    // Prevent search bar from collapsing when clicking on the input
    searchInput.addEventListener('click', function(e) {
        e.stopPropagation();
        resetInactivityTimer();
    });
    
    // Handle search action on Enter key
    searchInput.addEventListener('keyup', function(e) {
        resetInactivityTimer();
        
        if (e.key === 'Enter') {
            // Perform search action
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                console.log('Searching for:', searchTerm);
                // Add your search logic here
                
                // Visual feedback for search action
                movableSearchWrapper.classList.add('searching');
                setTimeout(() => {
                    movableSearchWrapper.classList.remove('searching');
                    // Close search bar after search
                    closeSearchBar();
                }, 500);
            }
        }
    });
    
    // Make search bar draggable
    movableSearchWrapper.addEventListener('mousedown', function(e) {
        // Only allow dragging from the search wrapper itself, not from input
        if (e.target === searchInput) return;
        
        isDragging = true;
        hasMoved = false;
        
        // Add grabbing class
        movableSearchWrapper.classList.add('grabbing');
        
        // Get initial position
        const rect = movableSearchWrapper.getBoundingClientRect();
        initialX = e.clientX;
        initialY = e.clientY;
        offsetX = rect.left - initialX;
        offsetY = rect.top - initialY;
        
        // Reset velocity tracking
        lastPosition = { x: rect.left, y: rect.top };
        lastTimestamp = Date.now();
        velocity = { x: 0, y: 0 };
        
        // Reset inactivity timer
        resetInactivityTimer();
        
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            // Calculate new position
            const x = e.clientX + offsetX;
            const y = e.clientY + offsetY;
            
            // Track velocity for inertia effect
            const now = Date.now();
            const elapsed = now - lastTimestamp;
            
            if (elapsed > 0) {
                velocity.x = (x - lastPosition.x) / elapsed * 16; // Scale to roughly match 60fps
                velocity.y = (y - lastPosition.y) / elapsed * 16;
                
                lastPosition = { x, y };
                lastTimestamp = now;
            }
            
            // Check if moved beyond threshold
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
                    movableSearchWrapper.style.transform = '';
                    movableSearchWrapper.style.transition = '';
                }, 300);
            } else {
                // If just clicked (not dragged), toggle expanded/collapsed state
                if (movableSearchWrapper.classList.contains('collapsed')) {
                    // Expand
                    expandSearchIcon.click();
                } else {
                    // Collapse
                    collapseSearchIcon.click();
                }
            }
        }
    });
    
    // Double click to reset position
    movableSearchWrapper.addEventListener('dblclick', function(e) {
        // Prevent default behavior
        e.preventDefault();
        
        // Reset position to top right
        movableSearchWrapper.style.top = '100px';
        movableSearchWrapper.style.right = '20px';
        movableSearchWrapper.style.left = 'auto';
        
        // Add bounce effect
        movableSearchWrapper.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        // Remove transition after animation completes
        setTimeout(() => {
            movableSearchWrapper.style.transition = '';
        }, 500);
    });
    
    // Reset inactivity timer on window scroll and resize
    window.addEventListener('scroll', resetInactivityTimer);
    window.addEventListener('resize', resetInactivityTimer);
    
    // Initialize position if not already set
    if (!movableSearchWrapper.style.top && !movableSearchWrapper.style.right) {
        movableSearchWrapper.style.top = '100px';
        movableSearchWrapper.style.right = '20px';
    }
}

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

// Search functionality
function performSearch(query) {
    if (!query || !query.trim()) return;
    
    // Show loading spinner
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.classList.add('loading');
    }
    
    // Simulate search delay
    setTimeout(() => {
        // Hide loading spinner
        if (searchBar) {
            searchBar.classList.remove('loading');
        }
        
        // Filter blocks based on search query
        const blocks = document.querySelectorAll('.block');
        let foundResults = false;
        
        blocks.forEach(block => {
            const title = block.querySelector('h4').textContent.toLowerCase();
            const description = block.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(block.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const searchTerms = query.toLowerCase().split(' ');
            const matchesSearch = searchTerms.some(term => 
                title.includes(term) || 
                description.includes(term) || 
                tags.some(tag => tag.includes(term))
            );
            
            if (matchesSearch) {
                block.style.display = 'block';
                block.classList.add('search-highlight');
                setTimeout(() => {
                    block.classList.remove('search-highlight');
                }, 2000);
                foundResults = true;
            } else {
                block.style.display = 'none';
            }
        });
        
        // Show message if no results found
        const noResultsMessage = document.querySelector('.no-results-message');
        if (noResultsMessage) {
            noResultsMessage.remove();
        }
        
        if (!foundResults) {
            const blocksContainer = document.querySelector('.blocks-container');
            const message = document.createElement('div');
            message.className = 'no-results-message';
            message.innerHTML = `<i class="fas fa-search"></i> कोई परिणाम नहीं मिला: "${query}"<br>कृपया अन्य खोज शब्द आज़माएं।`;
            blocksContainer.appendChild(message);
        }
        
        // Show a message that this is just a demo
        const searchHint = document.querySelector('.search-hint');
        if (searchHint) {
            searchHint.textContent = `आपकी खोज "${query}" के लिए परिणाम दिखाए जा रहे हैं।`;
            searchHint.style.background = 'rgba(67, 97, 238, 0.2)';
            setTimeout(() => {
                searchHint.style.background = 'rgba(67, 97, 238, 0.1)';
            }, 2000);
        }
    }, 1000);
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

// Collection Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log("Collection page initialized");
    
    // Initialize DOM elements
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.querySelector('.main-menu');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const collectionCards = document.querySelectorAll('.collection-card');
    const viewCollectionButtons = document.querySelectorAll('.view-collection-btn');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.querySelector('.clear-search-btn');
    const backToTopButton = document.querySelector('.back-to-top');
    const settingsButton = document.getElementById('settingsButton');
    const settingsModal = document.getElementById('settingsModal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const fontButtons = document.querySelectorAll('.font-btn');
    const saveSettingsButton = document.querySelector('.save-settings');
    const animationSpeedSlider = document.getElementById('animationSpeed');
    const speedValue = document.querySelector('.speed-value');
    const movableSearch = document.getElementById('movableSearch');
    const expandSearchIcon = document.getElementById('expandSearchIcon');
    const collapseSearchIcon = document.getElementById('collapseSearchIcon');
    const movableSearchInput = document.getElementById('movableSearchInput');
    
    // Page loader animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Animate loader elements
        const book = document.querySelector('.book');
        const bookCover = document.querySelector('.book-cover');
        const bookPages = document.querySelectorAll('.book-page');
        const divineParticles = document.querySelectorAll('.divine-particle');
        const divineMessage = document.querySelector('.divine-message');
        const divineRays = document.querySelectorAll('.divine-ray');
        const mandala = document.querySelector('.mandala-bg');
        
        if (book) book.style.animationPlayState = 'running';
        if (bookCover) bookCover.style.animationPlayState = 'running';
        
        bookPages.forEach(page => {
            page.style.animationPlayState = 'running';
        });
        
        divineParticles.forEach(particle => {
            particle.style.animationPlayState = 'running';
        });
        
        if (divineMessage) divineMessage.style.animationPlayState = 'running';
        
        divineRays.forEach(ray => {
            ray.style.animationPlayState = 'running';
        });
        
        if (mandala) mandala.style.animationPlayState = 'running';
        
        setTimeout(() => {
            document.querySelector('.loader-container').style.opacity = '0';
            document.querySelector('.loader-container').style.visibility = 'hidden';
        }, 3000);
    });
    
    // Collection filtering
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get the filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Filter the collection cards
                filterCollectionsByCategory(filterValue);
            });
        });
    }
    
    // Filter collections by category
    function filterCollectionsByCategory(category) {
        collectionCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
                
                // Add fade-in animation
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                // Hide after fadeout animation
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const searchQuery = this.value.toLowerCase();
            performSearch(searchQuery);
        });
    }
    
    // Clear search
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            performSearch('');
            this.style.display = 'none';
        });
    }
    
    // Perform search on collections
    function performSearch(query) {
        if (query.length > 0) {
            clearSearchBtn.style.display = 'block';
        } else {
            clearSearchBtn.style.display = 'none';
        }
        
        collectionCards.forEach(card => {
            const cardTitle = card.querySelector('h4').textContent.toLowerCase();
            const cardDesc = card.querySelector('p').textContent.toLowerCase();
            const cardCategory = card.getAttribute('data-category').toLowerCase();
            
            if (cardTitle.includes(query) || cardDesc.includes(query) || cardCategory.includes(query)) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Collection Modal Functionality
    if (viewCollectionButtons.length > 0) {
        const collectionPreviewModal = document.getElementById('collectionPreviewModal');
        
        viewCollectionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const card = this.closest('.collection-card');
                const title = card.querySelector('h4').textContent;
                const description = card.querySelector('p').textContent;
                const category = card.getAttribute('data-category');
                const bookCount = card.querySelector('.collection-meta span:first-child').textContent;
                const rating = card.querySelector('.collection-meta span:last-child').textContent;
                
                // Update modal content
                document.querySelector('.collection-title').textContent = title;
                document.querySelector('.collection-description p').textContent = description;
                document.querySelector('.collection-stats span:first-child').innerHTML = `<i class="fas fa-book"></i> ${bookCount}`;
                document.querySelector('.collection-stats span:nth-child(2)').innerHTML = `<i class="fas fa-star"></i> ${rating} Average Rating`;
                
                // Show modal
                collectionPreviewModal.style.display = 'flex';
                setTimeout(() => {
                    collectionPreviewModal.style.opacity = '1';
                }, 10);
            });
        });
    }
    
    // Close modal
    if (closeModalButtons.length > 0) {
        closeModalButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            });
        });
    }
    
    // Close modal when clicking outside of content
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
        });
    });
    
    // Back to top button
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Menu toggle functionality
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', function() {
            mainMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Update ARIA attributes
            const isExpanded = mainMenu.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.menu-toggle') && !e.target.closest('.main-menu')) {
                mainMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Settings modal
    if (settingsButton && settingsModal) {
        settingsButton.addEventListener('click', function(e) {
            e.preventDefault();
            settingsModal.style.display = 'flex';
            setTimeout(() => {
                settingsModal.style.opacity = '1';
            }, 10);
        });
    }
    
    // Theme settings
    if (themeButtons.length > 0) {
        themeButtons.forEach(button => {
            button.addEventListener('click', function() {
                themeButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const theme = this.getAttribute('data-theme');
                if (theme === 'light-mode') {
                    document.body.classList.add('light-mode');
                } else {
                    document.body.classList.remove('light-mode');
                }
            });
        });
    }
    
    // Font size settings
    if (fontButtons.length > 0) {
        fontButtons.forEach(button => {
            button.addEventListener('click', function() {
                fontButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const fontSize = this.getAttribute('data-font');
                document.documentElement.style.setProperty('--base-font-size', 
                    fontSize === 'small' ? '14px' : 
                    fontSize === 'large' ? '18px' : '16px'
                );
            });
        });
    }
    
    // Animation speed
    if (animationSpeedSlider && speedValue) {
        animationSpeedSlider.addEventListener('input', function() {
            const speed = this.value;
            speedValue.textContent = `${speed}x`;
            document.documentElement.style.setProperty('--animation-speed', speed);
        });
    }
    
    // Save settings
    if (saveSettingsButton) {
        saveSettingsButton.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
            
            // Save settings to localStorage
            const theme = document.querySelector('.theme-btn.active').getAttribute('data-theme');
            const fontSize = document.querySelector('.font-btn.active').getAttribute('data-font');
            const animationSpeed = animationSpeedSlider.value;
            
            localStorage.setItem('theme', theme);
            localStorage.setItem('fontSize', fontSize);
            localStorage.setItem('animationSpeed', animationSpeed);
            
            // Show confirmation
            showNotification('Settings saved successfully!');
        });
    }
    
    // Load saved settings
    function loadSavedSettings() {
        const savedTheme = localStorage.getItem('theme');
        const savedFontSize = localStorage.getItem('fontSize');
        const savedAnimationSpeed = localStorage.getItem('animationSpeed');
        
        if (savedTheme) {
            document.querySelectorAll('.theme-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-theme') === savedTheme) {
                    btn.classList.add('active');
                }
            });
            
            if (savedTheme === 'light-mode') {
                document.body.classList.add('light-mode');
            }
        }
        
        if (savedFontSize) {
            document.querySelectorAll('.font-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-font') === savedFontSize) {
                    btn.classList.add('active');
                }
            });
            
            document.documentElement.style.setProperty('--base-font-size', 
                savedFontSize === 'small' ? '14px' : 
                savedFontSize === 'large' ? '18px' : '16px'
            );
        }
        
        if (savedAnimationSpeed) {
            animationSpeedSlider.value = savedAnimationSpeed;
            speedValue.textContent = `${savedAnimationSpeed}x`;
            document.documentElement.style.setProperty('--animation-speed', savedAnimationSpeed);
        }
    }
    
    // Call to load saved settings
    loadSavedSettings();
    
    // Notification function
    function showNotification(message, type = 'success') {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Set notification content and class
        notification.textContent = message;
        notification.className = `notification ${type}`;
        
        // Show notification
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
        }, 3000);
    }
    
    // Movable search functionality
    if (movableSearch && expandSearchIcon && collapseSearchIcon) {
        // Variables for drag functionality
        let isDragging = false;
        let dragOffsetX, dragOffsetY;
        
        // Allow dragging the search bar
        movableSearch.addEventListener('mousedown', function(e) {
            if (e.target.closest('.search-icon, .close-icon')) return;
            
            isDragging = true;
            dragOffsetX = e.clientX - movableSearch.getBoundingClientRect().left;
            dragOffsetY = e.clientY - movableSearch.getBoundingClientRect().top;
            
            movableSearch.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const x = e.clientX - dragOffsetX;
                const y = e.clientY - dragOffsetY;
                
                // Keep search bar within viewport
                const maxX = window.innerWidth - movableSearch.offsetWidth;
                const maxY = window.innerHeight - movableSearch.offsetHeight;
                
                movableSearch.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
                movableSearch.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
                movableSearch.style.right = 'auto'; // Clear the right property when dragging
            }
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                movableSearch.style.cursor = 'grab';
            }
        });
        
        // Expand search bar
        expandSearchIcon.addEventListener('click', function() {
            if (movableSearch.classList.contains('collapsed')) {
                expandSearchBar();
            }
        });
        
        // Collapse search bar
        collapseSearchIcon.addEventListener('click', function() {
            if (!movableSearch.classList.contains('collapsed')) {
                collapseSearchBar();
            }
        });
        
        // Expand search bar function
        function expandSearchBar() {
            movableSearch.classList.remove('collapsed');
            movableSearchInput.style.display = 'block';
            collapseSearchIcon.style.display = 'flex';
            movableSearchInput.focus();
            
            // Animate width expansion
            movableSearch.style.width = '300px';
            
            // Reset input value
            movableSearchInput.value = '';
        }
        
        // Collapse search bar function
        function collapseSearchBar() {
            movableSearch.style.width = '';
            
            setTimeout(() => {
                movableSearchInput.style.display = 'none';
                collapseSearchIcon.style.display = 'none';
                movableSearch.classList.add('collapsed');
            }, 300);
        }
        
        // Search functionality
        movableSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                performSearch(this.value.trim());
                
                // Show search animation
                const searchButton = expandSearchIcon.querySelector('i');
                searchButton.classList.add('searching');
                
                setTimeout(() => {
                    searchButton.classList.remove('searching');
                    // Close search bar after search
                    collapseSearchBar();
                }, 500);
            }
        });
        
        // Close search on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !movableSearch.classList.contains('collapsed')) {
                collapseSearchBar();
            }
        });
    }
    
    // Function to enhance blocks with 3D effect
    function enhanceBlocksWith3DEffect() {
        const blocks = document.querySelectorAll('.collection-card');
        
        blocks.forEach(block => {
            block.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element
                const y = e.clientY - rect.top; // y position within the element
                
                // Calculate rotation based on mouse position
                // When mouse is on left edge, rotateY will be positive (rotate right)
                // When mouse is on right edge, rotateY will be negative (rotate left)
                // Same logic applies for rotateX, but for top/bottom edges
                const rotateY = ((x / rect.width) - 0.5) * 10; // -5 to 5 degrees
                const rotateX = ((y / rect.height) - 0.5) * -10; // 5 to -5 degrees
                
                // Apply the transform
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
                
                // Add a subtle shadow for more depth
                this.style.boxShadow = `0 15px 35px rgba(0, 0, 0, 0.3), ${rotateY/2}px ${rotateX/2}px 15px rgba(0, 0, 0, 0.15)`;
            });
            
            // Reset the transform when mouse leaves
            block.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });
    }
    
    // Call to enhance blocks with 3D effect
    enhanceBlocksWith3DEffect();
    
    // Load featured collection books with animation
    function animateFeaturedBooks() {
        const miniBooks = document.querySelectorAll('.mini-book');
        
        miniBooks.forEach((book, index) => {
            setTimeout(() => {
                book.classList.add('animated');
            }, 100 * index);
        });
    }
    
    // Call to animate featured books
    setTimeout(animateFeaturedBooks, 500);
});
