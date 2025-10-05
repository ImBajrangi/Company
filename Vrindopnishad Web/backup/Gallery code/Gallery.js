document.addEventListener('DOMContentLoaded', () => {
  const loadingOverlay = document.querySelector('.loading-overlay');
  const blocks = document.querySelectorAll('.block');
  const menuItems = document.querySelectorAll('.navigation ul li');
  const footer = document.querySelector('footer');
  let lastScrollTop = 0;
  let defaultActiveItem = document.querySelector('.navigation ul li.active');
  let lastKnownScrollPosition = 0;
  let ticking = false;

  // Show loader immediately
  loadingOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Initialize everything first
  createParticles();
  enhanceBlocks();
  initScrollAnimation();
  createDynamicBackground();

  // Hide loader after content loads
  setTimeout(() => {
    loadingOverlay.style.opacity = '0';
    loadingOverlay.style.visibility = 'hidden';
    document.body.style.overflow = 'auto';
  }, 2000);

  blocks.forEach((block) => {
    block.addEventListener('click', () => {
      const imgSrc = block.querySelector('img').src;
      const textContent = block.querySelector('.text').textContent;

      // Show notification with the image and text
      showNotification(imgSrc, textContent);
    });

    block.addEventListener('mouseenter', function() {
      const actionButton = block.querySelector('.action-button');
      if (actionButton) {
        actionButton.style.opacity = '1';
      }
    });

    block.addEventListener('mouseleave', function() {
      const actionButton = block.querySelector('.action-button');
      if (actionButton) {
        actionButton.style.opacity = '0';
      }
    });
  });

  document.querySelectorAll('.block').forEach(block => {
    block.addEventListener('mouseenter', () => {
        const openButton = block.querySelector('.open-button');
        openButton.style.opacity = '1';
    });

    block.addEventListener('mouseleave', () => {
        const openButton = block.querySelector('.open-button');
        openButton.style.opacity = '0';
    });
  });

  function showNotification(imgSrc, textContent) {
    // Remove existing notification (if any)
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();

    // Remove existing cross button (if any)
    const existingCrossButton = document.querySelector('.cross-button');
    if (existingCrossButton) existingCrossButton.remove();

    // Create notification container
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background:rgb(213, 240, 243);
      padding: 20px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
      border-radius: 25px;
      text-align: center;
      z-index: 1000;
    `;

    // Add image to the notification
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = 'Notification Image';
    img.style.cssText = `
      width: 50%; /* Reduce the size of the image */
      height: auto;
      border-radius: 15px;
    `;

    // Add text to the notification
    const text = document.createElement('div');
    text.classList.add('notification-text');
    text.textContent = textContent;
    text.style.cssText = `
      margin: 15px 0;
      font-size: 1.2rem;
      color: #333;
    `;

    // Add buttons to the notification
    const actionButton = document.createElement('button');
    actionButton.textContent = 'Action';
    actionButton.style.cssText = `
      margin-right: 20px; /* Increase margin to create distance */
      padding: 7.5px 15px; /* Increase padding */
      font-size: 1.1rem; /* Increase font size */
      background:rgb(248, 239, 104);
      color:rgb(3, 90, 114);
      border: none;
      border-radius: 30px;
      cursor: pointer;
      box-shadow: 0 0px 40px rgba(16, 240, 244, 0.9);
      transition: transform 0.6s ease, box-shadow 0.6s ease; /* Add transition for hover effect */
    `;
    actionButton.addEventListener('click', () => {
      window.open('https://heyzine.com/flip-book/f1c121acb6.html', '_blank'); // Open e-book link in a new tab
    });
    actionButton.addEventListener('mouseenter', () => {
      actionButton.style.transform = 'scale(1.2)';
      actionButton.style.boxShadow = '0 0px 100px rgb(255, 243, 107)';
    });
    actionButton.addEventListener('mouseleave', () => {
      actionButton.style.transform = 'scale(1)';
      actionButton.style.boxShadow = '0 0px 60px rgba(250, 240, 151, 0.9)';
    });

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.cssText = `
      padding: 7.5px 15px; /* Increase padding */
      font-size: 1.1rem; /* Increase font size */
      background:rgb(42, 42, 1);
      color:rgb(243, 251, 103);
      border: none;
      border-radius: 30px;
      cursor: pointer;
      box-shadow: 0 0px 40px rgba(63, 249, 246, 0.9);
      transition: transform 0.6s ease, box-shadow 0.6s ease; /* Add transition for hover effect */
    `;
    closeButton.addEventListener('click', () => {
      notification.remove();
      overlay.remove(); // Remove overlay when notification is closed
      crossButton.remove(); // Remove cross button when notification is closed
      document.body.classList.remove('no-interaction'); // Re-enable interactions
    });
    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.transform = 'scale(1.2)';
      closeButton.style.boxShadow = '0 0px 50px rgb(255, 224, 47)';
    });
    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.transform = 'scale(1)';
      closeButton.style.boxShadow = '0 0px 30px rgba(24, 72, 114, 0.8)';
    });

    // Add cross button to the notification
    const crossButton = document.createElement('span');
    crossButton.classList.add('cross-button');
    crossButton.textContent = '×';
    crossButton.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      font-size: 40px;
      cursor: pointer;
      z-index: 1001;
      color:rgb(244, 247, 198);
    `;
    crossButton.addEventListener('click', () => {
      notification.remove();
      overlay.remove(); // Remove overlay when notification is closed
      crossButton.remove(); // Remove cross button when notification is closed
      document.body.classList.remove('no-interaction'); // Re-enable interactions
    });

    // Append elements to the notification
    notification.appendChild(img);
    notification.appendChild(text);
    notification.appendChild(actionButton);
    notification.appendChild(closeButton);

    // Append the notification and cross button to the body
    document.body.appendChild(notification);
    document.body.appendChild(crossButton);

    // Add overlay to dim the background
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      box-shadow: 0 0px 10px rgba(249, 220, 0, 0.5);
    `;
    overlay.addEventListener('click', () => {
      notification.remove();
      crossButton.remove();
      overlay.remove();
      document.body.classList.remove('no-interaction'); // Re-enable interactions
    });
    document.body.appendChild(overlay);

    // Disable interactions on the background
    document.body.classList.add('no-interaction');

    // Show notification with animation
    setTimeout(() => {
      notification.style.transform = 'scale(1)';
      notification.style.opacity = '1';
    }, 10);

    // Auto close after some time
    const autoCloseTimeout = setTimeout(() => {
      notification.style.transform = 'scale(0.9)';
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 8000);
  }

  // Menu Bar Functionality
  function initializeMenuBar() {
    const menuItems = document.querySelectorAll('.navigation ul li');
    const searchIcon = document.getElementById('searchIcon');
    const searchBar = document.getElementById('searchBar');

    // Menu item hover and click effects
    menuItems.forEach(item => {
      const icon = item.querySelector('.icon');
      const color = item.style.getPropertyValue('--clr');

      // Hover effect
      item.addEventListener('mouseover', () => {
        icon.style.transform = 'scale(1.2)';
        icon.style.filter = `drop-shadow(0 0 8px ${color})`;
      });

      item.addEventListener('mouseout', () => {
        icon.style.transform = 'scale(1)';
        icon.style.filter = `drop-shadow(0 0 2px ${color})`;
      });

      // Click effect
      item.addEventListener('click', () => {
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        icon.style.transform = 'scale(0.9)';
        setTimeout(() => {
          icon.style.transform = 'scale(1.2)';
        }, 100);
      });
    });

    // Search functionality
    searchIcon.addEventListener('click', (e) => {
      e.preventDefault();
      searchBar.style.display = searchBar.style.display === 'block' ? 'none' : 'block';
      if (searchBar.style.display === 'block') {
        searchBar.querySelector('input').focus();
      }
    });

    // Close search bar when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchBar.contains(e.target) && !searchIcon.contains(e.target)) {
        searchBar.style.display = 'none';
      }
    });

    // Magnetic effect
    menuItems.forEach(item => {
      const icon = item.querySelector('.icon');
      
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x * 0.2;
        const moveY = y * 0.2;
        
        icon.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.2)`;
      });
      
      item.addEventListener('mouseleave', () => {
        icon.style.transform = 'translate(0, 0) scale(1)';
      });
    });
  }

  // Initialize menu bar
  initializeMenuBar();

  // Show search bar on click
  const searchIcon = document.getElementById('searchIcon');
  const searchBar = document.getElementById('searchBar');
  searchIcon.addEventListener('click', (e) => {
    e.preventDefault();
    searchBar.style.display = 'block';
    searchBar.classList.add('fade-in'); // Add fade-in animation
  });

  // Ensure search bar opens correctly when clicking on the search icon
  document.addEventListener('click', (e) => {
    if (e.target.id === 'searchIcon' || e.target.closest('#searchIcon')) {
      searchBar.style.display = 'block';
      searchBar.classList.add('fade-in'); // Add fade-in animation
    }
  });

  // Ensure search bar closes when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchBar.contains(e.target) && e.target.id !== 'searchIcon' && !e.target.closest('#searchIcon')) {
      searchBar.style.display = 'none';
      searchBar.classList.remove('fade-in'); // Remove fade-in animation
      searchIcon.classList.remove('active'); // Remove active class from search icon
    }
  });

  const list = document.querySelectorAll('.navigation ul li');
  function activeLink() {
    list.forEach(item => item.classList.remove('active'));
    this.classList.add('active');
  }
  list.forEach(item => item.addEventListener('click', activeLink));

  // Update existing click handlers to preserve active state
  document.querySelectorAll('.block').forEach(block => {
    block.addEventListener('click', () => {
      list.forEach(item => item.classList.remove('active'));
      document.querySelector('.navigation ul li[href="./Gallery.html"]').classList.add('active');
    });
  });

  // Add background motion
  document.addEventListener('mousemove', (e) => {
    if (!document.body.classList.contains('no-interaction')) {
      const moveX = (e.clientX / window.innerWidth) * 10 - 5;
      const moveY = (e.clientY / window.innerHeight) * 10 - 5;
      document.body.style.backgroundPosition = `${moveX}px ${moveY}px`;
    }
  });

  // Ensure picture's movement in desktop mode
  const sliderItems = document.querySelectorAll('.slider .item');
  sliderItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (!document.body.classList.contains('no-interaction')) {
        item.querySelector('img').style.transform = 'scale(1.1)';
      }
    });
    item.addEventListener('mouseleave', () => {
      if (!document.body.classList.contains('no-interaction')) {
        item.querySelector('img').style.transform = 'scale(1)';
      }
    });
  });

  // Ensure "Shri Radhe" text font and style are applied correctly
  const bannerContentH1 = document.querySelector('.banner .content h1');
  if (bannerContentH1) {
    bannerContentH1.style.fontFamily = 'ICA Rubrik';
    bannerContentH1.style.fontSize = '16em';
    bannerContentH1.style.lineHeight = '1em';
    bannerContentH1.style.color = '#fdf926';
    bannerContentH1.style.position = 'relative';
    bannerContentH1.style.marginLeft = '0';
    bannerContentH1.style.textAlign = 'center';
    bannerContentH1.style.webkitTextStroke = '2px #f4f8a1';
  }

  // Ensure menu items are reactable when notification is on
  menuItems.forEach(item => {
    item.style.pointerEvents = 'auto';
  });

  // Handle footer scroll effect
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight) {
      // User is at the bottom of the page
      footer.style.bottom = '0';
      document.body.classList.add('show-footer');
    } else {
      // Scrolling up or down
      footer.style.bottom = '-100px';
      document.body.classList.remove('show-footer');
    }
    lastScrollTop = scrollTop;
  });

  // Add menu interaction code
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });

    // Add hover effect
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = (x - centerX) * 0.1;
      const deltaY = (y - centerY) * 0.1;
      
      item.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translate(0, 0)';
    });
  });

  // Handle scroll behavior - consolidated
  window.addEventListener('scroll', () => {
    const navigation = document.querySelector('.navigation');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (window.innerWidth <= 768) {
      if (scrollTop > lastScrollTop) {
        navigation.style.transform = 'translate(-50%, 100%)';
      } else {
        navigation.style.transform = 'translate(-50%, 0)';
      }
      lastScrollTop = scrollTop;
    }
  }, { passive: true });

  // Create Particles
  function createParticles() {
    const particleContainer = document.querySelector('.particle-background');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random positioning
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random size
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random animation duration
      particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
      
      particleContainer.appendChild(particle);
    }
  }

  // Enhanced Block Interactions
  function enhanceBlocks() {
    const blocks = document.querySelectorAll('.block');
    
    blocks.forEach(block => {
      // Add 3D rotation effect
      block.addEventListener('mousemove', (e) => {
        const rect = block.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 20;
        const angleY = (centerX - x) / 20;
        
        block.style.transform = `
          perspective(1000px)
          rotateX(${angleX}deg)
          rotateY(${angleY}deg)
          translateZ(10px)
        `;
      });
      
      // Reset transform on mouse leave
      block.addEventListener('mouseleave', () => {
        block.style.transform = 'none';
      });
    });
  }

  // Scroll Animation
  function initScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px'
    });

    document.querySelectorAll('.block').forEach(block => {
      block.style.opacity = 0;
      block.style.transform = 'translateY(20px)';
      block.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(block);
    });
  }

  // Enhanced Menu Icons
  function enhanceMenuIcons() {
    const menuItems = document.querySelectorAll('.navigation .menu-items li');
    
    menuItems.forEach(item => {
      const icon = item.querySelector('.icon');
      const color = item.style.getPropertyValue('--clr');
      
      // Add hover effect
      item.addEventListener('mouseover', () => {
        icon.style.transform = 'scale(1.2)';
        icon.style.filter = `drop-shadow(0 0 8px ${color})`;
      });
      
      item.addEventListener('mouseout', () => {
        icon.style.transform = 'scale(1)';
        icon.style.filter = `drop-shadow(0 0 2px ${color})`;
      });
      
      // Add click effect
      item.addEventListener('click', () => {
        icon.style.transform = 'scale(0.9)';
        setTimeout(() => {
          icon.style.transform = 'scale(1.2)';
        }, 100);
      });
    });
  }

  // Enhanced Magnetic Effect for Menu Items
  function initMagneticEffect() {
    const menuItems = document.querySelectorAll('.menu-items li');
    
    menuItems.forEach(item => {
      const icon = item.querySelector('.icon');
      
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Calculate distance from center
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = Math.sqrt(rect.width * rect.width + rect.height * rect.height) / 2;
        const strength = Math.min(distance / maxDistance, 1);
        
        // Apply magnetic effect
        const moveX = x * 0.2;
        const moveY = y * 0.2;
        
        icon.style.transform = `
          translate(${moveX}px, ${moveY}px) 
          scale(${1 + strength * 0.2})
        `;
        
        // Add glow effect based on distance
        const color = item.style.getPropertyValue('--clr');
        icon.style.filter = `drop-shadow(0 0 ${5 + strength * 10}px ${color})`;
      });
      
      // Reset on mouse leave
      item.addEventListener('mouseleave', () => {
        icon.style.transform = 'translate(0, 0) scale(1)';
        icon.style.filter = 'none';
      });
      
      // Click effect
      item.addEventListener('mousedown', () => {
        icon.style.transform = 'scale(0.95)';
      });
      
      item.addEventListener('mouseup', () => {
        icon.style.transform = 'scale(1)';
      });
    });
  }

  // Wrap non-critical initializations
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      initMagneticEffect();
      enhanceMenuIcons();
    });
  } else {
    setTimeout(() => {
      initMagneticEffect();
      enhanceMenuIcons();
    }, 3000);
  }

  // Initialize GSAP animations
  gsap.registerPlugin(ScrollTrigger);

  // Animate blocks on scroll
  gsap.utils.toArray('.block').forEach((block, i) => {
    ScrollTrigger.create({
        trigger: block,
        start: 'top bottom-=100',
        onEnter: () => gsap.to(block, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.1,
            overwrite: 'auto'
        }),
        onLeaveBack: () => gsap.set(block, { y: 100, opacity: 0 })
    });
  });

  // Animate menu items
  gsap.from('.navigation .menu-items li', {
    y: -50,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'back.out(1.7)'
  });

  // Enhanced hover effects
  document.querySelectorAll('.block').forEach(block => {
    block.addEventListener('mouseenter', () => {
      gsap.to(block, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    block.addEventListener('mouseleave', () => {
      gsap.to(block, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });

  function handleScroll(scrollPos) {
    if (scrollPos > 250) {
      header.style.backgroundColor = 'rgba(218, 158, 7, 0.2)';
    } else {
      header.style.backgroundColor = 'rgba(249, 249, 248, 0.05)';
    }
  }

  document.addEventListener('scroll', () => {
    lastKnownScrollPosition = window.scrollY;
    
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll(lastKnownScrollPosition);
        ticking = false;
      });
      ticking = true;
    }
  });

  // Lazy load images
  const lazyImages = document.querySelectorAll('.lazyload');

  const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.classList.add('loaded');
              imageObserver.unobserve(img);
          }
      });
  }, { rootMargin: '200px 0px' });

  lazyImages.forEach(img => imageObserver.observe(img));

  // Add this function to create dynamic background
  function createDynamicBackground() {
    const background = document.querySelector('.animated-background');
    if (!background) return;
    
    // Create floating elements
    const colors = ['#00b5cd', '#fd630a', '#4a3df9', '#ff61d2', '#ffd93d'];
    const sizes = [120, 150, 180, 200, 220, 250];
    
    for (let i = 0; i < 8; i++) {
      const element = document.createElement('div');
      element.classList.add('floating-element');
      
      // Random properties
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = 15 + Math.random() * 15;
      
      // Apply styles
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.backgroundColor = color;
      element.style.left = `${left}%`;
      element.style.top = `${top}%`;
      element.style.animationDuration = `${duration}s`;
      element.style.animationDelay = `${delay}s`;
      
      background.appendChild(element);
    }
    
    // Create pattern overlay
    const pattern = document.createElement('div');
    pattern.classList.add('bg-pattern');
    document.body.appendChild(pattern);
    
    // Add parallax effect to background elements
    document.addEventListener('mousemove', (e) => {
      const moveX = (e.clientX / window.innerWidth) * 10 - 5;
      const moveY = (e.clientY / window.innerHeight) * 10 - 5;
      
      document.querySelectorAll('.floating-element').forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed') || Math.random() * 0.1);
        el.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
      });
    });
  }

  // Enhanced search functionality
  initEnhancedSearch();
  
  // Initialize category filters
  initCategoryFilters();
  
  // Initialize Tailwind-powered animations
  initTailwindAnimations();

  // Initialize block notifications
  initBlockNotifications();
});

