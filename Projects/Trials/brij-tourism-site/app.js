// Application data
const tourData = {
  tours: [
    {
      name: "VRINDAVAN TEMPLE TOUR",
      description: "Sacred journey through Krishna's divine land",
      duration: "Full Day",
      highlights: ["Krishna Janmabhoomi", "Banke Bihari Temple", "ISKCON Temple", "Nidhivan", "Radha Raman Temple"],
      price: "₹2,500"
    },
    {
      name: "MATHURA HOLI CELEBRATIONS", 
      description: "Experience the colors of divine love",
      duration: "3 Days",
      highlights: ["Holi Festival", "Cultural Programs", "Local Cuisine", "Lathmar Holi", "Traditional Dance"],
      price: "₹8,500"
    },
    {
      name: "GOVARDHAN PARIKRAMA",
      description: "Sacred circumambulation of Govardhan Hill", 
      duration: "2 Days",
      highlights: ["Govardhan Hill", "Radha Kund", "Shyam Kund", "Sacred Bathing", "Annakut Festival"],
      price: "₹4,500"
    }
  ],
  locations: [
    {
      name: "VRINDAVAN",
      title: "Krishna Janmabhoomi",
      description: "The birthplace of Lord Krishna, most sacred place in Brij",
      temples: ["Banke Bihari", "ISKCON", "Radha Raman", "Nidhivan"],
      significance: "Most sacred place in Brij"
    },
    {
      name: "MATHURA", 
      title: "Sacred Birthplace",
      description: "Ancient city of Krishna's birth",
      temples: ["Krishna Janmasthan", "Dwarkadhish", "Vishram Ghat"],
      significance: "Birthplace of Lord Krishna"
    },
    {
      name: "GOKUL",
      title: "Krishna's Childhood", 
      description: "Where Krishna spent his early years with foster parents",
      temples: ["Gokulnath", "Brahmand Ghat", "Chaurasi Khamba"],
      significance: "Krishna's foster home"
    },
    {
      name: "GOVARDHAN",
      title: "Sacred Hill",
      description: "The hill lifted by Krishna to protect devotees", 
      temples: ["Govardhan Temple", "Radha Kund", "Mansi Ganga"],
      significance: "Symbol of Krishna's divine power"
    }
  ]
};

// Language translations
const translations = {
  en: {
    "HOME": "HOME",
    "ABOUT BRIJ": "ABOUT BRIJ", 
    "TOUR PACKAGES": "TOUR PACKAGES",
    "GALLERY": "GALLERY",
    "CONTACT": "CONTACT",
    "TOURS & TRAVELS GALLERY": "TOURS & TRAVELS GALLERY",
    "PLAN YOUR JOURNEY": "PLAN YOUR JOURNEY",
    "SACRED PILGRIMAGE TOURS": "SACRED PILGRIMAGE TOURS",
    "Learn More": "Learn More",
    "OUR SERVICES": "OUR SERVICES",
    "Guided Pilgrimage": "Guided Pilgrimage",
    "Sacred Accommodation": "Sacred Accommodation", 
    "Transportation": "Transportation",
    "Ritual Services": "Ritual Services",
    "Expert spiritual guides for complete 84 Kos journey": "Expert spiritual guides for complete 84 Kos journey",
    "Comfortable stays near temples with vegetarian meals": "Comfortable stays near temples with vegetarian meals",
    "AC buses and private vehicles for comfortable journey": "AC buses and private vehicles for comfortable journey",
    "Complete puja arrangements and spiritual ceremonies": "Complete puja arrangements and spiritual ceremonies",
    "Destination": "Destination",
    "Check-in Date": "Check-in Date",
    "Number of Pilgrims": "Number of Pilgrims",
    "Names of Pilgrims": "Names of Pilgrims",
    "SEARCH TOURS": "SEARCH TOURS",
    "Select Destination": "Select Destination",
    "Contact Information": "Contact Information",
    "Follow Us": "Follow Us",
    "Filter Temples": "Filter Temples",
    "Experience the sacred journey through Lord Krishna's divine land": "Experience the sacred journey through Lord Krishna's divine land"
  },
  hi: {
    "HOME": "होम",
    "ABOUT BRIJ": "ब्रज के बारे में",
    "TOUR PACKAGES": "यात्रा पैकेज", 
    "GALLERY": "गैलरी",
    "CONTACT": "संपर्क",
    "TOURS & TRAVELS GALLERY": "पर्यटन और यात्रा गैलरी",
    "PLAN YOUR JOURNEY": "अपनी यात्रा की योजना बनाएं",
    "SACRED PILGRIMAGE TOURS": "पवित्र तीर्थयात्रा",
    "Learn More": "और जानें",
    "OUR SERVICES": "हमारी सेवाएं",
    "Guided Pilgrimage": "गाइडेड तीर्थयात्रा",
    "Sacred Accommodation": "पवित्र आवास",
    "Transportation": "परिवहन", 
    "Ritual Services": "अनुष्ठान सेवाएं",
    "Expert spiritual guides for complete 84 Kos journey": "पूर्ण ८४ कोस यात्रा के लिए विशेषज्ञ आध्यात्मिक गाइड",
    "Comfortable stays near temples with vegetarian meals": "शाकाहारी भोजन के साथ मंदिरों के पास आरामदायक रहना",
    "AC buses and private vehicles for comfortable journey": "आरामदायक यात्रा के लिए AC बस और निजी वाहन",
    "Complete puja arrangements and spiritual ceremonies": "पूर्ण पूजा व्यवस्था और आध्यात्मिक समारोह",
    "Destination": "गंतव्य",
    "Check-in Date": "चेक-इन तिथि",
    "Number of Pilgrims": "तीर्थयात्रियों की संख्या",
    "Names of Pilgrims": "तीर्थयात्रियों के नाम",
    "SEARCH TOURS": "यात्रा खोजें",
    "Select Destination": "गंतव्य चुनें",
    "Contact Information": "संपर्क जानकारी",
    "Follow Us": "हमें फॉलो करें",
    "Filter Temples": "मंदिर फिल्टर",
    "Experience the sacred journey through Lord Krishna's divine land": "भगवान कृष्ण की दिव्य भूमि के माध्यम से पवित्र यात्रा का अनुभव करें"
  }
};

