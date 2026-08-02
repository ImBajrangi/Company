import React, { useState, useRef, useEffect, useCallback } from 'react';
import CircleGroupChatModal from './CircleGroupChatModal';
import DateProposalModal from './DateProposalModal';
import InstagramStoriesBar from './InstagramStoriesBar';
import { Sparkles, Users, Coffee, Heart, MessageSquare, ShieldCheck, MapPin, Radio, Clock, Search, Plus, Filter, Volume2, Award, Calendar, ChevronLeft, ChevronRight, CheckCircle2, Bell, Flame, Compass, Zap, Activity, Brain, Camera, Mic, Edit3, ArrowLeft, Target } from 'lucide-react';
import AnimatedHighlightTag from './AnimatedHighlightTag';
import { cacheManager } from '../utils/cacheManager';
import { formatLocationText } from '../utils/formatUtils';

const SOUL_CIRCLES = [
  {
    id: "c1",
    name: "Specialty Coffee & Vinyl Cafe",
    members: 24,
    category: "Lifestyle & Music",
    banner: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    description: "For enthusiasts of V60 pour-overs, Scandinavian cafes, and 90s jazz vinyl records.",
    activeUsers: ["Aria", "Marcus", "Chloe"]
  },
  {
    id: "c2",
    name: "Architecture & Spatial Design",
    members: 18,
    category: "Design & Arts",
    banner: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    description: "Exchanging brutalist design inspiration, museum visits, and rooftop architecture walks.",
    activeUsers: ["Aria", "Julian"]
  },
  {
    id: "c3",
    name: "Natural Wine & Indie Cinema",
    members: 31,
    category: "Film & Dining",
    banner: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
    description: "Screenings of underground festival films paired with biodynamic Pinot Noir.",
    activeUsers: ["Elena", "Julian", "Chloe"]
  },
  {
    id: "c4",
    name: "Bouldering & Trail Explorers",
    members: 22,
    category: "Outdoors & Fitness",
    banner: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80",
    description: "Weekend climbing sessions, mountain sunrise hikes, and post-climb espresso stops.",
    activeUsers: ["Elena", "Marcus"]
  }
];

const INITIAL_DATE_PROPOSALS = [
  {
    id: "d1",
    author: "Aria Thorne",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    title: "Matcha Tasting & Vinyl Shopping",
    location: "Blue Bottle Coffee • Downtown",
    time: "This Saturday, 3:00 PM",
    details: "Looking for someone to grab iced matcha lattes and explore cozy indie vinyl record shops!"
  },
  {
    id: "d2",
    author: "Julian Rivera",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    title: "Underground Indie Film Screening",
    location: "Kino Cinema • West End",
    time: "Friday Evening, 7:30 PM",
    details: "I have an extra ticket to an indie festival premiere. Let's grab sourdough pizza before!"
  },
  {
    id: "d3",
    author: "Elena Rostova",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    title: "Bouldering & Natural Wine",
    location: "Movement Gym & Bar Pinot",
    time: "Sunday Afternoon",
    details: "Casual climbing session followed by a glass of natural wine and science debates 🍷"
  }
];

const NOTIFICATIONS_FEED = [
  { id: 1, text: "Aria Thorne listened to your Voice Intro", time: "5m ago", icon: Volume2, color: "text-[#E74F9C]" },
  { id: 2, text: "Elena Rostova joined your Coffee & Vinyl Circle", time: "15m ago", icon: Users, color: "text-purple-600" },
  { id: 3, text: "Chloe Chen sent you a Coffee Date invite", time: "1h ago", icon: Coffee, color: "text-amber-600" },
  { id: 4, text: "Your Attachment Diagnostic: Secure Base verified", time: "2h ago", icon: ShieldCheck, color: "text-[#50D4D5]" }
];

