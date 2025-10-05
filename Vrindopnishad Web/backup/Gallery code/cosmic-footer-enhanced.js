/**
 * Enhanced Cosmic Footer Implementation - Refined Version
 * Creates an interactive and futuristic footer with precise alignment
 */
(function() {
  // Run immediately and also on DOMContentLoaded to ensure it works in all cases
  initFooter();
  document.addEventListener('DOMContentLoaded', initFooter);
  
  // Also try after a slight delay to ensure all other scripts have run
  setTimeout(initFooter, 1000);
  
  function initFooter() {
    console.log("Initializing cosmic footer...");
    
    // Check if footer already exists to avoid duplicates
    if (document.querySelector('.cosmic-footer')) {
      console.log("Footer already exists, not creating duplicate");
      return;
    }
    
    // Create and inject the footer HTML
    createFooter();
    
    // Initialize footer background particles
    createFooterParticles();
    
    // Initialize form functionality
    initNewsletterForm();
    
    console.log("Footer initialization complete");
  }
  
  function createFooter() {
    // Get the year for copyright
    const currentYear = new Date().getFullYear();
    
    // Create footer HTML with improved alignment and structure
    const footerHTML = `
      <footer class="cosmic-footer">
        <div class="footer-accent-line"></div>
        <div class="footer-container">
          <div class="footer-section footer-about">
            <img src="./image/icon_main_02.png" alt="Cosmic Gallery Logo" class="footer-logo">
            <h3 class="footer-title">About Cosmic Gallery</h3>
            <p>Experience the divine through our immersive gallery featuring radiant artworks of Radhe Krishna and other cosmic illustrations. Explore the magic of cosmic art in our meticulously curated collections.</p>
            <div class="social-icons">
              <a href="#" class="social-icon" aria-label="Instagram">
                <i class="fab fa-instagram"></i>
              </a>
              <a href="#" class="social-icon" aria-label="Twitter">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="#" class="social-icon" aria-label="Facebook">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#" class="social-icon" aria-label="Pinterest">
                <i class="fab fa-pinterest-p"></i>
              </a>
            </div>
          </div>
          
          <div class="footer-section">
            <h3 class="footer-title">Quick Links</h3>
            <div class="footer-links">
              <a href="#" class="footer-link"><i class="fas fa-chevron-right"></i> Home</a>
              <a href="#" class="footer-link"><i class="fas fa-chevron-right"></i> Gallery</a>
              <a href="#" class="footer-link"><i class="fas fa-chevron-right"></i> Collections</a>
              <a href="#" class="footer-link"><i class="fas fa-chevron-right"></i> Artists</a>
              <a href="#" class="footer-link"><i class="fas fa-chevron-right"></i> About Us</a>
            </div>
          </div>
          
          <div class="footer-section">
            <h3 class="footer-title">Contact Info</h3>
            <div class="footer-links">
              <a href="mailto:info@cosmicgallery.com" class="footer-link">
                <i class="fas fa-envelope"></i> info@cosmicgallery.com
              </a>
              <a href="tel:+919876543210" class="footer-link">
                <i class="fas fa-phone-alt"></i> +91 9876 543 210
              </a>
              <a href="#" class="footer-link">
                <i class="fas fa-map-marker-alt"></i> Krishna Nagar, Mathura, UP 281004, India
              </a>
            </div>
          </div>
          
          <div class="footer-section">
            <h3 class="footer-title">Newsletter</h3>
            <p>Subscribe to our newsletter for updates on new artworks and exclusive events.</p>
            <form class="newsletter-form" id="newsletter-form">
              <input type="email" class="newsletter-input" placeholder="Your Email Address" required>
              <button type="submit" class="newsletter-button">Subscribe</button>
            </form>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; ${currentYear} Cosmic Gallery. All Rights Reserved. Crafted with <i class="fas fa-heart" style="color:#ff6b6b;"></i> by <a href="#">Radhe-Shyam</a></p>
        </div>
      </footer>
    `;
    
    // Insert the footer before the closing body tag
    document.body.insertAdjacentHTML('beforeend', footerHTML);
    
    // Check if Font Awesome is loaded, if not, add it
    if (!document.querySelector('link[href*="fontawesome"]')) {
      const fontAwesome = document.createElement('link');
      fontAwesome.rel = 'stylesheet';
      fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
      document.head.appendChild(fontAwesome);
    }
    
    console.log("Footer HTML created and inserted");
  }
  
  function createFooterParticles() {
    const footer = document.querySelector('.cosmic-footer');
    if (!footer) {
      console.log("Footer not found for particles");
      return;
    }
    
    // Create particle background
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'footer-particle';
      
      // Random position
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      // Random size
      const size = Math.random() * 3 + 1;
      
      // Apply styles
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Animate with keyframes
      const duration = Math.random() * 30 + 10;
      particle.style.animation = `floatParticle ${duration}s linear infinite`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      // Add to footer
      footer.appendChild(particle);
    }
  }
  
  function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) {
      console.log("Newsletter form not found");
      return;
    }
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      if (email) {
        // Show success message
        showSubscriptionMessage(true);
        
        // Clear the input
        emailInput.value = '';
        
        // Here you would normally send the data to your server
        console.log('Subscribed email:', email);
      } else {
        // Show error message
        showSubscriptionMessage(false);
      }
    });
  }
  
  function showSubscriptionMessage(success) {
    // Create notification if notification system exists
    if (typeof showNotification === 'function') {
      if (success) {
        showNotification({
          title: 'Subscription Successful',
          text: 'Thank you for subscribing to our newsletter!',
          image: './image/icon_main_02.png',
          duration: 5000
        });
      } else {
        showNotification({
          title: 'Subscription Failed',
          text: 'Please enter a valid email address.',
          image: './image/icon_main_02.png',
          duration: 5000
        });
      }
    } else {
      // Fallback to alert
      if (success) {
        alert('Thank you for subscribing to our newsletter!');
      } else {
        alert('Please enter a valid email address.');
      }
    }
  }
  
  // Add keyframes for floating particles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatParticle {
      0%, 100% { 
        transform: translate(0, 0); 
        opacity: 0.3; 
      }
      25% { 
        transform: translate(30px, -30px); 
        opacity: 0.7; 
      }
      50% { 
        transform: translate(0, -50px); 
        opacity: 0.3; 
      }
      75% { 
        transform: translate(-30px, -20px); 
        opacity: 0.6; 
      }
    }
  `;
  document.head.appendChild(style);
})(); 