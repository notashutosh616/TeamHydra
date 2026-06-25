import { useEffect, useRef, useState } from 'react'
import { fetchSetting } from '../../lib/settings'
import { uploadAudioTrack } from '../../lib/adminData'

export default function MusicManager() {
  const [currentUrl, setCurrentUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState(null)
  const fileRef = useRef(null)

  const load = async () => {
    setLoading(true)
    setCurrentUrl(await fetchSetting('background_music'))
    setLoading(false)
  }
  useEffect(() => {
    load()
  }, [])

  const onUpload = async () => {
    if (!file || uploading) return
    setUploading(true)
    setMsg(null)
    try {
      const url = await uploadAudioTrack(file, currentUrl)
      setCurrentUrl(url)
      setFile(null)
      if (fileRef.current) fileRef.current.value = ''
      setMsg({ type: 'ok', text: 'Naya track set! Campfire button ab isi ko bajayega 🎵' })
    } catch (e) {
      setMsg({ type: 'err', text: e.message || 'Upload failed' })
    }
    setUploading(false)
  }

  const trackName = currentUrl ? decodeURIComponent(currentUrl.split('/').pop()) : null

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold text-ink">Background music</h3>
        <p className="mt-1 text-sm text-slatey">
          Apna track (mp3) upload kar — site ka campfire button isi ko bajayega.
        </p>

        {/* current track */}
        <div className="mt-4">
          {loading ? (
            <p className="text-sm text-slatey">Loading…</p>
          ) : currentUrl ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-hydra">Abhi set hai</p>
              <p className="mt-1 truncate text-sm text-ink">{trackName}</p>
              <audio controls src={currentUrl} className="mt-3 w-full">
                Your browser doesn’t support audio.
              </audio>
            </div>
          ) : (
            <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slatey">
              Abhi koi custom track nahi — default campfire crackle chal raha hai. Niche se ek mp3 daal.
            </p>
          )}
        </div>

        {/* upload */}
        <div className="mt-5 flex flex-col gap-3">
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-3 text-sm text-ink transition-colors hover:border-ember/50">
            <span className="truncate">{file ? file.name : 'Choose an audio file (mp3)…'}</span>
            <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">Browse</span>
            <input
              ref={fileRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          <div className="flex items-center justify-between gap-3">
            <span className={`text-sm ${msg?.type === 'ok' ? 'text-hydra' : 'text-ember-soft'}`}>{msg?.text}</span>
            <button
              onClick={onUpload}
              disabled={!file || uploading}
              className="relative ml-auto inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-2.5 text-sm font-bold text-midnight-900 shadow-ember disabled:opacity-50"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-hydra to-ember" />
              <span className="relative z-10">{uploading ? 'Uploading…' : currentUrl ? 'Replace track' : 'Set as music'}</span>
            </button>
          </div>
          {uploading && (
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/3 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-ember to-transparent" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
