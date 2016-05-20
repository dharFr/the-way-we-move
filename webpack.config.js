const webpack = require('webpack')

module.exports = {
  entry: [
    './src/polyfills/requestAnimationFrame.js',
    './src/polyfills/getUserMedia.js',
    './src/index.js'
  ],
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