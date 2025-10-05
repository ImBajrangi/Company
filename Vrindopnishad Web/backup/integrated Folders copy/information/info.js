// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    initCursor();
    initThemeToggle();
    initMobileMenu();
    initToolsMenu();
    initFormSubmission();
    initThreeJsBackground();
    initSmoothScrolling();
    addSectionAnimations();
});

// Custom cursor effect
function initCursor() {
    window.addEventListener("mousemove", (e) => {
        let cursor = document.getElementById("cursor");
        if (!cursor) return;
        
        setTimeout(() => {
            cursor.style.top = `${e.clientY}px`;
            cursor.style.left = `${e.clientX}px`;
        }, 50);

        // Change cursor effect on interactive elements
        const target = e.target;
        if (target.id === "box" || 
            target.classList.contains('btn') || 
            target.tagName === 'A' ||
            target.closest('.article-card') ||
            target.closest('.social-link') ||
            target.closest('.tool-item')) {
            cursor.classList.add("active");
        } else {
            cursor.classList.remove("active");
        }
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        const cursor = document.getElementById('cursor');
        if (cursor) cursor.style.opacity = '0';
    });

    // Show cursor when entering window
    document.addEventListener('mouseenter', () => {
        const cursor = document.getElementById('cursor');
        if (cursor) cursor.style.opacity = '1';
    });
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        
        // Reinitialize Three.js background when theme changes to update colors
        initThreeJsBackground();
    });
}

