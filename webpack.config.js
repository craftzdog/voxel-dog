const path = require('path')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  context: path.resolve(__dirname, 'client'),
  devtool: isProd ? 'source-map' : 'inline-source-map',
  entry: path.resolve(__dirname, 'src', 'index.ts'),
  mode: isProd ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build')
  },
  devServer: {
    contentBase: 'build',
    open: true
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  }
}
