import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// ── Constellation geometry (balanced "crown" arc, viewBox 560×300) ──────────
const STARS = [
  { x: 78, y: 188, r: 3.0 },
  { x: 175, y: 92, r: 3.3 },
  { x: 285, y: 56, r: 4.3 }, // brightest, centre peak
  { x: 398, y: 104, r: 3.3 },
  { x: 492, y: 196, r: 3.0 },
]
const SEGMENTS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
]
// Warm bonfire palette spanning emerald → amber
const DEFAULT_ACCENTS = ['#34D399', '#6EE7B7', '#FCD34D', '#FBBF24', '#FB923C']

// Faint background micro-stars for night-sky depth
const MICRO = [
  { x: 44, y: 66, r: 1.1, o: 0.5 },
  { x: 120, y: 40, r: 0.8, o: 0.4 },
  { x: 232, y: 150, r: 1.0, o: 0.45 },
  { x: 330, y: 176, r: 0.7, o: 0.35 },
  { x: 458, y: 64, r: 1.2, o: 0.5 },
  { x: 522, y: 128, r: 0.9, o: 0.4 },
  { x: 60, y: 250, r: 0.8, o: 0.35 },
  { x: 500, y: 248, r: 1.0, o: 0.4 },
  { x: 205, y: 232, r: 0.7, o: 0.3 },
  { x: 372, y: 38, r: 0.9, o: 0.45 },
  { x: 150, y: 168, r: 0.7, o: 0.3 },
  { x: 420, y: 196, r: 0.8, o: 0.35 },
  { x: 300, y: 118, r: 0.7, o: 0.3 },
  { x: 92, y: 120, r: 0.9, o: 0.4 },
]

const TRAVEL = '#FFE9B0' // warm light that travels along the lines

// A 4-point sparkle path centred at (x, y).
function sparkle(x, y, g) {
  const m = g * 0.28
  return `M ${x} ${y - g} C ${x} ${y - m}, ${x + m} ${y}, ${x + g} ${y} C ${x + m} ${y}, ${x} ${y + m}, ${x} ${y + g} C ${x} ${y + m}, ${x - m} ${y}, ${x - g} ${y} C ${x - m} ${y}, ${x} ${y - m}, ${x} ${y - g} Z`
}