// Enhanced search functionality
function initEnhancedSearch() {
  const searchInput = document.getElementById('gallerySearchInput');
  const searchResults = document.getElementById('searchResults');
  const clearSearch = document.getElementById('clearSearch');
  const galleryItems = document.querySelectorAll('.uniform-block');
  
  if (!searchInput) return;
  
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm.length < 2) {
      searchResults.classList.add('hidden');
      return;
    }
    
    // Filter gallery items
    const matchingItems = [];
    galleryItems.forEach(item => {
      const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
      const desc = item.querySelector('p')?.textContent.toLowerCase() || '';
      const category = item.getAttribute('data-category')?.toLowerCase() || '';
      
      if (title.includes(searchTerm) || desc.includes(searchTerm) || category.includes(searchTerm)) {
        matchingItems.push(item);
      }
    });
    
    // Display results
    if (matchingItems.length > 0) {
      searchResults.innerHTML = '';
      searchResults.classList.remove('hidden');
      
      matchingItems.slice(0, 5).forEach(item => {
        const img = item.querySelector('img');
        const title = item.querySelector('h3')?.textContent || 'Gallery Item';
        const imgSrc = img.getAttribute('data-src') || img.getAttribute('src');
        
        const resultItem = document.createElement('div');
        resultItem.className = 'flex items-center p-2 hover:bg-purple-500/20 rounded-lg cursor-pointer';
        resultItem.innerHTML = `
          <div class="w-12 h-12 rounded overflow-hidden mr-3">
            <img src="${imgSrc}" class="w-full h-full object-cover" alt="${title}">
          </div>
          <div class="text-white">
            <h4 class="text-sm font-medium">${title}</h4>
            <p class="text-xs text-white/70">${item.getAttribute('data-category') || 'Gallery'}</p>
          </div>
        `;
        
        resultItem.addEventListener('click', () => {
          // Highlight the item in the gallery
          galleryItems.forEach(i => i.classList.remove('ring-4', 'ring-purple-500'));
          item.classList.add('ring-4', 'ring-purple-500');
          item.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Hide results
          searchResults.classList.add('hidden');
          searchInput.value = '';
        });
        
        searchResults.appendChild(resultItem);
      });
      
      if (matchingItems.length > 5) {
        const moreResults = document.createElement('div');
        moreResults.className = 'text-center text-purple-400 text-sm py-2 border-t border-purple-500/20';
        moreResults.textContent = `+ ${matchingItems.length - 5} more results`;
        searchResults.appendChild(moreResults);
      }
    } else {
      searchResults.innerHTML = '<div class="text-center text-white/70 p-4">No results found</div>';
      searchResults.classList.remove('hidden');
    }
  });
  
  clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    searchResults.classList.add('hidden');
    galleryItems.forEach(i => i.classList.remove('ring-4', 'ring-purple-500'));
  });
  
  // Close search results when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target) && !clearSearch.contains(e.target)) {
      searchResults.classList.add('hidden');
    }
  });
}

