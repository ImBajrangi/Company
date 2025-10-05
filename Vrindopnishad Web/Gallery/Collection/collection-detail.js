/**
 * Initialize page loading and animations
 */
function initializePageLoading() {
    console.log('Initializing page loading and animations');
    
    // Handle loader visibility with jQuery for better cross-browser support
    $(document).ready(function() {
        // Set a timeout to ensure animations have time to run
        setTimeout(function() {
            $('.se-pre-con').fadeOut('slow');
            $('body').addClass('loaded');
            console.log('Loader hidden after timeout');
        }, 3000);
    });
    
    // Fallback for loader if document ready event doesn't work properly
    setTimeout(function() {
        if (!$('body').hasClass('loaded')) {
            $('.se-pre-con').fadeOut('slow');
            $('body').addClass('loaded');
            console.log('Loader fallback triggered');
        }
    }, 5000);
}

/**
 * Initialize navigation interactivity
 */
function initializeNavigationInteractivity() {
    console.log('Initializing navigation interactivity');
    
    const navItems = document.querySelectorAll('.nav-item a, .nav-item button');
    
    navItems.forEach(item => {
        // Add click animation
        item.addEventListener('click', function(e) {
            const icon = this.querySelector('i');
            if (icon) {
                // Remove animation if it exists
                icon.classList.remove('icon-pulse');
                
                // Trigger reflow to restart animation
                void icon.offsetWidth;
                
                // Add animation class
                icon.classList.add('icon-pulse');
            }
            
            // If this is a navigation link (not theme toggle)
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                
                // Remove current from all nav items
                navItems.forEach(navItem => {
                    if (navItem.hasAttribute('aria-current')) {
                        navItem.removeAttribute('aria-current');
                    }
                });
                
                // Set current on clicked item
                this.setAttribute('aria-current', 'page');
                
                // Smooth scroll to target if it exists
                if (targetId !== '#') {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            }
        });
    });
    
    // Handle theme toggle button specially
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon) {
                // Add special animation for theme toggle
                icon.classList.add('icon-pulse');
                
                // Remove animation after it completes
                setTimeout(() => {
                    icon.classList.remove('icon-pulse');
                }, 500);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Initialize components
    initializePageLoading();
    initializeNavigationInteractivity();
    initializeNavigation();
    initializeNormalSearch();
    initializeBookGrid();
    initializeQuickViewModal();
    initializeBackToTopButton();
    initializeThemeToggle();
    initializeAdvancedFilters();
    initializeLazyLoading();
    initializeReadingProgressTracker();
    initializeCollectionSharing();
    initializeAccessibility();
    
    // Add smooth fade-in animation to the page
    document.body.classList.add('page-loaded');
    
    // Handle preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    }
});

/**
 * Theme toggle functionality
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');
    const themeLabel = themeToggle.querySelector('.theme-label');
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme based on saved preference or system preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        htmlElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        themeLabel.textContent = 'Light Mode';
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update HTML attribute
        htmlElement.setAttribute('data-theme', newTheme);
        
        // Update icon and label
        if (newTheme === 'dark') {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            themeLabel.textContent = 'Light Mode';
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            themeLabel.textContent = 'Dark Mode';
        }
        
        // Save preference to localStorage
        localStorage.setItem('theme', newTheme);
        
        // Show notification
        showNotification(`Switched to ${newTheme} mode`, 'info');
        
        // Apply smooth transition to all elements
        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    });
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            htmlElement.setAttribute('data-theme', newTheme);
            
            // Update icon and label
            if (newTheme === 'dark') {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
                themeLabel.textContent = 'Light Mode';
            } else {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
                themeLabel.textContent = 'Dark Mode';
            }
        }
    });
}

/**
 * Navigation functionality
 */
function initializeNavigation() {
    console.log('Initializing navigation');
    
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', 
                menuToggle.classList.contains('active') ? 'true' : 'false');
        });
    }
    
    // Add animation effects to navigation items
    const navItems = document.querySelectorAll('.nav-item');
    
    // Add staggered entrance animation
    navItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('animate-nav-item');
    });
    
    // Add hover effects for icons
    navItems.forEach(item => {
        const icon = item.querySelector('i');
        const link = item.querySelector('a') || item.querySelector('button');
        
        if (icon && link) {
            link.addEventListener('mouseenter', () => {
                icon.classList.add('icon-pulse');
            });
            
            link.addEventListener('mouseleave', () => {
                icon.classList.remove('icon-pulse');
                // Remove the class after animation completes
                setTimeout(() => {
                    icon.classList.remove('icon-pulse');
                }, 300);
            });
        }
    });
    
    // Handle active state for navigation items
    const currentPath = window.location.pathname;
    const navLinks2 = document.querySelectorAll('.nav-item a');
    
    navLinks2.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#' || currentPath.includes(href)) {
            link.setAttribute('aria-current', 'page');
        }
    });
}

/**
 * Book grid functionality
 */
function initializeBookGrid() {
    const bookCards = document.querySelectorAll('.book-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.querySelector('.search-bar input');
    const sortSelect = document.querySelector('.sort');
    
    if (bookCards.length === 0) return;
    
    // Add hover effect to book cards
    bookCards.forEach(card => {
        // 3D tilt effect on hover
        card.addEventListener('mousemove', function(e) {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;
            
            // Calculate rotation based on mouse position
            const rotateY = mouseX * 0.05;
            const rotateX = -mouseY * 0.05;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        // Reset transform on mouse leave
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
    
    // Filter functionality
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                // Filter books
                bookCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchText = this.value.toLowerCase().trim();
            
            if (searchText === '') {
                // If search is cleared, reset to current filter
                const activeFilter = document.querySelector('.filter-btn.active');
                if (activeFilter) {
                    activeFilter.click();
                } else {
                    bookCards.forEach(card => {
                        card.style.display = 'block';
                    });
                }
                return;
            }
            
            bookCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const author = card.querySelector('h4').textContent.toLowerCase();
                const tags = Array.from(card.querySelectorAll('.book-tag')).map(tag => tag.textContent.toLowerCase());
                
                const isMatch = title.includes(searchText) || 
                               author.includes(searchText) || 
                               tags.some(tag => tag.includes(searchText));
                
                if (isMatch) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const booksGrid = document.querySelector('.books-grid');
            
            if (!booksGrid) return;
            
            const bookCardsArray = Array.from(bookCards);
            
            // Sort books based on selected option
            bookCardsArray.sort((a, b) => {
                if (sortValue === 'rating') {
                    const ratingA = parseFloat(a.querySelector('.rating-value').textContent);
                    const ratingB = parseFloat(b.querySelector('.rating-value').textContent);
                    return ratingB - ratingA; // Highest first
                } else if (sortValue === 'newest') {
                    // For demo purposes, we'll use a data attribute
                    // In a real app, you'd have actual date data
                    const dateA = a.getAttribute('data-date') || '0';
                    const dateB = b.getAttribute('data-date') || '0';
                    return dateB.localeCompare(dateA); // Newest first
                } else if (sortValue === 'popular') {
                    // For demo purposes, we'll use a data attribute
                    // In a real app, you'd have actual popularity data
                    const popularityA = parseInt(a.getAttribute('data-popularity') || '0');
                    const popularityB = parseInt(b.getAttribute('data-popularity') || '0');
                    return popularityB - popularityA; // Most popular first
                }
                
                return 0;
            });
            
            // Reorder DOM elements
            bookCardsArray.forEach(card => {
                booksGrid.appendChild(card);
            });
        });
    }
    
    // Pagination functionality
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    if (paginationButtons.length > 0) {
        paginationButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                paginationButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // In a real app, you'd load the appropriate page of books here
                // For demo purposes, we'll just show a notification
                showNotification(`Navigated to page ${this.textContent}`, 'info');
            });
        });
        
        // Next page button
        const nextButton = document.querySelector('.pagination-next');
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                const activePage = document.querySelector('.pagination-btn.active');
                if (activePage && activePage.nextElementSibling && 
                    activePage.nextElementSibling.classList.contains('pagination-btn')) {
                    activePage.nextElementSibling.click();
                }
            });
        }
    }

    // Add lazy loading for images
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    // ...existing code...

    function createBookCard(book) {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.setAttribute('role', 'listitem');
        bookCard.setAttribute('data-id', book.id);
        bookCard.setAttribute('data-genre', book.genre.toLowerCase());
        
        // Add animation delay for staggered appearance
        const delay = Math.random() * 0.5;
        bookCard.style.animationDelay = `${delay}s`;
        
        // Create book cover
        const bookCover = document.createElement('div');
        bookCover.className = 'book-cover';
        
        const img = document.createElement('img');
        img.src = book.cover;
        img.alt = `Cover of ${book.title}`;
        img.loading = 'lazy';
        img.className = 'lazy-image';
        
        bookCover.appendChild(img);
        bookCard.appendChild(bookCover);
        
        // Create book info
        const bookInfo = document.createElement('div');
        bookInfo.className = 'book-info';
        
        const title = document.createElement('h3');
        title.textContent = book.title;
        
        const author = document.createElement('h4');
        author.textContent = book.author;
        
        const bookMeta = document.createElement('div');
        bookMeta.className = 'book-meta';
        
        const rating = document.createElement('div');
        rating.className = 'book-rating';
        rating.innerHTML = `<i class="fas fa-star"></i> <span>${book.rating}</span>`;
        
        bookMeta.appendChild(rating);
        
        // Add tags if available
        if (book.tags && book.tags.length > 0) {
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'book-tags';
            
            book.tags.slice(0, 2).forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'book-tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });
            
            bookInfo.appendChild(tagsContainer);
        }
        
        bookInfo.appendChild(title);
        bookInfo.appendChild(author);
        bookInfo.appendChild(bookMeta);
        
        bookCard.appendChild(bookInfo);
        
        // Add click event to show book details
        bookCard.addEventListener('click', () => {
            showBookDetails(book.id);
        });
        
        return bookCard;
    }
}

