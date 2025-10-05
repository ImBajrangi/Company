/**
 * TechnoProfile - Main JavaScript
 * Author: Your Name
 * Version: 1.0
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initMobileMenu();
    initThemeToggle();
    initHeroSlider();
    initProductTabs();
    initProjectFilter();
    initTestimonialSlider();
    initContactForm();
    initNewsletterForm();
    initBackToTop();
});

/**
 * Preloader
 */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    
    // Hide preloader after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 500);
    });
}

/**
 * Mobile Menu
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;
    
    if (!mobileMenuBtn || !mainNav) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mainNav.classList.toggle('active');
        body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking on a link
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mainNav.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });
}

/**
 * Theme Toggle (Dark/Light Mode)
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Update icon
        if (body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
}

/**
 * Hero Slider
 */
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    let currentSlide = 0;
    let slideInterval;
    
    if (slides.length === 0) return;
    
    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the selected slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Update current slide index
        currentSlide = index;
    }
    
    // Next slide function
    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= slides.length) {
            next = 0;
        }
        showSlide(next);
    }
    
    // Previous slide function
    function prevSlide() {
        let prev = currentSlide - 1;
        if (prev < 0) {
            prev = slides.length - 1;
        }
        showSlide(prev);
    }
    
    // Start automatic slideshow
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Stop automatic slideshow
    function stopSlideshow() {
        clearInterval(slideInterval);
    }
    
    // Event listeners for controls
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopSlideshow();
            startSlideshow();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopSlideshow();
            startSlideshow();
        });
    }
    
    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopSlideshow();
            startSlideshow();
        });
    });
    
    // Start the slideshow
    startSlideshow();
}

/**
 * Product Tabs
 */
function initProductTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const categoryPanels = document.querySelectorAll('.category-panel');
    
    if (tabBtns.length === 0 || categoryPanels.length === 0) return;
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get category from data attribute
            const category = btn.getAttribute('data-category');
            
            // Hide all panels
            categoryPanels.forEach(panel => {
                panel.classList.remove('active');
            });
            
            // Show the selected panel
            const selectedPanel = document.getElementById(category);
            if (selectedPanel) {
                selectedPanel.classList.add('active');
            }
        });
    });
}

/**
 * Project Filter
 */
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    if (filterBtns.length === 0 || projectItems.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get filter value
            const filter = btn.getAttribute('data-filter');
            
            // Filter projects
            projectItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Testimonial Slider
 */
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentSlide = 0;
    let slideInterval;
    
    if (slides.length === 0) return;
    
    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the selected slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Update current slide index
        currentSlide = index;
    }
    
    // Next slide function
    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= slides.length) {
            next = 0;
        }
        showSlide(next);
    }
    
    // Start automatic slideshow
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            clearInterval(slideInterval);
            startSlideshow();
        });
    });
    
    // Start the slideshow
    startSlideshow();
}

/**
 * Contact Form
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Validate form (simple validation)
        if (!name || !email || !subject || !message) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Simulate form submission
        showToast('Thank you! Your message has been sent.', 'success');
        contactForm.reset();
    });
}

/**
 * Newsletter Form
 */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get email value
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Validate email (simple validation)
        if (!email) {
            showToast('Please enter your email address', 'error');
            return;
        }
        
        // Simulate subscription
        showToast('Thank you for subscribing to our newsletter!', 'success');
        newsletterForm.reset();
    });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Header Scroll Effect
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Toast Notification
 */
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) return;
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
} 