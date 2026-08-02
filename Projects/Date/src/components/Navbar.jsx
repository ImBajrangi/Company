import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Heart, Sparkles, MessageCircle, BrainCircuit, UserCheck, Sliders, ShieldCheck, Home } from 'lucide-react';
import AnimatedHighlightTag from './AnimatedHighlightTag';

export default function Navbar({ activeTab, setActiveTab, onOpenFilters, unreadCount, isVerified }) {
  const tabs = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'explore', label: 'Soul Hub', icon: Sparkles },
    { id: 'chats', label: 'Chats', icon: MessageCircle, badge: unreadCount },
    { id: 'quiz', label: 'Quiz', icon: BrainCircuit },
    { id: 'profile', label: 'Profile', icon: UserCheck }
  ];

  const activeIndex = tabs.findIndex(t => t.id === activeTab);
  const containerRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Scroll Direction State: Scroll UP -> Show Navbar, Scroll DOWN -> Hide Navbar
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Recalculate Indicator Position and Width (Handles Window Resizing Flawlessly)
  const updateIndicator = useCallback(() => {
    if (containerRef.current) {
      const activeBtn = containerRef.current.children[activeIndex + 1]; // +1 because index 0 is sliding bg
      if (activeBtn) {
        setIndicatorStyle({
          left: activeBtn.offsetLeft,
          width: activeBtn.offsetWidth
        });
      }
    }
  }, [activeIndex]);

  // Recalculate on Tab Change AND Window Resize
  useEffect(() => {
    updateIndicator();

    const handleResize = () => {
      updateIndicator();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateIndicator]);

  // Scroll listener for fixed top navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 20) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling DOWN -> HIDE top bar
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling UP -> SHOW top bar
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-8 transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-28 opacity-0 pointer-events-none'
    }`}>
      <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md rounded-full px-5 sm:px-7 py-2.5 sm:py-3.5 flex items-center justify-between gap-3 border border-slate-200/90 shadow-lg">
        
        {/* Brand Logo */}
        <button 
          onClick={() => setActiveTab('landing')}
          aria-label="SoulSync Home Page"
          className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-transform duration-200 rounded-full flex-shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#E74F9C] to-purple-600 flex items-center justify-center text-white shadow-md shadow-[#E74F9C]/20 overflow-hidden flex-shrink-0">
            <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white fill-white" />
          </div>
          <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 hidden xs:inline">
            Soul<span className="text-[#c01868]">Sync</span>
          </span>
        </button>

        {/* Center Capsule Navigation - Prominent & Easy to Use */}
        <nav 
          ref={containerRef}
          aria-label="Main Navigation"
          role="tablist"
          className="relative flex items-center bg-slate-100/90 p-1.5 rounded-full border border-slate-200/80 overflow-hidden flex-shrink-1 min-w-0"
        >
          {/* Sliding Bouncy Candy Pink Active Background Indicator */}
          <div
            style={{
              transform: `translateX(${indicatorStyle.left}px)`,
              width: `${indicatorStyle.width}px`
            }}
            aria-hidden="true"
            className="absolute top-1.5 bottom-1.5 left-0 bg-[#E74F9C] rounded-full transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1) shadow-md shadow-[#E74F9C]/25 pointer-events-none"
          />

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-label={tab.badge > 0 ? `${tab.label}, ${tab.badge} unread notifications` : tab.label}
                title={tab.label}
                onClick={() => setActiveTab(tab.id)}
                className={`relative z-10 flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-extrabold whitespace-nowrap flex-shrink-0 transition-colors duration-200 active:scale-95 focus:outline-none ${
                  isActive ? 'text-white' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 flex-shrink-0" aria-hidden="true" />
                {/* Active tab always shows text; inactive tabs show text on desktop (lg:) to prevent clipping */}
                <span className={`${isActive ? 'inline' : 'hidden lg:inline'} whitespace-nowrap`}>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className={`flex-shrink-0 flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full text-[10px] font-black leading-none shadow-xs ${
                    isActive ? 'bg-white text-[#c01868]' : 'bg-[#c01868] text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isVerified && (
            <>
              {/* Full Tag on Extra Large Desktop */}
              <div className="hidden lg:block">
                <AnimatedHighlightTag text="VERIFIED MEMBER" icon={<ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />} accent="emerald" />
              </div>
              {/* Compact Shield Icon Pill on Medium/Small Screens */}
              <div className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-xs" title="Verified Member">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </>
          )}

          <button
            onClick={onOpenFilters}
            aria-label="Open Discovery Filters"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all active:scale-95 flex-shrink-0"
            title="Discovery Filters"
          >
            <Sliders className="w-4 h-4 sm:w-4.5 sm:h-4.5" aria-hidden="true" />
          </button>
        </div>

      </div>
    </header>
  );
}
