// Extract a YouTube video ID from any common URL format (or a bare 11-char ID).
// Handles: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID,
//          youtube.com/embed/ID, /v/ID, /live/ID, m. / -nocookie, extra params.
export function youtubeId(input) {
  if (!input) return null
  const s = String(input).trim()
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s // already an ID
  const m = s.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|v\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  )
  return m ? m[1] : null
}

export const youtubeEmbed = (input, params = '') => {
  const id = youtubeId(input)
  return id ? `https://www.youtube.com/embed/${id}${params}` : null
}

// hqdefault is always available; works for unlisted videos too.
export const youtubeThumb = (input) => {
  const id = youtubeId(input)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
}
