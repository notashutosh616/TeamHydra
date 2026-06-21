import { createContext, useContext, useEffect, useRef } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

// One global pointer source shared by the cursor trail, the cursor-reactive
// background glow and the canvas ember field — so we keep a SINGLE mousemove
// listener instead of three.
const PointerContext = createContext(null)

// Pointer-fine = has a real mouse. We disable all cursor effects on touch.
const hasFinePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

export function PointerProvider({ children }) {
  const enabled = useRef(hasFinePointer()).current

  // Raw position (in px) + smoothed springs for buttery trailing.
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 350, damping: 28, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 350, damping: 28, mass: 0.5 })

  // Plain ref so the canvas raf-loop can read coords without re-rendering.
  const pos = useRef({ x: -200, y: -200, active: false, vx: 0, vy: 0 })

  useEffect(() => {
    if (!enabled) return
    let lastX = -200
    let lastY = -200
    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      pos.current.vx = e.clientX - lastX
      pos.current.vy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      pos.current.x = e.clientX
      pos.current.y = e.clientY
      pos.current.active = true
    }
    const onLeave = () => {
      pos.current.active = false
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [enabled, x, y])

  return (
    <PointerContext.Provider value={{ x, y, sx, sy, pos, enabled }}>
      {children}
    </PointerContext.Provider>
  )
}

export function usePointer() {
  return useContext(PointerContext)
}
