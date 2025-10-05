// Debug script - Add this temporarily to your HTML to check what's happening

console.log('=== DEBUG SCRIPT STARTED ===');

// Check if DOM elements exist
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Check for search elements
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    console.log('Search Elements Check:');
    console.log('- Search Toggle:', searchToggle);
    console.log('- Search Overlay:', searchOverlay);
    console.log('- Search Input:', searchInput);
    console.log('- Search Results:', searchResults);
    
    // Check for theme elements
    const themeToggle = document.querySelector('.theme-toggle');
    console.log('Theme Elements Check:');
    console.log('- Theme Toggle:', themeToggle);
    
    // Add manual click handlers for testing
    if (searchToggle) {
        searchToggle.addEventListener('click', () => {
            console.log('MANUAL: Search toggle clicked!');
            if (searchOverlay) {
                searchOverlay.classList.toggle('active');
                console.log('Search overlay active:', searchOverlay.classList.contains('active'));
            }
        });
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            console.log('MANUAL: Theme toggle clicked!');
            document.body.classList.toggle('dark-mode');
            console.log('Dark mode active:', document.body.classList.contains('dark-mode'));
            
            const icon = themeToggle.querySelector('i');
            if (icon) {
                const isDark = document.body.classList.contains('dark-mode');
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
                console.log('Icon updated to:', icon.className);
            }
        });
    }
    
    // Check if collection-data.js is loaded
    console.log('Collection data functions available:', typeof window.collectionPageFunctions);
    
    // Listen for all clicks to debug
    document.addEventListener('click', (e) => {
        if (e.target.matches('.search-toggle, .theme-toggle')) {
            console.log('Click detected on:', e.target.className);
            console.log('Event target:', e.target);
        }
    });
});

// Check if scripts are loading properly
window.addEventListener('load', () => {
    console.log('Window loaded');
    console.log('All scripts loaded');
});

// Check for any errors
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    console.error('Error in file:', e.filename);
    console.error('Error at line:', e.lineno);
});

console.log('=== DEBUG SCRIPT SETUP COMPLETE ===');