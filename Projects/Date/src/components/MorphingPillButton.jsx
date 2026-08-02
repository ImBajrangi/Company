import React from 'react';
import { Trash2 } from 'lucide-react';

export default function MorphingPillButton({ label = "Delete", onClick, icon: Icon = Trash2, className = "" }) {
  return (
    <button onClick={onClick} className={`morph-pill-btn ${className}`}>
      <Icon className="morph-icon" />
      <span className="morph-label">{label}</span>
    </button>
  );
}