export default function SwipeStack({ profiles, onMatch, onResetSwipes }) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'circles' | 'activities' | 'notifications'
  const [joinedCircles, setJoinedCircles] = useState(['c1']);
  const [dateProposals, setDateProposals] = useState(INITIAL_DATE_PROPOSALS);
  const [notifications, setNotifications] = useState(NOTIFICATIONS_FEED);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVibeFilter, setActiveVibeFilter] = useState('All');

  // Sub Navigation Tabs with Liquid Sliding Pill Indicator
  const subNavTabs = [
    { id: 'grid', label: 'Soul Grid', icon: Sparkles },
    { id: 'circles', label: 'Soul Circles', icon: Users },
    { id: 'activities', label: 'Date Proposals', icon: Calendar },
    { id: 'notifications', label: 'Live Feed', icon: Bell }
  ];

  const activeSubIndex = subNavTabs.findIndex(t => t.id === viewMode);
  const subNavContainerRef = useRef(null);
  const [subIndicatorStyle, setSubIndicatorStyle] = useState({ left: 0, width: 0 });

  const updateSubIndicator = useCallback(() => {
    if (subNavContainerRef.current) {
      const activeBtn = subNavContainerRef.current.children[activeSubIndex + 1]; // +1 for indicator div
      if (activeBtn) {
        setSubIndicatorStyle({
          left: activeBtn.offsetLeft,
          width: activeBtn.offsetWidth
        });
      }
    }
  }, [activeSubIndex]);

  useEffect(() => {
    updateSubIndicator();
    const handleResize = () => updateSubIndicator();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateSubIndicator]);

  // Showcase Full Page State
  const [selectedShowcaseProfile, setSelectedShowcaseProfile] = useState(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [generatedDateItinerary, setGeneratedDateItinerary] = useState(null);

  // Modals state
  const [activeCircleChat, setActiveCircleChat] = useState(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalToJoin, setProposalToJoin] = useState(null);

  const handleToggleJoinCircle = (circle) => {
    if (!joinedCircles.includes(circle.id)) {
      setJoinedCircles(prev => [...prev, circle.id]);
    }
    setActiveCircleChat(circle);
  };

  const handleAddProposal = (newProposal) => {
    setDateProposals(prev => [newProposal, ...prev]);
  };

  const filteredProfilesList = (profiles || []).filter(p => {
    if (activeVibeFilter !== 'All') {
      const v = activeVibeFilter.toLowerCase();
      const matchesVibe = p.interests.some(i => i.toLowerCase().includes(v)) || p.occupation.toLowerCase().includes(v);
      if (!matchesVibe) return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.occupation.toLowerCase().includes(q) || p.interests.some(i => i.toLowerCase().includes(q));
  });

  const circlesList = SOUL_CIRCLES.filter(c => {
    if (activeVibeFilter !== 'All') {
      const v = activeVibeFilter.toLowerCase();
      const matchesVibe = c.category.toLowerCase().includes(v) || c.name.toLowerCase().includes(v) || c.description.toLowerCase().includes(v);
      if (!matchesVibe) return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
  });


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

  const handleGenerateDateItinerary = () => {
    const dates = [
      {
        step1: "2:00 PM: Scandinavian Pour-Over & Pastries at Blue Bottle",
        step2: "3:30 PM: Indie Vinyl Record Digging at Vintage Groove",
        step3: "6:00 PM: Rooftop Stargazing & Sourdough Pizza"
      },
      {
        step1: "3:00 PM: Modern Brutalist Architecture Walk & Gallery",
        step2: "5:30 PM: Biodynamic Natural Wine Tasting",
        step3: "7:30 PM: Underground Film Screening"
      }
    ];
    const chosen = dates[Math.floor(Math.random() * dates.length)];
    setGeneratedDateItinerary(chosen);
  };

  // IF USER IS VIEWING A SPECIFIC PERSON'S SHOWCASE (FULL-PAGE CANVAS IN SOUL HUB)
  if (selectedShowcaseProfile) {
    const p = selectedShowcaseProfile;
    return (
      <div className="w-full max-w-7xl mx-auto space-y-8 animate-fadeIn pb-20 text-left">
        
        {/* Top Header Bar */}
        <div className="glass-card rounded-[32px] p-4 border border-slate-200 bg-white flex items-center justify-between shadow-sm">
          <button
            onClick={() => {
              setSelectedShowcaseProfile(null);
              setGeneratedDateItinerary(null);
              setActivePhotoIdx(0);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Soul Grid</span>
          </button>

          <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider hidden sm:inline flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E74F9C]" />
            <span>Soul Showcase • {p.name}</span>
          </span>

          <button
            onClick={() => onMatch(p)}
            className="px-6 py-2.5 rounded-full bg-[#E74F9C] hover:bg-[#d43f8a] text-white text-xs font-extrabold shadow-md flex items-center gap-2 active:scale-95 transition-all"
          >
            <Coffee className="w-4 h-4" />
            <span>Invite to Coffee</span>
          </button>
        </div>

        {/* Hero Cover Banner */}
        <div className="relative glass-card rounded-[36px] border border-slate-200 bg-white overflow-hidden shadow-lg p-6 sm:p-8 space-y-6">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-tr from-rose-500/20 via-purple-500/10 to-teal-500/20 blur-3xl pointer-events-none animate-pulse"></div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-[#E74F9C] shadow-xl flex-shrink-0">
                <img
                  src={p.photos[activePhotoIdx] || p.photos[0]}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
                {p.verified && (
                  <div className="absolute bottom-1 right-1 w-6.5 h-6.5 rounded-full bg-[#50D4D5] text-slate-950 flex items-center justify-center border-2 border-white">
                    <ShieldCheck className="w-4 h-4 text-slate-950" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{p.name}, {p.age}</h1>
                  {p.verified && (
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-extrabold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <p className="text-sm font-extrabold text-[#E74F9C] flex items-center gap-2 flex-wrap">
                  <span>{p.occupation}</span>
                  <span>•</span>
                  <span className="text-slate-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-[#E74F9C]" />
                    <span>{formatLocationText(p.location, p.distanceKm)}</span>
                  </span>
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200/90 text-slate-900 text-xs font-black shadow-xs flex items-center gap-1.5 select-none">
                    <img src="/illustrations/happy-star.png" alt="Archetype" className="w-4 h-4 object-contain mix-blend-multiply select-none" />
                    <span className="text-[#c01868] font-extrabold">{p.attachmentStyle}</span>
                  </span>
                  <AnimatedHighlightTag text={`Intent: ${p.intent}`} icon={<Target className="w-3 h-3" />} accent="rose" />
                </div>
              </div>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50/80 border border-rose-200/90 text-center flex-shrink-0 shadow-xs">
              <span className="text-xs text-[#E74F9C] font-extrabold block flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-[#E74F9C]" />
                <span>Compatibility Match</span>
              </span>
              <span className="text-3xl font-extrabold text-slate-900">{p.compatibilityScore || p.matchScore || 96}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-left relative z-10">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50/90 to-pink-50/50 border border-rose-200/60 shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#c01868] block">Emotional Depth</span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-slate-900">{p.radar?.emotional || 95}%</span>
                <div className="w-12 h-1.5 rounded-full bg-rose-100 overflow-hidden">
                  <div className="h-full rounded-full bg-[#E74F9C]" style={{ width: `${p.radar?.emotional || 95}%` }}></div>
                </div>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50/90 to-indigo-50/50 border border-purple-200/60 shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 block">Communication</span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-slate-900">{p.radar?.communication || 98}%</span>
                <div className="w-12 h-1.5 rounded-full bg-purple-100 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-600" style={{ width: `${p.radar?.communication || 98}%` }}></div>
                </div>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/90 to-yellow-50/50 border border-amber-200/60 shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">Lifestyle Harmony</span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-slate-900">{p.radar?.lifestyle || 92}%</span>
                <div className="w-12 h-1.5 rounded-full bg-amber-100 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${p.radar?.lifestyle || 92}%` }}></div>
                </div>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-teal-50/50 border border-emerald-200/60 shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-950 block">Spontaneity</span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-slate-900">{p.radar?.spontaneity || 88}%</span>
                <div className="w-12 h-1.5 rounded-full bg-emerald-100 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${p.radar?.spontaneity || 88}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ideal Date Itinerary Generator Card */}
        <div className="glass-card rounded-[32px] p-6 border border-slate-200 bg-gradient-to-r from-rose-50/70 via-purple-50/50 to-teal-50/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#E74F9C]" />
              <h3 className="text-lg font-extrabold text-slate-900">Shared Ideal 1st Date Itinerary Generator</h3>
            </div>

            <button
              onClick={handleGenerateDateItinerary}
              className="px-5 py-2 rounded-full bg-[#E74F9C] hover:bg-[#d43f8a] text-white text-xs font-extrabold flex items-center gap-1.5 active:scale-95 transition-all shadow"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Date Plan</span>
            </button>
          </div>

          {generatedDateItinerary && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs font-extrabold text-slate-800 animate-fadeIn">
              <p className="text-[#E74F9C] uppercase tracking-wider text-[11px] block flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#E74F9C]" />
                <span>AI Tailored Itinerary for You & {p.name}:</span>
              </p>
              <div className="space-y-2 text-slate-900 text-sm font-semibold pt-1">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-[#E74F9C]" />
                  <span>{generatedDateItinerary.step1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-purple-600" />
                  <span>{generatedDateItinerary.step2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{generatedDateItinerary.step3}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2-Column Grid Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Love Languages Visual Card */}
            <div className="glass-card rounded-[32px] p-6 sm:p-7 border border-slate-200 bg-white space-y-4 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
                  <span>What Makes Me Feel Loved ❤️</span>
                </h3>
                <span className="px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black shadow-2xs">
                  #1 Quality Time
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/80 to-pink-50/40 border border-rose-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold text-rose-950">
                    <span className="flex items-center gap-2 text-sm">
                      <span>☕</span>
                      <span>Quality Time</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white text-rose-600 font-black text-xs shadow-2xs">35%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-rose-200/70 overflow-hidden">
                    <div className="h-full rounded-full bg-rose-500" style={{ width: '35%' }}></div>
                  </div>
                  <p className="text-[11px] text-slate-600 font-semibold">Cafe walks, coffee dates & cozy hangs</p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/80 to-indigo-50/40 border border-purple-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold text-purple-950">
                    <span className="flex items-center gap-2 text-sm">
                      <span>💬</span>
                      <span>Kind Words</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white text-purple-600 font-black text-xs shadow-2xs">25%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-purple-200/70 overflow-hidden">
                    <div className="h-full rounded-full bg-purple-500" style={{ width: '25%' }}></div>
                  </div>
                  <p className="text-[11px] text-slate-600 font-semibold">Deep conversations & compliments</p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 to-yellow-50/40 border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold text-amber-950">
                    <span className="flex items-center gap-2 text-sm">
                      <span>✨</span>
                      <span>Helping Out</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white text-amber-600 font-black text-xs shadow-2xs">20%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-amber-200/70 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: '20%' }}></div>
                  </div>
                  <p className="text-[11px] text-slate-600 font-semibold">Cooking together & market runs</p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/40 border border-emerald-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold text-emerald-950">
                    <span className="flex items-center gap-2 text-sm">
                      <span>🎁</span>
                      <span>Little Surprises</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white text-emerald-600 font-black text-xs shadow-2xs">20%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-emerald-200/70 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: '20%' }}></div>
                  </div>
                  <p className="text-[11px] text-slate-600 font-semibold">Cute gifts, playlists & art prints</p>
                </div>
              </div>
            </div>

            {/* Voice Intro Player Visual */}
            <div className="glass-card rounded-[32px] p-6 sm:p-7 border border-slate-200 bg-white space-y-4 shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#E74F9C]" />
                <span>Listen to My Voice 🎙️</span>
              </h3>

              <div
                onClick={handleToggleAudio}
                className="p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-purple-50 to-pink-50 border border-rose-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md flex-shrink-0 transition-transform active:scale-95 ${
                    isPlayingAudio ? 'bg-[#E74F9C] text-white animate-pulse' : 'bg-slate-900 text-white group-hover:scale-105'
                  }`}>
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-wider">Voice Snippet</p>
                    <p className="text-xs text-slate-700 font-semibold mt-0.5">"{p.audioIntro || p.audioSnippet || "Hey! If you can guess my favorite 90s jazz album, coffee is on me ☕✨"}"</p>
                  </div>
                </div>

                {/* Animated Audio Equalizer Waveform */}
                <div className="flex items-center gap-1.5 h-9 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-xs flex-shrink-0">
                  {[40, 75, 100, 60, 90, 45, 80, 50, 95, 65, 35].map((h, i) => (
                    <span
                      key={i}
                      className={`w-1.5 rounded-full transition-all duration-300 ${isPlayingAudio ? 'bg-[#E74F9C] animate-pulse' : 'bg-slate-300'}`}
                      style={{ height: isPlayingAudio ? `${Math.floor(Math.random() * 20 + 8)}px` : `${h}%` }}
                    />
                  ))}
                  <span className="text-[11px] font-black text-[#E74F9C] ml-1">
                    {isPlayingAudio ? 'Playing...' : 'Play'}
                  </span>
                </div>
              </div>
            </div>

            {/* Fun Questions & Answers */}
            <div className="glass-card rounded-[32px] p-6 sm:p-7 border border-slate-200 bg-white space-y-4 shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Fun Questions & Answers ✨</span>
              </h3>

              <div className="space-y-3">
                {(p.prompts || [
                  { question: "My simple pleasures", answer: "Fresh rain on hot asphalt and warm sourdough with sea salt." },
                  { question: "Together we could", answer: "Build a miniature greenhouse or plan a spontaneous weekend roadtrip to the coast." }
                ]).map((item, idx) => (
                  <div key={idx} className="p-4.5 rounded-2xl bg-gradient-to-br from-slate-50 to-rose-50/40 border border-slate-200/90 text-xs space-y-1.5 shadow-2xs">
                    <span className="text-[#c01868] font-extrabold text-xs flex items-center gap-1.5">
                      <span>💡</span>
                      <span>{item.question || item.q}</span>
                    </span>
                    <p className="text-slate-900 font-extrabold text-sm leading-relaxed">{item.answer || item.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Photo Gallery */}
            <div className="glass-card rounded-[32px] p-6 border border-slate-200 bg-white space-y-4 shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#E74F9C]" />
                <span>Photos ({p.photos.length})</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {p.photos.map((photo, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative h-32 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                      activePhotoIdx === idx ? 'border-[#E74F9C] scale-105 shadow-md ring-2 ring-[#E74F9C]/30' : 'border-slate-200 opacity-85 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="glass-card rounded-[32px] p-6 border border-slate-200 bg-white space-y-4 shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#E74F9C]" />
                <span>About Me 💬</span>
              </h3>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50/20 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">
                "{p.bio}"
              </div>
            </div>

            {/* Core Interests */}
            <div className="glass-card rounded-[32px] p-6 border border-slate-200 bg-white space-y-4 shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#E74F9C]" />
                <span>Things I Love ({p.interests.length}) 🎨</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {p.interests.map((tag, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-50 to-purple-50 text-slate-900 text-xs font-extrabold border border-rose-200/70 shadow-2xs flex items-center gap-1">
                    <span>#</span>
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  // STANDARD SOUL HUB VIEWS (GRID, CIRCLES, ACTIVITIES, FEED)
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fadeIn pb-20 text-left">
      
      {/* INSTAGRAM-STYLE STORIES & STATUS UPDATES BAR */}
      <InstagramStoriesBar
        onReplyToUser={(author, text) => {
          const matchingProfile = profiles.find(p => p.name.includes(author.split(' ')[0])) || profiles[0];
          onMatch(matchingProfile);
        }}
      />

      {/* SUB-NAVIGATION CONTROL BAR & LIVE STATUS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
        {/* View Switcher Tabs */}
        <nav 
          ref={subNavContainerRef}
          className="relative flex items-center bg-slate-100 p-1.5 rounded-full border border-slate-200 flex-shrink-0 overflow-hidden"
        >
          {/* Sliding Bouncy Candy Pink Indicator */}
          <div
            style={{
              transform: `translateX(${subIndicatorStyle.left}px)`,
              width: `${subIndicatorStyle.width}px`
            }}
            className="absolute top-1.5 bottom-1.5 left-0 bg-[#E74F9C] rounded-full transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1) shadow-md shadow-[#E74F9C]/30 pointer-events-none"
          />

          {subNavTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = viewMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id)}
                className={`relative z-10 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition-colors duration-200 active:scale-95 ${
                  isActive ? 'text-white' : 'text-slate-700 hover:text-slate-950 font-bold'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Live Status Pill */}
        <div className="flex items-center gap-3 text-xs font-bold text-slate-800">
          <div className="flex -space-x-2">
            {(profiles || []).slice(0, 4).map((p, idx) => (
              <img key={idx} src={p.photos[0]} alt={p.name} className="w-6 h-6 rounded-full border-2 border-white object-cover" />
            ))}
          </div>
          <span><b>{(profiles || []).length} Souls Online</b></span>
          <AnimatedHighlightTag text="Live" accent="emerald" />
        </div>
      </div>

        {/* Dynamic Vibe Filters & Search */}
        {viewMode === 'grid' && (
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
              <span className="text-xs text-slate-500 font-extrabold flex-shrink-0">Vibe Filter:</span>
              {["All", "Coffee", "Architect", "Vinyl", "Cinema", "Design"].map(vibe => (
                <button
                  key={vibe}
                  onClick={() => setActiveVibeFilter(vibe)}
                  className={`px-3.5 py-1 rounded-full text-xs font-extrabold transition-all flex-shrink-0 ${
                    activeVibeFilter === vibe
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {vibe === 'All' ? '✨ All Vibes' : `#${vibe}`}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-80 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by interest, occupation..."
                className="w-full pl-11 pr-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#E74F9C]"
              />
            </div>
          </div>
        )}

        {/* GRID VIEW CONTAINER */}
        {viewMode === 'grid' && (
          <div className="space-y-6 pt-2">
            
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <Sparkles className="w-5 h-5 text-[#c01868]" />
                <span>Compatible Souls Nearby ({filteredProfilesList.length})</span>
              </h2>
              <span className="text-xs text-slate-500 font-bold">Direct messaging & coffee invites enabled</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfilesList.map((profile) => (
                <div
                  key={profile.id}
                  className="glass-card rounded-[32px] border border-slate-200 bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group text-left"
                >
                  {/* Photo (Clean Full-Bleed - NO FLOATING OVERLAY TAGS) */}
                  <div
                    onClick={() => setSelectedShowcaseProfile(profile)}
                    className="relative h-64 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={profile.photos[0]}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Body Content */}
                  <div 
                    onClick={() => setSelectedShowcaseProfile(profile)}
                    className="p-5 space-y-3 flex-1 flex flex-col justify-between cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#c01868] transition-colors truncate">
                            {profile.name}, {profile.age}
                          </h3>
                          {profile.verified && (
                            <ShieldCheck className="w-5 h-5 text-emerald-600 fill-emerald-100 flex-shrink-0" aria-label="Verified Profile Shield" />
                          )}
                        </div>
                        <AnimatedHighlightTag text={`${profile.compatibilityScore || profile.matchScore || 95}% Match`} accent="rose" className="flex-shrink-0" />
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-[#c01868]">
                        <span>{profile.occupation}</span>
                        <span className="text-slate-500 font-semibold">{profile.distanceKm} mi away</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                      "{profile.bio}"
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200/80 text-slate-900 text-[11px] font-extrabold flex items-center gap-1 select-none">
                        <img src="/illustrations/happy-star.png" alt="" className="w-3.5 h-3.5 object-contain mix-blend-multiply select-none" />
                        <span className="text-[#c01868]">{profile.attachmentStyle}</span>
                      </span>
                      <AnimatedHighlightTag text={profile.intent} icon={<Target className="w-3 h-3" />} accent="pink" />
                    </div>

                  {/* Redesigned Sleek Action Capsule Dock (No rectangular bar block) */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-slate-400 group-hover:text-[#E74F9C] transition-colors flex items-center gap-1">
                      <span>Explore Profile</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMatch(profile);
                      }}
                      className="px-4 py-2 rounded-full bg-[#E74F9C] hover:bg-[#d43f8a] text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-all shadow-[#E74F9C]/25"
                    >
                      <Coffee className="w-3.5 h-3.5" />
                      <span>Invite</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: SOUL CIRCLES & INTEREST GROUPS */}
      {viewMode === 'circles' && (
        <div className="space-y-8 text-left">
          
          {/* Hero Masterpiece Circle Banner with Full-Bleed Background Image & Dark Gradient Overlay */}
          <div className="relative rounded-[36px] overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 text-white p-6 sm:p-10 min-h-[260px] flex items-center group">
            
            {/* Background Photography with Zoom Hover effect */}
            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80"
              alt="Featured Community"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-40 mix-blend-overlay"
            />

            {/* Dark Gradient Overlay for Maximum Crisp Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-purple-950/70"></div>

            {/* Ambient Animated Glow Orb */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-tr from-rose-500/30 via-purple-500/20 to-teal-500/30 blur-3xl pointer-events-none animate-pulse"></div>

            <div className="relative z-10 w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1 rounded-full bg-[#E74F9C] text-white text-[11px] font-extrabold shadow uppercase tracking-wider flex items-center gap-1.5 w-fit">
                    <Flame className="w-3.5 h-3.5 text-white animate-pulse" />
                    <span>FEATURED COMMUNITY</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>24 Active Now</span>
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Specialty Coffee & Vinyl Cafe
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-xl">
                  For enthusiasts of V60 pour-overs, Scandinavian minimalist cafes, and rare 90s jazz vinyl pressings. Exchanging daily recommendations & espresso spots.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <div className="flex -space-x-2">
                    {["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
                      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80"].map((img, i) => (
                      <img key={i} src={img} alt="User" className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" />
                    ))}
                  </div>
                  <span className="text-xs font-extrabold text-[#50D4D5]">Aria, Julian & 22 others active now</span>
                </div>
              </div>

              <button
                onClick={() => handleToggleJoinCircle(SOUL_CIRCLES[0])}
                className="px-7 py-3.5 rounded-full bg-[#E74F9C] hover:bg-[#d43f8a] text-white text-xs sm:text-sm font-extrabold shadow-xl shadow-[#E74F9C]/30 flex items-center gap-2 active:scale-95 transition-all flex-shrink-0"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enter Live Circle Chat</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-50/80 via-white to-pink-50/80 p-5 rounded-3xl border border-purple-100/80 shadow-xs">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#E74F9C]" />
                <span>Soul Circles & Micro-Communities</span>
              </h2>
              <p className="text-xs text-slate-600 font-semibold">Join authentic group chats based on shared attachment styles & passions</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-28 h-20 flex-shrink-0">
                <img src="/illustrations/illustration-community.png" alt="Friends Embrace Illustration" className="w-full h-full object-contain filter drop-shadow-xs select-none" />
              </div>
              <button
                onClick={() => alert("Create New Circle feature simulation!")}
                className="px-4.5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-xs flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create Circle</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {circlesList.map((circle) => {
              const isJoined = joinedCircles.includes(circle.id);
              return (
                <div key={circle.id} className="glass-card rounded-[32px] overflow-hidden border border-slate-200 bg-white shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
                  <div className="relative h-44 overflow-hidden">
                    <img src={circle.banner || circle.image} alt={circle.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-extrabold shadow-sm">
                          #{circle.category}
                        </span>
                        {isJoined && (
                          <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold shadow-sm">
                            Joined Member
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-extrabold text-white">{circle.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex -space-x-1.5">
                            {["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
                              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"].map((img, i) => (
                              <img key={i} src={img} alt="Member" className="w-5.5 h-5.5 rounded-full border border-white object-cover" />
                            ))}
                          </div>
                          <span className="text-[11px] text-slate-200 font-bold">{circle.members} Active Members</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{circle.description}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#E74F9C]" />
                        <span>{circle.activeUsers.join(', ')} chatting</span>
                      </span>

                      <button
                        onClick={() => handleToggleJoinCircle(circle)}
                        className={`px-5 py-2.5 rounded-full font-extrabold text-xs transition-all active:scale-95 flex items-center gap-1.5 ${
                          isJoined
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-[#E74F9C] hover:bg-[#d43f8a] text-white shadow-sm shadow-[#E74F9C]/20'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{isJoined ? 'Open Group Chat' : 'Join Circle'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: REAL-WORLD DATE PROPOSALS */}
      {viewMode === 'activities' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-50/80 via-white to-rose-50/80 p-5 rounded-3xl border border-amber-100/80 shadow-xs">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#E74F9C]" />
                <span>Real-World Date Proposals</span>
              </h2>
              <p className="text-xs text-slate-600 font-semibold">Post or join casual real-life dates in your city</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-24 h-20 flex-shrink-0">
                <img src="/illustrations/book-man.png" alt="Coffee & Books Date Illustration" className="w-full h-full object-contain filter drop-shadow-xs select-none" />
              </div>
              <button
                onClick={() => setIsProposalModalOpen(true)}
                className="px-4 py-2.5 rounded-full bg-[#E74F9C] hover:bg-[#d43f8a] text-white font-extrabold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-sm flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Post Date Proposal</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {dateProposals.map((date) => (
              <div
                key={date.id}
                className="glass-card rounded-[32px] p-5 sm:p-6 border border-slate-200 bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 text-left hover:border-[#E74F9C] hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Rich Venue Cover Thumbnail with Overlaid Author Avatar */}
                  <div className="relative w-full sm:w-28 h-28 rounded-2xl overflow-hidden border border-slate-200 flex-shrink-0 shadow-sm">
                    <img
                      src={date.coverImage || "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80"}
                      alt={date.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
                    <img
                      src={date.photo}
                      alt={date.author}
                      className="absolute bottom-2 left-2 w-8 h-8 rounded-full border-2 border-white object-cover shadow"
                      title={date.author}
                    />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 rounded-full bg-rose-50 text-[#E74F9C] text-[10px] font-extrabold border border-rose-200 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-[#E74F9C]" />
                        <span>TRENDING DATE</span>
                      </span>
                      <span className="text-xs font-extrabold text-slate-500">Posted by {date.author}</span>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#E74F9C] transition-colors">{date.title}</h3>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{date.details}</p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600 font-extrabold">
                      <span className="flex items-center gap-1.5 text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-[#E74F9C]" />
                        <span>{date.location}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 text-purple-700">
                        <Clock className="w-3.5 h-3.5 text-purple-600" />
                        <span>{date.time}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setProposalToJoin(date)}
                  className="w-full md:w-auto px-6 py-3 rounded-full bg-[#E74F9C] hover:bg-[#d43f8a] text-white font-extrabold text-xs shadow-md shadow-[#E74F9C]/25 flex-shrink-0 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Coffee className="w-4 h-4" />
                  <span>Join Date ☕</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW MODE 4: LIVE ENGAGEMENT FEED */}
      {viewMode === 'notifications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#E74F9C]" />
              <span>Live Social Feed & Activity</span>
            </h2>
          </div>

          <div className="glass-card rounded-[28px] p-6 border border-slate-200 bg-[#FEFEFE] shadow-sm divide-y divide-slate-100 text-left space-y-4">
            {notifications.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-extrabold text-slate-900">{item.text}</p>
                      <span className="text-[10px] text-slate-400 font-bold">{item.time}</span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: LIVE CIRCLE GROUP CHAT */}
      <CircleGroupChatModal
        circle={activeCircleChat}
        isOpen={!!activeCircleChat}
        onClose={() => setActiveCircleChat(null)}
      />

      {/* MODAL 2: DATE PROPOSAL CREATOR & JOIN CONFIRMATION */}
      <DateProposalModal
        isOpen={isProposalModalOpen || !!proposalToJoin}
        proposalToJoin={proposalToJoin}
        onClose={() => {
          setIsProposalModalOpen(false);
          setProposalToJoin(null);
        }}
        onAddProposal={handleAddProposal}
        onConfirmJoin={(proposal) => {
          const matchingProfile = profiles.find(p => p.name === proposal.author) || profiles[0];
          onMatch(matchingProfile);
        }}
      />

    </div>
  );
}
