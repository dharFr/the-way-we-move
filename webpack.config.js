const webpack       = require('webpack')
const OfflinePlugin = require('offline-plugin')

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
  },
  plugins: [
    // ... other plugins
    // it always better if OfflinePlugin is the last plugin added
    new OfflinePlugin({
      AppCache: false,
      caches: {
        main: ['index.html', 'styles.css', 'dist/bundle.js']
      },
      externals: ['index.html', 'styles.css']
    })
  ]
}