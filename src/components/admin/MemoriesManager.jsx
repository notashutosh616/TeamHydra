import { useEffect, useRef, useState } from 'react'
import { fetchMemoriesAdmin, addMemory, deleteMemory } from '../../lib/adminData'
import { useAuth } from '../../lib/auth'

function Note({ msg }) {
  if (!msg) return null
  return (
    <p className={`text-sm ${msg.type === 'ok' ? 'text-hydra' : 'text-ember-soft'}`}>{msg.text}</p>
  )
}

export default function MemoriesManager() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState(null)
  const fileRef = useRef(null)

  const load = async () => {
    setLoading(true)
    try {
      setItems(await fetchMemoriesAdmin())
    } catch (e) {
      setMsg({ type: 'err', text: tableErr(e) })
    }
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
      await addMemory({ file, caption })
      setMsg({ type: 'ok', text: 'Uploaded! Public site pe live hai 🔥' })
      setFile(null)
      setCaption('')
      if (fileRef.current) fileRef.current.value = ''
      await load()
    } catch (e) {
      setMsg({ type: 'err', text: e.message || 'Upload failed' })
    }
    setUploading(false)
  }

  const onDelete = async (row) => {
    if (!window.confirm('Yeh memory delete kar du? File + row dono hat jayenge, wapas nahi aayega.')) return
    try {
      await deleteMemory(row)
      setItems((prev) => prev.filter((i) => i.id !== row.id))
    } catch (e) {
      setMsg({ type: 'err', text: e.message })
    }
  }

  return (
    <div className="space-y-8">
      {/* Upload card */}
      <div className="glass rounded-3xl p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold text-ink">Nayi yaad add kar</h3>
        <p className="mt-1 text-sm text-slatey">
          {isAdmin
            ? 'Photo ya video chun, caption likh, upload daba. Bas.'
            : 'Photo chun, caption likh, upload daba. (Delete sirf admin kar sakta hai.)'}
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-3 text-sm text-ink transition-colors hover:border-ember/50">
            <span className="truncate">{file ? file.name : 'Choose image / video…'}</span>
            <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">Browse</span>
            <input
              ref={fileRef}
              type="file"
              accept={isAdmin ? 'image/*,video/*' : 'image/*'}
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          <input
            type="text"
            value={caption}
            maxLength={120}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption (optional)"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-ink placeholder:text-slatey/60 focus:border-ember/50 focus:outline-none"
          />

          <div className="flex items-center justify-between gap-3">
            <Note msg={msg} />
            <button
              onClick={onUpload}
              disabled={!file || uploading}
              className="relative ml-auto inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-2.5 text-sm font-bold text-midnight-900 shadow-ember disabled:opacity-50"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-hydra to-ember" />
              <span className="relative z-10">
                {uploading ? 'Uploading…' : 'Upload'}
              </span>
            </button>
          </div>
          {uploading && (
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/3 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-ember to-transparent" />
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink">Saari yaadein</h3>
          <span className="text-xs text-slatey">{items.length} items</span>
        </div>

        {loading ? (
          <p className="py-10 text-center text-sm text-slatey">Loading…</p>
        ) : items.length === 0 ? (
          <p className="rounded-2xl glass py-10 text-center text-sm text-slatey">Abhi koi memory nahi. Upar se add kar.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((it) => (
              <li key={it.id} className="group relative overflow-hidden rounded-2xl border border-white/10">
                <div className="aspect-square bg-black/30">
                  {it.type === 'video' ? (
                    <video src={it.src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                  ) : (
                    <img src={it.src} alt={it.caption || 'memory'} className="h-full w-full object-cover" />
                  )}
                </div>
                {it.caption && (
                  <p className="truncate px-2 py-1.5 text-[11px] text-slatey">{it.caption}</p>
                )}
                {isAdmin && (
                  <button
                    onClick={() => onDelete(it)}
                    aria-label="Delete memory"
                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-midnight-900/80 text-ember-soft opacity-0 backdrop-blur transition-opacity hover:bg-red-500/80 hover:text-white group-hover:opacity-100"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    </svg>
                  </button>
                )}
                <span className="absolute left-2 top-2 rounded-full bg-midnight-900/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink backdrop-blur">
                  {it.type}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function tableErr(e) {
  if (/schema cache|does not exist|PGRST205|42P01/i.test(e.message || '')) {
    return 'memories table nahi mili — pehle supabase/setup.sql chala.'
  }
  return e.message || 'Error'
}