/**
 * Quick view modal functionality
 */
function initializeQuickViewModal() {
    const modal = document.getElementById('quickViewModal');
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    
    if (!modal || quickViewButtons.length === 0) return;
    
    const closeButton = modal.querySelector('.close');
    
    // Sample book data (in a real app, this would come from a database)
    const bookData = {
        1: {
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            cover: '../image/Books/book1.jpg',
            description: 'A classic novel set in the roaring twenties, The Great Gatsby explores themes of decadence, idealism, social upheaval, and the American Dream through the tragic story of Jay Gatsby and his pursuit of Daisy Buchanan.',
            rating: 4.5,
            publishedDate: '1925',
            pageCount: '180 pages',
            genre: 'Classic Fiction'
        },
        2: {
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            cover: '../image/Books/book2.jpg',
            description: 'Set in the American South during the 1930s, this beloved classic explores racial injustice and moral growth through the eyes of young Scout Finch as her father, Atticus, defends a Black man falsely accused of a crime.',
            rating: 5.0,
            publishedDate: '1960',
            pageCount: '281 pages',
            genre: 'Classic American Literature'
        },
        3: {
            title: 'Sapiens: A Brief History of Humankind',
            author: 'Yuval Noah Harari',
            cover: '../image/Books/book3.jpg',
            description: 'A groundbreaking narrative of humanity\'s creation and evolution that explores how biology and history have defined us and enhanced our understanding of what it means to be "human."',
            rating: 4.7,
            publishedDate: '2011',
            pageCount: '443 pages',
            genre: 'Non-Fiction, History'
        },
        4: {
            title: '1984',
            author: 'George Orwell',
            cover: '../image/Books/book4.jpg',
            description: 'A dystopian social science fiction novel that examines the consequences of totalitarianism, mass surveillance, and repressive regimentation of people and behaviors within society.',
            rating: 4.9,
            publishedDate: '1949',
            pageCount: '328 pages',
            genre: 'Dystopian Fiction'
        },
        5: {
            title: 'Milk and Honey',
            author: 'Rupi Kaur',
            cover: '../image/Books/book5.jpg',
            description: 'A collection of poetry and prose about survival, the experience of violence, abuse, love, loss, and femininity. The book is divided into four chapters, with each chapter serving a different purpose.',
            rating: 4.0,
            publishedDate: '2014',
            pageCount: '208 pages',
            genre: 'Poetry'
        },
        6: {
            title: 'A Brief History of Time',
            author: 'Stephen Hawking',
            cover: '../image/Books/book6.jpg',
            description: 'A landmark volume in science writing that explores the nature of the universe and our place in it, from the Big Bang to black holes, in a way that is accessible to readers who are not familiar with scientific theories.',
            rating: 4.6,
            publishedDate: '1988',
            pageCount: '212 pages',
            genre: 'Science, Non-Fiction'
        }
    };
    
    // Open modal when clicking quick view button
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const bookId = this.getAttribute('data-book-id');
            const book = bookData[bookId];
            
            if (book) {
                // Populate modal with book data
                document.getElementById('modalBookCover').src = book.cover;
                document.getElementById('modalBookTitle').textContent = book.title;
                document.getElementById('modalBookAuthor').textContent = book.author;
                document.getElementById('modalBookDescription').textContent = book.description;
                document.getElementById('modalRating').textContent = book.rating;
                document.getElementById('modalPublishedDate').textContent = book.publishedDate;
                document.getElementById('modalPageCount').textContent = book.pageCount;
                document.getElementById('modalGenre').textContent = book.genre;
                
                // Generate star rating
                const starsContainer = document.getElementById('modalStars');
                starsContainer.innerHTML = generateStarRating(book.rating);
                
                // Show modal with fade-in effect
                modal.style.display = 'flex';
                setTimeout(() => {
                    modal.classList.add('active');
                }, 10);
                
                // Prevent body scrolling
                document.body.classList.add('modal-open');
            }
        });
    });
    
    // Close modal when clicking close button
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        
        // Re-enable body scrolling
        document.body.classList.remove('modal-open');
    }
    
    // Generate star rating HTML
    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        
        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (halfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }
}

/**
 * Back to top button functionality
 */
function initializeBackToTopButton() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (!backToTopButton) {
        console.error('Back to top button not found');
        return;
    }
    
    // Show button when user scrolls down 300px from the top
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Enhanced notification system with improved timing, interaction, and device compatibility
 * @param {string} message - The notification message
 * @param {string} type - Notification type: 'success', 'error', 'warning', 'info'
 * @param {Object} options - Additional options for the notification
 * @param {number} options.duration - Duration in ms (default: 5000, 0 for persistent)
 * @param {boolean} options.dismissible - Whether notification can be dismissed (default: true)
 * @param {Function} options.onClose - Callback function when notification is closed
 * @param {string} options.position - Position of notification ('top-right', 'bottom-right', 'bottom-center', 'top-center')
 */
