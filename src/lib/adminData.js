import { supabase } from './supabase'

export const BUCKET = 'hydra-media'

// ── Storage ────────────────────────────────────────────────────────────────
export async function uploadToBucket(file, folder = 'media') {
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase()
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, path }
}

// Recover the storage path from a public URL so we can delete the file.
export function storagePathFromUrl(url) {
  if (!url) return null
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const i = url.indexOf(marker)
  return i >= 0 ? url.slice(i + marker.length) : null
}

// ── Memories ─────────────────────────────────────────────────────────────
export async function fetchMemoriesAdmin() {
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function addMemory({ file, caption }) {
  const { url, path } = await uploadToBucket(file, 'memories')
  const type = (file.type || '').startsWith('video') ? 'video' : 'image'
  const row = { type, src: url, caption: caption?.trim() || null }
  const { data, error } = await supabase.from('memories').insert(row).select().single()
  if (error) {
    // roll back the uploaded file if the row insert failed
    await supabase.storage.from(BUCKET).remove([path]).catch(() => {})
    throw error
  }
  return data
}

export async function deleteMemory(row) {
  const paths = [storagePathFromUrl(row.src), storagePathFromUrl(row.poster)].filter(Boolean)
  if (paths.length) await supabase.storage.from(BUCKET).remove(paths).catch(() => {})
  const { error } = await supabase.from('memories').delete().eq('id', row.id)
  if (error) throw error
}

// ── Members ──────────────────────────────────────────────────────────────
export async function fetchMembersAdmin() {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('order_index', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function updateMember(id, patch) {
  const { data, error } = await supabase.from('members').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}
