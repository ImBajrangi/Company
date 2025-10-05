/* ========================================
   RIPPLE EFFECT METHODS - JAVASCRIPT IMPLEMENTATIONS
   ======================================== */

/* ========================================
   METHOD 1: CSS CUSTOM PROPERTIES (RECOMMENDED)
   ======================================== */
function initializeCSSRipple() {
    const rippleButtons = document.querySelectorAll('.ripple-btn');
    
    rippleButtons.forEach(button => {
        let isHovering = false;
        let rippleTimeout = null;

        button.addEventListener('mouseenter', function(e) {
            isHovering = true;
            
            if (rippleTimeout) {
                clearTimeout(rippleTimeout);
            }

            // Calculate precise entry position
            const rect = button.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            button.style.setProperty('--ripple-x', x + '%');
            button.style.setProperty('--ripple-y', y + '%');

            button.classList.remove('ripple-shrinking');
            button.classList.add('ripple-expanding');
        });

        button.addEventListener('mousemove', function(e) {
            if (isHovering) {
                const rect = button.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;

                button.style.setProperty('--ripple-x', x + '%');
                button.style.setProperty('--ripple-y', y + '%');
            }
        });

        button.addEventListener('mouseleave', function(e) {
            isHovering = false;

            const rect = button.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            button.style.setProperty('--ripple-x', x + '%');
            button.style.setProperty('--ripple-y', y + '%');

            button.classList.remove('ripple-expanding');
            button.classList.add('ripple-shrinking');

            rippleTimeout = setTimeout(function() {
                button.classList.remove('ripple-shrinking');
                button.style.removeProperty('--ripple-x');
                button.style.removeProperty('--ripple-y');
            }, 500);
        });
    });
}

/* ========================================
   METHOD 2: JAVASCRIPT-BASED DYNAMIC COLOR CHANGES
   ======================================== */
function initializeDynamicRipple() {
    const rippleButtons = document.querySelectorAll('.ripple-btn');
    
    rippleButtons.forEach(button => {
        let isHovering = false;
        let rippleTimeout = null;

        button.addEventListener('mouseenter', function(e) {
            isHovering = true;
            
            // Dynamic text color change
            const textElement = button.querySelector('.btn-text');
            if (textElement) {
                // Get button's background color to determine text color
                const bgColor = getComputedStyle(button).backgroundColor;
                const isLightBg = isLightColor(bgColor);
                textElement.style.color = isLightBg ? '#2c3e50' : 'white';
            }
            
            if (rippleTimeout) clearTimeout(rippleTimeout);
            
            const rect = button.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            button.style.setProperty('--ripple-x', x + '%');
            button.style.setProperty('--ripple-y', y + '%');
            button.classList.add('ripple-expanding');
        });

        button.addEventListener('mouseleave', function(e) {
            isHovering = false;
            
            // Reset text color
            const textElement = button.querySelector('.btn-text');
            if (textElement) {
                textElement.style.color = ''; // Reset to original
            }
            
            const rect = button.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            button.style.setProperty('--ripple-x', x + '%');
            button.style.setProperty('--ripple-y', y + '%');

            button.classList.remove('ripple-expanding');
            button.classList.add('ripple-shrinking');

            rippleTimeout = setTimeout(function() {
                button.classList.remove('ripple-shrinking');
                button.style.removeProperty('--ripple-x');
                button.style.removeProperty('--ripple-y');
            }, 500);
        });
    });
}

/* ========================================
   METHOD 3: THEME-BASED RIPPLE SYSTEM
   ======================================== */
function initializeThemeRipple() {
    const rippleButtons = document.querySelectorAll('.ripple-btn');
    
    rippleButtons.forEach(button => {
        let isHovering = false;
        let rippleTimeout = null;

        // Determine theme based on button classes
        const theme = getButtonTheme(button);

        button.addEventListener('mouseenter', function(e) {
            isHovering = true;
            
            // Apply theme-specific colors
            applyThemeColors(button, theme, true);
            
            if (rippleTimeout) clearTimeout(rippleTimeout);
            
            const rect = button.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            button.style.setProperty('--ripple-x', x + '%');
            button.style.setProperty('--ripple-y', y + '%');
            button.classList.add('ripple-expanding');
        });

        button.addEventListener('mouseleave', function(e) {
            isHovering = false;
            
            // Reset theme colors
            applyThemeColors(button, theme, false);
            
            const rect = button.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            button.style.setProperty('--ripple-x', x + '%');
            button.style.setProperty('--ripple-y', y + '%');

            button.classList.remove('ripple-expanding');
            button.classList.add('ripple-shrinking');

            rippleTimeout = setTimeout(function() {
                button.classList.remove('ripple-shrinking');
                button.style.removeProperty('--ripple-x');
                button.style.removeProperty('--ripple-y');
            }, 500);
        });
    });
}

