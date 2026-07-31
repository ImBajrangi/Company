import React from 'react';

export const ValuesSection: React.FC = () => {
  return (
    <section className="values-section">
      <div className="values-container">
        <div className="values-header">
          <span className="values-label fade-up-off">OUR PILLARS</span>
          <h2 className="values-title content__title" data-splitting data-effect5>Core Values</h2>
        </div>

        <div className="values-grid staggered-list">
          <div className="value-card value-featured staggered-item">
            <div className="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <div className="value-num">01</div>
            <h3>Innovation</h3>
            <p>We embrace modern technology to create seamless digital experiences. From mobile apps to web platforms, we build solutions that make life easier.</p>
          </div>

          <div className="value-card staggered-item">
            <div className="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div className="value-num">02</div>
            <h3>Tradition</h3>
            <p>Rooted in timeless wisdom of Vrindavan's sacred heritage.</p>
          </div>

          <div className="value-card staggered-item">
            <div className="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="value-num">03</div>
            <h3>Community</h3>
            <p>Every project is designed to bring value to our people.</p>
          </div>

          <div className="value-card value-wide staggered-item">
            <div className="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                <line x1="2" y1="12" x2="22" y2="12"></line>
              </svg>
            </div>
            <div className="value-num">04</div>
            <h3>Spirituality</h3>
            <p>At our core, we're a spiritual endeavor. Everything we create is infused with devotion and a desire to uplift souls on their journey.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
