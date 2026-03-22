import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { useNotifications } from '../context/NotificationContext';

const Hero = ({ heroSection, siteConfig }) => {
    const { showNotification } = useNotifications();
    const [currentBg, setCurrentBg] = useState(0);
    const btnRef = useRef(null);
    const heroRef = useRef(null);
    
    // Default backgrounds if none provided
    const backgrounds = heroSection && heroSection.backgroundImage 
        ? [heroSection.backgroundImage] 
        : ['https://vrindopnishad.in/Vrindopnishad%20Web/class/image/KRSHN/Blue_Krishna_personified_as_living_aurora_borealis_with_cosmic_celestial_colors.png'];

    const title = heroSection?.title || "Chitra Vrinda";
    const description = heroSection?.description || siteConfig?.description || "A carefully curated collection of spiritual photography and sacred artworks from Vrindavan.";

    useEffect(() => {
        if (backgrounds.length > 1) {
            const interval = setInterval(() => {
                setCurrentBg(prev => (prev + 1) % backgrounds.length);
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [backgrounds.length]);

    // --- Premium Entrance Animation (FX11 Inspired) ---
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.2 } });
            
            tl.fromTo(".hero-label", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.2)
              .fromTo(".hero-heading", { y: 40, opacity: 0 }, { y: 0, opacity: 1 }, 0.4)
              .fromTo(".hero-text", { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, 0.6)
              .fromTo(".hero-cta-btn", { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, 0.8)
              .fromTo(".hero-image-label", { x: 50, opacity: 0 }, { x: 0, opacity: 1 }, 1.0);
        }, heroRef);

        return () => ctx.revert();
    }, []);

    // --- Sacred Ripple Logic ---
    const handleMouseEnter = (e) => {
        if (!btnRef.current) return;
        const rect = btnRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        btnRef.current.style.setProperty('--ripple-x', `${x}%`);
        btnRef.current.style.setProperty('--ripple-y', `${y}%`);
        btnRef.current.classList.remove('ripple-shrinking');
        btnRef.current.classList.add('ripple-expanding');
    };

    const handleMouseMove = (e) => {
        if (!btnRef.current) return;
        const rect = btnRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        btnRef.current.style.setProperty('--ripple-x', `${x}%`);
        btnRef.current.style.setProperty('--ripple-y', `${y}%`);
    };

    const handleMouseLeave = (e) => {
        if (!btnRef.current) return;
        const rect = btnRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        btnRef.current.style.setProperty('--ripple-x', `${x}%`);
        btnRef.current.style.setProperty('--ripple-y', `${y}%`);
        btnRef.current.classList.remove('ripple-expanding');
        btnRef.current.classList.add('ripple-shrinking');
    };

    const handleExplore = () => {
        showNotification('Exploring divine collections...', 'info');
        document.querySelector('.content-row')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="hero" ref={heroRef}>
            <div className="hero-content">
                <span className="hero-label">Curated Gallery</span>
                <h1 className="hero-heading">
                    Chitra Vrinda:<br />
                    <span className="hero-accent">Divine art that inspires</span>
                </h1>
                <p className="hero-text">
                    A carefully curated collection of spiritual photography and sacred artworks from Vrindavan.
                </p>
                <button
                    ref={btnRef}
                    className="hero-cta-btn ripple-btn"
                    onClick={handleExplore}
                    onMouseEnter={handleMouseEnter}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <span className="btn-text">
                        Explore Collection
                        <ArrowRight size={18} style={{ marginLeft: '12px', verticalAlign: 'middle' }} />
                    </span>
                </button>
            </div>

            <div className="hero-visual">
                <div className="hero-image-wrapper">
                    <div
                        className="hero-image active"
                        style={{ 
                            backgroundImage: `url(${backgrounds[currentBg]})`, 
                            transition: 'opacity 1s ease-in-out',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover'
                        }}
                    ></div>
                    <div className="hero-image-overlay"></div>
                </div>
                <div className="hero-image-label">
                    <span className="label-category">Featured</span>
                    <span className="label-title">Sacred Vrindavan</span>
                </div>
            </div>
        </section>
    );
};

export default Hero;
