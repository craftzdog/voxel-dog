const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  context: path.resolve(__dirname, 'client'),
  devtool: isProd ? 'source-map' : 'inline-source-map',
  mode: isProd ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  devServer: {
    contentBase: 'build',
    open: true
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  },
  entry: {
    obj: path.resolve(__dirname, 'src', 'obj.ts'),
    pcss: path.resolve(__dirname, 'src', 'pcss.ts'),
    bake: path.resolve(__dirname, 'src', 'bake.ts')
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      filename: 'obj.html',
      chunks: ['obj'],
      viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
    }),
    new HtmlWebpackPlugin({
      filename: 'pcss.html',
      chunks: ['pcss'],
      viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
    }),
    new HtmlWebpackPlugin({
      filename: 'bake.html',
      chunks: ['bake'],
      viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
    })
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build')
  }
}