function showNotification(message, type = 'info', options = {}) {
    // Default options
    const defaultOptions = {
        duration: 5000,
        dismissible: true,
        onClose: null,
        position: window.innerWidth <= 480 ? 'bottom-center' : 'bottom-right'
    };
    
    // Merge options
    const settings = { ...defaultOptions, ...options };
    
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Update container position based on settings
    updateContainerPosition(notificationContainer, settings.position);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    // Create notification content
    notification.innerHTML = `
        <div class="notification-content">
            <i class="notification-icon fas ${getIconForType(type)}" aria-hidden="true"></i>
            <div class="notification-message">${message}</div>
        </div>
        ${settings.dismissible ? '<button class="notification-close" aria-label="Close notification">&times;</button>' : ''}
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Show notification with animation
    // Small delay to ensure DOM is updated and animation works
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    let timeout;
    
    // Auto-remove after delay if duration is not 0
    if (settings.duration > 0) {
        timeout = setTimeout(() => {
            removeNotification(notification);
        }, settings.duration);
    }
    
    // Pause timer on hover/focus
    notification.addEventListener('mouseenter', () => {
        notification.classList.add('paused');
        if (timeout) clearTimeout(timeout);
    });
    
    notification.addEventListener('mouseleave', () => {
        notification.classList.remove('paused');
        if (settings.duration > 0 && !notification.classList.contains('hide')) {
            timeout = setTimeout(() => {
                removeNotification(notification);
            }, settings.duration);
        }
    });
    
    // Handle focus for accessibility
    notification.addEventListener('focusin', () => {
        notification.classList.add('paused');
        if (timeout) clearTimeout(timeout);
    });
    
    notification.addEventListener('focusout', () => {
        notification.classList.remove('paused');
        if (settings.duration > 0 && !notification.classList.contains('hide')) {
            timeout = setTimeout(() => {
                removeNotification(notification);
            }, settings.duration);
        }
    });
    
    // Close button
    if (settings.dismissible) {
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            if (timeout) clearTimeout(timeout);
            removeNotification(notification);
        });
    }
    
    // Add swipe to dismiss on mobile
    if (isTouchDevice() && settings.dismissible) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        notification.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            notification.classList.add('paused');
            if (timeout) clearTimeout(timeout);
        }, { passive: true });
        
        notification.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            notification.classList.remove('paused');
            
            // If swiped far enough, dismiss
            if (touchEndX - touchStartX > 100) {
                if (timeout) clearTimeout(timeout);
                removeNotification(notification);
            } else if (settings.duration > 0 && !notification.classList.contains('hide')) {
                // Otherwise restart the timer
                timeout = setTimeout(() => {
                    removeNotification(notification);
                }, settings.duration);
            }
        }, { passive: true });
    }
    
    // Helper function to remove notification with animation
    function removeNotification(element) {
        element.classList.remove('show');
        element.classList.add('hide');
        
        // Call onClose callback if provided
        if (typeof settings.onClose === 'function') {
            settings.onClose();
        }
        
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
                
                // If container is empty, remove it
                if (notificationContainer.children.length === 0) {
                    notificationContainer.remove();
                }
            }
        }, 400); // Match the CSS transition duration
    }
    
    // Return an object with methods to control the notification
    return {
        close: () => {
            if (timeout) clearTimeout(timeout);
            removeNotification(notification);
        },
        update: (newMessage) => {
            const messageEl = notification.querySelector('.notification-message');
            if (messageEl) messageEl.textContent = newMessage;
        }
    };
}

/**
 * Helper function to get icon based on notification type
 */
function getIconForType(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        case 'info':
        default: return 'fa-info-circle';
    }
}

/**
 * Helper function to update notification container position
 */
function updateContainerPosition(container, position) {
    // Reset all positions
    container.style.top = '';
    container.style.right = '';
    container.style.bottom = '';
    container.style.left = '';
    
    // Set position based on preference
    switch (position) {
        case 'top-right':
            container.style.top = '20px';
            container.style.right = '20px';
            break;
        case 'top-center':
            container.style.top = '20px';
            container.style.left = '50%';
            container.style.transform = 'translateX(-50%)';
            break;
        case 'bottom-center':
            container.style.bottom = '20px';
            container.style.left = '50%';
            container.style.transform = 'translateX(-50%)';
            break;
        case 'bottom-right':
        default:
            container.style.bottom = '20px';
            container.style.right = '20px';
            break;
    }
    
    // For mobile devices, always use bottom-center
    if (window.innerWidth <= 480) {
        container.style.top = '';
        container.style.right = '';
        container.style.bottom = '0';
        container.style.left = '0';
        container.style.transform = 'none';
        container.style.width = '100%';
        container.style.padding = '10px';
    }
}

/**
 * Helper function to detect touch devices
 */
function isTouchDevice() {
    return ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
}

// Enhanced Book Data Structure
const books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        subgenre: ["Classic", "Literary Fiction"],
        description: "A classic novel exploring the decadence of the Roaring Twenties.",
        coverImage: "../image/Books/book1.jpg",
        rating: 4.5,
        publishedYear: 1925,
        pages: 180,
        isbn: "9780743273565",
        language: "English",
        publisher: "Scribner",
        reviews: [
            { user: "BookLover", rating: 5, text: "A timeless masterpiece!" },
            { user: "Reader123", rating: 4, text: "Beautifully written novel." }
        ]
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        subgenre: ["Classic", "Social Justice"],
        description: "A powerful story of racial injustice and moral growth in the American South.",
        coverImage: "../image/Books/book2.jpg",
        rating: 4.8,
        publishedYear: 1960,
        pages: 281,
        isbn: "9780446310789",
        language: "English",
        publisher: "J.B. Lippincott & Co.",
        reviews: [
            { user: "LiteraryFan", rating: 5, text: "An absolute must-read!" },
            { user: "BookWorm", rating: 4.5, text: "Profound and moving." }
        ]
    }
    // Add more books as needed
];

// User Reading List
class ReadingList {
    constructor() {
        this.list = JSON.parse(localStorage.getItem('readingList')) || [];
    }

    add(bookId) {
        if (!this.list.includes(bookId)) {
            this.list.push(bookId);
            this.save();
            showNotification(`Book added to reading list`, 'success');
        } else {
            showNotification(`Book already in reading list`, 'warning');
        }
    }

    remove(bookId) {
        this.list = this.list.filter(id => id !== bookId);
        this.save();
        showNotification(`Book removed from reading list`, 'info');
    }

    save() {
        localStorage.setItem('readingList', JSON.stringify(this.list));
    }

    getList() {
        return this.list.map(id => books.find(book => book.id === id));
    }

    contains(bookId) {
        return this.list.includes(bookId);
    }
}

const readingList = new ReadingList();

// Advanced Book Rendering
function renderBooks(filteredBooks = books) {
    const booksGrid = document.getElementById('booksGrid');
    booksGrid.innerHTML = '';

    if (filteredBooks.length === 0) {
        booksGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-book-open"></i>
                <h3>No books found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }

    filteredBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.innerHTML = `
            <div class="book-card-inner">
                <div class="book-cover">
                    <img src="${book.coverImage}" alt="${book.title}">
                    <div class="book-overlay">
                        <button class="btn-quick-view" onclick="showBookDetails(${book.id})">
                            <i class="fas fa-eye"></i> Quick View
                        </button>
                        <button class="btn-reading-list ${readingList.contains(book.id) ? 'added' : ''}" 
                                onclick="toggleReadingList(${book.id}, this)">
                            <i class="fas fa-${readingList.contains(book.id) ? 'check' : 'plus'}"></i> 
                            ${readingList.contains(book.id) ? 'In List' : 'Reading List'}
                        </button>
                    </div>
                </div>
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <h4>${book.author}</h4>
                    <div class="book-rating">
                        ${generateStarRating(book.rating)}
                        <span class="rating-count">(${book.reviews.length} reviews)</span>
                    </div>
                    <div class="book-genres">
                        ${book.subgenre.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        booksGrid.appendChild(bookCard);
    });
}

// Toggle Reading List
function toggleReadingList(bookId, button) {
    if (readingList.contains(bookId)) {
        readingList.remove(bookId);
        button.classList.remove('added');
        button.innerHTML = '<i class="fas fa-plus"></i> Reading List';
    } else {
        readingList.add(bookId);
        button.classList.add('added');
        button.innerHTML = '<i class="fas fa-check"></i> In List';
    }
}

// Advanced Filtering and Search
function setupAdvancedFiltering() {
    const searchInput = document.querySelector('.search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-select');

    // Search with debounce
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            applyFilters();
        }, 300);
    });

    // Genre Filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            applyFilters();
        });
    });

    // Sorting
    sortSelect.addEventListener('change', applyFilters);

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeGenre = document.querySelector('.filter-btn.active').getAttribute('data-genre');
        const sortMethod = sortSelect.value;

        let filteredBooks = books.filter(book => {
            const matchesSearch = 
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.subgenre.some(genre => genre.toLowerCase().includes(searchTerm));
            
            const matchesGenre = 
                activeGenre === 'all' || 
                book.genre.toLowerCase() === activeGenre.toLowerCase();

            return matchesSearch && matchesGenre;
        });

        // Sorting
        switch(sortMethod) {
            case 'rating':
                filteredBooks.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                filteredBooks.sort((a, b) => b.publishedYear - a.publishedYear);
                break;
            case 'title':
                filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        renderBooks(filteredBooks);
    }
}

// Book Recommendations
function getBookRecommendations(book) {
    return books.filter(b => 
        b.id !== book.id && 
        (b.genre === book.genre || 
         b.subgenre.some(genre => book.subgenre.includes(genre)))
    ).slice(0, 3);
}

