/**
 * Enhanced loader that appears on every page refresh
 */
(function() {
  // Create and insert loader immediately before any other scripts run
  createAndInsertLoader();
  
  // Set up event listeners for page load
  window.addEventListener('load', handlePageLoad);
  
  // Create and insert the loader into the DOM
  function createAndInsertLoader() {
    // Create loader container
    const loaderContainer = document.createElement('div');
    loaderContainer.className = 'cosmic-loader-container';
    loaderContainer.style.opacity = '1';
    loaderContainer.style.visibility = 'visible';
    
    // Create loader HTML
    loaderContainer.innerHTML = `
      <div class="cosmic-loader">
        <div class="loader-ring"></div>
        <div class="loader-pulse"></div>
        
        <div class="progress-circle-container">
          <svg class="progress-circle" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="cosmicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#72baff" />
                <stop offset="100%" stop-color="#bc72ff" />
              </linearGradient>
            </defs>
            <circle class="progress-circle-bg" cx="50" cy="50" r="45" />
            <circle class="progress-circle-fill" cx="50" cy="50" r="45" />
          </svg>
        </div>
        
        <div class="loader-text">Loading...</div>
        
        <div class="loader-particles-container">
          <div class="loader-particle" style="--tx: 40px; --ty: -30px; --opacity: 0.9;"></div>
          <div class="loader-particle" style="--tx: -50px; --ty: -40px; --opacity: 0.8;"></div>
          <div class="loader-particle" style="--tx: 30px; --ty: 50px; --opacity: 0.7;"></div>
          <div class="loader-particle" style="--tx: -40px; --ty: 30px; --opacity: 0.9;"></div>
          <div class="loader-particle" style="--tx: 50px; --ty: 20px; --opacity: 0.8;"></div>
        </div>
      </div>
    `;
    
    // Insert at the beginning of body
    document.body.insertBefore(loaderContainer, document.body.firstChild);
    
    // Start progress animation
    animateProgress();
  }
  
  // Handle page load event
  function handlePageLoad() {
    // Simulate loading progress
    const progressCircle = document.querySelector('.progress-circle-fill');
    if (progressCircle) {
      progressCircle.style.strokeDashoffset = '0';
    }
    
    // Hide loader after content is fully loaded
    setTimeout(() => {
      const loaderContainer = document.querySelector('.cosmic-loader-container');
      if (loaderContainer) {
        loaderContainer.classList.add('fade-out');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
          if (loaderContainer.parentNode) {
            loaderContainer.parentNode.removeChild(loaderContainer);
          }
        }, 800); // Match the CSS transition duration
      }
    }, 1500); // Adjust this time as needed
  }
  
  // Animate the progress circle
  function animateProgress() {
    const progressCircle = document.querySelector('.progress-circle-fill');
    if (!progressCircle) return;
    
    let progress = 0;
    const totalDuration = 2000; // 2 seconds
    const interval = 30; // Update every 30ms
    const steps = totalDuration / interval;
    const increment = 283 / steps; // 283 is the circumference of the circle
    
    const progressInterval = setInterval(() => {
      progress += increment;
      const currentOffset = 283 - progress;
      
      if (currentOffset <= 0) {
        clearInterval(progressInterval);
        progressCircle.style.strokeDashoffset = '0';
      } else {
        progressCircle.style.strokeDashoffset = currentOffset;
      }
    }, interval);
  }
})(); 