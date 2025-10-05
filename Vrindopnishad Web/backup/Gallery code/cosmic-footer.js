// Create modern cosmic footer and enhanced loader
document.addEventListener('DOMContentLoaded', () => {
  // Create and insert the footer
  createCosmicFooter();
  
  // Enhance the loader with progress animation
  enhanceCosmicLoader();
});

function createCosmicFooter() {
  // Remove existing footer if present
  const existingFooter = document.querySelector('footer');
  if (existingFooter) {
    existingFooter.remove();
  }
  
  // Create the footer element
  const footer = document.createElement('footer');
  footer.className = 'cosmic-footer';
  
  // Add the glow effect
  const footerGlow = document.createElement('div');
  footerGlow.className = 'footer-glow';
  footer.appendChild(footerGlow);
  
  // Create footer content
  const footerContent = document.createElement('div');
  footerContent.className = 'footer-content';
  
  // Column 1 - About
  const column1 = document.createElement('div');
  column1.className = 'footer-column';
  
  const logoArea = document.createElement('div');
  logoArea.className = 'footer-logo';
  logoArea.innerHTML = `
    <h3>Cosmic Gallery</h3>
    <p>Explore the universe through our collection of stunning cosmic imagery and artistic interpretations of space.</p>
  `;
  
  const socialIcons = document.createElement('div');
  socialIcons.className = 'social-icons';
  socialIcons.innerHTML = `
    <a href="#" class="social-icon-link"><i class="fab fa-facebook-f"></i></a>
    <a href="#" class="social-icon-link"><i class="fab fa-twitter"></i></a>
    <a href="#" class="social-icon-link"><i class="fab fa-instagram"></i></a>
    <a href="#" class="social-icon-link"><i class="fab fa-linkedin-in"></i></a>
  `;
  
  column1.appendChild(logoArea);
  column1.appendChild(socialIcons);
  
  // Column 2 - Quick Links
  const column2 = document.createElement('div');
  column2.className = 'footer-column footer-links';
  column2.innerHTML = `
    <h4>Quick Links</h4>
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">About Us</a></li>
      <li><a href="#">Gallery</a></li>
      <li><a href="#">Collections</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  `;
  
  // Column 3 - Explore
  const column3 = document.createElement('div');
  column3.className = 'footer-column footer-links';
  column3.innerHTML = `
    <h4>Explore</h4>
    <ul>
      <li><a href="#">Nebulae</a></li>
      <li><a href="#">Galaxies</a></li>
      <li><a href="#">Solar System</a></li>
      <li><a href="#">Deep Space</a></li>
      <li><a href="#">Cosmic Events</a></li>
    </ul>
  `;
  
  // Column 4 - Newsletter
  const column4 = document.createElement('div');
  column4.className = 'footer-column';
  column4.innerHTML = `
    <div class="footer-links">
      <h4>Stay Updated</h4>
      <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 15px;">Subscribe to our newsletter for updates on new cosmic discoveries and gallery additions.</p>
      <div class="newsletter">
        <input type="email" class="newsletter-input" placeholder="Your email address">
        <button class="newsletter-btn">Subscribe</button>
      </div>
    </div>
  `;
  
  // Add all columns to footer content
  footerContent.appendChild(column1);
  footerContent.appendChild(column2);
  footerContent.appendChild(column3);
  footerContent.appendChild(column4);
  
  // Add footer content to footer
  footer.appendChild(footerContent);
  
  // Add copyright bar
  const copyrightBar = document.createElement('div');
  copyrightBar.className = 'copyright-bar';
  copyrightBar.innerHTML = `
    <p>&copy; ${new Date().getFullYear()} Cosmic Gallery. All rights reserved.</p>
  `;
  
  footer.appendChild(copyrightBar);
  
  // Add the footer to the page
  document.body.appendChild(footer);
  
  // Add FontAwesome for the social icons if not already present
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesome);
  }
}

function enhanceCosmicLoader() {
  // Get existing loader or create new one
  let loader = document.querySelector('.cosmic-loader');
  
  if (loader) {
    // Add SVG progress ring
    const progressRing = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    progressRing.setAttribute('width', '200');
    progressRing.setAttribute('height', '200');
    progressRing.setAttribute('viewBox', '0 0 100 100');
    progressRing.classList.add('loader-progress');
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '45');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', 'rgba(114, 186, 255, 0.3)');
    circle.setAttribute('stroke-width', '2');
    progressRing.appendChild(circle);
    
    const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    progressCircle.setAttribute('cx', '50');
    progressCircle.setAttribute('cy', '50');
    progressCircle.setAttribute('r', '45');
    progressCircle.setAttribute('fill', 'none');
    progressCircle.setAttribute('stroke', 'url(#gradient)');
    progressCircle.setAttribute('stroke-width', '3');
    progressCircle.setAttribute('stroke-dasharray', '283');
    progressCircle.setAttribute('stroke-dashoffset', '283');
    progressCircle.classList.add('loader-progress-ring');
    
    // Add gradient definition
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'gradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '0%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#3f88f5');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#9f5afd');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    progressRing.appendChild(defs);
    progressRing.appendChild(progressCircle);
    
    // Add progress text
    const progressText = document.createElement('div');
    progressText.className = 'loader-progress-text';
    progressText.textContent = 'Loading 0%';
    
    // Add particles
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'loader-particles-container';
    
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'loader-particle';
      
      // Random position and movement
      const angle = Math.random() * Math.PI * 2;
      const distance = 30 + Math.random() * 70;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      // Random delay and duration
      const delay = Math.random() * 2;
      
      // Apply styles
      particle.style.setProperty('--x', `${x}px`);
      particle.style.setProperty('--y', `${y}px`);
      particle.style.animationDelay = `${delay}s`;
      
      particlesContainer.appendChild(particle);
    }
    
    loader.appendChild(progressRing);
    loader.appendChild(progressText);
    loader.appendChild(particlesContainer);
    loader.classList.add('enhanced-loader');
    
    // Animate the progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      const dashoffset = 283 - (283 * progress / 100);
      progressCircle.style.strokeDashoffset = dashoffset;
      progressText.textContent = `Loading ${progress}%`;
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Complete loading with a short delay
        setTimeout(() => {
          const loaderContainer = document.querySelector('.cosmic-loader-container');
          if (loaderContainer) {
            loaderContainer.classList.add('fade-out');
          }
        }, 300);
      }
    }, 30);
  }
} 