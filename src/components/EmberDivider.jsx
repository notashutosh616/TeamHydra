import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

// A cinematic transition between sections: a glowing ember sweeps across a
// thin gradient line as the boundary scrolls into view ("glow wipe").
export default function EmberDivider() {
  const reduce = useReducedMotion()

  return (
    <div className="relative mx-auto my-2 h-10 max-w-content overflow-hidden px-5" aria-hidden="true">
      <div className="absolute left-5 right-5 top-1/2 hairline -translate-y-1/2" />

      {!reduce && (
        <>
          {/* soft warm wash that wipes across */}
          <motion.div
            className="absolute top-1/2 h-8 w-40 -translate-y-1/2 rounded-full blur-xl"
            style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.45), transparent 70%)' }}
            initial={{ left: '-20%', opacity: 0 }}
            whileInView={{ left: ['-20%', '110%'], opacity: [0, 1, 0] }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 1.8, ease: EASE }}
          />
          {/* the travelling ember */}
          <motion.span
            className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-ember"
            style={{ boxShadow: '0 0 14px 4px rgba(251,191,36,0.85)' }}
            initial={{ left: '-2%', opacity: 0 }}
            whileInView={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 1.8, ease: EASE }}
          />
        </>
      )}
    </div>
  )
}
