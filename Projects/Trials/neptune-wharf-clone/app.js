// Neptune Wharf Application JavaScript

// Application data
const neptuneWharfData = {
  site_info: {
    name: "Neptune Wharf",
    location: "Deptford, London SE8",
    address: "Neptune Wharf, Grinstead Road, London SE8 5FN",
    phone: "0203 770 2099",
    email: "info@neptunewharflondon.com"
  },
  apartments: [
    {
      type: "1 BED",
      status: "FULLY LET",
      size: "Up to 703 SQFT",
      price: "",
      description: "A perfect sanctuary for one or two, our one-bedroom apartments in Deptford offer modern city living at its finest. With bespoke furnishings, floor-to-ceiling windows, and premium appliances, you'll find everything you need in the heart of Deptford's vibrant new rental community.",
      features: ["FREE 1GB WI-FI", "FURNITURE PACKS AVAILABLE", "PRIVATE BALCONY", "SMEG INTEGRATED APPLIANCES"]
    },
    {
      type: "2 BED",
      status: "From £2,450 per month",
      size: "Up to 868 SQFT", 
      description: "Enjoy the added flexibility of our two bedroom apartments, where the extra space can be tailored to your needs. Whether used as a cozy second bedroom, a convenient home office, or a luxurious walk-in wardrobe, this adaptable area enhances your living experience.",
      uses: ["HOME OFFICE", "KIDS BEDROOM", "WALK-IN WARDROBE", "SECOND BEDROOM"],
      features: ["FREE 1GB WI-FI", "FURNITURE PACKS AVAILABLE", "PRIVATE BALCONY", "SMEG INTEGRATED APPLIANCES"]
    },
    {
      type: "2 BED PLUS",
      status: "From £2,630 per month",
      size: "Up to 1010 SQFT",
      description: "Calm, refined, and spacious, our two-bedroom plus apartments in Deptford provide plenty of room to enjoy urban living together or relax in private. With abundant natural light and striking views over Deptford Park and Canary Wharf.",
      features: ["FREE 1GB WI-FI", "FURNITURE PACKS AVAILABLE", "PRIVATE BALCONY", "SMEG INTEGRATED APPLIANCES"]
    },
    {
      type: "3 BED",
      status: "FULLY LET",
      size: "Up to 801 SQFT",
      description: "The ideal blend of space and style, our three-bedroom apartments in Deptford are perfect for families or professionals. Located in a thriving new rental community, these homes feature balconies and full-height glazing throughout.",
      features: ["FREE 1GB WI-FI", "FURNITURE PACKS AVAILABLE", "PRIVATE BALCONY", "SMEG INTEGRATED APPLIANCES"]
    }
  ],
  amenities: [
    {name: "CO-WORKING SPACES", icon: "briefcase"},
    {name: "GAMES", icon: "gamepad-2"},
    {name: "ORGANISED SOCIAL EVENTS", icon: "users"},
    {name: "RESIDENTS APP", icon: "smartphone"},
    {name: "CHILDREN'S PLAYGROUND", icon: "baby"},
    {name: "COMMUNAL LOUNGE", icon: "sofa"},
    {name: "CINEMA ROOM", icon: "film"},
    {name: "ON-SITE SHOPPING", icon: "shopping-bag"},
    {name: "ON-SITE MANAGEMENT", icon: "user-check"},
    {name: "LANDSCAPED COURTYARDS", icon: "trees"}
  ],
  neighbourhood: {
    area: "Deptford, London",
    description: "Immerse yourself in a neighbourhood brimming with the vibrant energy of urban street life. This area is filled with bustling market stalls, artsy bars and a wide array of unique coffee spots and eateries.",
    categories: [
      "ARTS & CULTURE",
      "BARS & PUBS", 
      "COFFEE SHOPS",
      "DINING & RESTAURANTS",
      "GREEN SPACES",
      "SHOPS",
      "HEALTH & WELLBEING",
      "TRANSPORT",
      "EDUCATION"
    ],
    transport: {
      canary_wharf: "30 minutes",
      bank_station: "40 minutes", 
      waterloo: "30 minutes",
      london_bridge: "30 minutes"
    }
  },
  features: [
    "OVERLOOKING DEPTFORD PARK",
    "FREE 1GB WI-FI",
    "FLEXIBLE FURNITURE OPTIONS",
    "PARKING AVAILABLE",
    "CHILDREN'S PLAYGROUND",
    "SECURE BIKE STORAGE",
    "CITY SKYLINE VIEWS",
    "PETS WELCOME FREE OF CHARGE",
    "ON-SITE MANAGEMENT",
    "VIBRANT COMMUNITY"
  ]
};

