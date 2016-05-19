import hexPalettes from './colors.json'
import hexRgb   from 'hex-rgb'
import ColorPalette from './colorPalette.js'


function getRamdomPalette() {
  const idx = Math.floor(Math.random() * hexPalettes.length)
  return new ColorPalette(idx, hexPalettes[idx])
}

function updateCurrentPalette(prev, next, progress) {
  current = new ColorPalette(null, prev.colors
    .map( (prevColor, i) =>
      computeCurrentColor(prevColor, next.colors[i], progress)
    ))
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

export function getPalette(timestamp) {
  if (prev == null) {
    next = getRamdomPalette()
    next.log('Picked initial color palette')
    togglePalettes(timestamp)
  }
  if (timestamp < waitUntil) {
    return current
  }
  else {
    waitUntil = 0
  }

  if (next == null) {
    next = getRamdomPalette()
    next.log('Transitioning to the next color palette')
    pickTime = timestamp
  }

  const progress = Math.round((timestamp - pickTime) / TRANSITION_TIME * 100) / 100
  if (progress >= 1) {
    togglePalettes(timestamp)
  }
  else if (progress > 0) {
    updateCurrentPalette(prev, next, progress)
  }

  return current
}

export function nextPalette() {
  next      = null
  pickTime  = null
  waitUntil = performance.now()
}