import { useEffect, useMemo, useRef, useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { geoMercator } from 'd3-geo'
import { feature } from 'topojson-client'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { content } from '../data/content'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

const EASE = [0.16, 1, 0.3, 1]
const W = 700
const H = 860
const M = 34
const TOPO_URL = '/india-states.topo.json'

function curve(a, b, bow = 0.16) {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len = Math.hypot(dx, dy) || 1
  const cx = (a[0] + b[0]) / 2 + (-dy / len) * len * bow
  const cy = (a[1] + b[1]) / 2 + (dx / len) * len * bow
  return `M ${a[0].toFixed(1)} ${a[1].toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`
}

const geoStyle = {
  default: { fill: 'rgba(52,211,153,0.05)', stroke: 'rgba(52,211,153,0.34)', strokeWidth: 0.5, outline: 'none' },
  hover: { fill: 'rgba(52,211,153,0.09)', stroke: 'rgba(52,211,153,0.5)', strokeWidth: 0.6, outline: 'none' },
  pressed: { fill: 'rgba(52,211,153,0.09)', stroke: 'rgba(52,211,153,0.5)', strokeWidth: 0.6, outline: 'none' },
}

function Pin({ f, index, active, reduce, onSelect }) {
  const isActive = active === index
  return (
    <motion.g
      role="button"
      tabIndex={0}
      aria-label={`${f.name}, ${f.city}`}
      onMouseEnter={() => onSelect(index, true)}
      onMouseLeave={() => onSelect(index, false)}
      onClick={() => onSelect(index, 'toggle')}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(index, 'toggle')}
      style={{ cursor: 'pointer' }}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.55, ease: EASE, delay: 0.3 + index * 0.16 }}
    >
      <circle r={18} fill="transparent" />
      <motion.circle
        r={10}
        fill={f.accent}
        filter="url(#india-soft)"
        animate={reduce ? { opacity: isActive ? 0.85 : 0.45 } : { opacity: isActive ? 0.9 : [0.35, 0.65, 0.35], scale: isActive ? 1.3 : [1, 1.18, 1] }}
        transition={reduce ? { duration: 0.3 } : { duration: 2.6 + index * 0.3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.25 }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      />
      <circle r={6} fill="none" stroke={f.accent} strokeWidth={1.2} opacity={0.7} />
      <circle r={3.2} fill="#F1FBF6" />
      <text
        x={f.labelDx ?? 12}
        y={f.labelDy ?? 4}
        textAnchor={f.labelAnchor ?? 'start'}
        fontSize="13"
        fontWeight="600"
        fill="#E8EAED"
        style={{ paintOrder: 'stroke', stroke: '#0B0F19', strokeWidth: 3.5, strokeLinejoin: 'round', pointerEvents: 'none' }}
      >
        {f.short}
      </text>
    </motion.g>
  )
}

