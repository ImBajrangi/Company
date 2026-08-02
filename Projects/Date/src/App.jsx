import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import SwipeStack from './components/SwipeStack';
import ChatView from './components/ChatView';
import CompatibilityQuiz from './components/CompatibilityQuiz';
import ProfileEditor from './components/ProfileEditor';
import MatchModal from './components/MatchModal';
import FilterDrawer from './components/FilterDrawer';
import VerificationModal from './components/VerificationModal';
import { MOCK_PROFILES, INITIAL_MATCHES } from './data/mockProfiles';
import { cacheManager } from './utils/cacheManager';
import { ShieldCheck, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing'); // 'landing' | 'explore' | 'chats' | 'quiz' | 'profile'
  const [userProfile, setUserProfile] = useState(cacheManager.getUserProfile());
  const [matches, setMatches] = useState(() => {
    const cached = cacheManager.getMatches();
    return cached && cached.length > 0 ? cached : INITIAL_MATCHES;
  });
  const [matchedProfile, setMatchedProfile] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [detailProfile, setDetailProfile] = useState(null);
  const [filteredProfiles, setFilteredProfiles] = useState(MOCK_PROFILES);

  // Force Light Mode Class on Document Body
  useEffect(() => {
    document.body.className = 'light';
  }, []);

  // Sync cache state
  useEffect(() => {
    cacheManager.set('soulsync_matches', matches);
  }, [matches]);

  const handleMatch = (profile) => {
    setMatchedProfile(profile);
    const newMatch = {
      id: profile.id,
      name: profile.name,
      photo: profile.photos[0],
      lastMessage: `You matched with ${profile.name}! Say hi ☕`,
      time: 'Just now',
      unread: true,
      verified: profile.verified
    };
    setMatches(prev => [newMatch, ...prev.filter(m => m.id !== profile.id)]);
  };

  const handleStartChat = (profile, initialText) => {
    setMatchedProfile(null);
    setActiveChatId(profile.id);
    if (initialText) {
      cacheManager.addChatMessage(profile.id, {
        id: Date.now().toString(),
        sender: 'me',
        text: initialText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
    setActiveTab('chats');
  };

  const handleApplyFilters = (filters) => {
    let list = MOCK_PROFILES.filter(p => p.distanceKm <= filters.maxDistance);
    if (filters.verifiedOnly) {
      list = list.filter(p => p.verified);
    }
    if (filters.intentFilter && filters.intentFilter !== "All") {
      list = list.filter(p => p.intent === filters.intentFilter);
    }
    setFilteredProfiles(list);
  };

  const [selectedProfileForView, setSelectedProfileForView] = useState(null);

  const handleOpenFullProfileView = (profile) => {
    setSelectedProfileForView(profile);
    setActiveTab('profile');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] text-slate-900">
      
      {/* WCAG 2.4.1 Skip to Main Content Link for Screen Readers and Keyboard Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:top-4 focus:left-4 focus:z-50 focus:px-5 focus:py-2.5 focus:bg-[#E74F9C] focus:text-white focus:font-extrabold focus:rounded-full focus:shadow-2xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Fixed Top Navigation Bar with Scroll Hiding/Showing */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'profile') setSelectedProfileForView(null);
          setActiveTab(tab);
        }}
        onOpenFilters={() => setIsFilterOpen(true)}
        unreadCount={matches.filter(m => m.unread).length}
        isVerified={userProfile.verified}
      />

      {/* Main Content Body - Widescreen Layout */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-24 sm:pt-28 pb-6 flex flex-col justify-center">
        
        {activeTab === 'landing' && (
          <LandingPage
            onLaunchApp={() => setActiveTab('explore')}
            onStartQuiz={() => setActiveTab('quiz')}
          />
        )}

        {activeTab === 'explore' && (
          <SwipeStack
            profiles={filteredProfiles}
            onMatch={handleMatch}
            onOpenDetails={handleOpenFullProfileView}
            onResetSwipes={() => setFilteredProfiles(MOCK_PROFILES)}
          />
        )}

        {activeTab === 'chats' && (
          <ChatView
            matches={matches}
            activeMatchId={activeChatId}
            onSelectMatch={(id) => setActiveChatId(id)}
          />
        )}

        {activeTab === 'quiz' && (
          <CompatibilityQuiz
            onComplete={() => {
              setUserProfile(cacheManager.getUserProfile());
            }}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileEditor
            initialViewProfile={selectedProfileForView}
            allProfiles={filteredProfiles}
            onMatch={handleMatch}
            onOpenVerification={() => setIsVerificationOpen(true)}
          />
        )}

      </main>

      {/* Match Celebration Modal */}
      <MatchModal
        matchedProfile={matchedProfile}
        userProfile={userProfile}
        onClose={() => setMatchedProfile(null)}
        onStartChat={handleStartChat}
      />

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

      {/* Photo Verification Modal */}
      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        onVerified={() => setUserProfile(cacheManager.getUserProfile())}
      />

    </div>
  );
}
