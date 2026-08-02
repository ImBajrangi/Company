export const MOCK_PROFILES = [
  {
    id: "p1",
    name: "Aria Thorne",
    age: 24,
    occupation: "Architect & Spatial Designer",
    location: "Downtown, 3 miles away",
    distanceKm: 4.8,
    verified: true,
    compatibilityScore: 96,
    attachmentStyle: "Secure / Growth",
    intent: "Long-term Connection",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80"
    ],
    bio: "Obsessed with Scandinavian brutalism, rooftop sunsets, and discovering cozy indie vinyl cafes. Seeking someone who enjoys deep conversations over espresso.",
    audioSnippet: "Hey! If you can guess my favorite 90s jazz album, coffee is on me ☕✨",
    prompts: [
      { question: "My simple pleasures", answer: "Fresh rain on hot asphalt and warm sourdough with sea salt." },
      { question: "Together we could", answer: "Build a miniature greenhouse or plan a spontaneous weekend roadtrip to the coast." }
    ],
    interests: ["Architecture", "Vinyl Records", "Matcha", "Photography", "Art Galleries"],
    radar: {
      emotional: 95,
      communication: 98,
      lifestyle: 92,
      spontaneity: 88
    }
  },
  {
    id: "p2",
    name: "Julian Rivera",
    age: 27,
    occupation: "Creative Director & Producer",
    location: "West End, 5 miles away",
    distanceKm: 8.0,
    verified: true,
    compatibilityScore: 91,
    attachmentStyle: "Warm / Secure",
    intent: "Deep Connection",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80"
    ],
    bio: "Filmmaker by day, synth-wave producer by night. Big fan of night drives, sourdough baking, and deep talks under the stars.",
    audioSnippet: "Working on a new synth track right now... would love to share a preview with you!",
    prompts: [
      { question: "The key to my heart is", answer: "A passion for art, honesty, and knowing where to find the best tacos." },
      { question: "Fun fact about me", answer: "I once directed a music video that got screened at an underground film festival!" }
    ],
    interests: ["Cinema", "Music Production", "Sourdough", "Night Drives", "Travel"],
    radar: {
      emotional: 90,
      communication: 92,
      lifestyle: 94,
      spontaneity: 95
    }
  },
  {
    id: "p3",
    name: "Elena Rostova",
    age: 25,
    occupation: "Bio-Tech Researcher",
    location: "Science Park, 2 miles away",
    distanceKm: 3.2,
    verified: true,
    compatibilityScore: 94,
    attachmentStyle: "Analytic / Secure",
    intent: "Intentional Dating",
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1000&q=80"
    ],
    bio: "Decoding cellular dynamics during the day, bouldering and sipping natural wines by evening. Curious mind looking for an intellectual match.",
    audioSnippet: "Let's debate whether time travel is physically possible over a glass of Pinot Noir 🍷",
    prompts: [
      { question: "I get irrationally excited about", answer: "Crisp autumn mornings and discovering raw, unreleased acoustic tracks." }
    ],
    interests: ["Bouldering", "Genomics", "Natural Wine", "Sci-Fi Books", "Astronomy"],
    radar: {
      emotional: 88,
      communication: 96,
      lifestyle: 95,
      spontaneity: 86
    }
  },
  {
    id: "p4",
    name: "Marcus Vance",
    age: 28,
    occupation: "UX Strategy Lead",
    location: "Arts District, 4 miles away",
    distanceKm: 6.4,
    verified: false,
    compatibilityScore: 89,
    attachmentStyle: "Empathetic / Expressive",
    intent: "Coffee & Dates",
    photos: [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80"
    ],
    bio: "Crafting digital experiences. When I'm not tweaking pixels, I'm roasting specialty coffee or exploring hidden hiking trails.",
    audioSnippet: "I roast my own coffee beans on weekends! Let's pour a fresh V60 brew.",
    prompts: [
      { question: "I'll know it's working when", answer: "We can share comfortable silence without needing to fill every second." }
    ],
    interests: ["Coffee Roasting", "UX Design", "Hiking", "Podcasts", "Minimalism"],
    radar: {
      emotional: 85,
      communication: 91,
      lifestyle: 89,
      spontaneity: 90
    }
  },
  {
    id: "p5",
    name: "Chloe Chen",
    age: 23,
    occupation: "Fashion Stylist & Curator",
    location: "Fashion District, 1 mile away",
    distanceKm: 1.6,
    verified: true,
    compatibilityScore: 98,
    attachmentStyle: "Deep Empathy",
    intent: "Long-term Connection",
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=80"
    ],
    bio: "Vintage enthusiast, ceramic artist, and dog mom to a golden retriever named Miso. Looking for genuine warmth and shared laughter.",
    audioSnippet: "Miso says hi! 🐶 We're currently making pottery and listening to Fleetwood Mac.",
    prompts: [
      { question: "My golden rule", answer: "Kindness is magnetic. Always leave people feeling better than you found them." }
    ],
    interests: ["Vintage Fashion", "Ceramics", "Golden Retrievers", "Indie Pop", "Baking"],
    radar: {
      emotional: 99,
      communication: 95,
      lifestyle: 96,
      spontaneity: 92
    }
  }
];

export const INITIAL_MATCHES = [
  {
    id: "p1",
    name: "Aria Thorne",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    lastMessage: "I loved that cafe recommendation! Are you free this Thursday evening?",
    time: "2m ago",
    unread: true,
    verified: true
  },
  {
    id: "p5",
    name: "Chloe Chen",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    lastMessage: "Miso approved your profile picture 🐾 haha!",
    time: "1h ago",
    unread: false,
    verified: true
  }
];
