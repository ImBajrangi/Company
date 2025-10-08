/**
 * Main Application JavaScript for About Page
 * Enhanced with advanced animations and interactions
 */

// Global state management
const state = {
    isMenuOpen: false,
    isToolsMenuOpen: false,
    currentCarouselSlide: 0,
    isLoading: true,
    preferredLanguage: localStorage.getItem('preferredLanguage') || 'en'
};

const hamburger = document.querySelector('.shyam');
const mobile_menu = document.querySelector('.navigation ul');
const menu_item = document.querySelectorAll('.navigation ul li a');
const header = document.querySelector('.navigation');
const sections = document.querySelectorAll('section');
const navLi = document.querySelectorAll('.nav-list ul li');

hamburger.addEventListener('click', () => {
	hamburger.classList.toggle('active');
	mobile_menu.classList.toggle('active');
	hamburger.style.transform = hamburger.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0deg)';
});

document.addEventListener('scroll', () => {
	var scroll_position = window.scrollY;
	if (scroll_position > 250) {
		header.style.backgroundColor = 'rgba(218, 158, 7, 0.2)';
		header.style.backdropFilter = 'blur(10px)';
		header.style.webkitBackdropFilter = 'blur(10px)';
		header.style.borderRadius = '10px';
		header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
	} else {
		header.style.backgroundColor = 'rgba(249, 249, 248, 0.05)';
		header.style.backdropFilter = 'blur(10px)';
		header.style.webkitBackdropFilter = 'blur(10px)';
		header.style.borderRadius = '10px';
		header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
	}

	sections.forEach((section) => {
		const sectionTop = section.offsetTop;
		const sectionHeight = section.clientHeight;
		if (scroll_position >= sectionTop - sectionHeight / 3 && scroll_position < sectionTop + sectionHeight - sectionHeight / 3) {
			const currentId = section.getAttribute('id');
			navLi.forEach((li) => {
				li.classList.remove('active');
				if (li.querySelector('a').getAttribute('href').includes(currentId)) {
					li.classList.add('active');
				}
			});
		}
	});
});

window.addEventListener('scroll', () => {
  const footer = document.querySelector('footer');
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) { // Adjust the threshold
    footer.classList.add('show-footer');
  } else {
    footer.classList.remove('show-footer');
  }
});

// Ensure the first icon is already popped on entering
document.addEventListener('DOMContentLoaded', () => {
	navLi[0].classList.add('active');
});

menu_item.forEach((item) => {
	item.addEventListener('click', () => {
		hamburger.classList.toggle('active');
		mobile_menu.classList.toggle('active');
		hamburger.style.transform = hamburger.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0deg)';
	});
});

// Add hover effect to menu notification items
document.querySelectorAll('.menu-notification').forEach(notification => {
    notification.addEventListener('mouseenter', () => {
        notification.style.transform = 'scale(1.1)';
        notification.style.boxShadow = '0 0 5px rgba(106, 17, 203, 0.3), 0 12px 24px rgba(0, 0, 0, 0.3)';
    });
    notification.addEventListener('mouseleave', () => {
        notification.style.transform = 'scale(1)';
        notification.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.5)';
    });
});

document.querySelectorAll('.menu-notification').forEach(notification => {
    notification.addEventListener('mouseenter', () => {
        const openButton = notification.querySelector('.open-button');
        openButton.style.opacity = '1';
    });

    notification.addEventListener('mouseleave', () => {
        const openButton = notification.querySelector('.open-button');
        openButton.style.opacity = '0';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Menu Initialization and Animation
     * - Handles menu item activation
     * - Controls hover effects
     * - Manages transitions
     */
    const menuItems = document.querySelectorAll('.navigation ul li');
    let activeIndex = 0;

    /**
     * Search Bar Management
     * - Toggles between mobile and desktop search bars
     * - Handles search functionality
     * @param {HTMLElement} searchBar - The search bar element
     */
    function handleSearchBars() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            mobileSearchBar.style.display = 'flex';
            if (desktopSearchBar) {
                desktopSearchBar.style.display = 'none';
            }
        } else {
            mobileSearchBar.style.display = 'none';
            if (desktopSearchBar) {
                desktopSearchBar.style.display = 'flex';
            }
        }
    }

    // Initial call
    handleSearchBars();

    // Handle window resize
    window.addEventListener('resize', handleSearchBars);

    // Handle search functionality
    function handleSearch(searchBar) {
        const input = searchBar.querySelector('input');
        const button = searchBar.querySelector('button');

        button.addEventListener('click', (e) => {
            e.preventDefault();
            performSearch(input.value);
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(input.value);
            }
        });
    }

    function performSearch(query) {
        // Add your search logic here
        console.log('Searching for:', query);
        // Example: You can add your search implementation
    }

    // Initialize search for both bars
    const searchBars = document.querySelectorAll('.search-bar');
    searchBars.forEach(handleSearch);

    // Rest of your existing menu animation code
    function activateNextItem() {
        menuItems[activeIndex].classList.remove('active');
        menuItems[activeIndex].classList.add('fade-out');

        activeIndex = (activeIndex + 1) % menuItems.length;

        menuItems[activeIndex].classList.remove('fade-out');
        menuItems[activeIndex].classList.add('active', 'fade-in');

        setTimeout(() => {
            menuItems[activeIndex].classList.remove('fade-in');
        }, 500);
    }

    // Initial activation
    menuItems[activeIndex].classList.add('active');

    // Set interval to activate the next item every 3 seconds
    let intervalId = setInterval(activateNextItem, 3000);

    // Stop the activating animation after 2 minutes and activate the Home icon
    setTimeout(() => {
        clearInterval(intervalId);
        menuItems.forEach(item => item.classList.remove('active'));
        menuItems[0].classList.add('active'); // Activate the Home icon
    }, 120000); // 2 minutes in milliseconds

    menuItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('hover');
            setTimeout(() => {
                item.classList.remove('hover');
            }, 500);
        }, index * 1000); // Increase delay to ensure visibility
    });

    // Add functionality for the shyam menu
    const shyamMenu = document.querySelector('.shyam-menu');
    const nav = document.querySelector('nav');

    shyamMenu.addEventListener('click', () => {
        shyamMenu.classList.toggle('open');
        nav.classList.toggle('show');
    });
});

