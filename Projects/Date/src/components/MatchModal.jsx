import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, MessageCircle, X, Coffee, Music, Compass } from 'lucide-react';
import { AttachmentRadarInfographic } from './InfographicVisualizers';
import AnimatedHighlightTag from './AnimatedHighlightTag';

export default function MatchModal({ matchedProfile, userProfile, onClose, onStartChat }) {
  useEffect(() => {
    if (matchedProfile) {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [matchedProfile]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && matchedProfile) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [matchedProfile, onClose]);

  if (!matchedProfile) return null;

  const icebreakers = [
    { icon: Coffee, text: `Hey ${matchedProfile.name}! Coffee or matcha for our first date? ☕` },
    { icon: Music, text: `I saw you like ${matchedProfile.interests?.[0] || 'music'}! What's on your playlist? 🎶` },
    { icon: Compass, text: `Loved your answer to '${matchedProfile.prompts?.[0]?.question || 'Together we could'}'!` }
  ];

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl animate-fadeIn text-left"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] sm:rounded-[40px] border border-slate-100 bg-white text-slate-900 shadow-2xl p-5 sm:p-8 space-y-4 text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close match dialog"
          className="absolute top-4 right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
        </button>

        {/* Header section with artwork & match title */}
        <div className="flex flex-row items-center justify-start gap-4 relative z-10 text-left">
          
          {/* Hero Illustration */}
          <div className="w-24 sm:w-32 h-24 sm:h-32 flex-shrink-0">
            <img
              src="/illustrations/joyful_hug.png"
              alt="Joyful Couple Celebration Match Illustration"
              className="w-full h-full object-contain filter drop-shadow-md select-none transform hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Match Info */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <AnimatedHighlightTag text="IT'S A SOUL MATCH! ✨" icon={<Sparkles className="w-3.5 h-3.5" aria-hidden="true" />} accent="rose" />

            <h2 id="match-modal-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight truncate">
              You & {matchedProfile.name} <span className="font-serif italic font-normal text-[#c01868]">Connected!</span>
            </h2>
            
            <p className="text-slate-700 text-xs sm:text-sm font-semibold leading-relaxed">
              Your compatibility match is <span className="text-[#c01868] font-extrabold text-base sm:text-lg">{matchedProfile.compatibilityScore || 95}%</span>!
            </p>
          </div>

        </div>

        {/* Overlapping Dual Avatars */}
        <div className="flex items-center justify-center relative z-10 my-2">
          <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 sm:border-4 border-[#E74F9C] shadow-lg overflow-hidden -mr-2.5 transform -rotate-6">
            <img
              src={userProfile?.photos?.[0] || userProfile?.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"}
              alt="Your profile picture"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#E74F9C] border-2 border-white flex items-center justify-center text-white shadow-md animate-bounce">
            <Heart className="w-4 h-4 fill-white" aria-hidden="true" />
          </div>

          <div className="relative z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 sm:border-4 border-[#0d9488] shadow-lg overflow-hidden -ml-2.5 transform rotate-6">
            <img
              src={matchedProfile.photos?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
              alt={`${matchedProfile.name}'s profile picture`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* CONCEPTUAL INFOGRAPHIC COMPATIBILITY GAUGE */}
        <AttachmentRadarInfographic score={matchedProfile.compatibilityScore || 95} />

        {/* Icebreaker Prompts */}
        <div className="space-y-1.5 relative z-10">
          <p className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Send Instant Icebreaker:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {icebreakers.slice(0, 2).map((item, idx) => (
              <button
                key={idx}
                onClick={() => onStartChat(matchedProfile, item.text)}
                aria-label={`Send icebreaker message: ${item.text}`}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-[#c01868] hover:to-rose-600 text-xs text-white font-extrabold transition-all duration-200 group text-left shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
              >
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0">
                  <item.icon className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <span className="flex-1 line-clamp-1">{item.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1 relative z-10">
          <button
            onClick={() => onStartChat(matchedProfile)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-gradient-to-r from-[#E74F9C] to-purple-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-[#E74F9C]/25 hover:scale-102 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>Open Direct Chat</span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 hover:text-slate-950 font-extrabold text-xs sm:text-sm transition-all active:scale-95 border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Keep Exploring
          </button>
        </div>

      </div>
    </div>
  );
}
