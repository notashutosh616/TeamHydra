import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useEasterEgg } from '../lib/easterEgg'

const COLORS = ['#FBBF24', '#FB923C', '#34D399', '#6EE7B7', '#FCD34D', '#FFE9B0']

export default function EmberBurst() {
  const { burst, message } = useEasterEgg()
  const reduce = useReducedMotion()
  const canvasRef = useRef(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!burst) return // ignore initial 0
    setShow(true)
    const hideT = setTimeout(() => setShow(false), 3000)

    if (reduce) return () => clearTimeout(hideT)

    const canvas = canvasRef.current
    if (!canvas) return () => clearTimeout(hideT)
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = (canvas.width = window.innerWidth * dpr)
    const h = (canvas.height = window.innerHeight * dpr)
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
    const cx = w / 2
    const cy = h / 2

    const particles = Array.from({ length: 150 }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = (Math.random() * 9 + 3) * dpr
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3 * dpr,
        r: (Math.random() * 3 + 1.5) * dpr,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        life: 0,
        maxLife: Math.random() * 60 + 50,
      }
    })

    let raf
    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      let alive = false
      particles.forEach((p) => {
        if (p.life >= p.maxLife) return
        alive = true
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.16 * dpr // gravity
        p.vx *= 0.99
        const a = 1 - p.life / p.maxLife
        ctx.globalAlpha = a
        ctx.fillStyle = p.color
        ctx.shadowBlur = 14 * dpr
        ctx.shadowColor = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
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
              className="rounded-3xl glass px-8 py-6 text-center shadow-ember"
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
