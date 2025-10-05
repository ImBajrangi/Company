/**
 * Enhanced Mobile Interactive System
 * Creates sophisticated animations and reactions for mobile users
 */
(function() {
  // Run on DOMContentLoaded and also after a slight delay to ensure all elements are ready
  document.addEventListener('DOMContentLoaded', initMobileInteractive);
  setTimeout(initMobileInteractive, 1500);
  
  // Store state
  let isMobile = window.innerWidth <= 768;
  let autoHighlightInterval = null;
  let currentlyOpenPopup = null;
  let scrollDirection = 'down';
  let lastScrollPosition = 0;
  
  // Theme color palettes for random assignment
  const colorPalettes = {
    krishna: {
      primary: '0, 93, 183', // Krishna blue RGB
      secondary: '114, 186, 255', // Cosmic blue RGB
      accent: '0, 217, 227', // Teal RGB
      glow: 'rgba(0, 93, 183, 0.6)'
    },
    radha: {
      primary: '255, 62, 120', // Radha pink RGB
      secondary: '255, 94, 189', // Cosmic pink RGB
      accent: '255, 215, 156', // Gold RGB
      glow: 'rgba(255, 62, 120, 0.6)'
    },
    cosmic: {
      primary: '114, 186, 255', // Cosmic blue RGB
      secondary: '159, 90, 253', // Cosmic purple RGB
      accent: '0, 217, 227', // Teal RGB
      glow: 'rgba(159, 90, 253, 0.6)'
    },
    spiritual: {
      primary: '255, 201, 60', // Spiritual gold RGB
      secondary: '255, 149, 0', // Orange RGB
      accent: '255, 94, 189', // Pink RGB
      glow: 'rgba(255, 201, 60, 0.6)'
    }
  };
  
  // Animation effect types
  const effectTypes = ['effect-1', 'effect-2', 'effect-3', 'effect-4', 'effect-5'];
  
  // Configuration
  const config = {
    animationInterval: 5000, // Time between auto-animations (ms)
    rippleDuration: 800,     // Duration of touch ripple (ms)
    autoHighlightDelay: 3000, // Time between auto-highlighting categories (ms)
    glassEffectProbability: 0.4, // Probability (0-1) of an item getting glass effect
    divineGlowProbability: 0.4, // Probability (0-1) of an item getting divine glow
    textEffectTypes: ['text-effect-1', 'text-effect-2', 'text-effect-3'],
    pulseEffectTypes: ['pulse-effect-krishna', 'pulse-effect-radha', 'pulse-effect-cosmic', 'pulse-effect-spiritual']
  };
  
  function initMobileInteractive() {
    // Detect if we're on mobile
    checkMobile();
    
    // Initialize mobile interaction features if on mobile
    if (isMobile) {
      console.log("Mobile detected: Initializing enhanced interactive features");
      
      // Add automatic animations to gallery items with random effects
      setupEnhancedAnimations();
      
      // Add touch ripple effect
      setupTouchRipple();
      
      // Create and set up mobile detail popup
      createMobilePopup();
      
      // Add scroll indicator
      createScrollIndicator();
      
      // Set up auto-rotating category highlights with text effects
      setupEnhancedCategoryEffects();
      
      // Make mobile category filters more interactive
      enhanceMobileFilters();
      
      // Listen for scroll events
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Listen for orientation changes
      window.addEventListener('orientationchange', handleOrientationChange);
    }
  }
  
  function checkMobile() {
    isMobile = window.innerWidth <= 768 || 
              /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  function setupEnhancedAnimations() {
    // Get all gallery blocks
    const blocks = document.querySelectorAll('.gallery-item, .block, .uniform-block');
    
    blocks.forEach((block, index) => {
      // Add auto-animate class and random effect type
      block.classList.add('auto-animate');
      
      // Assign random animation effect
      const randomEffect = effectTypes[Math.floor(Math.random() * effectTypes.length)];
      block.classList.add(randomEffect);
      
      // Set random animation timing variables
      const randomDuration = Math.random() * 0.5;
      const randomDelay = Math.floor(Math.random() * 10);
      block.style.setProperty('--random-duration', randomDuration);
      block.style.setProperty('--random-delay', randomDelay);
      
      // Apply special effects with some probability
      if (Math.random() < config.glassEffectProbability) {
        block.classList.add('glass-effect');
      }
      
      if (Math.random() < config.divineGlowProbability) {
        block.classList.add('divine-glow');
        
        // Select random theme for glow
        const themes = Object.keys(colorPalettes);
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
        block.style.setProperty('--glow-color', colorPalettes[randomTheme].glow);
      }
      
      // Replace hover event with click/touch for mobile
      block.addEventListener('click', function(e) {
        // Only trigger if not clicking a button or link
        if (!e.target.closest('.action-button') && !e.target.closest('a')) {
          showMobilePopup(block);
        }
      });
    });
    
    // Initial check for visible blocks
    checkVisibleBlocks();
  }
  
  function checkVisibleBlocks() {
    const blocks = document.querySelectorAll('.auto-animate');
    
    blocks.forEach(block => {
      if (isElementInViewport(block)) {
        // Add visible class if in viewport
        block.classList.add('visible');
        
        // Randomly add pulse effect to some blocks
        if (Math.random() > 0.7 && 
            !block.classList.contains('pulse-effect-krishna') && 
            !block.classList.contains('pulse-effect-radha') && 
            !block.classList.contains('pulse-effect-cosmic') && 
            !block.classList.contains('pulse-effect-spiritual')) {
          
          // Select random pulse effect
          const randomPulseEffect = config.pulseEffectTypes[
            Math.floor(Math.random() * config.pulseEffectTypes.length)
          ];
          block.classList.add(randomPulseEffect);
          
          // Remove pulse after some time
          setTimeout(() => {
            block.classList.remove(randomPulseEffect);
          }, 6000 + Math.random() * 4000); // Random duration between 6-10s
        }
      }
    });
  }
  
  function setupTouchRipple() {
    const interactiveElements = document.querySelectorAll('.gallery-item, .block, .uniform-block, .filter-button');
    
    interactiveElements.forEach(el => {
      el.addEventListener('touchstart', createRippleEffect, { passive: true });
    });
  }
  
  function createRippleEffect(e) {
    const element = this;
    
    // Get touch position
    const touch = e.touches[0];
    const rect = element.getBoundingClientRect();
    
    // Calculate position relative to element
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    // Create ripple element
    const ripple = document.createElement('div');
    ripple.className = 'touch-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    // Add to element
    element.appendChild(ripple);
    
    // Trigger animation
    setTimeout(() => {
      ripple.classList.add('ripple-animate');
      
      // Remove after animation completes
      setTimeout(() => {
        ripple.remove();
      }, config.rippleDuration);
    }, 10);
  }
  
  /*function createMobilePopup() {
    // Check if popup already exists
    if (document.querySelector('.mobile-details-popup')) return;
    
    // Create popup elements
    const popup = document.createElement('div');
    popup.className = 'mobile-details-popup';
    popup.innerHTML = `
      <div class="popup-handle"></div>
      <div class="popup-content">
        <img src="" alt="Item Image" class="popup-image">
        <h3 class="popup-title"></h3>
        <p class="popup-description"></p>
        <div class="popup-actions">
          <button class="popup-action-btn like-btn">
            <i class="fas fa-heart"></i> Like
          </button>
          <button class="popup-action-btn share-btn">
            <i class="fas fa-share-alt"></i> Share
          </button>
        </div>
      </div>
    `;*/
    
    // Add to document
    document.body.appendChild(popup);
    
    // Set up swipe to dismiss
    let startY = 0;
    let currentY = 0;
    
    popup.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    }, { passive: true });
    
    popup.addEventListener('touchmove', (e) => {
      currentY = e.touches[0].clientY;
      const diffY = currentY - startY;
      
      // Only allow swiping down
      if (diffY > 0) {
        popup.style.transform = `translateY(${diffY}px)`;
      }
    }, { passive: true });
    
    popup.addEventListener('touchend', () => {
      const diffY = currentY - startY;
      
      if (diffY > 100) {
        // If swiped down enough, close popup
        hideMobilePopup();
      } else {
        // Otherwise, reset position
        popup.style.transform = '';
      }
    });
    
    // Add click event to buttons
    const likeBtn = popup.querySelector('.like-btn');
    const shareBtn = popup.querySelector('.share-btn');
    
    likeBtn.addEventListener('click', () => {
      likeBtn.classList.toggle('liked');
      if (likeBtn.classList.contains('liked')) {
        likeBtn.innerHTML = '<i class="fas fa-heart"></i> Liked';
        likeBtn.style.background = 'linear-gradient(135deg, rgba(255, 62, 120, 0.8), rgba(255, 94, 189, 0.8))';
      } else {
        likeBtn.innerHTML = '<i class="fas fa-heart"></i> Like';
        likeBtn.style.background = '';
      }
    });
    
    shareBtn.addEventListener('click', () => {
      const title = popup.querySelector('.popup-title').textContent;
      try {
        if (navigator.share) {
          navigator.share({
            title: title,
            text: `Check out this amazing piece: ${title}`,
            url: window.location.href
          });
        } else {
          // Fallback if Web Share API not available
          alert(`Share functionality not available on this browser. You're viewing: ${title}`);
        }
      } catch (err) {
        console.error('Share failed:', err);
      }
    });
    
    // Randomly assign theme colors to buttons
    const themes = Object.keys(colorPalettes);
    
    const likeTheme = themes[Math.floor(Math.random() * themes.length)];
    likeBtn.style.setProperty('--btn-color-1', colorPalettes[likeTheme].primary);
    likeBtn.style.setProperty('--btn-color-2', colorPalettes[likeTheme].secondary);
    
    const shareTheme = themes[Math.floor(Math.random() * themes.length)];
    shareBtn.style.setProperty('--btn-color-1', colorPalettes[shareTheme].primary);
    shareBtn.style.setProperty('--btn-color-2', colorPalettes[shareTheme].secondary);
  }
  
);function showMobilePopup(item) {
    const popup = document.querySelector('.mobile-details-popup');
    if (!popup) return;
    
    // Get item details
    const img = item.querySelector('img');
    const imgSrc = img.getAttribute('data-src') || img.getAttribute('src');
    
    const title = item.querySelector('h3')?.textContent || 'Gallery Item';
    const description = item.querySelector('p')?.textContent || 
                        'Explore this beautiful piece in our cosmic gallery collection.';
    
    // Set popup content
    popup.querySelector('.popup-image').src = imgSrc;
    popup.querySelector('.popup-title').textContent = title;
    popup.querySelector('.popup-description').textContent = description;
    
    // Show popup with animation
    popup.classList.add('active');
    currentlyOpenPopup = popup;
    
    // Disable page scrolling
    document.body.style.overflow = 'hidden';
  }
  
  function hideMobilePopup() {
    const popup = document.querySelector('.mobile-details-popup.active');
    if (!popup) return;
    
    // Hide with animation
    popup.style.transform = 'translateY(100%)';
    
    // Reset after animation
    setTimeout(() => {
      popup.classList.remove('active');
      popup.style.transform = '';
      currentlyOpenPopup = null;
      
      // Re-enable scrolling
      document.body.style.overflow = '';
    }, 300);
  }
  
  function createScrollIndicator() {
    // Check if already exists
    if (document.querySelector('.scroll-indicator')) return;
    
    // Create indicator
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.innerHTML = '<i class="fas fa-chevron-down"></i>';
    
    // Add to document
    document.body.appendChild(indicator);
    
    // Show initially
    setTimeout(() => {
      indicator.classList.add('visible');
      
      // Hide after some time
      setTimeout(() => {
        indicator.classList.remove('visible');
      }, 5000);
    }, 2000);
  }
  
  function setupEnhancedCategoryEffects() {
    // Get all category tags
    const categoryTags = document.querySelectorAll('.category-tag');
    if (categoryTags.length === 0) return;
    
    // Apply text effects randomly to each tag
    categoryTags.forEach(tag => {
      // Apply random text effect
      const randomTextEffect = config.textEffectTypes[
        Math.floor(Math.random() * config.textEffectTypes.length)
      ];
      tag.classList.add(randomTextEffect);
      
      // Add sparkle effect to some tags
      if (Math.random() > 0.6) {
        tag.classList.add('text-effect-sparkle');
      }
      
      // Assign random theme colors for highlighting
      const themes = Object.keys(colorPalettes);
      const randomTheme = themes[Math.floor(Math.random() * themes.length)];
      tag.style.setProperty('--highlight-color-1', colorPalettes[randomTheme].primary);
      tag.style.setProperty('--highlight-color-2', colorPalettes[randomTheme].secondary);
    });
    
    // Clear any existing interval
    if (autoHighlightInterval) {
      clearInterval(autoHighlightInterval);
    }
    
    // Set up rotating highlights
    let currentIndex = 0;
    
    autoHighlightInterval = setInterval(() => {
      // Remove highlight from all
      categoryTags.forEach(tag => tag.classList.remove('auto-highlight'));
      
      // Add to current
      categoryTags[currentIndex]?.classList.add('auto-highlight');
      
      // Update index
      currentIndex = (currentIndex + 1) % categoryTags.length;
    }, config.autoHighlightDelay);
  }
  
  function enhanceMobileFilters() {
    const filterContainer = document.querySelector('.gallery-filter-controls');
    if (!filterContainer) return;
    
    // Add scroll indicator if not already present
    if (!filterContainer.querySelector('.filter-indicator')) {
      const indicator = document.createElement('div');
      indicator.className = 'filter-indicator';
      indicator.innerHTML = '<i class="fas fa-angle-right"></i>';
      filterContainer.appendChild(indicator);
      
      // Hide indicator after some scrolling
      filterContainer.addEventListener('scroll', function() {
        indicator.style.opacity = '0';
        setTimeout(() => {
          indicator.remove();
        }, 500);
      }, { passive: true });
    }
    
    // Make filter buttons interactive
    const filterButtons = filterContainer.querySelectorAll('.filter-button');
    
    filterButtons.forEach(btn => {
      // Already handled by touch ripple function
    });
  }
  
  function handleScroll() {
    // Get current scroll position
    const currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;
    
    // Determine scroll direction
    scrollDirection = currentScrollPos > lastScrollPosition ? 'down' : 'up';
    lastScrollPosition = currentScrollPos;
    
    // Check which blocks are visible
    checkVisibleBlocks();
    
    // Hide popup when scrolling down
    if (currentlyOpenPopup && scrollDirection === 'down') {
      hideMobilePopup();
    }
    
    // Show/hide scroll indicator based on position
    updateScrollIndicator(currentScrollPos);
  }
  
  function updateScrollIndicator(scrollPos) {
    const indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;
    
    // Show indicator when near middle of page
    const pageHeight = document.body.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollPercent = (scrollPos / (pageHeight - windowHeight)) * 100;
    
    if (scrollPercent > 30 && scrollPercent < 70) {
      indicator.classList.add('visible');
      
      // Update indicator icon based on scroll direction
      indicator.innerHTML = scrollDirection === 'down' 
        ? '<i class="fas fa-chevron-down"></i>'
        : '<i class="fas fa-chevron-up"></i>';
    } else {
      indicator.classList.remove('visible');
    }
  }
  
  function handleOrientationChange() {
    // Recheck if device is mobile after orientation change
    checkMobile();
    
    // Reinitialize mobile features if needed
    setTimeout(checkVisibleBlocks, 300);
  }
  
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0 &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
      rect.right >= 0
    );
  }
  
  // Check if Font Awesome is loaded, if not add it
  if (!document.querySelector('link[href*="fontawesome"]')) {
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(fontAwesome);
  }
 