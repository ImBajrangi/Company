import React, { useState, useRef } from 'react';
import { ShieldCheck, Info, Volume2, MapPin, Sparkles, Target, Brain, Heart, X, Star } from 'lucide-react';
import { formatLocationText } from '../utils/formatUtils';

const playAudioIntroSound = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.4);
    });
  } catch (e) {
    console.log('Audio Context Error:', e);
  }
};

export default function ProfileCard({ profile, isTopCard, onSwipeLeft, onSwipeRight, onOpenDetails }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Drag Gesture States
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const nextPhoto = (e) => {
    e.stopPropagation();
    if (photoIndex < profile.photos.length - 1) {
      setPhotoIndex(prev => prev + 1);
    }
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    if (photoIndex > 0) {
      setPhotoIndex(prev => prev - 1);
    }
  };

  const handleToggleAudio = (e) => {
    e.stopPropagation();
    setIsPlayingAudio(prev => !prev);
    playAudioIntroSound();
  };

  // Drag Handlers
  const handleDragStart = (clientX, clientY) => {
    if (!isTopCard) return;
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
  };

  const handleDragMove = (clientX, clientY) => {
    if (!isDragging || !isTopCard) return;
    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleDragEnd = () => {
    if (!isDragging || !isTopCard) return;
    setIsDragging(false);
    if (dragOffset.x > 110) {
      onSwipeRight();
    } else if (dragOffset.x < -110) {
      onSwipeLeft();
    }
    setDragOffset({ x: 0, y: 0 });
  };

  const rotation = dragOffset.x * 0.04;
  const opacity = Math.max(0.6, 1 - Math.abs(dragOffset.x) / 500);

  return (
    <div
      role="article"
      aria-label={`${profile.name}, ${profile.age} - ${profile.occupation}`}
      onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleDragEnd}
      style={{
        transform: isTopCard
          ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0px) rotate(${rotation}deg)`
          : undefined,
        transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease',
        opacity: isTopCard ? opacity : 0.8
      }}
      className={`absolute inset-0 w-full h-full rounded-[36px] overflow-hidden border border-slate-200 shadow-2xl bg-slate-900 gpu-accelerated cursor-grab active:cursor-grabbing select-none ${
        isTopCard ? 'z-10 scale-100' : 'z-0 scale-95 translate-y-4 pointer-events-none'
      }`}
    >
      {/* Background Photo */}
      <img
        src={profile.photos[photoIndex]}
        alt={`${profile.name}, ${profile.age} photo ${photoIndex + 1} of ${profile.photos.length}`}
        className="w-full h-full object-cover pointer-events-none select-none"
      />

      {/* Dynamic Swipe Stamps Overlay during drag */}
      {isDragging && dragOffset.x > 40 && (
        <div className="absolute top-12 left-8 z-30 px-6 py-2 rounded-2xl border-4 border-emerald-400 text-emerald-400 font-extrabold text-2xl tracking-widest uppercase rotate-[-15deg] bg-slate-950/40 backdrop-blur-sm animate-pulse pointer-events-none">
          LIKE ❤️
        </div>
      )}

      {isDragging && dragOffset.x < -40 && (
        <div className="absolute top-12 right-8 z-30 px-6 py-2 rounded-2xl border-4 border-rose-500 text-rose-500 font-extrabold text-2xl tracking-widest uppercase rotate-[15deg] bg-slate-950/40 backdrop-blur-sm animate-pulse pointer-events-none">
          PASS ✖️
        </div>
      )}

      {/* Top Gradient Overlay for Readability */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent p-5 flex items-start justify-between z-20 pointer-events-none">
        
        {/* Photo Navigation Indicators */}
        <div className="flex items-center gap-1.5 flex-1 max-w-xs pointer-events-auto" role="group" aria-label="Photo carousel indicators">
          {profile.photos.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setPhotoIndex(idx);
              }}
              aria-label={`Show photo ${idx + 1} of ${profile.photos.length}`}
              aria-current={idx === photoIndex}
              className={`h-1.5 rounded-full transition-all flex-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                idx === photoIndex ? 'bg-white shadow' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Compatibility Match Badge & Info Trigger */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-3.5 py-1 rounded-full bg-[#E74F9C] text-white text-xs font-extrabold shadow-md flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{profile.compatibilityScore || profile.matchScore || 95}% Match</span>
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails();
            }}
            aria-label={`View full profile details for ${profile.name}`}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center border border-white/20 active:scale-90 transition-transform duration-200 cubic-bezier(0.34, 1.56, 0.64, 1) focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            title="View Full Profile Details"
          >
            <Info className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

      </div>

      {/* Tap Left / Right Navigation Zones */}
      <div className="absolute inset-0 flex z-10">
        <button
          type="button"
          aria-label="Previous photo"
          className="w-1/2 h-2/3 cursor-pointer border-none bg-transparent focus:outline-none"
          onClick={prevPhoto}
        />
        <button
          type="button"
          aria-label="Next photo"
          className="w-1/2 h-2/3 cursor-pointer border-none bg-transparent focus:outline-none"
          onClick={nextPhoto}
        />
      </div>

      {/* Bottom Content Card Info */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent p-6 sm:p-8 flex flex-col justify-end text-left text-white z-20 space-y-3.5 pointer-events-auto">
        
        {/* Profile Name & Age */}
        <div className="flex items-center gap-2.5">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{profile.name}, {profile.age}</h2>
          {profile.verified && (
            <ShieldCheck className="w-7 h-7 text-[#0d9488] fill-[#0d9488]/20 flex-shrink-0" aria-label="Verified Profile Shield" />
          )}
        </div>

        {/* Occupation & Location */}
        <p className="text-sm sm:text-base text-slate-200 font-semibold flex items-center gap-2">
          <span>{profile.occupation}</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-slate-300">
            <MapPin className="w-4 h-4 text-[#E74F9C]" aria-hidden="true" />
            <span>{formatLocationText(profile.location, profile.distanceKm)}</span>
          </span>
        </p>

        {/* Voice Intro Snippet Bar */}
        {(profile.audioIntro || profile.audioSnippet) && (
          <button
            type="button"
            onClick={handleToggleAudio}
            aria-label={isPlayingAudio ? "Stop voice snippet" : `Play voice snippet: ${profile.audioIntro || profile.audioSnippet}`}
            className="w-full p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between cursor-pointer hover:bg-white/20 active:scale-98 transition-all duration-200 cubic-bezier(0.34, 1.56, 0.64, 1) focus:outline-none focus-visible:ring-2 focus-visible:ring-white text-left"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center ${
                isPlayingAudio ? 'bg-[#E74F9C] text-white animate-pulse' : 'bg-white/20 text-white'
              }`}>
                <Volume2 className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-white">Voice Intro Snippet</p>
                <p className="text-[11px] text-slate-300 font-semibold truncate max-w-xs">{profile.audioIntro || profile.audioSnippet}</p>
              </div>
            </div>
            <span className="text-xs text-[#50D4D5] font-extrabold">
              {isPlayingAudio ? 'Playing...' : 'Listen'}
            </span>
          </button>
        )}

        {/* Trait Chips */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3.5 py-1 rounded-full bg-purple-500/30 backdrop-blur-md border border-purple-400/40 text-purple-200 text-xs font-extrabold flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-purple-300" aria-hidden="true" />
            <span>{profile.attachmentStyle}</span>
          </span>
          <span className="px-3.5 py-1 rounded-full bg-rose-500/30 backdrop-blur-md border border-rose-400/40 text-rose-200 text-xs font-extrabold flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-rose-300" aria-hidden="true" />
            <span>{profile.intent}</span>
          </span>
        </div>

        {/* Bio Preview Quote */}
        <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed font-medium">
          "{profile.bio}"
        </p>

        {/* Interactive Reaction Pills for Continuous Engagement */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSwipeRight();
            }}
            aria-label={`Send heart reaction to ${profile.name}`}
            className="px-3 py-1.5 rounded-full bg-rose-500/30 hover:bg-rose-500/50 border border-rose-400/50 text-rose-100 text-xs font-extrabold flex items-center gap-1.5 active:scale-90 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <span>💖 Send Heart</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSwipeRight();
            }}
            aria-label={`Send coffee invite to ${profile.name}`}
            className="px-3 py-1.5 rounded-full bg-amber-500/30 hover:bg-amber-500/50 border border-amber-400/50 text-amber-100 text-xs font-extrabold flex items-center gap-1.5 active:scale-90 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <span>☕ Coffee Invite</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSwipeRight();
            }}
            aria-label={`Spark match with ${profile.name}`}
            className="px-3 py-1.5 rounded-full bg-cyan-500/30 hover:bg-cyan-500/50 border border-cyan-400/50 text-cyan-100 text-xs font-extrabold flex items-center gap-1.5 active:scale-90 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <span>✨ Spark Match</span>
          </button>
        </div>

        {/* Interest Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {profile.interests.map((tag, idx) => (
            <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-white/15 text-slate-100 text-[11px] font-bold">
              #{tag}
            </span>
          ))}
        </div>

      </div>

    </div>
  );
}
