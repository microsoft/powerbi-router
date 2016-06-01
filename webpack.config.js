module.exports = {  
  entry: './test/router.spec.ts',
  output: {
    path: __dirname + "/tmp",
    filename: 'router.spec.js'
  },
  externals: [
    {
      "route-recognizer": "RouteRecognizer"
    }
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  ts: {
    configFileName: "webpack.tsconfig.json"
  }
}