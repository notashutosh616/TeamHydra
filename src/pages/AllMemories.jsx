import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { content } from '../data/content'
import { useMemories } from '../lib/useMemories'
import MemoryGrid from '../components/MemoryGrid'
import GlowButton from '../components/GlowButton'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import { GalleryLoading, GalleryEmpty } from '../components/GalleryStates'

const EASE = [0.16, 1, 0.3, 1]
const copy = content.memories
const archive = copy.archive

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
    { key: 'all', label: 'Sab' },
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
            {archive.back}
          </GlowButton>
          <span className="hidden text-xs uppercase tracking-[0.22em] text-slatey sm:inline">
            {archive.eyebrow}
          </span>
        </div>

        {/* Heading */}
        <Reveal>
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-6xl">
            {archive.titleLead} <span className="text-gradient">{archive.titleAccent}</span>
          </h1>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="mt-4 max-w-xl font-hand text-2xl text-ember-soft">
            {archive.subtitle.replace('{count}', hasMemories ? counts.all : 0)}
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
              title={copy.empty.title}
              hint={error === 'not-configured' ? copy.empty.hintSetup : copy.empty.hint}
            />
          ) : items.length === 0 ? (
            <div className="grid place-items-center rounded-3xl glass py-24 text-center">
              <p className="font-hand text-3xl text-ember-soft">{copy.empty.filtered}</p>
            </div>
          ) : (
            <MemoryGrid key={filter} items={items} />
          )}
        </div>

        <div className="mt-14 flex justify-center">
          <GlowButton to="/" variant="ghost" icon="back">
            {archive.back}
          </GlowButton>
        </div>
      </div>

      <Footer />
    </motion.main>
  )
}
