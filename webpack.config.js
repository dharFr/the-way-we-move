const webpack = require('webpack')

module.exports = {
 entry: './src/index.js',
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
 plugins: [
  new webpack.ProvidePlugin({
    'fetch'                 : 'imports?this=>global!exports?global.fetch!whatwg-fetch',
    'requestAnimationFrame' : 'imports?this=>global!exports?global.requestAnimationFrame!../polyfills/requestAnimationFrame.js'
  })
],
 resolve: {
   extensions: ['', '.js']
 },
 // debug: true,
 devtool: 'inline-source-map'
}