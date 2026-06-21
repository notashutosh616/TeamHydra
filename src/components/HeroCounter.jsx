import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { content } from '../data/content'
import { useElapsed, useCountUp } from '../lib/hooks'

const EASE = [0.16, 1, 0.3, 1]
const pad = (n) => String(n).padStart(2, '0')

// A single digit that flips over when it changes.
function FlipDigit({ char }) {
  return (
    <span
      className="relative inline-block w-[0.62em] overflow-hidden text-center"
      style={{ perspective: 240 }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={char}
          initial={{ rotateX: -90, opacity: 0, y: '45%' }}
          animate={{ rotateX: 0, opacity: 1, y: '0%' }}
          exit={{ rotateX: 90, opacity: 0, y: '-45%' }}
          transition={{ duration: 0.42, ease: EASE }}
          className="inline-block [backface-visibility:hidden]"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function FlipUnit({ value, label }) {
  const s = pad(value)
  return (
    <div className="flex flex-col items-center">
      <span className="flex font-display text-2xl font-bold tabular-nums text-ink sm:text-3xl">
        <FlipDigit char={s[0]} />
        <FlipDigit char={s[1]} />
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slatey sm:text-xs">{label}</span>
    </div>
  )
}

export default function HeroCounter() {
  const { hero } = content
  const { days, hours, minutes, seconds } = useElapsed(content.START_DATE)
  const animatedDays = useCountUp(days)

  // Fire a little spark each time the seconds tick.
  const [spark, setSpark] = useState(0)
  const prev = useRef(seconds)
  useEffect(() => {
    if (seconds !== prev.current) {
      prev.current = seconds
      setSpark((s) => s + 1)
    }
  }, [seconds])

  return (
    <div className="glass animate-float relative rounded-4xl px-6 py-7 shadow-glass">
      {/* breathing aura */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-4xl opacity-60 blur-2xl"
        style={{ background: 'radial-gradient(circle at 50% 30%, rgba(251,191,36,0.25), transparent 70%)' }}
      />

      <div className="relative flex items-baseline justify-center">
        <span
          className="font-display text-6xl font-bold tabular-nums text-gradient sm:text-7xl"
          style={{ filter: 'drop-shadow(0 0 22px rgba(251,191,36,0.35))' }}
        >
          {animatedDays.toLocaleString()}
        </span>

        {/* spark on each tick */}
        <AnimatePresence>
          <motion.span
            key={spark}
            className="pointer-events-none absolute -right-1 -top-2 h-2 w-2 rounded-full bg-ember"
            initial={{ scale: 0.4, opacity: 0.9, boxShadow: '0 0 0px 0px rgba(251,191,36,0.8)' }}
            animate={{ scale: 2.4, opacity: 0, boxShadow: '0 0 18px 6px rgba(251,191,36,0)' }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </AnimatePresence>
      </div>

      <p className="mt-1 text-center text-sm font-medium tracking-wide text-slatey">{hero.counterLabel}</p>

      <div className="mt-6 hairline" />

      <div className="mt-5 grid grid-cols-3 gap-2">
        <FlipUnit value={hours} label="hours" />
        <FlipUnit value={minutes} label="minutes" />
        <FlipUnit value={seconds} label="seconds" />
      </div>
    </div>
  )
}
