import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const legacyUrl = import.meta.env.VITE_LEGACY_SUPABASE_URL;
const legacyAnonKey = import.meta.env.VITE_LEGACY_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const legacySupabase = createClient(legacyUrl, legacyAnonKey);
