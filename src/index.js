
import * as colors from './colors.js'
import Point from './point.js'
import AudioAnalyser from './audioAnalyser.js'
import controlPanel from './controlPanel.js'

const canvas          = document.getElementById('canvas')
const ctx             = canvas.getContext('2d')
const NUM_POINTS      = 100
const points          = []
const wfAnalyser      = new AudioAnalyser(1024)
const fbgAnalyser     = new AudioAnalyser()

let lasttime = 0
function syncSize() {
  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight
}
syncSize()

window.addEventListener('resize', syncSize, false)
canvas.addEventListener('click', _ => colors.nextPalette())

function generateRandomPoints(palette) {
  // Generate some random points
  for (let i = 0; i < NUM_POINTS; i++) {
    addRandomPoint(palette.randomColorIndex())
  }
}

function addRandomPoint(colorIdx) {
  points.push(new Point({
    x        : Math.floor(Math.random() * canvas.width),
    y        : Math.floor(Math.random() * canvas.height),
    radius   : 4,
    angle    : Math.floor(Math.random() * 2 * Math.PI),
    speed    : 0,
    colorIdx
  }))
}

function drawScene(timestamp=performance.now()) {

  if (lasttime == 0) {
    lasttime = timestamp
  }
  const interval = timestamp - lasttime
  const palette = colors.getPalette(timestamp)

  // Generate some random points at startup
  if (points.length === 0) {
    generateRandomPoints(palette)
  }

  // Background
  ctx.fillStyle = palette.background()
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  controlPanel.updatePalette(palette)

  const numbersFromFreq = fbgAnalyser.getNumbersFromAudioData({
    howMany : NUM_POINTS,
    type    : 'frequency'
  })

  const numbersFromWF = wfAnalyser.getNumbersFromAudioData({
    howMany : NUM_POINTS,
    type    : 'wave'
  })

  // draw those points
  points.map((p,i) => {
    let angleVariant = 0

    if (numbersFromWF.length) {
      // Something between 4 and 20, depending on the frequency data
      p.radius = 4 + Math.floor(numbersFromFreq[i] * 16)
    }

    if (numbersFromFreq.length) {
      // As `numbersFromWF` are mostly really close to 0.5 (in a quiet env), let's use
      // Math.min(1, Math.abs(value - 0.5) * 4)) instead of the raw value to get a better amplitude
      const value = Math.min(1, (Math.abs(numbersFromWF[i] - 0.5) * 4))
      // In pixels/s. Keep the value between 50 and 500 or the scene condemned to stagnation
      p.speed = 50 + Math.floor(value * 450)

      // Testing speed + angle variations but it doesn't look really good as it is...
      angleVariant = (numbersFromWF[i] - 0.5) * Math.PI
    }

    p.x = p.x + interval * p.speed / 1000 * Math.cos(p.angle + angleVariant)
    p.y = p.y + interval * p.speed / 1000 * Math.sin(p.angle + angleVariant)
    // console.log('>>> updated point to:', p.x, p.y)

    if ((p.x < 0 || p.x > canvas.width) || (p.y < 0 || p.y > canvas.height)) {
      // point is out of the scene. Remove it and create a new one
      // console.log('>>> out of the scene')
      points.splice(i, 1)
      addRandomPoint(palette.randomColorIndex())
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

  const {waveForm, frequencyBarGraph} = controlPanel.options()
  if (waveForm) {
    wfAnalyser.drawWaveform(drawParams)
  }

  if (frequencyBarGraph) {
    fbgAnalyser.drawFrequencyBarGraph(drawParams)
  }

  lasttime = timestamp
}

(function animloop(timestamp){
  requestAnimationFrame(animloop)
  drawScene(timestamp)
})()
