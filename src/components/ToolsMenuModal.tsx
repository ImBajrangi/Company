import React, { useEffect } from 'react';
import { X, Calendar, Clock, Compass, Utensils, ExternalLink } from 'lucide-react';

interface ToolsMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ToolsMenuModal: React.FC<ToolsMenuModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tools = [
    {
      id: 'panchang',
      title: 'Vedic Panchang',
      description: 'Daily auspicious timings, Tithi & Nakshatra calculator',
      icon: <Calendar size={22} />,
      link: '#',
      bgColor: '#161b22'
    },
    {
      id: 'japa-counter',
      title: 'Naam Japa Counter',
      description: 'Digital mala counter for daily chanting practice',
      icon: <Clock size={22} />,
      link: '#',
      bgColor: '#161b22'
    },
    {
      id: 'brij-yatra-calc',
      title: '84 Kos Route Guide',
      description: 'Interactive pilgrimage calculator for Brij Dham yatra',
      icon: <Compass size={22} />,
      link: 'Projects/Vrinda-Tours/vrinda-tours.html',
      bgColor: '#161b22'
    },
    {
      id: 'satvik-kitchen',
      title: 'Foody Vrinda Menu',
      description: 'Pure Satvik cloud kitchen ordering and meal planner',
      icon: <Utensils size={22} />,
      link: 'Projects/Cloud-Kitchen/kitchen.html',
      bgColor: '#161b22'
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content tools-menu active glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Spiritual Utilities</h2>
          <button className="tools-menu-close btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--secondary-color)', marginBottom: '2rem' }}>
          Explore digital tools designed for daily spiritual practice, pilgrimage navigation, and Satvik living.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {tools.map(tool => (
            <a
              key={tool.id}
              href={tool.link}
              onClick={() => {
                if (tool.link === '#') {
                  alert(`${tool.title} is coming soon in the next update!`);
                } else {
                  onClose();
                }
              }}
              className="tool-item glass-panel"
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--border-radius-md)',
                textDecoration: 'none',
                color: 'var(--text-color)',
                display: 'block',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div className="tool-icon" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(229,185,90,0.15)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {tool.icon}
                </div>
                <ExternalLink size={16} style={{ opacity: 0.6 }} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.3rem' }}>{tool.title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--secondary-color)', lineHeight: 1.5 }}>{tool.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
