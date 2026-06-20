import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useMemories } from '../lib/useMemories'
import MemoryGrid from '../components/MemoryGrid'
import GlowButton from '../components/GlowButton'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import { GalleryLoading, GalleryEmpty } from '../components/GalleryStates'

const EASE = [0.16, 1, 0.3, 1]

export default function AllMemories() {
  const { memories: all, loading, error } = useMemories()
  const [filter, setFilter] = useState('all')

  const counts = useMemo(
    () => ({
      all: all.length,
      image: all.filter((i) => i.type !== 'video').length,
      video: all.filter((i) => i.type === 'video').length,
    }),
    [all],
  )

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'image', label: 'Photos' },
    { key: 'video', label: 'Videos' },
  ]

  const items = useMemo(() => {
    if (filter === 'all') return all
    if (filter === 'video') return all.filter((i) => i.type === 'video')
    return all.filter((i) => i.type !== 'video')
  }, [all, filter])

  const hasMemories = !loading && all.length > 0

  return (
    <motion.main
      className="relative z-10 min-h-[100svh] px-5 pb-12 pt-24 sm:pt-28"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="mx-auto max-w-content">
        {/* Top bar */}
        <div className="mb-10 flex items-center justify-between gap-4">
          <GlowButton to="/" variant="ghost" icon="back">
            Back to Hydra
          </GlowButton>
          <span className="hidden text-xs uppercase tracking-[0.22em] text-slatey sm:inline">
            Team Hydra · The Archive
          </span>
        </div>

        {/* Heading */}
        <Reveal>
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-6xl">
            All <span className="text-gradient">Memories</span>
          </h1>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="mt-4 max-w-xl font-hand text-2xl text-ember-soft">
            Har ek pal, ek hi jagah.{hasMemories ? ` ${counts.all} moments and growing.` : ''}
          </p>
        </Reveal>

        {/* Filter chips with animated active pill (only when we have data) */}
        {hasMemories && (
          <Reveal delay={0.12}>
            <div className="mt-8 inline-flex rounded-full glass p-1.5">
              {filters.map((f) => {
                const isActive = filter === f.key
                return (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className="relative rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="filterPill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-hydra to-ember"
                        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? 'text-midnight-900' : 'text-slatey hover:text-ink'}`}>
                      {f.label}
                      <span className="ml-1.5 opacity-70">{counts[f.key]}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </Reveal>
        )}

        {/* Grid / states */}
        <div className="mt-10">
          {loading ? (
            <GalleryLoading count={8} />
          ) : all.length === 0 ? (
            <GalleryEmpty
              title="The archive is empty…"
              hint={
                error === 'not-configured'
                  ? 'Connect Supabase (copy .env.example → .env) and run supabase/setup.sql to populate it.'
                  : 'Add rows to the “memories” table in Supabase and they’ll show up here.'
              }
            />
          ) : items.length === 0 ? (
            <div className="grid place-items-center rounded-3xl glass py-24 text-center">
              <p className="font-hand text-3xl text-ember-soft">Yeh shelf abhi khaali hai…</p>
              <p className="mt-2 text-sm text-slatey">No {filter === 'video' ? 'videos' : 'photos'} yet — try another filter.</p>
            </div>
          ) : (
            <MemoryGrid key={filter} items={items} />
          )}
        </div>

        <div className="mt-14 flex justify-center">
          <GlowButton to="/" variant="ghost" icon="back">
            Back to Hydra
          </GlowButton>
        </div>
      </div>

      <Footer />
    </motion.main>
  )
}
