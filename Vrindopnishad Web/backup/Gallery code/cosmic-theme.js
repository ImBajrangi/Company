// Cosmic Theme Implementation and Loader with enhanced animations

document.addEventListener('DOMContentLoaded', () => {
  // Create cosmic loader
  createCosmicLoader();
  
  // Apply cosmic styling to existing elements
  applyCosmicStyling();
  
  // Initialize cosmic background
  createCosmicBackground();
  
  // Initialize enhanced header animations
  initEnhancedHeaderEffects();
  
  // Hide loader after content loads
  setTimeout(() => {
    hideCosmicLoader();
  }, 3000);
});

function createCosmicLoader() {
  // Remove any existing loader
  const existingLoader = document.querySelector('.cosmic-loader-container');
  if (existingLoader) {
    existingLoader.remove();
  }
  
  // Create loader container
  const loaderContainer = document.createElement('div');
  loaderContainer.className = 'cosmic-loader-container';
  document.body.appendChild(loaderContainer);
  
  // Create loader
  const loader = document.createElement('div');
  loader.className = 'cosmic-loader';
  loaderContainer.appendChild(loader);
  
  // Create galaxy core
  const galaxy = document.createElement('div');
  galaxy.className = 'cosmic-loader-galaxy';
  loader.appendChild(galaxy);
  
  // Create orbital rings
  for (let i = 0; i < 3; i++) {
    const ring = document.createElement('div');
    ring.className = 'orbital-ring';
    loader.appendChild(ring);
    
    // Add a planet to each ring
    const planet = document.createElement('div');
    planet.className = 'planet';
    
    // Planet properties
    const planetColors = [
      'linear-gradient(to bottom right, #9f5afd, #782dd7)',
      'linear-gradient(to bottom right, #3f88f5, #326fd1)',
      'linear-gradient(to bottom right, #f55b5b, #cb4747)'
    ];
    
    const planetGlows = [
      'rgba(159, 90, 253, 0.6)',
      'rgba(63, 136, 245, 0.6)',
      'rgba(245, 91, 91, 0.6)'
    ];
    
    const orbitRadiuses = ['50px', '70px', '90px'];
    const orbitTimes = ['10s', '15s', '20s'];
    const sizes = ['10px', '8px', '12px'];
    
    // Apply styles
    planet.style.setProperty('--color', planetColors[i]);
    planet.style.setProperty('--glow', planetGlows[i]);
    planet.style.setProperty('--orbit-radius', orbitRadiuses[i]);
    planet.style.setProperty('--orbit-time', orbitTimes[i]);
    planet.style.setProperty('--size', sizes[i]);
    
    // Offset starting position
    planet.style.setProperty('animation-delay', `-${i * 2}s`);
    
    // Add planet to the center of the loader
    planet.style.top = '50%';
    planet.style.left = '50%';
    
    loader.appendChild(planet);
  }
  
  // Create loading text
  const loadingText = document.createElement('div');
  loadingText.className = 'loading-text';
  loadingText.textContent = 'EXPLORING COSMOS';
  loaderContainer.appendChild(loadingText);
  
  // Add some stars to the loader background
  for (let i = 0; i < 50; i++) {
    const star = document.createElement('div');
    star.className = 'loader-star';
    
    // Random properties
    const size = Math.random() * 2 + 1;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 3;
    const opacity = Math.random() * 0.5 + 0.3;
    
    // Apply styles
    star.style.setProperty('--size', `${size}px`);
    star.style.setProperty('--opacity', opacity);
    star.style.setProperty('--duration', `${duration}s`);
    star.style.setProperty('--delay', `${delay}s`);
    star.style.left = `${posX}%`;
    star.style.top = `${posY}%`;
    
    loaderContainer.appendChild(star);
  }
  
  // Prevent scrolling while loader is visible
  document.body.style.overflow = 'hidden';
}

function hideCosmicLoader() {
  const loader = document.querySelector('.cosmic-loader-container');
  if (loader) {
    loader.classList.add('fade-out');
    
    // Remove loader after fade animation
    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
        document.body.style.overflow = 'auto';
      }
    }, 500);
  }
}

function applyCosmicStyling() {
  // Style navigation
  const nav = document.querySelector('.navigation');
  if (nav) {
    nav.classList.add('cosmic-nav');
  }
  
  // Style buttons
  const buttons = document.querySelectorAll('button, .action-button, .open-button');
  buttons.forEach(button => {
    button.classList.add('cosmic-button');
  });
  
  // Style content blocks
  const blocks = document.querySelectorAll('.block');
  blocks.forEach(block => {
    block.classList.add('cosmic-block');
  });
  
  // Style headers
  const headers = document.querySelectorAll('h1, h2, h3, .content');
  headers.forEach(header => {
    header.closest('div').classList.add('cosmic-text');
  });
  
  // Style images
  const images = document.querySelectorAll('.view img, .block img');
  images.forEach(img => {
    img.classList.add('cosmic-image');
  });
}

function initEnhancedHeaderEffects() {
  // Apply Bootstrap animation classes to gallery elements
  const galleryHeadings = document.querySelectorAll('.divine-header-title, .section-title, h1.cosmic-text');
  galleryHeadings.forEach(heading => {
    heading.classList.add('fade-in-up');
  });
  
  const gallerySubtitles = document.querySelectorAll('.divine-header-subtitle, .section-subtitle, h2.cosmic-text');
  gallerySubtitles.forEach(subtitle => {
    subtitle.classList.add('fade-in-up');
    subtitle.classList.add('delay-300');
  });
  
  const buttons = document.querySelectorAll('.divine-cta-button, .cosmic-button');
  buttons.forEach(button => {
    button.classList.add('fade-in-up');
    button.classList.add('delay-500');
    button.classList.add('hover-float');
  });
  
  // Check if Anime.js is available
  if (typeof anime !== 'undefined') {
    // Add subtle background animation to all cosmic-styled sections
    anime({
      targets: '.cosmic-nav, .cosmic-footer, .divine-gallery-header',
      opacity: [0.98, 1],
      easing: 'easeInOutQuad',
      duration: 3000,
      loop: true,
      direction: 'alternate'
    });
  }
} 