/**
 * Advanced modal image viewer with transitions and interactions
 */
class ModalImageViewer {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.modal = null;
    this.currentItems = [];
    this.currentIndex = 0;
    this.isAnimating = false;
    
    // Subscribe to events
    this.eventBus.on('modal:open', this.openModal.bind(this));
    this.eventBus.on('modal:close', this.closeModal.bind(this));
    this.eventBus.on('modal:update', this.updateModal.bind(this));
  }
  
  init() {
    this.createModal();
  }
  
  createModal() {
    // Create modal container
    this.modal = document.createElement('div');
    this.modal.className = 'cosmic-modal';
    
    // Create modal content
    this.modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-container">
        <button class="modal-close">
          <i class="fas fa-times"></i>
        </button>
        <div class="modal-content">
          <div class="modal-image-container">
            <img src="" alt="Modal Image" class="modal-image">
          </div>
          <div class="modal-info">
            <h2 class="modal-title"></h2>
            <p class="modal-category"></p>
            <div class="modal-description"></div>
            <div class="modal-actions">
              <button class="modal-action like-action">
                <i class="fas fa-heart"></i>
                <span>Add to Favorites</span>
              </button>
              <button class="modal-action share-action">
                <i class="fas fa-share-alt"></i>
                <span>Share</span>
              </button>
              <button class="modal-action download-action">
                <i class="fas fa-download"></i>
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
        <div class="modal-navigation">
          <button class="nav-button prev-button">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="modal-thumbnails"></div>
          <button class="nav-button next-button">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    `;
    
    // Append to body
    document.body.appendChild(this.modal);
    
    // Add event listeners
    this.addEventListeners();
  }
  
  addEventListeners() {
    // Close modal
    const closeButton = this.modal.querySelector('.modal-close');
    const overlay = this.modal.querySelector('.modal-overlay');
    
    closeButton.addEventListener('click', () => {
      this.closeModal();
    });
    
    overlay.addEventListener('click', () => {
      this.closeModal();
    });
    
    // Navigation
    const prevButton = this.modal.querySelector('.prev-button');
    const nextButton = this.modal.querySelector('.next-button');
    
    prevButton.addEventListener('click', () => {
      this.showPrevImage();
    });
    
    nextButton.addEventListener('click', () => {
      this.showNextImage();
    });
    
    // Actions
    const likeButton = this.modal.querySelector('.like-action');
    const shareButton = this.modal.querySelector('.share-action');
    const downloadButton = this.modal.querySelector('.download-action');
    
    likeButton.addEventListener('click', () => {
      this.toggleLike();
    });
    
    shareButton.addEventListener('click', () => {
      this.shareImage();
    });
    
    downloadButton.addEventListener('click', () => {
      this.downloadImage();
    });
    
    // Swipe navigation for touch devices
    this.setupSwipeNavigation();
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('active')) return;
      
      if (e.key === 'Escape') {
        this.closeModal();
      } else if (e.key === 'ArrowRight') {
        this.showNextImage();
      } else if (e.key === 'ArrowLeft') {
        this.showPrevImage();
      }
    });
  }
  
  setupSwipeNavigation() {
    const imageContainer = this.modal.querySelector('.modal-image-container');
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    imageContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    imageContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
  }
  
  handleSwipe(startX, endX) {
    const minSwipeDistance = 50;
    const swipeDistance = endX - startX;
    
    if (Math.abs(swipeDistance) < minSwipeDistance) return;
    
    if (swipeDistance > 0) {
      // Swiped right - show previous
      this.showPrevImage();
    } else {
      // Swiped left - show next
      this.showNextImage();
    }
  }
  
  openModal(data) {
    if (this.isAnimating) return;
    this.isAnimating = true;
    
    // Set current items and index
    this.currentItems = data.items;
    this.currentIndex = data.index;
    
    // Update modal content
    this.updateModalContent();
    
    // Show modal with animation
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Animate modal opening
    const container = this.modal.querySelector('.modal-container');
    
    gsap.fromTo(container, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
    );
    
    gsap.fromTo(this.modal.querySelector('.modal-overlay'), 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.3, onComplete: () => {
        this.isAnimating = false;
      }}
    );
    
    // Create thumbnails
    this.createThumbnails();
  }
  
  updateModalContent() {
    if (!this.currentItems.length) return;
    
    const currentItem = this.currentItems[this.currentIndex];
    const image = currentItem.querySelector('img');
    const title = currentItem.querySelector('.item-overlay h3') || { textContent: 'Gallery Image' };
    const category = currentItem.querySelector('.category-tag') || { textContent: 'Uncategorized' };
    
    // Update modal elements
    const modalImage = this.modal.querySelector('.modal-image');
    const modalTitle = this.modal.querySelector('.modal-title');
    const modalCategory = this.modal.querySelector('.modal-category');
    
    // Apply cross-fade animation to image
    const newImage = new Image();
    newImage.src = image.src;
    newImage.onload = () => {
      gsap.to(modalImage, { opacity: 0, duration: 0.2, onComplete: () => {
        modalImage.src = image.src;
        gsap.to(modalImage, { opacity: 1, duration: 0.3 });
      }});
    };
    
    // Update text content with animation
    gsap.to([modalTitle, modalCategory], { opacity: 0, y: 10, duration: 0.2, onComplete: () => {
      modalTitle.textContent = title.textContent;
      modalCategory.textContent = category.textContent;
      
      gsap.to([modalTitle, modalCategory], { 
        opacity: 1, 
        y: 0, 
        duration: 0.3,
        stagger: 0.1
      });
    }});
    
    // Update like button state
    const likeButton = this.modal.querySelector('.like-action');
    if (currentItem.classList.contains('favorited')) {
      likeButton.classList.add('active');
    } else {
      likeButton.classList.remove('active');
    }
    
    // Update download button
    const downloadButton = this.modal.querySelector('.download-action');
    downloadButton.dataset.src = image.src;
    
    // Highlight current thumbnail
    this.updateThumbnailHighlight();
  }
  
  createThumbnails() {
    const thumbnailContainer = this.modal.querySelector('.modal-thumbnails');
    thumbnailContainer.innerHTML = '';
    
    // Create thumbnails (max 5 visible)
    const totalItems = this.currentItems.length;
    const startIndex = Math.max(0, Math.min(
      this.currentIndex - 2, 
      totalItems - 5
    ));
    
    const endIndex = Math.min(startIndex + 5, totalItems);
    
    for (let i = startIndex; i < endIndex; i++) {
      const item = this.currentItems[i];
      const image = item.querySelector('img');
      
      const thumbnail = document.createElement('div');
      thumbnail.className = 'modal-thumbnail';
      thumbnail.dataset.index = i;
      thumbnail.innerHTML = `<img src="${image.src}" alt="Thumbnail">`;
      
      if (i === this.currentIndex) {
        thumbnail.classList.add('active');
      }
      
      thumbnail.addEventListener('click', () => {
        this.goToImage(i);
      });
      
      thumbnailContainer.appendChild(thumbnail);
    }
    
    // Add indicators if there are more images
    if (startIndex > 0) {
      const moreIndicator = document.createElement('div');
      moreIndicator.className = 'more-indicator left';
      moreIndicator.textContent = '...';
      thumbnailContainer.prepend(moreIndicator);
    }
    
    if (endIndex < totalItems) {
      const moreIndicator = document.createElement('div');
      moreIndicator.className = 'more-indicator right';
      moreIndicator.textContent = '...';
      thumbnailContainer.appendChild(moreIndicator);
    }
  }
  
  updateThumbnailHighlight() {
    const thumbnails = this.modal.querySelectorAll('.modal-thumbnail');
    thumbnails.forEach(thumb => {
      const index = parseInt(thumb.dataset.index);
      if (index === this.currentIndex) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });
  }
  
  showNextImage() {
    if (this.isAnimating || !this.currentItems.length) return;
    
    this.currentIndex = (this.currentIndex + 1) % this.currentItems.length;
    this.updateModalContent();
    
    // Animation for next transition
    const imageContainer = this.modal.querySelector('.modal-image-container');
    gsap.fromTo(imageContainer, 
      { x: 30, opacity: 0.7 }, 
      { x: 0, opacity: 1, duration: 0.3 }
    );
  }
  
  showPrevImage() {
    if (this.isAnimating || !this.currentItems.length) return;
    
    this.currentIndex = (this.currentIndex - 1 + this.currentItems.length) % this.currentItems.length;
    this.updateModalContent();
    
    // Animation for prev transition
    const imageContainer = this.modal.querySelector('.modal-image-container');
    gsap.fromTo(imageContainer, 
      { x: -30, opacity: 0.7 }, 
      { x: 0, opacity: 1, duration: 0.3 }
    );
  }
  
  goToImage(index) {
    if (this.isAnimating || !this.currentItems.length) return;
    
    const direction = index > this.currentIndex ? 1 : -1;
    this.currentIndex = index;
    this.updateModalContent();
    
    // Animation based on direction
    const imageContainer = this.modal.querySelector('.modal-image-container');
    gsap.fromTo(imageContainer, 
      { x: 20 * direction, opacity: 0.7 }, 
      { x: 0, opacity: 1, duration: 0.3 }
    );
  }
  
  closeModal() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    
    // Animate modal closing
    const container = this.modal.querySelector('.modal-container');
    
    gsap.to(container, {
      y: 50,
      opacity: 0,
      duration: 0.3
    });
    
    gsap.to(this.modal.querySelector('.modal-overlay'), {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.isAnimating = false;
      }
    });
  }
  
  toggleLike() {
    if (!this.currentItems.length) return;
    
    const currentItem = this.currentItems[this.currentIndex];
    const likeButton = this.modal.querySelector('.like-action');
    
    likeButton.classList.toggle('active');
    currentItem.classList.toggle('favorited');
    
    // Animate heart
    gsap.fromTo(likeButton, 
      { scale: 1 }, 
      { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 }
    );
    
    // Update gallery item like button
    const galleryLikeButton = currentItem.querySelector('.like-button');
    if (likeButton.classList.contains('active')) {
      galleryLikeButton.classList.add('active');
      
      // Add to favorites in app state
      this.eventBus.emit('favorite:add', {
        src: currentItem.querySelector('img').src,
        category: currentItem.dataset.category
      });
    } else {
      galleryLikeButton.classList.remove('active');
      
      // Remove from favorites in app state
      this.eventBus.emit('favorite:remove', {
        src: currentItem.querySelector('img').src
      });
    }
  }
  
  shareImage() {
    if (!this.currentItems.length) return;
    
    const currentItem = this.currentItems[this.currentIndex];
    const image = currentItem.querySelector('img');
    
    // Check if Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: 'Check out this image!',
        text: 'I found this amazing image in the Cosmic Gallery',
        url: window.location.href
      })
      .catch(console.error);
    } else {
      // Fallback - copy URL to clipboard
      const dummy = document.createElement('input');
      document.body.appendChild(dummy);
      dummy.value = window.location.href;
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
      
      // Show notification
      this.eventBus.emit('notification:show', {
        message: 'URL copied to clipboard',
        type: 'success',
        duration: 2000
      });
    }
    
    // Animate share button
    const shareButton = this.modal.querySelector('.share-action');
    gsap.fromTo(shareButton, 
      { y: 0 }, 
      { y: -5, duration: 0.1, yoyo: true, repeat: 1 }
    );
  }
  
  downloadImage() {
    if (!this.currentItems.length) return;
    
    const currentItem = this.currentItems[this.currentIndex];
    const image = currentItem.querySelector('img');
    const downloadButton = this.modal.querySelector('.download-action');
    
    // Create a temporary link
    const link = document.createElement('a');
    link.href = image.src;
    link.download = image.src.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Animate download button
    gsap.fromTo(downloadButton, 
      { y: 0 }, 
      { y: 5, duration: 0.1, yoyo: true, repeat: 1 }
    );
  }
  
  updateModal(data) {
    this.currentItems = data.items;
    this.currentIndex = data.index;
    this.updateModalContent();
  }
} 