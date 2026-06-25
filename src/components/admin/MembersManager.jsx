import { useEffect, useRef, useState } from 'react'
import { fetchMembersAdmin, updateMember, uploadToBucket } from '../../lib/adminData'

const FIELDS = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'nickname', label: 'Nickname', type: 'text' },
  { key: 'city', label: 'Home city', type: 'text' },
  { key: 'funny_line', label: 'Funny line', type: 'textarea' },
  { key: 'message', label: 'Personal message', type: 'textarea' },
]

function MemberRow({ m }) {
  const [form, setForm] = useState({
    name: m.name || '',
    nickname: m.nickname || '',
    city: m.city || '',
    funny_line: m.funny_line || '',
    message: m.message || '',
  })
  const [photo, setPhoto] = useState(m.photo_url)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)
  const fileRef = useRef(null)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const save = async () => {
    setSaving(true)
    setMsg(null)
    try {
      await updateMember(m.id, form)
      setMsg({ type: 'ok', text: 'Saved ✓' })
    } catch (e) {
      setMsg({ type: 'err', text: e.message })
    }
    setSaving(false)
  }

  const onPhoto = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setSaving(true)
    setMsg(null)
    try {
      const { url } = await uploadToBucket(f, 'members')
      await updateMember(m.id, { photo_url: url })
      setPhoto(url)
      setMsg({ type: 'ok', text: 'Photo updated ✓' })
    } catch (err) {
      setMsg({ type: 'err', text: err.message })
    }
    setSaving(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="glass rounded-3xl p-5" style={{ borderColor: `color-mix(in srgb, ${m.accent || '#FBBF24'} 35%, transparent)` }}>
      <div className="flex flex-col gap-5 sm:flex-row">
        {/* photo */}
        <div className="flex shrink-0 flex-col items-center gap-3">
          <div className="h-28 w-24 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
            {photo ? <img src={photo} alt={form.name} className="h-full w-full object-cover" /> : null}
          </div>
          <label className="cursor-pointer rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:text-ember">
            Change photo
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhoto} />
          </label>
        </div>

        {/* fields */}
        <div className="flex-1 space-y-3">
          {FIELDS.map((fld) =>
            fld.type === 'textarea' ? (
              <label key={fld.key} className="block">
                <span className="mb-1 block text-xs uppercase tracking-[0.16em] text-slatey">{fld.label}</span>
                <textarea
                  rows={2}
                  value={form[fld.key]}
                  onChange={(e) => set(fld.key, e.target.value)}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-ink focus:border-ember/50 focus:outline-none"
                />
              </label>
            ) : (
              <label key={fld.key} className="block">
                <span className="mb-1 block text-xs uppercase tracking-[0.16em] text-slatey">{fld.label}</span>
                <input
                  type="text"
                  value={form[fld.key]}
                  onChange={(e) => set(fld.key, e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-ink focus:border-ember/50 focus:outline-none"
                />
              </label>
            ),
          )}

          <div className="flex items-center justify-between gap-3 pt-1">
            <span className={`text-sm ${msg?.type === 'ok' ? 'text-hydra' : 'text-ember-soft'}`}>{msg?.text}</span>
            <button
              onClick={save}
              disabled={saving}
              className="rounded-full px-5 py-2 text-sm font-bold text-midnight-900 shadow-ember disabled:opacity-50"
              style={{ background: m.accent || '#FBBF24' }}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MembersManager() {
  const [members, setMembers] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    fetchMembersAdmin()
      .then(setMembers)
      .catch((e) =>
        setErr(
          /schema cache|does not exist|PGRST205|42P01/i.test(e.message || '')
            ? 'members table nahi mili — supabase/admin-setup.sql chala.'
            : e.message,
        ),
      )
  }, [])

  if (err) return <p className="rounded-2xl glass p-6 text-center text-sm text-ember-soft">{err}</p>
  if (!members) return <p className="py-10 text-center text-sm text-slatey">Loading…</p>
  if (members.length === 0)
    return <p className="rounded-2xl glass p-6 text-center text-sm text-slatey">Koi member nahi — admin-setup.sql ka seed chala.</p>

  return (
    <div className="space-y-4">
      {members.map((m) => (
        <MemberRow key={m.id} m={m} />
      ))}
    </div>
  )
}
