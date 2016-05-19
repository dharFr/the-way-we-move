import * as colors from './colors.js'

export default class Point {

  constructor({x, y, radius, angle, speed, colorIdx}) {
    this.x        = x
    this.y        = y
    this.radius   = radius
    this.angle    = angle
    this.speed    = speed
    this.colorIdx = colorIdx
  }

  draw(ctx, color) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
  }
}