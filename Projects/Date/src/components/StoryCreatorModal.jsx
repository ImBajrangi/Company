import React, { useState, useEffect } from 'react';
import { X, Sparkles, Image, MapPin, Send, Camera, Flame } from 'lucide-react';

export default function StoryCreatorModal({ isOpen, onClose, onAddStory }) {
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState('');

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

  const SAMPLE_PHOTOS = [
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!caption.trim() && !imageUrl) return;

    const newStoryItem = {
      image: imageUrl || SAMPLE_PHOTOS[0],
      caption: caption || "Cozy daily moments ✨",
      location: location || "Downtown Cafe",
      time: "Just now"
    };

    if (onAddStory) {
      onAddStory(newStoryItem);
    }
    onClose();
    setCaption('');
    setImageUrl('');
    setLocation('');
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-creator-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn"
    >
      <div className="glass-card w-full max-w-lg rounded-[32px] p-6 sm:p-8 bg-white border border-slate-200 shadow-2xl space-y-6 text-left relative">
        
        {/* Seamless Floating Background Vector Graphic */}
        <img
          src="/illustrations/dancing_hearts.png"
          alt="Dancing hearts decorative background illustration"
          className="absolute -top-8 -right-8 w-48 h-48 object-contain opacity-20 pointer-events-none mix-blend-multiply select-none"
        />

        <div className="flex items-center justify-between border-b border-slate-200 pb-3 relative z-10">
          <div>
            <h2 id="story-creator-title" className="text-xl font-extrabold text-slate-900">Post New Story / Status</h2>
            <p className="text-xs text-slate-600 font-semibold">Share organic moments with compatible matches</p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close story creator modal"
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Caption Input */}
          <div className="space-y-1">
            <label htmlFor="story-caption-input" className="text-xs font-extrabold text-slate-700 block">Status Caption</label>
            <textarea
              id="story-caption-input"
              rows="3"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's on your mind? (e.g. Sipping V60 pour-over & listening to vinyl...)"
              className="w-full glass-input p-3.5 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
            />
          </div>

          {/* Quick Preset Photos */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-700 block">Choose Story Photo</label>
            <div className="grid grid-cols-4 gap-2">
              {SAMPLE_PHOTOS.map((photo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(photo)}
                  aria-label={`Select preset story photo ${idx + 1}`}
                  className={`h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C] ${
                    imageUrl === photo ? 'border-[#E74F9C] scale-105 shadow' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={photo} alt={`Preset option ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label htmlFor="story-location-input" className="text-xs font-extrabold text-slate-700 block">Location Tag</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                id="story-location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Blue Bottle Coffee, West End"
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-2xl text-xs text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#E74F9C] hover:bg-[#d43f8a] text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[#E74F9C]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E74F9C]"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            <span>Publish Story to Live Bar ✨</span>
          </button>

        </form>

      </div>
    </div>
  );
}
