import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'

// Map a raw DB row → the shape the gallery/lightbox expects.
// Canonical columns: type, src, poster, caption, span, created_at.
// (A couple of common alternative names are tolerated as fallbacks.)
function normalize(row) {
  return {
    id: row.id,
    type: row.type === 'video' || row.type === 'youtube' ? row.type : 'image',
    src: row.src ?? row.url ?? row.media_url ?? '',
    poster: row.poster ?? row.thumbnail ?? null,
    caption: row.caption ?? '',
    span: row.span ?? null,
    created_at: row.created_at ?? null,
  }
}

// Fetches all rows from the "memories" table, newest first.
// Returns { memories, loading, error } where error can be:
//   'not-configured' → no .env credentials yet
//   <string>         → a Supabase/network error message
export function useMemories() {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    async function load() {
      if (!isSupabaseConfigured || !supabase) {
        setError('not-configured')
        setMemories([])
        setLoading(false)
        return
      }

      setLoading(true)
      const { data, error: dbError } = await supabase
        .from('memories')
        .select('*')
        .order('created_at', { ascending: false })

      if (!active) return

      if (dbError) {
        setError(dbError.message)
        setMemories([])
      } else {
        setMemories((data ?? []).map(normalize))
        setError(null)
      }
      setLoading(false)
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return { memories, loading, error }
}