// Global state
let currentLanguage = 'en';
let isMenuOpen = false;
let particlesArray = [];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing application...');
  initializeParticles();
  initializeNavigation();
  initializeMobileMenu();
  initializeLanguageToggle();
  initializeInteractiveMap();
  initializeBookingForm();
  initializeScrollEffects();
  initializeTourCards();
  
  // Set minimum date for check-in to today
  const checkinInput = document.getElementById('checkin');
  if (checkinInput) {
    const today = new Date().toISOString().split('T')[0];
    checkinInput.setAttribute('min', today);
  }
  
  // Add hover effects to service cards
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });
  
  // Animate pathways
  animatePathways();
  
  // Start continuous particle animation
  setInterval(() => {
    addRandomParticles();
  }, 1000);
});

// Enhanced floating particles animation
function initializeParticles() {
  console.log('Initializing particles...');
  const particlesContainer = document.getElementById('particles');
  
  if (!particlesContainer) {
    console.error('Particles container not found!');
    return;
  }
  
  // Clear existing particles
  particlesContainer.innerHTML = '';
  particlesArray = [];
  
  // Create initial burst of particles
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      createParticle(particlesContainer);
    }, i * 50); // Stagger creation
  }
  
  console.log('Particles initialized with container:', particlesContainer);
}