export default function AcrossIndia() {
  const reduce = useReducedMotion()
  const data = content.india
  const [geo, setGeo] = useState(null)
  const [active, setActive] = useState(null)
  const [pinned, setPinned] = useState(null)
  const sectionRef = useRef(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '600px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!near) return
    let on = true
    fetch(TOPO_URL)
      .then((r) => r.json())
      .then((topo) => {
        if (!on) return
        const key = Object.keys(topo.objects)[0]
        setGeo(feature(topo, topo.objects[key]))
      })
      .catch(() => {})
    return () => {
      on = false
    }
  }, [near])

  const projConfig = useMemo(() => {
    if (!geo) return null
    const fit = geoMercator().fitExtent([[M, M], [W - M, H - M]], geo)
    return { center: fit.invert([W / 2, H / 2]), scale: fit.scale() }
  }, [geo])

  const view = useMemo(() => {
    if (!projConfig) return null
    const p = geoMercator().center(projConfig.center).scale(projConfig.scale).translate([W / 2, H / 2])
    const origin = p([data.origin.lon, data.origin.lat])
    const friends = data.friends.map((f) => ({ ...f, xy: p([f.lon, f.lat]), short: f.city.split(',')[0].trim() }))
    return { origin, friends }
  }, [projConfig, data])

  const shown = pinned != null ? pinned : active

  const entity = useMemo(() => {
    if (!view || shown == null) return null
    if (shown === 'origin')
      return { xy: view.origin, accent: '#FBBF24', hand: data.origin.tag, title: data.origin.label, city: data.origin.city, note: data.origin.note }
    const f = view.friends[shown]
    return f ? { xy: f.xy, accent: f.accent, hand: `“${f.nickname}”`, title: f.name, city: f.city, note: f.note } : null
  }, [view, shown, data])

  const onSelect = (key, mode) => {
    if (mode === 'toggle') setPinned((p) => (p === key ? null : key))
    else if (mode === true) setActive(key)
    else setActive((a) => (a === key ? null : a))
  }

  return (
    <section ref={sectionRef} id="india" className="relative px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-content">
        <SectionHeading kicker={data.kicker} title={data.heading} subtitle={data.subheading} />

        <Reveal delay={0.1} className="relative mx-auto mt-14 w-full max-w-[540px]">
          <div
            className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
            style={{ background: 'radial-gradient(45% 45% at 50% 48%, rgba(52,211,153,0.16), transparent 70%), radial-gradient(26% 26% at 42% 44%, rgba(251,191,36,0.18), transparent 70%)' }}
          />

          <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
            {!view && (
              <div className="absolute inset-0 grid place-items-center text-sm text-slatey">
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-hydra/30 border-t-hydra" />
                  Map load ho raha hai…
                </span>
              </div>
            )}

            {view && (
              <ComposableMap
                projection="geoMercator"
                projectionConfig={projConfig}
                width={W}
                height={H}
                style={{ width: '100%', height: '100%' }}
                aria-label="Map of India (official boundary): each friend's home city connected to the college in Bhopal"
              >
                <defs>
                  <linearGradient id="india-line" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#FBBF24" />
                  </linearGradient>
                  <filter id="india-soft" x="-120%" y="-120%" width="340%" height="340%">
                    <feGaussianBlur stdDeviation="4" />
                  </filter>
                </defs>

                <Geographies geography={geo}>
                  {({ geographies }) =>
                    geographies.map((g) => <Geography key={g.rsmKey} geography={g} style={geoStyle} />)
                  }
                </Geographies>

                {/* converging ember-lines (home → bonfire) */}
                <g>
                  {view.friends.map((f, i) => {
                    const d = curve(f.xy, view.origin)
                    return (
                      <g key={`line-${i}`}>
                        <motion.path
                          d={d}
                          fill="none"
                          stroke="url(#india-line)"
                          strokeWidth={1.4}
                          strokeOpacity={0.5}
                          strokeLinecap="round"
                          pathLength={1}
                          strokeDasharray="1 1"
                          initial={{ strokeDashoffset: reduce ? 0 : 1 }}
                          whileInView={{ strokeDashoffset: 0 }}
                          viewport={{ once: true, margin: '-12%' }}
                          transition={{ duration: 1.3, ease: EASE, delay: 0.2 + i * 0.16 }}
                        />
                        {!reduce && (
                          <motion.path
                            d={d}
                            fill="none"
                            stroke="#FFE9B0"
                            strokeWidth={2.2}
                            strokeLinecap="round"
                            pathLength={1}
                            strokeDasharray="0.08 0.92"
                            style={{ filter: 'drop-shadow(0 0 4px #FFE9B0)' }}
                            initial={{ strokeDashoffset: 1, opacity: 0 }}
                            whileInView={{ strokeDashoffset: [1, 0], opacity: [0, 1, 1, 0] }}
                            viewport={{ once: true, margin: '-12%' }}
                            transition={{ duration: 3.6, ease: 'linear', repeat: Infinity, delay: 1.4 + i * 0.5 }}
                          />
                        )}
                      </g>
                    )
                  })}
                </g>

                {/* friend pins */}
                {view.friends.map((f, i) => (
                  <Marker key={i} coordinates={[f.lon, f.lat]}>
                    <Pin f={f} index={i} active={shown} reduce={reduce} onSelect={onSelect} />
                  </Marker>
                ))}

                {/* the bonfire origin — Bhopal college (clickable) */}
                <Marker coordinates={[data.origin.lon, data.origin.lat]}>
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label={`${data.origin.label}, ${data.origin.city}`}
                    onMouseEnter={() => onSelect('origin', true)}
                    onMouseLeave={() => onSelect('origin', false)}
                    onClick={() => onSelect('origin', 'toggle')}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect('origin', 'toggle')}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle r={22} fill="transparent" />
                    <motion.circle
                      r={20}
                      fill="#FBBF24"
                      filter="url(#india-soft)"
                      animate={reduce ? { opacity: 0.7 } : { opacity: shown === 'origin' ? 0.95 : [0.55, 0.9, 0.55], scale: shown === 'origin' ? 1.25 : [1, 1.15, 1] }}
                      transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    />
                    <circle r={9} fill="none" stroke="#FCD34D" strokeWidth={1.5} opacity={0.85} />
                    <circle r={5} fill="#FFF6DD" />
                    <text
                      x={0}
                      y={-26}
                      textAnchor="middle"
                      fontSize="13.5"
                      fontWeight="700"
                      fill="#FCD34D"
                      style={{ paintOrder: 'stroke', stroke: '#0B0F19', strokeWidth: 3.5, strokeLinejoin: 'round', pointerEvents: 'none' }}
                    >
                      {data.origin.city}
                    </text>
                  </g>
                </Marker>
              </ComposableMap>
            )}

            {/* hover / tap popup card (friends + Bhopal) */}
            <AnimatePresence>
              {entity && (
                <motion.div
                  key={shown}
                  className="pointer-events-none absolute z-20 w-[184px] sm:w-[214px]"
                  style={{
                    left: `${Math.min(Math.max(entity.xy[0] / W, 0.18), 0.82) * 100}%`,
                    top: `${(entity.xy[1] / H) * 100}%`,
                    transform:
                      entity.xy[1] / H < 0.4 ? 'translate(-50%, 18px)' : 'translate(-50%, calc(-100% - 20px))',
                  }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <div
                    className="rounded-2xl glass p-4 text-left shadow-glass"
                    style={{ borderColor: `color-mix(in srgb, ${entity.accent} 45%, transparent)` }}
                  >
                    <p className="font-hand text-xl leading-none" style={{ color: entity.accent }}>
                      {entity.hand}
                    </p>
                    <p className="mt-1 font-display text-base font-bold leading-tight text-ink">{entity.title}</p>
                    <p className="mt-0.5 text-xs font-medium text-slatey">{entity.city}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink/80">{entity.note}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-4 text-center text-sm font-medium text-ember-soft">{data.origin.label}</p>
          <p className="mt-1 text-center text-xs tracking-wide text-slatey">
            Pin pe hover ya tap kar · {data.friends.length} ghar, ek hi aag
          </p>
        </Reveal>
      </div>
    </section>
  )
}
