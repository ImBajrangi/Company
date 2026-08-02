import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Clock, Coffee, Sparkles, CheckCircle2, Send, Flame, ShieldCheck, Heart } from 'lucide-react';
import { DateWorkflowInfographic } from './InfographicVisualizers';

export default function DateProposalModal({ isOpen, onClose, onAddProposal, proposalToJoin, onConfirmJoin }) {
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [details, setDetails] = useState('');
  const [isJoined, setIsJoined] = useState(false);

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

  if (proposalToJoin) {
    return (
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="proposal-detail-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn text-left"
      >
        <div className="relative w-full max-w-md rounded-[36px] overflow-hidden border border-slate-700 bg-slate-900 text-white text-center shadow-2xl space-y-6">
          
          {/* Hero Venue Background Photo Cover with Dark Gradient Overlay */}
          <div className="relative h-44 w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"
              alt="Venue location cover artwork"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

            {/* Floating Close Button */}
            <button
              onClick={onClose}
              aria-label="Close date proposal modal"
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-md active:scale-95 transition-all border border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Top Graphic Sticker Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-950/80 backdrop-blur-md p-1 border border-white/20 shadow">
                <img src="/illustrations/dinner_toast_doodle.png" alt="Decorative dinner toast illustration" className="w-full h-full object-contain filter invert" />
              </div>
              <span className="px-3.5 py-1 rounded-full bg-[#E74F9C] text-white text-[11px] font-extrabold shadow-lg flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>IDEAL DATE PROPOSAL</span>
              </span>
            </div>

            {/* Author Avatar Badge floating over banner */}
            <div className="absolute -bottom-6 left-6 z-20 flex items-center gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-[#E74F9C] shadow-xl flex-shrink-0">
                <img
                  src={proposalToJoin.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                  alt={`${proposalToJoin.author}'s profile photo`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-0.5 text-left">
                <span className="text-xs text-[#50D4D5] font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Verified Host</span>
                </span>
                <p className="text-sm font-extrabold text-white">{proposalToJoin.author}</p>
              </div>
            </div>
          </div>

          <div className="p-6 pt-2 space-y-6 text-left">
            {!isJoined ? (
              <>
                <div className="space-y-1.5">
                  <h3 id="proposal-detail-title" className="text-2xl font-extrabold text-white leading-tight">{proposalToJoin.title}</h3>
                  <p className="text-xs text-slate-300 font-semibold">Join real-world meetups in your area</p>
                </div>

                {/* Graphic Info Card */}
                <div className="p-4.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2.5 text-xs font-extrabold text-white shadow-inner">
                  <div className="flex items-center gap-2 text-rose-300">
                    <MapPin className="w-4 h-4 text-[#E74F9C]" aria-hidden="true" />
                    <span>{proposalToJoin.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-300">
                    <Clock className="w-4 h-4 text-purple-400" aria-hidden="true" />
                    <span>{proposalToJoin.time}</span>
                  </div>
                  <p className="pt-2.5 border-t border-slate-700/80 text-slate-200 font-medium italic leading-relaxed">
                    "{proposalToJoin.details}"
                  </p>
                </div>

                {/* Graphic Sticker Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-extrabold flex items-center gap-1">
                    <Coffee className="w-3 h-3" aria-hidden="true" />
                    <span>Pour-Over & Pastries</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-extrabold flex items-center gap-1">
                    <Flame className="w-3 h-3 text-[#E74F9C]" aria-hidden="true" />
                    <span>Casual Real-Life Date</span>
                  </span>
                </div>

                {/* CONCEPTUAL STEP-BY-STEP DATE INFOGRAPHIC */}
                <DateWorkflowInfographic />

                <button
                  onClick={() => {
                    setIsJoined(true);
                    if (onConfirmJoin) onConfirmJoin(proposalToJoin);
                  }}
                  aria-label={`Confirm and open chat with ${proposalToJoin.author}`}
                  className="w-full py-3.5 rounded-full bg-[#E74F9C] hover:bg-[#d43f8a] text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-[#E74F9C]/30 active:scale-95 transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Coffee className="w-4 h-4" aria-hidden="true" />
                  <span>Confirm & Open Chat with {proposalToJoin.author}</span>
                </button>
              </>
            ) : (
              <div className="py-6 space-y-4 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" aria-hidden="true" />
                <h3 className="text-2xl font-extrabold text-white">You're On The Date List!</h3>
                <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                  A private chat thread has been created with {proposalToJoin.author} to coordinate location details.
                </p>
                <button
                  onClick={onClose}
                  className="w-full py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs border border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  Done
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  // Create Date Proposal View
  const handleCreate = () => {
    if (!title.trim() || !venue.trim()) return;
    const newProposal = {
      id: Date.now().toString(),
      author: "Alex Vance (You)",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      title: title.trim(),
      location: venue.trim(),
      time: dateTime || "This Weekend",
      details: details.trim() || "Let me know if you'd like to join!"
    };
    if (onAddProposal) onAddProposal(newProposal);
    onClose();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-proposal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn text-left"
    >
      <div className="relative w-full max-w-md rounded-[36px] overflow-hidden border border-slate-700 bg-slate-900 text-white shadow-2xl space-y-5">
        
        {/* Seamless Floating Background Vector Graphic */}
        <img
          src="/illustrations/romantic_dinner.png"
          alt="Romantic dinner decorative background illustration"
          className="absolute -top-12 -right-12 w-64 h-64 object-contain opacity-20 pointer-events-none mix-blend-screen select-none"
        />

        <div className="p-6 pb-2 border-b border-slate-800 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E74F9C]" aria-hidden="true" />
            <h3 id="create-proposal-modal-title" className="text-lg font-extrabold text-white">Post Real-World Date Proposal</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close create proposal modal"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 pt-0 space-y-4">
          <div>
            <label htmlFor="proposal-title-input" className="text-xs font-extrabold text-slate-200 block mb-1">Date Activity Title</label>
            <input
              id="proposal-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Matcha Tasting & Vinyl Shopping"
              className="w-full bg-slate-800/90 border border-slate-700 p-3 rounded-2xl text-xs text-white font-extrabold focus:outline-none focus:border-[#E74F9C] focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
            />
          </div>

          <div>
            <label htmlFor="proposal-venue-input" className="text-xs font-extrabold text-slate-200 block mb-1">Venue Location</label>
            <input
              id="proposal-venue-input"
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Blue Bottle Coffee • Downtown"
              className="w-full bg-slate-800/90 border border-slate-700 p-3 rounded-2xl text-xs text-white font-extrabold focus:outline-none focus:border-[#E74F9C] focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
            />
          </div>

          <div>
            <label htmlFor="proposal-time-input" className="text-xs font-extrabold text-slate-200 block mb-1">Date & Time</label>
            <input
              id="proposal-time-input"
              type="text"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              placeholder="e.g. This Saturday, 3:00 PM"
              className="w-full bg-slate-800/90 border border-slate-700 p-3 rounded-2xl text-xs text-white font-extrabold focus:outline-none focus:border-[#E74F9C] focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
            />
          </div>

          <div>
            <label htmlFor="proposal-details-input" className="text-xs font-extrabold text-slate-200 block mb-1">Date Details</label>
            <textarea
              id="proposal-details-input"
              rows="3"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Looking for someone to grab iced matcha lattes and explore cozy indie vinyl record shops!"
              className="w-full bg-slate-800/90 border border-slate-700 p-3 rounded-2xl text-xs text-white font-extrabold focus:outline-none focus:border-[#E74F9C] focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
            />
          </div>

          <button
            onClick={handleCreate}
            className="w-full py-3.5 rounded-full bg-[#E74F9C] hover:bg-[#d43f8a] text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-[#E74F9C]/30 flex items-center justify-center gap-2 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            <span>Publish Proposal to Date Board</span>
          </button>
        </div>

      </div>
    </div>
  );
}
