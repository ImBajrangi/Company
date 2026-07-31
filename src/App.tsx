import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { StorySection } from './components/StorySection';
import { ProjectsShowcase } from './components/ProjectsShowcase';
import { ValuesSection } from './components/ValuesSection';
import { BentoGrid } from './components/BentoGrid';
import { AppsSection } from './components/AppsSection';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { OfflineOverlay } from './components/OfflineOverlay';
import { NotificationToast } from './components/NotificationToast';
import { ToolsMenuModal } from './components/ToolsMenuModal';
import { DeveloperGuideModal } from './components/DeveloperGuideModal';

const INITIAL_PROJECTS = [
  {
    id: 'foody-vrinda',
    title: 'Foody Vrinda',
    category: 'Cloud Kitchen',
    description: 'Delicious homemade meals delivered fresh to your doorstep',
    imageUrl: 'Vrindopnishad%20Web/Home/main/image/vrinda-projects/optimized/foody_vrinda_hero.jpg',
    link: 'Projects/Cloud-Kitchen/kitchen.html'
  },
  {
    id: 'chitra-vrinda',
    title: 'Chitra Vrinda',
    category: 'Digital Art',
    description: 'Artistic photography & digital creations',
    imageUrl: 'Vrindopnishad%20Web/Home/main/image/vrinda-projects/optimized/chitra_vrinda_hero.jpg',
    link: 'Vrindopnishad%20Web/Pictures/main/Gallery.html'
  },
  {
    id: 'vrinda-tours',
    title: 'Vrinda Tours',
    category: 'Pilgrimage',
    description: 'Sacred journeys to holy destinations',
    imageUrl: 'Vrindopnishad%20Web/Home/main/image/vrinda-projects/optimized/vrinda_tours_hero.jpg',
    link: 'Projects/Vrinda-Tours/vrinda-tours.html'
  }
];

export const App: React.FC = () => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isDevGuideOpen, setIsDevGuideOpen] = useState(false);
  const [lang, setLang] = useState<'english' | 'hindi'>('english');
  const [loadingCount, setLoadingCount] = useState(10);
  const [loadingDone, setLoadingDone] = useState(false);

  useEffect(() => {
    const updateCounter = () => {
      setLoadingCount(prev => {
        if (prev < 100) {
          return prev + 1;
        } else {
          setTimeout(() => setLoadingDone(true), 50);
          return 100;
        }
      });
    };

    const interval = setInterval(updateCounter, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Scroll progress bar */}
      <div className="scroll-progress"></div>

      {/* Preloader counter */}
      {!loadingDone && (
        <div className="loader" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'var(--bg-color)',
          zIndex: 999999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'opacity 0.5s ease',
          opacity: loadingCount === 100 ? 0 : 1
        }}>
          <div className="counter" style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-color)' }}>
            {loadingCount}%
          </div>
        </div>
      )}

      <CustomCursor />
      <OfflineOverlay />
      <NotificationToast />

      <Header
        onOpenTools={() => setIsToolsOpen(true)}
        onOpenDevGuide={() => setIsDevGuideOpen(true)}
        lang={lang}
        onLanguageChange={setLang}
      />

      <main>
        <Hero />
        <StorySection />
        <ProjectsShowcase projects={INITIAL_PROJECTS} lang={lang} />
        <ValuesSection />
        <BentoGrid />
        <AppsSection />
      </main>

      {/* Hover Image Follower Container */}
      <div className="image-hover">
        <img className="hover-image" alt="Preview" />
      </div>

      <Footer
        onOpenDevGuide={() => setIsDevGuideOpen(true)}
        lang={lang}
      />

      <ToolsMenuModal
        isOpen={isToolsOpen}
        onClose={() => setIsToolsOpen(false)}
      />

      <DeveloperGuideModal
        isOpen={isDevGuideOpen}
        onClose={() => setIsDevGuideOpen(false)}
      />
    </div>
  );
};

export default App;
