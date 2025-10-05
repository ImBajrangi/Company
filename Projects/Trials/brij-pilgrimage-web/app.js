// Application data from JSON
const applicationData = {
  tours: [
    {
      id: 1,
      name: "Vrindavan Temple Tour",
      description: "Sacred journey through Krishna's divine land with expert guides",
      duration: "Full Day (8-10 hours)",
      price: "₹2,500",
      category: "temple",
      highlights: ["Krishna Janmabhoomi", "Banke Bihari Temple", "ISKCON Temple", "Nidhivan", "Radha Raman Temple"],
      inclusions: ["AC Transportation", "Professional Guide", "Temple Entry Fees", "Vegetarian Lunch"],
      itinerary: [
        "6:00 AM - Departure from Delhi",
        "9:00 AM - Krishna Janmabhoomi Darshan",
        "10:30 AM - Banke Bihari Temple",
        "12:00 PM - Vegetarian Lunch",
        "1:30 PM - ISKCON Temple Tour",
        "3:00 PM - Nidhivan Visit",
        "4:30 PM - Radha Raman Temple",
        "6:00 PM - Return Journey"
      ]
    },
    {
      id: 2,
      name: "Mathura Holi Celebrations",
      description: "Experience the divine colors of Holi in Krishna's birthplace",
      duration: "3 Days / 2 Nights",
      price: "₹8,500",
      category: "festival",
      highlights: ["Lathmar Holi at Barsana", "Cultural Programs", "Traditional Cuisine", "Folk Dance", "Heritage Tours"],
      inclusions: ["Hotel Accommodation", "All Meals", "Transportation", "Festival Participation", "Cultural Guide"],
      itinerary: [
        "Day 1: Arrival and Mathura exploration",
        "Day 2: Barsana Lathmar Holi celebrations",
        "Day 3: Vrindavan temples and departure"
      ]
    },
    {
      id: 3,
      name: "Complete 84 Kos Parikrama",
      description: "Traditional circumambulation of entire Brij region",
      duration: "7 Days / 6 Nights",
      price: "₹15,000",
      category: "pilgrimage",
      highlights: ["All 84 Sacred Sites", "Guided Parikrama", "Spiritual Discourse", "Traditional Accommodation", "Sacred Meals"],
      inclusions: ["Dharamshala Stay", "Vegetarian Meals", "Transportation", "Spiritual Guide", "Medical Support"],
      itinerary: [
        "Day 1-2: Mathura and surrounding temples",
        "Day 3-4: Vrindavan and Govardhan",
        "Day 5-6: Barsana, Nandgaon and remote temples",
        "Day 7: Completion and departure"
      ]
    }
  ],
  temples: [
    {
      name: "Krishna Janmabhoomi",
      location: "Mathura",
      coordinates: { lat: 27.5046, lng: 77.6736 },
      significance: "Birthplace of Lord Krishna",
      description: "The most sacred site in Mathura where Lord Krishna was born",
      timings: "4:00 AM - 12:00 PM, 4:00 PM - 9:30 PM",
      entry: "Free",
      category: "temple"
    },
    {
      name: "Banke Bihari Temple",
      location: "Vrindavan",
      coordinates: { lat: 27.5786, lng: 77.7007 },
      significance: "Famous Krishna temple with unique darshan",
      description: "One of the most revered temples dedicated to Lord Krishna",
      timings: "7:45 AM - 12:00 PM, 5:30 PM - 9:30 PM",
      entry: "Free",
      category: "temple"
    },
    {
      name: "ISKCON Temple",
      location: "Vrindavan",
      coordinates: { lat: 27.5733, lng: 77.7003 },
      significance: "International Krishna consciousness temple",
      description: "Modern temple complex with beautiful architecture and gardens",
      timings: "4:30 AM - 1:00 PM, 4:00 PM - 8:30 PM",
      entry: "Free",
      category: "temple"
    },
    {
      name: "Govardhan Hill",
      location: "Govardhan",
      coordinates: { lat: 27.4728, lng: 77.4661 },
      significance: "Sacred hill lifted by Krishna",
      description: "Holy hill where Krishna performed the miracle of lifting Govardhan",
      timings: "24 hours",
      entry: "Free",
      category: "sacred_site"
    }
  ],
  contact: {
    phone: "+91-9876543210",
    email: "info@brij84kos.com",
    address: "Krishna Nagar, Vrindavan, Mathura, Uttar Pradesh 281121",
    office_hours: "9:00 AM - 7:00 PM (Monday to Saturday)",
    coordinates: { lat: 27.5786, lng: 77.7007 }
  },
  statistics: {
    years_of_service: 15,
    happy_pilgrims: 50000,
    temples_covered: 84,
    tour_packages: 25
  }
};

