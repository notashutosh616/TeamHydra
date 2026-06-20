// Generates nice-looking SVG placeholder media into public/assets/
// so the site looks great BEFORE you add real photos/videos.
// Run again any time with:  node scripts/gen-placeholders.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/assets')
mkdirSync(OUT, { recursive: true })

const INK = '#E8EAED'
const MUTED = '#94A3B8'

// Member accent gradients (emerald ↔ amber family) — one per person
const members = [
  { file: 'member1.svg', name: 'Ashutosh', nick: 'Dhongi', a: '#34D399', b: '#0EA5E9' },
  { file: 'member2.svg', name: 'Shivam', nick: 'Bihari', a: '#FBBF24', b: '#F97316' },
  { file: 'member3.svg', name: 'Sumit', nick: 'Bhabhora', a: '#34D399', b: '#A855F7' },
  { file: 'member4.svg', name: 'Devendra', nick: 'Dhote', a: '#FBBF24', b: '#34D399' },
  { file: 'member5.svg', name: 'Sujal', nick: 'Suzzi', a: '#F472B6', b: '#FBBF24' },
]

// Scatter of warm "firefly" dots for texture
function fireflies(w, h, n, seed = 1) {
  let s = seed
  const rnd = () => ((s = (s * 9301 + 49297) % 233280), s / 233280)
  let out = ''
  for (let i = 0; i < n; i++) {
    const x = (rnd() * w).toFixed(1)
    const y = (rnd() * h).toFixed(1)
    const r = (rnd() * 2.2 + 0.4).toFixed(1)
    const o = (rnd() * 0.5 + 0.15).toFixed(2)
    out += `<circle cx="${x}" cy="${y}" r="${r}" fill="#FBBF24" opacity="${o}"/>`
  }
  return out
}

function memberSVG({ name, nick, a, b }, i) {
  const w = 800
  const h = 1000
  const initial = name.charAt(0).toUpperCase()
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
  <defs>
    <radialGradient id="bg${i}" cx="35%" cy="28%" r="90%">
      <stop offset="0%" stop-color="${a}" stop-opacity="0.55"/>
      <stop offset="45%" stop-color="${b}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#0B0F19" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="ring${i}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="100%" stop-color="${b}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#0B0F19"/>
  <rect width="${w}" height="${h}" fill="url(#bg${i})"/>
  ${fireflies(w, h, 60, i + 3)}
  <circle cx="${w / 2}" cy="${h / 2 - 60}" r="190" fill="none" stroke="url(#ring${i})" stroke-width="3" opacity="0.55"/>
  <circle cx="${w / 2}" cy="${h / 2 - 60}" r="150" fill="rgba(255,255,255,0.05)"/>
  <text x="${w / 2}" y="${h / 2 - 60}" text-anchor="middle" dominant-baseline="central"
        font-family="'Space Grotesk', sans-serif" font-size="180" font-weight="700" fill="${INK}">${initial}</text>
  <text x="${w / 2}" y="${h - 230}" text-anchor="middle"
        font-family="'Space Grotesk', sans-serif" font-size="58" font-weight="600" fill="${INK}">${name}</text>
  <text x="${w / 2}" y="${h - 175}" text-anchor="middle"
        font-family="'Space Grotesk', sans-serif" font-size="34" font-weight="500" fill="${a}" letter-spacing="6">“${nick.toUpperCase()}”</text>
  <text x="${w / 2}" y="${h - 90}" text-anchor="middle"
        font-family="Inter, sans-serif" font-size="24" fill="${MUTED}">Drop your photo → public/assets/member${i + 1}.jpg</text>
</svg>`
}

// Abstract memory tiles
const memColors = [
  ['#FBBF24', '#F97316'],
  ['#34D399', '#0EA5E9'],
  ['#A855F7', '#34D399'],
  ['#F472B6', '#FBBF24'],
  ['#0EA5E9', '#34D399'],
  ['#FB7185', '#FBBF24'],
]

function memorySVG(i, { withPlay = false } = {}) {
  const w = 1200
  const h = 900
  const [a, b] = memColors[i % memColors.length]
  const blobs = `
    <circle cx="${200 + i * 60}" cy="300" r="260" fill="${a}" opacity="0.30"/>
    <circle cx="${950 - i * 40}" cy="640" r="300" fill="${b}" opacity="0.28"/>
    <circle cx="640" cy="180" r="180" fill="${a}" opacity="0.18"/>`
  const play = withPlay
    ? `<circle cx="${w / 2}" cy="${h / 2}" r="86" fill="rgba(11,15,25,0.55)" stroke="rgba(255,255,255,0.85)" stroke-width="3"/>
       <path d="M ${w / 2 - 28} ${h / 2 - 42} L ${w / 2 + 52} ${h / 2} L ${w / 2 - 28} ${h / 2 + 42} Z" fill="#FFFFFF"/>`
    : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
  <defs>
    <filter id="b${i}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="70"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="#0B0F19"/>
  <g filter="url(#b${i})">${blobs}</g>
  ${fireflies(w, h, 50, i + 11)}
  <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="22" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="2"/>
  ${play}
  <text x="${w / 2}" y="${withPlay ? h - 90 : h / 2}" text-anchor="middle" dominant-baseline="central"
        font-family="'Space Grotesk', sans-serif" font-size="46" font-weight="600" fill="${INK}" opacity="0.92">
    ${withPlay ? 'Sample clip' : 'Memory ' + (i + 1)}</text>
  <text x="${w / 2}" y="${withPlay ? h - 48 : h / 2 + 52}" text-anchor="middle"
        font-family="Inter, sans-serif" font-size="24" fill="${MUTED}">${withPlay ? 'Drop memory-clip.mp4 into public/assets/' : 'Drop memory' + (i + 1) + '.jpg into public/assets/'}</text>
</svg>`
}

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#34D399"/><stop offset="100%" stop-color="#FBBF24"/>
  </linearGradient></defs>
  <rect width="64" height="64" rx="16" fill="#0B0F19"/>
  <path d="M20 46 V26 a12 12 0 0 1 24 0 v6 a6 6 0 0 1-12 0 v-4"
        fill="none" stroke="url(#g)" stroke-width="5" stroke-linecap="round"/>
  <circle cx="20" cy="22" r="3.2" fill="#FBBF24"/>
  <circle cx="44" cy="22" r="3.2" fill="#34D399"/>
</svg>`

// ── write everything ──────────────────────────────────────────────────────
members.forEach((m, i) => writeFileSync(resolve(OUT, m.file), memberSVG(m, i)))
for (let i = 0; i < 9; i++) {
  writeFileSync(resolve(OUT, `memory${i + 1}.svg`), memorySVG(i, { withPlay: i === 2 }))
}
writeFileSync(resolve(__dirname, '../public/favicon.svg'), favicon)

writeFileSync(
  resolve(OUT, 'README.txt'),
  `TEAM HYDRA — assets folder
==========================

Drop your real photos & videos right here, then point to them in
src/data/content.js (paths always start with /assets/).

Members  → member1.jpg ... member5.jpg   (portrait photos look best, ~4:5)
Memories → memory1.jpg ... memory6.jpg   (any photos)
Video    → memory-clip.mp4               (any .mp4 clip)

The *.svg files here are just nice placeholders so the site looks good
before you add real media. Replace the paths in content.js as you go.
`,
)

console.log('✓ Placeholders generated in public/assets/')
