import React, { useEffect, useState } from 'react';
import { X, Check, Copy } from 'lucide-react';

interface DeveloperGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperGuideModal: React.FC<DeveloperGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedText(code);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const treeNodes = [
    { name: 'hero section', targetId: 'home' },
    { name: 'our story section', targetId: 'our-story' },
    { name: 'projects section', targetId: 'projects' },
    { name: 'services bento section', targetId: 'services' },
    { name: 'apps download section', targetId: 'download-apps' },
    { name: 'footer', targetId: 'contact' },
    { name: 'header', targetId: 'home' }
  ];

  const endpoints = [
    'https://api.vrindopnishad.in/api/collections/featured',
    'https://api.vrindopnishad.in/api/auth/verify',
    'Vrindopnishad%20Web/class/json/books-data.json'
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content developer-guide glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-color)' }}>
          Developer Architecture & Inspection Guide
        </h2>

        <p style={{ color: 'var(--secondary-color)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Interactive document tree nodes & configured backend endpoints for Vrindopnishad ecosystem. Press <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>Ctrl+Shift+D</kbd> to toggle.
        </p>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.8rem' }}>Page Component Tree</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {treeNodes.map(node => (
              <button
                key={node.name}
                className="tree-node btn-secondary"
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
                onClick={() => {
                  onClose();
                  const el = document.getElementById(node.targetId);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
              >
                {node.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.8rem' }}>API Endpoints & Data Feeds</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {endpoints.map(ep => (
              <div
                key={ep}
                className="api-endpoint"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--border-radius-md)',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--glass-border)',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem'
                }}
              >
                <code>{ep}</code>
                <button
                  className="btn-icon"
                  style={{ width: '32px', height: '32px' }}
                  onClick={() => copyCode(ep)}
                  title="Copy snippet"
                >
                  {copiedText === ep ? <Check size={14} className="text-gold" /> : <Copy size={14} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
