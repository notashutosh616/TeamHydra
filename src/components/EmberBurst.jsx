import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useEasterEgg } from '../lib/easterEgg'

const COLORS = ['#FBBF24', '#FB923C', '#34D399', '#6EE7B7', '#FCD34D', '#FFE9B0']

// Cached glow sprite per colour — far cheaper than ctx.shadowBlur per particle.
function makeSprite(color) {
  const c = document.createElement('canvas')
  c.width = c.height = 32
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16)
  grad.addColorStop(0, color)
  grad.addColorStop(0.4, color + 'cc')
  grad.addColorStop(1, color + '00')
  g.fillStyle = grad
  g.fillRect(0, 0, 32, 32)
  return c
}

export default function EmberBurst() {
  const { burst, message } = useEasterEgg()
  const reduce = useReducedMotion()
  const canvasRef = useRef(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!burst) return // ignore the initial 0
    setShow(true)
    const hideT = setTimeout(() => setShow(false), 3000)
    if (reduce) return () => clearTimeout(hideT)

    const canvas = canvasRef.current
    if (!canvas) return () => clearTimeout(hideT)
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const w = (canvas.width = window.innerWidth * dpr)
    const h = (canvas.height = window.innerHeight * dpr)
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
    const cx = w / 2
    const cy = h / 2

    const sprites = COLORS.map(makeSprite)
    const count = window.innerWidth < 640 ? 48 : 80
    const particles = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = (Math.random() * 9 + 3) * dpr
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3 * dpr,
        size: (Math.random() * 10 + 6) * dpr,
        sprite: sprites[(Math.random() * sprites.length) | 0],
        life: 0,
        maxLife: Math.random() * 55 + 45,
      }
    })

    let raf
    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      let alive = false
      for (const p of particles) {
        if (p.life >= p.maxLife) continue
        alive = true
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.16 * dpr
        p.vx *= 0.99
        ctx.globalAlpha = 1 - p.life / p.maxLife
        ctx.drawImage(p.sprite, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      if (alive) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      clearTimeout(hideT)
      cancelAnimationFrame(raf)
    }
  }, [burst, reduce])

  return (
    <>
      {!reduce && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`pointer-events-none fixed inset-0 z-[95] ${show ? '' : 'hidden'}`}
        />
      )}
      <AnimatePresence>
        {show && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[96] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="status"
              initial={{ scale: 0.6, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
              className="mx-5 rounded-3xl glass px-8 py-6 text-center shadow-ember"
            >
              <p className="font-hand text-4xl text-gradient sm:text-5xl">{message}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slatey">secret unlocked</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
