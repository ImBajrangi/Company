import React, { useState, useEffect } from 'react';
import { X, Sliders, ShieldCheck, MapPin, Target, Check, Coffee, Heart, Sparkles, Compass } from 'lucide-react';
import { cacheManager } from '../utils/cacheManager';

export default function FilterDrawer({ isOpen, onClose, onApplyFilters }) {
  const initialFilters = cacheManager.getFilters();
  const [distance, setDistance] = useState(initialFilters.maxDistance || 25);
  const [minAge, setMinAge] = useState(initialFilters.ageRange?.[0] || 21);
  const [maxAge, setMaxAge] = useState(initialFilters.ageRange?.[1] || 35);
  const [verifiedOnly, setVerifiedOnly] = useState(initialFilters.verifiedOnly || false);
  const [intent, setIntent] = useState(initialFilters.intentFilter || "All");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated = {
      maxDistance: distance,
      ageRange: [minAge, maxAge],
      verifiedOnly,
      intentFilter: intent
    };
    cacheManager.saveFilters(updated);
    if (onApplyFilters) onApplyFilters(updated);
    onClose();
  };

  const INTENT_CARDS = [
    {
      id: "All",
      label: "All Relationship Types",
      cover: "/illustrations/piggyback_couple.png",
      icon: Compass
    },
    {
      id: "Long-term Connection",
      label: "Long-term Connection",
      cover: "/illustrations/wedding_couple.png",
      icon: Heart
    },
    {
      id: "Coffee & Dates",
      label: "Coffee & Casual Dates",
      cover: "/illustrations/romantic_dinner.png",
      icon: Coffee
    },
    {
      id: "Deep Connection",
      label: "Deep Psychological Resonance",
      cover: "/illustrations/silhouette_couple.png",
      icon: Sparkles
    }
  ];

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md animate-fadeIn text-left"
    >
      <div className="w-full max-w-md h-full bg-white border-l border-slate-200 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 text-[#c01868] flex items-center justify-center">
                <Sliders className="w-4 h-4" aria-hidden="true" />
              </div>
              <h2 id="filter-drawer-title" className="text-xl font-extrabold text-slate-900">Discovery Preferences</h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close discovery preferences"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Maximum Distance Slider */}
          <div className="space-y-3">
            <label htmlFor="distance-slider" className="flex items-center justify-between text-sm font-extrabold text-slate-900">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#c01868]" aria-hidden="true" />
                <span>Maximum Distance</span>
              </span>
              <span className="text-[#c01868] text-base">{distance} miles</span>
            </label>
            <input
              id="distance-slider"
              type="range"
              min="1"
              max="100"
              value={distance}
              aria-label="Maximum distance in miles"
              aria-valuenow={distance}
              aria-valuemin={1}
              aria-valuemax={100}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full accent-[#E74F9C] bg-slate-200 rounded-lg h-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
            />
          </div>

          {/* Age Range Sliders */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-extrabold text-slate-900">
              <span>Age Preference</span>
              <span className="text-[#c01868] text-base">{minAge} - {maxAge} years</span>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label htmlFor="min-age-slider" className="text-[10px] text-slate-700 uppercase font-extrabold block mb-1">Min Age</label>
                <input
                  id="min-age-slider"
                  type="range"
                  min="18"
                  max="50"
                  value={minAge}
                  aria-label="Minimum age preference"
                  aria-valuenow={minAge}
                  aria-valuemin={18}
                  aria-valuemax={50}
                  onChange={(e) => setMinAge(Math.min(Number(e.target.value), maxAge - 1))}
                  className="w-full accent-[#E74F9C] bg-slate-200 rounded-lg h-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="max-age-slider" className="text-[10px] text-slate-700 uppercase font-extrabold block mb-1">Max Age</label>
                <input
                  id="max-age-slider"
                  type="range"
                  min="20"
                  max="65"
                  value={maxAge}
                  aria-label="Maximum age preference"
                  aria-valuenow={maxAge}
                  aria-valuemin={20}
                  aria-valuemax={65}
                  onChange={(e) => setMaxAge(Math.max(Number(e.target.value), minAge + 1))}
                  className="w-full accent-[#E74F9C] bg-slate-200 rounded-lg h-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
                />
              </div>
            </div>
          </div>

          {/* Verified Profiles Only Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#0d9488]" aria-hidden="true" />
              <div>
                <span id="verified-toggle-label" className="text-sm font-extrabold text-slate-900 block">Verified Profiles Only</span>
                <span className="text-[11px] text-slate-700 font-semibold block">Show only 3D photo-verified members</span>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={verifiedOnly}
              aria-labelledby="verified-toggle-label"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0d9488] ${
                verifiedOnly ? 'bg-[#0d9488]' : 'bg-slate-300'
              }`}
            >
              <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                verifiedOnly ? 'translate-x-5.5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Relationship Intent Graphic Cards */}
          <div className="space-y-3">
            <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Target className="w-4 h-4 text-[#c01868]" aria-hidden="true" />
              <span>Relationship Intent</span>
            </label>

            <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Relationship Intent Options">
              {INTENT_CARDS.map((card) => {
                const isSelected = intent === card.id;
                const IconComponent = card.icon;
                return (
                  <button
                    key={card.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setIntent(card.id)}
                    className={`relative h-24 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C] ${
                      isSelected
                        ? 'border-[#E74F9C] shadow-lg scale-[1.02]'
                        : 'border-slate-200 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={card.cover} alt="" aria-hidden="true" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-2.5 flex flex-col justify-between">
                      <div className="flex justify-end">
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#E74F9C] text-white flex items-center justify-center text-[10px] font-extrabold shadow">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <IconComponent className="w-4 h-4 text-rose-300" aria-hidden="true" />
                        <span className="text-[11px] font-extrabold text-white block leading-tight">{card.label}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Apply Filters CTA */}
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-full bg-[#E74F9C] hover:bg-[#d43f8a] text-white font-extrabold text-sm shadow-xl shadow-[#E74F9C]/30 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E74F9C]"
        >
          Apply Filters
        </button>

      </div>
    </div>
  );
}