// Show Book Details with Recommendations
function showBookDetails(bookId) {
    const book = books.find(b => b.id === bookId);
    const modal = document.getElementById('bookDetailsModal');
    const modalContent = modal.querySelector('.modal-book-details');

    const recommendations = getBookRecommendations(book);

    modalContent.innerHTML = `
        <div class="book-details-grid">
            <div class="book-details-main">
                <img src="${book.coverImage}" alt="${book.title}" class="book-cover-large">
                <div class="book-details-info">
                    <h2>${book.title}</h2>
                    <h3>${book.author}</h3>
                    <div class="book-meta">
                        <span>Genre: ${book.genre}</span>
                        <span>Published: ${book.publishedYear}</span>
                        <span>Pages: ${book.pages}</span>
                        <span>ISBN: ${book.isbn}</span>
                    </div>
                    <div class="book-rating-detailed">
                        ${generateStarRating(book.rating)}
                        <span class="rating-text">${book.rating}/5 (${book.reviews.length} reviews)</span>
                    </div>
                </div>
            </div>
            
            <div class="book-description">
                <h4>Description</h4>
                <p>${book.description || 'No description available.'}</p>
            </div>
            
            <div class="book-reviews">
                <h4>Reader Reviews</h4>
                ${book.reviews.map(review => `
                    <div class="review">
                        <div class="review-header">
                            <span class="review-user">${review.user}</span>
                            ${generateStarRating(review.rating)}
                        </div>
                        <p class="review-text">${review.text}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="book-recommendations">
                <h4>Similar Books</h4>
                <div class="recommendations-grid">
                    ${recommendations.map(rec => `
                        <div class="recommendation-card" onclick="showBookDetails(${rec.id})">
                            <img src="${rec.coverImage}" alt="${rec.title}">
                            <div class="recommendation-info">
                                <h5>${rec.title}</h5>
                                <p>${rec.author}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

/**
 * Advanced Filters functionality
 */
function initializeAdvancedFilters() {
    const toggleButton = document.getElementById('toggleAdvancedFilters');
    const filtersPanel = document.getElementById('advancedFiltersPanel');
    const yearRangeMin = document.getElementById('yearRangeMin');
    const yearRangeMax = document.getElementById('yearRangeMax');
    const yearRangeValue = document.getElementById('yearRangeValue');
    const ratingRange = document.getElementById('ratingRange');
    const ratingValue = document.getElementById('ratingValue');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    
    // Toggle advanced filters panel
    if (toggleButton && filtersPanel) {
        toggleButton.addEventListener('click', () => {
            filtersPanel.classList.toggle('active');
            
            // Change button text based on panel state
            if (filtersPanel.classList.contains('active')) {
                toggleButton.innerHTML = '<i class="fas fa-times"></i> Hide Filters';
            } else {
                toggleButton.innerHTML = '<i class="fas fa-sliders-h"></i> Advanced Filters';
            }
        });
    }
    
    // Year range slider functionality
    if (yearRangeMin && yearRangeMax && yearRangeValue) {
        // Update the year range value display
        function updateYearRangeValue() {
            yearRangeValue.textContent = `${yearRangeMin.value} - ${yearRangeMax.value}`;
            
            // Ensure min doesn't exceed max
            if (parseInt(yearRangeMin.value) > parseInt(yearRangeMax.value)) {
                yearRangeMin.value = yearRangeMax.value;
                yearRangeValue.textContent = `${yearRangeMin.value} - ${yearRangeMax.value}`;
            }
        }
        
        yearRangeMin.addEventListener('input', updateYearRangeValue);
        yearRangeMax.addEventListener('input', updateYearRangeValue);
    }
    
    // Rating slider functionality
    if (ratingRange && ratingValue) {
        ratingRange.addEventListener('input', () => {
            ratingValue.textContent = `${ratingRange.value}+`;
        });
    }
    
    // Apply filters button
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            applyAdvancedFilters();
            
            // Show notification
            showNotification('Filters applied successfully', 'success');
            
            // Optionally close the panel after applying
            filtersPanel.classList.remove('active');
            toggleButton.innerHTML = '<i class="fas fa-sliders-h"></i> Advanced Filters';
        });
    }
    
    // Reset filters button
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            // Reset year range
            if (yearRangeMin && yearRangeMax) {
                yearRangeMin.value = 1900;
                yearRangeMax.value = 2024;
                yearRangeValue.textContent = '1900 - 2024';
            }
            
            // Reset rating
            if (ratingRange) {
                ratingRange.value = 1;
                ratingValue.textContent = '1.0+';
            }
            
            // Reset checkboxes
            document.querySelectorAll('.checkbox-label input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Reset and reapply filters
            applyAdvancedFilters();
            
            // Show notification
            showNotification('Filters have been reset', 'info');
        });
    }
}

/**
 * Apply advanced filters to the book grid
 */
function applyAdvancedFilters() {
    // Get filter values
    const minYear = parseInt(document.getElementById('yearRangeMin').value);
    const maxYear = parseInt(document.getElementById('yearRangeMax').value);
    const minRating = parseFloat(document.getElementById('ratingRange').value);
    
    // Get selected book lengths
    const selectedLengths = Array.from(document.querySelectorAll('input[name="length"]:checked')).map(cb => cb.value);
    
    // Get selected availability options
    const selectedAvailability = Array.from(document.querySelectorAll('input[name="availability"]:checked')).map(cb => cb.value);
    
    // Filter the books based on criteria
    let filteredBooks = books.filter(book => {
        // Year filter
        const publishYear = book.publishYear || 2000; // Default if not specified
        if (publishYear < minYear || publishYear > maxYear) return false;
        
        // Rating filter
        if (book.rating < minRating) return false;
        
        // Length filter (if any selected)
        if (selectedLengths.length > 0) {
            const pageCount = book.pageCount || 0;
            const bookLength = pageCount < 200 ? 'short' : (pageCount <= 400 ? 'medium' : 'long');
            if (!selectedLengths.includes(bookLength)) return false;
        }
        
        // Availability filter (if any selected)
        if (selectedAvailability.length > 0) {
            const formats = book.formats || [];
            // Check if any of the selected formats are available for this book
            const hasSelectedFormat = selectedAvailability.some(format => formats.includes(format));
            if (!hasSelectedFormat) return false;
        }
        
        return true;
    });
    
    // Apply any existing genre filter
    const activeGenreBtn = document.querySelector('.filter-btn.active');
    if (activeGenreBtn && activeGenreBtn.dataset.genre !== 'all') {
        const selectedGenre = activeGenreBtn.dataset.genre;
        filteredBooks = filteredBooks.filter(book => book.genre === selectedGenre);
    }
    
    // Apply any existing sort
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        const sortValue = sortSelect.value;
        
        switch (sortValue) {
            case 'rating':
                filteredBooks.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                filteredBooks.sort((a, b) => (b.publishYear || 0) - (a.publishYear || 0));
                break;
            case 'title':
                filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }
    }
    
    // Render the filtered books
    renderBooks(filteredBooks);
    
    // Update the book count display
    const bookCountElement = document.querySelector('.books-count');
    if (bookCountElement) {
        bookCountElement.textContent = `Showing ${filteredBooks.length} of ${books.length} books`;
    }
}

/**
 * Lazy Loading with Intersection Observer
 */
function initializeLazyLoading() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    
                    // Replace src with data-src
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                        
                        // Add loaded class for animation
                        lazyImage.addEventListener('load', () => {
                            lazyImage.classList.add('loaded');
                        });
                        
                        // Stop observing the image
                        observer.unobserve(lazyImage);
                    }
                }
            });
        }, {
            rootMargin: '200px 0px', // Start loading when image is 200px from viewport
            threshold: 0.01 // Trigger when at least 1% of the image is visible
        });
        
        // Observe all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            lazyImageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
}

/**
 * Enhanced book details modal with animations
 */
function showBookDetails(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    const modal = document.getElementById('bookDetailsModal');
    const modalContent = modal.querySelector('.modal-book-details');
    
    // Create enhanced modal content with animations
    modalContent.innerHTML = `
        <div class="book-preview">
            <div class="book-preview-image">
                <img src="${book.coverImage}" alt="${book.title}" class="preview-image">
                <div class="book-preview-badge">${book.genre}</div>
            </div>
            <div class="book-preview-content">
                <h2>${book.title}</h2>
                <h3>by ${book.author}</h3>
                <div class="book-preview-rating">
                    <div class="stars">${generateStarRating(book.rating)}</div>
                    <span class="rating-value">${book.rating.toFixed(1)}</span>
                    <span class="rating-count">(${book.ratingCount || 0} ratings)</span>
                </div>
                
                <div class="book-preview-description">
                    <p>${book.description || 'No description available.'}</p>
                </div>
                
                <div class="book-preview-metadata">
                    <div class="metadata-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Published: ${book.publishYear || 'Unknown'}</span>
                    </div>
                    <div class="metadata-item">
                        <i class="fas fa-book-open"></i>
                        <span>Pages: ${book.pageCount || 'Unknown'}</span>
                    </div>
                    <div class="metadata-item">
                        <i class="fas fa-language"></i>
                        <span>Language: ${book.language || 'English'}</span>
                    </div>
                    <div class="metadata-item">
                        <i class="fas fa-tag"></i>
                        <span>Genre: ${book.genre}</span>
                    </div>
                </div>
                
                <div class="book-preview-formats">
                    <h4>Available Formats:</h4>
                    <div class="format-badges">
                        ${book.formats ? book.formats.map(format => 
                            `<span class="format-badge ${format.toLowerCase()}">
                                <i class="fas fa-${format === 'ebook' ? 'tablet-alt' : (format === 'audiobook' ? 'headphones' : 'book')}"></i>
                                ${format}
                            </span>`
                        ).join('') : '<span class="format-badge paperback"><i class="fas fa-book"></i> Paperback</span>'}
                    </div>
                </div>
                
                <div class="book-preview-actions">
                    <button class="btn-primary">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn-secondary reading-list-btn" data-id="${book.id}">
                        <i class="fas fa-bookmark"></i> Add to Reading List
                    </button>
                    <button class="btn-tertiary share-btn" data-id="${book.id}">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                </div>
            </div>
        </div>
        
        <div class="book-preview-tabs">
            <div class="tabs-header">
                <button class="tab-btn active" data-tab="details">Details</button>
                <button class="tab-btn" data-tab="reviews">Reviews</button>
                <button class="tab-btn" data-tab="similar">Similar Books</button>
            </div>
            <div class="tabs-content">
                <div class="tab-panel active" id="details-tab">
                    <h4>About the Book</h4>
                    <p>${book.fullDescription || book.description || 'No detailed description available.'}</p>
                    
                    <h4>About the Author</h4>
                    <p>${book.authorBio || `No information available about ${book.author}.`}</p>
                </div>
                <div class="tab-panel" id="reviews-tab">
                    <div class="reviews-container">
                        <p>Reviews will be loaded here.</p>
                    </div>
                </div>
                <div class="tab-panel" id="similar-tab">
                    <div class="similar-books-grid">
                        <p>Similar books will be loaded here.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add tab switching functionality
    const tabButtons = modalContent.querySelectorAll('.tab-btn');
    const tabPanels = modalContent.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            const tabId = `${button.dataset.tab}-tab`;
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Add reading list functionality
    const readingListBtn = modalContent.querySelector('.reading-list-btn');
    if (readingListBtn) {
        readingListBtn.addEventListener('click', () => {
            toggleReadingList(book.id, readingListBtn);
        });
    }
    
    // Add share functionality
    const shareBtn = modalContent.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            shareBook(book);
        });
    }
    
    // Show modal with animation
    modal.classList.add('active');
    
    // Add close functionality
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

/**
 * Share book functionality
 * @param {Object} book - Book details to be shared
 */
function shareBook(book) {
    // Check if Web Share API is supported
    if (navigator.share) {
        try {
            navigator.share({
                title: `Check out this book: ${book.title}`,
                text: `I'm reading "${book.title}" by ${book.author}. Looks interesting!`,
                url: window.location.href
            }).then(() => {
                showNotification('Book shared successfully!', 'success');
            }).catch((error) => {
                console.error('Error sharing book:', error);
                fallbackShareBook(book);
            });
        } catch (error) {
            console.error('Web Share API error:', error);
            fallbackShareBook(book);
        }
    } else {
        // Fallback sharing method
        fallbackShareBook(book);
    }
}

/**
 * Fallback sharing method when Web Share API is not supported
 * @param {Object} book - Book details to be shared
 */
