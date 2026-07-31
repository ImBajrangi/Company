import React, { useState, useEffect } from 'react';
import { Wrench, Globe, User } from 'lucide-react';

interface HeaderProps {
  onOpenTools: () => void;
  onOpenDevGuide: () => void;
  lang: 'english' | 'hindi';
  onLanguageChange: (lang: 'english' | 'hindi') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTools,
  onOpenDevGuide,
  lang,
  onLanguageChange
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHide, setIsHide] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let lastScroll = 0;

    const handleScroll = () => {
      const currentScroll = window.pageYOffset;

      // Header scrolled state
      if (currentScroll > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Smart header hide on scroll down / show on scroll up
      if (currentScroll <= 0) {
        setIsHide(false);
        lastScroll = currentScroll;
        return;
      }

      if (currentScroll > lastScroll && currentScroll > 60) {
        setIsHide(true);
      } else if (currentScroll < lastScroll) {
        setIsHide(false);
      }

      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    const nextState = !isMenuOpen;
    setIsMenuOpen(nextState);
    if (nextState) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.classList.remove('menu-open');
  };

  return (
    <>
      {/* Menu Overlay */}
      <div className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>

      {/* Header with smart scroll class names */}
      <header className={`${isScrolled ? 'scrolled' : ''} ${isHide ? 'hide' : ''}`}>
        <a href="index.html" className="logo">
          <img
            src="Vrindopnishad%20Web/class/v-logo-rounded/official-logo.svg"
            alt="Vrindopnishad Logo"
            className="header-logo-img logo-light-theme"
            width="70"
            height="70"
          />
          <img
            src="Vrindopnishad%20Web/class/v-logo-rounded/official-logo-dark.svg"
            alt="Vrindopnishad Logo"
            className="header-logo-img logo-dark-theme"
            width="70"
            height="70"
          />
        </a>

        <div className="main-nav">
          <ul>
            <li><a href="#home" className="active">Home</a></li>
            <li><a href="Vrindopnishad%20Web/about%20code/main/about.html">About</a></li>
            <li><a href="Vrindopnishad%20Web/Pictures/main/Gallery.html">Gallery</a></li>
          </ul>
        </div>

        <div className="header-right">
          {/* User Auth Button */}
          <div 
            id="user-auth-btn" 
            className="header-icon" 
            aria-label="User Account" 
            role="button" 
            tabIndex={0}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <User size={20} />
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => onLanguageChange(lang === 'english' ? 'hindi' : 'english')}
            className="btn-icon header-icon"
            title="Switch Language"
            aria-label="Language Selector"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
          >
            <Globe size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{lang === 'english' ? 'EN' : 'HI'}</span>
          </button>

          {/* Tools Menu Icon */}
          <button
            onClick={onOpenTools}
            className="tools-icon header-icon"
            title="Spiritual Tools"
            aria-label="Spiritual Tools Menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
          >
            <Wrench size={18} />
          </button>

          {/* SVG Animated Hamburger Button */}
          <button
            className={`menu ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            role="button"
            tabIndex={0}
          >
            <svg viewBox="1 1 64 48">
              <path d="M19,15 L45,15 C70,15 58,-2 49.0177126,7 L19,37"></path>
              <path d="M19,24 L45,24 C61.2371586,24 57,49 41,33 L32,24"></path>
              <path d="M45,33 L19,33 C-8,33 6,-2 22,14 L45,37"></path>
            </svg>
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Drawer */}
      <nav className={isMenuOpen ? 'active' : ''} aria-hidden={!isMenuOpen}>
        <ul>
          <li>
            <a href="#home" className="active" onClick={closeMenu}>
              Home
            </a>
          </li>
          <li>
            <a href="Vrindopnishad%20Web/Pictures/main/Gallery.html" onClick={closeMenu}>
              Gallery
            </a>
          </li>
          <li>
            <a href="Vrindopnishad%20Web/Pictures/main/photos.html" onClick={closeMenu}>
              Photos
            </a>
          </li>
          <li>
            <a href="Vrindopnishad%20Web/about%20code/main/about.html" onClick={closeMenu}>
              About
            </a>
          </li>
          <li>
            <a href="Vrindopnishad%20Web/pdf/main/pdf-viewer.html" onClick={closeMenu}>
              PDF Library
            </a>
          </li>
          <li>
            <a href="Projects/Cloud-Kitchen/kitchen.html" onClick={closeMenu}>
              Cloud Kitchen
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};