function Star({ star, index, color, name, hovered, setHovered, reduce, glowId }) {
  const active = hovered === index
  return (
    <motion.g
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      style={{ transformBox: 'view-box', transformOrigin: `${star.x}px ${star.y}px`, cursor: 'pointer' }}
      animate={{ scale: active ? 1.35 : 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    >
      {/* soft glow halo (gentle twinkle) */}
      <motion.circle
        cx={star.x}
        cy={star.y}
        r={star.r * 5}
        fill={color}
        filter={`url(#${glowId})`}
        style={{ transformBox: 'view-box', transformOrigin: `${star.x}px ${star.y}px` }}
        animate={
          reduce
            ? { opacity: active ? 0.7 : 0.4 }
            : { opacity: active ? 0.85 : [0.3, 0.6, 0.3], scale: active ? 1.2 : [1, 1.12, 1] }
        }
        transition={
          reduce
            ? { duration: 0.3 }
            : { duration: 3.2 + index * 0.45, repeat: Infinity, ease: 'easeInOut', delay: index * 0.35 }
        }
      />

      {/* faint accent ring */}
      <circle cx={star.x} cy={star.y} r={star.r * 1.9} fill="none" stroke={color} strokeWidth="1" opacity="0.55" />

      {/* 4-point glint */}
      <motion.path
        d={sparkle(star.x, star.y, star.r * 3.2)}
        fill={color}
        opacity="0.85"
        style={{ transformBox: 'view-box', transformOrigin: `${star.x}px ${star.y}px` }}
        animate={reduce ? {} : { scale: [0.82, 1.12, 0.82], opacity: [0.5, 0.95, 0.5] }}
        transition={reduce ? {} : { duration: 2.6 + index * 0.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
      />

      {/* bright core */}
      <circle cx={star.x} cy={star.y} r={star.r} fill="#FFF8E7" />

      {/* name on hover */}
      {name && (
        <motion.text
          x={star.x}
          y={star.y - star.r * 6}
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill="#F1F4F9"
          style={{ pointerEvents: 'none', letterSpacing: '0.12em' }}
          initial={false}
          animate={{ opacity: active ? 1 : 0, y: active ? star.y - star.r * 6 : star.y - star.r * 5 }}
          transition={{ duration: 0.3 }}
        >
          {name}
        </motion.text>
      )}
    </motion.g>
  )
}

export default function HydraConstellation({ members, className = '', prefix = 'constel' }) {
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState(null)

  const accents = members && members.length ? members.map((m) => m.accent) : DEFAULT_ACCENTS
  const names = members && members.length ? members.map((m) => m.name) : []

  const glowId = `${prefix}-glow`
  const lineId = `${prefix}-line`

  return (
    <svg
      viewBox="0 0 560 300"
      className={className}
      role="img"
      aria-label="The Hydra Constellation — five glowing stars, one for each friend, joined by light"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id={`${prefix}-neb-e`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${prefix}-neb-a`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={lineId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        <filter id={glowId} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* ── Nebula aura (slow breathe) ── */}
      <motion.g
        animate={reduce ? { opacity: 0.85 } : { opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="225" cy="150" rx="220" ry="140" fill={`url(#${prefix}-neb-e)`} />
        <ellipse cx="360" cy="150" rx="220" ry="140" fill={`url(#${prefix}-neb-a)`} />
      </motion.g>

      {/* ── Faint background micro-stars ── */}
      <g fill="#E8EAED">
        {MICRO.map((m, i) => (
          <motion.circle
            key={i}
            cx={m.x}
            cy={m.y}
            r={m.r}
            opacity={m.o}
            animate={reduce ? {} : { opacity: [m.o * 0.5, m.o, m.o * 0.5] }}
            transition={reduce ? {} : { duration: 3 + (i % 5), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          />
        ))}
      </g>

      {/* ── Constellation (slow breathing drift) ── */}
      <motion.g
        animate={reduce ? {} : { y: [0, -6, 0], scale: [1, 1.012, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformBox: 'view-box', transformOrigin: '280px 150px' }}
      >
        {/* base connecting lines */}
        {SEGMENTS.map(([a, b], i) => (
          <line
            key={`base-${i}`}
            x1={STARS[a].x}
            y1={STARS[a].y}
            x2={STARS[b].x}
            y2={STARS[b].y}
            stroke={`url(#${lineId})`}
            strokeWidth="1.4"
            strokeOpacity="0.45"
            strokeLinecap="round"
          />
        ))}

        {/* light travelling along the lines */}
        {!reduce &&
          SEGMENTS.map(([a, b], i) => (
            <motion.line
              key={`travel-${i}`}
              x1={STARS[a].x}
              y1={STARS[a].y}
              x2={STARS[b].x}
              y2={STARS[b].y}
              pathLength={1}
              stroke={TRAVEL}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="0.16 0.84"
              style={{ filter: `drop-shadow(0 0 4px ${TRAVEL})` }}
              initial={{ strokeDashoffset: 1, opacity: 0.9 }}
              animate={{ strokeDashoffset: [1, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'linear', delay: i * 0.9 }}
            />
          ))}

        {/* the five stars */}
        {STARS.map((star, i) => (
          <Star
            key={i}
            star={star}
            index={i}
            color={accents[i % accents.length]}
            name={names[i]}
            hovered={hovered}
            setHovered={setHovered}
            reduce={reduce}
            glowId={glowId}
          />
        ))}
      </motion.g>
    </svg>
  )
}
