import { motion, useReducedMotion } from 'framer-motion'
import { content } from '../data/content'
import { useElapsed, useCountUp } from '../lib/hooks'

const EASE = [0.16, 1, 0.3, 1]
const pad = (n) => String(n).padStart(2, '0')

function CounterUnit({ value, label, live = false }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-2xl font-bold tabular-nums text-ink sm:text-3xl">
        {live ? pad(value) : value}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slatey sm:text-xs">
        {label}
      </span>
    </div>
  )
}

export default function Hero() {
  const reduce = useReducedMotion()
  const { hero } = content
  const { days, hours, minutes, seconds } = useElapsed(content.START_DATE)
  const animatedDays = useCountUp(days)

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 pt-24 pb-28 text-center"
    >
      {/* Kicker */}
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        className="mb-7 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-ember"
      >
        <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-ember shadow-[0_0_12px_#FBBF24]" />
        {hero.kicker}
      </motion.span>

      {/* Title with layered glow */}
      <div className="relative">
        <motion.div
          aria-hidden
          className="absolute inset-0 -z-10 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: reduce ? 0.4 : [0.35, 0.6, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(closest-side, rgba(251,191,36,0.45), transparent)' }}
        />
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          className="font-display text-[clamp(3.2rem,13vw,9rem)] font-bold leading-[0.95] tracking-tight"
        >
          <span className="relative inline-block overflow-hidden">
            <span className="text-gradient-flow">Team Hydra</span>
            {/* shine sweep */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent"
            />
          </span>
        </motion.h1>
      </div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
        className="mt-6 max-w-xl font-hand text-2xl text-ember-soft sm:text-3xl"
      >
        {hero.tagline}
      </motion.p>

      {/* Live counter */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.65 }}
        className="mt-12 w-full max-w-md"
      >
        <div className="glass animate-float rounded-4xl px-6 py-7 shadow-glass">
          <div className="flex items-baseline justify-center gap-3">
            <span className="font-display text-6xl font-bold tabular-nums text-gradient sm:text-7xl">
              {animatedDays.toLocaleString()}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium tracking-wide text-slatey">{hero.counterLabel}</p>

          <div className="mt-6 hairline" />

          {/* Live ticking sub-counter so it feels alive */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            <CounterUnit value={hours} label="hours" live />
            <CounterUnit value={minutes} label="minutes" live />
            <CounterUnit value={seconds} label="seconds" live />
          </div>
        </div>
      </motion.div>

      {/* Scroll-down indicator */}
      <motion.a
        href="#crew"
        aria-label="Scroll to meet the crew"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="group absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-slatey transition-colors group-hover:text-ink">
          Scroll
        </span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-ember"
            animate={reduce ? {} : { y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.a>
    </section>
  )
}
