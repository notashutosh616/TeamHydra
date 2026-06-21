import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { content } from '../data/content'
import { pauseScroll, resumeScroll } from '../lib/smoothScroll'

const SEEN_KEY = 'hydra_seen'

const MESSAGES =
  content.ui?.loaderMessages?.length ? content.ui.loaderMessages : ['Loading…']

export default function LoadingScreen() {
  const reduce = useReducedMotion()
  // Only on the first visit of the session.
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

    const hold = reduce ? 900 : 2300
    const t = setTimeout(() => setShow(false), hold)
    const rot = setInterval(() => setMi((i) => (i + 1) % MESSAGES.length), 650)
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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-midnight-800"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* warm glow pool */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[50vh] w-[50vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.16), transparent 65%)' }}
          />

          <motion.h1
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl font-bold tracking-tight sm:text-5xl"
          >
            <span className="text-gradient-flow">Team Hydra</span>
          </motion.h1>

          {/* rotating funny loader lines */}
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

          {/* progress line */}
          <div className="mt-6 h-[3px] w-44 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-hydra to-ember"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: reduce ? 0.8 : 2.1, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