// Function to get a random number between min and max (inclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createMathematicalPattern(element) {
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Create mathematical pattern using sine waves
  let angle = 0;
  const interval = setInterval(() => {
    const x = centerX + Math.sin(angle) * 20;
    const y = centerY + Math.cos(angle) * 20;
    
    element.style.transform = `translate(${Math.sin(angle/2) * 5}px, ${Math.cos(angle/2) * 5}px) rotate(${angle * 10}deg)`;
    
    angle += 0.02;
    if (angle > Math.PI * 2) angle = 0;
  }, 50);

  return interval;
}

document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.navigation ul li');
  
  menuItems.forEach((item, index) => {
    // Add mathematical hover effect
    item.addEventListener('mouseenter', () => {
      const interval = createMathematicalPattern(item);
      item.dataset.interval = interval;
    });
    
    item.addEventListener('mouseleave', () => {
      clearInterval(Number(item.dataset.interval));
      item.style.transform = '';
    });
    
    // Add fibonacci-based delay for initial animation
    const fibonacci = (n) => n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);
    const delay = fibonacci(index) * 100;
    
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, delay);
  });
});

// Add this function for low-data consumption particle effect
function createMinimalParticles(element) {
  const particleCount = 5;
  const particles = [];
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'menu-particle';
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: ${element.style.getPropertyValue('--clr')};
      border-radius: 50%;
      pointer-events: none;
    `;
    element.appendChild(particle);
    particles.push(particle);
  }
  
  return particles;
}

// Add particle animation to menu items
document.querySelectorAll('.navigation ul li').forEach(item => {
  const particles = createMinimalParticles(item);
  
  item.addEventListener('mousemove', (e) => {
    particles.forEach((particle, index) => {
      const angle = (Math.PI * 2 * index) / particles.length;
      const radius = 20;
      const x = e.offsetX + Math.cos(angle) * radius;
      const y = e.offsetY + Math.sin(angle) * radius;
      
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Add scroll indicator
  const scrollIndicator = document.createElement('div');
  scrollIndicator.className = 'scroll-indicator';
  document.body.appendChild(scrollIndicator);

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollIndicator.style.width = scrolled + '%';
  });

  // Add image loading animation
  const allImages = document.querySelectorAll('img');

  allImages.forEach(img => {
    img.addEventListener('load', () => {
      img.classList.add('loaded');
    });
  });

  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add touch feedback for menu items
  const menuItems = document.querySelectorAll('.navigation ul li');
  menuItems.forEach(item => {
    item.addEventListener('touchstart', () => {
      item.style.transform = 'scale(0.95)';
    });
    item.addEventListener('touchend', () => {
      item.style.transform = '';
    });
  });

  // Performance optimized menu handling
  const navigation = document.querySelector('.navigation');
    let lastScrollTop = 0;
  
  // Optimize scroll handling
  window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Hide/show navigation based on scroll direction
      if (window.innerWidth <= 768) {
        if (scrollTop > lastScrollTop) {
          navigation.style.transform = 'translateY(100%)';
        } else {
          navigation.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
      }
    });
  }, { passive: true });

  // Optimize menu item activation
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Intersection Observer for section detection
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        menuItems.forEach(item => {
          if (item.querySelector('a').getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Optimize image loading
  const lazyImages = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('fade-in');
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));
});

document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.navigation ul li');
  
  // Add ripple elements to menu items
  menuItems.forEach(item => {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    item.appendChild(ripple);
  });

  // Handle touch interactions
  menuItems.forEach(item => {
    // Touch start
    item.addEventListener('touchstart', (e) => {
      e.preventDefault();
      
      // Add touch feedback
      item.classList.add('touch-active');
      
      // Create ripple effect
      const ripple = item.querySelector('.ripple');
      ripple.classList.remove('active');
      void ripple.offsetWidth; // Trigger reflow
      ripple.classList.add('active');
    });

    // Touch end
    item.addEventListener('touchend', () => {
      // Remove touch feedback
      item.classList.remove('touch-active');
      
      // Handle menu item activation
      menuItems.forEach(i => i.classList.remove('menu-active'));
      item.classList.add('menu-active');
      
      // Navigate after animation completes
      setTimeout(() => {
        const link = item.querySelector('a');
        if (link) {
          window.location.href = link.href;
        }
      }, 300);
    });

    // Cancel touch feedback if touch is moved away
    item.addEventListener('touchcancel', () => {
      item.classList.remove('touch-active');
    });
    
    item.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const rect = item.getBoundingClientRect();
      const isInside = 
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom;
      
      if (!isInside) {
        item.classList.remove('touch-active');
      }
    });
  });

  // Initial animation completion handler
  let animationsComplete = false;
  const lastItem = menuItems[menuItems.length - 1];
  
  lastItem.addEventListener('animationend', () => {
    animationsComplete = true;
    menuItems.forEach(item => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0) scale(1)';
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const navigation = document.querySelector('.navigation');
  let lastScrollTop = 0;
  const scrollThreshold = 100; // Adjust this value to change when the menu switches position

  function updateMenuPosition() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Remove existing position classes
    navigation.classList.remove('top-position', 'bottom-position');
    
    // Add appropriate position class based on scroll
    if (scrollTop > scrollThreshold) {
      navigation.classList.add('bottom-position');
      // Optional: Add different background for better visibility at bottom
      navigation.style.background = 'rgba(255, 255, 255, 0.2)';
    } else {
      navigation.classList.add('top-position');
      // Reset background when at top
      navigation.style.background = 'rgba(255, 255, 255, 0.15)';
    }

    // Update last scroll position
    lastScrollTop = scrollTop;
  }

  // Initial position
  updateMenuPosition();

  // Update on scroll
  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateMenuPosition);
  }, { passive: true });

  // Update on resize
  window.addEventListener('resize', () => {
    requestAnimationFrame(updateMenuPosition);
  }, { passive: true });
});

// Disable right click
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  // Optional: You can add a custom message or alert here
  alert('Right click is disabled!');
});

// Disable keyboard shortcuts that could bypass right-click protection
document.addEventListener('keydown', (e) => {
  // Prevent F12 key
  if (e.key === 'F12') {
    e.preventDefault();
  }

  // Prevent Ctrl+Shift+I
  if (e.ctrlKey && e.shiftKey && e.key === 'I') {
    e.preventDefault();
  }

  // Prevent Ctrl+Shift+J
  if (e.ctrlKey && e.shiftKey && e.key === 'J') {
    e.preventDefault();
  }

  // Prevent Ctrl+U (View Source)
  if (e.ctrlKey && e.key === 'u') {
    e.preventDefault();
  }
});

// Optional: Disable text selection
document.addEventListener('selectstart', (e) => {
  e.preventDefault();
});

// Add this to your existing menu initialization
function createParticles(element) {
  const particlesContainer = document.createElement('div');
//   particlesContainer.className = 'particles';
  
  for(let i = 0; i < 5; i++) {
    const particle = document.createElement('span');
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 2}s`;
    // particlesContainer.appendChild(particle);
  }
  