function fallbackShareBook(book) {
    // Create a shareable text
    const shareText = `Check out this book: "${book.title}" by ${book.author}. More details at ${window.location.href}`;
    
    // Create a modal for sharing options
    const shareModal = document.createElement('div');
    shareModal.className = 'share-modal';
    shareModal.innerHTML = `
        <div class="share-modal-content">
            <h3>Share Book</h3>
            <div class="share-options">
                <button class="share-btn copy-link" data-type="copy">
                    <i class="fas fa-link"></i> Copy Link
                </button>
                <button class="share-btn email-share" data-type="email">
                    <i class="fas fa-envelope"></i> Share via Email
                </button>
                <button class="share-btn whatsapp-share" data-type="whatsapp">
                    <i class="fab fa-whatsapp"></i> Share on WhatsApp
                </button>
            </div>
            <textarea id="shareTextArea" style="opacity:0; position:absolute;">${shareText}</textarea>
        </div>
    `;
    
    document.body.appendChild(shareModal);
    
    // Copy link functionality
    shareModal.querySelector('.copy-link').addEventListener('click', () => {
        const textArea = document.getElementById('shareTextArea');
        textArea.select();
        document.execCommand('copy');
        showNotification('Link copied to clipboard!', 'success');
    });
    
    // Email share functionality
    shareModal.querySelector('.email-share').addEventListener('click', () => {
        const subject = encodeURIComponent(`Check out this book: ${book.title}`);
        const body = encodeURIComponent(shareText);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    });
    
    // WhatsApp share functionality
    shareModal.querySelector('.whatsapp-share').addEventListener('click', () => {
        const encodedText = encodeURIComponent(shareText);
        window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    });
}

/**
 * Reading Progress Tracker
 */
function initializeReadingProgressTracker() {
    const progressBar = document.getElementById('readingProgressBar');
    
    if (progressBar) {
        // Update progress bar width based on scroll position
        window.addEventListener('scroll', () => {
            // Calculate how much the user has scrolled
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            
            // Calculate scroll percentage
            const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
            
            // Update progress bar width
            progressBar.style.width = `${scrollPercentage}%`;
            
            // Add a class when progress is complete
            if (scrollPercentage > 98) {
                progressBar.classList.add('complete');
            } else {
                progressBar.classList.remove('complete');
            }
        });
        
        // Add click event to jump to position in the page
        const progressContainer = document.querySelector('.reading-progress-container');
        if (progressContainer) {
            progressContainer.addEventListener('click', (e) => {
                // Calculate click position percentage
                const clickPositionPercentage = (e.clientX / window.innerWidth) * 100;
                
                // Calculate target scroll position
                const scrollHeight = document.documentElement.scrollHeight;
                const clientHeight = document.documentElement.clientHeight;
                const targetScrollPosition = ((scrollHeight - clientHeight) * clickPositionPercentage) / 100;
                
                // Scroll to target position with smooth behavior
                window.scrollTo({
                    top: targetScrollPosition,
                    behavior: 'smooth'
                });
            });
        }
    }
}

/**
 * Collection Sharing Feature
 */
function initializeCollectionSharing() {
    const shareCollectionBtn = document.getElementById('shareCollection');
    const exportCollectionBtn = document.getElementById('exportCollection');
    const shareModal = document.getElementById('shareCollectionModal');
    const shareModalClose = shareModal?.querySelector('.share-modal-close');
    const shareOptions = shareModal?.querySelectorAll('.share-option');
    const shareLinkInput = document.getElementById('shareLink');
    const copyShareLinkBtn = document.getElementById('copyShareLink');
    
    // Generate shareable link with current filters
    function generateShareableLink() {
        const url = new URL(window.location.href);
        
        // Get current active genre filter
        const activeGenreBtn = document.querySelector('.filter-btn.active');
        if (activeGenreBtn) {
            url.searchParams.set('genre', activeGenreBtn.dataset.genre);
        }
        
        // Get current sort option
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            url.searchParams.set('sort', sortSelect.value);
        }
        
        // Get advanced filter values if panel is active
        const advancedFiltersPanel = document.getElementById('advancedFiltersPanel');
        if (advancedFiltersPanel && advancedFiltersPanel.classList.contains('active')) {
            // Year range
            const yearMin = document.getElementById('yearRangeMin')?.value;
            const yearMax = document.getElementById('yearRangeMax')?.value;
            if (yearMin && yearMax) {
                url.searchParams.set('yearMin', yearMin);
                url.searchParams.set('yearMax', yearMax);
            }
            
            // Rating
            const rating = document.getElementById('ratingRange')?.value;
            if (rating) {
                url.searchParams.set('rating', rating);
            }
            
            // Book length
            const selectedLengths = Array.from(document.querySelectorAll('input[name="length"]:checked')).map(cb => cb.value);
            if (selectedLengths.length > 0) {
                url.searchParams.set('length', selectedLengths.join(','));
            }
            
            // Availability
            const selectedAvailability = Array.from(document.querySelectorAll('input[name="availability"]:checked')).map(cb => cb.value);
            if (selectedAvailability.length > 0) {
                url.searchParams.set('format', selectedAvailability.join(','));
            }
        }
        
        return url.toString();
    }
    
    // Share collection button click
    if (shareCollectionBtn && shareModal) {
        shareCollectionBtn.addEventListener('click', () => {
            // Generate shareable link
            const shareableLink = generateShareableLink();
            
            // Set link in input field
            if (shareLinkInput) {
                shareLinkInput.value = shareableLink;
            }
            
            // Show modal
            shareModal.classList.add('active');
        });
    }
    
    // Close share modal
    if (shareModalClose && shareModal) {
        shareModalClose.addEventListener('click', () => {
            shareModal.classList.remove('active');
        });
        
        // Close modal when clicking outside
        shareModal.addEventListener('click', (e) => {
            if (e.target === shareModal) {
                shareModal.classList.remove('active');
            }
        });
    }
    
    // Share options click
    if (shareOptions) {
        shareOptions.forEach(option => {
            option.addEventListener('click', () => {
                const platform = option.dataset.platform;
                const shareableLink = generateShareableLink();
                const collectionTitle = 'Literary Hub Book Collection';
                const collectionDescription = 'Check out this curated book collection from Literary Hub!';
                
                // Share based on platform
                switch (platform) {
                    case 'facebook':
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableLink)}`, '_blank');
                        break;
                    case 'twitter':
                        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareableLink)}&text=${encodeURIComponent(collectionDescription)}`, '_blank');
                        break;
                    case 'whatsapp':
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(collectionDescription + ' ' + shareableLink)}`, '_blank');
                        break;
                    case 'email':
                        window.location.href = `mailto:?subject=${encodeURIComponent(collectionTitle)}&body=${encodeURIComponent(collectionDescription + '\n\n' + shareableLink)}`;
                        break;
                }
                
                // Show notification
                showNotification(`Sharing collection via ${platform}`, 'success');
            });
        });
    }
    
    // Copy share link button
    if (copyShareLinkBtn && shareLinkInput) {
        copyShareLinkBtn.addEventListener('click', () => {
            // Select the text
            shareLinkInput.select();
            shareLinkInput.setSelectionRange(0, 99999); // For mobile devices
            
            // Copy to clipboard
            document.execCommand('copy');
            
            // Show notification
            showNotification('Link copied to clipboard!', 'success');
            
            // Change button text temporarily
            const originalText = copyShareLinkBtn.textContent;
            copyShareLinkBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyShareLinkBtn.textContent = originalText;
            }, 2000);
        });
    }
    
    // Export collection as PDF
    if (exportCollectionBtn) {
        exportCollectionBtn.addEventListener('click', () => {
            exportCollectionAsPDF();
        });
    }
}

/**
 * Export collection as PDF
 */
function exportCollectionAsPDF() {
    // Show notification that this is a mock feature
    showNotification('PDF export feature would generate a PDF of the current collection', 'info');
    
    // In a real implementation, you would use a library like jsPDF or html2pdf
    // Example implementation with html2pdf would be:
    /*
    // Get the books grid element
    const booksGrid = document.getElementById('booksGrid');
    
    // Configure PDF options
    const options = {
        margin: 10,
        filename: 'literary-hub-collection.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Generate PDF
    html2pdf().from(booksGrid).set(options).save();
    */
    
    // For now, simulate PDF generation with a timeout
    setTimeout(() => {
        showNotification('PDF generated successfully!', 'success');
    }, 2000);
}

// Comprehensive Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Core Initialization Functions
    function initializeComponents() {
        try {
            renderBooks();
            setupAdvancedFiltering();
            populateRecommendedBooks();
            initializeModalHandlers();
            setupResponsiveFeatures();
        } catch (error) {
            console.error('Initialization Error:', error);
            showNotification('Failed to load book features', 'error');
        }
    }

    // Responsive Feature Setup
    function setupResponsiveFeatures() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const sortSelect = document.getElementById('sort-select');
        const searchInput = document.querySelector('.search-input');

        // Ensure interactive elements are responsive
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                applyFilters();
            });
        });

        if (sortSelect) {
            sortSelect.addEventListener('change', applyFilters);
        }

        if (searchInput) {
            searchInput.addEventListener('input', debounce(applyFilters, 300));
        }
    }

    // Debounce Utility Function
    function debounce(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        }
    }

    // Advanced Filtering
    function applyFilters() {
        const searchTerm = document.querySelector('.search-input').value.toLowerCase();
        const activeGenre = document.querySelector('.filter-btn.active').getAttribute('data-genre');
        const sortMethod = document.getElementById('sort-select').value;

        let filteredBooks = books.filter(book => {
            const matchesSearch = 
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.subgenre.some(genre => genre.toLowerCase().includes(searchTerm));
            
            const matchesGenre = 
                activeGenre === 'all' || 
                book.genre.toLowerCase() === activeGenre.toLowerCase();

            return matchesSearch && matchesGenre;
        });

        // Sorting Logic
        switch(sortMethod) {
            case 'rating':
                filteredBooks.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                filteredBooks.sort((a, b) => b.publishedYear - a.publishedYear);
                break;
            case 'title':
                filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        renderBooks(filteredBooks);
    }

    // Book Rendering with Enhanced Error Handling
    function renderBooks(booksToRender = books) {
        const booksGrid = document.getElementById('booksGrid');
        
        if (!booksGrid) {
            console.error('Books grid element not found');
            return;
        }

        booksGrid.innerHTML = ''; // Clear existing content

        if (booksToRender.length === 0) {
            booksGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-book-open"></i>
                    <h3>No books found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `;
            return;
        }

        booksToRender.forEach(book => {
            const bookCard = createBookCard(book);
            booksGrid.appendChild(bookCard);
        });
    }

    // Book Card Creation
    function createBookCard(book) {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.setAttribute('role', 'listitem');
        bookCard.setAttribute('data-id', book.id);
        bookCard.setAttribute('data-genre', book.genre.toLowerCase());
        
        // Add animation delay for staggered appearance
        const delay = Math.random() * 0.5;
        bookCard.style.animationDelay = `${delay}s`;
        
        // Create book cover
        const bookCover = document.createElement('div');
        bookCover.className = 'book-cover';
        
        const img = document.createElement('img');
        img.src = book.cover;
        img.alt = `Cover of ${book.title}`;
        img.loading = 'lazy';
        img.className = 'lazy-image';
        
        bookCover.appendChild(img);
        bookCard.appendChild(bookCover);
        
        // Create book info
        const bookInfo = document.createElement('div');
        bookInfo.className = 'book-info';
        
        const title = document.createElement('h3');
        title.textContent = book.title;
        
        const author = document.createElement('h4');
        author.textContent = book.author;
        
        const bookMeta = document.createElement('div');
        bookMeta.className = 'book-meta';
        
        const rating = document.createElement('div');
        rating.className = 'book-rating';
        rating.innerHTML = `<i class="fas fa-star"></i> <span>${book.rating}</span>`;
        
        bookMeta.appendChild(rating);
        
        // Add tags if available
        if (book.tags && book.tags.length > 0) {
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'book-tags';
            
            book.tags.slice(0, 2).forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'book-tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });
            
            bookInfo.appendChild(tagsContainer);
        }
        
        bookInfo.appendChild(title);
        bookInfo.appendChild(author);
        bookInfo.appendChild(bookMeta);
        
        bookCard.appendChild(bookInfo);
        
        // Add click event to show book details
        bookCard.addEventListener('click', () => {
            showBookDetails(book.id);
        });
        
        return bookCard;
    }

    // Star Rating Generation
    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        
        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (halfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }

    // Recommended Books Population
    function populateRecommendedBooks() {
        const recommendedList = document.getElementById('recommendedBooksList');
        
        if (!recommendedList) return;

        // Sort books by rating and take top 3
        const topRecommendations = books
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3);

        recommendedList.innerHTML = topRecommendations.map(book => `
            <div class="recommended-book-card" onclick="showBookDetails(${book.id})">
                <img src="${book.coverImage}" alt="${book.title}">
                <div class="recommended-book-info">
                    <h4>${book.title}</h4>
                    <p>${book.author}</p>
                    <div class="recommended-book-rating">
                        ${generateStarRating(book.rating)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Modal Initialization
    function initializeModalHandlers() {
        const modal = document.getElementById('bookDetailsModal');
        const closeModal = modal.querySelector('.close-modal');

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Book Details Modal
    window.showBookDetails = function(bookId) {
        const book = books.find(b => b.id === bookId);
        const modal = document.getElementById('bookDetailsModal');
        const modalContent = modal.querySelector('.modal-book-details');

        if (!book) {
            showNotification('Book details not found', 'error');
            return;
        }

        modalContent.innerHTML = `
            <div class="book-details-grid">
                <img src="${book.coverImage}" alt="${book.title}" class="book-cover-large">
                <div class="book-details-info">
                    <h2>${book.title}</h2>
                    <h3>${book.author}</h3>
                    <div class="book-meta">
                        <p>Genre: ${book.genre}</p>
                        <p>Published: ${book.publishedYear}</p>
                        <p>Pages: ${book.pages}</p>
                    </div>
                    <div class="book-rating-detailed">
                        ${generateStarRating(book.rating)}
                        <span class="rating-text">${book.rating}/5</span>
                    </div>
                    <p class="book-description">${book.description}</p>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }

    // Notification Function
    function showNotification(message, type = 'info') {
        const notificationContainer = document.createElement('div');
        notificationContainer.className = `notification ${type}`;
        notificationContainer.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notificationContainer);

        setTimeout(() => {
            notificationContainer.classList.add('show');
            setTimeout(() => {
                notificationContainer.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notificationContainer);
                }, 300);
            }, 3000);
        }, 10);
    }

    // Notification Icon Selector
    function getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    // Initialize Everything
    initializeComponents();
});