// Category filtering functionality
function initCategoryFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.uniform-block');
  
  if (!filterButtons.length) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active', 'bg-purple-600', 'hover:bg-purple-700'));
      button.classList.add('active', 'bg-purple-600', 'hover:bg-purple-700');
      
      // Filter items with smooth animations
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || category === itemCategory) {
          // Show item with animation
          item.classList.remove('scale-90', 'opacity-0');
          item.classList.add('scale-100', 'opacity-100');
          setTimeout(() => {
            item.style.display = 'block';
          }, 50);
        } else {
          // Hide item with animation
          item.classList.remove('scale-100', 'opacity-100');
          item.classList.add('scale-90', 'opacity-0');
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
      
      // Show notification
      showFilterNotification(category);
    });
  });
}

// Show notification when filter is applied
function showFilterNotification(category) {
  // Create notification if it doesn't exist
  let notification = document.querySelector('.filter-notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'filter-notification fixed top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    document.body.appendChild(notification);
  }
  
  // Set notification text
  notification.textContent = category === 'all' 
    ? 'Showing all gallery items' 
    : `Showing ${category} items`;
  
  // Show notification
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.add('translate-x-full');
  }, 3000);
}

// Initialize Tailwind-powered animations
function initTailwindAnimations() {
  // Add scroll animations to gallery items
  const galleryItems = document.querySelectorAll('.uniform-block');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    galleryItems.forEach(item => {
      item.classList.add('opacity-0');
      observer.observe(item);
    });
  } else {
    // Fallback for browsers without Intersection Observer
    galleryItems.forEach(item => {
      item.classList.add('animate-fade-in');
    });
  }
}

