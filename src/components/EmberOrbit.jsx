import { useState } from 'react'
import { motion, useTime, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion'

// ── "The Ember Orbit" — a glowing bonfire core with 5 friends orbiting it ────
// viewBox 400×400, centre (200,200)
const C = 200

const DEFAULT_ACCENTS = ['#34D399', '#6EE7B7', '#FCD34D', '#FBBF24', '#FB923C']

// Each friend = one tilted elliptical orbit (a=radius, f=flatten, tilt°, speed, dir)
const ORBITS = [
  { a: 150, f: 0.34, tilt: 8, period: 17, dir: 1 },
  { a: 170, f: 0.44, tilt: 54, period: 23, dir: -1 },
  { a: 136, f: 0.3, tilt: 98, period: 13, dir: 1 },
  { a: 174, f: 0.46, tilt: 132, period: 26, dir: -1 },
  { a: 156, f: 0.36, tilt: 158, period: 20, dir: 1 },
]

function Orb({ cfg, index, color, name, reduce, hovered, setHovered, base }) {
  const time = useTime()
  const phase = (index / 5) * Math.PI * 2
  const tilt = (cfg.tilt * Math.PI) / 180
  const cos = Math.cos(tilt)
  const sin = Math.sin(tilt)
  const period = cfg.period * 1000

  // angle around the orbit (constant when reduced-motion)
  const angle = useTransform(time, (t) =>
    reduce ? phase : phase + cfg.dir * (t / period) * Math.PI * 2,
  )
  // position on the tilted ellipse
  const x = useTransform(angle, (ang) => {
    const ex = cfg.a * Math.cos(ang)
    const ey = cfg.a * cfg.f * Math.sin(ang)
    return ex * cos - ey * sin
  })
  const y = useTransform(angle, (ang) => {
    const ex = cfg.a * Math.cos(ang)
    const ey = cfg.a * cfg.f * Math.sin(ang)
    return ex * sin + ey * cos
  })
  // depth: orbs nearer the viewer (lower half of the un-tilted ellipse) read bigger/brighter
  const depth = useTransform(angle, (ang) => 0.6 + 0.4 * ((Math.sin(ang) + 1) / 2))
  const depthOpacity = useTransform(angle, (ang) => 0.55 + 0.45 * ((Math.sin(ang) + 1) / 2))
  const active = hovered === index

  return (
    <motion.g style={{ x, y }}>
      <motion.g style={{ scale: depth, opacity: depthOpacity }}>
        <motion.g
          animate={{ scale: active ? 1.8 : 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 18 }}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer' }}
        >
          {/* glow halo */}
          <motion.circle
            r={base * 4}
            fill={color}
            filter="url(#orbit-soft)"
            animate={reduce ? { opacity: 0.5 } : { opacity: [0.4, 0.7, 0.4] }}
            transition={reduce ? {} : { duration: 3 + index * 0.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
          />
          <circle r={base * 1.7} fill="none" stroke={color} strokeWidth="0.9" opacity="0.6" />
          {/* bright core */}
          <circle r={base} fill="#FFF8E7" />
        </motion.g>
      </motion.g>
    </motion.g>
  )
}

export default function EmberOrbit({ members, className = '', prefix = 'orbit', showNames = true, base = 5 }) {
  const reduce = useReducedMotion()
  const time = useTime()
  const [hovered, setHovered] = useState(null)

  const accents = members && members.length ? members.map((m) => m.accent) : DEFAULT_ACCENTS
  const names = members && members.length ? members.map((m) => m.name) : []

  // Whole orrery turns very slowly for grandeur.
  const spin = useTransform(time, (t) => (reduce ? 0 : (t / 1000 / 120) * 360))

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label="The Ember Orbit — five friends orbiting one fire"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id={`${prefix}-neb`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.32" />
          <stop offset="45%" stopColor="#34D399" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${prefix}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF6DD" />
          <stop offset="35%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#FB923C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${prefix}-ring`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        <filter id="orbit-soft" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="3.4" />
        </filter>
        <filter id={`${prefix}-coreblur`} x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      {/* nebula aura (breathing) */}
      <motion.ellipse
        cx={C}
        cy={C}
        rx="210"
        ry="170"
        fill={`url(#${prefix}-neb)`}
        animate={reduce ? { opacity: 0.85 } : { opacity: [0.7, 1, 0.7], scale: [1, 1.06, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformBox: 'view-box', transformOrigin: `${C}px ${C}px` }}
      />

      {/* the orrery (slow majestic spin) */}
      <motion.g style={{ rotate: spin, transformBox: 'view-box', transformOrigin: `${C}px ${C}px` }}>
        <g transform={`translate(${C} ${C})`}>
          {/* faint orbit rings */}
          {ORBITS.map((o, i) => (
            <ellipse
              key={`ring-${i}`}
              rx={o.a}
              ry={o.a * o.f}
              fill="none"
              stroke={`url(#${prefix}-ring)`}
              strokeWidth="0.8"
              strokeOpacity="0.28"
              transform={`rotate(${o.tilt})`}
            />
          ))}

          {/* glowing bonfire core */}
          <motion.circle
            r="34"
            fill={`url(#${prefix}-core)`}
            filter={`url(#${prefix}-coreblur)`}
            animate={reduce ? { opacity: 0.9 } : { opacity: [0.8, 1, 0.8], scale: [1, 1.08, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformBox: 'view-box', transformOrigin: 'center' }}
          />
          <circle r="9" fill="#FFF6DD" />
          <motion.circle
            r="15"
            fill="none"
            stroke="#FBBF24"
            strokeWidth="1.2"
            animate={reduce ? { opacity: 0.5 } : { opacity: [0.4, 0.9, 0.4], scale: [1, 1.25, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformBox: 'view-box', transformOrigin: 'center' }}
          />

          {/* the 5 orbiting friends */}
          {ORBITS.map((cfg, i) => (
            <Orb
              key={i}
              cfg={cfg}
              index={i}
              color={accents[i % accents.length]}
              name={names[i]}
              reduce={reduce}
              hovered={hovered}
              setHovered={setHovered}
              base={base}
            />
          ))}
        </g>
      </motion.g>

      {/* hovered friend's name */}
      {showNames && (
        <AnimatePresence>
          {hovered !== null && names[hovered] && (
            <motion.text
              key={hovered}
              x={C}
              y="372"
              textAnchor="middle"
              fontSize="17"
              fontWeight="600"
              fill="#F1F4F9"
              style={{ letterSpacing: '0.12em' }}
              initial={{ opacity: 0, y: 378 }}
              animate={{ opacity: 1, y: 372 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {names[hovered]}
            </motion.text>
          )}
        </AnimatePresence>
      )}
    </svg>
  )
}
