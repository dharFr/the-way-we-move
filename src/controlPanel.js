const controls        = document.getElementById('controlPanel')
const toggleWFButton  = document.getElementById('toogleWaveform')
const toggleFBGButton = document.getElementById('toogleFrequencyBarGraph')
const numPointsRange  = document.getElementById('numPointsRange')
const numPointsOutput = document.getElementById('numPoints')
const options         = JSON.parse(localStorage.getItem('options')) || {
  waveForm          : false,
  frequencyBarGraph : false,
  numPoints         : 512
}
// Initial state
toggleWFButton.checked  = options.waveForm
toggleFBGButton.checked = options.frequencyBarGraph
numPointsRange.value    = options.numPoints
numPointsOutput.value   = options.numPoints

// Listen to changes
toggleWFButton.addEventListener('change', e => {
  options.waveForm = toggleWFButton.checked
  localStorage.setItem('options', JSON.stringify(options))
})

toggleFBGButton.addEventListener('change', e => {
  options.frequencyBarGraph = toggleFBGButton.checked
  localStorage.setItem('options', JSON.stringify(options))
})

numPointsRange.addEventListener('input', e => {
  options.numPoints = +(numPointsRange.value)
  numPointsOutput.value = options.numPoints
  console.log('options.numPoints changed to', options.numPoints)
  localStorage.setItem('options', JSON.stringify(options))
})

export default {
  options() {
    return options
  },

  updatePalette(palette) {
    if (controls.style.color !== palette.foreground()) {
      controls.style.background = palette.foreground()
      controls.style.color = palette.background()
    }
  }
}