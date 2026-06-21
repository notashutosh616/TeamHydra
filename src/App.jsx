import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { MotionConfig, AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { PointerProvider } from './lib/pointer'
import { EasterEggProvider } from './lib/easterEgg'
import { useSmoothScroll, scrollToTopInstant } from './lib/smoothScroll'
import Background from './components/Background'
import EmberField from './components/EmberField'
import CursorTrail from './components/CursorTrail'
import SoundToggle from './components/SoundToggle'
import EmberBurst from './components/EmberBurst'
import LoadingScreen from './components/LoadingScreen'
import Home from './pages/Home'
import AllMemories from './pages/AllMemories'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left bg-gradient-to-r from-hydra via-ember to-hydra"
      aria-hidden="true"
    />
  )
}

// Jump to the top whenever the route changes (works with Lenis too).
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    scrollToTopInstant()
  }, [pathname])
  return null
}

export default function App() {
  useSmoothScroll() // buttery momentum scroll (desktop, non-reduced-motion)
  const location = useLocation()

  return (
    // reducedMotion="user" makes Framer Motion honour prefers-reduced-motion globally
    <MotionConfig reducedMotion="user">
      <PointerProvider>
        <EasterEggProvider>
          <Background />
          <EmberField />
          <ScrollProgress />
          <ScrollToTop />
          <CursorTrail />
          <SoundToggle />
          <EmberBurst />
          <LoadingScreen />

          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/memories" element={<AllMemories />} />
            </Routes>
          </AnimatePresence>
        </EasterEggProvider>
      </PointerProvider>
    </MotionConfig>
  )
}
