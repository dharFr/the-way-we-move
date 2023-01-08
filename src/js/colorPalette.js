import { rgb } from 'wcag-contrast'
import hexRgb from 'hex-rgb'

function toFunctionalNotation(c) {
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}

// See https://mattdesl.svbtle.com/generative-art-with-nodejs-and-canvas#color-contrast_2
function getBestContrast (background, colors) {
  let bestContrastIdx = 0
  let bestContrast = 0
  colors.forEach((p, i) => {
    const ratio = rgb(background, p)
    if (ratio > bestContrast) {
      bestContrastIdx = i
      bestContrast = ratio
    }
  })
  return colors[bestContrastIdx]
}

export default class ColorPalette {

  constructor(index = null, colors) {
    this.index  = index
    // convert to rbg  if necessary so we can compute the values more easily
    this.colors = colors.map(c => Array.isArray(c) ? c : hexRgb(c, {format: 'array'}))

    this._background = this.colors[0]
    this._foreground = getBestContrast(this._background, this.colors.slice(1))
  }

  background() {
    return toFunctionalNotation(this._background)
  }

  foreground() {
    return toFunctionalNotation(this._foreground)
  }

  color(idx) {
    return toFunctionalNotation(this.colors[idx])
  }

  randomColorIndex() {
    // Pick an index between 1 and this.colors.length so the 1st color is
    // excluded (as it's used for scene background)
    return Math.floor(Math.random() * (this.colors.length - 1)) + 1
  }

  log(msg, ...args) {
    let output = (this.index != null) ? `#${this.index} ` : ``
    let colors = []
    colors = this.colors.map(c => {
      output += `%c  `
      return `background: ${toFunctionalNotation(c)};`
    })
    console.log(output, ...colors, msg, ...args)
  }
}