//   element.appendChild(particlesContainer);
}

document.querySelectorAll('.navigation ul li').forEach(item => {
  createParticles(item);
  
  // Add magnetic effect
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const deltaX = (x - centerX) * 0.1;
    const deltaY = (y - centerY) * 0.1;
    
    item.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.1)`;
  });
  
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

// Enhanced scroll animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.lazy-load').forEach(element => {
  observer.observe(element);
});

// Improved horizontal scroll effect for team section
function initHorizontalScroll() {
    const horizontalSections = document.querySelectorAll('.horizontal-section');
    
    if (horizontalSections.length === 0) return;
    
    horizontalSections.forEach(section => {
        const horizontalContent = section.querySelector('.horizontal-content');
        if (!horizontalContent) return;
        
        const isTeamSection = section.classList.contains('team-section');
        
        // Get total width of content for calculation
        let contentWidth = 0;
        const items = horizontalContent.querySelectorAll('.horizontal-item');
        items.forEach(item => {
            contentWidth += item.offsetWidth + parseInt(getComputedStyle(item).marginRight);
        });
        
        // Additional space for team section
        if (isTeamSection) {
            contentWidth += parseInt(getComputedStyle(horizontalContent).paddingLeft) +
                           parseInt(getComputedStyle(horizontalContent).paddingRight);
        }
        
        // Set section height for proper scrolling on desktop
        if (window.innerWidth > 768) {
            // Team section needs more scrolling space to see all members
            if (isTeamSection) {
                // Calculate extra height needed to show all members
                const extraHeight = Math.max(0, contentWidth - window.innerWidth);
                
                // Increase height to ensure smooth scrolling through all members
                section.style.height = `calc(100vh + ${extraHeight * 0.7}px)`;
                
                // Add indicator to show there are more items
                const scrollIndicator = section.querySelector('.scroll-indicator');
                if (scrollIndicator) {
                    scrollIndicator.style.opacity = extraHeight > 0 ? '1' : '0';
                }
            } else {
                section.style.height = '100vh';
            }
        }
        
        const scrollHorizontal = () => {
            // Skip if in mobile view for team section
            if (window.innerWidth <= 768 && isTeamSection) return;
            
            const sectionRect = section.getBoundingClientRect();
            
            // Check if section is in view
            if (sectionRect.top < window.innerHeight && sectionRect.bottom > 0) {
                // Calculate scroll progress (0 to 1)
                let scrollProgress;
                
                if (isTeamSection) {
                    // For team section, use a more precise calculation
                    // Calculate how far we've scrolled into the section
                    const sectionTop = section.offsetTop;
                    const viewportHeight = window.innerHeight;
                    const scrollPosition = window.scrollY;
                    
                    // Start transition when section is 20% into viewport
                    const startPoint = sectionTop - viewportHeight * 0.8;
                    // End transition when we've scrolled through the calculated total height
                    const totalScrollDistance = section.offsetHeight * 0.7;
                    
                    // Calculate progress (0 to 1)
                    scrollProgress = Math.max(0, Math.min(1, 
                        (scrollPosition - startPoint) / totalScrollDistance
                    ));
                } else {
                    // Standard horizontal scroll based on viewport position
                    scrollProgress = Math.max(0, Math.min(1, 
                        1 - (sectionRect.bottom / (window.innerHeight + sectionRect.height))
                    ));
                }
                
                // Calculate horizontal translation - adjust for team section to show full content
                let translateX;
                if (isTeamSection) {
                    // Ensure we can see the full width of content
                    translateX = scrollProgress * (contentWidth - window.innerWidth * 0.7);
                } else {
                    translateX = scrollProgress * (contentWidth - window.innerWidth);
                }
                
                // Apply translation with smooth animation
                horizontalContent.style.transform = `translateX(-${translateX}px)`;
            }
        };
        
        window.addEventListener('scroll', () => {
            requestAnimationFrame(scrollHorizontal);
        });
        
        window.addEventListener('resize', () => {
            // Recalculate dimensions on resize
            if (window.innerWidth > 768) {
                // Update content width
                contentWidth = 0;
                items.forEach(item => {
                    contentWidth += item.offsetWidth + parseInt(getComputedStyle(item).marginRight);
                });
                
                if (isTeamSection) {
                    contentWidth += parseInt(getComputedStyle(horizontalContent).paddingLeft) +
                                   parseInt(getComputedStyle(horizontalContent).paddingRight);
                    
                    const extraHeight = Math.max(0, contentWidth - window.innerWidth);
                    section.style.height = `calc(100vh + ${extraHeight * 0.7}px)`;
                } else {
                    section.style.height = '100vh';
                }
            } else if (isTeamSection) {
                // Reset transform in mobile view for team section
                horizontalContent.style.transform = '';
                section.style.height = 'auto';
            }
            
            // Update horizontal position
            scrollHorizontal();
        });
        
        // Initial call
        scrollHorizontal();
    });
}

// Enhanced hover effects
document.querySelectorAll('.navigation ul li').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    item.style.setProperty('--mouse-x', `${x}px`);
    item.style.setProperty('--mouse-y', `${y}px`);
  });
});

// Enhanced image loading
const loadImage = (img) => {
  img.src = img.dataset.src;
  img.onload = () => {
    img.classList.add('loaded');
  };
};

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadImage(entry.target);
      imageObserver.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});

// Initialize all effects and animations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loader
    initLoader();
    
    // Initialize cursor
    initCursor();
    
    // Initialize scroll progress
    initScrollProgress();
    
    // Initialize parallax background
    initParallaxBg();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize tools menu
    initToolsMenu();
    
    // Initialize reveal animations
    initRevealAnimations();
    
    // Initialize horizontal scroll
    initHorizontalScroll();
    
    // Initialize staggered animations
    initStaggeredAnimations();
    
    // Initialize image hover effects
    initImageHoverEffects();
});

// Loader animation
function initLoader() {
    const loader = document.querySelector('.loader');
    const counter = document.querySelector('.counter');
    const loaderText = document.querySelector('.loader-text span');
    let count = 0;
    
    // Add loading text animation
    if (loaderText) {
        const text = loaderText.textContent;
        loaderText.textContent = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animationDelay = `${index * 0.1}s`;
            loaderText.appendChild(span);
        });
    }

    const interval = setInterval(() => {
        count += Math.floor(Math.random() * 5) + 1;
        if (count > 100) count = 100;
        counter.textContent = count + '%';
        
        if (count === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hide');
                document.body.classList.add('page-loaded');
                state.isLoading = false;
                initPostLoad();
            }, 500);
        }
    }, 50);
}

// Enhanced cursor with faster and smoother movement
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) return;

    // Set initial position to avoid jumps
    cursor.style.opacity = 0;
    cursorFollower.style.opacity = 0;
    
    // Use faster response values for smoother movement
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    function animate() {
        // Faster cursor movement (increased from 0.2 to 0.4)
        cursorX += (mouseX - cursorX) * 0.4;
        cursorY += (mouseY - cursorY) * 0.4;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

        // Slightly faster follower (increased from 0.1 to 0.15)
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;

        requestAnimationFrame(animate);
    }

    // Track mouse position with passive event for better performance
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show cursors after first movement
        if (cursor.style.opacity === '0') {
            setTimeout(() => {
                cursor.style.opacity = 1;
                cursorFollower.style.opacity = 1;
            }, 100);
        }
    }, { passive: true });

    // Start animation loop
    animate();

    // Enhanced hover effects with better performance
    const hoverElements = document.querySelectorAll(
        'a, button, .btn, .tool-item, .project-item, .horizontal-item, .magnetic'
    );

    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
            
            if (element.classList.contains('magnetic')) {
                initMagneticEffect(element);
            }
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
            
            if (element.classList.contains('magnetic')) {
                resetMagneticEffect(element);
            }
        });
        
        element.addEventListener('mousedown', () => {
            cursor.classList.add('click');
            cursorFollower.classList.add('click');
        });
        
        element.addEventListener('mouseup', () => {
            cursor.classList.remove('click');
            cursorFollower.classList.remove('click');
        });
    });
}

// Improved magnetic effect for buttons and logo
function initMagneticEffect(element) {
    const strength = 0.15; // Reduced strength for more subtle effect
    
    const onMouseMove = (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Add subtle rotation for 3D feel
        const rotateX = y * -0.05;
        const rotateY = x * 0.05;
        
        // Use transform3d for better performance with subtle movement
        element.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    
    element.addEventListener('mousemove', onMouseMove, { passive: true });
    
    // Store the event handler for proper removal
    element._magneticHandler = onMouseMove;
}

function resetMagneticEffect(element) {
    if (element._magneticHandler) {
        element.removeEventListener('mousemove', element._magneticHandler);
    }
    // Smooth transition back to original position
    element.style.transition = 'transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)';
    element.style.transform = '';
    
    // Remove transition after reset to make next hover smooth
    setTimeout(() => {
        element.style.transition = '';
    }, 500);
}

// Initialize magnetic elements
function initAllMagneticElements() {
    // Get all elements with magnetic class
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(element => {
        // Add event listeners
        element.addEventListener('mouseenter', () => {
            // Reset any existing transition
            element.style.transition = '';
            initMagneticEffect(element);
        });
        
        element.addEventListener('mouseleave', () => {
            resetMagneticEffect(element);
        });
        
        // Add glow effect
        const glowStrength = element.classList.contains('btn') ? '10px' : '5px';
        element.addEventListener('mouseenter', () => {
            element.style.boxShadow = `0 0 ${glowStrength} rgba(255, 255, 255, 0.5)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.boxShadow = '';
        });
    });
}

