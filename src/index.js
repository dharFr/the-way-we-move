
import fullPageCanvas from 'full-page-canvas'
import * as colors from './colors.js'

const canvas = fullPageCanvas.mount()
const ctx = canvas.getContext('2d')

canvas.addEventListener('click', _ => colors.nextPalette())

function drawCircle({x, y, radius, color}) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawScene(timestamp) {

  const palette = colors.getPalette(timestamp)

  // Background
  ctx.fillStyle = colors.toCSS(palette, 0)
  ctx.fillRect(0,0,canvas.width,canvas.height)

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
}

(function animloop(timestamp){
  requestAnimationFrame(animloop)
  drawScene(timestamp)
})()
