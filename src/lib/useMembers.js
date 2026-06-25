import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'
import { content } from '../data/content'

// Map a DB row → the shape MemberCard expects.
function mapRow(r) {
  return {
    id: r.id,
    name: r.name,
    nickname: r.nickname || '',
    accent: r.accent || '#FBBF24',
    stat: r.stat || '',
    photo: r.photo_url || '/assets/member1.svg',
    funnyLine: r.funny_line || '',
    message: r.message || '',
    city: r.city || '',
  }
}

// Public crew members. Starts from content.js (so the site renders instantly
// and still works if the table/Supabase isn't set up), then swaps in live data
// from the "members" table once loaded.
export function useMembers() {
  const [members, setMembers] = useState(content.crew.members)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return
    let on = true
    supabase
      .from('members')
      .select('*')
      .order('order_index', { ascending: true })
      .then(({ data, error }) => {
        if (!on || error || !data || data.length === 0) return
        setMembers(data.map(mapRow))
      })
    return () => {
      on = false
    }
  }, [])

  return members
}
