import React from 'react';

/**
 * AnimatedHighlightTag - Pure Highlighter Pen Marker Highlights (NO GRADIENTS, NO BLINKING DOTS)
 */
export default function AnimatedHighlightTag({
  text,
  icon,
  accent = 'pink',
  className = ''
}) {
  const highlights = {
    pink: 'bg-[#ffe4e6] text-[#c01868] border-b-2 border-[#f43f5e]',
    amber: 'bg-[#fef3c7] text-[#78350f] border-b-2 border-[#d97706]',
    emerald: 'bg-[#d1fae5] text-[#064e3b] border-b-2 border-[#10b981]',
    purple: 'bg-[#f3e8ff] text-[#581c87] border-b-2 border-[#a855f7]',
    cyan: 'bg-[#cffafe] text-[#164e63] border-b-2 border-[#06b6d4]',
    rose: 'bg-[#ffe4e6] text-[#9f1239] border-b-2 border-[#e11d48]',
    yellow: 'bg-[#fef08a] text-[#713f12] border-b-2 border-[#eab308]'
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-black tracking-wider uppercase cursor-default select-none ${highlights[accent] || highlights.pink} ${className}`}
    >
      {icon && <span className="text-sm leading-none flex-shrink-0">{icon}</span>}
      <span className="leading-tight">{text}</span>
    </div>
  );
}