// Language translations
const translations = {
  en: {
    "HOME": "HOME",
    "ABOUT BRIJ": "ABOUT BRIJ",
    "ABOUT US": "ABOUT US",
    "TOUR PACKAGES": "TOUR PACKAGES",
    "GALLERY": "GALLERY",
    "TIRTHANKAR": "TIRTHANKAR",
    "CONTACT": "CONTACT",
    "SACRED PILGRIMAGE TOURS": "SACRED PILGRIMAGE TOURS",
    "Experience the divine journey through Lord Krishna's sacred land": "Experience the divine journey through Lord Krishna's sacred land",
    "EXPLORE TOURS": "EXPLORE TOURS",
    "CONTACT US": "CONTACT US",
    "Years of Service": "Years of Service",
    "Happy Pilgrims": "Happy Pilgrims",
    "Temples Covered": "Temples Covered",
    "Tour Packages": "Tour Packages",
    "OUR SACRED SERVICES": "OUR SACRED SERVICES",
    "Book Now": "Book Now",
    "All": "All",
    "Temples": "Temples",
    "Festivals": "Festivals",
    "Landscapes": "Landscapes",
    "Send Message": "Send Message",
    "Find Us on Map": "Find Us on Map",
    "Book Your Tour": "Book Your Tour",
    "Confirm Booking": "Confirm Booking",
    "Loading Sacred Experience...": "Loading Sacred Experience..."
  },
  hi: {
    "HOME": "होम",
    "ABOUT BRIJ": "ब्रज के बारे में",
    "ABOUT US": "हमारे बारे में", 
    "TOUR PACKAGES": "यात्रा पैकेज",
    "GALLERY": "गैलरी",
    "TIRTHANKAR": "तीर्थंकर",
    "CONTACT": "संपर्क",
    "SACRED PILGRIMAGE TOURS": "पवित्र तीर्थयात्रा",
    "Experience the divine journey through Lord Krishna's sacred land": "भगवान कृष्ण की पवित्र भूमि के माध्यम से दिव्य यात्रा का अनुभव करें",
    "EXPLORE TOURS": "यात्राएं देखें",
    "CONTACT US": "संपर्क करें",
    "Years of Service": "सेवा के वर्ष",
    "Happy Pilgrims": "खुश तीर्थयात्री",
    "Temples Covered": "मंदिर कवर किए गए",
    "Tour Packages": "यात्रा पैकेज",
    "OUR SACRED SERVICES": "हमारी पवित्र सेवाएं",
    "Book Now": "अब बुक करें",
    "All": "सभी",
    "Temples": "मंदिर",
    "Festivals": "त्योहार",
    "Landscapes": "परिदृश्य",
    "Send Message": "संदेश भेजें",
    "Find Us on Map": "मानचित्र पर हमें खोजें",
    "Book Your Tour": "अपनी यात्रा बुक करें",
    "Confirm Booking": "बुकिंग की पुष्टि करें",
    "Loading Sacred Experience...": "पवित्र अनुभव लोड हो रहा है..."
  }
};

// Application state
let currentLanguage = 'en';
let currentPage = 'home';
let googleMap = null;
let particlesArray = [];
let isAnimating = false;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing Brij 84 Kos Dhaam Application...');
  
  // Initialize Lucide icons first
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Initialize all components
  initializeLoadingScreen();
  initializeCosmicBackground();
  initializeNavigation();
  initializeMobileMenu();
  initializeLanguageToggle();
  initializeScrollEffects();
  initializeStatisticsCounters();
  initializeGallery();
  initializeForms();
  initializeModals();
  initializeTourCards();
  
  // Show home page by default
  showPage('home');
  
  // Hide loading screen after initialization
  setTimeout(() => {
    hideLoadingScreen();
  }, 1500);
  
  // Create dynamic floating particles
  setTimeout(() => {
    createEnhancedFloatingParticles();
  }, 2000);
});

// Loading Screen
function initializeLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    loadingScreen.style.display = 'flex';
  }
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }
}

// Enhanced Cosmic Background Effects
function initializeCosmicBackground() {
  createFloatingParticles();
  startParticleAnimation();
  createStarField();
}

function createFloatingParticles() {
  const particlesContainer = document.getElementById('floatingParticles');
  if (!particlesContainer) return;
  
  // Clear existing particles
  particlesContainer.innerHTML = '';
  particlesArray = [];
  
  // Create initial burst of particles
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      createParticle(particlesContainer);
    }, i * 100);
  }
  
  // Continuously add new particles
  setInterval(() => {
    if (particlesArray.length < 100) {
      createParticle(particlesContainer);
    }
  }, 1500);
}

function createParticle(container) {
  const particle = document.createElement('div');
  const types = ['star', 'dot', 'ring', 'sparkle'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  particle.classList.add('cosmic-particle', type);
  
  // Random position
  particle.style.left = Math.random() * 100 + 'vw';
  particle.style.top = (Math.random() * 120 + 100) + 'vh'; // Start below viewport
  
  // Random properties
  const size = Math.random() * 6 + 2;
  const duration = Math.random() * 25 + 15;
  const delay = Math.random() * 3;
  const opacity = Math.random() * 0.8 + 0.2;
  
  particle.style.width = size + 'px';
  particle.style.height = size + 'px';
  particle.style.opacity = opacity;
  particle.style.animationDuration = duration + 's';
  particle.style.animationDelay = delay + 's';
  
  // Style based on type
  if (type === 'star') {
    particle.innerHTML = '✦';
    particle.style.fontSize = size + 'px';
    particle.style.color = '#ffd700';
    particle.style.textShadow = '0 0 15px #ffd700';
    particle.style.background = 'transparent';
  } else if (type === 'sparkle') {
    particle.innerHTML = '✨';
    particle.style.fontSize = size + 'px';
    particle.style.textShadow = '0 0 10px #ffd700';
    particle.style.background = 'transparent';
  } else if (type === 'dot') {
    particle.style.background = 'radial-gradient(circle, #ffd700, #ff6b35)';
    particle.style.borderRadius = '50%';
    particle.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.6)';
  } else if (type === 'ring') {
    particle.style.border = '1px solid #ffd700';
    particle.style.borderRadius = '50%';
    particle.style.background = 'transparent';
    particle.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.4), inset 0 0 10px rgba(255, 215, 0, 0.2)';
  }
  
  // Add subtle horizontal drift
  const drift = (Math.random() - 0.5) * 100;
  particle.style.setProperty('--drift', drift + 'px');
  
  container.appendChild(particle);
  particlesArray.push(particle);
  
  // Remove particle after animation
  setTimeout(() => {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle);
      const index = particlesArray.indexOf(particle);
      if (index > -1) {
        particlesArray.splice(index, 1);
      }
    }
  }, (duration + delay) * 1000);
}

