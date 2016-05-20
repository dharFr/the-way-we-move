const webpack = require('webpack')

let entries = [
  './src/polyfills/requestAnimationFrame.js',
  './src/polyfills/getUserMedia.js',
  './src/index.js'
]

if (process.env.NODE_ENV == 'production') {
  entries.push('./src/stats/ga.js')
}

module.exports = {
  entry: entries,
  output: {
    filename: 'dist/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js']
  }
}