// Function to add hover effects to tool items
function initToolItemEffects() {
    const toolItems = document.querySelectorAll('.tool-item');
    
    if (!toolItems.length) return;
    
    toolItems.forEach(item => {
        // Add hover effect
        item.addEventListener('mouseenter', () => {
            const toolIcon = item.querySelector('.tool-icon');
            const toolInfo = item.querySelector('.tool-info');
            
            if (toolIcon) {
                toolIcon.style.transform = 'scale(1.1)';
                toolIcon.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }
            
            if (toolInfo) {
                toolInfo.style.transform = 'translateY(-5px)';
            }
            
            // Highlight the current page in the tools menu
            const link = item.querySelector('.tool-link');
            if (link && link.getAttribute('href') === window.location.pathname.split('/').pop()) {
                item.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            }
        });
        
        // Remove hover effect
        item.addEventListener('mouseleave', () => {
            const toolIcon = item.querySelector('.tool-icon');
            const toolInfo = item.querySelector('.tool-info');
            
            if (toolIcon) {
                toolIcon.style.transform = '';
                toolIcon.style.backgroundColor = '';
            }
            
            if (toolInfo) {
                toolInfo.style.transform = '';
            }
        });
        
        // Apply active state to current page
        const link = item.querySelector('.tool-link');
        if (link && link.getAttribute('href') === window.location.pathname.split('/').pop()) {
            item.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            item.style.borderLeft = '3px solid #D4AF37';
        }
    });
}

