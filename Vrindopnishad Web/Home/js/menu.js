// Mobile Menu Toggle
const menuBtn = document.querySelector('.menu');
const nav = document.querySelector('nav');
const menuOverlay = document.querySelector('.menu-overlay');
const toolsIcon = document.querySelector('.tools-icon');

function openMenu() {
    menuBtn.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
    nav.classList.add('active');
    nav.setAttribute('aria-hidden', 'false');
    menuOverlay.classList.add('active');
    document.body.classList.add('menu-open');
}

function closeMenu() {
    menuBtn.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    nav.classList.remove('active');
    nav.setAttribute('aria-hidden', 'true');
    menuOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
}

// Toggle menu on button click
menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (nav.classList.contains('active')) {
        closeMenu();
    } else {
        openMenu();
    }
});

// Close menu on overlay click
menuOverlay.addEventListener('click', closeMenu);

// Close menu when clicking nav links
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        closeMenu();
        
        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
        closeMenu();
    }
});

// Keyboard accessibility for tools icon
toolsIcon.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        alert('Tools menu would open here!');
    }
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Prevent body scroll when menu is open
nav.addEventListener('touchmove', (e) => {
    e.stopPropagation();
}, { passive: false });

// Handle resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && nav.classList.contains('active')) {
        closeMenu();
    }
});