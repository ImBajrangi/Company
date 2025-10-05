// Cosmic Navigation - Modern responsive menu
document.addEventListener('DOMContentLoaded', () => {
  // Create and append the menu
  createCosmicMenu();
  
  // Initialize menu functionality
  initCosmicMenu();
});

function createCosmicMenu() {
  // Create menu container
  const menuContainer = document.createElement('div');
  menuContainer.className = 'cosmic-nav-container';
  
  // Menu HTML structure
  menuContainer.innerHTML = `
    <nav class="cosmic-navbar">
      <div class="cosmic-logo">
        <img src="./image/icon_main_02.png" alt="Cosmic Gallery">
        <div class="cosmic-logo-text">Cosmic Gallery</div>
      </div>
      
      <ul class="cosmic-nav-links">
        <li><a href="index.html" class="active">Home</a></li>
        <li><a href="Gallery.html">Gallery</a></li>
        <li class="cosmic-dropdown">
          <a href="#">Collections</a>
          <div class="cosmic-dropdown-content">
            <a href="#">Nebulae</a>
            <a href="#">Galaxies</a>
            <a href="#">Solar System</a>
            <a href="#">Deep Space</a>
          </div>
        </li>
        <li><a href="about.html">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
      
      <div class="cosmic-nav-icons">
        <div class="cosmic-nav-icon cosmic-search-toggle">
          <i class="fas fa-search"></i>
        </div>
        <div class="cosmic-nav-icon">
          <i class="fas fa-user"></i>
        </div>
      </div>
      
      <div class="cosmic-menu-toggle">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
    
    <!-- Mobile Menu -->
    <div class="cosmic-mobile-menu">
      <ul>
        <li><a href="index.html" class="active">Home</a></li>
        <li><a href="Gallery.html">Gallery</a></li>
        <li class="cosmic-mobile-dropdown">
          <a href="#">Collections</a>
          <div class="cosmic-mobile-dropdown-content">
            <a href="#">Nebulae</a>
            <a href="#">Galaxies</a>
            <a href="#">Solar System</a>
            <a href="#">Deep Space</a>
          </div>
        </li>
        <li><a href="about.html">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </div>
    
    <!-- Overlay -->
    <div class="cosmic-overlay"></div>
    
    <!-- Search Overlay -->
    <div class="cosmic-search-overlay">
      <div class="cosmic-search-close">
        <i class="fas fa-times"></i>
      </div>
      <form class="cosmic-search-form">
        <input type="text" class="cosmic-search-input" placeholder="Search the cosmos...">
      </form>
    </div>
  `;
  
  // Insert at the beginning of the body
  document.body.insertBefore(menuContainer, document.body.firstChild);
  
  // Add FontAwesome if not already loaded
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesome);
  }
}

function initCosmicMenu() {
  // Elements
  const menuToggle = document.querySelector('.cosmic-menu-toggle');
  const mobileMenu = document.querySelector('.cosmic-mobile-menu');
  const overlay = document.querySelector('.cosmic-overlay');
  const searchToggle = document.querySelector('.cosmic-search-toggle');
  const searchOverlay = document.querySelector('.cosmic-search-overlay');
  const searchClose = document.querySelector('.cosmic-search-close');
  const navbar = document.querySelector('.cosmic-navbar');
  const mobileDropdowns = document.querySelectorAll('.cosmic-mobile-dropdown > a');
  
  // Set active menu item based on current page
  setActiveMenuItem();
  
  // Toggle mobile menu
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close mobile menu when clicking overlay
  overlay.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  // Toggle search overlay
  searchToggle.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      document.querySelector('.cosmic-search-input').focus();
    }, 300);
  });
  
  // Close search overlay
  searchClose.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  // Handle scroll to change navbar style
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  // Mobile dropdowns
  mobileDropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = dropdown.parentElement;
      parent.classList.toggle('open');
    });
  });
}

function setActiveMenuItem() {
  // Get current page
  const currentLocation = window.location.pathname;
  const menuItems = document.querySelectorAll('.cosmic-nav-links a, .cosmic-mobile-menu a');
  
  menuItems.forEach(item => {
    // Remove active class
    item.classList.remove('active');
    
    // Get href value
    const href = item.getAttribute('href');
    
    // Check if this is the current page
    if (href && currentLocation.includes(href) && href !== '#') {
      item.classList.add('active');
    }
    
    // Set Home as active if we're on the root
    if ((currentLocation === '/' || currentLocation.includes('index.html')) && href === 'index.html') {
      item.classList.add('active');
    }
  });
} 