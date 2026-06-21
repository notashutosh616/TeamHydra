import { useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import Lenis from 'lenis'

// Module-level singleton so the lightbox / route changes can talk to Lenis.
let lenis = null

export function pauseScroll() {
  lenis?.stop()
}
export function resumeScroll() {
  lenis?.start()
}
export function smoothScrollTo(target, opts = {}) {
  if (lenis) lenis.scrollTo(target, { duration: 1.1, ...opts })
  else if (typeof target === 'string') {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }
}
export function scrollToTopInstant() {
  if (lenis) lenis.scrollTo(0, { immediate: true })
  else window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

// Buttery momentum scrolling on desktop. Skipped for touch (native is better)
// and for reduced-motion users (accessibility).
export function useSmoothScroll() {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    if (window.matchMedia('(pointer: coarse)').matches) return // touch → native

    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    })

    let raf
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenis = null
    }
  }, [reduce])
}
