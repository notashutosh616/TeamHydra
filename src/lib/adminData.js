import { supabase } from './supabase'

export const BUCKET = 'hydra-media'
export const AUDIO_BUCKET = 'hydra-audio'

// ── Storage ────────────────────────────────────────────────────────────────
export async function uploadToBucket(file, folder = 'media', bucket = BUCKET) {
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase()
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  })
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return { url: data.publicUrl, path }
}

// Recover the storage path from a public URL so we can delete the file.
export function storagePathFromUrl(url, bucket = BUCKET) {
  if (!url) return null
  const marker = `/storage/v1/object/public/${bucket}/`
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

// ── Settings / background music ──────────────────────────────────────────
export async function setSetting(key, value) {
  const { error } = await supabase
    .from('settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  if (error) throw error
}

// Upload an audio file to the audio bucket and set it as the background music.
export async function uploadAudioTrack(file, prevUrl = null) {
  const { url } = await uploadToBucket(file, 'tracks', AUDIO_BUCKET)
  await setSetting('background_music', url)
  // best-effort cleanup of the previous track file
  if (prevUrl && prevUrl !== url) {
    const old = storagePathFromUrl(prevUrl, AUDIO_BUCKET)
    if (old) await supabase.storage.from(AUDIO_BUCKET).remove([old]).catch(() => {})
  }
  return url
}