// Function to handle both navigation and tools menu with a single button
function initNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const navClose = document.querySelector('.nav-close');
    const menuOverlay = document.querySelector('.menu-overlay');
    const toolsMenu = document.querySelector('.tools-menu');
    const toolsMenuClose = document.querySelector('.tools-menu-close');
    
    if (!mobileMenuBtn || !nav) return;

    // Fix menu positioning
    nav.style.height = '100vh';
    if (toolsMenu) toolsMenu.style.height = '100vh';
    
    // Force remove blur effects from navigation
    nav.style.backdropFilter = 'none';
    nav.style.webkitBackdropFilter = 'none';
    if (toolsMenu) {
        toolsMenu.style.backdropFilter = 'none';
        toolsMenu.style.webkitBackdropFilter = 'none';
    }
    
    let menuState = 'closed'; // closed, nav, tools
    
    // Toggle menu with animation improvements
    function toggleMenu(state) {
        // Force remove blur effects from all elements
        document.querySelectorAll('.tools-menu, .menu-overlay, nav, header, footer').forEach(el => {
            if (el) {
                el.style.backdropFilter = 'none';
                el.style.webkitBackdropFilter = 'none';
            }
        });
        
        // Close everything first
        nav.classList.remove('active');
        if (toolsMenu) toolsMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileMenuBtn.classList.remove('active');
        
        if (menuOverlay) {
            menuOverlay.style.opacity = '0';
            setTimeout(() => {
                menuOverlay.style.display = 'none';
            }, 400);
        }
        
        menuState = 'closed';
        
        // Now open the requested menu if not closed
        if (state === 'nav') {
            // Handle showing navigation menu
            menuOverlay.style.display = 'block';
            menuOverlay.style.backdropFilter = 'none';
            menuOverlay.style.webkitBackdropFilter = 'none';
            
            // Use setTimeout to ensure CSS transitions work properly
            setTimeout(() => {
                nav.classList.add('active');
                document.body.classList.add('menu-open');
                mobileMenuBtn.classList.add('active');
                menuOverlay.style.opacity = '1';
                
                // Ensure we're not applying blur
                document.body.style.filter = 'none';
                document.documentElement.style.filter = 'none';
            }, 10);
            
            menuState = 'nav';
        } else if (state === 'tools' && toolsMenu) {
            // Handle showing tools menu
            menuOverlay.style.display = 'block';
            menuOverlay.style.backdropFilter = 'none';
            menuOverlay.style.webkitBackdropFilter = 'none';
            
            // Use setTimeout to ensure CSS transitions work properly
            setTimeout(() => {
                toolsMenu.classList.add('active');
                document.body.classList.add('menu-open');
                mobileMenuBtn.classList.add('active');
                menuOverlay.style.opacity = '1';
                
                // Ensure we're not applying blur
                document.body.style.filter = 'none';
                document.documentElement.style.filter = 'none';
                
                // Initialize tool item effects when menu is opened
                initToolItemEffects();
            }, 10);
            
            menuState = 'tools';
        }
    }

    // Mobile menu button events with improved handling
    mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle between closed and tools menu (since this is now the settings icon)
        if (menuState === 'closed') {
            toggleMenu('tools');
        } else {
            toggleMenu('closed');
        }
    });
    
    if (navClose) {
        navClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu('closed');
        });
    }
    
    if (toolsMenuClose) {
        toolsMenuClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu('closed');
        });
    }
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', () => toggleMenu('closed'));
    }
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggleMenu('closed');
        }
    });
    
    // Language switcher with improved handling
    const languageBtns = document.querySelectorAll('.language-btn-tools, .language-btn-nav');
    
    languageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const parent = btn.parentElement;
            const activeBtn = parent.querySelector('.active');
            if (activeBtn) activeBtn.classList.remove('active');
            btn.classList.add('active');
            
            // Store language preference
            const lang = btn.getAttribute('data-lang');
            if (lang) localStorage.setItem('preferredLanguage', lang);
        });
    });
    
    // Highlight the active section in the menu
    const currentPage = window.location.pathname.split('/').pop();
    const menuLinks = document.querySelectorAll('nav a');
    
    menuLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Keep this as a separate function for now but it won't be directly activated
// Instead, functionality is merged into initNavigation
function initToolsMenu() {
    console.log('Tools menu functionality merged into navigation menu');
}

// Scroll progress indicator
function initScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    
    if (!scrollProgress) return;

    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            scrollProgress.style.width = scrollPercent + '%';
            scrollProgress.classList.toggle('glow', scrollPercent > 0);
        });
    });
}

// Improved parallax background elements with better performance
function initParallaxBg() {
    const bgElements = document.querySelectorAll('.bg-element');
    
    if (bgElements.length === 0) return;

    // Use throttled event handling for better performance
    let ticking = false;
    let lastMouseX = 0, lastMouseY = 0;
    let lastScrollTop = 0;
    
    // Mouse movement parallax
    window.addEventListener('mousemove', (e) => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallaxPosition(lastMouseX, lastMouseY, lastScrollTop);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Scroll parallax
    window.addEventListener('scroll', () => {
        lastScrollTop = window.scrollY;
        
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallaxPosition(lastMouseX, lastMouseY, lastScrollTop);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    function updateParallaxPosition(mouseX, mouseY, scrollTop) {
        const mouseXRatio = mouseX / window.innerWidth;
        const mouseYRatio = mouseY / window.innerHeight;
        
        bgElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-speed') || '0.05');
            const scrollSpeed = parseFloat(element.getAttribute('data-scroll-speed') || '0.02');
            
            // Calculate mouse-based movement
            const x = (mouseXRatio - 0.5) * speed * 100;
            const y = (mouseYRatio - 0.5) * speed * 100;
            
            // Add scroll-based movement
            const scrollY = scrollTop * scrollSpeed;
            
            // Apply transform with hardware acceleration
            element.style.transform = `translate3d(${x}px, ${y + scrollY}px, 0)`;
        });
    }
    
    // Initial position
    updateParallaxPosition(window.innerWidth / 2, window.innerHeight / 2, window.scrollY);
}

// Reveal animations on scroll
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-element, .about-image, .section-title');
    
    if (revealElements.length === 0) return;
    
    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.8) {
                element.classList.add('visible');
                
                if (element.classList.contains('about-image')) {
                    element.classList.add('revealed');
                }
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
}

