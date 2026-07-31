import React from 'react';

export const BentoGrid: React.FC = () => {
  return (
    <section id="services" className="bento-section">
      <div className="bento-container">
        <div className="bento-header">
          <span className="bento-label fade-up-off">EXPLORE</span>
          <h2 className="bento-title content__title" data-splitting data-effect10>For You</h2>
        </div>

        <div className="bento-grid staggered-list">
          <a href="Projects/Cloud-Kitchen/kitchen.html" className="bento-card bento-hero staggered-item">
            <div className="bento-number">01</div>
            <div className="bento-content">
              <h3>Order Food</h3>
              <p>Foody Vrinda — Delicious homemade meals delivered fresh</p>
            </div>
            <div className="bento-arrow">→</div>
          </a>

          <a href="Vrindopnishad%20Web/Pictures/main/Gallery.html" className="bento-card staggered-item">
            <div className="bento-number">02</div>
            <div className="bento-content">
              <h3>Gallery</h3>
              <p>Divine art collection</p>
            </div>
            <div className="bento-arrow">→</div>
          </a>

          <a href="Projects/Vrinda-Tours/vrinda-tours.html" className="bento-card staggered-item">
            <div className="bento-number">03</div>
            <div className="bento-content">
              <h3>Vrinda Tours</h3>
              <p>Sacred pilgrimages</p>
            </div>
            <div className="bento-arrow">→</div>
          </a>

          <a href="Vrindopnishad%20Web/sketch/main/new-read-me.html" className="bento-card bento-wide staggered-item">
            <div className="bento-number">04</div>
            <div className="bento-content">
              <h3>Sacred Texts</h3>
              <p>Ancient wisdom and spiritual teachings from timeless traditions</p>
            </div>
            <div className="bento-arrow">→</div>
          </a>

          <a href="Vrindopnishad%20Web/pdf/main/pdf-viewer.html" className="bento-card staggered-item">
            <div className="bento-number">05</div>
            <div className="bento-content">
              <h3>PDF Library</h3>
              <p>Digital resources</p>
            </div>
            <div className="bento-arrow">→</div>
          </a>

          <a href="Projects/Web%20dev/vrinda%20web%20dev.html" className="bento-card staggered-item">
            <div className="bento-number">06</div>
            <div className="bento-content">
              <h3>Web Dev</h3>
              <p>Custom websites</p>
            </div>
            <div className="bento-arrow">→</div>
          </a>
        </div>
      </div>
    </section>
  );
};
