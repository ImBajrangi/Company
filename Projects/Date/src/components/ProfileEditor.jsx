import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Sparkles, Camera, Mic, Edit3, Save, Check, Play, Volume2, Eye, Heart, Target, MapPin, Brain, Plus, Trash2, Award, Activity } from 'lucide-react';
import AnimatedHighlightTag from './AnimatedHighlightTag';
import { cacheManager } from '../utils/cacheManager';
import { AttachmentRadarInfographic, EmotionalResonanceInfographic } from './InfographicVisualizers';

export default function ProfileEditor({ onOpenVerification }) {
  const [profile, setProfile] = useState(() => cacheManager.getUserProfile());
  const [isSaved, setIsSaved] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [newInterest, setNewInterest] = useState('');

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAIBioPolish = () => {
    setIsPolishing(true);
    setTimeout(() => {
      const polishedBios = [
        "Architect & spatial designer exploring Scandinavian brutalism, vinyl cafes, and rooftop sunsets ☕✨. Seeking deep conversations over espresso.",
        "Product designer passionate about minimalist aesthetics, matcha lattes, and spontaneous weekend roadtrips 🌿. Vinyl enthusiast & stargazer.",
        "Curator of cozy moments, indie acoustic playlists, and artisanal coffee spots 🥑. Looking for genuine emotional depth & laughter."
      ];
      const selected = polishedBios[Math.floor(Math.random() * polishedBios.length)];
      handleInputChange('bio', selected);
      setIsPolishing(false);
    }, 800);
  };

  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    const updated = Array.from(new Set([...profile.interests, newInterest.trim()]));
    handleInputChange('interests', updated);
    setNewInterest('');
  };

  const handleRemoveInterest = (tagToRemove) => {
    const updated = profile.interests.filter(tag => tag !== tagToRemove);
    handleInputChange('interests', updated);
  };

  const handleSave = () => {
    cacheManager.saveUserProfile(profile);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleToggleAudio = () => {
    setIsPlayingAudio(prev => !prev);
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(392.00, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-8 animate-fadeIn pb-20 text-left">
      
      {/* Top Banner Header - Sleek Bento Profile Dashboard */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200/80 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Left Column: Avatar & Profile Info */}
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-[#E74F9C] shadow-md flex-shrink-0">
              <img
                src={profile.photos[activePhotoIndex] || profile.photos[0]}
                alt={`Photo of ${profile.name}`}
                className="w-full h-full object-cover"
              />
              {profile.verified && (
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white shadow-xs" title="Verified Photo Shield">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{profile.name}, {profile.age}</h1>
                {profile.verified && (
                  <AnimatedHighlightTag text="3D Verified" icon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />} accent="emerald" />
                )}
              </div>

              <p className="text-xs sm:text-sm font-extrabold text-[#c01868] flex items-center gap-2 flex-wrap">
                <span>{profile.occupation || "Product Designer & Strategist"}</span>
                <span>•</span>
                <span className="text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#c01868]" aria-hidden="true" />
                  <span>Downtown, 3 miles away</span>
                </span>
              </p>

              <div className="flex flex-wrap gap-2 pt-0.5">
                <AnimatedHighlightTag text={`Archetype: ${profile.attachmentStyle}`} icon={<Brain className="w-3.5 h-3.5 text-purple-600" aria-hidden="true" />} accent="purple" />
                <AnimatedHighlightTag text={`Intent: ${profile.intent}`} icon={<Target className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />} accent="pink" />
              </div>
            </div>
          </div>

          {/* Right Column: Quick Action Save Button */}
          <button
            onClick={handleSave}
            aria-label="Save and publish profile changes"
            className={`w-full md:w-auto px-7 py-3 rounded-full font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-sm focus:outline-none ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-[#E74F9C] hover:bg-[#d43f8a] text-white shadow-[#E74F9C]/25'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4" aria-hidden="true" /> : <Save className="w-4 h-4" aria-hidden="true" />}
            <span>{isSaved ? 'Changes Saved!' : 'Save & Publish Profile'}</span>
          </button>

        </div>

        {/* Account Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-center">
          <div className="p-3 rounded-2xl bg-rose-50/60 border border-rose-100">
            <span className="text-[11px] text-slate-600 font-bold block uppercase tracking-wider">Active Matches</span>
            <span className="text-lg font-black text-[#c01868]">14 Souls</span>
          </div>
          <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
            <span className="text-[11px] text-slate-600 font-bold block uppercase tracking-wider">Date Proposals</span>
            <span className="text-lg font-black text-purple-900">3 Open</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
            <span className="text-[11px] text-slate-600 font-bold block uppercase tracking-wider">Joined Circles</span>
            <span className="text-lg font-black text-amber-900">2 Groups</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-[11px] text-slate-600 font-bold block uppercase tracking-wider">3D Liveness</span>
            <span className="text-lg font-black text-emerald-950">100% Verified</span>
          </div>
        </div>
      </div>

      {/* 2. GRID SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: PSYCHOLOGICAL RADAR, AUDIO STUDIO, PROMPTS (Spans 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section A: Psychological Compatibility Radar Graphic Component */}
          <AttachmentRadarInfographic score={96} dimensions={{ secure: 94, voice: 92, growth: 88, spontaneity: 95 }} />

          {/* Section B: Emotional Spectrum Diagnostic Infographic */}
          <EmotionalResonanceInfographic />

          {/* Section C: Voice Intro Studio with Graphic Audio Waveform */}
          <div className="glass-card rounded-[32px] p-6 sm:p-7 border border-slate-200 bg-white space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#c01868]" aria-hidden="true" />
                <span>Voice Intro Studio</span>
              </h2>
              <AnimatedHighlightTag text="Authentic Voice Verified" icon={<Volume2 className="w-3.5 h-3.5 text-purple-600" aria-hidden="true" />} accent="purple" />
            </div>

            {/* Graphic Waveform Visualizer Player */}
            <button
              type="button"
              onClick={handleToggleAudio}
              aria-label={isPlayingAudio ? "Stop audio preview" : "Listen to audio preview intro"}
              className="w-full p-4.5 rounded-2xl bg-rose-50/60 border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:bg-rose-100/60 transition-all shadow-xs text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                  isPlayingAudio ? 'bg-[#c01868] text-white shadow-md scale-105' : 'bg-rose-200/80 text-[#c01868]'
                }`}>
                  <Volume2 className="w-5.5 h-5.5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">Current Voice Intro (0:14)</p>
                  <p className="text-xs text-slate-700 font-semibold">{profile.audioIntro}</p>
                </div>
              </div>

              {/* Graphic Sound Wave Bars */}
              <div className="flex items-center gap-1 h-6 px-3 py-1 rounded-full bg-white/80 border border-rose-200">
                {[40, 75, 50, 90, 60, 100, 45, 80, 55, 95, 35].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: isPlayingAudio ? `${h}%` : '35%' }}
                    className={`w-1 rounded-full transition-all duration-200 ${
                      isPlayingAudio ? 'bg-[#c01868] animate-pulse' : 'bg-rose-300'
                    }`}
                  />
                ))}
              </div>

              <span className="text-xs text-[#c01868] font-black flex items-center gap-1 flex-shrink-0">
                <span>{isPlayingAudio ? 'Playing...' : 'Listen'}</span>
              </span>
            </button>

            <button
              onClick={() => alert("Microphone recording feature simulation. Speak a 15-second intro!")}
              className="w-full py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-extrabold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Mic className="w-4 h-4 text-[#c01868]" aria-hidden="true" />
              <span>Record New 15-Sec Voice Intro</span>
            </button>
          </div>

          {/* Section D: Instagram-Style Highlights */}
          <div className="glass-card rounded-[32px] p-6 sm:p-7 border border-slate-200 bg-white space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#c01868]" aria-hidden="true" />
                <span>Story Highlights & Featured Moments</span>
              </h2>
              <button
                onClick={() => alert("✨ Highlight creator simulation! Select saved stories to add to profile.")}
                className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center gap-1 active:scale-95 transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add Highlight</span>
              </button>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {[
                { title: "Coffee Runs", cover: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=150&q=80" },
                { title: "Vinyl Favs", cover: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=150&q=80" },
                { title: "Architect", cover: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80" },
                { title: "Sunsets", cover: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=150&q=80" }
              ].map((hl, idx) => (
                <button
                  key={idx}
                  onClick={() => alert(`Viewing "${hl.title}" Story Highlight`)}
                  aria-label={`View story highlight: ${hl.title}`}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group rounded-full p-1"
                >
                  <div className="w-16 h-16 rounded-full p-0.5 border-2 border-[#E74F9C] group-hover:scale-105 transition-all shadow-xs">
                    <img src={hl.cover} alt="" aria-hidden="true" className="w-full h-full object-cover rounded-full border border-white" />
                  </div>
                  <span className="text-[11px] font-extrabold text-slate-800">{hl.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section E: Life Values & Deep Prompts with Graphic Star Artwork Accents */}
          <div className="glass-card rounded-[32px] p-6 sm:p-7 border border-slate-200 bg-white space-y-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#c01868]" aria-hidden="true" />
                <span>Deep Prompts & Life Values</span>
              </h2>
              <div className="flex items-center gap-1.5">
                <img src="/illustrations/happy-star.png" alt="" aria-hidden="true" className="w-8 h-8 object-contain select-none" />
                <img src="/illustrations/star.png" alt="" aria-hidden="true" className="w-7 h-7 object-contain select-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                { q: "My simple pleasures", a: "Fresh rain on hot asphalt and warm sourdough with sea salt.", bg: "bg-rose-50/50 border-rose-100" },
                { q: "Together we could", a: "Build a miniature greenhouse or plan a spontaneous weekend roadtrip to the coast.", bg: "bg-purple-50/50 border-purple-100" },
                { q: "The key to my heart", a: "Honesty, curiosity, and knowing where to find the best espresso.", bg: "bg-amber-50/50 border-amber-100" }
              ].map((item, idx) => (
                <div key={idx} className={`p-4.5 rounded-2xl border ${item.bg} space-y-1.5 text-xs relative group hover:shadow-xs transition-all`}>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-black uppercase tracking-wider text-[10px] block">{item.q}</span>
                    <span className="text-[#c01868] font-serif text-lg leading-none select-none font-bold">“</span>
                  </div>
                  <p className="text-slate-900 font-extrabold text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: PHOTOS, BIO, INTEREST TAGS (Spans 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section D: Photo Gallery & Liveness Check */}
          <div className="glass-card rounded-[32px] p-6 border border-slate-200 bg-white space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#c01868]" aria-hidden="true" />
                <span>Photos ({profile.photos.length})</span>
              </h2>
              <button
                onClick={onOpenVerification}
                aria-label="Open 3D photo liveness verification check"
                className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-extrabold border border-emerald-200 flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span>3D Checked</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {profile.photos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  aria-label={`Select photo ${idx + 1} as primary photo`}
                  className={`relative h-32 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C] ${
                    activePhotoIndex === idx ? 'border-[#E74F9C] scale-105 shadow' : 'border-slate-200 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={photo} alt={`Profile photo ${idx + 1}`} className="w-full h-full object-cover" />
                  {activePhotoIndex === idx && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#E74F9C] text-white text-[10px] font-extrabold">
                      Primary
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Section E: Bio & AI Polish Generator */}
          <div className="glass-card rounded-[32px] p-6 border border-slate-200 bg-white space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <label htmlFor="user-bio-input" className="text-lg font-extrabold text-slate-900 flex items-center gap-2 cursor-pointer">
                <Edit3 className="w-5 h-5 text-[#c01868]" aria-hidden="true" />
                <span>About Me Bio</span>
              </label>

              <button
                onClick={handleAIBioPolish}
                disabled={isPolishing}
                aria-label="Generate AI bio polish suggestion"
                className="flex items-center gap-1.5 text-xs text-[#c01868] bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full border border-rose-200 font-extrabold active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isPolishing ? 'animate-spin' : ''}`} aria-hidden="true" />
                <span>{isPolishing ? 'Polishing...' : 'AI Magic'}</span>
              </button>
            </div>

            <textarea
              id="user-bio-input"
              rows="3"
              value={profile.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell others about your passions, values, and dream date..."
              className="w-full glass-input p-4 rounded-2xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C] leading-relaxed"
            />
          </div>

          {/* Section F: Core Interests & Passion Tag Chips */}
          <div className="glass-card rounded-[32px] p-6 border border-slate-200 bg-white space-y-4 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#c01868]" aria-hidden="true" />
              <span>Interests & Passions ({profile.interests.length})</span>
            </h2>

            <div className="flex flex-wrap gap-2">
              {profile.interests.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-slate-100 text-slate-900 text-xs font-extrabold border border-slate-200 flex items-center gap-1.5 group"
                >
                  <span>#{tag}</span>
                  <button
                    onClick={() => handleRemoveInterest(tag)}
                    aria-label={`Remove interest tag ${tag}`}
                    className="text-slate-500 hover:text-rose-600 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-500 rounded-full px-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
                placeholder="Add new interest..."
                aria-label="New interest tag input"
                className="flex-1 glass-input px-3.5 py-2 rounded-full text-xs text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
              />
              <button
                onClick={handleAddInterest}
                aria-label="Add new interest tag"
                className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
              >
                Add Tag
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
