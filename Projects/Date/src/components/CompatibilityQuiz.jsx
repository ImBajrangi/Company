import React, { useState } from 'react';
import { BrainCircuit, CheckCircle2, Award, RotateCcw, ArrowRight, Sparkles, Heart } from 'lucide-react';
import AnimatedHighlightTag from './AnimatedHighlightTag';
import { cacheManager } from '../utils/cacheManager';
import { AttachmentRadarInfographic } from './InfographicVisualizers';

const QUESTIONS = [
  {
    id: 1,
    title: "When handling conflict or disagreement with a partner, you usually:",
    options: [
      { text: "Address it calmly with honest communication and active listening.", trait: "Secure Base", score: { emotional: 95, comm: 98, life: 90, spont: 85 } },
      { text: "Seek immediate reassurance and feel uncomfortable until resolved.", trait: "Anxious-Expressive", score: { emotional: 90, comm: 85, life: 80, spont: 90 } },
      { text: "Take time alone to process before discussing to avoid emotional overwhelm.", trait: "Independent Processing", score: { emotional: 75, comm: 80, life: 95, spont: 80 } },
      { text: "Focus on logical solutions and compromise without holding grudges.", trait: "Analytic Harmony", score: { emotional: 85, comm: 92, life: 92, spont: 88 } }
    ]
  },
  {
    id: 2,
    title: "Your ideal date experience looks like:",
    options: [
      { text: "A cozy coffee date followed by a stroll through an art gallery or record store.", trait: "Intellectual Connection", score: { emotional: 92, comm: 95, life: 94, spont: 82 } },
      { text: "A spontaneous road trip to catch a sunset or explore a nearby town.", trait: "Spontaneous Adventurer", score: { emotional: 88, comm: 86, life: 85, spont: 98 } },
      { text: "Cooking a gourmet meal together at home while listening to vinyls.", trait: "Domestic Warmth", score: { emotional: 96, comm: 90, life: 96, spont: 78 } },
      { text: "Attending a live acoustic concert or rooftop gathering with good vibes.", trait: "Social Spark", score: { emotional: 84, comm: 88, life: 88, spont: 95 } }
    ]
  },
  {
    id: 3,
    title: "What makes you feel most loved and appreciated in a relationship?",
    options: [
      { text: "Words of Affirmation: Genuine compliments and verbal encouragement.", trait: "Verbal Expression", score: { emotional: 92, comm: 98, life: 88, spont: 86 } },
      { text: "Quality Time: Undivided attention, phone-free conversations, and shared moments.", trait: "Presence & Depth", score: { emotional: 98, comm: 94, life: 92, spont: 84 } },
      { text: "Acts of Service: Thoughtful gestures that simplify daily life.", trait: "Practical Loyalty", score: { emotional: 90, comm: 88, life: 98, spont: 80 } },
      { text: "Physical Touch: Warm hugs, hand-holding, and comforting closeness.", trait: "Tactile Affection", score: { emotional: 94, comm: 86, life: 86, spont: 92 } }
    ]
  }
];

