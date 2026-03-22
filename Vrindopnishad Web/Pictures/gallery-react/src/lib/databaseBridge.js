// Sacred Database Bridge for Chitra Vrinda
import { supabase } from './supabaseClient';
import localizedData from '../../../../class/json/collections_data.json';

// --- Sacred Cache Logic ---
const CACHE_KEY = 'sacred_gallery_cache';
const CACHE_TTL = 3600000; // 1 hour

const SacredCache = {
    get: (key) => {
        try {
            const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
            const item = cache[key];
            if (item && Date.now() - item.timestamp < CACHE_TTL) {
                console.log(`SacredCache: Hit for ${key}`);
                return item.data;
            }
            return null;
        } catch (e) {
            return null;
        }
    },
    set: (key, data) => {
        try {
            const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
            cache[key] = { data, timestamp: Date.now() };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
            console.log(`SacredCache: Saved ${key}`);
        } catch (e) {
            console.warn('SacredCache: Storage full or unavailable');
        }
    }
};

const FIREBASE_CONFIG = {
    databaseURL: "https://santvaanig-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "santvaanig"
};

/**
 * Dynamically loads Firebase SDK components
 */
async function getFirebaseDB() {
    try {
        const { initializeApp, getApp, getApps } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
        const { getDatabase, ref, get } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js");

        let app;
        const appName = "sacred_content_sync";
        
        if (getApps().length > 0 && getApps().find(a => a.name === appName)) {
            app = getApp(appName);
        } else {
            app = initializeApp(FIREBASE_CONFIG, appName);
        }

        return { db: getDatabase(app), ref, get };
    } catch (error) {
        console.error("Failed to load Firebase SDK:", error);
        return null;
    }
}

/**
 * Fetch collections from multiple sources with priority
 */
export async function fetchSacredCollections() {
    // 0. Try Cache FIRST
    const cached = SacredCache.get('collections');
    if (cached) return cached;

    // 1. Try Localized Data FIRST (Instant, Zero CORS, Production Standard)
    try {
        if (localizedData) {
            console.log("Bridge: Successfully synchronized with Localized Production Data");
            SacredCache.set('collections', localizedData.collections);
            return localizedData.collections;
        }
    } catch (error) {
        console.warn("Bridge: Local data access issue:", error.message);
    }

    // 2. Fallback to Firebase (External Sync)
    try {
        const firebase = await getFirebaseDB();
        if (firebase) {
            const { db, ref, get } = firebase;
            const collectionsRef = ref(db, 'public/collections');
            const snapshot = await get(collectionsRef);
            
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log("Bridge: Successfully fetched from Firebase Sync");
                return processData(data);
            }
        }
    } catch (error) {
        // Silencing "Permission denied" or other SDK noise
        console.debug("Bridge: Firebase sync unavailable");
    }

    // 3. Last Resort: Supabase (Legacy/Placeholder)
    try {
        const { data, error } = await supabase.from('collections').select('*');
        if (!error && data) {
            return { featured: { title: "Featured Collections", items: data } };
        }
    } catch (error) {
        console.error("Bridge: All sources failed");
    }

    return null;
}

/**
 * Processes Firebase data into a structured format if needed
 */
function processData(data) {
    if (Array.isArray(data)) {
        // If it's a flat array, group by category or section
        const structured = {
            featured: { title: "Featured Collections", items: [] }
        };
        data.forEach(item => {
            const section = item.cat_section || 'featured';
            if (!structured[section]) {
                structured[section] = { title: section.charAt(0).toUpperCase() + section.slice(1) + " Collections", items: [] };
            }
            structured[section].items.push(item);
        });
        return structured;
    }
    // If it's already an object (like the JSON structure), return as is
    return data;
}

/**
 * Fetch site configuration and hero details
 */
export async function fetchSacredConfig() {
    // 0. Try Cache FIRST
    const cached = SacredCache.get('config');
    if (cached) return cached;

    try {
        if (localizedData) {
            const config = {
                siteConfig: localizedData.siteConfig,
                heroSection: localizedData.heroSection
            };
            SacredCache.set('config', config);
            return config;
        }
    } catch (error) {
        console.warn("Bridge: Config fallback failed:", error);
    }
    return null;
}