// Enhanced carousel with better performance
function initCarousel() {
    const carousel = document.querySelector('.carousel-container');
    const items = document.querySelectorAll('.carousel-item');
    if (!carousel || items.length === 0) return;

    let startX, currentX;
    let isDragging = false;
    const autoPlayInterval = 5000;
    let autoPlayTimer;

    // Fix carousel overflow
    carousel.parentElement.style.overflow = 'hidden';

    function showSlide(index) {
        items.forEach((item, i) => {
            // Use transform3d for hardware acceleration
            item.style.transform = `translate3d(${100 * (i - index)}%, 0, 0)`;
        });
        state.currentCarouselSlide = index;
        
        // Update active dot
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        state.currentCarouselSlide = (state.currentCarouselSlide + 1) % items.length;
        showSlide(state.currentCarouselSlide);
    }

    function prevSlide() {
        state.currentCarouselSlide = (state.currentCarouselSlide - 1 + items.length) % items.length;
        showSlide(state.currentCarouselSlide);
    }

    // Touch events with improved handling
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        clearInterval(autoPlayTimer);
        
        // Prevent default to avoid page scrolling during swipe
        e.preventDefault();
    }, { passive: false });

    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        
        items.forEach((item, index) => {
            const offset = (index - state.currentCarouselSlide) * 100 + (diff / carousel.offsetWidth) * 100;
            item.style.transform = `translate3d(${offset}%, 0, 0)`;
        });
        
        // Prevent default to avoid page scrolling during swipe
        e.preventDefault();
    }, { passive: false });

    carousel.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        const diff = currentX - startX;
        
        if (Math.abs(diff) > 50) {
            diff > 0 ? prevSlide() : nextSlide();
        } else {
            showSlide(state.currentCarouselSlide);
        }
        
        startAutoPlay();
    });

    function startAutoPlay() {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(nextSlide, autoPlayInterval);
    }

    // Add navigation dots if they don't exist
    if (!document.querySelector('.carousel-dots')) {
        // const dotsContainer = document.createElement('div');
        // dotsContainer.className = 'carousel-dots';
        items.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Slide ${index + 1}`);
            dot.addEventListener('click', () => {
                showSlide(index);
                startAutoPlay();
            });
            // dotsContainer.appendChild(dot);
        });
        // carousel.parentElement.appendChild(dotsContainer);
    }

    // Initial setup
    showSlide(0);
    startAutoPlay();
}

// Image hover effects
function initImageHoverEffects() {
    const imageHovers = document.querySelectorAll('.image-hover');
    
    if (imageHovers.length === 0) return;
    
    // General image hover effects that appear on scroll
    imageHovers.forEach(image => {
        const revealOnScroll = () => {
            const imageTop = image.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (imageTop < windowHeight * 0.8) {
                image.classList.add('visible');
            }
        };
        
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Initial check
        
        // Distortion effect on hover
        image.addEventListener('mouseenter', () => {
            image.classList.add('distort');
        });
        
        image.addEventListener('mouseleave', () => {
            image.classList.remove('distort');
        });
    });
}

// Function to ensure menu button visibility across browsers
function fixMenuButtonVisibility() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (!menuBtn) return;
    
    // Force visibility
    menuBtn.style.display = 'flex';
    menuBtn.style.visibility = 'visible';
    menuBtn.style.opacity = '1';
    
    // Safari-specific fixes
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
        console.log('Safari detected - applying specific fixes');
        menuBtn.style.position = 'relative';
        menuBtn.style.zIndex = '10001';
        
        const svg = menuBtn.querySelector('svg');
        if (svg) {
            svg.style.display = 'block';
            svg.style.visibility = 'visible';
            svg.style.opacity = '1';
            svg.style.stroke = '#fff';
            svg.style.strokeWidth = '2.5';
        }
    }
    
    // Small screen specific fixes
    const handleResize = () => {
        if (window.innerWidth <= 480) {
            menuBtn.style.width = '42px';
            menuBtn.style.height = '42px';
            menuBtn.style.zIndex = '10001';
        } else {
            menuBtn.style.width = '48px';
            menuBtn.style.height = '48px';
        }
    };
    
    // Call once and add listener
    handleResize();
    window.addEventListener('resize', handleResize);
}

// Add to DOM loaded init functions
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    if (typeof initLoader === 'function') initLoader();
    if (typeof initCursor === 'function') initCursor();
    if (typeof initScrollProgress === 'function') initScrollProgress();
    if (typeof initParallaxBg === 'function') initParallaxBg();
    if (typeof initNavigation === 'function') initNavigation();
    if (typeof initRevealAnimations === 'function') initRevealAnimations();
    if (typeof initCarousel === 'function') initCarousel();
    if (typeof initImageHoverEffects === 'function') initImageHoverEffects();
    if (typeof initScrollAnimations === 'function') initScrollAnimations();
    if (typeof initToolItemEffects === 'function') initToolItemEffects();
    
    // Initialize magnetic elements
    initAllMagneticElements();
    
    // Fix menu button visibility issues
    fixMenuButtonVisibility();
    
    // Remove all blur effects
    if (typeof removeAllBlurEffects === 'function') {
        removeAllBlurEffects();
        // Apply again after a small delay
        setTimeout(removeAllBlurEffects, 500);
    }
});

// DOM Utility Functions
const DOM = {
    // Get element by ID with null check
    getById: (id) => document.getElementById(id),
    
    // Create element with class and text
    createElement: (tag, className, text) => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text) element.textContent = text;
        return element;
    },
    
    // Toggle class on element
    toggleClass: (element, className, force) => {
        if (element) element.classList.toggle(className, force);
    },
    
    // Add event listener with proper cleanup
    addEvent: (element, event, handler) => {
        if (element) element.addEventListener(event, handler);
        return () => element && element.removeEventListener(event, handler);
    }
};

// UI Effects Module
const UIEffects = {
    // Show toast notification
    showToast: (message, type = 'info') => {
        // Remove existing toasts
        document.querySelectorAll('.toast').forEach(t => t.remove());
        
        const toast = DOM.createElement('div', `toast toast-${type}`);
        toast.textContent = message;
        document.body.appendChild(toast);

        // Animation sequence with cleanup
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }, 10);
    },
    
    // Highlight search results
    highlightText: (elements, query) => {
        if (!query) return false;
        
        let found = false;
        elements.forEach(element => {
            const text = element.textContent.toLowerCase();
            const hasMatch = text.includes(query.toLowerCase());
            DOM.toggleClass(element, 'search-highlight', hasMatch);
            if (hasMatch) found = true;
        });
        
        if (found) {
            const firstResult = document.querySelector('.search-highlight');
            firstResult?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return found;
    }
};

// Form Validation Module
const FormValidator = {
    // Email regex pattern
    emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    
    // Validate form field
    validateField: (field, rules) => {
        if (!field) return false;
        
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Apply validation rules
        if (rules.required && value === '') {
            isValid = false;
            errorMessage = `${rules.name || 'Field'} is required`;
        } else if (rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `${rules.name || 'Field'} must be at least ${rules.minLength} characters`;
        } else if (rules.email && !this.emailPattern.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        
        // Update UI based on validation result
        this.updateFieldStatus(field, isValid, errorMessage);
        return isValid;
    },
    
    // Update field status (error/success)
    updateFieldStatus: (field, isValid, message) => {
        // Remove existing error message
        const errorElement = field.nextElementSibling?.classList.contains('error-message') 
            ? field.nextElementSibling 
            : null;
            
        if (errorElement) errorElement.remove();
        
        // Toggle error class
        DOM.toggleClass(field, 'input-error', !isValid);
        
        // Add error message if invalid
        if (!isValid && message) {
            const errorMsg = DOM.createElement('div', 'error-message', message);
            field.parentNode.insertBefore(errorMsg, field.nextSibling);
        }
    },
    
    // Validate entire form
    validateForm: (formId, rules) => {
        const form = DOM.getById(formId);
        if (!form) return false;
        
        let isValid = true;
        
        // Validate each field with rules
        Object.entries(rules).forEach(([fieldId, fieldRules]) => {
            const field = DOM.getById(fieldId);
            if (field && !this.validateField(field, fieldRules)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
};

// Feature Modules
const Features = {
    // Search functionality
    initSearch: () => {
        const searchInput = DOM.getById('search-input');
        const searchButton = DOM.getById('search-button');
        
        if (!searchInput || !searchButton) return;
        
        const performSearch = () => {
            const query = searchInput.value.trim();
            if (!query) return;
            
            const searchableElements = document.querySelectorAll(
                'h1, h2, h3, p, .project-title, .horizontal-title'
            );
            
            const found = UIEffects.highlightText(searchableElements, query);
            
            UIEffects.showToast(
                found 
                    ? `Found "${query}" in ${document.querySelectorAll('.search-highlight').length} places` 
                    : 'No results found',
                found ? 'success' : 'error'
            );
        };
        
        // Event listeners
        DOM.addEvent(searchButton, 'click', performSearch);
        DOM.addEvent(searchInput, 'keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    },
    
    // Contact form
    initContactForm: () => {
        const form = DOM.getById('contact-form');
        if (!form) return;
        
        DOM.addEvent(form, 'submit', (e) => {
            e.preventDefault();
            
            const rules = {
                'name': { required: true, minLength: 2, name: 'Name' },
                'email': { required: true, email: true, name: 'Email' },
                'message': { required: true, minLength: 10, name: 'Message' }
            };
            
            if (FormValidator.validateForm('contact-form', rules)) {
                // Simulate form submission
                UIEffects.showToast(`Thank you, ${DOM.getById('name').value}! Your message has been sent.`, 'success');
                form.reset();
            }
        });
    },
    
    // Newsletter subscription
    initNewsletter: () => {
        const form = DOM.getById('newsletter-form');
        if (!form) return;
        
        DOM.addEvent(form, 'submit', (e) => {
            e.preventDefault();
            
            const emailField = DOM.getById('newsletter-email');
            
            if (FormValidator.validateField(emailField, { 
                required: true, 
                email: true,
                name: 'Email'
            })) {
                // Simulate subscription
                setTimeout(() => {
                    UIEffects.showToast(`Thank you for subscribing with ${emailField.value}!`, 'success');
                    form.reset();
                }, 1000);
            }
        });
    },
    
    // Theme toggle
    initThemeToggle: () => {
        const themeToggle = DOM.getById('dark-mode-toggle');
        if (!themeToggle) return;
        
        const applyTheme = (isDark) => {
            DOM.toggleClass(document.body, 'dark-mode', isDark);
            
            // Update meta theme color
            const metaTheme = document.querySelector('meta[name="theme-color"]');
            if (metaTheme) {
                metaTheme.setAttribute('content', isDark ? '#121212' : '#8E7F7F');
            }
            
            localStorage.setItem('darkMode', isDark);
        };
        
        // Toggle theme on click
        DOM.addEvent(themeToggle, 'click', () => {
            const isDarkMode = !document.body.classList.contains('dark-mode');
            applyTheme(isDarkMode);
        });
        
        // Apply saved theme preference
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        applyTheme(savedDarkMode);
    },
    
    // Lazy loading images
    initLazyLoading: () => {
        if (!('IntersectionObserver' in window)) return;
        
        const loadImage = (img) => {
            if (!img.dataset.src) return;
            
            img.src = img.dataset.src;
            img.onload = () => img.classList.add('loaded');
        };
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadImage(entry.target);
                    imageObserver.unobserve(entry.target);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
};

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Core initializations (existing functions)
    [
        'initLoader',
        'initScrollProgress',
        'initCursor',
        'initParallaxBg',
        'initNavigation',
        'initToolsMenu',
        'initCarousel',
        'initRevealAnimations',
        'initHorizontalScroll',
        'initStaggeredAnimations',
        'initImageHoverEffects',
        'initScrollAnimations'
    ].forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`Initializing: ${funcName}`);
            window[funcName]();
        }
    });
    
    // Initialize new features
    Features.initSearch();
    Features.initContactForm();
    Features.initNewsletter();
    Features.initThemeToggle();
    Features.initLazyLoading();
    
    console.log('All features initialized successfully');
});

document.addEventListener('DOMContentLoaded', function() {
    // Variables for horizontal scrolling
    const teamSection = document.querySelector('.team-section');
    const horizontalContent = document.querySelector('.team-section .horizontal-content');
    
    if (teamSection && horizontalContent) {
        let isScrolling = false;
        let startX, scrollLeft;
        const scrollSpeed = 0.5; // Adjust scroll speed
        let maxScroll = horizontalContent.scrollWidth - window.innerWidth;
        
        // Calculate maxScroll initially
        function calculateMaxScroll() {
            // Get the total width of all items including margins
            const totalWidth = Array.from(horizontalContent.children).reduce((width, item) => {
                const style = window.getComputedStyle(item);
                const marginRight = parseInt(style.marginRight);
                return width + item.offsetWidth + marginRight;
            }, 0);
            
            maxScroll = totalWidth - window.innerWidth + 100; // Add some padding
            console.log('Max scroll:', maxScroll);
        }
        
        calculateMaxScroll();
        
        // Smooth scrolling with wheel event
        teamSection.addEventListener('wheel', function(e) {
            if (window.innerWidth > 768) { // Only on desktop
                e.preventDefault();
                
                const scrollAmount = e.deltaY * scrollSpeed;
                const currentTransform = parseFloat(horizontalContent.style.transform?.replace('translateX(', '').replace('px)', '')) || 0;
                const newScrollLeft = currentTransform - scrollAmount;
                
                // Limit the scroll to the width of the content
                let transformValue = Math.min(0, Math.max(-maxScroll, newScrollLeft));
                
                // Apply the transform
                horizontalContent.style.transform = `translateX(${transformValue}px)`;
            }
        }, { passive: false });
        
        // Touch events for mobile
        teamSection.addEventListener('touchstart', function(e) {
            if (window.innerWidth > 768) {
                isScrolling = true;
                const currentTransform = parseFloat(horizontalContent.style.transform?.replace('translateX(', '').replace('px)', '')) || 0;
                startX = e.touches[0].pageX - currentTransform;
            }
        });
        
        teamSection.addEventListener('touchmove', function(e) {
            if (!isScrolling || window.innerWidth <= 768) return;
            
            e.preventDefault();
            const x = e.touches[0].pageX;
            const walk = (x - startX);
            
            // Limit the scroll
            let transformValue = Math.min(0, Math.max(-maxScroll, walk));
            
            // Apply the transform
            horizontalContent.style.transform = `translateX(${transformValue}px)`;
        }, { passive: false });
        
        teamSection.addEventListener('touchend', function() {
            isScrolling = false;
        });
        
        // Mouse drag events for desktop
        teamSection.addEventListener('mousedown', function(e) {
            if (window.innerWidth > 768) {
                isScrolling = true;
                const currentTransform = parseFloat(horizontalContent.style.transform?.replace('translateX(', '').replace('px)', '')) || 0;
                startX = e.pageX - currentTransform;
                teamSection.style.cursor = 'grabbing';
            }
        });
        
        teamSection.addEventListener('mousemove', function(e) {
            if (!isScrolling || window.innerWidth <= 768) return;
            
            e.preventDefault();
            const x = e.pageX;
            const walk = (x - startX);
            
            // Limit the scroll
            let transformValue = Math.min(0, Math.max(-maxScroll, walk));
            
            // Apply the transform
            horizontalContent.style.transform = `translateX(${transformValue}px)`;
        });
        
        teamSection.addEventListener('mouseup', function() {
            isScrolling = false;
            teamSection.style.cursor = 'default';
        });
        
        teamSection.addEventListener('mouseleave', function() {
            isScrolling = false;
            teamSection.style.cursor = 'default';
        });
        
        // Add scroll indicator if it doesn't exist
        let scrollIndicator = document.querySelector('.team-section .scroll-indicator');
        if (!scrollIndicator) {
            scrollIndicator = document.createElement('div');
            scrollIndicator.className = 'scroll-indicator';
            scrollIndicator.innerHTML = '<span>Scroll or Drag →</span>';
            teamSection.appendChild(scrollIndicator);
        }
        
        // Show scroll indicator for 3 seconds then fade out
        setTimeout(() => {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transition = 'opacity 0.5s ease';
        }, 3000);
        
        // Show again when hovering the section
        teamSection.addEventListener('mouseenter', () => {
            scrollIndicator.style.opacity = '1';
        });
        
        teamSection.addEventListener('mouseleave', () => {
            scrollIndicator.style.opacity = '0';
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            // Recalculate maxScroll
            calculateMaxScroll();
            
            // Reset transform on mobile
            if (window.innerWidth <= 768) {
                horizontalContent.style.transform = '';
            } else {
                // Ensure the content doesn't scroll beyond limits on desktop
                const currentTransform = parseFloat(horizontalContent.style.transform?.replace('translateX(', '').replace('px)', '')) || 0;
                if (currentTransform < -maxScroll) {
                    horizontalContent.style.transform = `translateX(${-maxScroll}px)`;
                }
            }
        });
    }
});

// Enhanced hover effects for team members
document.addEventListener('DOMContentLoaded', function() {
    // Team member hover effects
    const teamMembers = document.querySelectorAll('.team-section .horizontal-item');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            // Add 3D tilt effect
            member.addEventListener('mousemove', handleTilt);
        });
        
        member.addEventListener('mouseleave', function() {
            // Remove 3D tilt effect
            member.removeEventListener('mousemove', handleTilt);
            member.style.transform = 'translateY(-10px)';
            
            // Reset transition
            setTimeout(() => {
                member.style.transition = 'all 0.3s ease';
            }, 100);
        });
    });
    
    // Function to handle tilt effect
    function handleTilt(e) {
        const member = this;
        const memberRect = member.getBoundingClientRect();
        
        // Calculate mouse position relative to card
        const mouseX = e.clientX - memberRect.left;
        const mouseY = e.clientY - memberRect.top;
        
        // Calculate rotation (reduce intensity for subtle effect)
        const rotateY = ((mouseX / memberRect.width) - 0.5) * 5;
        const rotateX = ((mouseY / memberRect.height) - 0.5) * -5;
        
        // Temporarily disable transition for smooth tilt
        member.style.transition = 'transform 0.1s ease';
        
        // Apply transformations (maintain translateY effect)
        member.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
});

// Function to force remove all blur effects across the site
function removeAllBlurEffects() {
    // Set CSS variable to none
    document.documentElement.style.setProperty('--blur-effect', 'none', 'important');
    
    // Target all elements that might have backdrop-filter
    const elementsToFix = [
        'header', '.tools-menu', '.menu-overlay', 'nav', 'footer', 
        '.team-section .horizontal-item', '.nav-close',
        '.tool-icon', '.footer-text', '.team-section .scroll-indicator'
    ];
    
    // Apply to each selector
    elementsToFix.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el) {
                el.style.backdropFilter = 'none';
                el.style.webkitBackdropFilter = 'none';
            }
        });
    });
    
    // Special handling for body and html
    document.body.style.backdropFilter = 'none';
    document.body.style.webkitBackdropFilter = 'none';
    document.body.style.filter = 'none';
    document.documentElement.style.backdropFilter = 'none';
    document.documentElement.style.webkitBackdropFilter = 'none';
    document.documentElement.style.filter = 'none';
}

// Call this function on DOM load and after a short delay
document.addEventListener('DOMContentLoaded', () => {
    // Remove blur effects immediately
    removeAllBlurEffects();
    
    // Do it again after a short delay to catch dynamic elements
    setTimeout(removeAllBlurEffects, 500);
    
    // And once more after page is fully loaded
    window.addEventListener('load', removeAllBlurEffects);
});