// Application state
let currentPage = 'home';
let isAnimating = false;
let mobileMenuOpen = false;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing Neptune Wharf Application...');
  
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Initialize all components
  initializeNavigation();
  initializeMobileMenu();
  initializeScrollEffects();
  initializeForms();
  initializeFAQs();
  initializeAnimations();
  
  // Show home page by default
  showPage('home');

  console.log('Vrindopnishad application initialized successfully!');
});

// Navigation System
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link, [data-page]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', handleNavigation);
  });
  
  // CTA buttons navigation
  const ctaButtons = document.querySelectorAll('.cta-button[data-page], [data-page]');
  ctaButtons.forEach(button => {
    if (button.hasAttribute('data-page')) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const page = button.getAttribute('data-page');
        showPage(page);
      });
    }
  });
}

function handleNavigation(e) {
  e.preventDefault();
  const page = this.getAttribute('data-page') || this.getAttribute('href')?.substring(1);
  
  if (page) {
    showPage(page);
    
    // Close mobile menu if open
    if (mobileMenuOpen) {
      toggleMobileMenu();
    }
  }
}

function showPage(pageId) {
  if (isAnimating) return;
  
  isAnimating = true;
  currentPage = pageId;
  
  // Hide all pages with fade out
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    if (page.classList.contains('active')) {
      page.style.opacity = '0';
      page.style.transform = 'translateY(20px)';
    }
  });
  
  setTimeout(() => {
    // Hide all pages
    pages.forEach(page => {
      page.classList.remove('active');
      page.style.opacity = '';
      page.style.transform = '';
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active');
      targetPage.style.opacity = '0';
      targetPage.style.transform = 'translateY(20px)';
      
      // Animate in
      setTimeout(() => {
        targetPage.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        targetPage.style.opacity = '1';
        targetPage.style.transform = 'translateY(0)';
        
        setTimeout(() => {
          targetPage.style.transition = '';
          isAnimating = false;
        }, 500);
      }, 50);
    } else {
      isAnimating = false;
    }
    
    // Update navigation active states
    updateNavigation(pageId);
    
    // Initialize page-specific functionality
    initializePageSpecific(pageId);
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
  }, 200);
}

function updateNavigation(activePageId) {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === activePageId) {
      link.classList.add('active');
    }
  });
}

function initializePageSpecific(pageId) {
  switch (pageId) {
    case 'home':
      initializeHomeAnimations();
      break;
    case 'apartments':
      initializeApartmentCards();
      break;
    case 'amenities':
      initializeAmenityCards();
      break;
    case 'neighbourhood':
      initializeNeighbourhoodEffects();
      break;
    case 'contact':
      initializeContactPage();
      break;
    case 'faqs':
      initializeFAQs();
      break;
  }
}

// Mobile Menu
function initializeMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  if (!mobileMenuToggle) return;
  
  // Clear any existing content
  mobileMenuToggle.innerHTML = '';
  
  // Create initial menu icon
  const icon = document.createElement('i');
  icon.setAttribute('data-lucide', 'menu');
  mobileMenuToggle.appendChild(icon);
  
  // Initialize state
  mobileMenuOpen = false;
  mobileMenuToggle.setAttribute('aria-expanded', 'false');
  mobileMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
  
  // Add click handler
  mobileMenuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMobileMenu();
  });
  
  // Create initial Lucide icon
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

