import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        {/* Decorative Elements */}
        <div className="v-hero-decor">
          <span className="v-decor-line"></span>
          <span className="v-decor-dot"></span>
        </div>

        {/* Hero Badge */}
        <div className="hero-badge">
          <span className="badge-dot"></span>
          <span>Digital Sanctuary • Est. 2026</span>
        </div>

        {/* Main Title */}
        <h1 className="hero-title">
          <div className="title-row">
            <span className="title-small">Welcome to</span>
          </div>
          <div className="title-row">
            <span className="title-main content__title" data-splitting data-effect1>Vrindopnishad</span>
          </div>
        </h1>

        {/* Tagline */}
        <div className="hero-tagline">
          <p>Where <strong>ancient wisdom</strong> meets <strong>modern innovation</strong></p>
        </div>

        {/* Description */}
        <div className="hero-description fade-up-off">
          <p>We craft digital experiences that connect food, art, travel, and spirituality under one purpose — serving you better.</p>
        </div>

        {/* CTA Group */}
        <div className="hero-cta-group">
          <a href="#our-story" className="hero-btn hero-btn-primary">
            <span>Discover Our Story</span>
            <span className="btn-arrow">→</span>
          </a>
          <a href="#projects" className="hero-btn hero-btn-secondary">
            <span>View Projects</span>
          </a>
        </div>

        {/* Stats Strip */}
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">4+</span>
            <span className="stat-text">Projects</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-num">∞</span>
            <span className="stat-text">Creativity</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-num">1</span>
            <span className="stat-text">Mission</span>
          </div>
        </div>
      </div>
    </section>
  );
};
