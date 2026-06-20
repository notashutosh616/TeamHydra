import { motion } from 'framer-motion'

// Cinematic "expo.out" easing recommended by the design system.
const EASE = [0.16, 1, 0.3, 1]

// Scroll-triggered reveal. Fades + slides its children in once when they
// enter the viewport. `delay` lets you stagger siblings.
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  className = '',
  once = true,
  as = 'div',
}) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  )
}

// Container + item pair for nicely staggered grids/lists.
export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}
