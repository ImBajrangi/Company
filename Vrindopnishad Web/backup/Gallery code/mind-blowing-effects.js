// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize tilt effect for gallery items
  const tiltCards = document.querySelectorAll('.tilt-card');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      
      const mouseX = e.clientX - cardCenterX;
      const mouseY = e.clientY - cardCenterY;
      
      const rotateY = (mouseX / cardRect.width) * 10; // Max rotation of 10deg
      const rotateX = -((mouseY / cardRect.height) * 10); // Invert Y-axis rotation
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', function() {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });
  
  // Filter functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.uniform-block');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      
      const filterValue = this.getAttribute('data-filter');
      
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        // Show all items if filter is "all"
        if (filterValue === 'all' || filterValue === itemCategory) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 100);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 400);
        }
      });
      
      // Show notification
      showNotification(`Showing ${filterValue === 'all' ? 'all' : filterValue} images`);
    });
  });
  
  // Search functionality
  const searchInput = document.getElementById('gallery-search');
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchValue = this.value.toLowerCase().trim();
      
      galleryItems.forEach(item => {
        const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
        const description = item.querySelector('p')?.textContent.toLowerCase() || '';
        const category = item.getAttribute('data-category')?.toLowerCase() || '';
        
        if (title.includes(searchValue) || description.includes(searchValue) || category.includes(searchValue) || searchValue === '') {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 100);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 400);
        }
      });
    });
  }
  
  // Notification system
  window.showNotification = function(message, type = 'info', duration = 3000) {
    const notification = document.getElementById('notification');
    const notificationContent = notification.querySelector('h3');
    
    notificationContent.textContent = message;
    
    // Remove previous animations
    notification.classList.remove('notification-slide-in', 'notification-slide-out');
    
    // Set icon based on type
    const notificationIcon = notification.querySelector('.notification-icon svg');
    
    switch(type) {
      case 'success':
        notificationIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />';
        notification.style.borderColor = 'rgb(34, 197, 94)';
        notification.querySelector('.notification-icon').style.backgroundColor = 'rgb(34, 197, 94)';
        break;
      case 'error':
        notificationIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
        notification.style.borderColor = 'rgb(239, 68, 68)';
        notification.querySelector('.notification-icon').style.backgroundColor = 'rgb(239, 68, 68)';
        break;
      default:
        notificationIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />';
        notification.style.borderColor = 'rgb(139, 92, 246)';
        notification.querySelector('.notification-icon').style.backgroundColor = 'rgb(139, 92, 246)';
    }
    
    // Show notification
    notification.classList.add('notification-slide-in');
    
    // Hide notification after duration
    setTimeout(() => {
      notification.classList.remove('notification-slide-in');
      notification.classList.add('notification-slide-out');
    }, duration);
    
    // Close button functionality
    const closeButton = notification.querySelector('button');
    closeButton.addEventListener('click', function() {
      notification.classList.remove('notification-slide-in');
      notification.classList.add('notification-slide-out');
    });
  };
  
  // Show welcome notification on page load with a delay
  setTimeout(() => {
    showNotification('Welcome to Divine Gallery!', 'success', 5000);
  }, 1500);
  
  // Add data-category attributes to gallery items
  // This would typically be added in the HTML, but we're adding it here for demo purposes
  const categoryOptions = ['radhekrishna', 'krishna', 'radha', 'spiritual'];
  
  galleryItems.forEach((item, index) => {
    if (!item.hasAttribute('data-category')) {
      // Assign categories in a repeating pattern
      const category = categoryOptions[index % categoryOptions.length];
      item.setAttribute('data-category', category);
    }
  });
  
  // Parallax effect on scroll
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    // Parallax for stars
    const starsContainer = document.querySelector('.stars-container');
    if (starsContainer) {
      starsContainer.style.transform = `translateY(${scrollPosition * 0.1}px)`;
    }
    
    // Parallax for floating Krishna
    const floatingKrishna = document.querySelector('.animate-float');
    if (floatingKrishna) {
      floatingKrishna.style.transform = `translateY(${-20 + scrollPosition * 0.05}px)`;
    }
  });
}); 