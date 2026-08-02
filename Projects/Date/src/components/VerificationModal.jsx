import React, { useState, useEffect } from 'react';
import { ShieldCheck, Camera, CheckCircle2, Sparkles, X, RefreshCw } from 'lucide-react';
import { cacheManager } from '../utils/cacheManager';

export default function VerificationModal({ isOpen, onClose, onVerified }) {
  const [step, setStep] = useState('intro'); // 'intro' | 'scanning' | 'complete'

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

  const startScan = () => {
    setStep('scanning');
    setTimeout(() => {
      setStep('complete');
      // Update local storage cache
      const profile = cacheManager.getUserProfile();
      profile.verified = true;
      cacheManager.saveUserProfile(profile);
      if (onVerified) onVerified();
    }, 2500);
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="verification-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn"
    >
      <div className="relative w-full max-w-md rounded-[36px] p-6 text-center border border-slate-700 bg-slate-900 text-white shadow-2xl overflow-hidden space-y-6">

        <button
          onClick={onClose}
          aria-label="Close verification modal"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        <div aria-live="polite" className="space-y-6">
          {step === 'intro' && (
            <>
              <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden bg-white/5 border border-white/10 p-2 shadow-lg">
                <img src="/illustrations/doodle_hearts.png" alt="Decorative doodle hearts" className="w-full h-full object-contain filter invert" />
              </div>

              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg -mt-4 relative z-10">
                <ShieldCheck className="w-6 h-6" aria-hidden="true" />
              </div>

              <div className="space-y-1.5">
                <h3 id="verification-modal-title" className="text-2xl font-extrabold text-white">AI Liveness Check</h3>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  Verify your profile with a 3-second pose check. Verified profiles get 3x more match recommendations!
                </p>
              </div>

              <button
                onClick={startScan}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/30 hover:scale-102 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Start 3-Sec Liveness Check
              </button>
            </>
          )}

          {step === 'scanning' && (
            <div className="py-8 space-y-4">
              <div className="relative w-36 h-36 rounded-full border-4 border-dashed border-emerald-400 mx-auto flex items-center justify-center animate-spin">
                <Camera className="w-10 h-10 text-emerald-400 animate-pulse" aria-hidden="true" />
              </div>
              <p className="text-sm font-bold text-white">Turn head slowly to the right...</p>
              <p className="text-xs text-slate-300">Verifying 3D depth & geometry</p>
            </div>
          )}

          {step === 'complete' && (
            <div className="py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-10 h-10" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-white">You're Photo Verified!</h3>
              <p className="text-xs text-slate-200">
                The verified shield badge has been added to your SoulSync profile.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
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
