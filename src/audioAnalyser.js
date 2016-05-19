// Mostly stolen from MDN doc
// See https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
export default class AudioAnalyser {

  constructor(fftSize = 256) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    this.analyser = audioCtx.createAnalyser()
    this.source   = null

    navigator.mediaDevices.getUserMedia({audio:true}).then(stream => {
      this.source = audioCtx.createMediaStreamSource(stream)
      this.source.connect(this.analyser)
      this.analyser.fftSize = fftSize
    })
  }

  drawWaveform({ctx, color, width, height}) {
    if (this.source == null) {
      return;
    }

    const bufferLength = this.analyser.frequencyBinCount
    const dataArray    = new Uint8Array(bufferLength)

    this.analyser.getByteTimeDomainData(dataArray)

    ctx.lineWidth = 2
    ctx.strokeStyle = color

    ctx.beginPath()
    const sliceWidth = width * 1.0 / bufferLength
    let x = 0

    for(let i = 0; i < bufferLength; i++) {

      const v = dataArray[i] / 128.0
      const y = (v * height/2)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      x += sliceWidth
    }

    ctx.lineTo(width, height/2)
    ctx.stroke()
  }

  drawFrequencyBarGraph({ctx, color, width, height}) {
    if (this.source == null) {
      return;
    }

    const bufferLength = this.analyser.frequencyBinCount
    const dataArray    = new Uint8Array(bufferLength)

    this.analyser.getByteFrequencyData(dataArray)

    const barWidth = (width / bufferLength) * 2.5
    let barHeight
    let x = 0

    for(var i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i]

      ctx.fillStyle = color
      ctx.fillRect(x, height - barHeight / 2, barWidth, barHeight)

      x += barWidth + 1
    }
  }

  getNumbersFromAudioData({
    howMany = 256,
    type    = 'frequency'
  }) {

    if (this.source == null) {
      return []
    }

    const bufferLength = this.analyser.frequencyBinCount
    const dataArray    = new Uint8Array(bufferLength)

    switch(type) {
      case 'frequency':
        this.analyser.getByteFrequencyData(dataArray)
        break
      case 'wave':
        this.analyser.getByteTimeDomainData(dataArray)
        break
      default:
        throw new TypeError("Unexpected `type` parameter. `type` must be either 'frequency' or 'wave'")
        return
    }

    // As we have `bufferLength` number from the analyser and we want `howMany`
    // numbers as an output, we need to _normalize_ `dataArray` to reflect the
    // frequencies no matter how many numbers are requested.
    //
    const ratio = Math.round(bufferLength / howMany)

    const result = []
    let acc = -1

    for(let i = 0; i < bufferLength; i++) {
      const currentValue = dataArray[i] / 255

      if (ratio >= 1) {
        acc = (acc === -1) ? currentValue : (acc + currentValue) / 2
        if (i % ratio === 0) {
          result.push(acc)
          acc = -1
        }
      }
      else {
        // TODO
      }
    }
    // make sure we have `howMany` values
    if (ratio >= 1 && acc !== -1 && result.length < howMany) {
      result.push(acc)
    }
    return result
  }

  draw({ctx, color, width, height}) {
    if (this.source == null) {
      return;
    }

    this.drawWaveform({ctx, color, width, height})
    this.drawFrequencyBarGraph({ctx, color, width, height})
  }
}
