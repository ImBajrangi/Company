import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Volume2, MapPin, Sparkles, Target, Brain, Coffee, Heart, Camera, Check, Award } from 'lucide-react';
import AnimatedHighlightTag from './AnimatedHighlightTag';
import { AttachmentRadarInfographic } from './InfographicVisualizers';
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

export default function DeepProfileModal({ profile, isOpen, onClose, onMatch, onStartChat }) {
  const [activeTab, setActiveTab] = useState('radar'); // 'radar' | 'prompts' | 'gallery'
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !profile) return null;

  const handleToggleAudio = () => {
    setIsPlayingAudio(prev => !prev);
    playAudioIntroSound();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="deep-profile-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-3xl glass-card rounded-[36px] border border-slate-200 bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between">
        
        {/* Header Photo Banner */}
        <div className="relative h-72 sm:h-80 w-full overflow-hidden">
          <img
            src={profile.photos[activePhotoIdx] || profile.photos[0]}
            alt={`Photo of ${profile.name}`}
            className="w-full h-full object-cover select-none transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end text-left text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="deep-profile-title" className="text-3xl font-extrabold">{profile.name}, {profile.age}</h2>
                  {profile.verified && <ShieldCheck className="w-6 h-6 text-[#0d9488]" aria-label="Verified Profile Shield" />}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-semibold mt-0.5">
                  {profile.occupation} • {formatLocationText(profile.location, profile.distanceKm)}
                </p>
              </div>

              <AnimatedHighlightTag text={`✨ ${profile.compatibilityScore || profile.matchScore || 95}% Match`} accent="rose" />
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={`Close profile modal for ${profile.name}`}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20 active:scale-90 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-center gap-2" role="tablist" aria-label="Profile detail sections">
          {[
            { id: 'radar', label: 'Psychological Radar', icon: Brain },
            { id: 'prompts', label: 'Values & Prompts', icon: Sparkles },
            { id: 'gallery', label: 'Photos & Gallery', icon: Camera }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C] ${
                  isActive ? 'bg-[#E74F9C] text-white shadow-md' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Content Area */}
        <div className="p-6 overflow-y-auto max-h-[45vh] space-y-6 text-left" aria-live="polite">
          
          {activeTab === 'radar' && (
            <div className="space-y-5">
              
              {/* Voice Intro Box */}
              {(profile.audioIntro || profile.audioSnippet) && (
                <button
                  type="button"
                  onClick={handleToggleAudio}
                  aria-label={isPlayingAudio ? "Stop audio preview" : `Play voice intro snippet for ${profile.name}`}
                  className="w-full text-left p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between cursor-pointer hover:bg-rose-100 transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isPlayingAudio ? 'bg-[#E74F9C] text-white animate-pulse' : 'bg-rose-200 text-[#c01868]'
                    }`}>
                      <Volume2 className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">Voice Intro Snippet</p>
                      <p className="text-xs text-slate-700 font-semibold">{profile.audioIntro || profile.audioSnippet}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#c01868] font-extrabold">{isPlayingAudio ? 'Playing...' : 'Listen 🎵'}</span>
                </button>
              )}

              {/* Vector Artwork Banner for Psychological Inspection */}
              <div className="w-full h-44 rounded-2xl bg-gradient-to-r from-slate-50 to-pink-50/60 border border-slate-200/80 p-3 flex items-center justify-between overflow-hidden shadow-xs">
                <div className="space-y-1 max-w-[55%] text-left pl-2">
                  <span className="text-[10px] font-black uppercase text-[#c01868] tracking-wider">Deep Compatibility Analysis</span>
                  <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight">Analyzing Attachment & Values Alignment</h4>
                  <p className="text-[11px] text-slate-600 font-semibold leading-tight hidden sm:block">Scientific attachment matching with 0 catfishes.</p>
                </div>
                <div className="w-36 h-36 flex-shrink-0">
                  <img
                    src="/illustrations/minimal-girl-dog.png"
                    alt="Compatibility Deep Search Vector Illustration"
                    className="w-full h-full object-contain filter drop-shadow-xs select-none"
                  />
                </div>
              </div>

              {/* Psychological Diagnostic breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#c01868]">Psychological Compatibility Radar</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src="/illustrations/happy-star.png" alt="Emotional Depth" className="w-7 h-7 object-contain mix-blend-multiply select-none" />
                        <span className="font-extrabold text-slate-900">Emotional Depth</span>
                      </div>
                      <span className="text-base font-black text-[#c01868]">{profile.radar?.emotional || 95}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#E74F9C] to-rose-500 rounded-full" style={{ width: `${profile.radar?.emotional || 95}%` }} />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src="/illustrations/star-face.png" alt="Communication" className="w-7 h-7 object-contain mix-blend-multiply select-none" />
                        <span className="font-extrabold text-slate-900">Communication</span>
                      </div>
                      <span className="text-base font-black text-purple-900">{profile.radar?.communication || 98}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full" style={{ width: `${profile.radar?.communication || 98}%` }} />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src="/illustrations/smily-star.png" alt="Lifestyle Harmony" className="w-7 h-7 object-contain mix-blend-multiply select-none" />
                        <span className="font-extrabold text-slate-900">Lifestyle Harmony</span>
                      </div>
                      <span className="text-base font-black text-amber-900">{profile.radar?.lifestyle || 92}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-[#E74F9C] rounded-full" style={{ width: `${profile.radar?.lifestyle || 92}%` }} />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src="/illustrations/star.png" alt="Spontaneity" className="w-7 h-7 object-contain mix-blend-multiply select-none" />
                        <span className="font-extrabold text-slate-900">Spontaneity</span>
                      </div>
                      <span className="text-base font-black text-emerald-950">{profile.radar?.spontaneity || 88}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#50D4D5] to-emerald-500 rounded-full" style={{ width: `${profile.radar?.spontaneity || 88}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Statement */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 leading-relaxed font-semibold">
                "{profile.bio}"
              </div>

            </div>
          )}

          {activeTab === 'prompts' && (
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#c01868]">Deep Prompts & Values</h3>
              {(profile.prompts || [
                { question: "My simple pleasures", answer: "Fresh rain on hot asphalt and warm sourdough with sea salt." },
                { question: "Together we could", answer: "Build a miniature greenhouse or plan a spontaneous roadtrip to the coast." }
              ]).map((prompt, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-700 font-extrabold block uppercase tracking-wider">{prompt.question}</span>
                  <p className="text-sm text-slate-900 font-extrabold">{prompt.answer}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#c01868]">Photos ({profile.photos.length})</h3>
              <div className="grid grid-cols-3 gap-3">
                {profile.photos.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    aria-label={`Select photo ${idx + 1} for ${profile.name}`}
                    className={`h-28 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C] ${
                      activePhotoIdx === idx ? 'border-[#E74F9C] scale-105 shadow' : 'border-slate-200'
                    }`}
                  >
                    <img src={photo} alt={`Gallery photo ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={() => onMatch(profile)}
            aria-label={`Send coffee invite to ${profile.name}`}
            className="flex-1 py-3.5 rounded-full bg-[#E74F9C] hover:bg-[#d43f8a] text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E74F9C]"
          >
            <Coffee className="w-4 h-4" aria-hidden="true" />
            <span>Send Coffee Invite ☕</span>
          </button>
        </div>

      </div>
    </div>
  );
}