function createEnhancedFloatingParticles() {
  // Create larger, more visible particles
  const body = document.body;
  
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      particle.className = 'enhanced-particle';
      
      const symbols = ['⭐', '✨', '💫', '🌟', '✦', '✧', '⋆', '★'];
      particle.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
      
      particle.style.position = 'fixed';
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.top = Math.random() * 100 + 'vh';
      particle.style.fontSize = (Math.random() * 12 + 8) + 'px';
      particle.style.color = '#ffd700';
      particle.style.textShadow = '0 0 20px #ffd700';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '1';
      particle.style.animation = `floatGlow ${Math.random() * 4 + 6}s ease-in-out infinite`;
      particle.style.opacity = Math.random() * 0.8 + 0.3;
      
      body.appendChild(particle);
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 30000);
    }, i * 1000);
  }
}

function createStarField() {
  // Add twinkling stars to the background
  const style = document.createElement('style');
  style.textContent = `
    .stars::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(1px 1px at 25% 25%, #ffd700, transparent),
        radial-gradient(1px 1px at 75% 75%, #c0c5ce, transparent),
        radial-gradient(2px 2px at 15% 85%, #ffd700, transparent),
        radial-gradient(1px 1px at 85% 15%, #ff6b35, transparent),
        radial-gradient(1px 1px at 45% 65%, #ffd700, transparent);
      background-size: 300px 200px, 250px 150px, 400px 300px, 200px 100px, 350px 250px;
      animation: twinkle 8s linear infinite;
    }
    
    @keyframes twinkle {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 0.3; }
    }
    
    @keyframes floatGlow {
      0%, 100% { 
        transform: translateY(0px) rotate(0deg) scale(1);
        text-shadow: 0 0 20px #ffd700;
      }
      50% { 
        transform: translateY(-15px) rotate(180deg) scale(1.1);
        text-shadow: 0 0 30px #ffd700, 0 0 40px #ff6b35;
      }
    }
  `;
  document.head.appendChild(style);
}

