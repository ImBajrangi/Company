/**
 * Advanced Futuristic Loader Implementation
 * Creates a high-tech, visually impressive loading animation
 */
(function() {
  // Create and insert loader immediately
  createFuturisticLoader();
  
  // Set up event listeners
  window.addEventListener('load', handlePageLoad);
  
  // Create futuristic loader
  function createFuturisticLoader() {
    // Create loader container
    const loader = document.createElement('div');
    loader.className = 'cosmic-futuristic-loader';
    
    // Create loader progress bar
    const progress = document.createElement('div');
    progress.className = 'loader-progress';
    
    // Create glowing edge
    const edge = document.createElement('div');
    edge.className = 'loader-edge';
    progress.appendChild(edge);
    
    // Create scan line effect
    const scanLine = document.createElement('div');
    scanLine.className = 'scan-line';
    progress.appendChild(scanLine);
    
    // Create particles container
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'loader-particles-container';
    loader.appendChild(particlesContainer);
    
    // Create percentage display
    const percentage = document.createElement('div');
    percentage.className = 'loader-percentage';
    percentage.textContent = '0%';
    loader.appendChild(percentage);
    
    // Add progress bar to loader
    loader.appendChild(progress);
    
    // Insert at the top of body
    document.body.insertBefore(loader, document.body.firstChild);
    
    // Animate progress
    animateProgress(progress, particlesContainer, percentage);
  }
  
  // Animate progress with particles and percentage display
  function animateProgress(progressBar, particlesContainer, percentageDisplay) {
    if (!progressBar) return;
    
    let progress = 0;
    const loadingTime = 3500; // 3.5 seconds total load time
    const initialLoadPercentage = 65; // Load quickly to 65%, then slow down
    const initialLoadTime = loadingTime * 0.4; // Time to reach initialLoadPercentage
    const incrementInterval = 30; // Update every 30ms
    
    // Fast initial load
    const initialInterval = setInterval(() => {
      progress += (initialLoadPercentage / (initialLoadTime / incrementInterval));
      updateLoader(progress);
      
      if (progress >= initialLoadPercentage) {
        clearInterval(initialInterval);
        slowLoadingPhase();
      }
    }, incrementInterval);
    
    // Slow loading phase
    function slowLoadingPhase() {
      const remainingPercentage = 90 - initialLoadPercentage; // Only go to 90%
      const remainingTime = loadingTime - initialLoadTime;
      
      const slowInterval = setInterval(() => {
        progress += (remainingPercentage / (remainingTime / incrementInterval));
        progress = Math.min(progress, 90); // Cap at 90%
        updateLoader(progress);
        
        if (progress >= 90) {
          clearInterval(slowInterval);
        }
      }, incrementInterval);
    }
    
    // Update loader UI with current progress
    function updateLoader(currentProgress) {
      progressBar.style.width = `${currentProgress}%`;
      percentageDisplay.textContent = `${Math.round(currentProgress)}%`;
      
      // Create particles on progress intervals
      if (Math.round(currentProgress) % 5 === 0) {
        createParticle(particlesContainer, currentProgress);
      }
    }
  }
  
  // Create rising particle effect
  function createParticle(container, position) {
    const particle = document.createElement('div');
    particle.className = 'loader-particle';
    
    // Random position based on current progress
    const posX = (position * window.innerWidth / 100) + (Math.random() * 20 - 10);
    
    // Random movement
    const xOffset = Math.random() * 30 - 15;
    const opacity = 0.5 + Math.random() * 0.5;
    
    // Set custom properties for animation
    particle.style.setProperty('--x', `${xOffset}px`);
    particle.style.setProperty('--xEnd', `${xOffset * 2}px`);
    particle.style.setProperty('--opacity', opacity);
    
    // Position particle
    particle.style.left = `${posX}px`;
    particle.style.top = '0';
    
    // Add random color with glowing effect
    const colors = ['#72baff', '#9f5afd', '#ffffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 5px ${color}`;
    
    // Add to container
    container.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 1500);
  }
  
  // Handle page load complete
  function handlePageLoad() {
    const loader = document.querySelector('.cosmic-futuristic-loader');
    if (!loader) return;
    
    // Mark as complete and go to 100%
    loader.classList.add('complete');
    const progressBar = loader.querySelector('.loader-progress');
    progressBar.style.width = '100%';
    
    const percentageDisplay = loader.querySelector('.loader-percentage');
    if (percentageDisplay) {
      percentageDisplay.textContent = '100%';
    }
    
    // Fade out after transition completes
    setTimeout(() => {
      loader.classList.add('fade-out');
      
      // Remove from DOM after fade completes
      setTimeout(() => {
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 800);
    }, 500);
  }
})(); 