function closeMenuOutside(e) {
  const nav = document.getElementById('nav');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  
  // Check if click is outside both the nav and the toggle button
  if (nav && mobileMenuToggle && 
      !nav.contains(e.target) && 
      !mobileMenuToggle.contains(e.target)) {
    toggleMobileMenu();
  }
}

function toggleMobileMenu() {
  const nav = document.getElementById('nav');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const body = document.body;
  
  // Check if elements exist
  if (!nav || !mobileMenuToggle) return;
  
  // Toggle menu state
  mobileMenuOpen = !mobileMenuOpen;
  
  // Toggle navigation
  nav.classList.toggle('active');
  body.style.overflow = mobileMenuOpen ? 'hidden' : '';
  
  // Update icon
  const icon = mobileMenuToggle.querySelector('i');
  if (icon) {
    icon.setAttribute('data-lucide', mobileMenuOpen ? 'x' : 'menu');
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
  
  // Update accessibility
  mobileMenuToggle.setAttribute('aria-expanded', mobileMenuOpen.toString());
}

// Scroll Effects
function initializeScrollEffects() {
  const header = document.getElementById('header');
  let lastScrollY = window.scrollY;
  
  // Header scroll effects
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    if (header) {
      // Add scrolled class for styling
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      // Hide/show header on scroll direction
      if (scrollY > lastScrollY && scrollY > 200) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
    }
    
    lastScrollY = scrollY;
  });
  
  // Fade-in animations on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  // Observe elements for fade-in effects
  const fadeElements = document.querySelectorAll('.apartment-card, .amenity-card, .feature-item, .category-item, .contact-item');
  fadeElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
}

// Form Handling
function initializeForms() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }
  
  // Initialize apartment inquiry buttons
  const inquiryButtons = document.querySelectorAll('.apartment-btn:not(:disabled)');
  inquiryButtons.forEach(button => {
    button.addEventListener('click', handleApartmentInquiry);
  });
}

function handleContactForm(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  // Basic form validation
  if (!data.name || !data.email) {
    showNotification('Please fill in all required fields.', 'error');
    return;
  }
  
  if (!isValidEmail(data.email)) {
    showNotification('Please enter a valid email address.', 'error');
    return;
  }
  
  // Simulate form submission
  const submitButton = e.target.querySelector('.btn--primary');
  const originalText = submitButton.textContent;
  
  submitButton.textContent = 'Sending...';
  submitButton.disabled = true;
  
  setTimeout(() => {
    showNotification('Thank you for your inquiry! We will contact you soon.', 'success');
    e.target.reset();
    
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }, 2000);
}

function handleApartmentInquiry(e) {
  e.preventDefault();
  
  // Get apartment type from card
  const apartmentCard = e.target.closest('.apartment-card');
  const apartmentType = apartmentCard?.querySelector('h3')?.textContent || 'Apartment';
  
  // Show inquiry notification
  showNotification(`Thank you for your interest in our ${apartmentType}! Our team will contact you soon.`, 'success');
  
  // In a real application, this would open a contact form or modal
  // For now, we'll scroll to the contact section
  setTimeout(() => {
    showPage('contact');
  }, 1500);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 2000;
    transform: translateX(400px);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    max-width: 400px;
    font-weight: 500;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Auto remove
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 4000);
}

// FAQs Functionality
function initializeFAQs() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        toggleFAQ(item);
      });
    }
  });
}

function toggleFAQ(item) {
  const isActive = item.classList.contains('active');
  
  // Close all FAQ items
  document.querySelectorAll('.faq-item').forEach(faqItem => {
    faqItem.classList.remove('active');
  });
  
  // Open clicked item if it wasn't active
  if (!isActive) {
    item.classList.add('active');
  }
}

// Animation Functions
function initializeAnimations() {
  // Add CSS for smooth transitions
  const style = document.createElement('style');
  style.textContent = `
    .fade-in {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    .apartment-card,
    .amenity-card,
    .feature-item,
    .category-item {
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .notification {
      font-family: var(--font-family-base);
      font-size: 14px;
      line-height: 1.4;
    }
  `;
  document.head.appendChild(style);
}

