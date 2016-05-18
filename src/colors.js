import hexPalettes from './colors.json'
import hexRgb   from 'hex-rgb'

const rgbPalettes = []

function getRamdomPalette() {
  const idx = Math.floor(Math.random() * hexPalettes.length)
  // Convert hex color to rbg color and cache the result
  if (!rgbPalettes[idx]) {
    rgbPalettes[idx] = hexPalettes[idx]
      .map(hex => hexRgb(hex))
  }
  const res = {
    idx     : idx,
    colors : rgbPalettes[idx]
  }
  return res
}

function logPalette(msg, palette) {
  let args = []
  msg = `${msg} #${palette.idx} `

  for (var i = 0; i < palette.colors.length; i++) {
    palette.colors[i]
    msg += '%c  '
    args.push(`background: ${toCSS(palette.colors, i)};`)
  }
  console.log(msg, ...args)
}

function computeCurrentPalette(prev, next, progress) {

  const colors = prev.map( (prevColor, i) => {
    const nextColor = next[i]
    return computeCurrentColor(prevColor, nextColor, progress)
  })
  return { colors }
}

function computeCurrentColor(prevColor, nextColor, progress) {
  const currentColor = prevColor.map( (v, i) => {
    return Math.floor(v + ((nextColor[i] - v) * progress))
  })
  return currentColor
}

function togglePalettes(timestamp) {
  prev      = next
  current   = prev
  next      = null
  pickTime  = null
  waitUntil = timestamp + WAIT_TIME
}

// Initialization code
const TRANSITION_TIME = 2 * 1000 // transition for 2 seconds from one palette to another
const WAIT_TIME = 10 * 1000 // Wait 10 seconds before switching between palettes
let current, prev, next
let pickTime
let waitUntil = 0

export function toCSS(colors, idx) {
  const c = colors[idx]
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}

export function getPalette(timestamp) {
  if (prev == null) {
    next = getRamdomPalette()
    logPalette(`Picked initial color palette`, next)
    togglePalettes(timestamp)
  }
  if (timestamp < waitUntil) {
    return current.colors
  }
  else {
    waitUntil = 0
  }

  if (next == null) {
    next = getRamdomPalette()
    logPalette(`>>> Transitioning to the next color palette`, next)
    pickTime = timestamp
  }

  const progress = Math.round((timestamp - pickTime) / TRANSITION_TIME * 100) / 100
  if (progress >= 1) {
    togglePalettes(timestamp)
    console.log(`<<< done`)
  }
  else if (progress > 0) {
    current = computeCurrentPalette(prev.colors, next.colors, progress)
  }

  return current.colors
}

export function nextPalette() {
  next      = null
  pickTime  = null
  waitUntil = performance.now()
}