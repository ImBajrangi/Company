import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';

export default function HeroCTAButton({ children = "Launch App & Explore Stack", onClick, className = "" }) {
  return (
    <button onClick={onClick} className={`interactive-hero-btn ${className}`}>
      <Heart className="hero-heart-icon" />
      <span>{children}</span>
      <ArrowRight className="hero-arrow-icon" />
    </button>
  );
}
