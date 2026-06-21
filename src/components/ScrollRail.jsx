import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { smoothScrollTo } from '../lib/smoothScroll'

// A vertical "journey" timeline down the left edge (desktop only).
// The thread fills as you scroll; nodes mark each chapter of the friendship.
const STOPS = [
  { id: 'hero', label: 'Origin' },
  { id: 'crew', label: 'The Five' },
  { id: 'memories', label: 'Memories' },
  { id: 'india', label: 'India' },
  { id: 'next', label: 'Onward' },
]

export default function ScrollRail() {
  const { scrollYProgress } = useScroll()
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const emberTop = useTransform(fill, (v) => `${v * 100}%`)
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const els = STOPS.map((s) => document.getElementById(s.id)).filter(Boolean)
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <nav
      aria-label="Page sections"
      className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative flex flex-col items-center gap-8">
        {/* track */}
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/12" />
        {/* progress fill */}
        <motion.div
          className="absolute left-1/2 top-0 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-hydra to-ember"
          style={{ height: '100%', scaleY: fill }}
        />
        {/* an ember travelling down the thread as you scroll */}
        <motion.span
          className="absolute left-1/2 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember"
          style={{ top: emberTop, boxShadow: '0 0 12px 3px rgba(251,191,36,0.8)' }}
        />

        {STOPS.map((s) => {
          const isActive = active === s.id
          return (
            <button
              key={s.id}
              onClick={() => smoothScrollTo(`#${s.id}`)}
              className="group pointer-events-auto relative flex items-center"
              aria-label={`Go to ${s.label}`}
              aria-current={isActive ? 'true' : undefined}
            >
              <span
                className={`relative z-10 h-3 w-3 rounded-full border transition-all duration-300 ${
                  isActive
                    ? 'scale-125 border-ember bg-ember shadow-[0_0_12px_#FBBF24]'
                    : 'border-white/40 bg-midnight-800 group-hover:border-ember'
                }`}
              />
              <span
                className={`absolute left-6 whitespace-nowrap text-xs uppercase tracking-[0.18em] transition-all duration-300 ${
                  isActive ? 'text-ink opacity-100' : 'text-slatey opacity-0 group-hover:opacity-100'
                }`}
              >
                {s.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