function initializeHomeAnimations() {
  // Stagger animation for feature items
  const featureItems = document.querySelectorAll('.feature-item');
  featureItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      item.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

function initializeApartmentCards() {
  // Animate apartment cards
  const apartmentCards = document.querySelectorAll('.apartment-card');
  apartmentCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 200);
  });
}

function initializeAmenityCards() {
  // Animate amenity cards
  const amenityCards = document.querySelectorAll('.amenity-card');
  amenityCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.9) translateY(20px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.opacity = '1';
      card.style.transform = 'scale(1) translateY(0)';
    }, index * 100);
  });
}

function initializeNeighbourhoodEffects() {
  // Animate category items
  const categoryItems = document.querySelectorAll('.category-item');
  categoryItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(25px)';
    
    setTimeout(() => {
      item.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, index * 80);
  });
  
  // Animate transport items
  const transportItems = document.querySelectorAll('.transport-item');
  transportItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    
    setTimeout(() => {
      item.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }, 500 + (index * 150));
  });
}

function initializeContactPage() {
  // Animate contact items
  const contactItems = document.querySelectorAll('.contact-item');
  contactItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    
    setTimeout(() => {
      item.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }, index * 150);
  });
  
  // Animate contact form
  const contactForm = document.querySelector('.contact-form-container');
  if (contactForm) {
    contactForm.style.opacity = '0';
    contactForm.style.transform = 'translateY(40px)';
    
    setTimeout(() => {
      contactForm.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      contactForm.style.opacity = '1';
      contactForm.style.transform = 'translateY(0)';
    }, 300);
  }
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Enhanced scroll performance
const debouncedScroll = debounce(() => {
  // Additional scroll-based animations can be added here
  const scrolled = window.pageYOffset;
  
  // Parallax effect for hero background
  const hero = document.querySelector('.hero');
  if (hero && scrolled < window.innerHeight) {
    const rate = scrolled * -0.3;
    hero.style.transform = `translateY(${rate}px)`;
  }
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Smooth scroll for anchor links
document.addEventListener('click', function(e) {
  // Handle smooth scrolling for any anchor links
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
  // ESC key handling
  if (e.key === 'Escape') {
    if (mobileMenuOpen) {
      toggleMobileMenu();
    }
  }
  
  // Tab navigation enhancement
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

// Remove keyboard navigation class on mouse click
document.addEventListener('mousedown', function() {
  document.body.classList.remove('keyboard-navigation');
});

// Handle window resize
const debouncedResize = debounce(() => {
  // Close mobile menu on resize to desktop
  if (window.innerWidth > 768 && mobileMenuOpen) {
    toggleMobileMenu();
  }
}, 250);

window.addEventListener('resize', debouncedResize);

// Performance optimization: Preload critical resources
function preloadCriticalResources() {
  const preloadLinks = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://unpkg.com/lucide@latest/dist/umd/lucide.js'
  ];
  
  preloadLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });
}

// Initialize preloading on page load
window.addEventListener('load', preloadCriticalResources);

// Accessibility enhancements
function enhanceAccessibility() {
  // Add ARIA labels and roles where needed
  const menuButton = document.getElementById('mobileMenuToggle');
  if (menuButton) {
    menuButton.setAttribute('aria-label', 'Toggle navigation menu');
    menuButton.setAttribute('aria-expanded', 'false');
  }
  
  // Add skip links for keyboard navigation
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--color-luxury-gold);
    color: var(--color-text-primary);
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 2000;
    transition: top 0.3s;
  `;
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  
  document.body.prepend(skipLink);
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// Error handling
window.addEventListener('error', function(e) {
  console.error('JavaScript error:', e.error);
  // In production, you might want to send this to an error reporting service
});

// Console welcome message
console.log('%c🏢 Neptune Wharf Application Loaded', 'color: #FFD700; font-size: 16px; font-weight: bold;');
console.log('%cWelcome to luxury living in Deptford, London', 'color: #666; font-size: 12px;');

// Export functions for potential external use
window.NeptuneWharf = {
  showPage,
  showNotification,
  toggleMobileMenu,
  data: neptuneWharfData
};