import { motion } from 'framer-motion'
import { content } from '../data/content'

// Small snake/hydra motif
function HydraMark() {
  return (
    <svg viewBox="0 0 64 64" className="h-8 w-8" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="footG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
      <path
        d="M20 46 V26 a12 12 0 0 1 24 0 v6 a6 6 0 0 1-12 0 v-4"
        fill="none"
        stroke="url(#footG)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="20" cy="22" r="3" fill="#FBBF24" />
      <circle cx="44" cy="22" r="3" fill="#34D399" />
    </svg>
  )
}

export default function Footer() {
  const { footer } = content
  return (
    <footer className="relative px-5 pb-12 pt-8">
      <div className="mx-auto max-w-content">
        <div className="hairline mb-10" />
        <div className="flex flex-col items-center gap-4 text-center">
          <motion.div
            whileHover={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 0.6 }}
            className="grid h-14 w-14 place-items-center rounded-2xl glass"
          >
            <HydraMark />
          </motion.div>

          <p className="font-display text-lg font-semibold tracking-wide text-ink">
            {footer.brand} <span className="text-slatey">•</span>{' '}
            <span className="text-gradient">{footer.year}</span>
          </p>
          <p className="max-w-xs text-sm text-slatey">{footer.note}</p>

          <p className="mt-2 flex items-center gap-1.5 text-xs text-slatey/70">
            Made with
            <svg className="h-3.5 w-3.5 text-ember" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 21s-7.5-4.7-10-9.3C.4 8.4 2 5 5.3 5c2 0 3.4 1.1 4.7 2.7C11.3 6.1 12.7 5 14.7 5 18 5 19.6 8.4 22 11.7 19.5 16.3 12 21 12 21z" />
            </svg>
            for the boys.
          </p>
        </div>
      </div>
    </footer>
  )
}