function startParticleAnimation() {
  // Enhanced CSS for particle animations
  if (!document.getElementById('particleStyles')) {
    const style = document.createElement('style');
    style.id = 'particleStyles';
    style.textContent = `
      .cosmic-particle {
        position: fixed;
        pointer-events: none;
        z-index: 1;
        animation: cosmicFloat linear infinite;
      }
      
      .cosmic-particle.star {
        animation: starFloat linear infinite;
      }
      
      .cosmic-particle.sparkle {
        animation: sparkleFloat linear infinite;
      }
      
      .cosmic-particle.dot {
        animation: dotFloat linear infinite;
      }
      
      .cosmic-particle.ring {
        animation: ringFloat linear infinite;
      }
      
      @keyframes cosmicFloat {
        0% {
          transform: translateY(0px) translateX(0px) rotate(0deg) scale(0.5);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(-120vh) translateX(var(--drift, 0px)) rotate(360deg) scale(1);
          opacity: 0;
        }
      }
      
      @keyframes starFloat {
        0% {
          transform: translateY(0px) rotate(0deg) scale(0.8);
          opacity: 0;
        }
        15% {
          opacity: 1;
        }
        85% {
          opacity: 1;
        }
        100% {
          transform: translateY(-120vh) rotate(720deg) scale(1.2);
          opacity: 0;
        }
      }
      
      @keyframes sparkleFloat {
        0% {
          transform: translateY(0px) scale(0.5);
          opacity: 0;
        }
        20% {
          opacity: 1;
          transform: translateY(-20vh) scale(1);
        }
        80% {
          opacity: 1;
        }
        100% {
          transform: translateY(-120vh) scale(0.8);
          opacity: 0;
        }
      }
      
      @keyframes dotFloat {
        0% {
          transform: translateY(0px) translateX(0px);
          opacity: 0;
          box-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
        }
        10% {
          opacity: 1;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
        }
        90% {
          opacity: 1;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
        }
        100% {
          transform: translateY(-120vh) translateX(var(--drift, 0px));
          opacity: 0;
          box-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
        }
      }
      
      @keyframes ringFloat {
        0% {
          transform: translateY(0px) rotate(0deg);
          opacity: 0;
          box-shadow: 0 0 5px rgba(255, 215, 0, 0.2);
        }
        15% {
          opacity: 1;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
        }
        85% {
          opacity: 1;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
        }
        100% {
          transform: translateY(-120vh) rotate(360deg);
          opacity: 0;
          box-shadow: 0 0 5px rgba(255, 215, 0, 0.2);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Navigation System
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link, [data-page]');
  const footerLinks = document.querySelectorAll('.footer-links a[data-page]');
  
  [...navLinks, ...footerLinks].forEach(link => {
    link.addEventListener('click', handleNavigation);
  });
  
  // CTA buttons navigation
  const ctaButtons = document.querySelectorAll('.cta-button[data-page]');
  ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const page = button.getAttribute('data-page');
      showPage(page);
    });
  });
}

function handleNavigation(e) {
  e.preventDefault();
  const page = this.getAttribute('data-page') || this.getAttribute('href').substring(1);
  showPage(page);
  
  // Close mobile menu if open
  const nav = document.getElementById('nav');
  if (nav && nav.classList.contains('active')) {
    toggleMobileMenu();
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
    }
    
    // Update navigation active states
    updateNavigation(pageId);
    
    // Initialize page-specific functionality
    initializePageSpecific(pageId);
    
    // Scroll to top
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
      initializeStatisticsCounters();
      break;
    case 'contact':
      initializeGoogleMaps();
      break;
    case 'gallery':
      populateGallery();
      break;
    case 'tours':
      animateTourCards();
      break;
  }
}

// Mobile Menu
function initializeMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  }
}

function toggleMobileMenu() {
  const nav = document.getElementById('nav');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  
  if (nav) {
    nav.classList.toggle('active');
  }
  
  if (mobileMenuToggle) {
    const icon = mobileMenuToggle.querySelector('i');
    if (nav && nav.classList.contains('active')) {
      icon.setAttribute('data-lucide', 'x');
    } else {
      icon.setAttribute('data-lucide', 'menu');
    }
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
}

// Language Toggle - FIXED
function initializeLanguageToggle() {
  const languageToggle = document.getElementById('languageToggle');
  if (languageToggle) {
    // Make sure the button is visible
    languageToggle.style.display = 'flex';
    languageToggle.style.visibility = 'visible';
    languageToggle.style.opacity = '1';
    
    languageToggle.addEventListener('click', toggleLanguage);
    console.log('Language toggle initialized and made visible');
  } else {
    console.error('Language toggle button not found!');
  }
}

function toggleLanguage() {
  currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';
  updateLanguageDisplay();
  
  const languageToggle = document.getElementById('languageToggle');
  const span = languageToggle.querySelector('span');
  if (span) {
    span.textContent = currentLanguage === 'en' ? 'हिंदी' : 'English';
  }
  
  console.log('Language switched to:', currentLanguage);
}

function updateLanguageDisplay() {
  const elements = document.querySelectorAll('[data-en]');
  elements.forEach(element => {
    const englishText = element.getAttribute('data-en');
    const hindiText = element.getAttribute('data-hi');
    
    if (currentLanguage === 'hi' && hindiText) {
      element.textContent = hindiText;
    } else if (englishText) {
      element.textContent = englishText;
    }
  });
}

// Scroll Effects
function initializeScrollEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, observerOptions);
  
  // Observe elements for scroll reveal
  const revealElements = document.querySelectorAll('.service-card, .tour-card, .stat-card, .info-card');
  revealElements.forEach(el => {
    el.classList.add('scroll-reveal');
    observer.observe(el);
  });
  
  // Header background change on scroll
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const scrollY = window.scrollY;
    
    if (header) {
      if (scrollY > 100) {
        header.style.background = 'rgba(26, 31, 58, 0.98)';
        header.style.borderBottom = '1px solid rgba(255, 215, 0, 0.4)';
      } else {
        header.style.background = 'rgba(26, 31, 58, 0.95)';
        header.style.borderBottom = '1px solid rgba(255, 215, 0, 0.2)';
      }
      
      // Hide/show header on scroll
      if (scrollY > lastScrollY && scrollY > 200) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
    }
    
    lastScrollY = scrollY;
  });
}

// Statistics Counters
function initializeStatisticsCounters() {
  const counters = document.querySelectorAll('.counter');
  
  const startCounting = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60 FPS
    let current = 0;
    
    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };
    
    updateCounter();
  };
  
  // Intersection observer for counters
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounting(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => {
    observer.observe(counter);
  });
}

// Gallery - ENHANCED
function initializeGallery() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active filter
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter gallery items
      const filter = button.getAttribute('data-filter');
      filterGalleryItems(filter);
    });
  });
}

function populateGallery() {
  const galleryGrid = document.getElementById('galleryGrid');
  if (!galleryGrid) return;
  
  // Enhanced gallery items with better visuals
  const galleryItems = [
    { 
      category: 'temples', 
      title: 'Krishna Janmabhoomi Temple',
      description: 'Sacred birthplace of Lord Krishna',
      color: '#ffd700'
    },
    { 
      category: 'temples', 
      title: 'Banke Bihari Temple',
      description: 'Famous for its unique darshan rituals',
      color: '#ff6b35'
    },
    { 
      category: 'festivals', 
      title: 'Holi Celebrations',
      description: 'Divine colors of Braj Holi',
      color: '#e74c3c'
    },
    { 
      category: 'landscapes', 
      title: 'Govardhan Hill',
      description: 'Sacred hill lifted by Krishna',
      color: '#27ae60'
    },
    { 
      category: 'temples', 
      title: 'ISKCON Temple',
      description: 'Modern spiritual architecture',
      color: '#ffd700'
    },
    { 
      category: 'festivals', 
      title: 'Janmashtami Festival',
      description: 'Birth celebration of Lord Krishna',
      color: '#9b59b6'
    },
    { 
      category: 'landscapes', 
      title: 'Yamuna River',
      description: 'Holy river of divine pastimes',
      color: '#3498db'
    },
    { 
      category: 'temples', 
      title: 'Radha Raman Temple',
      description: 'Ancient temple with rich history',
      color: '#ff6b35'
    },
    { 
      category: 'festivals', 
      title: 'Radha Ashtami',
      description: 'Celebration of Radha\'s divine appearance',
      color: '#e67e22'
    },
    { 
      category: 'landscapes', 
      title: 'Barsana Village',
      description: 'Radha\'s birthplace on sacred hills',
      color: '#f39c12'
    },
    { 
      category: 'temples', 
      title: 'Dwarkadhish Temple',
      description: 'Temple of Lord Krishna as king',
      color: '#ffd700'
    },
    { 
      category: 'festivals', 
      title: 'Kartik Purnima',
      description: 'Sacred festival of lights',
      color: '#8e44ad'
    }
  ];
  
  galleryGrid.innerHTML = '';
  
  galleryItems.forEach((item, index) => {
    const galleryItem = document.createElement('div');
    galleryItem.classList.add('gallery-item');
    galleryItem.setAttribute('data-category', item.category);
    
    // Create enhanced visual design
    galleryItem.innerHTML = `
      <div style="
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center; 
        height: 100%; 
        text-align: center; 
        padding: 30px 20px;
        background: linear-gradient(135deg, ${item.color}15, ${item.color}08);
        position: relative;
        overflow: hidden;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      ">
        <div style="
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, ${item.color}10 0%, transparent 70%);
          transition: all 0.6s ease;
          z-index: 1;
        "></div>
        <div style="position: relative; z-index: 2;">
          <div style="
            color: ${item.color}; 
            font-size: 3rem; 
            margin-bottom: 15px;
            text-shadow: 0 0 20px ${item.color}50;
            animation: galleryIconFloat 3s ease-in-out infinite;
          ">
            ${getIconForCategory(item.category)}
          </div>
          <h3 style="
            color: #ffd700; 
            font-size: 1.1rem; 
            margin: 0 0 8px; 
            font-weight: 600;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
          ">${item.title}</h3>
          <p style="
            color: #c0c5ce; 
            font-size: 0.85rem; 
            margin: 0 0 15px;
            opacity: 0.8;
          ">${item.description}</p>
          <div style="
            background: linear-gradient(135deg, ${item.color}, ${item.color}cc);
            color: #1a1f3a;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 4px 15px ${item.color}40;
          ">View Details</div>
        </div>
      </div>
    `;
    
    // Add enhanced hover effects
    galleryItem.addEventListener('mouseenter', () => {
      const bg = galleryItem.querySelector('div > div');
      if (bg) {
        bg.style.top = '-25%';
        bg.style.left = '-25%';
      }
      galleryItem.style.transform = 'scale(1.05) translateY(-5px)';
      galleryItem.style.boxShadow = `0 15px 40px ${item.color}30`;
    });
    
    galleryItem.addEventListener('mouseleave', () => {
      const bg = galleryItem.querySelector('div > div');
      if (bg) {
        bg.style.top = '-50%';
        bg.style.left = '-50%';
      }
      galleryItem.style.transform = 'scale(1) translateY(0)';
      galleryItem.style.boxShadow = '';
    });
    
    // Add click event for future lightbox functionality
    galleryItem.addEventListener('click', () => {
      showImageModal(item);
    });
    
    // Add entrance animation
    galleryItem.style.opacity = '0';
    galleryItem.style.transform = 'scale(0.9) translateY(30px)';
    
    setTimeout(() => {
      galleryItem.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      galleryItem.style.opacity = '1';
      galleryItem.style.transform = 'scale(1) translateY(0)';
    }, index * 150);
    
    galleryGrid.appendChild(galleryItem);
  });
  
  // Add CSS for gallery animations
  if (!document.getElementById('galleryStyles')) {
    const style = document.createElement('style');
    style.id = 'galleryStyles';
    style.textContent = `
      @keyframes galleryIconFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(5deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

function getIconForCategory(category) {
  const icons = {
    temples: '🏛️',
    festivals: '🎭',
    landscapes: '🏔️'
  };
  return icons[category] || '📸';
}

function filterGalleryItems(filter) {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach((item, index) => {
    const category = item.getAttribute('data-category');
    const shouldShow = filter === 'all' || category === filter;
    
    if (shouldShow) {
      item.style.display = 'block';
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'scale(1) translateY(0)';
      }, index * 50);
    } else {
      item.style.opacity = '0';
      item.style.transform = 'scale(0.9) translateY(20px)';
      setTimeout(() => {
        item.style.display = 'none';
      }, 300);
    }
  });
}

