document.addEventListener('DOMContentLoaded', () => {
  // Enhanced Menu Icons
  function enhanceMenuIcons() {
    const menuItems = document.querySelectorAll('.menu-items li');
    
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

  // Enhanced Magnetic Effect
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

  // Search Bar Functionality
  const searchIcon = document.getElementById('searchIcon');
  const searchBar = document.getElementById('searchBar');

  searchIcon.addEventListener('click', (e) => {
    e.preventDefault();
    searchBar.style.display = searchBar.style.display === 'block' ? 'none' : 'block';
    if (searchBar.style.display === 'block') {
      searchBar.querySelector('input').focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchBar.contains(e.target) && !searchIcon.contains(e.target)) {
      searchBar.style.display = 'none';
    }
  });

  // Initialize menu effects
  enhanceMenuIcons();
  initMagneticEffect();
});
