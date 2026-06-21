// Builds a compact India states TopoJSON with OFFICIAL boundaries
// (includes PoK + Aksai Chin as India) from udit-001/india-maps-data's
// 36 per-state GeoJSON files (pre-downloaded to /tmp/india_states by curl).
// Output: public/india-states.topo.json
//
// Run:  node scripts/build-india-map.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { topology } from 'topojson-server'
import { presimplify, simplify } from 'topojson-simplify'
import { feature, quantize, mergeArcs } from 'topojson-client'
import { geoMercator } from 'd3-geo'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/india-states.topo.json')
const DIR = '/tmp/india_states'
const MINWEIGHT = 0.0016 // higher = smaller/coarser outline
const QUANT = 1e4

const features = []
for (const file of readdirSync(DIR).filter((f) => f.endsWith('.geojson'))) {
  const gj = JSON.parse(readFileSync(`${DIR}/${file}`, 'utf8'))
  const fs = gj.type === 'FeatureCollection' ? gj.features : [gj]
  for (const f of fs) features.push({ type: 'Feature', properties: { st: file.replace('.geojson', '') }, geometry: f.geometry })
}
console.log('states merged:', features.length)

const fc = { type: 'FeatureCollection', features }

// Build a topology of all districts, then DISSOLVE districts of each state into
// one shape (removes internal district borders → clean state/UT outlines).
const dTopo = topology({ d: fc })
const byState = {}
for (const g of dTopo.objects.d.geometries) (byState[g.properties.st] ||= []).push(g)
const stateFeatures = Object.entries(byState).map(([st, gs]) => {
  const gj = feature(dTopo, mergeArcs(dTopo, gs))
  gj.properties = { st }
  return gj
})
console.log('states after dissolve:', stateFeatures.length)

let topo = topology({ states: { type: 'FeatureCollection', features: stateFeatures } })
topo = presimplify(topo)
topo = simplify(topo, MINWEIGHT)
topo = quantize(topo, QUANT)
writeFileSync(OUT, JSON.stringify(topo))

// ── report ────────────────────────────────────────────────────────────────
const geo = feature(topo, topo.objects.states)
let mxLat = -99, mnLat = 99, mxLon = -999, mnLon = 999
const walk = (c) => {
  if (typeof c[0] === 'number') {
    mxLon = Math.max(mxLon, c[0]); mnLon = Math.min(mnLon, c[0])
    mxLat = Math.max(mxLat, c[1]); mnLat = Math.min(mnLat, c[1])
  } else c.forEach(walk)
}
geo.features.forEach((f) => walk(f.geometry.coordinates))
console.log(`size: ${(JSON.stringify(topo).length / 1024).toFixed(0)} KB`)
console.log(`lat ${mnLat.toFixed(1)} -> ${mxLat.toFixed(1)}  lng ${mnLon.toFixed(1)} -> ${mxLon.toFixed(1)}`)
console.log(mxLat >= 36.5 ? 'OK: includes full north (PoK / Aksai Chin)' : 'WARN: north still truncated')

const W = 700, H = 860, M = 34
const fit = geoMercator().fitExtent([[M, M], [W - M, H - M]], geo)
const center = fit.invert([W / 2, H / 2]), scale = fit.scale()
const p = geoMercator().center(center).scale(scale).translate([W / 2, H / 2])
const cities = { Bhopal: [77.4126, 23.2599], Satna: [80.83, 24.58], Chhapra: [84.73, 25.78], Guwahati: [91.7362, 26.1445], Nagpur: [79.0882, 21.1458], Ghazipur: [83.5776, 25.588] }
for (const [n, c] of Object.entries(cities)) {
  const [x, y] = p(c)
  console.log(n.padEnd(9), 'x=' + x.toFixed(0).padStart(4), 'y=' + y.toFixed(0).padStart(4))
}
