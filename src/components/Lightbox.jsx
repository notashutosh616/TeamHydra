import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollLock } from '../lib/hooks'
import { pauseScroll, resumeScroll } from '../lib/smoothScroll'

const EASE = [0.16, 1, 0.3, 1]

function Icon({ path, className = 'h-6 w-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {path}
    </svg>
  )
}

export default function Lightbox({ items, index, onClose, onNavigate }) {
  const open = index !== null && index >= 0
  useScrollLock(open)

  // Pause Lenis momentum scrolling while the lightbox is open.
  useEffect(() => {
    if (open) pauseScroll()
    return () => resumeScroll()
  }, [open])

  const go = useCallback(
    (dir) => {
      if (!open) return
      const next = (index + dir + items.length) % items.length
      onNavigate(next)
    },
    [open, index, items.length, onNavigate],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go, onClose])

  const item = open ? items[index] : null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Memory viewer"
        >
          {/* Scrim */}
          <div className="absolute inset-0 bg-midnight-900/85 backdrop-blur-md" />

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-20 rounded-full glass p-3 text-ink transition-colors hover:text-ember"
          >
            <Icon path={<><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>} className="h-5 w-5" />
          </button>

          {/* Prev / Next */}
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); go(-1) }}
                aria-label="Previous"
                className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full glass p-3 text-ink transition-colors hover:text-ember sm:left-6"
              >
                <Icon path={<path d="m15 18-6-6 6-6" />} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); go(1) }}
                aria-label="Next"
                className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full glass p-3 text-ink transition-colors hover:text-ember sm:right-6"
              >
                <Icon path={<path d="m9 18 6-6-6-6" />} />
              </button>
            </>
          )}

          {/* Content */}
          <motion.figure
            key={index}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="relative z-10 flex max-h-[88vh] w-full max-w-5xl flex-col items-center"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-glass">
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  poster={item.poster}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[80vh] w-auto max-w-full bg-black"
                >
                  Your browser doesn’t support embedded video.
                </video>
              ) : (
                <img
                  src={item.src}
                  alt={item.caption || 'Team Hydra memory'}
                  className="max-h-[80vh] w-auto max-w-full object-contain"
                />
              )}
            </div>
            {item.caption && (
              <figcaption className="mt-4 text-center font-hand text-2xl text-ember-soft">
                {item.caption}
              </figcaption>
            )}
            <span className="mt-1 text-xs tracking-widest text-slatey">
              {index + 1} / {items.length}
            </span>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
