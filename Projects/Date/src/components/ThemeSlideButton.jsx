import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function ThemeSlideButton({ children, onClick, icon: Icon = ArrowRight, className = "" }) {
  return (
    <button onClick={onClick} className={`theme-slide-btn ${className}`}>
      <span>{children}</span>
      <div className="theme-icon-wrapper ml-2">
        <Icon className="w-4 h-4 stroke-[2.5]" />
      </div>
    </button>
  );
}
