// Sacred Database Bridge for Chitra Vrinda
import { supabase } from './supabaseClient';
import localizedData from '../../../../class/json/collections_data.json';

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
    console.log("Bridge: Fetching Sacred Collections (Priority: Local -> Firebase -> Supabase)");

    // 1. Try Localized Data FIRST (Instant, Zero CORS, Production Standard)
    try {
        if (localizedData) {
            console.log("Bridge: Successfully synchronized with Localized Production Data");
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
    try {
        if (localizedData) {
            return {
                siteConfig: localizedData.siteConfig,
                heroSection: localizedData.heroSection
            };
        }
    } catch (error) {
        console.warn("Bridge: Config fallback failed:", error);
    }
    return null;
}
