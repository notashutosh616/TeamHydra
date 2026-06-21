import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { usePointer } from '../lib/pointer'

// Build a soft glowing ember sprite once (much faster than per-particle gradients).
function makeSprite(inner, outer) {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, inner)
  grad.addColorStop(0.4, outer)
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return c
}

export default function EmberField() {
  const reduce = useReducedMotion()
  const pointer = usePointer()
  const canvasRef = useRef(null)

  useEffect(() => {
    if (reduce) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const sprites = [
      makeSprite('rgba(255,236,180,0.95)', 'rgba(251,191,36,0.5)'),
      makeSprite('rgba(255,210,150,0.95)', 'rgba(251,146,60,0.5)'),
      makeSprite('rgba(214,255,233,0.9)', 'rgba(52,211,153,0.4)'),
    ]
    const glowSprite = makeSprite('rgba(251,191,36,0.5)', 'rgba(251,146,60,0.18)')

    let w = 0
    let h = 0
    let dpr = 1
    let embers = []

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const isMobile = w < 640
      const count = Math.min(isMobile ? 24 : 58, Math.round((w * h) / 30000))
      embers = Array.from({ length: count }, () => spawn(true))
    }

    const spawn = (anywhere) => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + Math.random() * 40,
      r: Math.random() * 2.2 + 1,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.7 + 0.25),
      life: 0,
      maxLife: Math.random() * 420 + 220,
      sprite: sprites[(Math.random() * sprites.length) | 0],
      twinkle: Math.random() * Math.PI * 2,
    })

    let raf
    let paused = false
    const onVis = () => {
      paused = document.hidden
      if (!paused) raf = requestAnimationFrame(loop)
    }

    const R = 130 // cursor influence radius

    const loop = () => {
      if (paused) return
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      const p = pointer?.pos?.current
      const mActive = pointer?.enabled && p?.active

      // warm glow pool following the cursor
      if (mActive) {
        const gs = 360
        ctx.globalAlpha = 0.5
        ctx.drawImage(glowSprite, p.x - gs / 2, p.y - gs / 2, gs, gs)
      }

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i]
        e.life++
        e.twinkle += 0.05
        e.x += e.vx + Math.sin(e.life * 0.02) * 0.15
        e.y += e.vy
        e.vy -= 0.0006 // gentle acceleration upward

        // cursor interaction — stir the fire
        if (mActive) {
          const dx = e.x - p.x
          const dy = e.y - p.y
          const dist = Math.hypot(dx, dy)
          if (dist < R && dist > 0.001) {
            const f = (1 - dist / R) * 0.7
            e.vx += (dx / dist) * f
            e.vy += (dy / dist) * f - f * 0.25
          }
        }
        // friction so pushes settle
        e.vx *= 0.98

        const lifeRatio = e.life / e.maxLife
        if (lifeRatio >= 1 || e.y < -20 || e.x < -40 || e.x > w + 40) {
          embers[i] = spawn(false)
          continue
        }

        // fade in then out, plus flicker
        const fade = Math.sin(Math.min(lifeRatio, 1) * Math.PI)
        const flicker = 0.75 + Math.sin(e.twinkle) * 0.25
        ctx.globalAlpha = Math.max(0, fade * flicker * 0.9)
        const size = e.r * 6
        ctx.drawImage(e.sprite, e.x - size / 2, e.y - size / 2, size, size)
      }

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVis)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reduce, pointer])

  if (reduce) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
