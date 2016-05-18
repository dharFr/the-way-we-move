import * as colors from './colors.js'

export default class Point {
  constructor({x, y, move: {angle, speed}, colorIdx}) {
    this.x         = x
    this.y         = y
    this.angle     = angle
    this.speed     = speed
    this.colorIdx  = colorIdx
  }

  // Not supported yet..?
  // static palette = null
  // static ctx = null

  static defineContext(context2d) {
    Point.ctx = context2d
  }

  static definePalette(palette) {
    Point.palette = palette
  }

  draw() {
    Point.ctx.beginPath();
    Point.ctx.arc(this.x, this.y, 4, 0, Math.PI*2, true);
    Point.ctx.closePath();
    Point.ctx.fillStyle = colors.toCSS(Point.palette, this.colorIdx);
    Point.ctx.fill();
  }
}