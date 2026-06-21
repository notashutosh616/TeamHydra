import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Default head accents (warm bonfire palette) if no members are passed in.
const DEFAULT_ACCENTS = ['#34D399', '#FBBF24', '#FB923C', '#6EE7B7', '#FCD34D']

// Geometry: base of the body + the 5 necks/heads fanning upward.
const BASE = { x: 120, y: 196 }
const HEADS = [
  { cx: 44, cy: 90, angle: -40, neck: 'M120 196 C 100 158 44 132 44 96' },
  { cx: 82, cy: 60, angle: -20, neck: 'M120 196 C 106 152 80 110 82 66' },
  { cx: 120, cy: 48, angle: 0, neck: 'M120 196 C 121 150 119 100 120 54' },
  { cx: 158, cy: 60, angle: 20, neck: 'M120 196 C 134 152 160 110 158 66' },
  { cx: 196, cy: 90, angle: 40, neck: 'M120 196 C 140 158 196 132 196 96' },
]

function Head({ head, index, color, name, prefix, interactive, hovered, setHovered }) {
  const isHot = hovered === index
  return (
    <g
      onMouseEnter={interactive ? () => setHovered(index) : undefined}
      onMouseLeave={interactive ? () => setHovered(null) : undefined}
      style={{ cursor: interactive ? 'pointer' : 'inherit' }}
    >
      <title>{name ? `${name} — head ${index + 1}` : `Head ${index + 1}`}</title>

      {/* Neck */}
      <path
        d={head.neck}
        fill="none"
        stroke={`url(#${prefix}-neck-${index})`}
        strokeWidth={isHot ? 10 : 8}
        strokeLinecap="round"
        style={{ transition: 'stroke-width 0.3s ease' }}
      />

      {/* Head group */}
      <g transform={`translate(${head.cx} ${head.cy}) rotate(${head.angle}) scale(${isHot ? 1.18 : 1})`}
         style={{ transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
        {/* Amber firelight glow */}
        <circle r="17" fill={color} opacity={isHot ? 0.85 : 0.5} filter={`url(#${prefix}-soft)`} />
        {/* Skull */}
        <path
          d="M0,-15 C 9,-15 14,-8 13,2 C 12,11 6,16 0,16 C -6,16 -12,11 -13,2 C -14,-8 -9,-15 0,-15 Z"
          fill={`url(#${prefix}-head-${index})`}
          stroke={color}
          strokeWidth="2"
        />
        {/* Eyes (amber firelight) */}
        <circle cx="-5" cy="-3" r="2.4" fill="#FFE9B0" className="hydra-eye" />
        <circle cx="5" cy="-3" r="2.4" fill="#FFE9B0" className="hydra-eye" />
        <circle cx="-5" cy="-3" r="1.1" fill="#7A3D00" />
        <circle cx="5" cy="-3" r="1.1" fill="#7A3D00" />
        {/* Snout highlight */}
        <path d="M-4,9 Q0,12 4,9" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* Name label on hover */}
      {interactive && name && (
        <text
          x={head.cx}
          y={head.cy - 26}
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="#F1F4F9"
          style={{ opacity: isHot ? 1 : 0, transition: 'opacity 0.3s ease', pointerEvents: 'none' }}
        >
          {name}
        </text>
      )}
    </g>
  )
}

export default function Hydra({
  members,
  size = 240,
  sway = true,
  interactive = true,
  onClick,
  className = '',
  prefix = 'hydra',
  drawOnMount = false,
}) {
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState(null)
  const animate = sway && !reduce

  const accents = (members && members.length ? members.map((m) => m.accent) : DEFAULT_ACCENTS)
  const names = members && members.length ? members.map((m) => m.name) : []

  return (
    <motion.svg
      viewBox="0 0 240 220"
      width={size}
      height={(size * 220) / 240}
      className={className}
      role="img"
      aria-label="Team Hydra — a five-headed serpent, one head per friend"
      onClick={onClick}
      initial={drawOnMount && !reduce ? { opacity: 0, scale: 0.8 } : false}
      animate={drawOnMount && !reduce ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter id={`${prefix}-soft`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        {HEADS.map((h, i) => {
          const color = accents[i % accents.length]
          return (
            <g key={i}>
              <linearGradient id={`${prefix}-neck-${i}`} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#0E7C5A" />
                <stop offset="55%" stopColor="#10B981" />
                <stop offset="100%" stopColor={color} />
              </linearGradient>
              <linearGradient id={`${prefix}-head-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#13392F" />
                <stop offset="100%" stopColor="#0B221C" />
              </linearGradient>
            </g>
          )
        })}
      </defs>

      {/* Breathing body */}
      <motion.g
        animate={animate ? { scale: [1, 1.025, 1] } : undefined}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformBox: 'view-box', transformOrigin: `${BASE.x}px ${BASE.y}px` }}
      >
        {/* Coiled base */}
        <ellipse cx="120" cy="202" rx="40" ry="14" fill="#0B221C" opacity="0.9" />
        <ellipse cx="120" cy="198" rx="40" ry="14" fill="none" stroke="#10B981" strokeWidth="3" opacity="0.7" />
        <ellipse cx="120" cy="190" rx="28" ry="10" fill="#13392F" stroke="#34D399" strokeWidth="2" opacity="0.8" />

        {/* Necks + heads, each gently swaying around the base */}
        {HEADS.map((h, i) => (
          <motion.g
            key={i}
            animate={animate ? { rotate: [0, i % 2 === 0 ? -1.6 : 1.6, 0] } : undefined}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
            style={{ transformBox: 'view-box', transformOrigin: `${BASE.x}px ${BASE.y}px` }}
          >
            <Head
              head={h}
              index={i}
              color={accents[i % accents.length]}
              name={names[i]}
              prefix={prefix}
              interactive={interactive}
              hovered={hovered}
              setHovered={setHovered}
            />
          </motion.g>
        ))}
      </motion.g>
    </motion.svg>
  )
}
