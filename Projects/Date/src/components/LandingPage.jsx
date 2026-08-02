import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Heart, Sparkles, BrainCircuit, ShieldCheck, ArrowRight, CheckCircle2, MessageCircle, Star, Users, Coffee, Zap, ChevronRight, Play, Volume2, Target, Check, Activity, Smartphone, RotateCcw, Calendar, UserCheck } from 'lucide-react';
import PlusMinusSwitch from './PlusMinusSwitch';
import ThemeSlideButton from './ThemeSlideButton';
import FlySendButton from './FlySendButton';
import MorphingPillButton from './MorphingPillButton';
import HeroCTAButton from './HeroCTAButton';
import { AttachmentRadarInfographic, DateWorkflowInfographic } from './InfographicVisualizers';
import AnimatedHighlightTag from './AnimatedHighlightTag';

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

export default function LandingPage({ onLaunchApp, onStartQuiz }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeRadarTab, setActiveRadarTab] = useState('aria');
  const [faqStates, setFaqStates] = useState({
    0: true,
    1: false,
    2: false,
    3: false
  });

  const handleToggleAudio = () => {
    setIsPlayingAudio(prev => !prev);
    playAudioIntroSound();
  };

  const toggleFaq = (index) => {
    setFaqStates(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const radarData = {
    aria: { name: "Aria Thorne", score: 96, style: "Secure Base", emotional: 96, comm: 98, life: 92 },
    chloe: { name: "Chloe Chen", score: 98, style: "Deep Empathy", emotional: 99, comm: 95, life: 96 },
    elena: { name: "Elena Rostova", score: 94, style: "Analytic / Secure", emotional: 88, comm: 96, life: 95 }
  };

  const radarKeys = ['aria', 'chloe', 'elena'];
  const activeRadarIndex = radarKeys.indexOf(activeRadarTab);
  const radarNavRef = useRef(null);
  const [radarIndicatorStyle, setRadarIndicatorStyle] = useState({ left: 0, width: 0 });

  const updateRadarIndicator = useCallback(() => {
    if (radarNavRef.current) {
      const activeBtn = radarNavRef.current.children[activeRadarIndex + 1];
      if (activeBtn) {
        setRadarIndicatorStyle({
          left: activeBtn.offsetLeft,
          width: activeBtn.offsetWidth
        });
      }
    }
  }, [activeRadarIndex]);

  useEffect(() => {
    updateRadarIndicator();

    const handleResize = () => {
      updateRadarIndicator();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateRadarIndicator]);

  const activeRadar = radarData[activeRadarTab];

  const faqsList = [
    {
      q: "How does the Attachment Diagnostic Test work?",
      a: "Our 3-question diagnostic measures your emotional depth, communication preference, and lifestyle harmony to calculate your psychological archetype (Secure Base, Deep Empathy, Analytic)."
    },
    {
      q: "What is 3D Photo Liveness Checking?",
      a: "It uses your camera to analyze facial geometry, awarding a green Verified Shield to prove you are a 100% real human and eliminating bots completely."
    },
    {
      q: "How do 1-Click Coffee & Matcha Invites work?",
      a: "Skip endless texting loops! Click the coffee invite prompt inside chat to send an instant date location proposal to your match."
    },
    {
      q: "Is SoulSync free to use?",
      a: "Yes! SoulSync offers free daily swiping, attachment diagnostic test results, and direct messaging with verified matches."
    }
  ];

  return (
    <div className="w-full space-y-24 pb-28">

      {/* Flat Minimalist Widescreen Hero Section - COLOR MATCHED BG-WHITE */}
      <section className="relative pt-10 sm:pt-16 pb-12 text-center max-w-7xl mx-auto px-4 sm:px-8 bg-white rounded-[40px] shadow-sm border border-slate-100 p-6 sm:p-10">

        <div className="max-w-6xl mx-auto space-y-7">

          {/* Animated Shimmer Highlight Badge */}
          <AnimatedHighlightTag text="AI ATTACHMENT & DEEP COMPATIBILITY" accent="pink" variant="shimmer" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-4">
            <div className="space-y-4 text-left max-w-xl">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.12] text-slate-900">
                Find Love That <br />
                <span className="font-serif italic font-normal text-[#E74F9C]">Resonates</span> Deeply.
              </h1>
              <p className="text-base sm:text-lg text-slate-700 font-semibold leading-relaxed">
                Scientific attachment matching, authentic voices, zero catfishes.
              </p>
            </div>

            {/* Priority Hero Graphic Anchor (100% Transparent PNG - Zero Seams) */}
            <div className="w-72 sm:w-96 h-72 sm:h-96 flex-shrink-0">
              <img
                src="/illustrations/piggyback_couple.png"
                alt="Human Resonance Connection"
                className="w-full h-full object-contain select-none filter drop-shadow-sm"
              />
            </div>
          </div>

          {/* Solid Hyper-Interactive Hero 3D CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">

            <HeroCTAButton onClick={onLaunchApp}>
              Launch App & Explore Stack
            </HeroCTAButton>

            <button
              onClick={onStartQuiz}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-sm border border-slate-300 shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 cubic-bezier(0.34, 1.56, 0.64, 1) flex items-center justify-center gap-2.5"
            >
              <BrainCircuit className="w-4.5 h-4.5 text-[#50D4D5]" />
              <span>Take Attachment Quiz</span>
            </button>

          </div>

          {/* Metric Counters */}
          <div className="grid grid-cols-3 gap-6 pt-10 max-w-lg mx-auto border-t border-slate-200">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">96%</p>
              <p className="text-xs text-slate-600 font-bold mt-0.5">Match Accuracy</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#E74F9C]">100%</p>
              <p className="text-xs text-slate-600 font-bold mt-0.5">Photo Verified</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#50D4D5]">14k+</p>
              <p className="text-xs text-slate-600 font-bold mt-0.5">Coffee Dates</p>
            </div>
          </div>

        </div>

        {/* Widescreen Interactive Demo Container */}
        <div className="mt-14 max-w-6xl mx-auto px-4">
          <div className="glass-card rounded-[36px] p-6 sm:p-8 border border-slate-200 shadow-2xl overflow-hidden relative bg-white/90 backdrop-blur-xl text-left space-y-6">

            <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs font-extrabold text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#E74F9C]"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-amber-400"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-[#50D4D5]"></div>
                <span className="ml-2 text-slate-400 font-mono text-[11px] hidden sm:inline">soulsync://demo.preview</span>
              </div>
              <div className="flex items-center gap-3">
                <MorphingPillButton label="Reset Stack" icon={RotateCcw} onClick={() => {}} />
                <AnimatedHighlightTag text="INTERACTIVE DEMO PREVIEW" icon={<Sparkles className="w-3.5 h-3.5" />} accent="rose" />
              </div>
            </div>

            {/* Mock Widescreen Profile Card Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Full Hero Photo Card */}
              <div className="lg:col-span-7 relative h-96 sm:h-[420px] rounded-3xl overflow-hidden shadow-lg group border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80"
                  alt="Aria Thorne"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 sm:p-8 flex flex-col justify-end text-left text-white">
                  <div className="flex items-center gap-2.5 mb-1">
                    <h3 className="text-2xl sm:text-3xl font-extrabold">Aria Thorne, 24</h3>
                    <ShieldCheck className="w-6 h-6 text-[#50D4D5] fill-[#50D4D5]/20 flex-shrink-0" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 mb-3 font-semibold">Architect & Spatial Designer • 3 miles away</p>
                  
                  {/* High-Impact Badge Container */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <AnimatedHighlightTag text="✨ 96% OVERALL MATCH" accent="rose" />
                    
                    {/* Fixed-Size Illustration Sticker Badge */}
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-rose-200 text-slate-900 text-xs font-black shadow-sm flex items-center gap-1.5 select-none">
                      <img 
                        src="/illustrations/happy-star.png" 
                        alt="Secure Base" 
                        className="w-5 h-5 max-w-[20px] max-h-[20px] object-contain mix-blend-multiply select-none flex-shrink-0" 
                        style={{ width: '20px', height: '20px' }}
                      />
                      <span className="text-[#c01868] uppercase tracking-wide text-[11px] font-black">SECURE BASE</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed font-medium">
                    "Obsessed with Scandinavian brutalism, rooftop sunsets, and discovering cozy indie vinyl cafes over espresso."
                  </p>
                </div>

                {/* Hover Action Layer */}
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                  <ThemeSlideButton onClick={onLaunchApp} icon={ChevronRight}>
                    Start Swiping Now
                  </ThemeSlideButton>
                </div>
              </div>

              {/* Right Column: Interactive Diagnostic Breakdown */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-3xl bg-rose-50/60 border border-rose-200/80 space-y-3">
                  <div className="flex items-center justify-between border-b border-rose-200/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">✨</span>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#c01868]">Live Match Vectors</h4>
                    </div>
                    <span className="text-xs font-black text-rose-600">High Harmony</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-rose-100 shadow-2xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src="/illustrations/happy-star.png" alt="" className="w-5 h-5 object-contain mix-blend-multiply flex-shrink-0" style={{ width: '20px', height: '20px' }} />
                        <span className="font-extrabold text-slate-900 truncate">Secure Attachment</span>
                      </div>
                      <span className="font-black text-[#c01868]">96%</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-purple-100 shadow-2xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src="/illustrations/star-face.png" alt="" className="w-5 h-5 object-contain mix-blend-multiply flex-shrink-0" style={{ width: '20px', height: '20px' }} />
                        <span className="font-extrabold text-slate-900 truncate">Vocal Authenticity</span>
                      </div>
                      <span className="font-black text-purple-900">92%</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-100 shadow-2xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src="/illustrations/book-man.png" alt="" className="w-5 h-5 object-contain flex-shrink-0 rounded-md" style={{ width: '20px', height: '20px' }} />
                        <span className="font-extrabold text-slate-900 truncate">Intellectual Interest</span>
                      </div>
                      <span className="font-black text-amber-900">88%</span>
                    </div>
                  </div>

                  <button
                    onClick={onLaunchApp}
                    className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all mt-2"
                  >
                    <span>Launch Full App Experience</span>
                    <ChevronRight className="w-4 h-4 text-[#E74F9C]" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* Kaggle-Inspired Graphic Layout: 'Who's on SoulSync?' Audience & Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10 text-left">
        
        <div className="space-y-2">
          <AnimatedHighlightTag text="COMMUNITY SEGMENTS" accent="rose" variant="shimmer" />
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Who's on <span className="font-serif italic font-normal text-[#c01868]">SoulSync?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Deep Connection Seekers */}
          <div className="bento-card rounded-[32px] p-6 sm:p-7 space-y-6 bg-white border border-slate-200 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="space-y-5">
              
              {/* Rich Graphic Illustration Hero Banner with Doodle Sticker Accent */}
              <div className="relative w-full h-48 rounded-2xl bg-gradient-to-br from-rose-50 via-pink-100/60 to-rose-100/40 p-4 flex items-center justify-center border border-rose-100/80 overflow-hidden shadow-inner">
                {/* Floating Hand-Drawn Doodle Sticker */}
                <img
                  src="/illustrations/doodle_hearts.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute top-2 left-3 w-10 h-10 object-contain opacity-75 select-none pointer-events-none"
                />
                <img
                  src="/illustrations/romantic_embrace_blue.png"
                  alt="Deep Connection Couple Illustration"
                  className="w-full h-full object-contain filter drop-shadow-md select-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Deep Connection</h3>
                  <AnimatedHighlightTag text="96% Match Rate" accent="rose" />
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                  Depth over surface. Pair on attachment chemistry, values, and genuine resonance.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-700 block">KEY FEATURES</span>
              <ul className="space-y-2.5 text-xs sm:text-sm font-extrabold text-slate-900">
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-200 text-[#c01868] flex items-center justify-center flex-shrink-0">
                    <BrainCircuit className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span>Attachment Diagnostic Quiz</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-200 text-[#c01868] flex items-center justify-center flex-shrink-0">
                    <Volume2 className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span>15-Sec Audio Voice Intro Snippets</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-200 text-[#c01868] flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span>Multi-Vector Compatibility Radar</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 2: Real-World Date Planners */}
          <div className="bento-card rounded-[32px] p-6 sm:p-7 space-y-6 bg-white border border-slate-200 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="space-y-5">
              
              {/* Rich Graphic Illustration Hero Banner with Doodle Sticker Accent */}
              <div className="relative w-full h-48 rounded-2xl bg-gradient-to-br from-amber-50 via-amber-100/60 to-orange-100/40 p-4 flex items-center justify-center border border-amber-100/80 overflow-hidden shadow-inner">
                {/* Floating Hand-Drawn Toast Doodle Sticker */}
                <img
                  src="/illustrations/dinner_toast_doodle.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute top-2 left-3 w-10 h-10 object-contain opacity-75 select-none pointer-events-none"
                />
                <img
                  src="/illustrations/romantic_dinner.png"
                  alt="Real-World Date Dinner & Coffee Illustration"
                  className="w-full h-full object-contain filter drop-shadow-md select-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Real-World Dates</h3>
                  <AnimatedHighlightTag text="Instant Invites" accent="amber" />
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                  Screen to table. Skip small-talk loops and meet for real coffee in one tap.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-700 block">KEY FEATURES</span>
              <ul className="space-y-2.5 text-xs sm:text-sm font-extrabold text-slate-900">
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center flex-shrink-0">
                    <Coffee className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span>1-Click Coffee & Matcha Invites</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span>Local Real-World Date Board</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span>Interest-Based Soul Circles</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Authenticity Pioneers */}
          <div className="bento-card rounded-[32px] p-6 sm:p-7 space-y-6 bg-white border border-slate-200 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="space-y-5">
              
              {/* Rich Graphic Illustration Hero Banner with Doodle Sticker Accent */}
              <div className="relative w-full h-48 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-100/60 to-emerald-100/40 p-4 flex items-center justify-center border border-emerald-100/80 overflow-hidden shadow-inner">
                {/* Floating Hand-Drawn Heart Hands Doodle Sticker */}
                <img
                  src="/illustrations/heart_hands.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute top-2 left-3 w-10 h-10 object-contain opacity-75 select-none pointer-events-none"
                />
                <img
                  src="/illustrations/piggyback_couple.png"
                  alt="Authentic Verified Couple Illustration"
                  className="w-full h-full object-contain filter drop-shadow-md select-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">100% Authentic</h3>
                  <AnimatedHighlightTag text="3D Verified Only" accent="emerald" />
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                  Real humans only. 3D geometry verified to ensure zero bots or catfishes.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-700 block">KEY FEATURES</span>
              <ul className="space-y-2.5 text-xs sm:text-sm font-extrabold text-slate-900">
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span>3-Sec 3D Photo Geometry Scan</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span>Verified Host Shield Badge</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span>Private Direct Encryption</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </section>

      {/* Solid Flat Bento Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12 text-center relative">

        {/* Seamless Floating Background Vector Graphic (No Blocks) */}
        <img
          src="/illustrations/wedding_couple.png"
          alt="Wedding Couple Art"
          className="absolute -top-10 left-10 w-64 h-64 object-contain opacity-20 pointer-events-none mix-blend-multiply select-none hidden lg:block"
        />

        <div className="space-y-3 relative z-10">
          <AnimatedHighlightTag text="COMPATIBILITY SUITE" accent="purple" variant="shimmer" />
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Designed For <span className="font-serif italic font-normal text-[#E74F9C]">Real Connections</span>
          </h2>
          <p className="text-slate-700 text-base max-w-xl mx-auto font-semibold">
            Rooted in psychological data, authentic voice intros, and 3D liveness security.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left">

          {/* Tile 1: Attachment Radar Matrix (Spans 8 cols) */}
          <div className="md:col-span-8 bento-card rounded-[32px] p-6 sm:p-8 space-y-6 flex flex-col justify-between">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <AnimatedHighlightTag text="ATTACHMENT RADAR" icon="🧠" accent="rose" variant="neon" />
                <h3 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">
                  Compatibility Diagnostic Matrix
                </h3>
              </div>

              {/* Bouncy Profile Selector Tabs */}
              <div
                ref={radarNavRef}
                className="relative flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 overflow-hidden"
              >
                <div
                  style={{
                    transform: `translateX(${radarIndicatorStyle.left}px)`,
                    width: `${radarIndicatorStyle.width}px`
                  }}
                  className="absolute top-1 bottom-1 left-0 bg-[#E74F9C] rounded-full transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1) shadow-md shadow-[#E74F9C]/30 pointer-events-none"
                />

                {radarKeys.map((key) => {
                  const isActive = activeRadarTab === key;
                  const profileName = radarData[key].name.split(' ')[0];

                  return (
                    <button
                      key={key}
                      onClick={() => setActiveRadarTab(key)}
                      className={`relative z-10 px-4 py-1.5 rounded-full text-xs font-extrabold transition-colors duration-200 active:scale-95 cubic-bezier(0.34, 1.56, 0.64, 1) ${isActive ? 'text-white' : 'text-slate-700 hover:text-slate-950'
                        }`}
                    >
                      {profileName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Metrics Row (Clean Chips - NO BARS) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div className="p-4 rounded-2xl bg-[#FEFEFE] border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-600 font-bold block">Emotional Depth</span>
                  <span className="text-2xl font-extrabold text-[#E74F9C]">{activeRadar.emotional}%</span>
                </div>
                <AnimatedHighlightTag text="High" accent="pink" />
              </div>

              <div className="p-4 rounded-2xl bg-[#FEFEFE] border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-600 font-bold block">Communication</span>
                  <span className="text-2xl font-extrabold text-purple-600">{activeRadar.comm}%</span>
                </div>
                <AnimatedHighlightTag text="Open" accent="purple" />
              </div>

              <div className="p-4 rounded-2xl bg-[#FEFEFE] border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-600 font-bold block">Lifestyle Harmony</span>
                  <span className="text-2xl font-extrabold text-[#06b6d4]">{activeRadar.life}%</span>
                </div>
                <AnimatedHighlightTag text="Aligned" accent="cyan" />
              </div>

            </div>

            {/* CONCEPTUAL INFOGRAPHIC DIAGNOSTIC SUITE */}
            <div className="pt-2">
              <AttachmentRadarInfographic score={activeRadar.score} />
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-700 font-bold">
              <span>Archetype: <b className="text-[#E74F9C] font-extrabold">{activeRadar.style}</b></span>
              <button onClick={onStartQuiz} className="text-[#E74F9C] hover:underline flex items-center gap-1 font-extrabold active:scale-95 transition-transform duration-200 cubic-bezier(0.34, 1.56, 0.64, 1)">
                <span>Take Diagnostic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Tile 2: 3D Photo Liveness Scanner (Spans 4 cols) */}
          <div className="md:col-span-4 bento-card rounded-[32px] p-6 space-y-5 flex flex-col justify-between">

            <div>
              <AnimatedHighlightTag text="AI SAFETY SCANNER" icon="🛡️" accent="emerald" />
              <h3 className="text-xl font-extrabold text-slate-900 mt-2 tracking-tight">
                3D Liveness Verification
              </h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Facial geometry scanning to eradicate fake profiles completely.
              </p>
            </div>

            {/* Rich Photo Liveness Graphic Avatar Card */}
            <div className="relative w-full h-44 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-100/40 to-emerald-100/60 p-4 flex items-center justify-center border border-emerald-100/80 overflow-hidden shadow-inner">
              <div className="relative flex items-center gap-3 bg-white p-3.5 rounded-2xl shadow-md border border-emerald-200 text-left">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-sm flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                    alt="Verified Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    <span className="text-xs font-extrabold text-slate-900">3D Liveness Passed</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 font-bold">100% Real Human</p>
                  <span className="inline-block text-[10px] text-slate-500 font-medium">Geometry ID: #8492-OK</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs text-emerald-900 font-extrabold">
              ✓ 100% Photo Verified Shield
            </div>

          </div>

          {/* Tile 3: Audio Intro Voice Snippets (Spans 6 cols) */}
          <div className="md:col-span-6 bento-card rounded-[32px] p-6 space-y-4">
            <AnimatedHighlightTag text="AUDIO INTRO SNIPPETS" icon="🎙️" accent="purple" variant="neon" />
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Hear Their Voice Before Swiping
            </h3>

            <button
              type="button"
              onClick={handleToggleAudio}
              aria-label={isPlayingAudio ? "Stop Aria's audio intro playback" : "Play Aria's audio intro sample"}
              className="w-full text-left p-4 rounded-2xl bg-[#FEFEFE] border border-slate-200 flex items-center gap-4 cursor-pointer hover:bg-slate-50 active:scale-98 transition-all duration-200 cubic-bezier(0.34, 1.56, 0.64, 1) shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPlayingAudio ? 'bg-[#E74F9C] text-white animate-pulse' : 'bg-rose-50 text-[#c01868]'
                }`}>
                <Volume2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
                  <span>Aria's Audio Intro</span>
                  <span className="text-[#c01868]">{isPlayingAudio ? 'Playing...' : 'Tap to Listen'}</span>
                </div>
                <div className="flex items-center gap-1 mt-2" aria-hidden="true">
                  {[40, 70, 30, 90, 50, 100, 60, 40, 80, 50, 30, 70, 90, 40, 60, 80].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: isPlayingAudio ? `${Math.max(6, Math.min(22, (h * Math.random()) + 4))}px` : '8px' }}
                      className="w-1 rounded-full bg-[#E74F9C] transition-all duration-150"
                    />
                  ))}
                </div>
              </div>
            </button>
          </div>

          {/* Tile 4: Coffee Date Invites with Interactive Paper Plane FlySendButton */}
          <div className="md:col-span-6 bento-card rounded-[32px] p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <AnimatedHighlightTag text="1-CLICK COFFEE INVITES" icon="☕" accent="amber" variant="neon" />
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Seamless Real-World Dates
              </h3>
            </div>

            <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FEFEFE] border border-slate-200 text-xs text-slate-800 font-extrabold shadow-sm">
              <div className="flex items-center gap-2 min-w-0">
                <Coffee className="w-5 h-5 text-[#E74F9C] flex-shrink-0" />
                <span className="truncate">"Hey Aria! Coffee or matcha for our first date at Blue Bottle Cafe? ☕"</span>
              </div>
              <FlySendButton onClick={onLaunchApp} className="py-2.5 px-5">
                Send
              </FlySendButton>
            </div>
          </div>

        </div>

        {/* STEP-BY-STEP INFOGRAPHIC DATE WORKFLOW */}
        <div className="max-w-4xl mx-auto pt-4">
          <DateWorkflowInfographic />
        </div>

      </section>

      {/* Sleek Thin FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8 text-center">
        <div className="space-y-3">
          <AnimatedHighlightTag text="FREQUENTLY ASKED QUESTIONS" accent="cyan" variant="shimmer" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Got Questions? <span className="font-serif italic font-normal text-[#E74F9C]">We Have Answers</span>
          </h2>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 text-left">
          {faqsList.map((faq, idx) => (
            <div
              key={idx}
              className={`bento-card rounded-2xl p-5 bg-white border transition-all duration-300 ${
                faqStates[idx] ? 'border-[#E74F9C] shadow-md' : 'border-slate-200 shadow-sm'
              }`}
            >
              <button
                type="button"
                aria-expanded={faqStates[idx]}
                aria-controls={`faq-answer-${idx}`}
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C] rounded-lg p-1"
              >
                <span className="text-sm sm:text-base font-extrabold text-slate-900">{faq.q}</span>
                <PlusMinusSwitch
                  id={`faq-switch-${idx}`}
                  checked={faqStates[idx]}
                  onChange={() => toggleFaq(idx)}
                />
              </button>

              {faqStates[idx] && (
                <p 
                  id={`faq-answer-${idx}`}
                  className="text-xs sm:text-sm text-slate-700 font-semibold mt-3 pt-3 border-t border-slate-100 leading-relaxed animate-fadeIn"
                >
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Solid Minimal Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 border-t border-slate-200 text-center text-xs text-slate-600 space-y-4 font-bold">
        <div className="flex items-center justify-center gap-2 font-extrabold text-slate-900 text-base">
          <Heart className="w-4 h-4 text-[#E74F9C] fill-[#E74F9C]" />
          <span>SoulSync Date</span>
        </div>
        <p>© 2026 SoulSync Dating Inc. All rights reserved. Hyper-Interactive Hero 3D CTA Edition.</p>
      </footer>

    </div>
  );
}
