// Mostly stolen from MDN doc
// See https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
export default class AudioAnalyser {

  static defineContext(canvas, context2d) {
    AudioAnalyser.canvas = canvas
    AudioAnalyser.ctx    = context2d
  }

  constructor() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    this.analyser = audioCtx.createAnalyser()
    this.source   = null

    navigator.mediaDevices.getUserMedia({audio:true}).then(stream => {
      this.source = audioCtx.createMediaStreamSource(stream)
      this.source.connect(this.analyser)
      this.analyser.fftSize = 2048
    })
  }

  draw({ctx, color, width, height}) {
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
}
