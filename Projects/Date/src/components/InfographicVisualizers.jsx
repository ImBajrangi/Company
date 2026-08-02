import React from 'react';
import { Brain, Sparkles, Heart, Coffee, ShieldCheck, Zap, Compass, Activity, Award, CheckCircle2 } from 'lucide-react';
import AnimatedHighlightTag from './AnimatedHighlightTag';

// 1. Psychological Attachment Style Infographic Gauge - Graphic Info Bars
export function AttachmentRadarInfographic({ score = 96, dimensions = {} }) {
  const defaultDimensions = [
    { 
      label: "TRUST & STABILITY 🛡️", 
      sub: "Strong feeling of safety and mutual trust", 
      value: dimensions.secure || 94, 
      bg: "bg-rose-50/80 border-rose-200/90 text-[#c01868]", 
      barColor: "from-[#E74F9C] to-rose-500",
      graphic: "/illustrations/happy-star.png" 
    },
    { 
      label: "GREAT TALKS 💬", 
      sub: "Easy, open and honest conversations", 
      value: dimensions.voice || 92, 
      bg: "bg-purple-50/80 border-purple-200/90 text-purple-900", 
      barColor: "from-purple-500 to-indigo-600",
      graphic: "/illustrations/star-face.png" 
    },
    { 
      label: "SHARED GOALS 🚀", 
      sub: "Matching values & curiosity for life", 
      value: dimensions.growth || 88, 
      bg: "bg-amber-50/80 border-amber-200/90 text-amber-900", 
      barColor: "from-amber-400 to-[#E74F9C]",
      graphic: "/illustrations/smily-star.png" 
    },
    { 
      label: "FUN & VIBE 🎉", 
      sub: "Playful spark & exciting energy", 
      value: dimensions.spontaneity || 95, 
      bg: "bg-emerald-50/80 border-emerald-200/90 text-emerald-950", 
      barColor: "from-[#50D4D5] to-emerald-500",
      graphic: "/illustrations/star.png" 
    }
  ];

  return (
    <div className="w-full rounded-[32px] p-5 sm:p-6 bg-white border border-slate-200 text-slate-900 space-y-4 shadow-sm text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-rose-50 text-[#c01868] flex items-center justify-center flex-shrink-0 border border-rose-100">
            <Heart className="w-5 h-5 fill-rose-500/20 text-rose-500" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900">Why You Click Together 💖</h4>
            <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">Your Soul Connection Breakdown</span>
          </div>
        </div>

        <AnimatedHighlightTag text={`${score}% OVERALL MATCH`} accent="rose" />
      </div>

      {/* High-Impact Graphic Info Bars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {defaultDimensions.map((item, idx) => {
          return (
            <div key={idx} className={`p-4 rounded-2xl border ${item.bg} space-y-2.5 relative overflow-hidden transition-all hover:shadow-md hover:scale-[1.01] group`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Styled Professional Artwork Badge Container */}
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center p-1 flex-shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                    <img
                      src={item.graphic}
                      alt={item.label}
                      className="w-full h-full object-cover rounded-lg select-none"
                    />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-xs font-black tracking-tight block text-slate-900">{item.label}</span>
                    <p className="text-[11px] text-slate-600 font-semibold leading-tight">{item.sub}</p>
                  </div>
                </div>
                <span className="text-sm font-black flex-shrink-0 pl-2 text-slate-900">{item.value}%</span>
              </div>

              {/* Colorful Progress Info Bar */}
              <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.barColor} transition-all duration-1000`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 2. Real-World Date Step-by-Step Infographic Flow with Hero Block Background Pictures
export function DateWorkflowInfographic() {
  const steps = [
    { 
      step: "01", 
      title: "Pick Casual Venue", 
      desc: "Select pour-over coffee, books or vinyl shop", 
      graphic: "/illustrations/book-man.png", 
      bg: "bg-rose-50/70 border-rose-200/80 text-[#c01868]" 
    },
    { 
      step: "02", 
      title: "Instant Chat", 
      desc: "Coordinate time & icebreaker topics", 
      graphic: "/illustrations/social-media-boy-girl.png", 
      bg: "bg-purple-50/70 border-purple-200/80 text-purple-900" 
    },
    { 
      step: "03", 
      title: "Real Co-Presence", 
      desc: "Meet in person with zero pressure", 
      graphic: "/illustrations/expressive-shocked-girl-boy.png", 
      bg: "bg-emerald-50/70 border-emerald-200/80 text-emerald-950" 
    }
  ];

  return (
    <div className="w-full rounded-[32px] p-6 bg-white border border-slate-200 shadow-sm space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#c01868]" />
          <h4 className="text-sm font-extrabold text-slate-900">How Real-World Proposals Work</h4>
        </div>
        <AnimatedHighlightTag text="3 Simple Steps" accent="rose" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {steps.map((s, idx) => {
          return (
            <div key={idx} className={`p-4 rounded-2xl border ${s.bg} relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all hover:scale-[1.01]`}>
              
              {/* Professional Full-Visibility Artwork Header */}
              <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 border border-slate-200/60 bg-white p-2 flex items-center justify-center shadow-inner group-hover:border-rose-300 transition-colors">
                <img 
                  src={s.graphic} 
                  alt={s.title} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 select-none" 
                />
                <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider shadow-sm z-10">
                  STEP {s.step}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-extrabold block text-slate-900">{s.title}</span>
                <p className="text-xs font-semibold leading-relaxed opacity-90 text-slate-700">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 4. Emotional State & Feeling Spectrum Infographic with Block Background Pictures
export function EmotionalResonanceInfographic({ emotions = [] }) {
  const defaultEmotions = emotions.length ? emotions : [
    { label: "Vulnerability & Trust", val: 96, color: "from-[#E74F9C] to-rose-500", graphic: "/illustrations/friends-girls.png", desc: "Open & Authentic Expression" },
    { label: "Playful Joy & Laughter", val: 94, color: "from-amber-400 to-[#E74F9C]", graphic: "/illustrations/girl-illustration.png", desc: "Spontaneous Energy Spark" },
    { label: "Calm Co-Presence", val: 92, color: "from-[#50D4D5] to-teal-500", graphic: "/illustrations/illustration-cat.png", desc: "Grounded Emotional Comfort" },
    { label: "Intellectual Curiosity", val: 88, color: "from-purple-500 to-indigo-600", graphic: "/illustrations/book-man.png", desc: "Deep Conversational Resonance" }
  ];

  return (
    <div className="w-full rounded-[32px] p-6 bg-white border border-slate-200 shadow-md space-y-5 text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">💗</span>
          <div>
            <h4 className="text-base font-extrabold text-slate-900">Emotional Spectrum Diagnostic</h4>
            <span className="text-[11px] text-[#E74F9C] font-extrabold uppercase tracking-wider">Real Feeling State Resonance</span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-rose-50 text-[#E74F9C] text-xs font-extrabold border border-rose-200 shadow-sm">
          95% Emotional Harmony
        </span>
      </div>

      {/* Graphic Info Bars with Block Background Picture Thumbnails */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {defaultEmotions.map((emo, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-[#E74F9C] transition-all hover:scale-[1.01] hover:shadow-md group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Professional Block Picture Container */}
                <div className="w-14 h-14 rounded-xl overflow-hidden shadow-xs border border-slate-200/80 bg-white p-1 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={emo.graphic}
                    alt={emo.label}
                    className="w-full h-full object-contain select-none"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-extrabold text-slate-900 block truncate">{emo.label}</span>
                  <span className="text-[10px] text-slate-500 font-bold block truncate">{emo.desc}</span>
                </div>
              </div>
              <span className="text-base font-extrabold text-[#E74F9C] flex-shrink-0 pl-1">{emo.val}%</span>
            </div>

            {/* Pulse Info Bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-200/70 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${emo.color} transition-all duration-1000`}
                style={{ width: `${emo.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. Affinity Match Badge Infographic Chips
export function AffinityChipsInfographic({ tags = ["Scandinavian Coffee", "Jazz Vinyl", "Minimal Architecture"] }) {
  return (
    <div className="flex flex-wrap gap-2 text-left">
      {tags.map((tag, idx) => (
        <div
          key={idx}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-extrabold text-white shadow-sm hover:border-[#E74F9C] transition-all"
        >
          <span>{tag}</span>
          <span className="text-[10px] text-[#50D4D5] font-extrabold pl-1 border-l border-slate-700">98% Match</span>
        </div>
      ))}
    </div>
  );
}
