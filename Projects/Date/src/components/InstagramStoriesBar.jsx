import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import StoryViewerModal from './StoryViewerModal';
import StoryCreatorModal from './StoryCreatorModal';

const INITIAL_STORIES = [
  {
    id: 'user-my-story',
    author: 'You (My Story)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    hasUnseen: true,
    stories: [
      {
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
        caption: 'Pour-over coffee session & jazz vinyl record afternoon ☕✨',
        location: 'Blue Bottle Coffee',
        time: '30m ago'
      }
    ]
  },
  {
    id: 'story-1',
    author: 'Aria Thorne',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    verified: true,
    hasUnseen: true,
    stories: [
      {
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        caption: 'Exploring minimalist brutalist architecture walks downtown 🏛️',
        location: 'Downtown Art Museum',
        time: '1h ago'
      },
      {
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
        caption: 'Matcha lattes before vinyl digging!',
        location: 'Vintage Groove Cafe',
        time: '20m ago'
      }
    ]
  },
  {
    id: 'story-2',
    author: 'Julian Rivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    verified: true,
    hasUnseen: true,
    stories: [
      {
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
        caption: 'Natural biodynamic wine tasting & indie cinema prep 🍷',
        location: 'Bar Pinot',
        time: '2h ago'
      }
    ]
  },
  {
    id: 'story-3',
    author: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    verified: true,
    hasUnseen: true,
    stories: [
      {
        image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80',
        caption: 'Weekend bouldering session followed by cold brew! 🧗‍♀️',
        location: 'Movement Gym',
        time: '3h ago'
      }
    ]
  },
  {
    id: 'story-4',
    author: 'Chloe Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    verified: false,
    hasUnseen: false,
    stories: [
      {
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
        caption: 'Rooftop golden hour stargazing 🌅',
        location: 'Rooftop West',
        time: '5h ago'
      }
    ]
  }
];

export default function InstagramStoriesBar({ onReplyToUser }) {
  const [storyGroups, setStoryGroups] = useState(INITIAL_STORIES);
  const [activeStoryGroup, setActiveStoryGroup] = useState(null);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  const handleAddStory = (newStoryItem) => {
    setStoryGroups(prev => {
      const myStory = prev[0];
      const updatedMyStory = {
        ...myStory,
        hasUnseen: true,
        stories: [newStoryItem, ...myStory.stories]
      };
      return [updatedMyStory, ...prev.slice(1)];
    });
  };

  return (
    <div className="w-full glass-card rounded-[32px] p-4 border border-slate-200 bg-white shadow-sm space-y-3 text-left">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <img
            src="/illustrations/dancing_hearts.png"
            alt="Playful Stories Indicator"
            className="w-7 h-7 object-contain drop-shadow-sm flex-shrink-0"
          />
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Soul Stories & Daily Status Updates
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-bold">Tap to view • 24h expiration</span>
      </div>

      {/* Stories Avatar Ring Bar */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none px-1">
        
        {/* Your Story Button (+ Badge) */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
          <div className="relative w-16 h-16 rounded-full p-0.5 border-2 border-slate-200 group-hover:border-[#E74F9C] transition-all">
            <img
              src={storyGroups[0].avatar}
              alt="Your Story"
              onClick={() => setActiveStoryGroup(storyGroups[0])}
              className="w-full h-full object-cover rounded-full"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsCreatorOpen(true);
              }}
              className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#E74F9C] text-white flex items-center justify-center border-2 border-white shadow-md hover:scale-110 active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-[11px] font-extrabold text-slate-800 truncate w-16 text-center">Your Story</span>
        </div>

        {/* Friend Stories */}
        {storyGroups.slice(1).map((group) => (
          <div
            key={group.id}
            onClick={() => setActiveStoryGroup(group)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
          >
            <div className={`w-16 h-16 rounded-full p-0.5 transition-all group-hover:scale-105 ${
              group.hasUnseen
                ? 'bg-gradient-to-tr from-[#E74F9C] via-purple-500 to-[#50D4D5]'
                : 'border-2 border-slate-200'
            }`}>
              <img
                src={group.avatar}
                alt={group.author}
                className="w-full h-full object-cover rounded-full border-2 border-white"
              />
            </div>
            <span className="text-[11px] font-extrabold text-slate-800 truncate w-16 text-center">
              {group.author.split(' ')[0]}
            </span>
          </div>
        ))}

      </div>

      {/* Story Viewer Modal */}
      <StoryViewerModal
        storiesGroup={activeStoryGroup}
        isOpen={!!activeStoryGroup}
        onClose={() => setActiveStoryGroup(null)}
        onReply={onReplyToUser}
      />

      {/* Story Creator Modal */}
      <StoryCreatorModal
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onAddStory={handleAddStory}
      />

    </div>
  );
}
