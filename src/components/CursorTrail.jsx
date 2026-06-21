import { useEffect, useState } from 'react'
import { motion, useSpring, useReducedMotion } from 'framer-motion'
import { usePointer } from '../lib/pointer'

// A soft warm ember that lags behind the cursor.
function TrailDot({ x, y, size, opacity }) {
  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[90] rounded-full"
      style={{
        x,
        y,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        background: 'radial-gradient(circle, rgba(251,191,36,0.9), rgba(251,146,60,0.4) 60%, transparent 70%)',
        opacity,
        mixBlendMode: 'screen',
      }}
    />
  )
}

export default function CursorTrail() {
  const pointer = usePointer()
  const reduce = useReducedMotion()
  const [hot, setHot] = useState(false)

  const { x, y } = pointer || {}
  // A chain of springs with increasing softness → a trailing ember comet.
  const t1x = useSpring(x, { stiffness: 320, damping: 22, mass: 0.5 })
  const t1y = useSpring(y, { stiffness: 320, damping: 22, mass: 0.5 })
  const t2x = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 })
  const t2y = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 })
  const t3x = useSpring(x, { stiffness: 110, damping: 20, mass: 0.7 })
  const t3y = useSpring(y, { stiffness: 110, damping: 20, mass: 0.7 })
  const t4x = useSpring(x, { stiffness: 70, damping: 18, mass: 0.8 })
  const t4y = useSpring(y, { stiffness: 70, damping: 18, mass: 0.8 })

  // Hide the native cursor only while this is active.
  useEffect(() => {
    if (!pointer?.enabled || reduce) return
    document.documentElement.classList.add('cursor-none')
    const onOver = (e) => {
      setHot(!!e.target.closest?.('a, button, [role="button"], [data-cursor="hot"]'))
    }
    document.addEventListener('mouseover', onOver, { passive: true })
    return () => {
      document.documentElement.classList.remove('cursor-none')
      document.removeEventListener('mouseover', onOver)
    }
  }, [pointer, reduce])

  if (!pointer?.enabled || reduce) return null

  return (
    <>
      <TrailDot x={t4x} y={t4y} size={10} opacity={0.18} />
      <TrailDot x={t3x} y={t3y} size={14} opacity={0.28} />
      <TrailDot x={t2x} y={t2y} size={18} opacity={0.4} />
      <TrailDot x={t1x} y={t1y} size={20} opacity={0.55} />

      {/* Main cursor */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[91]"
        style={{ x: pointer.sx, y: pointer.sy }}
      >
        <motion.div
          className="rounded-full"
          animate={{ scale: hot ? 1.9 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            width: 12,
            height: 12,
            marginLeft: -6,
            marginTop: -6,
            background: 'radial-gradient(circle, #FFF3D6, #FBBF24 55%, rgba(251,146,60,0.6) 80%, transparent)',
            boxShadow: '0 0 14px 4px rgba(251,191,36,0.7)',
            mixBlendMode: 'screen',
          }}
        />
      </motion.div>
    </>
  )
}
