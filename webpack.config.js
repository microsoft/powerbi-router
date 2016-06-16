module.exports = {
  entry: {
    'router': './src/router.ts'
  },
  output: {
    path: __dirname + "/dist",
    filename: '[name].js',
    library: 'powerbi-router',
    libraryTarget: 'umd'
  },
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