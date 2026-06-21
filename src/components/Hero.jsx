import { motion, useReducedMotion } from 'framer-motion'
import { content } from '../data/content'
import { smoothScrollTo } from '../lib/smoothScroll'
import HeroCounter from './HeroCounter'
import Parallax from './Parallax'

const EASE = [0.16, 1, 0.3, 1]

// Letter-by-letter reveal config
const letters = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.2 } },
}
const letter = {
  hidden: { y: '0.6em', opacity: 0, rotateX: -55 },
  show: { y: '0em', opacity: 1, rotateX: 0, transition: { duration: 0.8, ease: EASE } },
}

export default function Hero() {
  const reduce = useReducedMotion()
  const { hero } = content

  const title = hero.title.split('')

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
        className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-ember"
      >
        <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-ember shadow-[0_0_12px_#FBBF24]" />
        {hero.kicker}
      </motion.span>

      {/* Title — letter-by-letter cinematic reveal */}
      <div className="relative" style={{ perspective: 800 }}>
        <motion.div
          aria-hidden
          className="absolute inset-0 -z-10 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: reduce ? 0.4 : [0.35, 0.6, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(closest-side, rgba(251,191,36,0.4), transparent)' }}
        />
        <motion.h1
          variants={letters}
          initial="hidden"
          animate="show"
          aria-label={hero.title}
          className="flex flex-wrap justify-center font-display text-[clamp(3rem,12vw,8.5rem)] font-bold leading-[0.95] tracking-tight"
        >
          {title.map((ch, i) => {
            const isSpace = ch === ' '
            return (
              <motion.span
                key={i}
                variants={letter}
                className={`inline-block text-gradient-flow ${isSpace ? 'w-[0.35em]' : ''}`}
                style={{ transformOrigin: 'bottom' }}
              >
                {isSpace ? '' : ch}
              </motion.span>
            )
          })}
        </motion.h1>
      </div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
        className="mt-6 max-w-xl font-hand text-2xl text-ember-soft sm:text-3xl"
      >
        {hero.tagline}
      </motion.p>

      {/* Live counter (slight parallax for depth) */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
        className="mt-12 w-full max-w-md"
      >
        <Parallax speed={-0.12}>
          <HeroCounter />
        </Parallax>
      </motion.div>

      {/* Scroll-down indicator */}
      <motion.button
        onClick={() => smoothScrollTo('#crew')}
        aria-label="Scroll to meet the crew"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="group absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-slatey transition-colors group-hover:text-ink">
          {hero.scrollHint}
        </span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-ember"
            animate={reduce ? {} : { y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.button>
    </section>
  )
}
