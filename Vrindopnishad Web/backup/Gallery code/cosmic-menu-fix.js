/**
 * Fix cosmic menu search bar behavior
 */
document.addEventListener('DOMContentLoaded', () => {
  // Find search elements
  const searchToggle = document.querySelector('.cosmic-search-toggle');
  const searchOverlay = document.querySelector('.cosmic-search-overlay');
  const searchInput = document.querySelector('.cosmic-search-input');
  const searchClose = document.querySelector('.cosmic-search-close');
  
  if (!searchToggle || !searchOverlay) {
    // Create the search overlay if it doesn't exist
    createSearchOverlay();
  }
  
  // Initialize after ensuring elements exist
  initSearchBehavior();
  
  // Mobile specific fixes
  if (window.innerWidth <= 768) {
    // Ensure we always have working search on mobile
    if (!searchToggle || !searchOverlay) {
      createSearchOverlay();
    }
    
    // Fix mobile menu position and scroll issue
    const mobileMenu = document.querySelector('.cosmic-mobile-menu');
    if (mobileMenu) {
      mobileMenu.style.maxHeight = '85vh';
      mobileMenu.style.overflowY = 'auto';
      mobileMenu.style.webkitOverflowScrolling = 'touch';
    }
    
    // Ensure menus are dismissed when navigating
    const menuLinks = document.querySelectorAll('.cosmic-nav-links a, .cosmic-mobile-menu a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Close mobile menu
        const mobileMenu = document.querySelector('.cosmic-mobile-menu');
        if (mobileMenu) {
          mobileMenu.classList.remove('active');
        }
        
        // Close search overlay
        if (searchOverlay) {
          searchOverlay.classList.remove('active');
        }
      });
    });
  }
  
  function createSearchOverlay() {
    // Create search overlay
    const overlay = document.createElement('div');
    overlay.className = 'cosmic-search-overlay';
    overlay.innerHTML = `
      <div class="cosmic-search-container">
        <input type="text" class="cosmic-search-input" placeholder="Search...">
        <button class="cosmic-search-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    // Add to body
    document.body.appendChild(overlay);
  }
  
  function initSearchBehavior() {
    // Re-select elements in case they were just created
    const searchToggle = document.querySelector('.cosmic-search-toggle');
    const searchOverlay = document.querySelector('.cosmic-search-overlay');
    const searchInput = document.querySelector('.cosmic-search-input');
    const searchClose = document.querySelector('.cosmic-search-close');
    
    if (!searchToggle || !searchOverlay) return;
    
    // Show search on toggle click
    searchToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      searchOverlay.classList.add('active');
      setTimeout(() => {
        searchInput?.focus();
      }, 300);
    });
    
    // Close on close button click
    if (searchClose) {
      searchClose.addEventListener('click', (e) => {
        e.stopPropagation();
        searchOverlay.classList.remove('active');
      });
    }
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (searchOverlay.classList.contains('active')) {
        // Check if the click is outside the search container
        const searchContainer = document.querySelector('.cosmic-search-container');
        if (searchContainer && !searchContainer.contains(e.target) && 
            !searchToggle.contains(e.target)) {
          searchOverlay.classList.remove('active');
        }
      }
    });
    
    // Prevent clicks inside from closing
    searchOverlay.addEventListener('click', (e) => {
      const searchContainer = document.querySelector('.cosmic-search-container');
      if (searchContainer && searchContainer.contains(e.target)) {
        e.stopPropagation();
      }
    });
  }
}); 