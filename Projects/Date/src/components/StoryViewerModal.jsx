import React, { useState, useEffect } from 'react';
import { X, Heart, Send, ShieldCheck, MapPin } from 'lucide-react';

export default function StoryViewerModal({ storiesGroup, isOpen, onClose, onReply }) {
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !storiesGroup) return;
    setActiveStoryIdx(0);
    setProgress(0);
    setIsLiked(false);
  }, [isOpen, storiesGroup]);

  useEffect(() => {
    if (!isOpen || !storiesGroup) return;
    const stories = storiesGroup.stories || [];
    if (stories.length === 0) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (activeStoryIdx < stories.length - 1) {
            setActiveStoryIdx(curr => curr + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2.5; // ~4s auto slide
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isOpen, storiesGroup, activeStoryIdx, onClose]);

  if (!isOpen || !storiesGroup) return null;

  const stories = storiesGroup.stories || [];
  const currentStory = stories[activeStoryIdx] || stories[0];

  const handleNext = () => {
    if (activeStoryIdx < stories.length - 1) {
      setActiveStoryIdx(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (activeStoryIdx > 0) {
      setActiveStoryIdx(prev => prev - 1);
      setProgress(0);
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    if (onReply) onReply(storiesGroup.author, replyText);
    alert(`Reply sent to ${storiesGroup.author}: "${replyText}"`);
    setReplyText('');
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-viewer-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-4 sm:p-6 animate-fadeIn text-left"
    >
      
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close story viewer"
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
      >
        <X className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Main Instagram Story Canvas */}
      <div className="relative w-full max-w-sm sm:max-w-md h-[85vh] max-h-[720px] rounded-[36px] overflow-hidden bg-slate-900 border border-slate-700 shadow-2xl flex flex-col justify-between select-none">
        
        {/* Top Progress Bars */}
        <div className="absolute top-4 left-4 right-4 z-30 flex items-center gap-1.5" role="group" aria-label="Story progress">
          {stories.map((s, idx) => (
            <div key={idx} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width: idx < activeStoryIdx ? '100%' : idx === activeStoryIdx ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Author Header Info */}
        <div className="absolute top-8 left-4 right-4 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#E74F9C] shadow-lg">
              <img src={storiesGroup.avatar} alt={`${storiesGroup.author}'s avatar`} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 id="story-viewer-title" className="text-sm font-extrabold text-white flex items-center gap-1 text-shadow-sm">
                <span>{storiesGroup.author}</span>
                {storiesGroup.verified && <ShieldCheck className="w-4 h-4 text-[#0d9488]" aria-label="Verified Host" />}
              </h2>
              <span className="text-[11px] text-slate-300 font-bold">{currentStory.time || '1h ago'}</span>
            </div>
          </div>
        </div>

        {/* Story Main Image & Content */}
        <div className="relative w-full h-full">
          <img
            src={currentStory.image || storiesGroup.avatar}
            alt={`Story photo ${activeStoryIdx + 1} from ${storiesGroup.author}`}
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient so caption text is 100% crystal clear */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/40"></div>

          {/* High-Contrast Caption Overlay */}
          <div className="absolute bottom-20 left-4 right-4 z-20 space-y-2">
            <div className="p-4 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/20 text-white space-y-1.5 shadow-xl">
              <p className="text-sm font-extrabold leading-relaxed text-white">
                "{currentStory.caption || "Sharing cozy coffee moments! ☕"}"
              </p>
              {currentStory.location && (
                <span className="text-xs text-[#0d9488] font-extrabold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{currentStory.location}</span>
                </span>
              )}
            </div>
          </div>

          {/* Tap Left / Right Overlay Controls */}
          <div className="absolute inset-0 z-10 flex">
            <button type="button" aria-label="Previous story" onClick={handlePrev} className="w-1/3 h-full cursor-pointer border-none bg-transparent focus:outline-none" />
            <button type="button" aria-label="Next story" onClick={handleNext} className="w-2/3 h-full cursor-pointer border-none bg-transparent focus:outline-none" />
          </div>
        </div>

        {/* Bottom Reply Bar */}
        <div className="absolute bottom-4 left-4 right-4 z-30">
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Send reply to ${storiesGroup.author}...`}
              aria-label={`Reply to ${storiesGroup.author}`}
              className="flex-1 px-4 py-3 rounded-full bg-slate-950/80 backdrop-blur-xl border border-white/20 text-xs text-white placeholder-slate-400 font-extrabold focus:outline-none focus:border-[#E74F9C] focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
            />

            <button
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              aria-label={isLiked ? "Unlike story" : "Like story"}
              className={`p-3 rounded-full backdrop-blur-xl border transition-all active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C] ${
                isLiked ? 'bg-[#E74F9C] border-[#E74F9C] text-white' : 'bg-slate-950/80 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} aria-hidden="true" />
            </button>

            <button
              type="submit"
              aria-label="Send reply to story"
              className="p-3 rounded-full bg-[#E74F9C] hover:bg-[#d43f8a] text-white shadow-lg active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E74F9C]"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
