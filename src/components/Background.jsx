import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Deterministic pseudo-random so SSR/CSR + re-renders stay stable.
function makeRng(seed) {
  let s = seed
  return () => ((s = (s * 9301 + 49297) % 233280), s / 233280)
}

// A single drifting amber "firefly".
function Firefly({ x, size, delay, duration, drift, opacity }) {
  return (
    <motion.span
      className="absolute rounded-full bg-ember"
      style={{
        left: `${x}%`,
        bottom: '-5%',
        width: size,
        height: size,
        filter: 'blur(0.5px)',
        boxShadow: `0 0 ${size * 3}px ${size}px rgba(251,191,36,0.35)`,
      }}
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: ['0vh', '-108vh'],
        x: [0, drift, -drift * 0.6, 0],
        opacity: [0, opacity, opacity, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
        times: [0, 0.15, 0.85, 1],
      }}
    />
  )
}

export default function Background() {
  const reduce = useReducedMotion()

  const fireflies = useMemo(() => {
    const rng = makeRng(7)
    const count = 42
    return Array.from({ length: count }, () => ({
      x: rng() * 100,
      size: rng() * 3.4 + 1.6,
      delay: rng() * 18,
      duration: rng() * 15 + 14,
      drift: rng() * 90 - 45,
      opacity: rng() * 0.55 + 0.35,
    }))
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* ── Animated gradient-mesh blobs ── */}
      <motion.div
        className="absolute -top-1/4 left-1/2 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(251,191,36,0.30), transparent 65%)',
          filter: 'blur(60px)',
        }}
        animate={reduce ? {} : { scale: [1, 1.2, 1], x: ['-50%', '-42%', '-58%', '-50%'], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -left-32 h-[70vh] w-[70vh] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(52,211,153,0.26), transparent 65%)',
          filter: 'blur(70px)',
        }}
        animate={reduce ? {} : { scale: [1, 1.28, 1], y: [0, 70, 0], x: [0, 40, 0], opacity: [0.6, 0.95, 0.6] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-[-10%] h-[65vh] w-[65vh] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(129,140,248,0.24), transparent 65%)',
          filter: 'blur(80px)',
        }}
        animate={reduce ? {} : { scale: [1, 1.22, 1], x: [0, -60, 0], y: [0, -30, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 23, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[55%] left-[20%] h-[45vh] w-[45vh] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(251,146,60,0.18), transparent 65%)',
          filter: 'blur(70px)',
        }}
        animate={reduce ? {} : { scale: [1, 1.3, 1], x: [0, 50, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Subtle vignette to focus the centre */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 120% at 50% 38%, transparent 58%, rgba(26,35,54,0.72) 100%)' }}
      />

      {/* ── Floating fireflies (skipped for reduced-motion users) ── */}
      {!reduce &&
        fireflies.map((f, i) => <Firefly key={i} {...f} />)}
    </div>
  )
}