export default function CompatibilityQuiz({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(cacheManager.get('soulsync_quiz_result', null));

  const handleSelectOption = (option) => {
    const nextAnswers = [...answers, option];
    setAnswers(nextAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      const finalTrait = option.trait || "Secure Base";
      const finalResult = {
        style: finalTrait,
        scores: option.score,
        date: new Date().toLocaleDateString()
      };
      setResult(finalResult);
      cacheManager.set('soulsync_quiz_result', finalResult);
      
      const profile = cacheManager.getUserProfile();
      profile.attachmentStyle = finalTrait;
      cacheManager.saveUserProfile(profile);

      if (onComplete) onComplete(finalResult);
    }
  };

  const handleRetake = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <div className="w-full max-w-4xl sm:max-w-5xl mx-auto p-4 sm:p-6" aria-live="polite">
      
      {result ? (
        <div className="bg-white rounded-[40px] p-6 sm:p-10 border border-slate-100 shadow-sm max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 text-left">
          {/* Left Column: Rich Graphic Hero Illustration Banner with Cute Star Stickers */}
          <div className="w-full md:w-80 flex-shrink-0 space-y-4 text-center">
            <div className="relative w-full h-56 rounded-3xl bg-gradient-to-br from-rose-50 via-pink-100/60 to-rose-100/40 p-4 flex items-center justify-center border border-rose-100/80 overflow-hidden shadow-inner">
              <img
                src="/illustrations/happy-star.png"
                alt=""
                aria-hidden="true"
                className="absolute top-2 left-3 w-10 h-10 object-contain opacity-90 select-none pointer-events-none transform -rotate-12 animate-pulse"
              />
              <img
                src="/illustrations/smily-star.png"
                alt=""
                aria-hidden="true"
                className="absolute bottom-2 right-3 w-10 h-10 object-contain opacity-90 select-none pointer-events-none transform rotate-12"
              />
              <img
                src="/illustrations/cozy_hug.png"
                alt="Cozy Hug Archetype Connection"
                className="w-full h-full object-contain filter drop-shadow-md select-none"
              />
            </div>
            <AnimatedHighlightTag text="Attachment Archetype Result" accent="rose" />
          </div>

          {/* Right Column: Archetype Title, Traits & Actions */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Your Archetype: <span className="font-serif italic font-normal text-[#c01868]">{result.style}</span>
              </h2>
              <p className="text-slate-700 text-sm font-semibold mt-1 leading-relaxed">
                High emotional clarity, grounded trust, and natural conversational resonance.
              </p>
            </div>

            {/* 4 Clean Trait Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-100 space-y-0.5">
                <div className="flex items-center justify-between text-xs font-black uppercase text-[#c01868]">
                  <span>🛡️ Secure Base</span>
                  <span>94%</span>
                </div>
                <p className="text-[11px] text-slate-600 font-semibold">High Trust & Grounded Stability</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-100 space-y-0.5">
                <div className="flex items-center justify-between text-xs font-black uppercase text-purple-900">
                  <span>🎙️ Vocal Depth</span>
                  <span>92%</span>
                </div>
                <p className="text-[11px] text-slate-600 font-semibold">Authentic & Vulnerable Voice</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-100 space-y-0.5">
                <div className="flex items-center justify-between text-xs font-black uppercase text-amber-900">
                  <span>✨ Growth</span>
                  <span>88%</span>
                </div>
                <p className="text-[11px] text-slate-600 font-semibold">Intellectual & Value Alignment</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-100 space-y-0.5">
                <div className="flex items-center justify-between text-xs font-black uppercase text-emerald-950">
                  <span>⚡ Spontaneity</span>
                  <span>95%</span>
                </div>
                <p className="text-[11px] text-slate-600 font-semibold">Playful Chemistry & Spark</p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-1">
              <button
                onClick={handleRetake}
                aria-label="Retake psychological diagnostic quiz"
                className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-extrabold transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Retake Diagnostic</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Questions View - LANDING PAGE STYLE 2-COLUMN LAYOUT */
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-6 sm:p-10 space-y-6 text-left relative overflow-hidden">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 border-b border-slate-100 pb-8 relative z-10">
            
            {/* Left Column: Text & Badges */}
            <div className="space-y-4 max-w-xl">
              <AnimatedHighlightTag text={`QUESTION ${currentStep + 1} OF ${QUESTIONS.length}`} icon={<Sparkles className="w-3.5 h-3.5" aria-hidden="true" />} accent="purple" />
              
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Psychological Attachment <br />
                <span className="font-serif italic font-normal text-[#c01868]">Diagnostic.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-700 font-semibold leading-relaxed">
                Discover your relationship archetype & multi-vector compatibility score through 3 deep diagnostic prompts.
              </p>
            </div>

            {/* Right Column: Hero Vector Artwork */}
            <div className="w-64 sm:w-80 h-64 sm:h-80 flex-shrink-0">
              <img
                src="/illustrations/silhouette_couple.png"
                alt="Psychological attachment archetype couple silhouette illustration"
                className="w-full h-full object-contain select-none transform hover:scale-105 transition-transform duration-500 filter drop-shadow-sm"
              />
            </div>

          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-extrabold">
              <span className="text-[#c01868] uppercase tracking-wider flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4" aria-hidden="true" />
                <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
              </span>
              <span className="text-slate-900 font-extrabold">{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}%</span>
            </div>
            <div 
              role="progressbar"
              aria-valuenow={Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Quiz progress"
              className="w-full h-2 rounded-full bg-slate-100 overflow-hidden"
            >
              <div
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                className="h-full bg-[#E74F9C] transition-all duration-300 rounded-full"
              />
            </div>
          </div>

          {/* High Contrast Question Title */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
            {QUESTIONS[currentStep].title}
          </h2>

          {/* Options Grid with Shrink on Click Bounciness */}
          <div className="space-y-3.5" role="radiogroup" aria-label="Question options">
            {QUESTIONS[currentStep].options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(opt)}
                aria-label={`Option ${String.fromCharCode(65 + idx)}: ${opt.text}`}
                className="w-full p-4 sm:p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#E74F9C] text-left text-sm sm:text-base text-slate-900 font-extrabold shadow-sm hover:shadow-md transition-all duration-200 cubic-bezier(0.34, 1.56, 0.64, 1) flex items-start gap-4 group active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
              >
                <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#E74F9C] group-hover:text-white text-slate-900 flex items-center justify-center text-xs font-extrabold flex-shrink-0 mt-0.5 transition-colors" aria-hidden="true">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="leading-relaxed text-slate-900 font-bold">{opt.text}</span>
              </button>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
