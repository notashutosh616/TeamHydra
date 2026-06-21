import { motion, useReducedMotion } from 'framer-motion'

// Slow animated gradient-mesh blobs. We animate ONLY translate + opacity here
// (never scale) — scaling a large blurred element forces an expensive blur
// re-rasterisation every frame. Translate just moves the cached layer.
export default function Background() {
  const reduce = useReducedMotion()

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute -top-1/4 left-1/2 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.30), transparent 65%)', filter: 'blur(60px)', willChange: 'transform' }}
        animate={reduce ? {} : { x: [0, 30, -20, 0], y: [0, -16, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -left-32 h-[70vh] w-[70vh] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.26), transparent 65%)', filter: 'blur(70px)', willChange: 'transform' }}
        animate={reduce ? {} : { y: [0, 70, 0], x: [0, 40, 0], opacity: [0.6, 0.95, 0.6] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-[-10%] h-[65vh] w-[65vh] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.24), transparent 65%)', filter: 'blur(80px)', willChange: 'transform' }}
        animate={reduce ? {} : { x: [0, -60, 0], y: [0, -30, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[55%] left-[20%] h-[45vh] w-[45vh] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.18), transparent 65%)', filter: 'blur(70px)', willChange: 'transform' }}
        animate={reduce ? {} : { x: [0, 50, 0], y: [0, 24, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Vignette to focus the centre */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 120% at 50% 38%, transparent 58%, rgba(26,35,54,0.72) 100%)' }}
      />
    </div>
  )
}
