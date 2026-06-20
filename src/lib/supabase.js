import { createClient } from '@supabase/supabase-js'

// Credentials are read from your .env file (see .env.example).
// In Vite, only variables prefixed with VITE_ are exposed to the browser.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// True once both values are present in .env
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  // Friendly nudge instead of a hard crash, so the site still runs before setup.
  console.warn(
    '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.\n' +
      'Copy .env.example → .env and fill in your project URL + anon key.',
  )
}

// Only create the client when configured; otherwise stays null and the
// gallery shows a friendly "connect Supabase" state.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
