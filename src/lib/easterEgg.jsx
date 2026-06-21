import { createContext, useContext, useRef, useState, useCallback } from 'react'
import { content } from '../data/content'

// Tracks Hydra-logo clicks. Five clicks → fire the secret ember burst.
const EasterEggContext = createContext(null)

const NEEDED = 5

export function EasterEggProvider({ children }) {
  const clicks = useRef(0)
  const timer = useRef(null)
  const [burst, setBurst] = useState(0) // bump to (re)trigger the burst
  const [progress, setProgress] = useState(0) // 0..NEEDED for subtle feedback

  const fire = useCallback(() => setBurst((b) => b + 1), [])

  const registerHydraClick = useCallback(() => {
    clicks.current += 1
    setProgress(clicks.current)

    // reset the streak if the user pauses too long between clicks
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      clicks.current = 0
      setProgress(0)
    }, 1600)

    if (clicks.current >= NEEDED) {
      clicks.current = 0
      setProgress(0)
      clearTimeout(timer.current)
      fire()
    }
  }, [fire])

  return (
    <EasterEggContext.Provider
      value={{
        registerHydraClick,
        fire,
        burst,
        progress,
        needed: NEEDED,
        message: content.ui?.easterEgg ?? 'Team Hydra Forever 🐍',
      }}
    >
      {children}
    </EasterEggContext.Provider>
  )
}

export function useEasterEgg() {
  return useContext(EasterEggContext)
}