function showImageModal(item) {
  const modal = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(10px);
      z-index: 3000;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    " onclick="this.remove()">
      <div style="
        background: linear-gradient(135deg, #1a1f3a, #0a0e27);
        border: 2px solid #ffd700;
        border-radius: 20px;
        padding: 40px;
        max-width: 500px;
        text-align: center;
        color: white;
        position: relative;
        cursor: default;
        box-shadow: 0 20px 60px rgba(255, 215, 0, 0.3);
      " onclick="event.stopPropagation()">
        <div style="
          position: absolute;
          top: 15px;
          right: 20px;
          background: rgba(255, 215, 0, 0.2);
          border: 1px solid #ffd700;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #ffd700;
          font-weight: bold;
        " onclick="this.closest('div[style*=\"position: fixed\"]').remove()">×</div>
        
        <div style="
          font-size: 4rem;
          color: ${item.color};
          margin-bottom: 20px;
          text-shadow: 0 0 30px ${item.color}50;
        ">${getIconForCategory(item.category)}</div>
        
        <h2 style="
          color: #ffd700;
          margin-bottom: 15px;
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
        ">${item.title}</h2>
        
        <p style="
          color: #c0c5ce;
          margin-bottom: 20px;
          line-height: 1.6;
        ">${item.description}</p>
        
        <div style="
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 10px;
          padding: 15px;
          margin-top: 20px;
        ">
          <p style="
            color: #ffd700;
            margin: 0;
            font-size: 0.9rem;
          ">Category: ${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</p>
        </div>
        
        <button style="
          background: linear-gradient(135deg, #ffd700, #ff6b35);
          color: #1a1f3a;
          border: none;
          padding: 12px 30px;
          border-radius: 25px;
          margin-top: 20px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        " onclick="this.closest('div[style*=\"position: fixed\"]').remove()" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          Close Gallery
        </button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modal);
}

// Forms
function initializeForms() {
  const contactForm = document.getElementById('contactForm');
  const bookingForm = document.getElementById('bookingForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }
  
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingForm);
  }
  
  // Set minimum date for date inputs
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    const today = new Date().toISOString().split('T')[0];
    input.setAttribute('min', today);
  });
}

