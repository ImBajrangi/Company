import React, { useState, useEffect } from 'react';
import { Send, Coffee, Heart, ShieldCheck, Phone, Video, MoreVertical, Image as ImageIcon, Smile, Sparkles } from 'lucide-react';
import { cacheManager } from '../utils/cacheManager';
import { AffinityChipsInfographic } from './InfographicVisualizers';

export default function ChatView({ matches, activeMatchId, onSelectMatch }) {
  const [selectedMatch, setSelectedMatch] = useState(() => {
    return matches.find(m => m.id === activeMatchId) || matches[0] || null;
  });
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (activeMatchId) {
      const match = matches.find(m => m.id === activeMatchId);
      if (match) setSelectedMatch(match);
    }
  }, [activeMatchId, matches]);

  useEffect(() => {
    if (selectedMatch) {
      setMessages(cacheManager.getChatMessages(selectedMatch.id));
    }
  }, [selectedMatch]);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || !selectedMatch) return;

    const newMsg = {
      id: Date.now().toString(),
      sender: 'me',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    cacheManager.addChatMessage(selectedMatch.id, newMsg);
    setInputText('');

    // Simulated Auto Reply after 1.5 seconds
    setTimeout(() => {
      const replies = [
        "I'd love that! What time works for you?",
        "Haha, that sounds amazing! Vinyl and matcha over coffee?",
        "Sounds like a plan! Let's meet up this weekend ☕✨"
      ];
      const autoMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'them',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, autoMsg]);
      cacheManager.addChatMessage(selectedMatch.id, autoMsg);
    }, 1500);
  };

  const handleCoffeeInvite = () => {
    handleSendMessage("Hey! Would you like to grab a coffee or matcha date this weekend? ☕✨");
  };

  if (!matches || matches.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto py-20 text-center space-y-4">
        <Heart className="w-12 h-12 text-[#c01868] mx-auto animate-pulse" aria-hidden="true" />
        <h2 className="text-2xl font-extrabold text-slate-900">No Active Matches Yet</h2>
        <p className="text-slate-700 text-sm font-semibold">Start swiping on Discover to find your first connection!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto h-[calc(100vh-140px)] min-h-[580px] glass-card rounded-[32px] border border-slate-200 shadow-xl bg-white overflow-hidden flex flex-col md:flex-row">
      
      {/* Matches / Conversations Sidebar */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50">
        
        {/* Sidebar Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between relative overflow-hidden bg-gradient-to-r from-rose-50/50 to-white">
          <div className="flex items-center gap-3 relative z-10">
            <img
              src="/illustrations/chat_silhouettes.png"
              alt="Chat silhouettes illustration"
              className="w-10 h-10 object-contain drop-shadow-sm flex-shrink-0"
            />
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Direct Messages</h2>
              <span className="text-[10px] text-[#c01868] font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                <span>1-on-1 Deep Resonance Thread</span>
              </span>
            </div>
          </div>

          <span className="relative z-10 px-3 py-1 rounded-full bg-rose-50 text-[#c01868] text-xs font-extrabold border border-rose-200 shadow-sm">
            {matches.length} Threads
          </span>
        </div>

        {/* Matches Horizontal Ribbon */}
        <div className="p-4 border-b border-slate-200 overflow-x-auto flex gap-3.5 no-scrollbar" role="tablist" aria-label="Matches ribbon">
          {matches.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={selectedMatch?.id === m.id}
              aria-label={`Open chat with ${m.name}`}
              onClick={() => {
                setSelectedMatch(m);
                if (onSelectMatch) onSelectMatch(m.id);
              }}
              className="flex flex-col items-center gap-1.5 cursor-pointer group flex-shrink-0 active:scale-95 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C] rounded-full p-1"
            >
              <div className={`relative w-14 h-14 rounded-full p-0.5 border-2 transition-all ${
                selectedMatch?.id === m.id ? 'border-[#E74F9C] scale-105' : 'border-slate-300'
              }`}>
                <img src={m.photo} alt="" aria-hidden="true" className="w-full h-full object-cover rounded-full" />
                {m.unread && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#E74F9C] border-2 border-white" aria-label="Unread messages badge" />
                )}
              </div>
              <span className="text-xs font-bold text-slate-800 truncate max-w-[64px]">{m.name}</span>
            </button>
          ))}
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-200" role="list" aria-label="Conversations list">
          {matches.map((m) => (
            <button
              key={m.id}
              role="listitem"
              aria-label={`Conversation with ${m.name}`}
              onClick={() => {
                setSelectedMatch(m);
                if (onSelectMatch) onSelectMatch(m.id);
              }}
              className={`w-full text-left p-4 flex items-center gap-3.5 cursor-pointer transition-all active:scale-98 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C] ${
                selectedMatch?.id === m.id ? 'bg-white border-l-4 border-[#E74F9C]' : 'hover:bg-slate-100'
              }`}
            >
              <img src={m.photo} alt={`${m.name}'s avatar`} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">{m.name}</h3>
                  <span className="text-[10px] text-slate-600 font-bold">{m.time}</span>
                </div>
                <p className="text-xs text-slate-700 truncate font-semibold mt-0.5">{m.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>

      </div>

      {/* Main Chat Thread Area */}
      {selectedMatch ? (
        <div className="flex-1 flex flex-col bg-white">
          
          {/* Chat Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <img src={selectedMatch.photo} alt={`${selectedMatch.name}'s photo`} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-extrabold text-slate-900">{selectedMatch.name}</h3>
                  {selectedMatch.verified && <ShieldCheck className="w-4 h-4 text-[#0d9488]" aria-label="Verified User" />}
                </div>
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
                  Active Now
                </span>
              </div>
            </div>

            {/* Quick Date Trigger & Call Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCoffeeInvite}
                aria-label={`Send coffee invite to ${selectedMatch.name}`}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-[#c01868] text-xs font-extrabold border border-rose-200 transition-all active:scale-95 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
              >
                <Coffee className="w-4 h-4 text-[#c01868]" aria-hidden="true" />
                <span>Invite to Coffee ☕</span>
              </button>
            </div>
          </div>

          {/* CONCEPTUAL INFOGRAPHIC AFFINITY BAR */}
          <div className="px-5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between overflow-x-auto text-left">
            <span className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1 flex-shrink-0 mr-2">
              <Sparkles className="w-3.5 h-3.5 text-[#E74F9C]" aria-hidden="true" />
              <span>Resonance Breakdown:</span>
            </span>
            <AffinityChipsInfographic />
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50" aria-live="polite">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs sm:max-w-md p-4 rounded-2xl text-xs sm:text-sm font-semibold shadow-sm ${
                  msg.sender === 'me'
                    ? 'bg-[#E74F9C] text-white rounded-br-none'
                    : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                }`}>
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className={`text-[10px] block mt-1 text-right font-bold ${
                    msg.sender === 'me' ? 'text-white' : 'text-slate-600'
                  }`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-slate-200 bg-white space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Message ${selectedMatch.name}...`}
                aria-label={`Message input for ${selectedMatch.name}`}
                className="flex-1 glass-input px-4 py-3 rounded-full text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
              />

              <button
                onClick={() => handleSendMessage()}
                aria-label="Send message"
                className="w-11 h-11 rounded-full bg-[#E74F9C] hover:bg-[#d43f8a] text-white flex items-center justify-center shadow-md active:scale-95 transition-all duration-200 cubic-bezier(0.34, 1.56, 0.64, 1) focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E74F9C]"
              >
                <Send className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
}
