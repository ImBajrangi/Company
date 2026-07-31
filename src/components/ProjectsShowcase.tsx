import React, { useState } from 'react';
import { ProjectItem } from '../types';

interface ProjectsShowcaseProps {
  projects: ProjectItem[];
  lang: 'english' | 'hindi';
}

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({ projects, lang }) => {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX + 20, y: e.clientY + 20 });
  };

  return (
    <section id="projects" className="showcase-section" onMouseMove={handleMouseMove}>
      <div className="showcase-container">
        <div className="showcase-header text-center">
          <span className="showcase-label fade-up-off">
            {lang === 'english' ? 'OUR ESSENCE' : 'हमारा स्वरूप'}
          </span>
          <h2 className="showcase-title content__title" data-splitting data-effect2>
            Projects
          </h2>
          <p className="showcase-subtitle fade-up-off">
            {lang === 'english' ? 'The Vrinda family of services crafted for you' : 'आपकी सेवा में समर्पित वृंदोपनिषद के मुख्य आयाम'}
          </p>
        </div>

        <div className="showcase-grid staggered-list">
          {projects.map((project, index) => {
            const isFeatured = index === 0;
            const numStr = (index + 1).toString().padStart(2, '0');

            return (
              <a
                key={project.id}
                href={project.link}
                target={project.isExternal ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className={`showcase-card ${isFeatured ? 'showcase-featured' : ''} staggered-item project-item`}
                data-image={project.imageUrl}
                onMouseEnter={() => setHoveredImage(project.imageUrl)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <div className="showcase-image">
                  <img src={project.imageUrl} alt={project.title} loading="lazy" />
                  <div className="showcase-overlay"></div>
                </div>

                <div className="showcase-content">
                  <span className="showcase-num">{numStr}</span>
                  <div className="showcase-info">
                    <span className="showcase-tag">{project.category}</span>
                    <h3 className="project-title">{project.title}</h3>
                    <p>{project.description}</p>
                  </div>
                  <div className="showcase-cta">
                    <span>Explore</span>
                    <span className="cta-icon">→</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {hoveredImage && (
        <div
          className="image-hover"
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            opacity: 1,
            visibility: 'visible',
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
          }}
        >
          <img src={hoveredImage} alt="Preview" />
        </div>
      )}
    </section>
  );
};
