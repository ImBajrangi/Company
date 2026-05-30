import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { User, Search, Menu, ChevronDown, X, Heart, Settings, ShoppingCart } from 'lucide-react';
import { gsap } from 'gsap';

const Navbar = ({ onSearchClick, myListCount, siteConfig, cartCount, onCartClick }) => {
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
        { name: 'Home', href: 'https://vrindopnishad.in/' },
        { name: 'Shop Gallery', href: '/', active: true },
        { name: 'Collections', href: 'https://vrindopnishad.in/yatra' },
        { name: 'About Us', href: 'https://vrindopnishad.in/about' }
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
                    <a href="https://vrindopnishad.in/" className="nav-link">Home</a>
                    <a href="/" className="nav-link active">Shop Gallery</a>
                    
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

                    <a href="https://vrindopnishad.in/yatra" className="nav-link">Collections</a>
                    <a href="https://vrindopnishad.in/about" className="nav-link">About</a>
                </nav>

                <div className="header-actions">
                    <button className="action-btn" onClick={onSearchClick} title="Search">
                        <Search size={22} />
                    </button>
                    <button className="cart-trigger-btn" onClick={onCartClick} title="Shopping Cart">
                        <ShoppingCart size={22} />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </button>
                    <div className="user-avatar-wrapper">
                        <img 
                            src="https://vrindopnishad.in/Vrindopnishad%20Web/class/logo/v-logo-transparent.png" 
                            alt="User Profile" 
                            className="nav-avatar"
                        />
                    </div>
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