function performSearch(query) {
    if (!query.trim()) return;
    
    // Show loading indicator
    showSearchLoading();
    
    // Simulate search delay
    setTimeout(() => {
        // Get all collection cards
        const collectionCards = document.querySelectorAll('.collection-card');
        const results = [];
        
        // Simple search through collection titles and descriptions
        collectionCards.forEach(card => {
            const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
            const description = card.querySelector('p')?.textContent.toLowerCase() || '';
            const tag = card.querySelector('.collection-tag')?.textContent.toLowerCase() || '';
            
            if (title.includes(query.toLowerCase()) || 
                description.includes(query.toLowerCase()) ||
                tag.includes(query.toLowerCase())) {
                results.push(card);
            }
        });
        
        // If no collection cards found, try book cards
        if (collectionCards.length === 0 || results.length === 0) {
            const bookCards = document.querySelectorAll('.book-card, .preview-book-card');
            
            bookCards.forEach(card => {
                const title = card.querySelector('h3, h4')?.textContent.toLowerCase() || '';
                const author = card.querySelector('p, .book-author')?.textContent.toLowerCase() || '';
                
                if (title.includes(query.toLowerCase()) || 
                    author.includes(query.toLowerCase())) {
                    results.push(card);
                }
            });
        }
        
        // Display results
        displaySearchResults(results, query);
        
        // Hide loading indicator
        hideSearchLoading();
    }, 500);
}

function displaySearchResults(results, query) {
    // Create or get results container
    let resultsContainer = document.querySelector('.search-results');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        document.body.appendChild(resultsContainer);
    }
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Add header
    const header = document.createElement('div');
    header.className = 'search-results-header';
    header.innerHTML = `
        <h3>Search Results for "${query}"</h3>
        <p>${results.length} items found</p>
    `;
    resultsContainer.appendChild(header);
    
    if (results.length === 0) {
        // No results message
        const noResults = document.createElement('div');
        noResults.className = 'no-results-message';
        noResults.innerHTML = `
            <i class="fas fa-search"></i>
            <p>No results found for "${query}"</p>
            <p>Try different keywords or check spelling</p>
        `;
        resultsContainer.appendChild(noResults);
    } else {
        // Display results
        results.forEach((card, index) => {
            const isCollectionCard = card.classList.contains('collection-card');
            const isBookCard = card.classList.contains('book-card') || card.classList.contains('preview-book-card');
            
            let title, subtitle, image, id;
            
            if (isCollectionCard) {
                title = card.querySelector('h4')?.textContent || 'Unknown Collection';
                subtitle = card.querySelector('.collection-meta span:first-child')?.textContent || '';
                const img = card.querySelector('img');
                image = img ? img.src : '';
                id = card.getAttribute('data-category') || `collection-${index}`;
            } else if (isBookCard) {
                title = card.querySelector('h3, h4')?.textContent || 'Unknown Book';
                subtitle = card.querySelector('p')?.textContent || '';
                const img = card.querySelector('img');
                image = img ? img.src : '';
                id = card.getAttribute('data-id') || `book-${index}`;
            } else {
                title = 'Unknown Item';
                subtitle = '';
                image = '';
                id = `item-${index}`;
            }
            
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.style.animationDelay = `${index * 0.05}s`;
            resultItem.innerHTML = `
                <div class="search-result-cover">
                    <img src="${image}" alt="${title}">
                </div>
                <div class="search-result-info">
                    <div class="search-result-title">${title}</div>
                    <div class="search-result-meta">${subtitle}</div>
                    <button class="view-book-btn" data-id="${id}">View Details</button>
                </div>
            `;
            resultsContainer.appendChild(resultItem);
            
            // Add click event to view button
            const viewBtn = resultItem.querySelector('.view-book-btn');
            viewBtn.addEventListener('click', () => {
                // Highlight the original card
                card.classList.add('search-highlight');
                setTimeout(() => {
                    card.classList.remove('search-highlight');
                }, 2000);
                
                // Scroll to the card
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // If it's a collection card with a view button, click it
                const viewCollectionBtn = card.querySelector('.view-collection-btn');
                if (viewCollectionBtn) {
                    setTimeout(() => {
                        viewCollectionBtn.click();
                    }, 1000);
                }
                
                // Close search
                toggleSearch(false);
            });
        });
    }
    
    // Position results container
    positionResultsContainer(resultsContainer);
    
    // Show results with animation
    resultsContainer.style.display = 'block';
    resultsContainer.style.opacity = '0';
    resultsContainer.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        resultsContainer.style.opacity = '1';
        resultsContainer.style.transform = 'translateY(0)';
    }, 10);
}

