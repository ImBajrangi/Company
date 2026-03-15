// Project A: Shlokas/Text (Original Project)
const SUPABASE_URL_SHLOKA = 'https://tilimltxgeucefxzerqi.supabase.co';
const SUPABASE_KEY_SHLOKA = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpbGltbHR4Z2V1Y2VmeHplcnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjQyNTQsImV4cCI6MjA4MzIwMDI1NH0.lwaCJyTRW6jNsfQJ32R_wAwp11yj6bvsJ4fzC0EX_00';

// Project B: Gallery/Collections (Newer Project)
const SUPABASE_URL_GALLERY = 'https://lnsibpzjylkxhqsecxcg.supabase.co';
const SUPABASE_KEY_GALLERY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxuc2licHpqeWxreGhxc2VjeGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzOTY2MjksImV4cCI6MjA4Mzk3MjYyOX0.bNyBQrvBWk4-VAomg_5rZObHJUmSbdkh9CwDKV7aOO8';

function initSupabase() {
    if (typeof supabase !== 'undefined') {
        try {
            if (!window.supabaseShloka) {
                window.supabaseShloka = supabase.createClient(SUPABASE_URL_SHLOKA, SUPABASE_KEY_SHLOKA);
            }
            if (!window.supabaseGallery) {
                window.supabaseGallery = supabase.createClient(SUPABASE_URL_GALLERY, SUPABASE_KEY_GALLERY);
            }
            // For backward compatibility
            window.supabaseClient = window.supabaseGallery; 
            console.log('Supabase clients (Shloka & Gallery) initialized successfully.');
        } catch (e) {
            console.error('Failed to initialize Supabase clients:', e);
        }
    }
}

// Immediate attempt
initSupabase();
// Backup attempt in case direct script load is late
window.addEventListener('load', initSupabase);

/**
 * BRIDGE: Fetch any table from Firebase instead of Supabase
 * This resolves connection errors by using the stable Firebase Realtime DB.
 */
async function fetchFromFirebase(tableName) {
    try {
        if (!window.AuthService) {
            console.warn('AuthService (Firebase) not found.');
            return null;
        }
        
        // Map Supabase table names to Firebase paths if necessary
        const firebasePath = `public/${tableName === 'images' ? 'collections' : tableName}`;
        
        const { getDatabase, ref, get } = await import("firebase/database");
        const db = getDatabase();
        const dataRef = ref(db, firebasePath);
        const snapshot = await get(dataRef);
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            // Ensure data is consistently returned as an array
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
    // Standardize 'images' to 'collections'
    const internalTableName = tableName === 'images' ? 'collections' : tableName;
    console.log(`Bridge: Attempting to fetch "${tableName}" -> internal: "${internalTableName}"...`);
    
    // 1. Try Firebase first
    const firebaseData = await fetchFromFirebase(internalTableName);
    if (firebaseData) {
        console.log(`Bridge: Successfully fetched "${internalTableName}" from Firebase`);
        return firebaseData;
    }

    // 2. Fallback to Supabase
    try {
        initSupabase(); // Ensure initialization
        
        // SELECT THE CORRECT CLIENT
        // 'content' belongs to the Shloka project, 'collections' to the Gallery project
        let client = window.supabaseGallery;
        if (internalTableName === 'content') {
            client = window.supabaseShloka;
        }

        if (!client) throw new Error(`Supabase client for ${internalTableName} failed to initialize`);
        
        console.log(`Bridge: Falling back to Supabase (${client.restUrl}) table "${internalTableName}"...`);
        let query = client.from(internalTableName).select('*');
        
        // Basic sort support for 'content' table or others
        if (options.orderBy) {
            query = query.order(options.orderBy, { ascending: options.ascending ?? false });
        }

        const { data, error } = await query;

        if (error) throw error;
        console.log(`Bridge: Successfully fetched "${internalTableName}" from Supabase`);
        return data;
    } catch (error) {
        console.error(`Bridge: All sources failed for "${internalTableName}":`, error.message);
        return null;
    }
}

// Legacy helper for Pictures/Gallery module
async function fetchImagesFromSupabase() {
    return await fetchFromDatabase('images');
}

// Helper for Sketch/Paath module
async function fetchContentFromSupabase() {
    return await fetchFromDatabase('content', { orderBy: 'created_at', ascending: false });
}

// Expose globally for modules not using imports
window.fetchFromDatabase = fetchFromDatabase;
window.fetchImagesFromSupabase = fetchImagesFromSupabase;
window.fetchContentFromSupabase = fetchContentFromSupabase;
