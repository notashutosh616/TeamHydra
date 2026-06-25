import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { content } from '../data/content'
import { fetchMusicUrl } from '../lib/settings'

// The campfire/music button.
//  • If an admin has set a background-music track in Supabase, it plays THAT
//    (looped) on click.
//  • Otherwise it falls back to a synthesized campfire crackle (Web Audio).
//  • Never autoplays — sound starts only after the user clicks.
export default function SoundToggle() {
  const [on, setOn] = useState(false)
  const [musicUrl, setMusicUrl] = useState(null)
  const audioRef = useRef(null)
  const ref = useRef({ ctx: null, master: null, crackleTimer: null, started: false })

  // Fetch the current track URL on load (no playback yet).
  useEffect(() => {
    let active = true
    fetchMusicUrl().then((u) => {
      if (active && u) setMusicUrl(u)
    })
    return () => {
      active = false
    }
  }, [])

  // ── Synthesized campfire (fallback) ──
  const buildEngine = () => {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    const ctx = new AC()
    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)

    const len = ctx.sampleRate * 2
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.2
    }
    const roar = ctx.createBufferSource()
    roar.buffer = buffer
    roar.loop = true
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 720
    const roarGain = ctx.createGain()
    roarGain.gain.value = 0.45
    roar.connect(lp).connect(roarGain).connect(master)
    roar.start()

    ref.current.ctx = ctx
    ref.current.master = master

    const crackle = () => {
      const t = ctx.currentTime
      const src = ctx.createBufferSource()
      const cl = Math.floor(ctx.sampleRate * 0.06)
      const cb = ctx.createBuffer(1, cl, ctx.sampleRate)
      const cd = cb.getChannelData(0)
      for (let i = 0; i < cl; i++) cd[i] = (Math.random() * 2 - 1) * (1 - i / cl)
      src.buffer = cb
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = 1200 + Math.random() * 2600
      const g = ctx.createGain()
      const peak = 0.12 + Math.random() * 0.22
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(peak, t + 0.005)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09)
      src.connect(bp).connect(g).connect(master)
      src.start(t)
      src.stop(t + 0.1)
      ref.current.crackleTimer = setTimeout(crackle, 90 + Math.random() * 480)
    }
    crackle()
    return ctx
  }

  const playSynth = async (next) => {
    const engine = ref.current
    if (next) {
      if (!engine.started) {
        buildEngine()
        engine.started = true
      }
      try {
        await engine.ctx?.resume()
      } catch {
        /* ignore */
      }
      engine.master?.gain.cancelScheduledValues(engine.ctx.currentTime)
      engine.master?.gain.linearRampToValueAtTime(0.5, engine.ctx.currentTime + 0.6)
    } else if (engine.ctx) {
      engine.master.gain.linearRampToValueAtTime(0, engine.ctx.currentTime + 0.4)
    }
  }

  // ── Uploaded track (preferred) ──
  const playFile = async (next) => {
    if (!audioRef.current) {
      const a = new Audio(musicUrl)
      a.loop = true
      a.volume = 0.5
      a.preload = 'auto'
      audioRef.current = a
    }
    if (next) {
      try {
        await audioRef.current.play()
      } catch {
        /* autoplay blocked — ignored; this only runs on user click anyway */
      }
    } else {
      audioRef.current.pause()
    }
  }

  const toggle = async () => {
    const next = !on
    setOn(next)
    if (musicUrl) await playFile(next)
    else await playSynth(next)
  }

  useEffect(() => {
    return () => {
      clearTimeout(ref.current.crackleTimer)
      ref.current.ctx?.close?.()
      audioRef.current?.pause()
    }
  }, [])

  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      aria-label={`${content.ui?.soundLabel ?? 'Campfire'} sound ${on ? 'on' : 'off'}`}
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full glass px-3.5 py-2.5 text-xs font-semibold text-ink shadow-glass transition-colors hover:text-ember sm:bottom-6 sm:right-6"
    >
      <span className="flex h-4 items-end gap-[2px]" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-ember"
            animate={on ? { height: [4, 14, 6, 12, 4] } : { height: 4 }}
            transition={on ? { duration: 0.9 + i * 0.15, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
          />
        ))}
      </span>
      <span className="hidden sm:inline">{content.ui?.soundLabel ?? 'Campfire'}</span>
    </button>
  )
}
