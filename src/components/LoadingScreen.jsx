import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { content } from '../data/content'
import { pauseScroll, resumeScroll } from '../lib/smoothScroll'

const SEEN_KEY = 'hydra_seen'
const EASE = [0.16, 1, 0.3, 1]
const MESSAGES = content.ui?.loaderMessages?.length ? content.ui.loaderMessages : ['Loading…']

// Cinematic first-load: dark → a spark ignites → warm light spreads → reveal.
export default function LoadingScreen() {
  const reduce = useReducedMotion()
  const [show, setShow] = useState(() => {
    try {
      return sessionStorage.getItem(SEEN_KEY) !== '1'
    } catch {
      return true
    }
  })
  const [mi, setMi] = useState(0)

  useEffect(() => {
    if (!show) return
    pauseScroll()
    document.body.style.overflow = 'hidden'
    const hold = reduce ? 2400 : 5000
    const t = setTimeout(() => setShow(false), hold)
    // ~1.2s per caption so each funny line is comfortably readable
    const rot = setInterval(() => setMi((i) => (i + 1) % MESSAGES.length), 1200)
    return () => {
      clearTimeout(t)
      clearInterval(rot)
    }
  }, [show, reduce])

  useEffect(() => {
    if (show) return
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* ignore */
    }
    document.body.style.overflow = ''
    resumeScroll()
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ backgroundColor: '#0b0f16' }}
        >
          {/* warm light spreading outward from the spark */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.5), rgba(251,191,36,0.16) 35%, transparent 60%)' }}
            initial={{ scale: reduce ? 0.6 : 0.05, opacity: 0 }}
            animate={{ scale: reduce ? 0.8 : [0.05, 0.8, 0.62], opacity: reduce ? 0.5 : [0, 0.85, 0.45] }}
            transition={{ duration: reduce ? 0.6 : 1.8, delay: reduce ? 0 : 0.2, ease: EASE }}
          />

          {/* the igniting spark */}
          {!reduce && (
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: 'radial-gradient(circle, #FFF8E7, #FBBF24 50%, transparent 75%)', boxShadow: '0 0 30px 10px rgba(251,191,36,0.8)' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.8, 1.1], opacity: [0, 1, 0.9] }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          )}

          {/* content revealed by the light */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: reduce ? 0.1 : 0.7, ease: EASE }}
          >
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="text-gradient-flow">Team Hydra</span>
            </h1>

            <div className="mt-3 flex h-7 items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={mi}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="font-hand text-xl text-ember-soft"
                >
                  {MESSAGES[mi]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mt-6 h-[3px] w-44 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-hydra to-ember"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: reduce ? 1.8 : 4.7, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
