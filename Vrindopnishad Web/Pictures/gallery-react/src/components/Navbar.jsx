import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { User, Search, Menu, ChevronDown, X, Heart, Settings } from 'lucide-react';
import { gsap } from 'gsap';

const Navbar = ({ onSearchClick, myListCount, siteConfig }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useLayoutEffect(() => {
        gsap.fromTo(navRef.current, 
            { y: -20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.1 }
        );
    }, []);

    const navLinks = [
        { name: 'Home', href: '../../Home/main/home.html' },
        { name: 'Gallery', href: 'Gallery.html', active: true },
    ];

    const categories = [
        { name: 'Featured', href: '#featured-slider' },
        { name: 'Popular', href: '#popular-slider' },
        { name: 'Rapper Style', href: '#rapper-slider' },
        { name: 'Anime & Art', href: '#anime-slider' },
        { name: 'Dark Aesthetic', href: '#dark-slider' },
        { name: 'Warrior Styles', href: '#warrior-slider' },
    ];

    return (
        <>
            <header 
                className={`header ${isScrolled ? 'scrolled' : ''} dark`} 
                id="header"
                ref={navRef}
                style={{ opacity: 0 }}
            >
                <a href="/" className="logo">
                    <img src="https://vrindopnishad.in/Vrindopnishad%20Web/class/logo/v-logo-transparent.png" alt="Chitra Vrinda" className="logo-img" />
                    <span className="logo-text">Chitra Vrinda</span>
                </a>

                <nav className="nav-menu">
                    <a href="../../Home/main/home.html" className="nav-link">Home</a>
                    <a href="Gallery.html" className="nav-link active">Gallery</a>
                    
                    <div className="nav-dropdown">
                        <button className="nav-link dropdown-trigger" style={{ color: '#fff' }}>
                            Browse <ChevronDown size={14} />
                        </button>
                        <div className="dropdown-menu">
                            {categories.map((cat) => (
                                <a key={cat.name} href={cat.href} className="dropdown-item">
                                    {cat.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    <a href="../../Stack/main/stack.html" className="nav-link">Collections</a>
                    <a href="../../about code/main/about.html" className="nav-link">About</a>
                </nav>

                <div className="header-actions">
                    <button className="action-btn" title="Settings">
                        <Settings size={20} />
                    </button>
                    <div className="user-avatar-wrapper">
                        <img 
                            src="https://vrindopnishad.in/Vrindopnishad%20Web/class/logo/v-logo-transparent.png" 
                            alt="User Profile" 
                            className="nav-avatar"
                        />
                    </div>
                    <button className="action-btn" onClick={onSearchClick} title="Search">
                        <Search size={22} />
                    </button>
                    <button
                        className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Menu"
                    >
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`} id="mobile-nav-overlay">
                <button 
                    className="mobile-close-btn" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close Menu"
                >
                    <X size={32} />
                </button>
                <nav className="mobile-nav">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className={`mobile-link ${link.active ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>
                <div className="mobile-footer">
                    <p>© 2026 Chitra Vrinda</p>
                </div>
            </div>
        </>
    );
};

export default Navbar;
