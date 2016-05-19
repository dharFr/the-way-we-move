
import * as colors from './colors.js'
import Point from './point.js'
import AudioAnalyser from './audioAnalyser.js'

const canvas     = document.getElementById('canvas')
const ctx        = canvas.getContext('2d')
const NUM_POINTS = 100
const points     = []
const analyser = new AudioAnalyser

let lasttime = 0
function syncSize() {
  canvas.width = window.innerWidth;
  canvas.height = 300;
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
    angle    : Math.floor(Math.random() * 2 * Math.PI) ,
    speed    : 20 + Math.floor(Math.random() * 480), // pixels/s Keep the value between 20 and 500 or the scene condemned to stagnation
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

  // draw those points
  points.map((p,i) => {
    p.x = p.x + interval * p.speed / 1000 * Math.cos(p.angle)
    p.y = p.y + interval * p.speed / 1000 * Math.sin(p.angle)
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

  analyser.draw({
    ctx,
    color: palette.color(2),
    width: canvas.width,
    height: canvas.height
  })

  lasttime = timestamp
}

(function animloop(timestamp){
  requestAnimationFrame(animloop)
  drawScene(timestamp)
})()
