import React, { useState, useEffect } from 'react';
import { X, Send, Users, Sparkles, MessageSquare, ShieldCheck, Volume2, Coffee } from 'lucide-react';
import { cacheManager } from '../utils/cacheManager';

export default function CircleGroupChatModal({ circle, isOpen, onClose, onStartPrivateChat }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (circle) {
      const initialMsgs = cacheManager.get(`circle_chat_${circle.id}`, [
        {
          id: "m1",
          senderName: "Aria Thorne",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          text: `Welcome to ${circle.name}! Anyone down for a coffee & vinyl run this Saturday? ☕🎶`,
          time: "10:30 AM",
          isMe: false
        },
        {
          id: "m2",
          senderName: "Julian Rivera",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
          text: "Count me in! I just found a rare jazz pressing at the local market.",
          time: "10:32 AM",
          isMe: false
        }
      ]);
      setMessages(initialMsgs);
    }
  }, [circle]);

  if (!isOpen || !circle) return null;

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      senderName: "You",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    cacheManager.set(`circle_chat_${circle.id}`, updated);
    setInputText('');

    setTimeout(() => {
      const autoMsg = {
        id: (Date.now() + 1).toString(),
        senderName: "Chloe Chen",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        text: "That sounds super cozy! Let's meet at Blue Bottle Cafe around 3pm ☕✨",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      };
      setMessages(prev => {
        const next = [...prev, autoMsg];
        cacheManager.set(`circle_chat_${circle.id}`, next);
        return next;
      });
    }, 1500);
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="circle-chat-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn text-left"
    >
      <div className="relative w-full max-w-3xl h-[85vh] rounded-[36px] border border-slate-200 bg-white overflow-hidden shadow-2xl flex flex-col justify-between">
        
        {/* Circle Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex-shrink-0 bg-amber-50 p-0.5">
              <img src="/illustrations/team_doodle.png" alt="Group Hangout Doodle Illustration" className="w-full h-full object-cover rounded-xl select-none" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="circle-chat-title" className="text-lg font-extrabold text-slate-900">{circle.name}</h3>
                <span className="px-3 py-0.5 rounded-full bg-rose-50 text-[#c01868] text-[10px] font-extrabold border border-rose-200">
                  {circle.members} Members
                </span>
              </div>
              <p className="text-xs text-slate-700 font-extrabold">{circle.description}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close circle group chat"
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200 active:scale-95 transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Group Messages Thread */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/60 text-left" aria-live="polite">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}
            >
              <img src={msg.avatar} alt={`${msg.senderName}'s avatar`} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
              <div className={`max-w-md p-4 rounded-2xl text-xs sm:text-sm font-semibold shadow-sm ${
                msg.isMe
                  ? 'bg-[#E74F9C] text-white rounded-tr-none'
                  : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
              }`}>
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className={`text-[11px] font-extrabold ${msg.isMe ? 'text-white' : 'text-[#c01868]'}`}>
                    {msg.senderName}
                  </span>
                  <span className={`text-[10px] font-bold ${msg.isMe ? 'text-white' : 'text-slate-600'}`}>
                    {msg.time}
                  </span>
                </div>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Message ${circle.name}...`}
              aria-label={`Message input for ${circle.name}`}
              className="flex-1 glass-input px-4 py-3 rounded-full text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E74F9C]"
            />
            <button
              onClick={handleSendMessage}
              aria-label="Send group message"
              className="w-11 h-11 rounded-full bg-[#E74F9C] hover:bg-[#d43f8a] text-white flex items-center justify-center shadow-md active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E74F9C]"
            >
              <Send className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
