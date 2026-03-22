import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const Hero = ({ heroSection, siteConfig }) => {
    const { showNotification } = useNotifications();
    const [currentBg, setCurrentBg] = useState(0);
    
    // Default backgrounds if none provided
    const backgrounds = heroSection && heroSection.backgroundImage 
        ? [heroSection.backgroundImage] 
        : ['https://vrindopnishad.in/Vrindopnishad%20Web/class/image/Home%20Pics/img_sn01.png'];

    const title = heroSection?.title || siteConfig?.siteName || "Chitra Vrinda";
    const description = heroSection?.description || siteConfig?.description || "A carefully curated collection of spiritual photography and sacred artworks.";

    useEffect(() => {
        if (backgrounds.length > 1) {
            const interval = setInterval(() => {
                setCurrentBg(prev => (prev + 1) % backgrounds.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [backgrounds]);

    const handleExplore = () => {
        showNotification('Exploring divine collections...', 'info');
        document.querySelector('.featured-collections')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="hero">
            <div className="hero-content">
                <span className="hero-label">{siteConfig?.tagline || "Curated Gallery"}</span>
                <h1 className="hero-heading">
                    {title.split(':').map((part, index) => (
                        <React.Fragment key={index}>
                            {index === 1 ? <><br /><span className="hero-accent">{part}</span></> : part}
                        </React.Fragment>
                    ))}
                    {!title.includes(':') && title}
                </h1>
                <p className="hero-text">
                    {description}
                </p>
                <button
                    className="ripple-btn orange hero-cta-btn"
                    onClick={handleExplore}
                >
                    <span className="btn-text">
                        Explore Collection
                        <ArrowRight size={18} style={{ marginLeft: '12px' }} />
                    </span>
                </button>
            </div>
            <div className="hero-visual">
                <div className="hero-image-wrapper">
                    <div
                        className="hero-image active"
                        style={{ 
                            backgroundImage: `url(${backgrounds[currentBg]})`, 
                            transition: 'background-image 1s ease-in-out',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover'
                        }}
                    ></div>
                    <div className="hero-image-overlay"></div>
                </div>
                <div className="hero-image-label">
                    <span className="label-category">Featured</span>
                    <span className="label-title">{siteConfig?.siteName || "Sacred Vrindavan"}</span>
                </div>
            </div>
        </section>
    );
};

export default Hero;
