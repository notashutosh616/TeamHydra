import { supabase, isSupabaseConfigured } from './supabase'

// Public read of a key/value setting (used by the music button on the site).
export async function fetchSetting(key) {
  if (!isSupabaseConfigured || !supabase) return null
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .maybeSingle()
  if (error) return null
  return data?.value ?? null
}

export const fetchMusicUrl = () => fetchSetting('background_music')