function showSearchLoading() {
    // Create loading indicator if it doesn't exist
    let loadingIndicator = document.querySelector('.search-loading');
    if (!loadingIndicator) {
        loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'search-loading';
        loadingIndicator.innerHTML = `
            <div class="spinner"></div>
            <p>Searching...</p>
        `;
        document.body.appendChild(loadingIndicator);
    }
    
    loadingIndicator.style.display = 'flex';
}

function hideSearchLoading() {
    const loadingIndicator = document.querySelector('.search-loading');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

function positionResultsContainer(resultsContainer) {
    // Get the search wrapper
    const searchWrapper = document.getElementById('movableSearch');
    if (!searchWrapper) return;
    
    // Position below search bar
    const searchRect = searchWrapper.getBoundingClientRect();
    
    // Check if expanded to right side
    if (searchRect.right > window.innerWidth / 2) {
        resultsContainer.style.right = (window.innerWidth - searchRect.right) + 'px';
        resultsContainer.style.left = 'auto';
    } else {
        resultsContainer.style.left = searchRect.left + 'px';
        resultsContainer.style.right = 'auto';
    }
    
    resultsContainer.style.top = (searchRect.bottom + 10) + 'px';
    resultsContainer.style.maxWidth = '400px';
    resultsContainer.style.position = 'fixed';
    resultsContainer.style.zIndex = '1900';
}

function toggleSearch(expand) {
    const searchWrapper = document.getElementById('movableSearch');
    const searchInput = document.getElementById('movableSearchInput');
    const searchOverlay = document.getElementById('searchOverlay');
    
    if (!searchWrapper) return;
    
    if (expand) {
        // Store the current position before expanding
        const rect = searchWrapper.getBoundingClientRect();
        searchWrapper.dataset.lastLeft = rect.left + 'px';
        searchWrapper.dataset.lastTop = rect.top + 'px';
        
        // Create and show overlay if it doesn't exist
        if (!searchOverlay) {
            const overlay = document.createElement('div');
            overlay.id = 'searchOverlay';
            document.body.appendChild(overlay);
            
            // Add click event to close search when clicking outside
            overlay.addEventListener('click', () => {
                toggleSearch(false);
            });
            
            // Show overlay with slight delay for smooth transition
            setTimeout(() => {
                overlay.style.display = 'block';
                setTimeout(() => {
                    overlay.classList.add('active');
                }, 10);
            }, 10);
        } else {
            // Show existing overlay
            searchOverlay.style.display = 'block';
            setTimeout(() => {
                searchOverlay.classList.add('active');
            }, 10);
        }
        
        // Expand search
        searchWrapper.classList.remove('collapsed');
        searchWrapper.classList.add('expanded');
        
        // Focus input after transition completes
        setTimeout(() => {
            if (searchInput) {
                searchInput.focus();
                searchInput.value = ''; // Clear any previous input
            }
        }, 300);
    } else {
        // Collapse search
        searchWrapper.classList.remove('expanded');
        searchWrapper.classList.add('collapsed');
        
        // Hide overlay
        if (searchOverlay) {
            searchOverlay.classList.remove('active');
            setTimeout(() => {
                searchOverlay.style.display = 'none';
            }, 300);
        }
        
        // Clear input
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Hide results if visible
        const resultsContainer = document.querySelector('.search-results');
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
        
        // Return to previous position with slight delay to allow for transition
        if (searchWrapper.dataset.lastLeft && searchWrapper.dataset.lastTop) {
            const left = parseFloat(searchWrapper.dataset.lastLeft);
            const top = parseFloat(searchWrapper.dataset.lastTop);
            
            setTimeout(() => {
                searchWrapper.style.transform = `translate(${left}px, ${top}px)`;
            }, 50);
        }
    }
}

function initializePosition() {
    const searchWrapper = document.getElementById('movableSearch');
    if (!searchWrapper) return;
    
    try {
        // Try to get saved position from localStorage
        const savedPosition = localStorage.getItem('searchPosition');
        
        if (savedPosition) {
            const { x, y } = JSON.parse(savedPosition);
            
            // Validate position - make sure it's within viewport
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const wrapperWidth = searchWrapper.offsetWidth || 60;
            const wrapperHeight = searchWrapper.offsetHeight || 60;
            
            // Ensure position is within viewport bounds
            const validX = Math.max(0, Math.min(x, viewportWidth - wrapperWidth));
            const validY = Math.max(0, Math.min(y, viewportHeight - wrapperHeight));
            
            // Apply position
            searchWrapper.style.transform = `translate(${validX}px, ${validY}px)`;
            
            console.log(`Search positioned at saved coordinates: (${validX}, ${validY})`);
        } else {
            // Default position - top right
            setDefaultPosition();
        }
        
        // Make sure search wrapper is visible
        searchWrapper.style.opacity = '1';
        
        // Set initial state
        if (searchWrapper.classList.contains('expanded')) {
            searchWrapper.classList.remove('expanded');
            searchWrapper.classList.add('collapsed');
        }
    } catch (error) {
        console.error('Error initializing search position:', error);
        // Set default position on error
        setDefaultPosition();
    }
}

function setDefaultPosition() {
    const searchWrapper = document.getElementById('movableSearch');
    if (!searchWrapper) return;
    
    // Default to top right corner
    const defaultX = window.innerWidth - (searchWrapper.offsetWidth || 60) - 20;
    const defaultY = 80; // Fixed top position
    
    searchWrapper.style.transform = `translate(${defaultX}px, ${defaultY}px)`;
    console.log(`Search positioned at default coordinates: (${defaultX}, ${defaultY})`);
    
    // Make sure search wrapper is visible
    searchWrapper.style.opacity = '1';
}

// ... existing code ...
function initializeNormalSearch() {
    console.log('Initializing normal search bar');
    
    const normalSearchForm = document.querySelector('.normal-search-form');
    const normalSearchInput = document.getElementById('normalSearchInput');
    
    if (!normalSearchForm || !normalSearchInput) {
        console.error('Normal search elements not found');
        return;
    }
    
    // Handle form submission
    normalSearchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const searchTerm = normalSearchInput.value.trim().toLowerCase();
        if (searchTerm === '') return;
        
        console.log('Normal search submitted:', searchTerm);
        performNormalSearch(searchTerm);
    });
    
    // Handle input changes for real-time filtering
    normalSearchInput.addEventListener('input', function() {
        const searchTerm = normalSearchInput.value.trim().toLowerCase();
        
        // Only perform search if at least 2 characters are entered
        if (searchTerm.length >= 2) {
            performNormalSearch(searchTerm);
        } else if (searchTerm === '') {
            // If search is cleared, show all books
            renderBooks(books);
        }
    });
    
    function performNormalSearch(searchTerm) {
        // Filter books based on search term
        const filteredBooks = books.filter(book => {
            return (
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.genre.toLowerCase().includes(searchTerm) ||
                (book.tags && book.tags.some(tag => tag.toLowerCase().includes(searchTerm))) ||
                (book.description && book.description.toLowerCase().includes(searchTerm))
            );
        });
        
        // Update UI with filtered books
        renderBooks(filteredBooks);
        
        // Update active filter button
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.filter-btn[data-genre="all"]').classList.add('active');
        
        // Show message if no results
        if (filteredBooks.length === 0) {
            showNotification(`No books found matching "${searchTerm}"`, 'info');
        }
    }
}

// ... existing code ...

/**
 * Get collection or book ID from URL
 * This function checks for both collection and book IDs in the URL
 */
function getIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const collectionId = urlParams.get('id');
    const bookId = urlParams.get('bookId');
    
    return { collectionId, bookId };
}

/**
 * Initialize page based on URL parameters
 * This handles both collection view and single book view
 */
async function initializePageFromUrl() {
    const { collectionId, bookId } = getIdFromUrl();
    
    if (bookId) {
        // If bookId is present, show single book details
        await showBookDetails(bookId);
        return;
    }
    
    if (collectionId) {
        // If only collectionId is present, show collection
        try {
            const collection = await fetchCollectionDetails(collectionId);
            if (collection) {
                renderCollectionDetails(collection);
            }
        } catch (error) {
            console.error('Error initializing page:', error);
            showNotification('Error loading page data', 'error');
        }
    } else {
        // No valid IDs found
        showNotification('No collection or book ID found in URL', 'error');
    }
}

// Initialize page with data from URL
document.addEventListener('DOMContentLoaded', function() {
    initializePageLoading();
    initializeNavigationInteractivity();
    initializeThemeToggle();
    initializeBackToTopButton();
    initializePageFromUrl();
});

// ... existing code ...

/**
 * Fetch collection details by ID
 */
async function fetchCollectionDetails(collectionId) {
    if (!collectionId) {
        showNotification('Collection ID not found', 'error');
        return null;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/collections/${collectionId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch collection details');
        }
        
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching collection details:', error);
        showNotification('Error loading collection details', 'error');
        return null;
    }
}

// ... existing code ...

/**
 * Show book details in modal
 * This function handles both API books and temporary books from Gallery.html
 */
