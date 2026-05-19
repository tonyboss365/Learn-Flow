import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = 'CRITICAL: Supabase URL/Key is missing. Please stop your Vite server (Ctrl+C) and restart it (npm run dev) so it loads the new .env.local values!';
  console.error(errorMsg);
}

// Fallback to placeholder credentials if missing so that createClient does not throw a synchronous runtime exception on startup!
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co', 
  supabaseAnonKey || 'placeholder-anon-key'
);
