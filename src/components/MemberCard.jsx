import { useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

// A tiny serpent-head glyph (one of the Hydra's five) in the member's accent.
function HeadGlyph({ color }) {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M12 2 C16 2 19 5 19 10 C19 16 15 21 12 22 C9 21 5 16 5 10 C5 5 8 2 12 2 Z"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      <circle cx="9.5" cy="10" r="1.4" fill={color} />
      <circle cx="14.5" cy="10" r="1.4" fill={color} />
    </svg>
  )
}

export default function MemberCard({ member, index }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)
  const accent = member.accent || '#FBBF24'

  // Pointer position across the card (0 → 1)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const springCfg = { stiffness: 150, damping: 18, mass: 0.6 }
  const rotateX = useSpring(useTransform(py, [0, 1], [9, -9]), springCfg)
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), springCfg)
  const glowX = useTransform(px, (v) => `${v * 100}%`)
  const glowY = useTransform(py, (v) => `${v * 100}%`)
  const glow = useMotionTemplate`radial-gradient(220px circle at ${glowX} ${glowY}, color-mix(in srgb, ${accent} 28%, transparent), transparent 60%)`

  function handleMove(e) {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }
  function handleLeave() {
    px.set(0.5)
    py.set(0.5)
    setHovered(false)
  }

  const nick = member.nickname.split('')

  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: EASE, delay: index * 0.1 }}
      className="group relative [perspective:1200px]"
      style={{ ['--accent']: accent }}
    >
      <motion.article
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        style={reduce ? {} : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full rounded-[28px]"
      >
        {/* Accent glow halo on hover */}
        <div
          aria-hidden
          className="absolute -inset-2 rounded-[34px] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(circle at 50% 35%, color-mix(in srgb, ${accent} 55%, transparent), transparent 70%)` }}
        />

        <div
          className="glass relative h-full overflow-hidden rounded-[28px] shadow-glass transition-shadow duration-500"
          style={{ borderColor: hovered ? `color-mix(in srgb, ${accent} 45%, transparent)` : undefined }}
        >
          {/* Pointer-tracking highlight */}
          {!reduce && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: glow }}
            />
          )}

          {/* Fiery ember edge on hover — the card "catches fire" */}
          {hovered && !reduce && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20 rounded-[28px]"
              style={{
                border: `1.5px solid ${accent}`,
                boxShadow: `0 0 22px color-mix(in srgb, ${accent} 70%, transparent), inset 0 0 16px color-mix(in srgb, ${accent} 35%, transparent)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 0.9, 0.55, 1, 0.65] }}
              transition={{ duration: 1.1, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            />
          )}

          {/* Photo */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={member.photo}
              alt={`${member.name} — “${member.nickname}”`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight-900 via-midnight-900/40 to-transparent" />

            {/* Head badge (links member ↔ one of the 5 hydra heads) */}
            <span
              className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full glass px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
              style={{ color: accent }}
            >
              <HeadGlyph color={accent} />
              Head {index + 1}/5
            </span>

            {/* Nickname badge — letters do a playful bounce on hover */}
            <span
              className="absolute right-3 top-3 flex rounded-full glass px-3 py-1 text-xs font-semibold tracking-wide"
              style={{ color: accent }}
              aria-label={member.nickname}
            >
              <span aria-hidden>“</span>
              {nick.map((c, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  animate={hovered && !reduce ? { y: [0, -5, 0] } : { y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: hovered ? i * 0.05 : 0 }}
                >
                  {c}
                </motion.span>
              ))}
              <span aria-hidden>”</span>
            </span>

            {/* Name overlay (lifted in 3D) */}
            <div
              className="absolute bottom-0 left-0 right-0 p-5"
              style={reduce ? {} : { transform: 'translateZ(45px)' }}
            >
              <h3 className="font-display text-2xl font-bold text-ink drop-shadow-lg">{member.name}</h3>
              <span className="mt-1 block h-[3px] w-12 rounded-full" style={{ background: accent }} />
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-4 p-5">
            {/* Funny stat tag */}
            {member.stat && (
              <span
                className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums"
                style={{
                  color: accent,
                  background: `color-mix(in srgb, ${accent} 12%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${accent} 30%, transparent)`,
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
                {member.stat}
              </span>
            )}

            <p className="text-sm leading-relaxed text-slatey">{member.funnyLine}</p>

            {/* Handwritten note that "writes itself" in on scroll */}
            <div
              className="relative rounded-2xl border border-dashed p-4"
              style={{ borderColor: `color-mix(in srgb, ${accent} 35%, transparent)`, background: `color-mix(in srgb, ${accent} 7%, transparent)` }}
            >
              <span
                className="absolute -top-2.5 left-4 rounded-full bg-midnight-800 px-2 text-[10px] uppercase tracking-[0.2em]"
                style={{ color: accent }}
              >
                A note
              </span>
              <div className="relative overflow-hidden">
                <motion.p
                  initial={reduce ? { clipPath: 'inset(0 0 0 0)' } : { clipPath: 'inset(0 100% 0 0)' }}
                  whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
                  className="font-hand text-xl leading-snug text-ember-soft"
                >
                  {member.message}
                </motion.p>
                {/* the "pen" ember glow that travels as it writes */}
                {!reduce && (
                  <motion.span
                    aria-hidden
                    className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full"
                    style={{ background: accent, boxShadow: `0 0 12px 3px ${accent}` }}
                    initial={{ left: '0%', opacity: 0 }}
                    whileInView={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </motion.li>
  )
}