function handleContactForm(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  // Simulate form submission
  const submitButton = e.target.querySelector('.submit-button');
  const originalText = submitButton.innerHTML;
  
  submitButton.innerHTML = '<i data-lucide="loader-2"></i><span>Sending...</span>';
  submitButton.disabled = true;
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  setTimeout(() => {
    alert(currentLanguage === 'hi' ? 
      'आपका संदेश सफलतापूर्वक भेजा गया है! हम जल्द ही आपसे संपर्क करेंगे।' :
      'Your message has been sent successfully! We will contact you soon.');
    
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
    e.target.reset();
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 2000);
}

function handleBookingForm(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  // Validate form
  if (!data.tourSelect || !data.travelDate || !data.pilgrims || !data.contactPerson || !data.contactPhone) {
    alert(currentLanguage === 'hi' ? 
      'कृपया सभी आवश्यक फ़ील्ड भरें।' : 
      'Please fill in all required fields.');
    return;
  }
  
  // Simulate booking submission
  const submitButton = e.target.querySelector('.submit-button');
  const originalText = submitButton.innerHTML;
  
  submitButton.innerHTML = '<i data-lucide="loader-2"></i><span>Processing...</span>';
  submitButton.disabled = true;
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  setTimeout(() => {
    alert(currentLanguage === 'hi' ? 
      'आपकी बुकिंग सफलतापूर्वक सबमिट की गई है! हम जल्द ही आपसे संपर्क करेंगे।' :
      'Your booking has been submitted successfully! We will contact you soon.');
    
    hideModal('bookingModal');
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
    e.target.reset();
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 2000);
}

// Modals
function initializeModals() {
  const modalCloseBtns = document.querySelectorAll('.modal-close');
  const modals = document.querySelectorAll('.modal');
  
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) {
        hideModal(modal.id);
      }
    });
  });
  
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideModal(modal.id);
      }
    });
  });
  
  // ESC key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const visibleModal = document.querySelector('.modal:not(.hidden)');
      if (visibleModal) {
        hideModal(visibleModal.id);
      }
    }
  });
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Animate in
    setTimeout(() => {
      modal.style.opacity = '1';
      const modalContent = modal.querySelector('.modal-content');
      if (modalContent) {
        modalContent.style.transform = 'scale(1) translateY(0)';
      }
    }, 10);
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.opacity = '0';
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.style.transform = 'scale(0.95) translateY(10px)';
    }
    
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  }
}

// Tour Cards
function initializeTourCards() {
  const tourCards = document.querySelectorAll('.tour-card');
  
  tourCards.forEach((card, index) => {
    const button = card.querySelector('.card-button');
    if (button) {
      button.addEventListener('click', () => {
        const tourType = card.getAttribute('data-tour');
        openBookingModal(tourType);
      });
    }
    
    // Add enhanced hover effects
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-15px) rotateX(5deg)';
      card.style.boxShadow = '0 25px 50px rgba(255, 215, 0, 0.3)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

function animateTourCards() {
  const tourCards = document.querySelectorAll('.tour-card');
  
  tourCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px) rotateX(10deg)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0) rotateX(0)';
    }, index * 200);
  });
}

function openBookingModal(tourType) {
  const modal = document.getElementById('bookingModal');
  const tourSelect = document.getElementById('tourSelect');
  
  if (tourSelect && tourType) {
    tourSelect.value = tourType;
  }
  
  showModal('bookingModal');
}

