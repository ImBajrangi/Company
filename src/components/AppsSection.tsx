import React from 'react';

export const AppsSection: React.FC = () => {
  return (
    <section id="download-apps" className="apps-section">
      <div className="apps-container">
        <div className="apps-header">
          <span className="apps-label fade-up-off">DOWNLOAD</span>
          <h2 className="apps-title content__title" data-splitting data-effect6>Get Apps</h2>
        </div>

        <div className="apps-bento staggered-list">
          <a
            href="Projects/VrindopnishadApps/foodyVrindaApp/foodyVrinda.apk"
            className="apps-card apps-featured staggered-item"
            download
          >
            <div className="apps-tag">★ FEATURED</div>
            <div className="apps-icon">
              <img
                src="Vrindopnishad%20Web/class/logo/foodyVrinda-logo.svg"
                alt="Foody Vrinda"
                loading="lazy"
              />
            </div>
            <div className="apps-info">
              <h3>Foody Vrinda</h3>
              <p>Cloud kitchen • Food ordering & delivery</p>
            </div>
            <div className="apps-meta">
              <span className="apps-platform">Android</span>
              <span className="apps-size">73 MB</span>
            </div>
            <div className="apps-cta">
              <span>↓ Download APK</span>
            </div>
          </a>

          <a
            href="Projects/VrindopnishadApps/santVaani/vrindopnishad.apk"
            className="apps-card staggered-item"
            download
          >
            <div className="apps-icon">
              <img
                src="Vrindopnishad%20Web/class/v-logo-rounded/official-logo.svg"
                alt="Vrindopnishad App"
                loading="lazy"
              />
            </div>
            <div className="apps-info">
              <h3>Vrindopnishad App</h3>
              <p>Spiritual scriptures & mantras</p>
            </div>
            <div className="apps-meta">
              <span className="apps-platform">Android</span>
              <span className="apps-size">55 MB</span>
            </div>
            <div className="apps-cta"><span>↓</span></div>
          </a>

          <a href="Projects/Vrinda-Tours/vrinda-tours.html" className="apps-card staggered-item">
            <div className="apps-icon">
              <img
                src="Vrindopnishad%20Web/class/logo/vrindaTours-logo.svg"
                alt="Vrinda Tours"
                loading="lazy"
              />
            </div>
            <div className="apps-info">
              <h3>Vrinda Tours</h3>
              <p>Pilgrimage map & guide</p>
            </div>
            <div className="apps-meta">
              <span className="apps-platform apps-web">Web</span>
            </div>
            <div className="apps-cta"><span>→</span></div>
          </a>

          <a href="Vrindopnishad%20Web/Pictures/main/photos.html" className="apps-card staggered-item">
            <div className="apps-icon">
              <img
                src="Vrindopnishad%20Web/class/v-logo-rounded/official-logo.svg"
                alt="Photo Gallery"
                loading="lazy"
              />
            </div>
            <div className="apps-info">
              <h3>Gallery</h3>
              <p>Divine art collection</p>
            </div>
            <div className="apps-meta">
              <span className="apps-platform apps-web">Web</span>
            </div>
            <div className="apps-cta"><span>→</span></div>
          </a>
        </div>
      </div>
    </section>
  );
};
