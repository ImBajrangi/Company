/**
 * Main application controller
 * Handles component initialization and application state
 */
class CosmicApp {
  constructor() {
    this.components = {};
    this.state = {
      theme: localStorage.getItem('theme') || 'cosmic',
      filterCategory: 'all',
      currentView: 'grid',
      isLoading: true,
      galleryItems: [],
      favorites: JSON.parse(localStorage.getItem('favorites')) || []
    };
    
    // Initialize event bus for component communication
    this.eventBus = new EventBus();
  }
  
  async init() {
    // Register all components
    this.registerComponents();
    
    // Initialize core services
    await this.initServices();
    
    // Initialize UI components
    this.initUI();
    
    // Set loading state to false when everything is ready
    setTimeout(() => {
      this.setState({isLoading: false});
      this.eventBus.emit('app:loaded');
    }, 2500);
    
    // Enable keyboard navigation
    this.enableKeyboardNavigation();
    
    // Initialize scroll-based animations
    this.initScrollAnimations();
  }
  
  registerComponents() {
    // Core components
    this.components.cursor = new CustomCursor();
    this.components.cosmicBg = new CosmicBackground();
    this.components.loader = new EnhancedLoader();
    
    // UI components
    this.components.menu = new CosmicMenu(this.eventBus);
    this.components.gallery = new GalleryController(this.eventBus);
    this.components.footer = new CosmicFooter();
    this.components.themeToggler = new ThemeToggler(this.eventBus);
    this.components.filterControls = new FilterControls(this.eventBus);
    this.components.modalViewer = new ModalImageViewer(this.eventBus);
    
    // Optional components
    this.components.audioController = new AudioController();
    this.components.notifications = new NotificationSystem();
  }
  
  async initServices() {
    // Initialize image service and pre-load images
    this.services = {
      imageService: new ImageService(),
      animationService: new AnimationService()
    };
    
    // Fetch gallery items
    const items = await this.services.imageService.getGalleryItems();
    this.setState({galleryItems: items});
  }
  
  initUI() {
    // Initialize all UI components
    Object.values(this.components).forEach(component => {
      if (typeof component.init === 'function') {
        component.init();
      }
    });
  }
  
  setState(newState) {
    // Update application state
    this.state = {...this.state, ...newState};
    
    // Notify components about state change
    this.eventBus.emit('state:changed', this.state);
  }
  
  enableKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // ESC key closes modal
      if (e.key === 'Escape') {
        this.eventBus.emit('modal:close');
      }
      
      // Arrow keys for navigation in modal
      if (e.key === 'ArrowRight') {
        this.eventBus.emit('gallery:next');
      }
      
      if (e.key === 'ArrowLeft') {
        this.eventBus.emit('gallery:prev');
      }
    });
  }
  
  initScrollAnimations() {
    // Initialize GSAP ScrollTrigger for scroll-based animations
    this.services.animationService.initScrollAnimations();
  }
}

// Create event bus for component communication
class EventBus {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.cosmicApp = new CosmicApp();
  window.cosmicApp.init();
}); 