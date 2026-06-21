import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// Wraps content and moves it at a fraction of scroll speed for depth.
// `speed` > 0 drifts up as you scroll (foreground), < 0 drifts down (background).
// No-op for reduced-motion users (the skill flags parallax as a motion risk).
export default function Parallax({ children, speed = 0.3, className = '' }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const range = 80 * speed
  const y = useTransform(scrollYProgress, [0, 1], [range, -range])

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }
  return (
    <motion.div ref={ref} style={{ y, willChange: 'transform' }} className={className}>
      {children}
    </motion.div>
  )
}
