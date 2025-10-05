/**
 * Literary Hub Admin - Accessibility Features
 * Enhances the admin panel with accessibility features
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeAccessibility();
});

/**
 * Initialize all accessibility features
 */
function initializeAccessibility() {
    setupKeyboardNavigation();
    setupFocusManagement();
    setupScreenReaderAnnouncements();
    setupHighContrastDetection();
    setupReducedMotionDetection();
    setupFontSizeControls();
}

/**
 * Setup keyboard navigation for all interactive elements
 */
function setupKeyboardNavigation() {
    // Add keyboard navigation for form elements
    const formElements = document.querySelectorAll('input, select, textarea, button');
    
    formElements.forEach(element => {
        // Ensure all form elements have appropriate ARIA attributes
        if (element.type === 'text' || element.type === 'email' || element.type === 'password') {
            if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
                const label = document.querySelector(`label[for="${element.id}"]`);
                if (label) {
                    element.setAttribute('aria-labelledby', `${element.id}-label`);
                    label.id = `${element.id}-label`;
                }
            }
        }
        
        // Add keyboard event listeners for buttons
        if (element.tagName === 'BUTTON') {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        }
    });
    
    // Add keyboard navigation for list items
    const listItems = document.querySelectorAll('.items-list .item');
    
    listItems.forEach(item => {
        item.setAttribute('tabindex', '0');
        
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                // Find and click the edit button when Enter is pressed
                const editButton = item.querySelector('.edit-btn');
                if (editButton) {
                    editButton.click();
                }
            } else if (e.key === 'Delete') {
                // Find and click the delete button when Delete is pressed
                const deleteButton = item.querySelector('.delete-btn');
                if (deleteButton) {
                    deleteButton.click();
                }
            }
        });
    });
}

/**
 * Setup focus management for modals and dynamic content
 */
function setupFocusManagement() {
    // Store the last focused element before opening a modal
    window.lastFocusedElement = null;
    
    // Create a function to trap focus within a container
    window.trapFocus = function(container) {
        // Save the current focus
        window.lastFocusedElement = document.activeElement;
        
        // Find all focusable elements
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Focus the first element
        firstElement.focus();
        
        // Trap focus in the container
        container.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // If shift+tab and focus is on first element, move to last element
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // If tab and focus is on last element, move to first element
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            } else if (e.key === 'Escape') {
                // Close the modal on Escape key
                const closeButton = container.querySelector('.close-btn');
                if (closeButton) {
                    closeButton.click();
                }
            }
        });
    };
    
    // Create a function to restore focus
    window.restoreFocus = function() {
        if (window.lastFocusedElement) {
            window.lastFocusedElement.focus();
            window.lastFocusedElement = null;
        }
    };
}

/**
 * Setup screen reader announcements for dynamic content
 */
function setupScreenReaderAnnouncements() {
    // Create announcement regions
    const createAnnouncementRegion = (id, politeness) => {
        let region = document.getElementById(id);
        
        if (!region) {
            region = document.createElement('div');
            region.id = id;
            region.className = 'sr-only';
            region.setAttribute('aria-live', politeness);
            region.setAttribute('aria-atomic', 'true');
            document.body.appendChild(region);
        }
        
        return region;
    };
    
    // Create polite and assertive announcement regions
    const politeAnnouncement = createAnnouncementRegion('sr-polite', 'polite');
    const assertiveAnnouncement = createAnnouncementRegion('sr-assertive', 'assertive');
    
    // Create announcement functions
    window.announceToScreenReader = function(message, assertive = false) {
        const region = assertive ? assertiveAnnouncement : politeAnnouncement;
        region.textContent = message;
        
        // Clear after a delay
        setTimeout(() => {
            region.textContent = '';
        }, 3000);
    };
    
    // Announce page title on load
    window.announceToScreenReader(`Literary Hub Admin Panel loaded. ${document.title}`);
}

/**
 * Setup detection for high contrast mode
 */
function setupHighContrastDetection() {
    // Check if high contrast mode is enabled
    const highContrastQuery = window.matchMedia('(forced-colors: active)');
    
    function handleHighContrastChange(e) {
        if (e.matches) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }
    
    // Initial check
    handleHighContrastChange(highContrastQuery);
    
    // Listen for changes
    highContrastQuery.addEventListener('change', handleHighContrastChange);
}

/**
 * Setup detection for reduced motion preference
 */
function setupReducedMotionDetection() {
    // Check if reduced motion is preferred
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleReducedMotionChange(e) {
        if (e.matches) {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
    }
    
    // Initial check
    handleReducedMotionChange(reducedMotionQuery);
    
    // Listen for changes
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
}

/**
 * Setup font size controls for better readability
 */
function setupFontSizeControls() {
    // Create font size control container
    const fontSizeControls = document.createElement('div');
    fontSizeControls.className = 'font-size-controls';
    fontSizeControls.setAttribute('aria-label', 'Font size controls');
    
    // Create decrease button
    const decreaseBtn = document.createElement('button');
    decreaseBtn.className = 'font-size-btn decrease';
    decreaseBtn.innerHTML = '<i class="fas fa-minus"></i>';
    decreaseBtn.setAttribute('aria-label', 'Decrease font size');
    
    // Create reset button
    const resetBtn = document.createElement('button');
    resetBtn.className = 'font-size-btn reset';
    resetBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    resetBtn.setAttribute('aria-label', 'Reset font size');
    
    // Create increase button
    const increaseBtn = document.createElement('button');
    increaseBtn.className = 'font-size-btn increase';
    increaseBtn.innerHTML = '<i class="fas fa-plus"></i>';
    increaseBtn.setAttribute('aria-label', 'Increase font size');
    
    // Add buttons to container
    fontSizeControls.appendChild(decreaseBtn);
    fontSizeControls.appendChild(resetBtn);
    fontSizeControls.appendChild(increaseBtn);
    
    // Add container to the page
    const header = document.querySelector('header');
    if (header) {
        header.appendChild(fontSizeControls);
    }
    
    // Current font size factor (1 = 100%)
    let fontSizeFactor = 1;
    
    // Function to update font size
    function updateFontSize(factor) {
        document.documentElement.style.fontSize = `${16 * factor}px`;
        localStorage.setItem('literaryHubAdminFontSize', factor);
        window.announceToScreenReader(`Font size ${factor > 1 ? 'increased' : 'decreased'} to ${Math.round(factor * 100)}%`);
    }
    
    // Check for saved font size
    const savedFontSize = localStorage.getItem('literaryHubAdminFontSize');
    if (savedFontSize) {
        fontSizeFactor = parseFloat(savedFontSize);
        updateFontSize(fontSizeFactor);
    }
    
    // Add event listeners
    decreaseBtn.addEventListener('click', () => {
        if (fontSizeFactor > 0.8) {
            fontSizeFactor -= 0.1;
            updateFontSize(fontSizeFactor);
        }
    });
    
    resetBtn.addEventListener('click', () => {
        fontSizeFactor = 1;
        updateFontSize(fontSizeFactor);
        window.announceToScreenReader('Font size reset to default');
    });
    
    increaseBtn.addEventListener('click', () => {
        if (fontSizeFactor < 1.5) {
            fontSizeFactor += 0.1;
            updateFontSize(fontSizeFactor);
        }
    });
} 