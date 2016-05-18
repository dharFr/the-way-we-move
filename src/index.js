
import fullPageCanvas from 'full-page-canvas'
import * as colors from './colors.js'
import Point from './point.js'

const canvas = fullPageCanvas.mount()
const ctx = canvas.getContext('2d')
const NUM_POINTS = 100
const points = []

let lasttime = 0

canvas.addEventListener('click', _ => colors.nextPalette())

function drawCircle({x, y, radius, color}) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function createRandomPoint() {
  points.push(new Point({
    x        : Math.floor(Math.random() * canvas.width),
    y        : Math.floor(Math.random() * canvas.height),
    move     : {
      angle : Math.floor(Math.random() * 2 * Math.PI) ,
      speed : 20 + Math.floor(Math.random() * 480) // pixels/s Keep the value between 20 and 500 or the scene condemned to stagnation
    },
    colorIdx : Math.floor(Math.random() * 4) + 1 // color paletes are 5 colors. Pick an index between 1 and 4 so the 1st color is excluded (as it's used for scene background)
  }))
}

function drawScene(timestamp=performance.now()) {

  if (lasttime == 0) {
    lasttime = timestamp
  }
  const interval = timestamp - lasttime
  const palette = colors.getPalette(timestamp)
  Point.definePalette(palette)

  // Background
  ctx.fillStyle = colors.toCSS(palette, 0)
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // some shapes, just to see the colors
  const radius = 20
  for (var i = 1; i < palette.length; i++) {
    drawCircle({
      x: radius + 5,
      y: (2 * radius + 5) * i,
      radius,
      color: colors.toCSS(palette, i)
    })
  }

  // draw those points
  points.map((p,i) => {
    p.x = p.x + interval * p.speed / 1000 * Math.cos(p.angle)
    p.y = p.y + interval * p.speed / 1000 * Math.sin(p.angle)
    // console.log('>>> updated point to:', p.x, p.y)

    if ((p.x < 0 || p.x > canvas.width) || (p.y < 0 || p.y > canvas.height)) {
      // point is out of the scene. Remove it and create a new one
      // console.log('>>> out of the scene')
      points.splice(i, 1)
      createRandomPoint()
    }
    else {
      // console.log('>>> redrawing')
      p.draw()
    }
  })

  lasttime = timestamp
}

Point.defineContext(ctx)

// Generate some random points
for (let i = 0; i < NUM_POINTS; i++) {
  createRandomPoint()
}

(function animloop(timestamp){
  requestAnimationFrame(animloop)
  drawScene(timestamp)
})()
