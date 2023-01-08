const path = require('path')
const webpack       = require('webpack')
const OfflinePlugin = require('@lcdp/offline-plugin')

let entries = [
  './src/js/index.js'
]

if (process.env.NODE_ENV == 'production') {
  entries.push('./src/js/stats/ga.js')
}

module.exports = {
  mode: 'development',
  entry: entries,
  devServer: {
    static: './dist',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js'
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
        main: ['index.html', 'styles.css', 'js/bundle.js']
      },
      externals: [
        'index.html', 'styles.css', 
        'images/icon-128x128.png', 'images/icon-144x144.png', 'images/icon-152x152.png', 'images/icon-192x192.png', 'images/icon-256x256.png'
      ]
    })
  ]
}

/* 
*/