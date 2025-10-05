document.addEventListener('DOMContentLoaded', function() {
    // Initialize advanced loader
    const advancedLoader = document.querySelector('.advanced-loader');
    const loaderProgressBar = document.querySelector('.loader-progress-bar');
    const loaderCounter = document.querySelector('.loader-counter');
    let loadProgress = 0;
    
    function updateLoader() {
        if (loadProgress < 100) {
            loadProgress += Math.floor(Math.random() * 3) + 1;
            loadProgress = Math.min(loadProgress, 100);
            
            if (loaderProgressBar) loaderProgressBar.style.width = loadProgress + '%';
            if (loaderCounter) loaderCounter.textContent = loadProgress + '%';
            
            if (loadProgress < 100) {
                setTimeout(updateLoader, 50);
            } else {
                setTimeout(() => {
                    if (advancedLoader) {
                        gsap.to(advancedLoader, {
                            opacity: 0,
                            duration: 0.8,
                            ease: 'power2.inOut',
                            onComplete: () => {
                                advancedLoader.style.display = 'none';
                                initAnimations();
                            }
                        });
                    } else {
                        initAnimations();
                    }
                }, 500);
            }
        }
    }
    
    // Start loader animation
    setTimeout(updateLoader, 300);
    
    // Initialize custom cursor
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');
    const cursorText = document.querySelector('.cursor-text');
    
    if (cursor && cursorDot && cursorCircle) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power1.out'
            });
        });
        
        // Add cursor effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .project-item, .horizontal-item, .feature-item, .social-icon, .scroll-indicator-dot');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'scale(1.5)';
                cursorCircle.style.transform = 'scale(1.5)';
                cursorCircle.style.borderColor = 'var(--secondary-color)';
                
                // Add text for specific elements
                if (element.classList.contains('btn')) {
                    cursorText.textContent = 'क्लिक';
                    cursorText.style.opacity = 1;
                } else if (element.classList.contains('project-item')) {
                    cursorText.textContent = 'देखें';
                    cursorText.style.opacity = 1;
                }
            });
            
            element.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'scale(1)';
                cursorCircle.style.transform = 'scale(1)';
                cursorCircle.style.borderColor = 'var(--primary-color)';
                cursorText.style.opacity = 0;
            });
        });
    }
    
    // Initialize WebGL background
    let scene, camera, renderer, particles;
    
    function initWebGL() {
        const canvas = document.querySelector('.webgl-bg');
        if (!canvas) return;
        
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Create particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1000;
        
        const posArray = new Float32Array(particlesCount * 3);
        const scaleArray = new Float32Array(particlesCount);
        
        for (let i = 0; i < particlesCount * 3; i += 3) {
            posArray[i] = (Math.random() - 0.5) * 10;
            posArray[i + 1] = (Math.random() - 0.5) * 10;
            posArray[i + 2] = (Math.random() - 0.5) * 10;
            scaleArray[i / 3] = Math.random();
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
        
        // Create material
        const particlesMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor1: { value: new THREE.Color(0xFF5F1F) },
                uColor2: { value: new THREE.Color(0x9C27B0) }
            },
            vertexShader: `
                uniform float uTime;
                attribute float scale;
                varying vec3 vPosition;
                
                void main() {
                    vPosition = position;
                    
                    vec3 pos = position;
                    pos.x += sin(uTime * 0.2 + position.z * 0.5) * 0.1;
                    pos.y += cos(uTime * 0.2 + position.x * 0.5) * 0.1;
                    pos.z += sin(uTime * 0.2 + position.y * 0.5) * 0.1;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = scale * 5.0 * (1.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                varying vec3 vPosition;
                
                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    
                    float mixFactor = (vPosition.x + vPosition.y + vPosition.z + 10.0) / 20.0;
                    vec3 color = mix(uColor1, uColor2, mixFactor);
                    
                    gl_FragColor = vec4(color, 1.0 - dist * 2.0);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        
        particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);
        
        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Animation loop
        const clock = new THREE.Clock();
        
        function animate() {
            const elapsedTime = clock.getElapsedTime();
            
            // Update uniforms
            particlesMaterial.uniforms.uTime.value = elapsedTime;
            
            // Rotate particles
            particles.rotation.x = elapsedTime * 0.05;
            particles.rotation.y = elapsedTime * 0.03;
            
            // Render
            renderer.render(scene, camera);
            
            // Call animate again on the next frame
            requestAnimationFrame(animate);
        }
        
        animate();
    }
    
    // Initialize section particles
    function initSectionParticles() {
        const particleContainers = [
            document.querySelector('.hero-particles'),
            document.querySelector('.quote-particles'),
            document.querySelector('.horizontal-particles'),
            document.querySelector('.about-particles'),
            document.querySelector('.footer-particles')
        ];
        
        particleContainers.forEach(container => {
            if (!container) return;
            
            // Create particles
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Random position
                const posX = Math.random() * 100;
                const posY = Math.random() * 100;
                
                // Random size
                const size = Math.random() * 10 + 5;
                
                // Random opacity
                const opacity = Math.random() * 0.5 + 0.1;
                
                // Random animation duration
                const duration = Math.random() * 20 + 10;
                
                // Apply styles
                particle.style.cssText = `
                    position: absolute;
                    top: ${posY}%;
                    left: ${posX}%;
                    width: ${size}px;
                    height: ${size}px;
                    background: radial-gradient(circle, var(--primary-color) 0%, transparent 70%);
                    border-radius: 50%;
                    opacity: ${opacity};
                    animation: float ${duration}s infinite alternate ease-in-out;
                    animation-delay: ${Math.random() * 5}s;
                    pointer-events: none;
                `;
                
                container.appendChild(particle);
            }
        });
    }
    
    // Initialize scroll indicator
    function initScrollIndicator() {
        const scrollDots = document.querySelectorAll('.scroll-indicator-dot');
        const sections = document.querySelectorAll('[data-section]');
        
        if (scrollDots.length === 0 || sections.length === 0) return;
        
        // Set initial active state
        scrollDots[0].classList.add('active');
        
        // Update active dot on scroll
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            
            sections.forEach((section, index) => {
                if (index >= scrollDots.length) return;
                
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    scrollDots.forEach(dot => dot.classList.remove('active'));
                    scrollDots[index].classList.add('active');
                }
            });
        });
        
        // Scroll to section on dot click
        scrollDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetSection = dot.getAttribute('data-section');
                const targetElement = document.querySelector(`[data-section="${targetSection}"]`);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Initialize magnetic effect
    function initMagneticEffect() {
        const magneticElements = document.querySelectorAll('.btn-magnetic, .magnetic-wrap');
        
        if (magneticElements.length === 0) return;
        
        magneticElements.forEach(element => {
            const strength = element.getAttribute('data-magnetic-strength') || 0.3;
            
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const distanceX = e.clientX - centerX;
                const distanceY = e.clientY - centerY;
                
                gsap.to(element, {
                    x: distanceX * strength,
                    y: distanceY * strength,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            element.addEventListener('mouseleave', () => {
                gsap.to(element, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });
    }
    
    // Initialize text splitting and animations
    function initTextSplitting() {
        // Split text elements
        const splitTextElements = document.querySelectorAll('.split-text');
        
        if (splitTextElements.length === 0) return;
        
        splitTextElements.forEach(element => {
            const textReveal = element.querySelectorAll('.text-reveal');
            
            if (textReveal.length === 0) return;
            
            textReveal.forEach((reveal, index) => {
                gsap.set(reveal, {
                    overflow: 'hidden'
                });
                
                const span = reveal.querySelector('span');
                if (!span) return;
                
                gsap.set(span, {
                    y: '100%',
                    opacity: 0
                });
                
                ScrollTrigger.create({
                    trigger: element,
                    start: 'top 80%',
                    once: true,
                    onEnter: () => {
                        gsap.to(span, {
                            y: '0%',
                            opacity: 1,
                            duration: 0.8,
                            delay: index * 0.1,
                            ease: 'power3.out'
                        });
                    }
                });
            });
        });
    }
    
    // Initialize image reveal animations
    function initImageReveal() {
        const imageRevealElements = document.querySelectorAll('.image-reveal');
        
        if (imageRevealElements.length === 0) return;
        
        imageRevealElements.forEach(element => {
            const mask = element.querySelector('.image-reveal-mask');
            const img = element.querySelector('img');
            
            if (!mask || !img) return;
            
            gsap.set(mask, {
                scaleX: 1,
                transformOrigin: 'right'
            });
            
            gsap.set(img, {
                scale: 1.2
            });
            
            ScrollTrigger.create({
                trigger: element,
                start: 'top 70%',
                once: true,
                onEnter: () => {
                    gsap.to(mask, {
                        scaleX: 0,
                        duration: 1,
                        ease: 'power3.inOut'
                    });
                    
                    gsap.to(img, {
                        scale: 1,
                        duration: 1.2,
                        delay: 0.2,
                        ease: 'power3.out'
                    });
                }
            });
        });
    }
    
    // Initialize parallax effect
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        if (parallaxElements.length === 0) return;
        
        parallaxElements.forEach(element => {
            if (!element.parentElement) return;
            
            const speed = element.getAttribute('data-speed') || 0.1;
            
            ScrollTrigger.create({
                trigger: element.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                onUpdate: (self) => {
                    const yPos = -self.progress * 100 * speed;
                    gsap.set(element, {
                        y: yPos
                    });
                }
            });
        });
    }
    
    // Initialize 3D card effect with vanilla-tilt
    function init3DCards() {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        
        if (tiltElements.length === 0 || typeof VanillaTilt === 'undefined') return;
        
        VanillaTilt.init(tiltElements, {
            max: 5,
            speed: 400,
            glare: true,
            'max-glare': 0.2
        });
    }
    
    // Initialize all animations
    function initAnimations() {
        // Initialize GSAP and ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);
        
        // Initialize WebGL background
        initWebGL();
        
        // Initialize section particles
        initSectionParticles();
        
        // Initialize scroll indicator
        initScrollIndicator();
        
        // Initialize magnetic effect
        initMagneticEffect();
        
        // Initialize text splitting and animations
        initTextSplitting();
        
        // Initialize image reveal animations
        initImageReveal();
        
        // Initialize parallax effect
        initParallax();
        
        // Initialize 3D card effect
        init3DCards();
        
        // Initialize smooth scroll
        try {
            if (typeof LocomotiveScroll === 'undefined') return;
            
            const mainElement = document.querySelector('main');
            if (!mainElement) return;
            
            const locoScroll = new LocomotiveScroll({
                el: mainElement,
                smooth: true,
                multiplier: 1,
                lerp: 0.05
            });
            
            // Update ScrollTrigger when locomotive scroll updates
            locoScroll.on('scroll', ScrollTrigger.update);
            
            // Tell ScrollTrigger to use these proxy methods for the main element
            ScrollTrigger.scrollerProxy('main', {
                scrollTop(value) {
                    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
                },
                getBoundingClientRect() {
                    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
                },
                pinType: mainElement.style.transform ? 'transform' : 'fixed'
            });
            
            // Each time the window updates, refresh ScrollTrigger and locomotive scroll
            ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
            ScrollTrigger.refresh();
        } catch (error) {
            console.error('Error initializing smooth scroll:', error);
        }
    }
});