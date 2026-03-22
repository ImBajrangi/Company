import React from 'react';
import { Facebook, Instagram, Youtube, MessageCircle, ExternalLink } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer" id="contact">
            <div className="footer-content">
                <div className="footer-info">
                    <h3 className="footer-logo">Chitra Vrinda</h3>
                    <p className="footer-text">Exploring spirituality through divine art and photography.</p>
                    <div className="social-links">
                        <a href="https://www.facebook.com/vrindopnishad" className="social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                            <Facebook size={20} />
                        </a>
                        <a href="https://www.instagram.com/vrindopnishad" className="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                            <Instagram size={20} />
                        </a>
                        <a href="https://www.youtube.com/@vrindopnishad" className="social-link" aria-label="Youtube" target="_blank" rel="noopener noreferrer">
                            <Youtube size={20} />
                        </a>
                    </div>
                </div>

                <div className="footer-links">
                    <h3 className="footer-logo">Explore</h3>
                    <ul>
                        <li><a href="../../Home/main/home.html" className="footer-link">Home</a></li>
                        <li><a href="../../Stack/main/stack.html" className="footer-link">Collections</a></li>
                        <li><a href="Gallery.html" className="footer-link">Gallery</a></li>
                        <li><a href="../../about code/main/about.html" className="footer-link">About Us</a></li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h3 className="footer-logo">Privacy Policy</h3>
                    <ul>
                        <li><a href="#" className="footer-link">Terms & Conditions</a></li>
                        <li><a href="#" className="footer-link">Articles</a></li>
                        <li><a href="#" className="footer-link">Privacy Policy</a></li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h3 className="footer-logo">Connect</h3>
                    <ul>
                        <li><a href="https://www.instagram.com/vrindopnishad" className="footer-link" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                        <li><a href="https://www.facebook.com/vrindopnishad" className="footer-link" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                        <li><a href="https://www.youtube.com/@vrindopnishad" className="footer-link" target="_blank" rel="noopener noreferrer">YouTube</a></li>
                        <li><a href="https://whatsapp.com/channel/0029Vb6UR3Z9mrGcDXbHzA1Q" className="footer-link" target="_blank" rel="noopener noreferrer">WhatsApp <MessageCircle size={14} style={{ display: 'inline', marginLeft: '4px' }} /></a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2026 Vrindopnishad Collection. All images are property of their respective owners.</p>
            </div>
        </footer>
    );
};

export default Footer;
