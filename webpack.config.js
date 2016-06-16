var webpack = require('webpack');

module.exports = {
  entry: {
    'router': './src/router.ts',
    'router.min': './src/router.ts'
  },
  output: {
    path: __dirname + "/dist",
    filename: '[name].js',
    library: 'powerbi-router',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
}