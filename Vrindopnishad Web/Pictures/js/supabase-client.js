// Vrindopnishad Supabase Client (Consolidated)
const SUPABASE_URL = 'https://tilimltxgeucefxzerqi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpbGltbHR4Z2V1Y2VmeHplcnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjQyNTQsImV4cCI6MjA4MzIwMDI1NH0.lwaCJyTRW6jNsfQJ32R_wAwp11yj6bvsJ4fzC0EX_00';

function initSupabase() {
    if (typeof supabase !== 'undefined') {
        try {
            if (!window.supabaseClient) {
                window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                // Backward compatibility for dual-client names if they are used elsewhere
                window.supabaseShloka = window.supabaseClient;
                window.supabaseGallery = window.supabaseClient;
                console.log('Supabase client initialized (tilimltxgeucefxzerqi)');
            }
        } catch (e) {
            console.error('Failed to initialize Supabase client:', e);
        }
    }
}

// Immediate attempt
initSupabase();
// Backup attempt
window.addEventListener('load', initSupabase);

/**
 * BRIDGE: Fetch any table from Firebase instead of Supabase
 */
async function fetchFromFirebase(tableName) {
    try {
        const { initializeApp, getApp, getApps } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
        const { getDatabase, ref, get } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js");

        // Isolated Config for Sketch Content
        const santVaanigConfig = {
            databaseURL: "https://santvaanig-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "santvaanig"
        };

        // Ensure we don't interfere with the main app in auth.js
        let contentApp;
        const appName = "santvaanig_content";
        
        try {
            contentApp = getApp(appName);
        } catch (e) {
            contentApp = initializeApp(santVaanigConfig, appName);
        }

        const db = getDatabase(contentApp);
        const firebasePath = `public/${tableName === 'images' ? 'collections' : tableName}`;
        const dataRef = ref(db, firebasePath);
        const snapshot = await get(dataRef);
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            return Array.isArray(data) ? data : Object.values(data);
        }
        return null;
    } catch (error) {
        console.error(`Error fetching ${tableName} from Firebase:`, error.message);
        return null;
    }
}

/**
 * Generalized fetch function that tries Firebase first, falls back to Supabase.
 */
async function fetchFromDatabase(tableName, options = {}) {
    const internalTableName = tableName === 'images' ? 'collections' : tableName;
    console.log(`Bridge: Primary source attempt (Firebase) for "${tableName}"...`);
    
    // 1. Try Firebase first (Primary Source)
    const firebaseData = await fetchFromFirebase(internalTableName);
    if (firebaseData) {
        console.log(`Bridge: Successfully fetched "${internalTableName}" from Firebase`);
        return firebaseData;
    }

    // 2. Fallback to Supabase (Secondary Source)
    try {
        console.warn(`Bridge: Firebase failed for "${internalTableName}", falling back to Supabase...`);
        initSupabase(); 
        const client = window.supabaseClient;
        if (!client) throw new Error(`Supabase client not ready`);
        
        let query = client.from(internalTableName).select('*');
        if (options.orderBy) {
            query = query.order(options.orderBy, { ascending: options.ascending ?? false });
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Bridge: All sources failed for "${internalTableName}":`, error.message);
        return null;
    }
}

// Helpers
async function fetchImagesFromSupabase() { return await fetchFromDatabase('images'); }
async function fetchContentFromSupabase() { return await fetchFromDatabase('content', { orderBy: 'created_at', ascending: false }); }

// Global Exposure
window.initSupabase = initSupabase;
window.fetchFromDatabase = fetchFromDatabase;
window.fetchImagesFromSupabase = fetchImagesFromSupabase;
window.fetchContentFromSupabase = fetchContentFromSupabase;
