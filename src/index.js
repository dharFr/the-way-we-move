import * as colors from './colors.js'
import Point from './point.js'
import AudioAnalyser from './audioAnalyser.js'
import controlPanel from './controlPanel.js'

// SW plugin
require('offline-plugin/runtime.js').install()

const canvas         = document.getElementById('canvas')
const video          = document.getElementById('video')
const themeMeta      = document.head.querySelector('meta[name="theme-color"]')
const backgroundMeta = document.head.querySelector('meta[name="background-color"]')
const ctx            = canvas.getContext('2d')
const points         = []
const wfAnalyser     = new AudioAnalyser(1024)
const fbgAnalyser    = new AudioAnalyser()

let lasttime = 0
let tracker = null
let lastTrackerData = null

function syncSize() {
  canvas.width  = video.width  = window.innerWidth
  canvas.height = video.height = window.innerHeight
}
syncSize()

window.addEventListener('resize', syncSize, false)
canvas.addEventListener('click', _ => colors.nextPalette())


function generateRandomPoints(numPoints, palette) {
  // Generate some random points
  for (let i = points.length; i < numPoints; i++) {
    addRandomPoint(palette.randomColorIndex())
  }
}

function addRandomPoint(colorIdx) {
  points.push(new Point({
    x        : Math.floor(Math.random() * canvas.width),
    y        : Math.floor(Math.random() * canvas.height),
    radius   : 4,
    angle    : Math.floor(Math.random() * 2 * Math.PI),
    speed    : 50, // Set a minimal speed so the point will move event if audioAnalyser doesn't work (e.g. getUserMedia() not supported)
    colorIdx
  }))
}

function initTracker() {
  // tracker is already initialized, skip this
  if (tracker != null) {
    return
  }

  // tracker is loaded asynchronously, may not be available on 1st calls
  if (typeof tracking === 'undefined') {
    return;
  }

  tracker = new tracking.ObjectTracker('face')
  tracker.setInitialScale(4)
  tracker.setStepSize(2)
  tracker.setEdgesDensity(0.1)
  tracking.track('#video', tracker, { camera: true })

  tracker.on('track', function(event) {
    lastTrackerData = event.data
  })
}

function drawScene(timestamp=performance.now()) {

  initTracker()

  if (lasttime == 0) {
    lasttime = timestamp
  }
  const interval = timestamp - lasttime
  const palette = colors.getPalette(timestamp)

  // Get options from control panel
  const {waveForm, frequencyBarGraph, numPoints} = controlPanel.options()

  // Generate some random points if missing
  if (points.length < numPoints) {
    generateRandomPoints(numPoints, palette)
  }
  // or remove a few if we have too many of them
  else if (numPoints < points.length) {
    points.splice(numPoints, points.length)
  }

  // Background
  ctx.fillStyle = palette.background()
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  themeMeta.content = palette.foreground()
  backgroundMeta.content = palette.background()

  controlPanel.updatePalette(palette)

  const numbersFromFreq = fbgAnalyser.getNumbersFromAudioData({
    howMany : numPoints,
    type    : 'frequency'
  })

  const numbersFromWF = wfAnalyser.getNumbersFromAudioData({
    howMany : numPoints,
    type    : 'wave'
  })

  // draw those points
  points.map((p,i) => {
    let angleVariant = 0

    if (numbersFromFreq.length) {
      // Something between 4 and 20, depending on the frequency data
      p.radius = 4 + Math.floor(numbersFromFreq[i] * 16)
    }

    if (numbersFromWF.length) {
      // As `numbersFromWF` are mostly really close to 0.5 (in a quiet env), let's use
      // Math.min(1, Math.abs(value - 0.5) * 10)) instead of the raw value to get a better amplitude
      const value = Math.min(1, (Math.abs(numbersFromWF[i] - 0.5) * 10))
      // In pixels/s. Keep the value between 50 and 600 or the scene condemned to stagnation
      p.speed = 50 + Math.floor(value * 550)

      // Testing speed + angle variations but it doesn't look really good as it is...
      // angleVariant = (numbersFromWF[i] - 0.5) * Math.PI
    }

    p.x = p.x + interval * p.speed / 1000 * Math.cos(p.angle + angleVariant)
    p.y = p.y + interval * p.speed / 1000 * Math.sin(p.angle + angleVariant)
    // console.log('>>> updated point to:', p.x, p.y)

    if ((p.x < 0 || p.x > canvas.width) || (p.y < 0 || p.y > canvas.height)) {
      // Remove point if it is out of the scene. A new one will be created
      points.splice(i, 1)
    }
    else {
      // console.log('>>> redrawing')
      p.draw(ctx, palette.color(p.colorIdx))
    }
  })

  const drawParams = {
    ctx,
    color: palette.foreground(),
    width: canvas.width,
    height: canvas.height
  }

  if (waveForm) {
    wfAnalyser.drawWaveform(drawParams)
  }

  if (frequencyBarGraph) {
    fbgAnalyser.drawFrequencyBarGraph(drawParams)
  }

  if (true && lastTrackerData && lastTrackerData.length) {

    lastTrackerData.forEach(function(rect) {
      ctx.strokeStyle = palette.foreground()
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
      ctx.font = '11px Helvetica'
      ctx.fillStyle = "#fff"
      ctx.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11)
      ctx.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22)
    })
  }

  lasttime = timestamp
}

(function animloop(timestamp){
  requestAnimationFrame(animloop)
  drawScene(timestamp)
})()
