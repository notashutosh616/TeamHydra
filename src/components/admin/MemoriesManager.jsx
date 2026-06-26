import { useEffect, useRef, useState } from 'react'
import { fetchMemoriesAdmin, addMemory, addYouTube, deleteMemory, updateMemory } from '../../lib/adminData'
import { youtubeThumb } from '../../lib/youtube'
import { useAuth } from '../../lib/auth'

function Note({ msg }) {
  if (!msg) return null
  return <p className={`text-sm ${msg.type === 'ok' ? 'text-hydra' : 'text-ember-soft'}`}>{msg.text}</p>
}

// Small preview (handles image / video / youtube), with graceful fallback.
function Thumb({ it }) {
  if (it.type === 'video') {
    return <video src={it.src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
  }
  const src = it.type === 'youtube' ? youtubeThumb(it.src) : it.src
  return (
    <img
      src={src}
      alt={it.caption || 'memory'}
      onError={(e) => {
        e.currentTarget.style.opacity = '0'
      }}
      className="h-full w-full object-cover"
    />
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
  const [ytUrl, setYtUrl] = useState('')
  const [ytCaption, setYtCaption] = useState('')
  const [ytBusy, setYtBusy] = useState(false)
  const [ytMsg, setYtMsg] = useState(null)
  const [saved, setSaved] = useState(false)
  const [listMsg, setListMsg] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchMemoriesAdmin()
      setItems([...data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)))
    } catch (e) {
      setMsg({ type: 'err', text: tableErr(e) })
    }
    setLoading(false)
  }
  useEffect(() => {
    load()
  }, [])

  const flashSaved = () => {
    setListMsg(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 1600)
  }

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

  const onAddYouTube = async () => {
    if (!ytUrl.trim() || ytBusy) return
    setYtBusy(true)
    setYtMsg(null)
    try {
      await addYouTube({ url: ytUrl, caption: ytCaption })
      setYtMsg({ type: 'ok', text: 'YouTube video add ho gaya — public site pe live hai 🎬' })
      setYtUrl('')
      setYtCaption('')
      await load()
    } catch (e) {
      setYtMsg({ type: 'err', text: e.message || 'Add failed' })
    }
    setYtBusy(false)
  }

  const onDelete = async (row) => {
    if (!window.confirm('Yeh memory delete kar du? File + row dono hat jayenge, wapas nahi aayega.')) return
    try {
      await deleteMemory(row)
      setItems((prev) => prev.filter((i) => i.id !== row.id))
      flashSaved()
    } catch (e) {
      setListMsg({ type: 'err', text: e.message })
    }
  }

  // Show/hide on the public site (instant).
  const toggleVisible = async (row) => {
    const next = row.is_visible === false // hidden → show, else hide
    setItems((prev) => prev.map((i) => (i.id === row.id ? { ...i, is_visible: next } : i)))
    try {
      await updateMemory(row.id, { is_visible: next })
      flashSaved()
    } catch (e) {
      setItems((prev) => prev.map((i) => (i.id === row.id ? { ...i, is_visible: !next } : i)))
      setListMsg({ type: 'err', text: e.message })
    }
  }

  // Reorder with up/down arrows → saves sort_order.
  const move = async (index, dir) => {
    const target = index + dir
    if (target < 0 || target >= items.length) return
    const arr = [...items]
    ;[arr[index], arr[target]] = [arr[target], arr[index]]
    const origById = Object.fromEntries(items.map((o) => [o.id, o.sort_order ?? 0]))
    const reseq = arr.map((it, idx) => ({ ...it, sort_order: idx }))
    setItems(reseq)
    try {
      await Promise.all(
        reseq
          .filter((it, idx) => origById[it.id] !== idx)
          .map((it) => updateMemory(it.id, { sort_order: it.sort_order })),
      )
      flashSaved()
    } catch (e) {
      setListMsg({ type: 'err', text: e.message })
      load()
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
              <span className="relative z-10">{uploading ? 'Uploading…' : 'Upload'}</span>
            </button>
          </div>
          {uploading && (
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/3 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-ember to-transparent" />
            </div>
          )}
        </div>
      </div>

      {/* YouTube card */}
      <div className="glass rounded-3xl p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold text-ink">YouTube video add kar</h3>
        <p className="mt-1 text-sm text-slatey">
          Koi bhi normal YouTube link paste kar — watch, youtu.be, ya shorts. Embed code ki zaroorat nahi.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <input
            type="url"
            value={ytUrl}
            onChange={(e) => setYtUrl(e.target.value)}
            placeholder="Paste YouTube link"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-ink placeholder:text-slatey/60 focus:border-ember/50 focus:outline-none"
          />
          <input
            type="text"
            value={ytCaption}
            maxLength={120}
            onChange={(e) => setYtCaption(e.target.value)}
            placeholder="Caption (optional)"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-ink placeholder:text-slatey/60 focus:border-ember/50 focus:outline-none"
          />
          <div className="flex items-center justify-between gap-3">
            <Note msg={ytMsg} />
            <button
              onClick={onAddYouTube}
              disabled={!ytUrl.trim() || ytBusy}
              className="relative ml-auto inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-2.5 text-sm font-bold text-midnight-900 shadow-ember disabled:opacity-50"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-hydra to-ember" />
              <span className="relative z-10">{ytBusy ? 'Adding…' : 'Add Video'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Manage list — order + show/hide */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink">Manage memories</h3>
          <span className="text-xs">
            {saved ? <span className="font-semibold text-hydra">Saved ✓</span> : <span className="text-slatey">{items.length} items</span>}
          </span>
        </div>
        <p className="mb-3 text-xs text-slatey">
          Arrows se order set kar (upar = public site pe pehle). Eye se show/hide. Public site sirf "shown"
          wali, isi order me dikhata hai.
        </p>
        {listMsg && <p className="mb-3 text-sm text-ember-soft">{listMsg.text}</p>}

        {loading ? (
          <p className="py-10 text-center text-sm text-slatey">Loading…</p>
        ) : items.length === 0 ? (
          <p className="rounded-2xl glass py-10 text-center text-sm text-slatey">Abhi koi memory nahi. Upar se add kar.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((it, idx) => {
              const visible = it.is_visible !== false
              return (
                <li
                  key={it.id}
                  className={`flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 transition-opacity ${visible ? '' : 'opacity-45'}`}
                >
                  {/* preview */}
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-black/40">
                    <Thumb it={it} />
                    <span className="absolute left-1 top-1 rounded bg-midnight-900/70 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-ink backdrop-blur">
                      {it.type}
                    </span>
                  </div>

                  {/* info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink">
                      {it.caption || <span className="text-slatey">No caption</span>}
                    </p>
                    {!visible && (
                      <span className="mt-1 inline-block rounded-full bg-ember/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ember-soft">
                        Hidden
                      </span>
                    )}
                  </div>

                  {/* reorder */}
                  <div className="flex flex-col">
                    <button
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                      aria-label="Move up"
                      className="grid h-6 w-6 place-items-center rounded text-slatey hover:text-ink disabled:opacity-30"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                    </button>
                    <button
                      onClick={() => move(idx, 1)}
                      disabled={idx === items.length - 1}
                      aria-label="Move down"
                      className="grid h-6 w-6 place-items-center rounded text-slatey hover:text-ink disabled:opacity-30"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </button>
                  </div>

                  {/* show / hide */}
                  <button
                    onClick={() => toggleVisible(it)}
                    aria-label={visible ? 'Hide from public site' : 'Show on public site'}
                    title={visible ? 'Hide from public site' : 'Show on public site'}
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors ${visible ? 'bg-hydra/15 text-hydra hover:bg-hydra/25' : 'bg-white/10 text-slatey hover:text-ink'}`}
                  >
                    {visible ? (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                    ) : (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.9 4.2A11 11 0 0 1 12 4c6.5 0 10 7 10 7a18 18 0 0 1-2.3 3.2M6.7 6.7A18 18 0 0 0 2 11s3.5 7 10 7a11 11 0 0 0 4.1-.8" /><path d="m3 3 18 18" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>
                    )}
                  </button>

                  {/* delete (admin only) */}
                  {isAdmin && (
                    <button
                      onClick={() => onDelete(it)}
                      aria-label="Delete memory"
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-ember-soft transition-colors hover:bg-red-500/80 hover:text-white"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
                    </button>
                  )}
                </li>
              )
            })}
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