// Enhanced Google Maps Integration
function initializeGoogleMaps() {
  const mapContainer = document.getElementById('googleMap');
  if (!mapContainer) return;
  
  // Create an enhanced interactive map placeholder
  mapContainer.innerHTML = `
    <div id="interactiveTempleMap" style="
      width: 100%; 
      height: 100%; 
      background: linear-gradient(135deg, #1a1f3a, #0a0e27); 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      justify-content: center; 
      color: #ffd700; 
      text-align: center; 
      border-radius: 16px; 
      position: relative; 
      overflow: hidden;
      cursor: pointer;
    ">
      <!-- Animated star background -->
      <div style="
        position: absolute; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
        background-image: 
          radial-gradient(2px 2px at 20% 30%, #ffd700, transparent), 
          radial-gradient(2px 2px at 60% 70%, #c0c5ce, transparent), 
          radial-gradient(1px 1px at 90% 40%, #ffd700, transparent),
          radial-gradient(1px 1px at 30% 80%, #ff6b35, transparent),
          radial-gradient(2px 2px at 70% 20%, #ffd700, transparent); 
        background-size: 150px 100px, 200px 150px, 100px 75px, 175px 125px, 125px 90px; 
        opacity: 0.4;
        animation: starTwinkle 8s linear infinite;
      "></div>
      
      <!-- Main content -->
      <div style="z-index: 2; position: relative;">
        <div style="
          background: rgba(255, 215, 0, 0.1);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 50%;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          animation: mapIconPulse 2s ease-in-out infinite;
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
        ">
          <div style="font-size: 2rem;">🗺️</div>
        </div>
        
        <h3 style="
          margin: 0 0 12px; 
          font-size: 1.5rem; 
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
          animation: textGlow 3s ease-in-out infinite alternate;
        ">Interactive Sacred Map</h3>
        
        <p style="
          margin: 0 0 25px; 
          opacity: 0.9; 
          font-size: 1rem;
          color: #c0c5ce;
        ">Explore 84 holy locations of Brij region</p>
        
        <!-- Temple location buttons -->
        <div style="
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          max-width: 300px;
          margin: 0 auto;
        ">
          ${applicationData.temples.map((temple, index) => `
            <div class="temple-location-btn" onclick="showTempleInfo('${temple.name}')" style="
              background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 107, 53, 0.1));
              border: 1px solid rgba(255, 215, 0, 0.4);
              border-radius: 12px;
              padding: 12px 8px;
              font-size: 0.85rem;
              cursor: pointer;
              transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
              text-align: center;
              color: #ffd700;
              font-weight: 500;
              position: relative;
              overflow: hidden;
              animation: locationBtnFloat ${3 + index * 0.5}s ease-in-out infinite;
              animation-delay: ${index * 0.2}s;
            " onmouseover="
              this.style.transform='scale(1.05) translateY(-2px)';
              this.style.boxShadow='0 8px 25px rgba(255, 215, 0, 0.3)';
              this.style.borderColor='#ffd700';
            " onmouseout="
              this.style.transform='scale(1) translateY(0)';
              this.style.boxShadow='';
              this.style.borderColor='rgba(255, 215, 0, 0.4)';
            ">
              <div style="font-size: 1.2rem; margin-bottom: 4px;">📍</div>
              <div>${temple.location}</div>
            </div>
          `).join('')}
        </div>
        
        <div style="
          margin-top: 25px;
          background: rgba(255, 215, 0, 0.05);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 10px;
          padding: 15px;
          max-width: 350px;
          margin-left: auto;
          margin-right: auto;
        ">
          <p style="
            margin: 0;
            font-size: 0.9rem;
            color: #c0c5ce;
            line-height: 1.4;
          ">Click on any location to view temple details and significance</p>
        </div>
      </div>
    </div>
  `;
  
  // Add CSS animations for the map
  if (!document.getElementById('mapStyles')) {
    const style = document.createElement('style');
    style.id = 'mapStyles';
    style.textContent = `
      @keyframes starTwinkle {
        0% { transform: translateX(0); opacity: 0.4; }
        100% { transform: translateX(-50px); opacity: 0.6; }
      }
      
      @keyframes mapIconPulse {
        0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(255, 215, 0, 0.3); }
        50% { transform: scale(1.1); box-shadow: 0 0 40px rgba(255, 215, 0, 0.5); }
      }
      
      @keyframes textGlow {
        0% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
        100% { text-shadow: 0 0 30px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 107, 53, 0.3); }
      }
      
      @keyframes locationBtnFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-3px); }
      }
    `;
    document.head.appendChild(style);
  }
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// Enhanced temple info modal
window.showTempleInfo = function(templeName) {
  const temple = applicationData.temples.find(t => t.name === templeName);
  if (temple) {
    const modal = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(15px);
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        animation: modalFadeIn 0.3s ease-out;
      " onclick="this.remove()">
        <div style="
          background: linear-gradient(135deg, #1a1f3a, #0a0e27);
          border: 2px solid #ffd700;
          border-radius: 20px;
          padding: 35px;
          max-width: 500px;
          width: 90%;
          text-align: center;
          color: white;
          position: relative;
          cursor: default;
          box-shadow: 0 25px 60px rgba(255, 215, 0, 0.4);
          animation: modalSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        " onclick="event.stopPropagation()">
          
          <div style="
            position: absolute;
            top: 15px;
            right: 20px;
            background: rgba(255, 215, 0, 0.2);
            border: 1px solid #ffd700;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #ffd700;
            font-weight: bold;
            font-size: 1.2rem;
            transition: all 0.3s ease;
          " onclick="this.closest('div[style*=\"position: fixed\"]').remove()" onmouseover="this.style.background='rgba(255, 215, 0, 0.3)'" onmouseout="this.style.background='rgba(255, 215, 0, 0.2)'">×</div>
          
          <div style="
            background: linear-gradient(135deg, #ffd700, #ff6b35);
            color: #1a1f3a;
            border-radius: 50%;
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 25px;
            font-size: 2.5rem;
            box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4);
          ">🏛️</div>
          
          <h2 style="
            color: #ffd700;
            margin-bottom: 12px;
            font-size: 1.8rem;
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
          ">${temple.name}</h2>
          
          <div style="
            background: rgba(255, 215, 0, 0.1);
            border-left: 4px solid #ffd700;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 0 10px 10px 0;
            text-align: left;
          ">
            <p style="color: #c0c5ce; margin: 0 0 8px; line-height: 1.6;">${temple.description}</p>
          </div>
          
          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 25px 0;
          ">
            <div style="
              background: rgba(255, 107, 53, 0.1);
              border: 1px solid rgba(255, 107, 53, 0.3);
              border-radius: 10px;
              padding: 15px;
            ">
              <div style="color: #ff6b35; font-size: 1.1rem; margin-bottom: 5px; font-weight: 600;">📍 Location</div>
              <div style="color: #c0c5ce; font-size: 0.9rem;">${temple.location}</div>
            </div>
            
            <div style="
              background: rgba(255, 215, 0, 0.1);
              border: 1px solid rgba(255, 215, 0, 0.3);
              border-radius: 10px;
              padding: 15px;
            ">
              <div style="color: #ffd700; font-size: 1.1rem; margin-bottom: 5px; font-weight: 600;">🎫 Entry</div>
              <div style="color: #c0c5ce; font-size: 0.9rem;">${temple.entry}</div>
            </div>
          </div>
          
          <div style="
            background: rgba(50, 184, 198, 0.1);
            border: 1px solid rgba(50, 184, 198, 0.3);
            border-radius: 10px;
            padding: 15px;
            margin: 20px 0;
          ">
            <div style="color: #32b8c6; font-size: 1.1rem; margin-bottom: 8px; font-weight: 600;">⏰ Temple Timings</div>
            <div style="color: #c0c5ce; font-size: 0.9rem; line-height: 1.4;">${temple.timings}</div>
          </div>
          
          <div style="
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 107, 53, 0.05));
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
          ">
            <div style="color: #ffd700; font-size: 1.2rem; margin-bottom: 10px; font-weight: 600;">✨ Significance</div>
            <div style="color: #c0c5ce; font-size: 1rem; line-height: 1.5;">${temple.significance}</div>
          </div>
          
          <button style="
            background: linear-gradient(135deg, #ffd700, #ff6b35);
            color: #1a1f3a;
            border: none;
            padding: 15px 35px;
            border-radius: 25px;
            margin-top: 25px;
            cursor: pointer;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
          " onclick="this.closest('div[style*=\"position: fixed\"]').remove()" onmouseover="
            this.style.transform='scale(1.05) translateY(-2px)';
            this.style.boxShadow='0 12px 35px rgba(255, 215, 0, 0.4)';
          " onmouseout="
            this.style.transform='scale(1) translateY(0)';
            this.style.boxShadow='0 8px 25px rgba(255, 215, 0, 0.3)';
          ">Visit This Temple</button>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modal);
    
    // Add modal animations
    if (!document.getElementById('modalAnimations')) {
      const style = document.createElement('style');
      style.id = 'modalAnimations';
      style.textContent = `
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
          from { 
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
};

// Real Google Maps callback (for when API is available)
window.initMap = function() {
  const mapOptions = {
    zoom: 10,
    center: applicationData.contact.coordinates,
    styles: [
      {
        featureType: 'all',
        stylers: [
          { 'color': '#1a1f3a' }
        ]
      },
      {
        featureType: 'road',
        stylers: [
          { 'color': '#2d1b4e' }
        ]
      },
      {
        featureType: 'water',
        stylers: [
          { 'color': '#0a0e27' }
        ]
      }
    ]
  };
  
  const mapElement = document.getElementById('googleMap');
  if (mapElement && window.google) {
    googleMap = new google.maps.Map(mapElement, mapOptions);
    
    // Add markers for temples
    applicationData.temples.forEach(temple => {
      const marker = new google.maps.Marker({
        position: temple.coordinates,
        map: googleMap,
        title: temple.name,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32)
        }
      });
      
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="color: #1a1f3a; font-family: 'Cinzel', serif;">
            <h3 style="margin: 0 0 8px; color: #ff6b35;">${temple.name}</h3>
            <p style="margin: 0 0 4px;"><strong>Location:</strong> ${temple.location}</p>
            <p style="margin: 0 0 4px;"><strong>Timings:</strong> ${temple.timings}</p>
            <p style="margin: 0;"><strong>Significance:</strong> ${temple.significance}</p>
          </div>
        `
      });
      
      marker.addListener('click', () => {
        infoWindow.open(googleMap, marker);
      });
    });
  }
};

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

