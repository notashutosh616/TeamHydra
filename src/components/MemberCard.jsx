import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

export default function MemberCard({ member, index }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)

  // Pointer position across the card (0 → 1)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const springCfg = { stiffness: 150, damping: 18, mass: 0.6 }
  const rotateX = useSpring(useTransform(py, [0, 1], [9, -9]), springCfg)
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), springCfg)

  // Glow highlight that follows the pointer
  const glowX = useTransform(px, (v) => `${v * 100}%`)
  const glowY = useTransform(py, (v) => `${v * 100}%`)
  const glow = useMotionTemplate`radial-gradient(220px circle at ${glowX} ${glowY}, rgba(251,191,36,0.22), transparent 60%)`

  function handleMove(e) {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }
  function handleLeave() {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: EASE, delay: index * 0.1 }}
      className="group relative [perspective:1200px]"
    >
      <motion.article
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={reduce ? {} : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full rounded-[28px]"
      >
        {/* Amber glow halo behind the card on hover */}
        <div
          aria-hidden
          className="absolute -inset-2 rounded-[34px] bg-gradient-to-br from-ember/40 via-ember/10 to-hydra/30 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="glass relative h-full overflow-hidden rounded-[28px] shadow-glass transition-shadow duration-500 group-hover:shadow-ember">
          {/* Pointer-tracking highlight */}
          {!reduce && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: glow }}
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

            {/* Nickname badge */}
            <span className="absolute right-3 top-3 rounded-full glass px-3 py-1 text-xs font-semibold tracking-wide text-hydra">
              “{member.nickname}”
            </span>

            {/* Name overlay (lifted in 3D) */}
            <div
              className="absolute bottom-0 left-0 right-0 p-5"
              style={reduce ? {} : { transform: 'translateZ(45px)' }}
            >
              <h3 className="font-display text-2xl font-bold text-ink drop-shadow-lg">
                {member.name}
              </h3>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-4 p-5">
            <p className="text-sm leading-relaxed text-slatey">{member.funnyLine}</p>

            {/* Handwritten personal message note */}
            <div className="relative rounded-2xl border border-dashed border-ember/30 bg-ember/[0.06] p-4">
              <span className="absolute -top-2.5 left-4 rounded-full bg-midnight-800 px-2 text-[10px] uppercase tracking-[0.2em] text-ember">
                A note
              </span>
              <p className="font-hand text-xl leading-snug text-ember-soft">{member.message}</p>
            </div>
          </div>
        </div>
      </motion.article>
    </motion.li>
  )
}
