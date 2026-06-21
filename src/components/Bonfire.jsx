import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useEasterEgg } from '../lib/easterEgg'

// Soft radial sprite (cached) — additive blending of these = organic flame.
function sprite(size, stops) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  stops.forEach(([o, col]) => grad.addColorStop(o, col))
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  return c
}

// Calm static flame for reduced-motion users.
function StaticFlame() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div
        className="absolute left-1/2 top-[18%] h-[64%] w-[46%] -translate-x-1/2 rounded-[50%_50%_45%_45%/60%_60%_40%_40%] blur-md"
        style={{ background: 'radial-gradient(50% 60% at 50% 70%, #FFF3D0, #FBBF24 40%, #FB6A2C 70%, transparent 80%)' }}
      />
      <div
        className="absolute left-1/2 top-[58%] h-[40%] w-[80%] -translate-x-1/2 rounded-full blur-2xl"
        style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.45), transparent 70%)' }}
      />
    </div>
  )
}

export default function Bonfire({ className = '' }) {
  const reduce = useReducedMotion()
  const egg = useEasterEgg()
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const flareUntil = useRef(0)
  const pendingBurst = useRef(false)

  useEffect(() => {
    if (reduce) return
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')

    const hot = sprite(64, [[0, 'rgba(255,248,225,0.95)'], [0.4, 'rgba(255,213,128,0.55)'], [1, 'rgba(255,213,128,0)']])
    const mid = sprite(64, [[0, 'rgba(251,191,36,0.9)'], [0.45, 'rgba(251,146,60,0.5)'], [1, 'rgba(251,146,60,0)']])
    const low = sprite(64, [[0, 'rgba(251,106,44,0.8)'], [0.5, 'rgba(220,70,40,0.4)'], [1, 'rgba(220,70,40,0)']])
    const emberAmber = sprite(32, [[0, 'rgba(255,236,180,0.95)'], [0.4, 'rgba(251,191,36,0.5)'], [1, 'rgba(251,191,36,0)']])
    const emberGreen = sprite(32, [[0, 'rgba(214,255,233,0.9)'], [0.4, 'rgba(52,211,153,0.4)'], [1, 'rgba(52,211,153,0)']])
    const radiant = sprite(256, [[0, 'rgba(251,191,36,0.5)'], [0.5, 'rgba(251,146,60,0.16)'], [1, 'rgba(251,146,60,0)']])

    let w = 0
    let h = 0
    let dpr = 1
    let baseX = 0
    let baseY = 0
    let scale = 1
    let flames = []
    let embers = []

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = wrap.clientWidth
      h = wrap.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      baseX = w / 2
      baseY = h * 0.9
      scale = w / 320
    }

    const spawnFlame = () => {
      flames.push({
        x: baseX + (Math.random() - 0.5) * w * 0.14,
        y: baseY,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(Math.random() * 1.1 + 1.5) * scale,
        r: (Math.random() * 13 + 10) * scale,
        life: 0,
        maxLife: Math.random() * 32 + 30,
        seed: Math.random() * 6.28,
      })
    }
    const spawnEmber = (b) => {
      const ang = b ? Math.random() * Math.PI * 2 : -Math.PI / 2 + (Math.random() - 0.5) * 1.1
      const spd = b ? (Math.random() * 3 + 1.5) * scale : (Math.random() * 1.4 + 0.8) * scale
      embers.push({
        x: baseX + (Math.random() - 0.5) * w * 0.18,
        y: baseY - h * 0.08,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - (b ? 0 : 0.4),
        r: (Math.random() * 2 + 1) * scale,
        life: 0,
        maxLife: Math.random() * 80 + (b ? 45 : 70),
        sprite: Math.random() < 0.78 ? emberAmber : emberGreen,
        tw: Math.random() * 6.28,
      })
    }

    let raf = 0
    let running = false
    let paused = false
    let visible = true

    const maybeRun = () => {
      if (running || paused || !visible) return
      running = true
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const onVis = () => {
      paused = document.hidden
      if (paused) stop()
      else maybeRun()
    }

    function loop(now) {
      if (paused || !visible) {
        running = false
        return
      }
      const t = now / 1000
      const flick = 0.78 + 0.22 * ((Math.sin(t * 7) + Math.sin(t * 11.3) + Math.sin(t * 17.7)) / 3 + 0.5) / 1.5
      const flaring = now < flareUntil.current
      const flareK = flaring ? (flareUntil.current - now) / 1100 : 0
      const boost = 1 + flareK * 1.1

      if (pendingBurst.current) {
        pendingBurst.current = false
        for (let i = 0; i < 18; i++) spawnEmber(true)
      }

      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      const rs = w * (1.9 + flareK * 0.5)
      ctx.globalAlpha = (0.5 + 0.18 * (flick - 0.78) * 4 + flareK * 0.4) * 0.6
      ctx.drawImage(radiant, baseX - rs / 2, baseY - rs * 0.62, rs, rs)

      const target = Math.min(64, Math.round((w / 5) * flick * boost))
      let guard = 0
      while (flames.length < target && guard++ < 8) spawnFlame()
      if (Math.random() < 0.32 * boost) spawnEmber(false)

      for (let i = flames.length - 1; i >= 0; i--) {
        const f = flames[i]
        f.life++
        const lr = f.life / f.maxLife
        if (lr >= 1) {
          flames.splice(i, 1)
          continue
        }
        f.vy *= 0.99
        f.x += f.vx + Math.sin(f.life * 0.18 + f.seed) * 0.7 * scale
        f.x += (baseX - f.x) * 0.03
        f.y += f.vy * boost
        const size = f.r * (1 - lr * 0.7)
        const a = Math.sin(Math.min(lr, 1) * Math.PI)
        const img = lr < 0.32 ? hot : lr < 0.68 ? mid : low
        ctx.globalAlpha = a * 0.8
        ctx.drawImage(img, f.x - size, f.y - size, size * 2, size * 2)
      }

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i]
        e.life++
        e.tw += 0.2
        if (e.life >= e.maxLife) {
          embers.splice(i, 1)
          continue
        }
        e.x += e.vx + Math.sin(e.life * 0.05) * 0.3
        e.y += e.vy
        e.vy -= 0.004
        e.vx *= 0.99
        const a = (1 - e.life / e.maxLife) * (0.7 + Math.sin(e.tw) * 0.3)
        const s = e.r * 5
        ctx.globalAlpha = Math.max(0, a)
        ctx.drawImage(e.sprite, e.x - s / 2, e.y - s / 2, s, s)
      }

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(loop)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    // Only animate while the fire is actually on screen.
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
        if (!visible) {
          stop()
          ctx.clearRect(0, 0, w, h)
        } else maybeRun()
      },
      { threshold: 0 },
    )
    io.observe(wrap)
    document.addEventListener('visibilitychange', onVis)
    maybeRun()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reduce])

  const stoke = () => {
    flareUntil.current = performance.now() + 1100
    pendingBurst.current = true
    egg?.registerHydraClick()
  }

  return (
    <div
      ref={wrapRef}
      onClick={stoke}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && stoke()}
      role="button"
      tabIndex={0}
      data-cursor="hot"
      aria-label="The bonfire — click to stoke the flames"
      className={`relative cursor-pointer select-none ${className}`}
      style={{ aspectRatio: '9 / 10' }}
    >
      {reduce ? (
        <StaticFlame />
      ) : (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      )}
    </div>
  )
}