// Tools menu functionality
function initToolsMenu() {
    const toolsIcon = document.getElementById('tools-icon');
    const toolsMenu = document.querySelector('.tools-menu');
    const toolsMenuClose = document.querySelector('.tools-menu-close');
    const menuOverlay = document.querySelector('.menu-overlay');
    const toolItems = document.querySelectorAll('.tool-item');
    
    if (!toolsIcon || !toolsMenu) return;
    
    // Open tools menu
    toolsIcon.addEventListener('click', () => {
        toolsMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate tool items
        toolItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('active');
            }, 100 * index);
        });
    });
    
    // Close tools menu
    function closeToolsMenu() {
        toolsMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset tool items animation
        toolItems.forEach(item => {
            item.classList.remove('active');
        });
    }
    
    if (toolsMenuClose) {
        toolsMenuClose.addEventListener('click', closeToolsMenu);
    }
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeToolsMenu);
    }
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && toolsMenu.classList.contains('active')) {
            closeToolsMenu();
        }
    });
    
    // Handle tool item hover effects
    toolItems.forEach(item => {
        const bgColor = item.getAttribute('data-bg-color');
        const textColor = item.getAttribute('data-text-color');
        
        item.addEventListener('mouseenter', () => {
            if (bgColor && textColor) {
                item.style.backgroundColor = bgColor;
                item.style.color = textColor;
                
                // Apply styles to child elements
                const iconSvg = item.querySelector('.tool-icon svg');
                const h3 = item.querySelector('h3');
                const p = item.querySelector('p');
                
                if (iconSvg) iconSvg.style.stroke = textColor;
                if (h3) h3.style.color = textColor;
                if (p) p.style.color = textColor;
            }
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = '';
            item.style.color = '';
            
            // Reset styles for child elements
            const iconSvg = item.querySelector('.tool-icon svg');
            const h3 = item.querySelector('h3');
            const p = item.querySelector('p');
            
            if (iconSvg) iconSvg.style.stroke = '';
            if (h3) h3.style.color = '';
            if (p) p.style.color = '';
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileNav = document.querySelector('.mobile-nav');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    if (!mobileMenuBtn || !mobileNav) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    function closeMenu() {
        mobileNav.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMenu);
    }
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// Add animations to sections
function addSectionAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Add animation to article cards
    const articleCards = document.querySelectorAll('.article-card');
    let delay = 0;
    
    articleCards.forEach(card => {
        card.style.transitionDelay = `${delay}s`;
        delay += 0.1;
        observer.observe(card);
    });
}

// Form submission functionality
function initFormSubmission() {
    const contactForm = document.getElementById('contact-form');
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('कृपया सभी फ़ील्ड भरें', 'error');
                return;
            }
            
            // Here you would normally send the data to a server
            // For demo purposes, we'll just show a success message
            showNotification('आपका संदेश सफलतापूर्वक भेज दिया गया है!', 'success');
            contactForm.reset();
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            if (!email) {
                showNotification('कृपया अपना ईमेल दर्ज करें', 'error');
                return;
            }
            
            showNotification('न्यूज़लेटर की सदस्यता सफलतापूर्वक ली गई!', 'success');
            newsletterForm.reset();
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    let notifications = document.getElementById('notifications');
    
    if (!notifications) {
        notifications = document.createElement('div');
        notifications.className = 'notifications';
        notifications.id = 'notifications';
        document.body.appendChild(notifications);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Create notification structure
    notification.innerHTML = `
        <div class="notification-header">
            <div class="notification-app-icon"><i class="fas ${type === 'success' ? 'fa-check' : type === 'error' ? 'fa-exclamation' : 'fa-info'}"></i></div>
            <div class="notification-app-name">भक्तवेब</div>
            <div class="notification-time">अभी</div>
        </div>
        <div class="notification-content">
            <span>${message}</span>
        </div>
    `;
    
    notifications.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Three.js background animation
function initThreeJsBackground() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.warn('Three.js is not loaded');
        return;
    }

    // Clear existing canvas if any
    const existingCanvas = document.getElementById('bg-canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    // Create new canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);

    // Set up scene
    const scene = new THREE.Scene();
    
    // Determine if dark mode is active
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Add ambient light with color based on theme
    const ambientLight = new THREE.AmbientLight(isDarkMode ? 0x333333 : 0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light with color based on theme
    const directionalLight = new THREE.DirectionalLight(isDarkMode ? 0xffa500 : 0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Add point light for dramatic effect
    const pointLight = new THREE.PointLight(0xff5722, 1, 50);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);
    
    // Create main lotus group
    const lotusGroup = new THREE.Group();
    
    // Create center of lotus
    const centerGeometry = new THREE.SphereGeometry(1, 32, 32);
    const centerMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0xffd700,
        emissiveIntensity: 0.3
    });
    const centerSphere = new THREE.Mesh(centerGeometry, centerMaterial);
    lotusGroup.add(centerSphere);
    
    // Create lotus petals
    const petalCount = 24;
    const petalRows = 3;
    
    // Create different sized rows of petals
    for (let row = 0; row < petalRows; row++) {
        const rowScale = 1 + row * 0.8;
        const rowAngleOffset = row * (Math.PI / petalCount);
        
        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * Math.PI * 2 + rowAngleOffset;
            const distance = 1.5 * rowScale;
            
            // Create petal geometry
            const petalGeometry = new THREE.CylinderGeometry(0, 0.8, 2.5, 3, 1);
            const petalMaterial = new THREE.MeshStandardMaterial({
                color: isDarkMode ? 0xff5722 : 0xff9800,
                metalness: 0.2,
                roughness: 0.6,
                emissive: isDarkMode ? 0xff5722 : 0xff9800,
                emissiveIntensity: 0.2,
                transparent: true,
                opacity: 0.9
            });
            
            const petal = new THREE.Mesh(petalGeometry, petalMaterial);
            
            // Position petal
            petal.position.x = Math.cos(angle) * distance;
            petal.position.y = Math.sin(angle) * distance;
            petal.position.z = -row * 0.5;
            
            // Rotate petal to point outward
            petal.rotation.z = angle - Math.PI / 2;
            petal.rotation.x = Math.PI / 3;
            
            lotusGroup.add(petal);
        }
    }
    
    scene.add(lotusGroup);
    
    // Create orbiting particles
    const particlesGroup = new THREE.Group();
    
    // Create particles geometry
    const particlesCount = 1500;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesPositions = new Float32Array(particlesCount * 3);
    const particlesSizes = new Float32Array(particlesCount);
    const particlesColors = new Float32Array(particlesCount * 3);
    
    // Create particles with different orbits
    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        
        // Orbit parameters
        const orbitRadius = 5 + Math.random() * 15;
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 15;
        
        // Set positions
        particlesPositions[i3] = Math.cos(angle) * orbitRadius;     // x
        particlesPositions[i3 + 1] = Math.sin(angle) * orbitRadius; // y
        particlesPositions[i3 + 2] = height;                        // z
        
        // Set sizes - varied for depth effect
        particlesSizes[i] = Math.random() * 2;
        
        // Set colors - soft golden to orange gradient
        const colorT = Math.random();
        if (isDarkMode) {
            particlesColors[i3] = 0.9 + colorT * 0.1;       // R: 0.9-1.0
            particlesColors[i3 + 1] = 0.3 + colorT * 0.3;   // G: 0.3-0.6
            particlesColors[i3 + 2] = 0.1;                  // B: 0.1
        } else {
            particlesColors[i3] = 1.0;                      // R: 1.0
            particlesColors[i3 + 1] = 0.5 + colorT * 0.5;   // G: 0.5-1.0
            particlesColors[i3 + 2] = colorT * 0.2;         // B: 0.0-0.2
        }
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(particlesSizes, 1));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particlesColors, 3));
    
    // Create shader material for particles
    const particlesMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                float distance = length(gl_PointCoord - vec2(0.5, 0.5));
                if (distance > 0.5) discard;
                gl_FragColor = vec4(vColor, smoothstep(0.5, 0.0, distance));
            }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    particlesGroup.add(particles);
    scene.add(particlesGroup);
    
    // Create sacred symbols floating around
    const symbolsGroup = new THREE.Group();
    const symbolsData = [
        { geometry: new THREE.TorusKnotGeometry(1, 0.3, 64, 8, 2, 3), position: { x: 12, y: 0, z: 0 }, color: 0xffc107 },
        { geometry: new THREE.OctahedronGeometry(1, 0), position: { x: -12, y: 0, z: 0 }, color: 0xff9800 },
        { geometry: new THREE.TorusGeometry(1, 0.3, 16, 32), position: { x: 0, y: 12, z: 0 }, color: 0xff7043 },
        { geometry: new THREE.TetrahedronGeometry(1, 0), position: { x: 0, y: -12, z: 0 }, color: 0xff5722 },
        { geometry: new THREE.IcosahedronGeometry(1, 0), position: { x: 8, y: 8, z: 0 }, color: 0xffab00 },
        { geometry: new THREE.DodecahedronGeometry(1, 0), position: { x: -8, y: -8, z: 0 }, color: 0xff6f00 },
        { geometry: new THREE.TorusGeometry(0.9, 0.2, 16, 32, Math.PI), position: { x: -8, y: 8, z: 0 }, color: 0xff5252 },
        { geometry: new THREE.TorusKnotGeometry(0.8, 0.2, 64, 8, 3, 4), position: { x: 8, y: -8, z: 0 }, color: 0xff3d00 }
    ];
    
    symbolsData.forEach(symbolData => {
        const material = new THREE.MeshStandardMaterial({
            color: symbolData.color,
            metalness: 0.5,
            roughness: 0.3,
            emissive: symbolData.color,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.9
        });
        
        const symbol = new THREE.Mesh(symbolData.geometry, material);
        symbol.position.set(symbolData.position.x, symbolData.position.y, symbolData.position.z);
        
        // Store original position for animation
        symbol.userData.originalPosition = { ...symbol.position };
        symbol.userData.movementFactor = Math.random() * 2 + 1;
        symbol.userData.rotationSpeed = (Math.random() * 0.01) + 0.005;
        
        symbolsGroup.add(symbol);
    });
    
    scene.add(symbolsGroup);
    
    // Animation variables
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    // Track mouse position for parallax effect
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) / 100;
        mouseY = (event.clientY - windowHalfY) / 100;
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate lotus flower
        lotusGroup.rotation.y += 0.005;
        lotusGroup.rotation.x = Math.sin(Date.now() * 0.0005) * 0.2;
        
        // Make lotus "breathe"
        const breatheFactor = 1 + Math.sin(Date.now() * 0.001) * 0.05;
        lotusGroup.scale.set(breatheFactor, breatheFactor, breatheFactor);
        
        // Rotate particles
        particlesGroup.rotation.y -= 0.002;
        particlesGroup.rotation.x = Math.sin(Date.now() * 0.0003) * 0.1;
        
        // Animate symbols
        symbolsGroup.children.forEach(symbol => {
            // Float up and down
            const time = Date.now() * 0.001;
            const originalPos = symbol.userData.originalPosition;
            const moveFactor = symbol.userData.movementFactor;
            
            symbol.position.y = originalPos.y + Math.sin(time * moveFactor) * 1.5;
            symbol.position.x = originalPos.x + Math.cos(time * moveFactor * 0.7) * 0.5;
            
            // Rotate each symbol
            symbol.rotation.x += symbol.userData.rotationSpeed;
            symbol.rotation.y += symbol.userData.rotationSpeed * 1.3;
            symbol.rotation.z += symbol.userData.rotationSpeed * 0.7;
        });
        
        // Apply parallax effect based on mouse position
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        // Render scene
        renderer.render(scene, camera);
    }
    
    animate();
}

// Enable smooth scrolling for all anchor links
function initSmoothScrolling() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            if (targetId && document.getElementById(targetId)) {
                e.preventDefault();
                
                const targetElement = document.getElementById(targetId);
                const headerOffset = 70; // Account for fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Handle scroll events
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const header = document.querySelector('header');
    
    // Add shadow to header on scroll
    if (scrollPosition > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// //A great man once said:
// //Sign the big boy, Contract. Sign the big boy ~ Tike Myson