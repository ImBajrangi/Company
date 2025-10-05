/**
 * Advanced custom cursor with interactive animations
 */
class CustomCursor {
  constructor() {
    this.cursor = null;
    this.cursorDot = null;
    this.cursorCircle = null;
    this.isVisible = true;
    this.lastX = 0;
    this.lastY = 0;
    this.speed = 0;
    this.direction = {x: 0, y: 0};
    this.targetElements = [
      { selector: 'a, button, .clickable', class: 'cursor-hover' },
      { selector: '.image-container img', class: 'cursor-view' },
      { selector: '.cosmic-button', class: 'cursor-link' }
    ];
  }
  
  init() {
    this.createCursor();
    this.initEventListeners();
    
    // Hide default cursor
    document.body.style.cursor = 'none';
  }
  
  createCursor() {
    // Create container
    this.cursor = document.createElement('div');
    this.cursor.className = 'cosmic-cursor-container';
    
    // Create dot (follows cursor exactly)
    this.cursorDot = document.createElement('div');
    this.cursorDot.className = 'cosmic-cursor-dot';
    
    // Create outer circle (follows with delay)
    this.cursorCircle = document.createElement('div');
    this.cursorCircle.className = 'cosmic-cursor-circle';
    
    // Append to DOM
    this.cursor.appendChild(this.cursorDot);
    this.cursor.appendChild(this.cursorCircle);
    document.body.appendChild(this.cursor);
  }
  
  initEventListeners() {
    // Track mouse movement
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    
    // Handle mouse enter/leave document
    document.addEventListener('mouseenter', () => {
      this.show();
    });
    
    document.addEventListener('mouseleave', () => {
      this.hide();
    });
    
    // Add interactive behavior for clickable elements
    this.targetElements.forEach(({selector, class: className}) => {
      document.querySelectorAll(selector).forEach(element => {
        element.addEventListener('mouseenter', () => {
          this.addState(className);
        });
        
        element.addEventListener('mouseleave', () => {
          this.removeState(className);
        });
      });
    });
    
    // Add click animation
    document.addEventListener('mousedown', () => {
      this.addState('cursor-click');
    });
    
    document.addEventListener('mouseup', () => {
      this.removeState('cursor-click');
    });
    
    // Update cursor state when elements are added dynamically
    const observer = new MutationObserver(this.updateTargetElements.bind(this));
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  onMouseMove(e) {
    if (!this.isVisible) return;
    
    // Calculate cursor speed and direction for dynamic effects
    const newX = e.clientX;
    const newY = e.clientY;
    
    this.speed = Math.sqrt(
      Math.pow(newX - this.lastX, 2) + 
      Math.pow(newY - this.lastY, 2)
    );
    
    this.direction = {
      x: newX - this.lastX,
      y: newY - this.lastY
    };
    
    // Update dot position immediately
    this.cursorDot.style.left = `${newX}px`;
    this.cursorDot.style.top = `${newY}px`;
    
    // Update circle position with smooth animation
    gsap.to(this.cursorCircle, {
      left: newX,
      top: newY,
      duration: 0.15,
      ease: "power2.out"
    });
    
    // Apply speed-based scaling
    const scale = Math.min(1 + (this.speed * 0.005), 1.5);
    if (this.speed > 5) {
      gsap.to(this.cursorCircle, {
        scale: scale,
        opacity: 1 - (scale - 1) / 2,
        duration: 0.2
      });
    } else {
      gsap.to(this.cursorCircle, {
        scale: 1,
        opacity: 1,
        duration: 0.3
      });
    }
    
    this.lastX = newX;
    this.lastY = newY;
  }
  
  show() {
    this.isVisible = true;
    this.cursor.style.opacity = 1;
  }
  
  hide() {
    this.isVisible = false;
    this.cursor.style.opacity = 0;
  }
  
  addState(state) {
    this.cursor.classList.add(state);
  }
  
  removeState(state) {
    this.cursor.classList.remove(state);
  }
  
  updateTargetElements() {
    this.targetElements.forEach(({selector, class: className}) => {
      document.querySelectorAll(selector).forEach(element => {
        if (!element.hasCustomCursorListener) {
          element.addEventListener('mouseenter', () => {
            this.addState(className);
          });
          
          element.addEventListener('mouseleave', () => {
            this.removeState(className);
          });
          
          element.hasCustomCursorListener = true;
        }
      });
    });
  }
} 