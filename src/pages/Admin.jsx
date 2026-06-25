import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import MemoriesManager from '../components/admin/MemoriesManager'
import MembersManager from '../components/admin/MembersManager'
import MusicManager from '../components/admin/MusicManager'

const EASE = [0.16, 1, 0.3, 1]

function Shell({ children }) {
  return (
    <motion.main
      className="relative z-10 min-h-[100svh] px-5 py-10 sm:py-14"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {children}
    </motion.main>
  )
}

function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    const { error } = await signIn(email, password)
    if (error) setErr(error.message || 'Login failed')
    setBusy(false)
  }

  return (
    <Shell>
      <div className="mx-auto flex min-h-[70svh] max-w-sm flex-col justify-center">
        <div className="glass rounded-4xl p-7 shadow-glass">
          <p className="text-center text-xs uppercase tracking-[0.25em] text-ember">Team Hydra</p>
          <h1 className="mt-1 text-center font-display text-3xl font-bold text-ink">Admin Den</h1>
          <p className="mt-1 text-center text-sm text-slatey">Sirf andar walon ke liye. 🔒</p>

          <form onSubmit={submit} className="mt-6 space-y-3">
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-ink placeholder:text-slatey/60 focus:border-ember/50 focus:outline-none"
            />
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-ink placeholder:text-slatey/60 focus:border-ember/50 focus:outline-none"
            />
            {err && <p className="text-sm text-ember-soft">{err}</p>}
            <button
              type="submit"
              disabled={busy}
              className="relative w-full overflow-hidden rounded-full px-6 py-3 text-sm font-bold text-midnight-900 shadow-ember disabled:opacity-50"
            >
              <span className="absolute inset-0 animate-gradient-pan bg-gradient-to-r from-hydra via-ember to-hydra bg-[length:200%_auto]" />
              <span className="relative z-10">{busy ? 'Andar aa rahe ho…' : 'Enter'}</span>
            </button>
          </form>
        </div>
        <Link to="/" className="mt-6 text-center text-xs text-slatey transition-colors hover:text-ink">
          ← Wapas site pe
        </Link>
      </div>
    </Shell>
  )
}

export default function Admin() {
  const { loading, user, configured, signOut, role, isAdmin } = useAuth()
  const [tab, setTab] = useState('memories')

  if (!configured)
    return (
      <Shell>
        <div className="mx-auto max-w-md pt-20 text-center text-sm text-slatey">
          Supabase configured nahi hai. <code>.env</code> me URL + anon key daal.
        </div>
      </Shell>
    )

  if (loading)
    return (
      <Shell>
        <div className="grid min-h-[60svh] place-items-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-hydra/30 border-t-hydra" />
        </div>
      </Shell>
    )

  if (!user) return <Login />

  // Members can only manage Memories; the Member-profiles editor is admin-only.
  const tabs = isAdmin
    ? [
        { key: 'memories', label: 'Memories' },
        { key: 'members', label: 'Members' },
        { key: 'music', label: 'Music' },
      ]
    : [{ key: 'memories', label: 'Memories' }]
  // Any non-Memories tab is admin-only.
  const activeTab = tab !== 'memories' && !isAdmin ? 'memories' : tab

  return (
    <Shell>
      <div className="mx-auto max-w-3xl">
        {/* header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-ember">Team Hydra</p>
            <h1 className="font-display text-3xl font-bold text-ink">Admin</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slatey sm:inline">{user.email}</span>
            <span
              className="rounded-full glass px-3 py-1 text-[11px] font-semibold"
              style={{ color: isAdmin ? '#FBBF24' : '#34D399' }}
            >
              {role ? `Logged in as: ${role}` : '…'}
            </span>
            <Link to="/" className="rounded-full glass px-4 py-2 text-ink transition-colors hover:text-ember">
              View site
            </Link>
            <button
              onClick={signOut}
              className="rounded-full glass px-4 py-2 text-ember-soft transition-colors hover:text-ember"
            >
              Logout
            </button>
          </div>
        </div>

        {/* tabs */}
        <div className="mt-6 inline-flex rounded-full glass p-1.5">
          {tabs.map((t) => {
            const isActive = tab === t.key
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="relative rounded-full px-5 py-2 text-sm font-semibold transition-colors"
              >
                {isActive && (
                  <motion.span
                    layoutId="adminTab"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-hydra to-ember"
                    transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  />
                )}
                <span className={`relative z-10 ${isActive ? 'text-midnight-900' : 'text-slatey hover:text-ink'}`}>
                  {t.label}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-8">
          {activeTab === 'members' && isAdmin ? (
            <MembersManager />
          ) : activeTab === 'music' && isAdmin ? (
            <MusicManager />
          ) : (
            <MemoriesManager />
          )}
        </div>
      </div>
    </Shell>
  )
}
