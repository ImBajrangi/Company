/**
 * Classic horizontal loader implementation
 */
(function() {
  // Create and insert loader immediately
  createClassicLoader();
  
  // Set up event listeners
  window.addEventListener('load', handlePageLoad);
  
  // Create classic loader
  function createClassicLoader() {
    // Create loader container
    const loader = document.createElement('div');
    loader.className = 'classic-loader';
    
    // Create loader bar
    const loaderBar = document.createElement('div');
    loaderBar.className = 'classic-loader-bar';
    loader.appendChild(loaderBar);
    
    // Insert at the top of body
    document.body.insertBefore(loader, document.body.firstChild);
    
    // Animate progress
    animateProgress();
  }
  
  // Animate progress bar
  function animateProgress() {
    const loaderBar = document.querySelector('.classic-loader-bar');
    if (!loaderBar) return;
    
    let progress = 0;
    const loadingTime = 3000; // 3 seconds total load time
    const initialLoadPercentage = 70; // Load quickly to 70%, then slow down
    const initialLoadTime = loadingTime * 0.4; // Time to reach initialLoadPercentage
    const incrementInterval = 30; // Update every 30ms
    
    // Fast initial load
    const initialInterval = setInterval(() => {
      progress += (initialLoadPercentage / (initialLoadTime / incrementInterval));
      loaderBar.style.width = `${progress}%`;
      
      if (progress >= initialLoadPercentage) {
        clearInterval(initialInterval);
        slowLoadingPhase();
      }
    }, incrementInterval);
    
    // Slow loading phase
    function slowLoadingPhase() {
      const remainingPercentage = 95 - initialLoadPercentage; // Only go to 95%
      const remainingTime = loadingTime - initialLoadTime;
      
      const slowInterval = setInterval(() => {
        progress += (remainingPercentage / (remainingTime / incrementInterval));
        progress = Math.min(progress, 95); // Cap at 95%
        loaderBar.style.width = `${progress}%`;
        
        if (progress >= 95) {
          clearInterval(slowInterval);
        }
      }, incrementInterval);
    }
  }
  
  // Handle page load complete
  function handlePageLoad() {
    const loader = document.querySelector('.classic-loader');
    if (!loader) return;
    
    // Mark as complete and go to 100%
    loader.classList.add('complete');
    const loaderBar = loader.querySelector('.classic-loader-bar');
    loaderBar.style.width = '100%';
    
    // Fade out after transition completes
    setTimeout(() => {
      loader.classList.add('fade-out');
      
      // Remove from DOM after fade completes
      setTimeout(() => {
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 500);
    }, 300);
  }
})(); 