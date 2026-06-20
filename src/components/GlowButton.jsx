import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Premium animated button used for "See all memories" / "Back".
// variant: 'primary' (flowing gradient) | 'ghost' (frosted glass)
export default function GlowButton({ to, children, variant = 'primary', icon = 'arrow', onClick }) {
  const isPrimary = variant === 'primary'

  const Arrow = (
    <svg
      className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  )
  const BackArrow = (
    <svg
      className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
    </svg>
  )

  return (
    <motion.span
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      className="inline-block"
    >
      <Link
        to={to}
        onClick={onClick}
        className={
          isPrimary
            ? 'group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 text-sm font-bold tracking-wide text-midnight-900 shadow-ember'
            : 'group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full glass px-6 py-3 text-sm font-semibold tracking-wide text-ink'
        }
      >
        {isPrimary && (
          <>
            {/* flowing gradient fill */}
            <span className="absolute inset-0 animate-gradient-pan bg-gradient-to-r from-hydra via-ember to-hydra bg-[length:200%_auto]" />
            {/* shine sweep */}
            <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </>
        )}
        {icon === 'back' && BackArrow}
        <span className="relative z-10">{children}</span>
        {icon === 'arrow' && Arrow}
      </Link>
    </motion.span>
  )
}
