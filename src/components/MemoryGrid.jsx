import { useState } from 'react'
import { motion } from 'framer-motion'
import Lightbox from './Lightbox'

const EASE = [0.16, 1, 0.3, 1]

// How each item sizes itself in the bento grid.
const spanClass = {
  wide: 'sm:col-span-2',
  tall: 'sm:row-span-2',
}

function PlayBadge() {
  return (
    <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-xs font-semibold text-ink">
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
      </svg>
      Video
    </span>
  )
}

// Reusable gallery grid + lightbox. Pass any array of memory `items`.
export default function MemoryGrid({ items }) {
  const [active, setActive] = useState(null)

  return (
    <>
      <ul className="grid grid-flow-row-dense auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[230px] sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => {
          const isVideo = item.type === 'video'
          return (
            <motion.li
              key={item.id ?? item.src ?? i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: EASE, delay: (i % 4) * 0.08 }}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 ${spanClass[item.span] || ''}`}
            >
              <button
                onClick={() => setActive(i)}
                className="block h-full w-full cursor-pointer"
                aria-label={`Open memory ${i + 1}${item.caption ? ': ' + item.caption : ''}`}
              >
                {isVideo && <PlayBadge />}
                {isVideo ? (
                  <video
                    src={item.src}
                    poster={item.poster || undefined}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-110"
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.caption || `Memory ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-110"
                  />
                )}
                {/* hover gradient + caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-900/90 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute inset-0 ring-0 ring-ember/0 transition-all duration-500 group-hover:ring-2 group-hover:ring-ember/40" />
                {item.caption && (
                  <span className="absolute bottom-3 left-3 right-3 translate-y-2 text-left font-hand text-lg text-ember-soft opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {item.caption}
                  </span>
                )}
                {/* expand hint */}
                <span className="absolute bottom-3 right-3 rounded-full glass p-2 text-ink opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" />
                  </svg>
                </span>
              </button>
            </motion.li>
          )
        })}
      </ul>

      <Lightbox items={items} index={active} onClose={() => setActive(null)} onNavigate={setActive} />
    </>
  )
}
