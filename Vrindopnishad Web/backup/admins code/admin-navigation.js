/**
 * Literary Hub Admin - Navigation Handler
 * Handles navigation between different sections of the admin panel
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    handleHashChange();
    setupAccessibility();
});

/**
 * Initialize navigation event listeners
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add click event listeners to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the target section from the href attribute
            const targetId = link.getAttribute('href').substring(1);
            
            // Update URL hash
            window.location.hash = targetId;
            
            // Show the target section
            showSection(targetId);
            
            // Update active link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

/**
 * Handle hash changes in the URL
 */
function handleHashChange() {
    // Listen for hash changes in the URL
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            showSection(hash);
            
            // Update active link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${hash}`) {
                    link.classList.add('active');
                }
            });
        }
    });
    
    // Check if there's a hash in the URL on page load
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        showSection(hash);
        
        // Update active link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${hash}`) {
                link.classList.add('active');
            }
        });
    }
}

/**
 * Show the specified section and hide others
 * @param {string} sectionId - The ID of the section to show
 */
function showSection(sectionId) {
    // Map hash to section ID
    const sectionMap = {
        'gallery': 'gallery-section',
        'collection': 'collection-section',
        'users': 'users-section',
        'settings': 'settings-section'
    };
    
    const targetSectionId = sectionMap[sectionId] || sectionId;
    
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the target section
    const targetSection = document.getElementById(targetSectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Announce section change for screen readers
        announceForScreenReaders(`Navigated to ${targetSection.querySelector('h2').textContent}`);
        
        // Focus on the heading for better accessibility
        targetSection.querySelector('h2').focus();
    }
}

/**
 * Setup accessibility features
 */
function setupAccessibility() {
    // Add keyboard navigation for the nav links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('keydown', (e) => {
            // Enter or Space key
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                link.click();
            }
        });
    });
    
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to content';
    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const main = document.querySelector('main');
        main.setAttribute('tabindex', '-1');
        main.focus();
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Announce message for screen readers
 * @param {string} message - The message to announce
 */
function announceForScreenReaders(message) {
    let announcer = document.getElementById('sr-announcer');
    
    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'sr-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);
    }
    
    announcer.textContent = message;
    
    // Clear after a short delay
    setTimeout(() => {
        announcer.textContent = '';
    }, 3000);
} 