async function showBookDetails(bookId) {
    try {
        let book;
        
        // Check if this is a temporary book ID from Gallery.html
        if (bookId.startsWith('temp_')) {
            // Retrieve book data from localStorage
            const storedBook = localStorage.getItem('previewBook');
            if (storedBook) {
                book = JSON.parse(storedBook);
            } else {
                showNotification('Book data not found', 'error');
                return;
            }
        } else {
            // Fetch book details from API
            const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch book details');
            }
            
            const data = await response.json();
            book = data.data;
            
            if (!book) {
                showNotification('Book not found', 'error');
                return;
            }
        }
        
        // Update page title
        document.title = `${book.title} - Literary Hub`;
        
        // Show book details in modal
        const modal = document.getElementById('bookDetailsModal');
        const modalContent = modal.querySelector('.modal-book-details');
        
        modalContent.innerHTML = `
            <div class="modal-book-header">
                <h2 id="modalBookTitle">${book.title}</h2>
                <p class="modal-book-author">by ${book.author}</p>
            </div>
            <div class="modal-book-content">
                <div class="modal-book-image">
                    <img src="${book.coverImage}" alt="Cover of ${book.title}">
                </div>
                <div class="modal-book-info">
                    <div class="modal-book-meta">
                        <span class="modal-book-rating">
                            <i class="fas fa-star"></i> ${book.rating || '4.5'}
                        </span>
                        <span class="modal-book-genre">${book.genre || 'Fiction'}</span>
                        <span class="modal-book-pages">${book.pages || '320'} pages</span>
                    </div>
                    <div class="modal-book-description">
                        <h3>Description</h3>
                        <p>${book.description}</p>
                    </div>
                    <div class="modal-book-actions">
                        <button class="modal-action-btn add-to-reading-list" data-id="${book._id}">
                            <i class="fas fa-bookmark"></i> Add to Reading List
                        </button>
                        <button class="modal-action-btn share-book" data-id="${book._id}">
                            <i class="fas fa-share-alt"></i> Share
                        </button>
                    </div>
                </div>
            </div>
            <div class="related-books-section">
                <h3>Related Books</h3>
                <div class="related-books-container" id="relatedBooksContainer">
                    <div class="loading-related">Loading related books...</div>
                </div>
            </div>
        `;
        
        // Show modal
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        
        // Add event listeners
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                modal.setAttribute('aria-hidden', 'true');
            }
        });
        
        // Add reading list functionality
        const addToReadingListBtn = modal.querySelector('.add-to-reading-list');
        if (addToReadingListBtn) {
            addToReadingListBtn.addEventListener('click', () => {
                toggleReadingList(book._id, addToReadingListBtn);
            });
        }
        
        // Add share functionality
        const shareBookBtn = modal.querySelector('.share-book');
        if (shareBookBtn) {
            shareBookBtn.addEventListener('click', () => {
                shareBook(book);
            });
        }
        
        // Fetch and display related books
        if (bookId.startsWith('temp_')) {
            // For temporary books, generate sample related books
            displaySampleRelatedBooks(book);
        } else {
            // For API books, fetch related books from API
            fetchRelatedBooks(book);
        }
        
    } catch (error) {
        console.error('Error showing book details:', error);
        showNotification('Error loading book details', 'error');
    }
}

/**
 * Display sample related books for temporary books
 */
function displaySampleRelatedBooks(book) {
    // Sample related books based on genre
    const sampleBooks = getSampleRelatedBooks(book.genre, book._id);
    displayRelatedBooks(sampleBooks);
}

/**
 * Get sample related books based on genre
 */
function getSampleRelatedBooks(genre, currentBookId) {
    // Sample book data for different genres
    const fictionBooks = [
        {
            _id: 'temp_fiction1',
            title: 'Pride and Prejudice',
            author: 'Jane Austen',
            coverImage: '../image/Books/book7.jpg',
            rating: 4.7,
            genre: 'Fiction'
        },
        {
            _id: 'temp_fiction2',
            title: 'The Catcher in the Rye',
            author: 'J.D. Salinger',
            coverImage: '../image/Books/book8.jpg',
            rating: 4.3,
            genre: 'Fiction'
        },
        {
            _id: 'temp_fiction3',
            title: 'One Hundred Years of Solitude',
            author: 'Gabriel García Márquez',
            coverImage: '../image/Books/book9.jpg',
            rating: 4.6,
            genre: 'Fiction'
        },
        {
            _id: 'temp_fiction4',
            title: 'The Lord of the Rings',
            author: 'J.R.R. Tolkien',
            coverImage: '../image/Books/book10.jpg',
            rating: 4.9,
            genre: 'Fiction'
        }
    ];
    
    const nonFictionBooks = [
        {
            _id: 'temp_nonfiction1',
            title: 'Thinking, Fast and Slow',
            author: 'Daniel Kahneman',
            coverImage: '../image/Books/book11.jpg',
            rating: 4.5,
            genre: 'Non-Fiction'
        },
        {
            _id: 'temp_nonfiction2',
            title: 'Educated',
            author: 'Tara Westover',
            coverImage: '../image/Books/book12.jpg',
            rating: 4.7,
            genre: 'Non-Fiction'
        },
        {
            _id: 'temp_nonfiction3',
            title: 'The Immortal Life of Henrietta Lacks',
            author: 'Rebecca Skloot',
            coverImage: '../image/Books/book13.jpg',
            rating: 4.6,
            genre: 'Non-Fiction'
        },
        {
            _id: 'temp_nonfiction4',
            title: 'Becoming',
            author: 'Michelle Obama',
            coverImage: '../image/Books/book14.jpg',
            rating: 4.8,
            genre: 'Non-Fiction'
        }
    ];
    
    const scienceBooks = [
        {
            _id: 'temp_science1',
            title: 'The Elegant Universe',
            author: 'Brian Greene',
            coverImage: '../image/Books/book15.jpg',
            rating: 4.6,
            genre: 'Science'
        },
        {
            _id: 'temp_science2',
            title: 'Cosmos',
            author: 'Carl Sagan',
            coverImage: '../image/Books/book16.jpg',
            rating: 4.8,
            genre: 'Science'
        },
        {
            _id: 'temp_science3',
            title: 'The Gene',
            author: 'Siddhartha Mukherjee',
            coverImage: '../image/Books/book17.jpg',
            rating: 4.7,
            genre: 'Science'
        },
        {
            _id: 'temp_science4',
            title: 'Astrophysics for People in a Hurry',
            author: 'Neil deGrasse Tyson',
            coverImage: '../image/Books/book18.jpg',
            rating: 4.5,
            genre: 'Science'
        }
    ];
    
    // Select books based on genre
    let relatedBooks = [];
    if (genre.toLowerCase() === 'fiction') {
        relatedBooks = fictionBooks;
    } else if (genre.toLowerCase() === 'non-fiction') {
        relatedBooks = nonFictionBooks;
    } else if (genre.toLowerCase() === 'science') {
        relatedBooks = scienceBooks;
    } else {
        // Default to fiction if genre not recognized
        relatedBooks = fictionBooks;
    }
    
    // Filter out the current book if it's in the list
    relatedBooks = relatedBooks.filter(book => book._id !== currentBookId);
    
    // Return up to 4 related books
    return relatedBooks.slice(0, 4);
}

// ... existing code ...

/**
 * Display related books in the modal
 */
function displayRelatedBooks(books) {
    const relatedBooksContainer = document.getElementById('relatedBooksContainer');
    if (!relatedBooksContainer) return;
    
    if (!books || books.length === 0) {
        relatedBooksContainer.innerHTML = '<p>No related books found</p>';
        return;
    }
    
    let html = '<div class="related-books-grid">';
    
    books.forEach(book => {
        html += `
            <div class="related-book-card" data-id="${book._id}">
                <div class="related-book-cover">
                    <img src="${book.coverImage}" alt="Cover of ${book.title}" loading="lazy">
                </div>
                <div class="related-book-info">
                    <h4>${book.title}</h4>
                    <p>${book.author}</p>
                    <div class="related-book-rating">
                        <i class="fas fa-star"></i> ${book.rating || '4.5'}
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    relatedBooksContainer.innerHTML = html;
    
    // Add click event to related books
    const relatedBookCards = relatedBooksContainer.querySelectorAll('.related-book-card');
    relatedBookCards.forEach(card => {
        card.addEventListener('click', () => {
            const bookId = card.dataset.id;
            
            // If it's a temporary book, store it in localStorage
            if (bookId.startsWith('temp_')) {
                // Find the book data from our sample books
                const genre = bookId.includes('fiction') ? 'Fiction' : 
                              bookId.includes('nonfiction') ? 'Non-Fiction' : 'Science';
                
                const allSampleBooks = [
                    ...getSampleRelatedBooks('fiction', ''),
                    ...getSampleRelatedBooks('non-fiction', ''),
                    ...getSampleRelatedBooks('science', '')
                ];
                
                const selectedBook = allSampleBooks.find(book => book._id === bookId);
                
                if (selectedBook) {
                    localStorage.setItem('previewBook', JSON.stringify(selectedBook));
                }
            }
            
            // Close current modal
            const modal = document.getElementById('bookDetailsModal');
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            
            // Show details for the clicked related book
            setTimeout(() => {
                showBookDetails(bookId);
            }, 300);
        });
    });
}

// ... existing code ...