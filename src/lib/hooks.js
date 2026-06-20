import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

// ── Live elapsed time since a start date ───────────────────────────────────
// Returns { days, hours, minutes, seconds }, ticking every second so the
// counter genuinely feels alive.
export function useElapsed(startDate) {
  const start = useRef(new Date(startDate).getTime())
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  let diff = Math.max(0, now - start.current)
  const days = Math.floor(diff / 86_400_000)
  diff -= days * 86_400_000
  const hours = Math.floor(diff / 3_600_000)
  diff -= hours * 3_600_000
  const minutes = Math.floor(diff / 60_000)
  diff -= minutes * 60_000
  const seconds = Math.floor(diff / 1000)

  return { days, hours, minutes, seconds }
}

// ── Animated count-up (0 → target) on mount ────────────────────────────────
export function useCountUp(target, duration = 1600) {
  const reduce = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (reduce || target <= 0) {
      setValue(target)
      return
    }
    let raf
    const startedAt = performance.now()
    const tick = (t) => {
      const p = Math.min(1, (t - startedAt) / duration)
      // easeOutExpo — cinematic settle
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
      setValue(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, reduce])

  return value
}

// ── Lock body scroll (used by the lightbox) ────────────────────────────────
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [locked])
}