// Enhanced scroll performance with parallax
const debouncedScroll = debounce(() => {
  const scrolled = window.pageYOffset;
  const rate = scrolled * -0.3;
  
  const cosmicBg = document.querySelector('.cosmic-bg');
  if (cosmicBg) {
    cosmicBg.style.transform = `translateY(${rate}px)`;
  }
  
  // Parallax effect for particles
  particlesArray.forEach((particle, index) => {
    if (particle.parentNode) {
      const speed = 0.5 + (index % 3) * 0.2;
      const yOffset = scrolled * speed;
      particle.style.transform += ` translateY(${yOffset}px)`;
    }
  });
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Smooth scroll for anchor links
document.addEventListener('click', function(e) {
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

// Performance optimization: Preload critical resources
function preloadCriticalResources() {
  const preloadLinks = [
    'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=Cinzel:wght@400;600;700&display=swap',
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

// Call preload on load
window.addEventListener('load', preloadCriticalResources);

// Accessibility enhancements
document.addEventListener('keydown', function(e) {
  // ESC key handling
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.modal:not(.hidden)');
    if (activeModal) {
      hideModal(activeModal.id);
    }
    
    const nav = document.getElementById('nav');
    if (nav && nav.classList.contains('active')) {
      toggleMobileMenu();
    }
  }
  
  // Tab navigation for better accessibility
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

// Remove keyboard navigation class on mouse click
document.addEventListener('mousedown', function() {
  document.body.classList.remove('keyboard-navigation');
});

console.log('Brij 84 Kos Dhaam application initialized successfully!');