/**
 * Custom Cursor for Websites
 * This script creates a custom cursor element that follows the mouse movement.
 * It automatically detects if the device supports hover (non-touch devices) and
 * only enables the custom cursor on those devices.
 */

// Custom Cursor Implementation
const CustomCursor = {
    // Store cursor element and state
    cursorElement: null,
    isEnabled: false,
    hasTouchCapability: false,
    hasHoverCapability: false,
    
    // Initialize the custom cursor
    init: function() {
        // Detect device capabilities
        this.detectDeviceCapabilities();
        
        // If device supports hover and is not primarily touch-based, create the cursor
        if (this.hasHoverCapability && !this.hasTouchCapability) {
            this.create();
            this.setupEventListeners();
            this.isEnabled = true;
            console.log('Custom cursor enabled');
        } else {
            console.log('Touch device detected, custom cursor disabled');
        }
    },
    
    // Detect if the device is touch-capable or supports hover
    detectDeviceCapabilities: function() {
        // Check for touch capability
        this.hasTouchCapability = (('ontouchstart' in window) || 
                                 (navigator.maxTouchPoints > 0) || 
                                 (navigator.msMaxTouchPoints > 0));
        
        // Check for hover capability using media query
        const mediaQuery = window.matchMedia('(hover: hover)');
        this.hasHoverCapability = mediaQuery.matches;
        
        // Log device capabilities
        console.log(`Device capabilities - Touch: ${this.hasTouchCapability}, Hover: ${this.hasHoverCapability}`);
    },
    
    // Create cursor element
    create: function() {
        // Create cursor element if it doesn't exist
        if (!document.getElementById('cursor')) {
            this.cursorElement = document.createElement('div');
            this.cursorElement.id = 'cursor';
            this.cursorElement.className = 'cursor';
            document.body.appendChild(this.cursorElement);
        } else {
            this.cursorElement = document.getElementById('cursor');
        }
        
        // Add CSS for cursor if not already defined
        if (!document.getElementById('cursor-styles')) {
            const style = document.createElement('style');
            style.id = 'cursor-styles';
            style.textContent = `
                .cursor {
                    position: fixed;
                    height: 40px;
                    width: 40px;
                    background-color: rgba(255, 255, 255, 0.2);
                    border: 2px solid var(--primary-color, #ff5722);
                    border-radius: 50%;
                    margin-left: -20px;
                    margin-top: -20px;
                    z-index: 1000;
                    backdrop-filter: invert(1);
                    pointer-events: none;
                    opacity: 0;
                    transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease;
                }
                
                .cursor.active {
                    transform: scale(0.5);
                    background-color: var(--primary-color, #ff5722);
                    border-color: transparent;
                    backdrop-filter: none;
                }
                
                body.has-custom-cursor {
                    cursor: none;
                }
                
                body.has-custom-cursor a,
                body.has-custom-cursor button,
                body.has-custom-cursor input,
                body.has-custom-cursor .btn,
                body.has-custom-cursor [role="button"],
                body.has-custom-cursor .clickable {
                    cursor: none;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add class to body to indicate custom cursor is active
        document.body.classList.add('has-custom-cursor');
    },
    
    // Set up event listeners for cursor
    setupEventListeners: function() {
        // Move cursor with mouse movement (with slight delay for effect)
        window.addEventListener("mousemove", (e) => {
            if (!this.cursorElement) return;
            
            setTimeout(() => {
                this.cursorElement.style.top = `${e.clientY}px`;
                this.cursorElement.style.left = `${e.clientX}px`;
            }, 50);
    
            // Ensure cursor is visible after first move
            if (parseFloat(this.cursorElement.style.opacity) === 0) {
                this.cursorElement.style.opacity = '1';
            }
    
            // Get element under cursor
            const target = e.target;
            
            // Change cursor effect on interactive elements
            if (target.tagName === 'A' || 
                target.tagName === 'BUTTON' || 
                target.classList.contains('btn') || 
                target.closest('[role="button"]') ||
                target.classList.contains('clickable') ||
                target.hasAttribute('data-cursor-active')) {
                this.cursorElement.classList.add("active");
            } else {
                this.cursorElement.classList.remove("active");
            }
        });
    
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            if (this.cursorElement) {
                this.cursorElement.style.opacity = '0';
            }
        });
    
        // Show cursor when entering window
        document.addEventListener('mouseenter', () => {
            if (this.cursorElement) {
                this.cursorElement.style.opacity = '1';
            }
        });
        
        // Handle window resize and orientation change
        window.addEventListener('resize', () => {
            this.detectDeviceCapabilities();
            this.updateVisibility();
        });
        
        window.addEventListener('orientationchange', () => {
            this.detectDeviceCapabilities();
            this.updateVisibility();
        });
    },
    
    // Update cursor visibility based on device capability
    updateVisibility: function() {
        if (this.hasHoverCapability && !this.hasTouchCapability) {
            if (!this.isEnabled) {
                this.create();
                this.isEnabled = true;
                document.body.classList.add('has-custom-cursor');
                console.log('Custom cursor enabled');
            }
        } else {
            if (this.isEnabled) {
                this.isEnabled = false;
                if (this.cursorElement) {
                    this.cursorElement.style.display = 'none';
                }
                document.body.classList.remove('has-custom-cursor');
                console.log('Custom cursor disabled');
            }
        }
    },
    
    // Define functions to manually enable/disable cursor
    enable: function() {
        if (!this.cursorElement) {
            this.create();
        }
        this.cursorElement.style.display = 'block';
        document.body.classList.add('has-custom-cursor');
        this.isEnabled = true;
    },
    
    disable: function() {
        if (this.cursorElement) {
            this.cursorElement.style.display = 'none';
        }
        document.body.classList.remove('has-custom-cursor');
        this.isEnabled = false;
    }
};

// Initialize custom cursor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    CustomCursor.init();
});

// Export for use in other modules if needed
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = CustomCursor;
} else {
    window.CustomCursor = CustomCursor;
} 