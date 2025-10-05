/**
 * Enhance gallery blocks with futuristic effects
 */
(function() {
  document.addEventListener('DOMContentLoaded', initFuturisticBlocks);
  
  function initFuturisticBlocks() {
    // Find all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Add scan lines to each item
    galleryItems.forEach(item => {
      // Create and add scan line
      const scanLine = document.createElement('div');
      scanLine.className = 'scan-line';
      item.appendChild(scanLine);
      
      // Add click handler
      item.addEventListener('click', function(e) {
        // Only apply click effect if clicking directly on the item (not on buttons)
        if (e.target === item || e.target === item.querySelector('img') || e.target === scanLine) {
          // Add clicked class
          item.classList.add('clicked');
          
          // Remove class after animation completes
          setTimeout(() => {
            item.classList.remove('clicked');
          }, 400);
          
          // Get image data
          const img = item.querySelector('img');
          if (img) {
            const imgSrc = img.src;
            const imgAlt = img.alt || 'Gallery Image';
            
            // Show notification with image
            showImageNotification(imgSrc, imgAlt);
          }
        }
      });
    });
  }
  
  function showImageNotification(imgSrc, imgTitle) {
    // Check if notification system is available
    if (typeof showNotification === 'function') {
      showNotification({
        image: imgSrc,
        title: imgTitle,
        text: 'Image selected from gallery',
        actions: [
          { icon: 'heart', text: 'Like', onClick: () => toggleFavorite(imgSrc) },
          { icon: 'download', text: 'Save', onClick: () => downloadImage(imgSrc) },
          { icon: 'share', text: 'Share', onClick: () => shareImage(imgSrc) }
        ],
        duration: 5000 // Auto-dismiss after 5 seconds
      });
    } else {
      // Fallback: create a minimal notification system
      console.log('Notification system not found, loading minimal version');
      loadNotificationSystem().then(() => {
        showImageNotification(imgSrc, imgTitle);
      });
    }
  }
  
  function loadNotificationSystem() {
    return new Promise((resolve) => {
      // Create notification container if it doesn't exist
      if (!document.querySelector('.cosmic-notification-container')) {
        const container = document.createElement('div');
        container.className = 'cosmic-notification-container';
        document.body.appendChild(container);
      }
      
      // Define showNotification function globally
      window.showNotification = function(options) {
        const container = document.querySelector('.cosmic-notification-container');
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cosmic-notification';
        
        // Create notification content
        notification.innerHTML = `
          <div class="notification-header"></div>
          <div class="notification-content">
            ${options.image ? `<img src="${options.image}" alt="${options.title}" class="notification-image">` : ''}
            <div class="notification-info">
              <h4 class="notification-title">${options.title || 'Notification'}</h4>
              <p class="notification-text">${options.text || ''}</p>
            </div>
            <button class="notification-close">×</button>
          </div>
          ${options.actions ? `
            <div class="notification-actions">
              ${options.actions.map((action, index) => `
                <button class="notification-button" data-action="${index}">
                  ${action.icon ? `<i class="fas fa-${action.icon}"></i>` : ''}
                  ${action.text}
                </button>
              `).join('')}
            </div>
          ` : ''}
          ${options.duration ? `<div class="notification-progress"></div>` : ''}
        `;
        
        // Add to container
        container.appendChild(notification);
        
        // Set up close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
          hideNotification(notification);
        });
        
        // Set up action buttons
        if (options.actions) {
          const actionButtons = notification.querySelectorAll('.notification-button');
          actionButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
              if (options.actions[index].onClick) {
                options.actions[index].onClick();
              }
              hideNotification(notification);
            });
          });
        }
        
        // Show notification
        setTimeout(() => {
          notification.classList.add('show');
        }, 10);
        
        // Auto-dismiss
        if (options.duration) {
          const progress = notification.querySelector('.notification-progress');
          
          // Animate progress bar
          progress.style.animation = `shrinkWidth ${options.duration}ms linear forwards`;
          progress.style.transformOrigin = 'right';
          progress.style.transform = 'scaleX(1)';
          
          setTimeout(() => {
            progress.style.transform = 'scaleX(0)';
          }, 10);
          
          // Set timeout to remove notification
          setTimeout(() => {
            hideNotification(notification);
          }, options.duration);
        }
      };
      
      // Define helper function to hide notification
      window.hideNotification = function(notification) {
        notification.classList.remove('show');
        
        // Remove from DOM after animation
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 400);
      };
      
      // Define action handlers
      window.toggleFavorite = function(imageSrc) {
        console.log('Added to favorites:', imageSrc);
        // Implement actual favorite logic here
      };
      
      window.downloadImage = function(imageSrc) {
        console.log('Downloading:', imageSrc);
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = imageSrc.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      
      window.shareImage = function(imageSrc) {
        console.log('Sharing:', imageSrc);
        // Implement actual share logic here
        if (navigator.share) {
          navigator.share({
            title: 'Check out this image',
            text: 'I found this amazing image in the Cosmic Gallery',
            url: imageSrc
          }).catch(err => {
            console.error('Could not share image:', err);
          });
        } else {
          // Fallback
          prompt('Copy this link to share the image:', imageSrc);
        }
      };
      
      // Add keyframes for progress bar animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes shrinkWidth {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `;
      document.head.appendChild(style);
      
      resolve();
    });
  }
})(); 