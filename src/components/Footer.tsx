import React from 'react';

interface FooterProps {
  onOpenDevGuide: () => void;
  lang: 'english' | 'hindi';
}

export const Footer: React.FC<FooterProps> = ({ onOpenDevGuide }) => {
  return (
    <footer id="contact">
      <div className="footer-content">
        <div>
          <div className="footer-logo text-gradient">Vrindopnishad</div>
          <p className="fade-up-off">
            A digital sanctuary where art, technology, and spirituality converge in harmonic resonance.
          </p>
          <p className="fade-up-off" style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
            A digital sanctuary where ancient wisdom meets modern creativity, offering a unique space for spiritual and creative exploration.
          </p>
        </div>

        <div className="footer-links">
          <h3>Navigate</h3>
          <ul className="staggered-list">
            <li className="staggered-item"><a href="#home" className="text-hover">Home</a></li>
            <li className="staggered-item"><a href="Vrindopnishad%20Web/Pictures/main/Gallery.html" className="text-hover">Gallery</a></li>
            <li className="staggered-item"><a href="#projects" className="text-hover">Collection</a></li>
            <li className="staggered-item"><a href="Vrindopnishad%20Web/Pictures/main/photos.html" className="text-hover">Photos</a></li>
            <li className="staggered-item"><a href="Vrindopnishad%20Web/about%20code/main/about.html" className="text-hover">About</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Our Projects</h3>
          <ul className="staggered-list">
            <li className="staggered-item">
              <a href="https://path.vrindopnishad.in/" className="text-hover" target="_blank" rel="noopener noreferrer">Bhajan Path</a>
            </li>
            <li className="staggered-item">
              <a href="Projects/Cloud-Kitchen/kitchen.html" className="text-hover">Foody Vrinda</a>
            </li>
            <li className="staggered-item">
              <a href="Vrindopnishad%20Web/Pictures/main/Gallery.html" className="text-hover">Chitra Vrinda</a>
            </li>
            <li className="staggered-item">
              <a href="Projects/Vrinda-Tours/vrinda-tours.html" className="footer-link">Vrinda Tours</a>
            </li>
            <li className="staggered-item">
              <a href="Projects/Web%20dev/vrinda%20web%20dev.html" className="text-hover">Web Development</a>
            </li>
          </ul>
          <h3 style={{ marginTop: '1.5rem' }}>E-commerce</h3>
          <ul className="staggered-list">
            <li className="staggered-item">
              <a href="https://edu.vrindopnishad.in/" className="text-hover" target="_blank" rel="noopener noreferrer">skillTadka</a>
            </li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Connect</h3>
          <ul className="staggered-list">
            <li className="staggered-item">
              <a href="https://www.instagram.com/vrindopnishad" className="text-hover" target="_blank" rel="noopener noreferrer">Instagram</a>
            </li>
            <li className="staggered-item">
              <a href="https://www.facebook.com/vrindopnishad" className="text-hover" target="_blank" rel="noopener noreferrer">Facebook</a>
            </li>
            <li className="staggered-item">
              <a href="https://www.youtube.com/@vrindopnishad" className="text-hover" target="_blank" rel="noopener noreferrer">YouTube</a>
            </li>
            <li className="staggered-item">
              <a href="https://chat.whatsapp.com/LUMjP73wwyY9C1DNYeyoGu" className="text-hover" target="_blank" rel="noopener noreferrer">Barsana Daily Darshan</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p>&copy; {new Date().getFullYear()} Vrindopnishad. All rights reserved.</p>
        <button 
          onClick={onOpenDevGuide}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'inherit', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
        >
          Developer Details
        </button>
      </div>
    </footer>
  );
};
