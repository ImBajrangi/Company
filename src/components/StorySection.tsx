import React from 'react';

export const StorySection: React.FC = () => {
  return (
    <section id="our-story" className="story-section">
      <div className="story-container staggered-list">
        {/* Left: Image */}
        <div className="story-visual staggered-item">
          <div className="story-image-wrapper">
            <img 
              src="Vrindopnishad%20Web/class/image/KRSHN/optimized/vrindopnishad-story.jpg"
              alt="Vrindopnishad Story" 
              loading="lazy" 
            />
            <div className="story-image-overlay"></div>
          </div>
          <div className="story-year-badge">
            <span className="year-label">SINCE</span>
            <span className="year-num">2026</span>
          </div>
        </div>

        {/* Right: Content */}
        <div className="story-content">
          <span className="story-label">THE JOURNEY</span>
          <h2 className="story-title content__title" data-splitting data-effect6>Our Story</h2>

          <div className="story-blocks">
            <div className="story-block">
              <span className="block-marker">01</span>
              <div className="block-text">
                <h4>The Beginning</h4>
                <p><strong>Vrindopnishad</strong> was born from a simple belief — that the wisdom of our ancestors can thrive in the digital age.</p>
              </div>
            </div>

            <div className="story-block">
              <span className="block-marker">02</span>
              <div className="block-text">
                <h4>The Vision</h4>
                <p>We started as a dream to connect people with authentic experiences through food, art, and sacred journeys.</p>
              </div>
            </div>

            <div className="story-block">
              <span className="block-marker">03</span>
              <div className="block-text">
                <h4>Today</h4>
                <p>From <strong>Foody Vrinda</strong> to <strong>Chitra Vrinda</strong> to <strong>Vrinda Tours</strong> — we're here for every moment that matters.</p>
              </div>
            </div>
          </div>

          <a href="#projects" className="story-cta">
            <span>Explore Our Work</span>
            <span className="cta-arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
