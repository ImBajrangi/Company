/**
 * Extraordinary Gallery Header Animations
 * Using Anime.js for advanced animations
 */
(function() {
  document.addEventListener('DOMContentLoaded', initAnimeEffects);
  
  // Load Anime.js if it's not already loaded
  if (typeof anime === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
    script.onload = initAnimeEffects;
    document.head.appendChild(script);
    return;
  }
  
  function initAnimeEffects() {
    // Create the enhanced gallery header
    createEnhancedHeader();
    
    // Initialize animations after a short delay to ensure DOM is ready
    setTimeout(() => {
      initHeaderAnimations();
      createParticles();
      initCardAnimations();
    }, 100);
  }
  
  function createEnhancedHeader() {
    // Find the section to replace - between first image and categories
    const targetSection = document.querySelector('#collection h1')?.closest('section') || 
                          document.querySelector('.divine-gallery') || 
                          document.querySelector('.gallery-section');
    
    if (!targetSection) {
      console.warn('Target section for enhanced header not found');
      
      // If target not found, insert after the first major section
      const firstSection = document.querySelector('section') || document.querySelector('header');
      if (firstSection && firstSection.nextElementSibling) {
        insertHeaderAfter(firstSection);
      } else {
        // Last resort - insert at the beginning of body
        insertHeaderAtStart();
      }
    } else {
      // Replace the target section
      targetSection.outerHTML = createHeaderHTML();
      initAfterCreation();
    }
  }
  
  function insertHeaderAfter(element) {
    const headerDiv = document.createElement('div');
    headerDiv.innerHTML = createHeaderHTML();
    element.parentNode.insertBefore(headerDiv.firstElementChild, element.nextElementSibling);
    initAfterCreation();
  }
  
  function insertHeaderAtStart() {
    const headerDiv = document.createElement('div');
    headerDiv.innerHTML = createHeaderHTML();
    document.body.insertBefore(headerDiv.firstElementChild, document.body.firstChild);
    initAfterCreation();
  }
  
  function createHeaderHTML() {
    return `
      <section class="divine-gallery-header">
        <div class="header-particles"></div>
        <h1 class="divine-header-title" data-splitting>Divine Gallery</h1>
        <p class="divine-header-subtitle">Explore the mystical realm of cosmic art through our divine collection of extraordinary images</p>
        
        <div class="divine-gallery-cards">
          <div class="divine-gallery-card">
            <img src="./image/k_1.jpg" alt="Krishna Art">
            <div class="divine-gallery-card-content">
              <h3 class="divine-gallery-card-title">Krishna Collection</h3>
              <p class="divine-gallery-card-description">Divine portrayal of Lord Krishna</p>
            </div>
          </div>
          
          <div class="divine-gallery-card">
            <img src="./image/rv_1.jpg" alt="Radhe Krishna">
            <div class="divine-gallery-card-content">
              <h3 class="divine-gallery-card-title">Radhe Krishna</h3>
              <p class="divine-gallery-card-description">Eternal love of Radha and Krishna</p>
            </div>
          </div>
          
          <div class="divine-gallery-card">
            <img src="./image/bs_1.jpg" alt="Bhagwan Shiva">
            <div class="divine-gallery-card-content">
              <h3 class="divine-gallery-card-title">Lord Shiva</h3>
              <p class="divine-gallery-card-description">The divine destroyer and transformer</p>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 2rem;">
          <a href="#collection" class="divine-cta-button">Explore Full Gallery</a>
        </div>
      </section>
    `;
  }
  
  function initAfterCreation() {
    // If Splitting.js is available, use it for text animation
    if (typeof Splitting !== 'undefined') {
      Splitting();
    }
  }
  
  function initHeaderAnimations() {
    // Animated title entrance
    anime({
      targets: '.divine-header-title',
      opacity: [0, 1],
      translateY: [-30, 0],
      scale: [0.9, 1],
      easing: 'easeOutExpo',
      duration: 1200,
      delay: 300
    });
    
    // Subtitle animation
    anime({
      targets: '.divine-header-subtitle',
      opacity: [0, 1],
      translateY: [-20, 0],
      easing: 'easeOutExpo',
      duration: 1200,
      delay: 600
    });
    
    // CTA button animation
    anime({
      targets: '.divine-cta-button',
      opacity: [0, 1],
      translateY: [20, 0],
      easing: 'easeOutExpo',
      duration: 1000,
      delay: 1200
    });
    
    // Background pulse animation
    anime({
      targets: '.divine-gallery-header',
      backgroundColor: [
        { value: 'rgba(8, 8, 24, 0.95)' },
        { value: 'rgba(11, 11, 34, 0.95)' },
        { value: 'rgba(8, 8, 24, 0.95)' }
      ],
      duration: 8000,
      easing: 'easeInOutSine',
      loop: true
    });
  }
  
  function createParticles() {
    const particlesContainer = document.querySelector('.header-particles');
    if (!particlesContainer) return;
    
    const particleCount = 40;
    const particles = [];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('header-particle');
      particle.style.position = 'absolute';
      particle.style.borderRadius = '50%';
      particle.style.width = `${Math.random() * 5 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.backgroundColor = getRandomColor();
      particle.style.opacity = Math.random() * 0.5 + 0.2;
      
      // Set initial position
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      
      particlesContainer.appendChild(particle);
      particles.push(particle);
    }
    
    // Animate particles
    particles.forEach(particle => {
      anime({
        targets: particle,
        translateX: () => anime.random(-100, 100) + '%',
        translateY: () => anime.random(-100, 100) + '%',
        scale: () => anime.random(0.5, 2),
        opacity: () => anime.random(0.1, 0.7),
        duration: () => anime.random(8000, 15000),
        easing: 'easeInOutQuad',
        loop: true,
        direction: 'alternate'
      });
    });
  }
  
  function initCardAnimations() {
    // Staggered entrance animation for cards
    anime({
      targets: '.divine-gallery-card',
      opacity: [0, 1],
      translateY: [50, 0],
      scale: [0.8, 1],
      easing: 'easeOutExpo',
      duration: 1500,
      delay: anime.stagger(200, {start: 800})
    });
    
    // Add floating animation
    anime({
      targets: '.divine-gallery-card',
      translateY: [0, -10],
      duration: 2000,
      easing: 'easeInOutSine',
      loop: true,
      direction: 'alternate',
      delay: anime.stagger(200)
    });
    
    // Hover effects enhanced by anime.js
    document.querySelectorAll('.divine-gallery-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        anime({
          targets: card.querySelector('img'),
          scale: 1.1,
          duration: 800,
          easing: 'easeOutQuint'
        });
        
        anime({
          targets: card.querySelector('.divine-gallery-card-content'),
          translateY: 0,
          duration: 500,
          easing: 'easeOutExpo'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        anime({
          targets: card.querySelector('img'),
          scale: 1,
          duration: 800,
          easing: 'easeOutQuint'
        });
        
        anime({
          targets: card.querySelector('.divine-gallery-card-content'),
          translateY: 40,
          duration: 500,
          easing: 'easeOutExpo'
        });
      });
      
      // Click animation
      card.addEventListener('click', () => {
        anime({
          targets: card,
          scale: [1, 0.95, 1],
          duration: 400,
          easing: 'easeInOutSine'
        });
      });
    });
  }
  
  function getRandomColor() {
    const colors = [
      'rgba(114, 186, 255, 0.8)', // Light blue
      'rgba(159, 90, 253, 0.8)',  // Purple
      'rgba(255, 168, 168, 0.8)', // Light pink
      'rgba(173, 216, 230, 0.8)', // Light blue
      'rgba(144, 238, 144, 0.8)'  // Light green
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
})(); 