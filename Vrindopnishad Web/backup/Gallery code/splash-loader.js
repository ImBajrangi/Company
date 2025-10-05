/**
 * Immersive Full-Screen Splash Loader
 * Creates a dramatic loading experience before showing the main content
 */
(function() {
  // Create and show the splash screen immediately
  createSplashScreen();
  
  // Initialize loading process
  initLoading();
  
  /**
   * Creates the full-screen splash loader
   */
  function createSplashScreen() {
    // Create splash screen container
    const splashScreen = document.createElement('div');
    splashScreen.className = 'cosmic-splash-screen';
    
    // Create inner content HTML
    splashScreen.innerHTML = `
      <div class="splash-particles-container"></div>
      <div class="splash-loader-container">
        <div class="splash-loading-text">COSMIC GALLERY</div>
        <div class="splash-ring"></div>
        <div class="splash-ring"></div>
        <div class="splash-ring"></div>
        <div class="splash-logo"></div>
        <div class="splash-progress-container">
          <div class="splash-progress-bar">
            <div class="splash-progress-fill"></div>
          </div>
          <div class="splash-progress-text">Loading 0%</div>
        </div>
      </div>
      <div class="splash-message">Prepare for an incredible cosmic journey</div>
    `;
    
    // Insert as first element in body
    document.body.insertBefore(splashScreen, document.body.firstChild);
    
    // Disable scrolling on body while splash screen is active
    document.body.style.overflow = 'hidden';
    
    // Create star field effect
    createStarField(splashScreen);
    
    // Create floating particles
    createParticles(splashScreen.querySelector('.splash-particles-container'));
  }
  
  /**
   * Creates a star field in the background
   */
  function createStarField(container) {
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'splash-star';
      
      // Random position
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      // Random size and twinkle effect
      const size = Math.random() * 2 + 1;
      const duration = Math.random() * 4 + 3;
      const delay = Math.random() * 5;
      const opacity = Math.random() * 0.7 + 0.3;
      
      // Apply styles
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${posX}%`;
      star.style.top = `${posY}%`;
      star.style.setProperty('--duration', `${duration}s`);
      star.style.setProperty('--delay', `${delay}s`);
      star.style.setProperty('--opacity', opacity);
      
      container.appendChild(star);
    }
  }
  
  /**
   * Creates floating particle effects
   */
  function createParticles(container) {
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'splash-particle';
      
      // Random position
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      // Random attributes
      const size = Math.random() * 4 + 2;
      const blur = Math.random() * 2;
      const duration = Math.random() * 20 + 10;
      const opacity = Math.random() * 0.3 + 0.2;
      const opacityMin = opacity * 0.3;
      
      // Random movement
      const moveX = (Math.random() * 40 - 20);
      const moveY = (Math.random() * 40 - 20);
      
      // Apply styles
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.setProperty('--blur', `${blur}px`);
      particle.style.setProperty('--duration', `${duration}s`);
      particle.style.setProperty('--opacity', opacity);
      particle.style.setProperty('--opacity-min', opacityMin);
      particle.style.setProperty('--x', `${moveX}px`);
      particle.style.setProperty('--y', `${moveY}px`);
      
      container.appendChild(particle);
    }
  }
  
  /**
   * Initialize loading process
   */
  function initLoading() {
    // Get loader elements
    const progressFill = document.querySelector('.splash-progress-fill');
    const progressText = document.querySelector('.splash-progress-text');
    
    if (!progressFill || !progressText) return;
    
    // Simulate loading process
    let progress = 0;
    const loadingTime = 4000; // Total loading time: 4 seconds
    const incrementInterval = 30; // Update every 30ms
    
    // Calculate increments for a non-linear loading effect
    // Start fast, then slow down, then speed up again
    const interval = setInterval(() => {
      if (progress < 30) {
        // Start fast: 0-30%
        progress += 0.8;
      } else if (progress < 70) {
        // Slow down: 30-70%
        progress += 0.4;
      } else if (progress < 90) {
        // Speed up a bit: 70-90%
        progress += 0.6;
      } else {
        // Final slow approach: 90-100%
        progress += 0.2;
      }
      
      // Ensure we don't exceed 100%
      progress = Math.min(progress, 100);
      
      // Update UI
      progressFill.style.width = `${progress}%`;
      progressText.textContent = `Loading ${Math.round(progress)}%`;
      
      // When complete, transition to the main site
      if (progress >= 100) {
        clearInterval(interval);
        
        // Slight delay before transition
        setTimeout(showMainContent, 500);
      }
    }, incrementInterval);
    
    // Also listen for actual page load event
    window.addEventListener('load', () => {
      // If actual page load happens before our animation is complete,
      // speed up to 100% quickly
      if (progress < 100) {
        progress = 90; // Jump to 90%
      }
    });
  }
  
  /**
   * Transition from loader to main content
   */
  function showMainContent() {
    const splashScreen = document.querySelector('.cosmic-splash-screen');
    if (!splashScreen) return;
    
    // Fade out splash screen
    splashScreen.classList.add('fade-out');
    
    // Enable scrolling again
    document.body.style.overflow = '';
    
    // Remove from DOM after transition
    setTimeout(() => {
      if (splashScreen.parentNode) {
        splashScreen.parentNode.removeChild(splashScreen);
      }
    }, 800);
  }
})(); 