// Initialize block notifications
function initBlockNotifications() {
  const blocks = document.querySelectorAll('.uniform-block');
  
  blocks.forEach(block => {
    block.addEventListener('click', (e) => {
      // Don't trigger notification if clicking on a button or link
      if (e.target.closest('button') || e.target.closest('a')) {
        return;
      }
      
      // Get block information
      const img = block.querySelector('img');
      const title = block.querySelector('h3')?.textContent || 'Gallery Item';
      const description = block.querySelector('p')?.textContent || '';
      const category = block.getAttribute('data-category') || block.querySelector('.category-tag')?.textContent || '';
      const imgSrc = img.getAttribute('data-src') || img.getAttribute('src');
      
      // Get position of the block
      const rect = block.getBoundingClientRect();
      
      // Calculate position based on block position
      const position = {
        top: rect.top + window.scrollY + (rect.height/2) - 100, // Center vertically
        left: rect.left + window.scrollX + (rect.width/2) - 125 // Center horizontally
      };
      
      // Show custom notification
      showBlockNotification(title, description, imgSrc, category, position, rect);
    });
  });
  
  // Add the needed style to head if not already added
  if (!document.getElementById('block-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'block-notification-styles';
    style.textContent = `
      .block-notification {
        transform-origin: center;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      
      .block-notification::after {
        content: '';
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid rgba(139, 92, 246, 0.3);
      }
      
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
  }
}

// Show a block-specific notification
function showBlockNotification(title, description, imgSrc, category, position, rect) {
  // Remove any existing block notifications
  const existingNotifications = document.querySelectorAll('.block-notification');
  existingNotifications.forEach(notification => notification.remove());
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'block-notification fixed bg-black/80 backdrop-blur-md rounded-xl overflow-hidden border border-purple-500/30 shadow-lg z-50 w-[250px] opacity-0 scale-90 transition-all duration-300';
  
  // Set a width based on the block's width (with constraints)
  const width = Math.min(Math.max(rect.width, 250), 320);
  notification.style.width = `${width}px`;
  
  // Position notification over the block
  notification.style.top = `${position.top}px`;
  notification.style.left = `${position.left}px`;
  
  // Create notification content
  notification.innerHTML = `
    <div class="relative">
      <div class="absolute top-2 right-2 z-10">
        <button class="close-notification p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white/70 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <img src="${imgSrc}" class="w-full h-32 object-cover" alt="${title}" loading="lazy">
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
      <span class="absolute bottom-2 left-2 bg-purple-600/80 text-white text-xs px-2 py-0.5 rounded-full">${category}</span>
    </div>
    <div class="p-3">
      <h3 class="text-white font-medium text-sm mb-1 truncate">${title}</h3>
      <p class="text-white/70 text-xs line-clamp-2 mb-3">${description}</p>
      <div class="flex justify-between gap-2">
        <button class="view-details flex-1 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-md transition-colors">
          View Details
        </button>
        <button class="add-favorite p-1.5 bg-purple-500/30 hover:bg-purple-500/50 rounded-md text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>`;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Add event listeners
  const closeBtn = notification.querySelector('.close-notification');
  closeBtn.addEventListener('click', () => {
    notification.classList.add('opacity-0', 'scale-90');
    setTimeout(() => notification.remove(), 300);
  });
  
  const viewDetailsBtn = notification.querySelector('.view-details');
  viewDetailsBtn.addEventListener('click', () => {
    // Implement view details functionality
    console.log(`View details for ${title}`);
    // You can add code here to open a modal or navigate to a details page
  });
  
  const addFavoriteBtn = notification.querySelector('.add-favorite');
  addFavoriteBtn.addEventListener('click', () => {
    // Implement add to favorites functionality
    addFavoriteBtn.classList.toggle('text-pink-500');
    addFavoriteBtn.classList.toggle('bg-pink-500/20');
    
    // Show mini notification
    const miniNotif = document.createElement('div');
    miniNotif.className = 'fixed top-4 right-4 bg-pink-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    miniNotif.textContent = 'Added to favorites!';
    document.body.appendChild(miniNotif);
    
    setTimeout(() => miniNotif.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
      miniNotif.classList.add('translate-x-full');
      setTimeout(() => miniNotif.remove(), 300);
    }, 2000);
  });
  
  // Show notification with animation
  setTimeout(() => {
    notification.classList.remove('opacity-0', 'scale-90');
    notification.classList.add('opacity-100', 'scale-100');
  }, 10);
  
  // Auto close after some time
  const autoCloseTimeout = setTimeout(() => {
    notification.classList.add('opacity-0', 'scale-90');
    setTimeout(() => notification.remove(), 300);
  }, 8000);
  
  // Clear timeout if user interacts with notification
  notification.addEventListener('mouseenter', () => {
    clearTimeout(autoCloseTimeout);
  });
}