/* ========================================
   METHOD 4: ADVANCED RIPPLE WITH MULTIPLE EFFECTS
   ======================================== */
function initializeAdvancedRipple() {
    const rippleButtons = document.querySelectorAll('.ripple-btn');
    
    rippleButtons.forEach(button => {
        let isHovering = false;
        let rippleTimeout = null;
        let animationFrame = null;

        button.addEventListener('mouseenter', function(e) {
            isHovering = true;
            
            // Add multiple effects
            addRippleEffects(button, e);
            
            if (rippleTimeout) clearTimeout(rippleTimeout);
            
            const rect = button.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            button.style.setProperty('--ripple-x', x + '%');
            button.style.setProperty('--ripple-y', y + '%');
            button.classList.add('ripple-expanding');
        });

        button.addEventListener('mousemove', function(e) {
            if (isHovering && animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            
            if (isHovering) {
                animationFrame = requestAnimationFrame(() => {
                    updateRipplePosition(button, e);
                });
            }
        });

        button.addEventListener('mouseleave', function(e) {
            isHovering = false;
            
            // Remove effects
            removeRippleEffects(button);
            
            const rect = button.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            button.style.setProperty('--ripple-x', x + '%');
            button.style.setProperty('--ripple-y', y + '%');

            button.classList.remove('ripple-expanding');
            button.classList.add('ripple-shrinking');

            rippleTimeout = setTimeout(function() {
                button.classList.remove('ripple-shrinking');
                button.style.removeProperty('--ripple-x');
                button.style.removeProperty('--ripple-y');
            }, 500);
        });
    });
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

// Helper function to determine if a color is light
function isLightColor(rgb) {
    const rgbArray = rgb.match(/\d+/g);
    if (!rgbArray || rgbArray.length < 3) return false;
    
    const r = parseInt(rgbArray[0]);
    const g = parseInt(rgbArray[1]);
    const b = parseInt(rgbArray[2]);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
}

// Helper function to get button theme
function getButtonTheme(button) {
    if (button.classList.contains('blue')) return 'blue';
    if (button.classList.contains('dark')) return 'dark';
    if (button.classList.contains('green')) return 'green';
    if (button.classList.contains('purple')) return 'purple';
    if (button.classList.contains('orange')) return 'orange';
    return 'default';
}

// Helper function to apply theme colors
function applyThemeColors(button, theme, isExpanding) {
    const textElement = button.querySelector('.btn-text');
    if (!textElement) return;
    
    const themes = {
        blue: { normal: 'white', ripple: '#2c3e50' },
        dark: { normal: 'white', ripple: 'white' },
        green: { normal: 'white', ripple: '#1e8449' },
        purple: { normal: 'white', ripple: '#8e44ad' },
        orange: { normal: 'white', ripple: '#d35400' },
        default: { normal: 'white', ripple: '#2c3e50' }
    };
    
    const colors = themes[theme] || themes.default;
    textElement.style.color = isExpanding ? colors.ripple : colors.normal;
}

// Helper function to add ripple effects
function addRippleEffects(button, event) {
    // Add glow effect
    button.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.3)';
    
    // Add scale effect
    button.style.transform = 'scale(1.05)';
    
    // Add sound effect (if audio is available)
    playRippleSound();
}

// Helper function to remove ripple effects
function removeRippleEffects(button) {
    button.style.boxShadow = '';
    button.style.transform = '';
}

// Helper function to update ripple position
function updateRipplePosition(button, event) {
    const rect = button.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    button.style.setProperty('--ripple-x', x + '%');
    button.style.setProperty('--ripple-y', y + '%');
}

// Helper function to play ripple sound
function playRippleSound() {
    // You can add audio feedback here
    // const audio = new Audio('/sounds/ripple.mp3');
    // audio.volume = 0.1;
    // audio.play().catch(() => {}); // Ignore errors if audio fails
}

/* ========================================
   INITIALIZATION FUNCTIONS
   ======================================== */

// Initialize all ripple methods
function initializeAllRippleMethods() {
    // Method 1: CSS Custom Properties (Recommended)
    initializeCSSRipple();
    
    // Method 2: Dynamic Color Changes
    // initializeDynamicRipple();
    
    // Method 3: Theme-based System
    // initializeThemeRipple();
    
    // Method 4: Advanced Ripple
    // initializeAdvancedRipple();
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other scripts to load
    setTimeout(initializeAllRippleMethods, 100);
});

// Export functions for manual initialization
window.RippleMethods = {
    initializeCSSRipple,
    initializeDynamicRipple,
    initializeThemeRipple,
    initializeAdvancedRipple,
    initializeAllRippleMethods
};