function createParticle(container) {
  const particle = document.createElement('div');
  const particleType = Math.random();
  
  particle.classList.add('particle');
  
  // Different types of particles
  if (particleType > 0.8) {
    particle.classList.add('star');
    particle.innerHTML = '✦';
    particle.style.color = '#ffd700';
    particle.style.fontSize = (Math.random() * 8 + 4) + 'px';
    particle.style.textShadow = '0 0 10px #ffd700';
  } else if (particleType > 0.6) {
    particle.innerHTML = '●';
    particle.style.color = '#ffd700';
    particle.style.fontSize = (Math.random() * 6 + 3) + 'px';
    particle.style.textShadow = '0 0 8px rgba(255, 215, 0, 0.8)';
  } else {
    // Traditional circular particle
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.backgroundColor = '#ffd700';
    particle.style.borderRadius = '50%';
    particle.style.boxShadow = `0 0 ${size * 2}px rgba(255, 215, 0, 0.6)`;
  }
  
  // Random position
  particle.style.position = 'absolute';
  particle.style.left = Math.random() * 100 + 'vw';
  particle.style.top = Math.random() * 100 + 'vh';
  particle.style.pointerEvents = 'none';
  particle.style.zIndex = '1';
  
  // Random animation properties
  const duration = Math.random() * 8 + 4; // 4-12 seconds
  const delay = Math.random() * 3; // 0-3 seconds delay
  const direction = Math.random() > 0.5 ? 1 : -1;
  
  particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
  
  // Add custom transform for more variety
  const translateX = (Math.random() - 0.5) * 40;
  const translateY = (Math.random() - 0.5) * 60;
  const rotate = Math.random() * 360;
  
  particle.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`;
  
  // Opacity variation
  particle.style.opacity = Math.random() * 0.6 + 0.4; // 0.4 - 1.0
  
  container.appendChild(particle);
  particlesArray.push(particle);
  
  // Remove particle after some time to prevent memory leaks
  setTimeout(() => {
    if (particle.parentNode === container) {
      container.removeChild(particle);
      const index = particlesArray.indexOf(particle);
      if (index > -1) {
        particlesArray.splice(index, 1);
      }
    }
  }, (duration + delay) * 1000 + 2000);
}

function addRandomParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;
  
  // Keep particle count reasonable
  if (particlesArray.length < 100) {
    // Add 1-3 new particles
    const numNewParticles = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numNewParticles; i++) {
      setTimeout(() => {
        createParticle(particlesContainer);
      }, i * 200);
    }
  }
}

// Smooth scrolling navigation
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
      
      // Close mobile menu if open
      if (isMenuOpen) {
        toggleMobileMenu();
      }
    });
  });
}

// Mobile menu functionality
function initializeMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const nav = document.getElementById('nav');
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  }
}

function toggleMobileMenu() {
  const nav = document.getElementById('nav');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  
  isMenuOpen = !isMenuOpen;
  if (nav) nav.classList.toggle('active');
  if (mobileMenuToggle) mobileMenuToggle.classList.toggle('active');
}

// Language toggle functionality
function initializeLanguageToggle() {
  const languageToggle = document.getElementById('languageToggle');
  
  if (languageToggle) {
    languageToggle.addEventListener('click', () => {
      currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';
      updateLanguage();
      languageToggle.textContent = currentLanguage === 'en' ? 'हिंदी' : 'English';
    });
  }
}

function updateLanguage() {
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

// Interactive map functionality
function initializeInteractiveMap() {
  const locationMarkers = document.querySelectorAll('.location-marker');
  const locationPopup = document.getElementById('locationPopup');
  const popupClose = document.getElementById('popupClose');
  const zoomInBtn = document.getElementById('zoomIn');
  const zoomOutBtn = document.getElementById('zoomOut');
  const filterBtn = document.getElementById('filterTemples');
  
  let mapZoom = 1;
  let templesVisible = true;
  
  // Location marker click events
  locationMarkers.forEach(marker => {
    marker.addEventListener('click', (e) => {
      const locationName = marker.getAttribute('data-location');
      showLocationPopup(locationName);
    });
    
    // Add hover effects
    marker.addEventListener('mouseenter', () => {
      marker.style.transform = 'scale(1.2)';
      marker.style.zIndex = '10';
    });
    
    marker.addEventListener('mouseleave', () => {
      marker.style.transform = 'scale(1)';
      marker.style.zIndex = '2';
    });
  });
  
  // Popup close event
  if (popupClose) {
    popupClose.addEventListener('click', hideLocationPopup);
  }
  
  if (locationPopup) {
    locationPopup.addEventListener('click', (e) => {
      if (e.target === locationPopup) {
        hideLocationPopup();
      }
    });
  }
  
  // Map controls
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      mapZoom = Math.min(mapZoom * 1.2, 2);
      updateMapZoom();
    });
  }
  
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      mapZoom = Math.max(mapZoom / 1.2, 0.8);
      updateMapZoom();
    });
  }
  
  if (filterBtn) {
    filterBtn.addEventListener('click', () => {
      templesVisible = !templesVisible;
      toggleTempleVisibility();
    });
  }
  
  function updateMapZoom() {
    const map = document.getElementById('interactiveMap');
    if (map) {
      map.style.transform = `scale(${mapZoom})`;
    }
  }
  
  function toggleTempleVisibility() {
    locationMarkers.forEach(marker => {
      marker.style.display = templesVisible ? 'block' : 'none';
    });
  }
}

function showLocationPopup(locationName) {
  const location = tourData.locations.find(loc => 
    loc.name.toLowerCase() === locationName.toLowerCase()
  );
  
  if (location) {
    const popup = document.getElementById('locationPopup');
    const title = document.getElementById('popupTitle');
    const description = document.getElementById('popupDescription');
    const temples = document.getElementById('popupTemples');
    const significance = document.getElementById('popupSignificance');
    
    if (title) title.textContent = location.title;
    if (description) description.textContent = location.description;
    
    if (temples) {
      temples.innerHTML = '<h4>🏛️ Famous Temples:</h4><ul>' + 
        location.temples.map(temple => `<li>${temple}</li>`).join('') + '</ul>';
    }
    
    if (significance) {
      significance.innerHTML = `<h4>✨ Significance:</h4><p>${location.significance}</p>`;
    }
    
    if (popup) {
      popup.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }
}

function hideLocationPopup() {
  const popup = document.getElementById('locationPopup');
  if (popup) {
    popup.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

// Booking form functionality
function initializeBookingForm() {
  const bookingForm = document.getElementById('bookingForm');
  const ctaButton = document.querySelector('.cta-button');
  
  // CTA button scroll to booking
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        const offsetTop = bookingSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  }
  
  // Form submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const destination = document.getElementById('destination').value;
      const checkin = document.getElementById('checkin').value;
      const pilgrims = document.getElementById('pilgrims').value;
      const names = document.getElementById('names').value;
      
      if (!destination || !checkin || !pilgrims || !names) {
        alert(currentLanguage === 'hi' ? 
          'कृपया सभी फ़ील्ड भरें' : 
          'Please fill in all fields');
        return;
      }
      
      // Simulate form submission
      const submitButton = bookingForm.querySelector('.search-button');
      if (submitButton) {
        const originalText = submitButton.textContent;
        submitButton.textContent = currentLanguage === 'hi' ? 'खोजा जा रहा है...' : 'Searching...';
        submitButton.disabled = true;
        
        setTimeout(() => {
          alert(currentLanguage === 'hi' ? 
            'आपकी बुकिंग अनुरोध सफलतापूर्वक भेजा गया है! हम जल्द ही आपसे संपर्क करेंगे।' :
            'Your booking request has been submitted successfully! We will contact you soon.');
          
          submitButton.textContent = originalText;
          submitButton.disabled = false;
          bookingForm.reset();
        }, 2000);
      }
    });
  }
}

// Tour cards click functionality
function initializeTourCards() {
  const tourCards = document.querySelectorAll('.tour-card');
  
  tourCards.forEach((card, index) => {
    const button = card.querySelector('.card-button');
    if (button) {
      button.addEventListener('click', () => {
        const tour = tourData.tours[index];
        showTourDetails(tour);
      });
    }
  });
}

function showTourDetails(tour) {
  const message = currentLanguage === 'hi' ? 
    `${tour.name}\n\n${tour.description}\nअवधि: ${tour.duration}\nमूल्य: ${tour.price}\n\nअधिक जानकारी के लिए संपर्क करें: +91-9876543210` :
    `${tour.name}\n\n${tour.description}\nDuration: ${tour.duration}\nPrice: ${tour.price}\n\nFor more information, contact: +91-9876543210`;
  
  alert(message);
}

// Scroll effects and animations
function initializeScrollEffects() {
  window.addEventListener('scroll', debounce(() => {
    const scrolled = window.pageYOffset;
    
    // Parallax effect for particles
    if (particlesArray.length > 0) {
      particlesArray.forEach((particle, index) => {
        if (particle.parentNode) {
          const speed = ((index % 5) + 1) * 0.1;
          const currentTransform = particle.style.transform;
          const newTransform = currentTransform.includes('translateY') ? 
            currentTransform.replace(/translateY\([^)]+\)/, `translateY(${scrolled * speed}px)`) :
            currentTransform + ` translateY(${scrolled * speed}px)`;
          particle.style.transform = newTransform;
        }
      });
    }
    
    // Header background opacity
    const header = document.querySelector('.header');
    if (header) {
      const opacity = Math.min(scrolled / 200, 0.95);
      header.style.background = `rgba(26, 31, 58, ${opacity})`;
    }
    
    // Reveal animations for sections
    const sections = document.querySelectorAll('.tours, .services, .booking');
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const viewportHeight = window.innerHeight;
      
      if (scrolled + viewportHeight > sectionTop + 100) {
        section.classList.add('visible');
      }
    });
  }, 10));
}

// Animate golden pathways on the map
function animatePathways() {
  const paths = document.querySelectorAll('.pathways path');
  paths.forEach((path, index) => {
    if (path) {
      path.style.animationDelay = `${index * 0.5}s`;
    }
  });
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
  // Close popup with Escape key
  if (e.key === 'Escape') {
    const popup = document.getElementById('locationPopup');
    if (popup && !popup.classList.contains('hidden')) {
      hideLocationPopup();
    }
    
    // Close mobile menu with Escape key
    if (isMenuOpen) {
      toggleMobileMenu();
    }
  }
});

// Touch gestures for mobile
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
  const touchEndY = e.changedTouches[0].clientY;
  const difference = touchStartY - touchEndY;
  
  // Swipe up to close mobile menu
  if (difference > 50 && isMenuOpen) {
    toggleMobileMenu();
  }
});

// Performance optimization: Debounce scroll events
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

// Preload critical images and optimize performance
function preloadImages() {
  const imageUrls = []; // Add any critical image URLs here
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

// Call preload on page load
window.addEventListener('load', () => {
  preloadImages();
  console.log('Page fully loaded, particles should be visible');
});