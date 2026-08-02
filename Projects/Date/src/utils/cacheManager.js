// Cache Manager for SoulSync / Date App
// Provides instant in-memory lookup with LocalStorage persistence

const CACHE_KEYS = {
  LIKES: 'soulsync_likes',
  PASSES: 'soulsync_passes',
  SUPERLIKES: 'soulsync_superlikes',
  MATCHES: 'soulsync_matches',
  CHATS: 'soulsync_chats',
  QUIZ: 'soulsync_quiz_result',
  USER_PROFILE: 'soulsync_user_profile',
  FILTERS: 'soulsync_filters',
};

class CacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.init();
  }

  init() {
    Object.values(CACHE_KEYS).forEach((key) => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          this.memoryCache.set(key, JSON.parse(stored));
        }
      } catch (e) {
        console.warn(`Failed to load ${key} from storage`, e);
      }
    });
  }

  get(key, defaultValue = null) {
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }
    return defaultValue;
  }

  set(key, value) {
    this.memoryCache.set(key, value);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Failed to persist ${key}`, e);
    }
  }

  // Swipe Cache Helpers
  getLikes() {
    return this.get(CACHE_KEYS.LIKES, []);
  }

  addLike(profileId) {
    const likes = Array.from(new Set([...this.getLikes(), profileId]));
    this.set(CACHE_KEYS.LIKES, likes);
  }

  getPasses() {
    return this.get(CACHE_KEYS.PASSES, []);
  }

  addPass(profileId) {
    const passes = Array.from(new Set([...this.getPasses(), profileId]));
    this.set(CACHE_KEYS.PASSES, passes);
  }

  getSuperlikes() {
    return this.get(CACHE_KEYS.SUPERLIKES, []);
  }

  addSuperlike(profileId) {
    const superlikes = Array.from(new Set([...this.getSuperlikes(), profileId]));
    this.set(CACHE_KEYS.SUPERLIKES, superlikes);
    this.addLike(profileId);
  }

  // Matches Cache
  getMatches() {
    return this.get(CACHE_KEYS.MATCHES, []);
  }

  addMatch(matchObject) {
    const current = this.getMatches();
    const updated = [matchObject, ...current.filter(m => m.id !== matchObject.id)];
    this.set(CACHE_KEYS.MATCHES, updated);
  }

  // Chats Cache
  getChats() {
    return this.get(CACHE_KEYS.CHATS, {});
  }

  getChatForUser(profileId) {
    const chats = this.getChats();
    return chats[profileId] || [];
  }

  getChatMessages(profileId) {
    return this.getChatForUser(profileId);
  }

  addChatMessage(profileId, message) {
    const chats = this.getChats();
    const userThread = chats[profileId] || [];
    chats[profileId] = [...userThread, message];
    this.set(CACHE_KEYS.CHATS, chats);
  }

  // User Profile
  getUserProfile() {
    return this.get(CACHE_KEYS.USER_PROFILE, {
      name: "Alex Vance",
      age: 26,
      bio: "Product designer who loves minimalist aesthetics, matcha lattes, and late-night stargazing 🌟. Looking for meaningful conversations.",
      photos: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
      ],
      verified: true,
      attachmentStyle: "Secure Base",
      intent: "Long-term Partner",
      audioIntro: "Hey there! Ask me about my favorite coffee spots.",
      interests: ["Design", "Vinyl Records", "Hiking", "Bouldering", "AI Tech"]
    });
  }

  saveUserProfile(profile) {
    this.set(CACHE_KEYS.USER_PROFILE, profile);
  }

  // Filter Preferences
  getFilters() {
    return this.get(CACHE_KEYS.FILTERS, {
      maxDistance: 25,
      ageRange: [21, 35],
      verifiedOnly: false,
      intentFilter: "All",
    });
  }

  saveFilters(filters) {
    this.set(CACHE_KEYS.FILTERS, filters);
  }

  clearAll() {
    this.memoryCache.clear();
    localStorage.clear();
  }
}

export const cacheManager = new CacheManager();
